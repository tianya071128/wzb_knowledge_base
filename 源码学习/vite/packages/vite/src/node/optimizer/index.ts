import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { performance } from 'node:perf_hooks'
import colors from 'picocolors'
import type { BuildContext, BuildOptions as EsbuildBuildOptions } from 'esbuild'
import esbuild, { build } from 'esbuild'
import { init, parse } from 'es-module-lexer'
import glob from 'fast-glob'
import { getDepOptimizationConfig } from '../config'
import type { ResolvedConfig } from '../config'
import {
  createDebugger,
  flattenId,
  getHash,
  isOptimizable,
  lookupFile,
  normalizeId,
  normalizePath,
  removeLeadingSlash,
  tryStatSync,
  unique,
} from '../utils'
import {
  defaultEsbuildSupported,
  transformWithEsbuild,
} from '../plugins/esbuild'
import { ESBUILD_MODULES_TARGET, METADATA_FILENAME } from '../constants'
import { isWindows } from '../../shared/utils'
import { esbuildCjsExternalPlugin, esbuildDepPlugin } from './esbuildDepPlugin'
import { scanImports } from './scan'
import { createOptimizeDepsIncludeResolver, expandGlobIds } from './resolve'
export {
  initDepsOptimizer,
  initDevSsrDepsOptimizer,
  getDepsOptimizer,
} from './optimizer'

const debug = createDebugger('vite:deps')

const jsExtensionRE = /\.js$/i
const jsMapExtensionRE = /\.js\.map$/i

export type ExportsData = {
  hasModuleSyntax: boolean
  // exported names (for `export { a as b }`, `b` is exported name) 导出名称（对于“export { a as b }”，“b”是导出名称）
  exports: readonly string[]
  // hint if the dep requires loading as jsx 提示 dep 是否需要加载为 jsx
  jsxLoader?: boolean
}

export interface DepsOptimizer {
  metadata: DepOptimizationMetadata
  scanProcessing?: Promise<void>
  registerMissingImport: (id: string, resolved: string) => OptimizedDepInfo
  run: () => void

  isOptimizedDepFile: (id: string) => boolean
  isOptimizedDepUrl: (url: string) => boolean
  getOptimizedDepId: (depInfo: OptimizedDepInfo) => string

  close: () => Promise<void>

  options: DepOptimizationOptions
}

export interface DepOptimizationConfig {
  /**
   * Force optimize listed dependencies (must be resolvable import paths,
   * cannot be globs).
   */
  include?: string[]
  /**
   * Do not optimize these dependencies (must be resolvable import paths,
   * cannot be globs).
   */
  exclude?: string[]
  /**
   * Forces ESM interop when importing these dependencies. Some legacy
   * packages advertise themselves as ESM but use `require` internally
   * @experimental
   */
  needsInterop?: string[]
  /**
   * Options to pass to esbuild during the dep scanning and optimization
   *
   * Certain options are omitted since changing them would not be compatible
   * with Vite's dep optimization.
   *
   * - `external` is also omitted, use Vite's `optimizeDeps.exclude` option
   * - `plugins` are merged with Vite's dep plugin
   *
   * https://esbuild.github.io/api
   */
  esbuildOptions?: Omit<
    EsbuildBuildOptions,
    | 'bundle'
    | 'entryPoints'
    | 'external'
    | 'write'
    | 'watch'
    | 'outdir'
    | 'outfile'
    | 'outbase'
    | 'outExtension'
    | 'metafile'
  >
  /**
   * List of file extensions that can be optimized. A corresponding esbuild 可以优化的文件扩展名列表。对应的esbuild
   * plugin must exist to handle the specific extension. 插件必须存在才能处理特定扩展
   *
   * By default, Vite can optimize `.mjs`, `.js`, `.ts`, and `.mts` files. This option 默认情况下，Vite可以优化`.mjs`、`.js`、`.ts`和`.mts`文件。这个选项
   * allows specifying additional extensions. 允许指定附加扩展名
   *
   * @experimental
   */
  extensions?: string[]
  /**
   * Deps optimization during build was removed in Vite 5.1. This option is
   * now redundant and will be removed in a future version. Switch to using
   * `optimizeDeps.noDiscovery` and an empty or undefined `optimizeDeps.include`.
   * true or 'dev' disables the optimizer, false or 'build' leaves it enabled.
   * @default 'build'
   * @deprecated
   * @experimental
   */
  disabled?: boolean | 'build' | 'dev'
  /**
   * Automatic dependency discovery. When `noDiscovery` is true, only dependencies
   * listed in `include` will be optimized. The scanner isn't run for cold start
   * in this case. CJS-only dependencies must be present in `include` during dev.
   * @default false
   * @experimental
   */
  noDiscovery?: boolean
  /**
   * When enabled, it will hold the first optimized deps results until all static
   * imports are crawled on cold start. This avoids the need for full-page reloads
   * when new dependencies are discovered and they trigger the generation of new
   * common chunks. If all dependencies are found by the scanner plus the explicitely
   * defined ones in `include`, it is better to disable this option to let the
   * browser process more requests in parallel.
   * @default true
   * @experimental
   */
  holdUntilCrawlEnd?: boolean
}

export type DepOptimizationOptions = DepOptimizationConfig & {
  /**
   * By default, Vite will crawl your `index.html` to detect dependencies that
   * need to be pre-bundled. If `build.rollupOptions.input` is specified, Vite
   * will crawl those entry points instead.
   *
   * If neither of these fit your needs, you can specify custom entries using
   * this option - the value should be a fast-glob pattern or array of patterns
   * (https://github.com/mrmlnc/fast-glob#basic-syntax) that are relative from
   * vite project root. This will overwrite default entries inference.
   */
  entries?: string | string[]
  /**
   * Force dep pre-optimization regardless of whether deps have changed.
   * @experimental
   */
  force?: boolean
}

export interface DepOptimizationResult {
  metadata: DepOptimizationMetadata
  /**
   * When doing a re-run, if there are newly discovered dependencies
   * the page reload will be delayed until the next rerun so we need
   * to be able to discard the result
   */
  commit: () => Promise<void>
  cancel: () => void
}

export interface OptimizedDepInfo {
  id: string
  file: string
  src?: string
  needsInterop?: boolean
  browserHash?: string
  fileHash?: string
  /**
   * During optimization, ids can still be resolved to their final location 在优化过程中，ids 仍然可以解析到它们的最终位置
   * but the bundles may not yet be saved to disk 但捆绑包可能尚未保存到磁盘
   */
  processing?: Promise<void>
  /**
   * ExportData cache, discovered deps will parse the src entry to get exports ExportData缓存，发现的deps将解析src条目以获取导出
   * data used both to define if interop is needed and when pre-bundling 数据用于定义是否需要互操作以及何时进行预捆绑
   */
  exportsData?: Promise<ExportsData>
}

export interface DepOptimizationMetadata {
  /**
   * The main hash is determined by user config and dependency lockfiles. 主要哈希由用户配置和依赖锁文件确定
   * This is checked on server startup to avoid unnecessary re-bundles. 在服务器启动时检查此项以避免不必要的重新捆绑
   */
  hash: string
  /**
   * This hash is determined by dependency lockfiles. 该哈希值由依赖锁文件确定
   * This is checked on server startup to avoid unnecessary re-bundles. 在服务器启动时检查此项以避免不必要的重新捆绑
   */
  lockfileHash: string
  /**
   * This hash is determined by user config. 该哈希值由用户配置决定
   * This is checked on server startup to avoid unnecessary re-bundles. 在服务器启动时检查此项以避免不必要的重新捆绑
   */
  configHash: string
  /**
   * The browser hash is determined by the main hash plus additional dependencies 浏览器哈希由主哈希加上附加依赖项确定
   * discovered at runtime. This is used to invalidate browser requests to 运行时发现的。这用于使浏览器请求无效
   * optimized deps. 优化依赖
   */
  browserHash: string
  /**
   * Metadata for each already optimized dependency 每个已优化依赖项的元数据
   */
  optimized: Record<string, OptimizedDepInfo>
  /**
   * Metadata for non-entry optimized chunks and dynamic imports 非条目优化块和动态导入的元数据
   */
  chunks: Record<string, OptimizedDepInfo>
  /**
   * Metadata for each newly discovered dependency after processing 处理后每个新发现的依赖项的元数据
   */
  discovered: Record<string, OptimizedDepInfo>
  /**
   * OptimizedDepInfo list OptimizedDepInfo 列表
   */
  depInfoList: OptimizedDepInfo[]
}

