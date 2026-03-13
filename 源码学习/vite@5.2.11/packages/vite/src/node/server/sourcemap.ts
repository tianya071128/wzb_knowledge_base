import path from 'node:path'
import fsp from 'node:fs/promises'
import convertSourceMap from 'convert-source-map'
import type { ExistingRawSourceMap, SourceMap } from 'rollup'
import type { Logger } from '../logger'
import { blankReplacer, createDebugger } from '../utils'
import { cleanUrl } from '../../shared/utils'

const debug = createDebugger('vite:sourcemap', {
  onlyWhenFocused: true,
})

// Virtual modules should be prefixed with a null byte to avoid a
// false positive "missing source" warning. We also check for certain
// prefixes used for special handling in esbuildDepPlugin.
const virtualSourceRE = /^(?:dep:|browser-external:|virtual:)|\0/

interface SourceMapLike {
  sources: string[]
  sourcesContent?: (string | null)[]
  sourceRoot?: string
}

async function computeSourceRoute(map: SourceMapLike, file: string) {
  let sourceRoot: string | undefined
  try {
    // The source root is undefined for virtual modules and permission errors.
    sourceRoot = await fsp.realpath(
      path.resolve(path.dirname(file), map.sourceRoot || ''),
    )
  } catch {}
  return sourceRoot
}

export async function injectSourcesContent(
  map: SourceMapLike,
  file: string,
  logger: Logger,
): Promise<void> {
  let sourceRootPromise: Promise<string | undefined>

  const missingSources: string[] = []
  const sourcesContent = map.sourcesContent || []
  const sourcesContentPromises: Promise<void>[] = []
  for (let index = 0; index < map.sources.length; index++) {
    const sourcePath = map.sources[index]
    if (
      sourcesContent[index] == null &&
      sourcePath &&
      !virtualSourceRE.test(sourcePath)
    ) {
      sourcesContentPromises.push(
        (async () => {
          // inject content from source file when sourcesContent is null
          sourceRootPromise ??= computeSourceRoute(map, file)
          const sourceRoot = await sourceRootPromise
          let resolvedSourcePath = cleanUrl(decodeURI(sourcePath))
          if (sourceRoot) {
            resolvedSourcePath = path.resolve(sourceRoot, resolvedSourcePath)
          }

          sourcesContent[index] = await fsp
            .readFile(resolvedSourcePath, 'utf-8')
            .catch(() => {
              missingSources.push(resolvedSourcePath)
              return null
            })
        })(),
      )
    }
  }

  await Promise.all(sourcesContentPromises)

  map.sourcesContent = sourcesContent

  // Use this command…
  //    DEBUG="vite:sourcemap" vite build
  // …to log the missing sources.
  if (missingSources.length) {
    logger.warnOnce(`Sourcemap for "${file}" points to missing source files`)
    debug?.(`Missing sources:\n  ` + missingSources.join(`\n  `))
  }
}

export function genSourceMapUrl(map: SourceMap | string): string {
  if (typeof map !== 'string') {
    map = JSON.stringify(map)
  }
  return `data:application/json;base64,${Buffer.from(map).toString('base64')}`
}

export function getCodeWithSourcemap(
  type: 'js' | 'css',
  code: string,
  map: SourceMap,
): string {
  if (debug) {
    code += `\n/*${JSON.stringify(map, null, 2).replace(/\*\//g, '*\\/')}*/\n`
  }

  if (type === 'js') {
    code += `\n//# sourceMappingURL=${genSourceMapUrl(map)}`
  } else if (type === 'css') {
    code += `\n/*# sourceMappingURL=${genSourceMapUrl(map)} */`
  }

  return code
}

export function applySourcemapIgnoreList(
  map: ExistingRawSourceMap,
  sourcemapPath: string,
  sourcemapIgnoreList: (sourcePath: string, sourcemapPath: string) => boolean,
  logger?: Logger,
): void {
  let { x_google_ignoreList } = map
  if (x_google_ignoreList === undefined) {
    x_google_ignoreList = []
  }
  for (
    let sourcesIndex = 0;
    sourcesIndex < map.sources.length;
    ++sourcesIndex
  ) {
    const sourcePath = map.sources[sourcesIndex]
    if (!sourcePath) continue

    const ignoreList = sourcemapIgnoreList(
      path.isAbsolute(sourcePath)
        ? sourcePath
        : path.resolve(path.dirname(sourcemapPath), sourcePath),
      sourcemapPath,
    )
    if (logger && typeof ignoreList !== 'boolean') {
      logger.warn('sourcemapIgnoreList function must return a boolean.')
    }

    if (ignoreList && !x_google_ignoreList.includes(sourcesIndex)) {
      x_google_ignoreList.push(sourcesIndex)
    }
  }

  if (x_google_ignoreList.length > 0) {
    if (!map.x_google_ignoreList) map.x_google_ignoreList = x_google_ignoreList
  }
}

/**
 * 从给定的代码字符串中提取源映射。
 *
 * 此函数尝试从代码字符串本身或其对应的映射文件中提取源映射。
 * 如果代码字符串中包含源映射注释，则直接从注释中提取；
 * 否则，尝试根据文件路径找到映射文件，并从映射文件中提取源映射。
 *
 * @param code 代码字符串，可能包含源映射注释。
 * @param filePath 代码文件的路径，用于查找映射文件。
 * @returns 返回一个包含代码和源映射的对象，如果无法提取源映射则返回undefined。
 */
export async function extractSourcemapFromFile(
  code: string,
  filePath: string,
): Promise<{ code: string; map: SourceMap } | undefined> {
  // 尝试从代码字符串中直接提取源映射，如果失败则尝试从映射文件中提取
  const map = (
    convertSourceMap.fromSource(code) ||
    (await convertSourceMap.fromMapFileSource(
      code,
      createConvertSourceMapReadMap(filePath),
    ))
  )?.toObject()

  // 如果成功提取源映射，则返回处理后的代码和源映射对象
  if (map) {
    return {
      code: code.replace(convertSourceMap.mapFileCommentRegex, blankReplacer),
      map,
    }
  }
}

// 创建一个函数，用于读取指定文件路径的文件内容。
function createConvertSourceMapReadMap(originalFileName: string) {
  return (filename: string) => {
    return fsp.readFile(
      path.resolve(path.dirname(originalFileName), filename),
      'utf-8',
    )
  }
}