/**
 * Scan and optimize dependencies within a project.
 * Used by Vite CLI when running `vite optimize`.
 */
export async function optimizeDeps(
  config: ResolvedConfig,
  force = config.optimizeDeps.force,
  asCommand = false,
): Promise<DepOptimizationMetadata> {
  const log = asCommand ? config.logger.info : debug
  const ssr = false

  const cachedMetadata = await loadCachedDepOptimizationMetadata(
    config,
    ssr,
    force,
    asCommand,
  )
  if (cachedMetadata) {
    return cachedMetadata
  }

  const deps = await discoverProjectDependencies(config).result

  const depsString = depsLogString(Object.keys(deps))
  log?.(colors.green(`Optimizing dependencies:\n  ${depsString}`))

  await addManuallyIncludedOptimizeDeps(deps, config, ssr)

  const depsInfo = toDiscoveredDependencies(config, deps, ssr)

  const result = await runOptimizeDeps(config, depsInfo, ssr).result

  await result.commit()

  return result.metadata
}

export async function optimizeServerSsrDeps(
  config: ResolvedConfig,
): Promise<DepOptimizationMetadata> {
  const ssr = true
  const cachedMetadata = await loadCachedDepOptimizationMetadata(
    config,
    ssr,
    config.optimizeDeps.force,
    false,
  )
  if (cachedMetadata) {
    return cachedMetadata
  }

  const deps: Record<string, string> = {}

  await addManuallyIncludedOptimizeDeps(deps, config, ssr)

  const depsInfo = toDiscoveredDependencies(config, deps, ssr)

  const result = await runOptimizeDeps(config, depsInfo, ssr).result

  await result.commit()

  return result.metadata
}

// 初始化依赖优化元数据
export function initDepsOptimizerMetadata(
  config: ResolvedConfig,
  ssr: boolean,
  timestamp?: string,
): DepOptimizationMetadata {
  const { lockfileHash, configHash, hash } = getDepHash(config, ssr)
  return {
    hash,
    lockfileHash,
    configHash,
    browserHash: getOptimizedBrowserHash(hash, {}, timestamp),
    optimized: {},
    chunks: {},
    discovered: {},
    depInfoList: [],
  }
}

// 向给定的依赖优化元数据中添加优化的依赖信息。
export function addOptimizedDepInfo(
  metadata: DepOptimizationMetadata,
  type: 'optimized' | 'discovered' | 'chunks',
  depInfo: OptimizedDepInfo,
): OptimizedDepInfo {
  // 将depInfo添加到指定类型的依赖信息中，并更新依赖信息列表
  metadata[type][depInfo.id] = depInfo
  metadata.depInfoList.push(depInfo)
  return depInfo
}

let firstLoadCachedDepOptimizationMetadata = true

/**
 * 加载缓存的依赖优化元数据。
 * Creates the initial dep optimization metadata, loading it from the deps cache 创建初始 dep 优化元数据，从 deps 缓存加载它
 * if it exists and pre-bundling isn't forced 如果存在并且不强制预捆绑
 */
export async function loadCachedDepOptimizationMetadata(
  config: ResolvedConfig,
  ssr: boolean,
  force = config.optimizeDeps.force, // 设置为 true 可以强制依赖预构建，而忽略之前已经缓存过的、已经优化过的依赖。
  asCommand = false,
): Promise<DepOptimizationMetadata | undefined> {
  const log = asCommand ? config.logger.info : debug

  // 删除陈旧的缓存临时目录，有效期为 1 天，一个构建期间只需要执行一次
  if (firstLoadCachedDepOptimizationMetadata) {
    firstLoadCachedDepOptimizationMetadata = false
    // Fire up a clean up of stale processing deps dirs if older process exited early 如果旧进程提前退出，则启动对过时处理部门目录的清理
    setTimeout(() => cleanupDepsCacheStaleDirs(config), 0)
  }

  // 获取依赖预构建的缓存目录: 'D:/学习/wzb_knowledge_base/源码学习/vite/playground/vue/node_modules/.vite/deps'
  const depsCacheDir = getDepsCacheDir(config, ssr)

  // force：强制依赖预构建，忽略缓存
  if (!force) {
    let cachedMetadata: DepOptimizationMetadata | undefined
    try {
      // 如果预构建元信息已经缓存到 'D:\\学习\\wzb_knowledge_base\\源码学习\\vite\\playground\\vue\\node_modules\\.vite\\deps\\_metadata.json' 文件中的话, 那么读取缓存
      const cachedMetadataPath = path.join(depsCacheDir, METADATA_FILENAME)
      cachedMetadata = parseDepsOptimizerMetadata(
        await fsp.readFile(cachedMetadataPath, 'utf-8'),
        depsCacheDir,
      )
    } catch (e) {}
    // hash is consistent, no need to re-bundle hash一致，无需重新捆绑
    if (cachedMetadata) {
      if (cachedMetadata.lockfileHash !== getLockfileHash(config, ssr)) {
        config.logger.info(
          'Re-optimizing dependencies because lockfile has changed', // 由于锁文件已更改，因此重新优化依赖项
        )
      } else if (cachedMetadata.configHash !== getConfigHash(config, ssr)) {
        config.logger.info(
          'Re-optimizing dependencies because vite config has changed', // 由于 vite 配置发生变化，重新优化依赖
        )
      } else {
        log?.('Hash is consistent. Skipping. Use --force to override.') // 哈希值是一致的。跳绳。使用 --force 覆盖
        // Nothing to commit or cancel as we are using the cache, we only 当我们使用缓存时，无需提交或取消任何内容，我们只需
        // need to resolve the processing promise so requests can move on 需要解决处理承诺，以便请求可以继续进行
        return cachedMetadata
      }
    }
  } else {
    config.logger.info('Forced re-optimization of dependencies') // 强制重新优化依赖
  }

  // Start with a fresh cache 从新的缓存开始
  debug?.(colors.green(`removing old cache dir ${depsCacheDir}`))
  await fsp.rm(depsCacheDir, { recursive: true, force: true })
}

/**
 * 依赖预构建：扫描入口文件，返回操作对象：取消扫描操作、Promise 的依赖信息
 *
 * Initial optimizeDeps at server start. Perform a fast scan using esbuild to 服务器启动时初始optimizeDeps。使用 esbuild 执行快速扫描
 * find deps to pre-bundle and include user hard-coded dependencies 查找要预捆绑的 deps 并包含用户硬编码的依赖项
 */
export function discoverProjectDependencies(config: ResolvedConfig): {
  cancel: () => Promise<void>
  result: Promise<Record<string, string>>
} {
  /**
   * 依赖预构建：扫描入口文件，返回操作对象：取消扫描操作、Promise 的依赖信息
   *  1. 计算和解析入口文件集合：["D:/学习/wzb_knowledge_base/源码学习/vite/playground/vue/index.html"]
   *  2. 借助 esbuild 处理依赖预构建(会将扫描到的依赖生成到 deps 变量中)
   */
  const { cancel, result } = scanImports(config)

  // 在 scanImports 方法基础上再封装一层，对 missing(导入了依赖, 但没有安装依赖) 进行处理，只返回 deps
  return {
    cancel,
    result: result.then(({ deps, missing }) => {
      const missingIds = Object.keys(missing)
      if (missingIds.length) {
        // 导入了以下依赖项但无法解决 ... 它们安装了吗？
        throw new Error(
          `The following dependencies are imported but could not be resolved:\n\n  ${missingIds
            .map(
              (id) =>
                `${colors.cyan(id)} ${colors.white(
                  colors.dim(`(imported by ${missing[id]})`),
                )}`,
            )
            .join(`\n  `)}\n\nAre they installed?`,
        )
      }

      return deps
    }),
  }
}

/**
 * 将依赖信息转换为发现的依赖对象集合。
 * @param config 配置对象，包含解析后的配置信息。
 * @param deps 一个键为依赖id，值为依赖源路径的对象。
 * @param ssr 布尔值，指示是否为服务器端渲染模式。
 * @param timestamp 可选字符串，用于指定一个时间戳，影响依赖的哈希值计算。
 * @returns 返回一个记录对象，键是依赖id，值是优化后的依赖信息对象。
 */
export function toDiscoveredDependencies(
  config: ResolvedConfig,
  deps: Record<string, string>,
  ssr: boolean,
  timestamp?: string,
): Record<string, OptimizedDepInfo> {
  // 获取浏览器哈希值
  const browserHash = getOptimizedBrowserHash(
    getDepHash(config, ssr).hash,
    deps,
    timestamp,
  )
  const discovered: Record<string, OptimizedDepInfo> = {}
  for (const id in deps) {
    const src = deps[id]
    discovered[id] = {
      id,
      file: getOptimizedDepPath(id, config, ssr), // 获取优化后的依赖路径。
      src,
      browserHash: browserHash, // 浏览器哈希值
      exportsData: extractExportsData(src, config, ssr),
    }
  }
  return discovered
}

export function depsLogString(qualifiedIds: string[]): string {
  return colors.yellow(qualifiedIds.join(`, `))
}

/**
 * Internally, Vite uses this function to prepare a optimizeDeps run. When Vite starts, we can get 在内部，Vite使用此功能来准备运行优化的EPP。当Vite开始时，我们可以得到
 * the metadata and start the server without waiting for the optimizeDeps processing to be completed 元数据并启动服务器，而无需等待“优化EPP”处理完成
 */
/**
 * 运行构建优化依赖项：
 *  1. 为本次构建生成一个唯一路径 - "D:/低代码/project/wzb/源码学习/vite/playground/vue/node_modules/.vite/deps_temp_30ccde96"
 *  2. 初始化依赖优化元数据 DepOptimizationMetadata
 *  3. 准备 esbuild 优化运行的配置和环境，并运行 esbuild.context 执行进行构建依赖, 并输出到指定目录(后台处理)
 *        --> 例如输出到：D:/低代码/project/wzb/源码学习/vite/playground/vue/node_modules/.vite/deps_temp_51f3a59e
 *  4. 处理 esbuild 构建后的处置
 *      -> 遍历发现的依赖信息, 添加到 metadata.optimized 中
 *      -> 遍历构建生成的所有文件，将生成的 chunks 文件导入其中 metadata.chunks 中
 *  5. 返回一个对象：包含一个取消函数和一个结果Promise，该Promise解析为依赖项优化结果。
 */
export function runOptimizeDeps(
  resolvedConfig: ResolvedConfig,
  depsInfo: Record<string, OptimizedDepInfo>,
  ssr: boolean,
): {
  cancel: () => Promise<void>
  result: Promise<DepOptimizationResult>
} {
  const optimizerContext = { cancelled: false }

  const config: ResolvedConfig = {
    ...resolvedConfig,
    command: 'build',
  }

  // 获取依赖预构建的缓存路径 - D:/低代码/project/wzb/源码学习/vite/playground/vue/node_modules/.vite/deps
  const depsCacheDir = getDepsCacheDir(resolvedConfig, ssr)
  // 构建并返回处理依赖项缓存目录的路径。 - "D:/低代码/project/wzb/源码学习/vite/playground/vue/node_modules/.vite/deps_temp_30ccde96"
  const processingCacheDir = getProcessingDepsCacheDir(resolvedConfig, ssr)

  // Create a temporary directory so we don't need to delete optimized deps 创建一个临时目录，因此我们不需要删除优化的 deps
  // until they have been processed. This also avoids leaving the deps cache 直到处理为止。这也避免了离开 deps 缓存
  // directory in a corrupted state if there is an error 在损坏状态下的目录如果存在错误
  fs.mkdirSync(processingCacheDir, { recursive: true }) // 创建缓存目录

  // a hint for Node.js node.js的提示
  // all files in the cache directory should be recognized as ES modules 缓存目录中的所有文件应识别为ES模块
  debug?.(colors.green(`creating package.json in ${processingCacheDir}`))
  // 给缓存目录创建一个 package.json 文件, 并且 type: 'module' 标识为 ES 模块
  fs.writeFileSync(
    path.resolve(processingCacheDir, 'package.json'),
    `{\n  "type": "module"\n}\n`,
  )

  // 初始化依赖优化元数据
  const metadata = initDepsOptimizerMetadata(config, ssr)

  // 计算出该次的浏览器哈希值
  metadata.browserHash = getOptimizedBrowserHash(
    metadata.hash,
    depsFromOptimizedDepInfo(depsInfo),
  )

  // We prebundle dependencies with esbuild and cache them, but there is no need 我们使用Esbuild并缓存它们，但没有必要
  // to wait here. Code that needs to access the cached deps needs to await 在这里等待。需要访问缓存的DEP的代码需要等待
  // the optimizedDepInfo.processing promise for each dep 每个dep的优化DepInfo.prrocessing承诺

  // 依赖的 ids
  const qualifiedIds = Object.keys(depsInfo)
  let cleaned = false // 是否清空标志
  let committed = false
  // 后置处理构建生成的缓存文件夹
  const cleanUp = () => {
    // If commit was already called, ignore the clean up even if a cancel was requested 如果已经调用了commit，则忽略清理，即使请求了取消
    // This minimizes the chances of leaving the deps cache in a corrupted state 这将使deps缓存处于损坏状态的可能性降至最低
    if (!cleaned && !committed) {
      cleaned = true
      // No need to wait, we can clean up in the background because temp folders 无需等待，我们可以在后台清理，因为临时文件夹
      // are unique per run 每次运行都是唯一的
      debug?.(colors.green(`removing cache dir ${processingCacheDir}`)) // 删除高速缓存
      try {
        // When exiting the process, `fsp.rm` may not take effect, so we use `fs.rmSync` 退出过程时，`fsp.rm`可能不会生效，因此我们使用`fs.rmsync`
        fs.rmSync(processingCacheDir, { recursive: true, force: true })
      } catch (error) {
        // Ignore errors
      }
    }
  }

  // 成功构建后的结果
  const successfulResult: DepOptimizationResult = {
    // 优化元数据
    metadata,
    // 取消方法
    cancel: cleanUp,

    commit: async () => {
      if (cleaned) {
        throw new Error(
          'Can not commit a Deps Optimization run as it was cancelled', // 由于被取消时无法提交DEPS优化运行
        )
      }
      // Ignore clean up requests after this point so the temp folder isn't deleted before 此后忽略清理请求，因此临时文件夹之前未删除
      // we finish commiting the new deps cache files to the deps folder 我们完成将新的DEP CACHE文件发布到DEPS文件夹
      committed = true

      // Write metadata file, then commit the processing folder to the global deps cache 写入元数据文件，然后将处理文件夹提交到全局 deps 缓存
      // Rewire the file paths from the temporary processing dir to the final deps cache dir 将文件路径从临时处理目录重新连接到最终 deps 缓存目录
      const dataPath = path.join(processingCacheDir, METADATA_FILENAME)
      debug?.(
        colors.green(`creating ${METADATA_FILENAME} in ${processingCacheDir}`),
      )
      fs.writeFileSync(
        dataPath,
        stringifyDepsOptimizerMetadata(metadata, depsCacheDir),
      )

      // In order to minimize the time where the deps folder isn't in a consistent state,
      // we first rename the old depsCacheDir to a temporary path, then we rename the
      // new processing cache dir to the depsCacheDir. In systems where doing so in sync
      // is safe, we do an atomic operation (at least for this thread). For Windows, we
      // found there are cases where the rename operation may finish before it's done
      // so we do a graceful rename checking that the folder has been properly renamed.
      // We found that the rename-rename (then delete the old folder in the background)
      // is safer than a delete-rename operation.
      const temporaryPath = depsCacheDir + getTempSuffix()
      const depsCacheDirPresent = fs.existsSync(depsCacheDir)
      if (isWindows) {
        if (depsCacheDirPresent) {
          debug?.(colors.green(`renaming ${depsCacheDir} to ${temporaryPath}`))
          await safeRename(depsCacheDir, temporaryPath)
        }
        debug?.(
          colors.green(`renaming ${processingCacheDir} to ${depsCacheDir}`),
        )
        await safeRename(processingCacheDir, depsCacheDir)
      } else {
        if (depsCacheDirPresent) {
          debug?.(colors.green(`renaming ${depsCacheDir} to ${temporaryPath}`))
          fs.renameSync(depsCacheDir, temporaryPath)
        }
        debug?.(
          colors.green(`renaming ${processingCacheDir} to ${depsCacheDir}`),
        )
        fs.renameSync(processingCacheDir, depsCacheDir)
      }

      // Delete temporary path in the background
      if (depsCacheDirPresent) {
        debug?.(colors.green(`removing cache temp dir ${temporaryPath}`))
        fsp.rm(temporaryPath, { recursive: true, force: true })
      }
    },
  }

  if (!qualifiedIds.length) {
    // No deps to optimize, we still commit the processing cache dir to remove 无需优化的dep，我们仍然提交处理高速缓存以删除
    // the previous optimized deps if they exist, and let the next server start 以前的优化DEP（如果存在），然后让下一个服务器启动
    // skip the scanner step if the lockfile hasn't changed 如果Lockfile没有更改，请跳过扫描仪步骤
    return {
      cancel: async () => cleanUp(),
      result: Promise.resolve(successfulResult),
    }
  }

  // 空的结果 -- 当没有构建或构建异常时的兼容处理
  const cancelledResult: DepOptimizationResult = {
    metadata,
    commit: async () => cleanUp(),
    cancel: cleanUp,
  }

  const start = performance.now() // 开始时间

  // 准备 esbuild 优化运行的配置和环境，并运行 esbuild.context 执行进行构建依赖, 并输出到指定目录(后台处理)
  // 例如输出到：D:/低代码/project/wzb/源码学习/vite/playground/vue/node_modules/.vite/deps_temp_51f3a59e
  const preparedRun = prepareEsbuildOptimizerRun(
    resolvedConfig,
    depsInfo,
    ssr,
    processingCacheDir,
    optimizerContext,
  )

  // 处理 esbuild 构建后的处置
  // 遍历发现的依赖信息, 添加到 metadata.optimized 中
  // 遍历构建生成的所有文件，将生成的 chunks 文件导入其中 metadata.chunks 中
  const runResult = preparedRun.then(({ context, idToExports }) => {
    function disposeContext() {
      return context?.dispose().catch((e) => {
        config.logger.error('Failed to dispose esbuild context', { error: e }) // 无法处置 esbuild 上下文
      })
    }
    // 没有 esbuil 上下文，或者过程中已被取消，则提示
    if (!context || optimizerContext.cancelled) {
      disposeContext()
      return cancelledResult
    }

    return context
      .rebuild()
      .then((result) => {
        // 走到这一步的时候, 应该是已经通过 esbuild 构建了依赖，输出到了指定目录下

        const meta = result.metafile! // 构建后的文件结果

        // the paths in `meta.outputs` are relative to `process.cwd()` `meta.outputs` 中的路径是相对于 `process.cwd()` 的
        // 缓存目录输出路径：node_modules\\.vite\\deps_temp_ffa7d72f
        const processingCacheDirOutputPath = path.relative(
          process.cwd(),
          processingCacheDir,
        )

        /** 遍历发现的依赖信息, 添加到 metadata.optimized 中 */
        for (const id in depsInfo) {
          // 获取到依赖对应的构建输出
          const output = esbuildOutputFromId(
            meta.outputs,
            id,
            processingCacheDir,
          )

          // 依赖信息
          const { exportsData, ...info } = depsInfo[id]
          addOptimizedDepInfo(metadata, 'optimized', {
            ...info,
            // We only need to hash the output.imports in to check for stability, but adding the hash 我们只需要哈希输出.imports来检查稳定性，但添加哈希
            // and file path gives us a unique hash that may be useful for other things in the future 和文件路径为我们提供了一个独特的哈希，这可能对其他事物有用
            fileHash: getHash(
              metadata.hash +
                depsInfo[id].file +
                JSON.stringify(output.imports),
            ),
            browserHash: metadata.browserHash,
            // After bundling we have more information and can warn the user about legacy packages 捆绑后，我们有更多信息，可以警告用户有关旧软件包的信息
            // that require manual configuration 需要手动配置
            needsInterop: needsInterop(
              config,
              ssr,
              id,
              idToExports[id],
              output,
            ),
          })
        }

        // 遍历构建生成的所有文件，将生成的 chunks 文件导入其中 metadata.chunks 中
        for (const o of Object.keys(meta.outputs)) {
          // 不是 .map 文件
          if (!jsMapExtensionRE.test(o)) {
            const id = path
              .relative(processingCacheDirOutputPath, o)
              .replace(jsExtensionRE, '')
            const file = getOptimizedDepPath(id, resolvedConfig, ssr) // 获取依赖完整路径: "D:/低代码/project/wzb/源码学习/vite/playground/vue/node_modules/.vite/deps/eslint.js"
            // 如果不是属于依赖的直接构建输出文件，例如：eslint -> eslint.js
            // 而是生成的一份通过代码分割生成的共享的代码，一般为 chunk-xx.js
            if (
              !findOptimizedDepInfoInRecord(
                metadata.optimized,
                (depInfo) => depInfo.file === file,
              )
            ) {
              // 则添加到 metadata.chunks 中
              addOptimizedDepInfo(metadata, 'chunks', {
                id,
                file,
                needsInterop: false,
                browserHash: metadata.browserHash,
              })
            }
          }
        }

        debug?.(
          `Dependencies bundled in ${(performance.now() - start).toFixed(2)}ms`, // 依赖项捆绑在一起 ...ms
        )

        // 返回成功结果
        return successfulResult
      })

      .catch((e) => {
        if (e.errors && e.message.includes('The build was canceled')) {
          // esbuild logs an error when cancelling, but this is expected so Esbuild在取消时会记录一个错误，但这是可以预期的
          // return an empty result instead 返回空结果
          return cancelledResult
        }
        throw e
      })
      .finally(() => {
        return disposeContext()
      })
  })

  // 错误处置
  runResult.catch(() => {
    cleanUp()
  })

  return {
    // 取消方法
    async cancel() {
      optimizerContext.cancelled = true // 取消标志
      const { context } = await preparedRun // 等待 esbuild.context 上下文
      await context?.cancel() // 通知 esbuild 取消构建
      cleanUp()
    },
    // 结果：Promise
    result: runResult,
  }
}

/**
 * 准备 esbuild 优化运行的配置和环境，并运行 esbuild.context 执行进行构建依赖, 并输出到指定目录(后台处理)，例如：D:/低代码/project/wzb/源码学习/vite/playground/vue/node_modules/.vite/deps_temp_51f3a59e
 *
 * 该函数主要负责配置和初始化 esbuild 的构建环境，为指定的依赖信息进行构建准备，包括：
 * - 配置 esbuild 构建选项；
 * - 处理和转换依赖信息；
 * - 初始化构建上下文。
 *
 * @param resolvedConfig 已解析的配置对象，包含了项目的配置细节。
 * @param depsInfo 依赖信息的对象，键为依赖的 id，值为包含依赖源和导出信息的对象。
 * @param ssr 是否为服务器端渲染模式。
 * @param processingCacheDir 处理中的缓存目录路径。
 * @param optimizerContext 优化器上下文，包含了取消标志。
 * @returns 返回一个 Promise，解析为一个对象，可选地包含了构建上下文和 id 到导出数据的映射。
 */
async function prepareEsbuildOptimizerRun(
  resolvedConfig: ResolvedConfig,
  depsInfo: Record<string, OptimizedDepInfo>,
  ssr: boolean,
  processingCacheDir: string,
  optimizerContext: { cancelled: boolean },
): Promise<{
  context?: BuildContext
  idToExports: Record<string, ExportsData>
}> {
  // 配置 esbuild 构建命令为 'build'
  const config: ResolvedConfig = {
    ...resolvedConfig,
    command: 'build',
  }

  // esbuild generates nested directory output with lowest common ancestor base esbuild 生成具有最低公共祖先基础的嵌套目录输出
  // this is unpredictable and makes it difficult to analyze entry / output 这是不可预测的并且使得分析输入/输出变得困难
  // mapping. So what we do here is: 映射。所以我们在这里做的是：
  // 1. flatten all ids to eliminate slash 1. 展平所有 id 以消除斜线
  // 2. in the plugin, read the entry ourselves as virtual files to retain the 2.在插件中，我们自己读取条目作为虚拟文件以保留
  //    path.  路径
  const flatIdDeps: Record<string, string> = {} // 优化后的依赖 id, 对应着依赖文件路径
  const idToExports: Record<string, ExportsData> = {} // 依赖 id, 对应的依赖的相关导出信息

  // 获取依赖优化配置
  const optimizeDeps = getDepOptimizationConfig(config, ssr)

  // 解构出 esbuild 构建选项的插件和其他选项
  const { plugins: pluginsFromConfig = [], ...esbuildOptions } =
    optimizeDeps?.esbuildOptions ?? {}

  // 并行处理所有依赖，提取导出数据并准备构建配置
  await Promise.all(
    Object.keys(depsInfo).map(async (id) => {
      const src = depsInfo[id].src! // 依赖路径：D:/低代码/project/wzb/源码学习/vite/node_modules/.pnpm/eslint@8.57.0/node_modules/eslint/lib/api.js
      // 提取依赖的相关导出信息
      const exportsData = await (depsInfo[id].exportsData ??
        extractExportsData(src, config, ssr))
      if (exportsData.jsxLoader && !esbuildOptions.loader?.['.js']) {
        // Ensure that optimization won't fail by defaulting '.js' to the JSX parser. 通过将“.js”默认为 JSX 解析器，确保优化不会失败。
        // This is useful for packages such as Gatsby. 这对于 Gatsby 之类的包很有用。
        esbuildOptions.loader = {
          '.js': 'jsx',
          ...esbuildOptions.loader,
        }
      }
      const flatId = flattenId(id) // 将依赖 id 处理一下特殊字符以及长度问题
      flatIdDeps[flatId] = src
      idToExports[id] = exportsData
    }),
  )

  // 如果已经取消了的话, 那么返回空的消息出去
  if (optimizerContext.cancelled) return { context: undefined, idToExports }

  // 提供给 esbuild 的环境变量
  const define = {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || config.mode),
  }

  // 提供给 esbuild 的平台配置
  const platform =
    ssr && config.ssr?.target !== 'webworker' ? 'node' : 'browser'

  // 预构建中强制排除的依赖项。
  const external = [...(optimizeDeps?.exclude ?? [])]

  // 用户自定义依赖优化过程的插件
  const plugins = [...pluginsFromConfig]
  // 如果存在排除的依赖, 那么就注册插件处理
  if (external.length) {
    plugins.push(esbuildCjsExternalPlugin(external, platform))
  }
  plugins.push(esbuildDepPlugin(flatIdDeps, external, config, ssr))

  // 调用 esbuild.context 进行构建依赖, 并输出到指定目录：D:/低代码/project/wzb/源码学习/vite/playground/vue/node_modules/.vite/deps_temp_51f3a59e
  const context = await esbuild.context({
    // 工作区
    absWorkingDir: process.cwd(),
    // 入口
    entryPoints: Object.keys(flatIdDeps),
    // 捆绑文件意味着将任何导入的依赖项内联到文件本身中。
    bundle: true,
    // We can't use platform 'neutral', as esbuild has custom handling 我们不能使用平台“中立”，因为 esbuild 有自定义处理
    // when the platform is 'node' or 'browser' that can't be emulated 当平台是无法模拟的“节点”或“浏览器”时
    // by using mainFields and conditions 通过使用 mainFields 和条件
    // 默认情况下，esbuild 的捆绑器配置为生成适用于浏览器的代码。如果您的捆绑代码打算在节点中运行，则应将平台设置为节点
    platform,
    // 此功能提供了一种用常量表达式替换全局标识符的方法。它可以是一种在构建之间更改某些代码的行为而不更改代码本身的方法：
    define,
    // 这设置生成的 JavaScript 文件的输出格式。
    format: 'esm',
    // See https://github.com/evanw/esbuild/issues/1921#issuecomment-1152991694
    // 使用它可以在生成的 JavaScript 和 CSS 文件的开头插入任意字符串。
    banner:
      platform === 'node'
        ? {
            js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
          }
        : undefined,
    // 这将为生成的 JavaScript 和/或 CSS 代码设置目标环境。
    target: ESBUILD_MODULES_TARGET,
    // 您可以将文件或包标记为外部，以将其从构建中排除。导入不会被捆绑，而是会被保留（对 iife 和 cjs 格式使用 require，对 esm 格式使用 import），并将在运行时进行评估。
    external,
    // 日志等级
    logLevel: 'error',
    // 代码分割
    splitting: true,
    // 开启源代码映射
    sourcemap: true,
    // 输出目录 -- D:/低代码/project/wzb/源码学习/vite/playground/vue/node_modules/.vite/deps_temp_51f3a59e
    outdir: processingCacheDir,
    ignoreAnnotations: true,
    // 此选项告诉 esbuild 以 JSON 格式生成一些有关构建的元数据。
    metafile: true,
    // 插件列表
    plugins,
    // 字符集
    charset: 'utf8',
    // 外部用户自定义配置项
    ...esbuildOptions,
    // 此设置允许您在各个语法功能级别自定义 esbuild 的一组不支持的语法功能。
    supported: {
      ...defaultEsbuildSupported,
      ...esbuildOptions.supported,
    },
  })
  return { context, idToExports }
}

/**
 * 向依赖列表中手动添加需要优化的依赖项。
 * @param deps 依赖记录，键为依赖名称，值为依赖路径。
 * @param config 解析后的配置对象，包含日志记录器和配置信息。
 * @param ssr 是否为服务器端渲染模式。
 * @returns Promise<void> 无返回值的Promise。
 */
export async function addManuallyIncludedOptimizeDeps(
  deps: Record<string, string>,
  config: ResolvedConfig,
  ssr: boolean,
): Promise<void> {
  const { logger } = config
  const optimizeDeps = getDepOptimizationConfig(config, ssr)
  // 默认情况下，不在 node_modules 中的，链接的包不会被预构建。使用此选项可强制预构建链接的包 -- https://cn.vitejs.dev/config/dep-optimization-options#optimizedeps-include
  const optimizeDepsInclude = optimizeDeps?.include ?? []
  if (optimizeDepsInclude.length) {
    // 无法解析的依赖项
    const unableToOptimize = (id: string, msg: string) => {
      if (optimizeDepsInclude.includes(id)) {
        logger.warn(
          `${msg}: ${colors.cyan(id)}, present in '${
            ssr ? 'ssr.' : ''
          }optimizeDeps.include'`,
        )
      }
    }

    const includes = [...optimizeDepsInclude] // 手动预构建的包
    // 处理 glob 模式 -- 深层导入
    for (let i = 0; i < includes.length; i++) {
      const id = includes[i]
      // 如果当前是 glob 模式 -- 深层导入
      if (glob.isDynamicPattern(id)) {
        const globIds = expandGlobIds(id, config) // 处理 glob 模式
        includes.splice(i, 1, ...globIds)
        i += globIds.length - 1
      }
    }

    // 创建一个优化依赖包含的解析器函数。
    const resolve = createOptimizeDepsIncludeResolver(config, ssr)
    for (const id of includes) {
      // normalize 'foo   >bar` as 'foo > bar' to prevent same id being added 将 'foo >bar` 规范化为 'foo > bar' 以防止添加相同的 id
      // and for pretty printing 以及漂亮的印刷
      const normalizedId = normalizeId(id)
      if (!deps[normalizedId]) {
        // 解析 optimizeDeps.include 的依赖地址，例如：'D:/学习/wzb_knowledge_base/源码学习/vite/node_modules/.pnpm/eslint@8.57.0/node_modules/eslint/lib/api.js'
        const entry = await resolve(id)
        if (entry) {
          if (isOptimizable(entry, optimizeDeps)) {
            if (!entry.endsWith('?__vite_skip_optimization')) {
              deps[normalizedId] = entry
            }
          } else {
            unableToOptimize(id, 'Cannot optimize dependency') // 无法优化依赖关系
          }
        } else {
          unableToOptimize(id, 'Failed to resolve dependency') // 无法解决依赖关系
        }
      }
    }
  }
}

// Convert to { id: src } 转换成 { id: src }
// 将依赖列表转换成 { id: src }
export function depsFromOptimizedDepInfo(
  depsInfo: Record<string, OptimizedDepInfo>,
): Record<string, string> {
  const obj: Record<string, string> = {}
  for (const key in depsInfo) {
    obj[key] = depsInfo[key].src!
  }
  return obj
}

// 获取依赖构建后存储的地址：例如 "D:/学习/wzb_knowledge_base/源码学习/vite/playground/vue/node_modules/.vite/deps/eslint.js"
export function getOptimizedDepPath(
  id: string,
  config: ResolvedConfig,
  ssr: boolean,
): string {
  return normalizePath(
    path.resolve(getDepsCacheDir(config, ssr), flattenId(id) + '.js'),
  )
}

// 获取依赖预构建的缓存路径后缀
function getDepsCacheSuffix(ssr: boolean): string {
  return ssr ? '_ssr' : ''
}

// 获取依赖预构建的缓存路径
export function getDepsCacheDir(config: ResolvedConfig, ssr: boolean): string {
  return getDepsCacheDirPrefix(config) + getDepsCacheSuffix(ssr) // 如果是 ssr 的话, 额外处理一下
}

// 构建并返回处理依赖项缓存目录的路径。
function getProcessingDepsCacheDir(config: ResolvedConfig, ssr: boolean) {
  return (
    getDepsCacheDirPrefix(config) + getDepsCacheSuffix(ssr) + getTempSuffix()
  )
}

function getTempSuffix() {
  return (
    '_temp_' +
    getHash(
      `${process.pid}:${Date.now().toString()}:${Math.random()
        .toString(16)
        .slice(2)}`,
    )
  )
}

// 获取依赖预构建的缓存目录：'D:/学习/wzb_knowledge_base/源码学习/vite/playground/vue/node_modules/.vite/deps'
function getDepsCacheDirPrefix(config: ResolvedConfig): string {
  return normalizePath(path.resolve(config.cacheDir, 'deps'))
}

/**
 * 创建一个函数，用于判断给定的模块ID是否指向一个优化过的依赖文件。
 *
 * @param config - 解析后的配置对象，包含项目的配置信息，例如缓存目录等。
 * @returns 返回一个函数，该函数接收一个模块ID作为参数，并返回一个布尔值，
 *          表示该模块ID是否以依赖预构建的缓存目录路径为前缀。
 */
export function createIsOptimizedDepFile(
  config: ResolvedConfig,
): (id: string) => boolean {
  const depsCacheDirPrefix = getDepsCacheDirPrefix(config) // 依赖预构建的缓存目录： 'D:/学习/wzb_knowledge_base/源码学习/vite/playground/vue/node_modules/.vite/deps'
  return (id) => id.startsWith(depsCacheDirPrefix)
}

/**
 * 创建一个用于判断URL是否指向缓存目录中的文件的函数。
 * @param config 配置对象，包含项目的根目录等配置信息。
 * @returns 返回一个函数，该函数接收一个URL字符串作为参数，并返回一个布尔值，指示该URL是否指向缓存目录中的文件。
 */
export function createIsOptimizedDepUrl(
  config: ResolvedConfig,
): (url: string) => boolean {
  const { root } = config
  const depsCacheDir = getDepsCacheDirPrefix(config) // 依赖预构建的缓存目录： 'D:/学习/wzb_knowledge_base/源码学习/vite/playground/vue/node_modules/.vite/deps'

  // determine the url prefix of files inside cache directory 确定缓存目录中文件的 url 前缀
  const depsCacheDirRelative = normalizePath(path.relative(root, depsCacheDir))
  // '/node_modules/.vite/deps'
  const depsCacheDirPrefix = depsCacheDirRelative.startsWith('../')
    ? // if the cache directory is outside root, the url prefix would be something
      // like '/@fs/absolute/path/to/node_modules/.vite'
      `/@fs/${removeLeadingSlash(normalizePath(depsCacheDir))}`
    : // if the cache directory is inside root, the url prefix would be something
      // like '/node_modules/.vite'
      `/${depsCacheDirRelative}`

  return function isOptimizedDepUrl(url: string): boolean {
    return url.startsWith(depsCacheDirPrefix)
  }
}

function parseDepsOptimizerMetadata(
  jsonMetadata: string,
  depsCacheDir: string,
): DepOptimizationMetadata | undefined {
  const { hash, lockfileHash, configHash, browserHash, optimized, chunks } =
    JSON.parse(jsonMetadata, (key: string, value: string) => {
      // Paths can be absolute or relative to the deps cache dir where
      // the _metadata.json is located
      if (key === 'file' || key === 'src') {
        return normalizePath(path.resolve(depsCacheDir, value))
      }
      return value
    })
  if (
    !chunks ||
    Object.values(optimized).some((depInfo: any) => !depInfo.fileHash)
  ) {
    // outdated _metadata.json version, ignore
    return
  }
  const metadata = {
    hash,
    lockfileHash,
    configHash,
    browserHash,
    optimized: {},
    discovered: {},
    chunks: {},
    depInfoList: [],
  }
  for (const id of Object.keys(optimized)) {
    addOptimizedDepInfo(metadata, 'optimized', {
      ...optimized[id],
      id,
      browserHash,
    })
  }
  for (const id of Object.keys(chunks)) {
    addOptimizedDepInfo(metadata, 'chunks', {
      ...chunks[id],
      id,
      browserHash,
      needsInterop: false,
    })
  }
  return metadata
}

/**
 * Stringify metadata for deps cache. Remove processing promises
 * and individual dep info browserHash. Once the cache is reload
 * the next time the server start we need to use the global
 * browserHash to allow long term caching
 */
function stringifyDepsOptimizerMetadata(
  metadata: DepOptimizationMetadata,
  depsCacheDir: string,
) {
  const { hash, configHash, lockfileHash, browserHash, optimized, chunks } =
    metadata
  return JSON.stringify(
    {
      hash,
      configHash,
      lockfileHash,
      browserHash,
      optimized: Object.fromEntries(
        Object.values(optimized).map(
          ({ id, src, file, fileHash, needsInterop }) => [
            id,
            {
              src,
              file,
              fileHash,
              needsInterop,
            },
          ],
        ),
      ),
      chunks: Object.fromEntries(
        Object.values(chunks).map(({ id, file }) => [id, { file }]),
      ),
    },
    (key: string, value: string) => {
      // Paths can be absolute or relative to the deps cache dir where
      // the _metadata.json is located
      if (key === 'file' || key === 'src') {
        return normalizePath(path.relative(depsCacheDir, value))
      }
      return value
    },
    2,
  )
}

// 根据给定的 ID 从 esbuild 输出中获取对应的输出内容。
function esbuildOutputFromId(
  outputs: Record<string, any>,
  id: string,
  cacheDirOutputPath: string,
): any {
  const cwd = process.cwd() // 工作目录: "D:\\低代码\\project\\wzb\\源码学习\\vite\\playground\\vue"
  const flatId = flattenId(id) + '.js' // 依赖 id "eslint.js"
  // 依赖输出的相对位置：'node_modules/.vite/deps_temp_4ba10ccd/eslint.js'
  const normalizedOutputPath = normalizePath(
    path.relative(cwd, path.join(cacheDirOutputPath, flatId)),
  )
  // 依赖构建后的输出
  const output = outputs[normalizedOutputPath]
  if (output) {
    return output
  }
  // If the root dir was symlinked, esbuild could return output keys as `../cwd/` 如果root dir是链接的，则Esbuild可以将输出键返回为`../ cwd/`
  // Normalize keys to support this case too 正常化的密钥也支持此案
  for (const [key, value] of Object.entries(outputs)) {
    if (normalizePath(path.relative(cwd, key)) === normalizedOutputPath) {
      return value
    }
  }
}

// 读取指定路径文件，提取出文件导出相关信息
export async function extractExportsData(
  filePath: string,
  config: ResolvedConfig,
  ssr: boolean,
): Promise<ExportsData> {
  await init

  const optimizeDeps = getDepOptimizationConfig(config, ssr) // 依赖优化配置项

  const esbuildOptions = optimizeDeps?.esbuildOptions ?? {} // 在依赖扫描和优化过程中传递给 esbuild 的选项。
  if (optimizeDeps.extensions?.some((ext) => filePath.endsWith(ext))) {
    // For custom supported extensions, build the entry file to transform it into JS, 对于自定义支持的扩展，构建入口文件将其转换为JS，
    // and then parse with es-module-lexer. Note that the `bundle` option is not `true`, 然后用 es-module-lexer 解析。请注意，“bundle”选项不是“true”，
    // so only the entry file is being transformed. 所以只有入口文件被转换。
    const result = await build({
      ...esbuildOptions,
      entryPoints: [filePath],
      write: false,
      format: 'esm',
    })
    const [, exports, , hasModuleSyntax] = parse(result.outputFiles[0].text)
    return {
      hasModuleSyntax,
      exports: exports.map((e) => e.n),
    }
  }

  let parseResult: ReturnType<typeof parse>
  let usedJsxLoader = false

  const entryContent = await fsp.readFile(filePath, 'utf-8') // filePath 路径对应文件的内容
  // 使用 es-module-lexer 进行 ES 模块词法分析器，如果失败的话，尝试转换重试
  try {
    parseResult = parse(entryContent) // ES 模块词法分析器
  } catch {
    const loader = esbuildOptions.loader?.[path.extname(filePath)] || 'jsx'
    debug?.(
      `Unable to parse: ${filePath}.\n Trying again with a ${loader} transform.`, // 无法解析：${filePath}。\n 使用 ${loader} 转换重试
    )
    const transformed = await transformWithEsbuild(entryContent, filePath, {
      loader,
    })
    parseResult = parse(transformed.code)
    usedJsxLoader = true
  }

  // exports：导入内容
  // hasModuleSyntax：检测使用ESM语法的模块
  const [, exports, , hasModuleSyntax] = parseResult
  const exportsData: ExportsData = {
    hasModuleSyntax,
    exports: exports.map((e) => e.n),
    jsxLoader: usedJsxLoader,
  }
  return exportsData
}

// 检测模式是否需要 ESM 转换：https://cn.vitejs.dev/config/dep-optimization-options#optimizedeps-needsinterop
//
function needsInterop(
  config: ResolvedConfig,
  ssr: boolean,
  id: string,
  exportsData: ExportsData,
  output?: { exports: string[] },
): boolean {
  if (getDepOptimizationConfig(config, ssr)?.needsInterop?.includes(id)) {
    return true
  }
  const { hasModuleSyntax, exports } = exportsData
  // entry has no ESM syntax - likely CJS or UMD 条目没有ESM语法 - 可能的CJ或UMD
  // 此时不会 ESM 模式，需要 ESM 转换
  if (!hasModuleSyntax) {
    return true
  }

  if (output) {
    // if a peer dependency used require() on an ESM dependency, esbuild turns the 如果使用ESM依赖关系上使用的同行依赖性creignect（），则Esbuild转动
    // ESM dependency's entry chunk into a single default export... detect ESM依赖项的输入块成一个默认导出...检测
    // such cases by checking exports mismatch, and force interop. 通过检查出口不匹配并强制互动来检查此类情况
    const generatedExports: string[] = output.exports

    if (
      !generatedExports ||
      (isSingleDefaultExport(generatedExports) &&
        !isSingleDefaultExport(exports))
    ) {
      return true
    }
  }
  return false
}

function isSingleDefaultExport(exports: readonly string[]) {
  return exports.length === 1 && exports[0] === 'default'
}

const lockfileFormats = [
  { name: 'package-lock.json', checkPatches: true, manager: 'npm' },
  { name: 'yarn.lock', checkPatches: true, manager: 'yarn' }, // Included in lockfile for v2+
  { name: 'pnpm-lock.yaml', checkPatches: false, manager: 'pnpm' }, // Included in lockfile
  { name: 'bun.lockb', checkPatches: true, manager: 'bun' },
].sort((_, { manager }) => {
  return process.env.npm_config_user_agent?.startsWith(manager) ? 1 : -1
})
const lockfileNames = lockfileFormats.map((l) => l.name)

/**
 * 生成配置的哈希字符串。
 * 该函数考虑特定的配置选项子集，这些选项可以影响依赖项优化的过程，并据此生成一个哈希字符串。
 * 这个哈希字符串能够反映配置及优化选项的状态，可用于缓存等场景。
 *
 * @param config ResolvedConfig - 已解析的配置对象，包含项目的各种配置详情。
 * @param ssr boolean - 表示是否为服务器端渲染模式。
 * @return string - 返回根据配置和依赖项优化选项生成的哈希字符串。
 */
function getConfigHash(config: ResolvedConfig, ssr: boolean): string {
  // Take config into account 考虑配置
  // only a subset of config options that can affect dep optimization 只有配置选项的子集可以影响 dep 优化
  const optimizeDeps = getDepOptimizationConfig(config, ssr)
  // 需要根据这些内容来进行计算 hash，当这些配置信息发生变化时，依赖需要重新缓存
  const content = JSON.stringify(
    {
      mode: process.env.NODE_ENV || config.mode,
      root: config.root,
      resolve: config.resolve,
      assetsInclude: config.assetsInclude,
      plugins: config.plugins.map((p) => p.name),
      optimizeDeps: {
        include: optimizeDeps?.include
          ? unique(optimizeDeps.include).sort()
          : undefined,
        exclude: optimizeDeps?.exclude
          ? unique(optimizeDeps.exclude).sort()
          : undefined,
        esbuildOptions: {
          ...optimizeDeps?.esbuildOptions,
          plugins: optimizeDeps?.esbuildOptions?.plugins?.map((p) => p.name),
        },
      },
    },
    (_, value) => {
      if (typeof value === 'function' || value instanceof RegExp) {
        return value.toString()
      }
      return value
    },
  )
  return getHash(content)
}

/**
 * 获取项目的锁文件的哈希值。
 * 该函数首先尝试查找项目根目录下的多种锁文件（如package-lock.json、pnpm-lock.yaml等），
 * 然后读取找到的第一个锁文件的内容。如果锁文件是通过patch-package创建的，
 * 会额外加上patches目录的修改时间戳，以确保哈希值能够反映patch文件的变动。
 *
 * @param config ResolvedConfig - 包含项目配置信息的对象，主要用于指定项目根目录。
 * @param ssr boolean - 表示是否为服务器端渲染模式。当前该参数未被使用，但保留以供未来可能的扩展。
 * @returns string - 锁文件内容的哈希值字符串。
 */
function getLockfileHash(config: ResolvedConfig, ssr: boolean): string {
  /**
   * 查找到项目的锁文件：D:\\学习\\wzb_knowledge_base\\源码学习\\vite\\pnpm-lock.yaml
   *  ["package-lock.json","bun.lockb","pnpm-lock.yaml","yarn.lock",] 尝试这几种文件可能性
   */
  const lockfilePath = lookupFile(config.root, lockfileNames)
  // 读取文件内容
  let content = lockfilePath ? fs.readFileSync(lockfilePath, 'utf-8') : ''
  if (lockfilePath) {
    const lockfileName = path.basename(lockfilePath) // 查找到的锁文件名："pnpm-lock.yaml"
    const { checkPatches } = lockfileFormats.find(
      (f) => f.name === lockfileName,
    )!
    if (checkPatches) {
      // Default of https://github.com/ds300/patch-package
      const fullPath = path.join(path.dirname(lockfilePath), 'patches')
      const stat = tryStatSync(fullPath)
      if (stat?.isDirectory()) {
        content += stat.mtimeMs.toString()
      }
    }
  }
  return getHash(content)
}

// 计算依赖的相关哈希值
function getDepHash(
  config: ResolvedConfig,
  ssr: boolean,
): { lockfileHash: string; configHash: string; hash: string } {
  const lockfileHash = getLockfileHash(config, ssr) // 锁文件的哈希值。
  const configHash = getConfigHash(config, ssr) // 配置的哈希值
  const hash = getHash(lockfileHash + configHash) // 根据这两个哈希值计算一个哈希值
  return {
    hash,
    lockfileHash,
    configHash,
  }
}
// 计算浏览器哈希
function getOptimizedBrowserHash(
  hash: string,
  deps: Record<string, string>,
  timestamp = '',
) {
  return getHash(hash + JSON.stringify(deps) + timestamp)
}

export function optimizedDepInfoFromId(
  metadata: DepOptimizationMetadata,
  id: string,
): OptimizedDepInfo | undefined {
  return (
    metadata.optimized[id] || metadata.discovered[id] || metadata.chunks[id]
  )
}

export function optimizedDepInfoFromFile(
  metadata: DepOptimizationMetadata,
  file: string,
): OptimizedDepInfo | undefined {
  return metadata.depInfoList.find((depInfo) => depInfo.file === file)
}

// 在给定的依赖信息记录中，通过回调函数查找优化后的依赖信息。
function findOptimizedDepInfoInRecord(
  dependenciesInfo: Record<string, OptimizedDepInfo>,
  callbackFn: (depInfo: OptimizedDepInfo, id: string) => any,
): OptimizedDepInfo | undefined {
  // 遍历dependenciesInfo对象的所有键
  for (const o of Object.keys(dependenciesInfo)) {
    const info = dependenciesInfo[o]
    // 使用callbackFn对当前依赖信息进行测试，如果返回true，则返回当前依赖信息
    if (callbackFn(info, o)) {
      return info
    }
  }
  // 如果没有找到匹配的依赖信息，返回undefined
}

export async function optimizedDepNeedsInterop(
  metadata: DepOptimizationMetadata,
  file: string,
  config: ResolvedConfig,
  ssr: boolean,
): Promise<boolean | undefined> {
  const depInfo = optimizedDepInfoFromFile(metadata, file)
  if (depInfo?.src && depInfo.needsInterop === undefined) {
    depInfo.exportsData ??= extractExportsData(depInfo.src, config, ssr)
    depInfo.needsInterop = needsInterop(
      config,
      ssr,
      depInfo.id,
      await depInfo.exportsData,
    )
  }
  return depInfo?.needsInterop
}

const MAX_TEMP_DIR_AGE_MS = 24 * 60 * 60 * 1000
// 删除陈旧的缓存临时目录，有效期为 1 天
export async function cleanupDepsCacheStaleDirs(
  config: ResolvedConfig,
): Promise<void> {
  try {
    const cacheDir = path.resolve(config.cacheDir) // 预构建缓存目录：D:\\学习\\wzb_knowledge_base\\源码学习\\vite\\playground\\vue\\node_modules\\.vite
    // 检查目录是否存在
    if (fs.existsSync(cacheDir)) {
      const dirents = await fsp.readdir(cacheDir, { withFileTypes: true }) // 读取目录
      for (const dirent of dirents) {
        // 如果 Dirent 是一个目录, 并且名称存在 _temp_，表示为缓存目录文件
        if (dirent.isDirectory() && dirent.name.includes('_temp_')) {
          const tempDirPath = path.resolve(config.cacheDir, dirent.name)
          const stats = await fsp.stat(tempDirPath).catch((_) => null) // 获取目录信息
          // 删除大于一天的缓存临时目录
          if (
            stats?.mtime &&
            Date.now() - stats.mtime.getTime() > MAX_TEMP_DIR_AGE_MS
          ) {
            debug?.(`removing stale cache temp dir ${tempDirPath}`) // 删除陈旧的缓存临时目录
            await fsp.rm(tempDirPath, { recursive: true, force: true })
          }
        }
      }
    }
  } catch (err) {
    config.logger.error(err)
  }
}

// We found issues with renaming folders in some systems. This is a custom
// implementation for the optimizer. It isn't intended to be a general utility

// Based on node-graceful-fs

// The ISC License
// Copyright (c) 2011-2022 Isaac Z. Schlueter, Ben Noordhuis, and Contributors
// https://github.com/isaacs/node-graceful-fs/blob/main/LICENSE

// On Windows, A/V software can lock the directory, causing this
// to fail with an EACCES or EPERM if the directory contains newly
// created files. The original tried for up to 60 seconds, we only
// wait for 5 seconds, as a longer time would be seen as an error

const GRACEFUL_RENAME_TIMEOUT = 5000
const safeRename = promisify(function gracefulRename(
  from: string,
  to: string,
  cb: (error: NodeJS.ErrnoException | null) => void,
) {
  const start = Date.now()
  let backoff = 0
  fs.rename(from, to, function CB(er) {
    if (
      er &&
      (er.code === 'EACCES' || er.code === 'EPERM') &&
      Date.now() - start < GRACEFUL_RENAME_TIMEOUT
    ) {
      setTimeout(function () {
        fs.stat(to, function (stater, st) {
          if (stater && stater.code === 'ENOENT') fs.rename(from, to, CB)
          else CB(er)
        })
      }, backoff)
      if (backoff < 100) backoff += 10
      return
    }
    if (cb) cb(er)
  })
})
