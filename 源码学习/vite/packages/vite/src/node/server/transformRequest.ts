import fsp from 'node:fs/promises'
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import getEtag from 'etag'
import MagicString from 'magic-string'
import { init, parse as parseImports } from 'es-module-lexer'
import type { PartialResolvedId, SourceDescription, SourceMap } from 'rollup'
import colors from 'picocolors'
import type { ModuleNode, ViteDevServer } from '..'
import {
  createDebugger,
  ensureWatchedFile,
  injectQuery,
  isObject,
  prettifyUrl,
  removeImportQuery,
  removeTimestampQuery,
  stripBase,
  timeFrom,
} from '../utils'
import { checkPublicFile } from '../publicDir'
import { isDepsOptimizerEnabled } from '../config'
import { getDepsOptimizer, initDevSsrDepsOptimizer } from '../optimizer'
import { cleanUrl, unwrapId } from '../../shared/utils'
import {
  applySourcemapIgnoreList,
  extractSourcemapFromFile,
  injectSourcesContent,
} from './sourcemap'
import { isFileServingAllowed } from './middlewares/static'
import { throwClosedServerError } from './pluginContainer'

export const ERR_LOAD_URL = 'ERR_LOAD_URL'
export const ERR_LOAD_PUBLIC_URL = 'ERR_LOAD_PUBLIC_URL'

const debugLoad = createDebugger('vite:load')
const debugTransform = createDebugger('vite:transform')
const debugCache = createDebugger('vite:cache')

export interface TransformResult {
  code: string
  map: SourceMap | { mappings: '' } | null
  etag?: string
  deps?: string[]
  dynamicDeps?: string[]
}

export interface TransformOptions {
  ssr?: boolean
  html?: boolean
}

export function transformRequest(
  url: string,
  server: ViteDevServer,
  options: TransformOptions = {},
): Promise<TransformResult | null> {
  // 如果服务器正在重启 && 不是 SSR 场景下，抛出错误
  if (server._restartPromise && !options.ssr) throwClosedServerError()

  const cacheKey = (options.ssr ? 'ssr:' : options.html ? 'html:' : '') + url // 缓存 key

  // This module may get invalidated while we are processing it. For example 在处理过程中，此模块可能会失效。例如
  // when a full page reload is needed after the re-processing of pre-bundled 重新处理预绑定后需要重新加载整页时
  // dependencies when a missing dep is discovered. We save the current time 当发现丢失的dep时，依赖关系。我们节省当前时间
  // to compare it to the last invalidation performed to know if we should 将其与上次执行的无效操作进行比较，以了解我们是否应该
  // cache the result of the transformation or we should discard it as stale. 缓存转换的结果，否则我们应该将其视为过时而丢弃。
  //
  // A module can be invalidated due to: 模块可能因以下原因而失效：
  // 1. A full reload because of pre-bundling newly discovered deps 1.由于预绑定新发现的deps而导致完全重新加载
  // 2. A full reload after a config change 2.配置更改后的完全重新加载
  // 3. The file that generated the module changed 3.生成模块的文件已更改
  // 4. Invalidation for a virtual module 4.虚拟模块无效
  //
  // For 1 and 2, a new request for this module will be issued after 对于1和2，将在之后发出对此模块的新请求
  // the invalidation as part of the browser reloading the page. For 3 and 4 作为浏览器重新加载页面的一部分的无效。对于3和4
  // there may not be a new request right away because of HMR handling. 由于 HMR 处理，可能不会立即出现新的请求。
  // In all cases, the next time this module is requested, it should be 在所有情况下，下次请求此模块时
  // re-processed. 重新处理。
  //
  // We save the timestamp when we start processing and compare it with the 我们在开始处理时保存时间戳，并将其与
  // last time this module is invalidated 上次此模块无效时
  const timestamp = Date.now()

  // 检查是否有正在处理的相同请求，如果有，则根据模块是否失效决定是否重用结果或重新处理
  const pending = server._pendingRequests.get(cacheKey) // 从等待队列中获取当
  if (pending) {
    return server.moduleGraph
      .getModuleByUrl(removeTimestampQuery(url), options.ssr)
      .then((module) => {
        if (!module || pending.timestamp > module.lastInvalidationTimestamp) {
          // The pending request is still valid, we can safely reuse its result
          return pending.request
        } else {
          // Request 1 for module A     (pending.timestamp)
          // Invalidate module A        (module.lastInvalidationTimestamp)
          // Request 2 for module A     (timestamp)

          // First request has been invalidated, abort it to clear the cache,
          // then perform a new doTransform.
          pending.abort()
          return transformRequest(url, server, options)
        }
      })
  }

  // 创建转换请求，并在处理完成后清理缓存
  const request = doTransform(url, server, options, timestamp)

  // Avoid clearing the cache of future requests if aborted
  let cleared = false
  const clearCache = () => {
    if (!cleared) {
      server._pendingRequests.delete(cacheKey)
      cleared = true
    }
  }

  // Cache the request and clear it once processing is done
  server._pendingRequests.set(cacheKey, {
    request,
    timestamp,
    abort: clearCache,
  })

  return request.finally(clearCache)
}

//
async function doTransform(
  url: string,
  server: ViteDevServer,
  options: TransformOptions,
  timestamp: number,
) {
  url = removeTimestampQuery(url) // 从URL中移除时间戳查询参数并返回新的URL。 --> '/src/main.js'

  const { config, pluginContainer } = server // 提取出 配置对象、插件容器
  const ssr = !!options.ssr

  if (ssr && isDepsOptimizerEnabled(config, true)) {
    await initDevSsrDepsOptimizer(config, server)
  }

  let module = await server.moduleGraph.getModuleByUrl(url, ssr)
  if (module) {
    // try use cache from url 尝试使用 url 的缓存
    const cached = await getCachedTransformResult(
      url,
      module,
      server,
      ssr,
      timestamp,
    )
    if (cached) return cached
  }

  // 如果模块不存在，尝试解析模块ID，为后续的处理做准备。
  const resolved = module
    ? undefined
    : (await pluginContainer.resolveId(url, undefined, { ssr })) ?? undefined

  // resolve
  // 确定最终的模块ID，可能基于模块实例、解析结果或原始URL。
  const id = module?.id ?? resolved?.id ?? url

  // 根据ID获取模块实例，如果存在则确保URL与模块ID之间的关联，并尝试使用ID相关的缓存转换结果。
  module ??= server.moduleGraph.getModuleById(id)
  if (module) {
    // if a different url maps to an existing loaded id,  make sure we relate this url to the id 如果不同的 url 映射到现有加载的 id，请确保我们将此 url 与 id 相关联
    await server.moduleGraph._ensureEntryFromUrl(url, ssr, undefined, resolved)
    // try use cache from id 尝试使用 id 的缓存
    const cached = await getCachedTransformResult(
      url,
      module,
      server,
      ssr,
      timestamp,
    )
    if (cached) return cached
  }

  // 异步加载并转换给定的模块。
  const result = loadAndTransform(
    id,
    url,
    server,
    options,
    timestamp,
    module,
    resolved,
  )

  if (!ssr) {
    // Only register client requests, server.waitForRequestsIdle should 仅注册客户端请求，server.waitForRequestsIdle应
    // have been called server.waitForClientRequestsIdle. We can rename 已被调用server.waitForClientRequestsIdle。我们可以重命名
    // it as part of the environment API work 作为API环境工作的一部分
    const depsOptimizer = getDepsOptimizer(config, ssr)
    if (!depsOptimizer?.isOptimizedDepFile(id)) {
      server._registerRequestProcessing(id, () => result)
    }
  }

  return result
}

async function getCachedTransformResult(
  url: string,
  module: ModuleNode,
  server: ViteDevServer,
  ssr: boolean,
  timestamp: number,
) {
  const prettyUrl = debugCache ? prettifyUrl(url, server.config.root) : ''

  // tries to handle soft invalidation of the module if available,
  // returns a boolean true is successful, or false if no handling is needed
  const softInvalidatedTransformResult =
    module &&
    (await handleModuleSoftInvalidation(module, ssr, timestamp, server))
  if (softInvalidatedTransformResult) {
    debugCache?.(`[memory-hmr] ${prettyUrl}`)
    return softInvalidatedTransformResult
  }

  // check if we have a fresh cache
  const cached =
    module && (ssr ? module.ssrTransformResult : module.transformResult)
  if (cached) {
    debugCache?.(`[memory] ${prettyUrl}`)
    return cached
  }
}

/**
 * 异步加载并转换给定的模块。
 *
 *  1. 执行插件的 load 钩子：https://cn.rollupjs.org/plugin-development/#load
 *      --> 如果没有插件的 load 钩子处理的话, 尝试从文件系统加载模块的 code 以及 sourceMap(如果有的话)
 *  2. 执行插件的 transform 钩子(用来转换单个模块)。 -- https://cn.rollupjs.org/plugin-development/#transform
 *
 *  在此过程中, 将各种信息缓存到 moduleGraph 的对应 Map 中，以供后续使用
 *
 * @param id 模块的标识符。
 * @param url 模块的URL。
 * @param server Vite开发服务器实例。
 * @param options 转换选项，包括是否启用SSR等。
 * @param timestamp 加载模块时的时间戳，用于缓存验证。
 * @param mod 可选的模块节点，表示该模块在模块图中的节点。
 * @param resolved 可选的已解析的模块ID，用于优化加载过程。
 * @returns 返回转换后的模块代码和源映射。
 */
async function loadAndTransform(
  id: string,
  url: string,
  server: ViteDevServer,
  options: TransformOptions,
  timestamp: number,
  mod?: ModuleNode,
  resolved?: PartialResolvedId,
) {
  const { config, pluginContainer, moduleGraph } = server // 从服务器实例中解构所需属性。
  const { logger } = config // 获取配置中的日志器。
  const prettyUrl =
    debugLoad || debugTransform ? prettifyUrl(url, config.root) : '' // 根据配置和URL，美化URL以供调试使用。
  const ssr = !!options.ssr // 检查是否启用SSR。

  const file = cleanUrl(id) // 清理模块标识符以获得文件路径。
  // 初始化代码和源映射。
  let code: string | null = null
  let map: SourceDescription['map'] = null

  // load
  const loadStart = debugLoad ? performance.now() : 0 // 记录加载开始时间，用于性能调试。
  const loadResult = await pluginContainer.load(id, { ssr }) // 尝试使用插件容器加载模块。
  // 如果加载结果为空，尝试从文件系统加载：https://cn.rollupjs.org/plugin-development/#load
  if (loadResult == null) {
    // if this is an html request and there is no load result, skip ahead to 如果这是一个html请求，并且没有加载结果，请跳到
    // SPA fallback. SPA回退。
    if (options.html && !id.endsWith('.html')) {
      return null
    }
    // try fallback loading it from fs as string 尝试回退将其作为字符串从fs加载
    // if the file is a binary, there should be a plugin that already loaded it 如果文件是二进制文件，那么应该有一个插件已经加载了它
    // as string 作为字符串
    // only try the fallback if access is allowed, skip for out of root url 只有在允许访问的情况下才尝试回退，跳过根外url
    // like /service-worker.js or /api/users 像/service-worker.js或/api/users
    // 如果是允许访问的文件，尝试从文件系统读取模块代码。
    if (options.ssr || isFileServingAllowed(file, server)) {
      try {
        code = await fsp.readFile(file, 'utf-8') // 从文件系统读取代码。
        debugLoad?.(`${timeFrom(loadStart)} [fs] ${prettyUrl}`) // 调用调试函数记录加载时间。
      } catch (e) {
        // 处理文件读取错误。
        if (e.code !== 'ENOENT') {
          if (e.code === 'EISDIR') {
            e.message = `${e.message} ${file}`
          }
          throw e
        }
      }
      // 确保文件被监视器监视。
      if (code != null) {
        ensureWatchedFile(server.watcher, file, config.root)
      }
    }
    // 尝试从代码中提取源映射。
    if (code) {
      try {
        // 从代码中提取源映射
        //  1. 尝试从代码字符串本身或其对应的映射文件中提取源映射。
        //  2. 否则，尝试根据文件路径找到映射文件，并从映射文件中提取源映射。
        const extracted = await extractSourcemapFromFile(code, file)
        if (extracted) {
          code = extracted.code
          map = extracted.map
        }
      } catch (e) {
        // 记录源映射提取失败的日志。
        logger.warn(`Failed to load source map for ${file}.\n${e}`, {
          timestamp: true,
        })
      }
    }
  } else {
    // 记录插件加载时间。
    debugLoad?.(`${timeFrom(loadStart)} [plugin] ${prettyUrl}`)
    // 处理加载结果。
    if (isObject(loadResult)) {
      code = loadResult.code
      map = loadResult.map
    } else {
      code = loadResult
    }
  }

  // 如果代码为空，抛出错误。
  if (code == null) {
    // 检查文件是否为公共文件，并给出相应错误信息。
    const isPublicFile = checkPublicFile(url, config)
    let publicDirName = path.relative(config.root, config.publicDir)
    if (publicDirName[0] !== '.') publicDirName = '/' + publicDirName
    const msg = isPublicFile
      ? `This file is in ${publicDirName} and will be copied as-is during ` + // 此文件位于$｛publicDirName｝中，将在期间按原样复制
        `build without going through the plugin transforms, and therefore ` + // 在不经过插件转换的情况下构建，因此
        `should not be imported from source code. It can only be referenced ` + // 不应从源代码导入。它只能被引用
        `via HTML tags.` // 通过HTML标签
      : `Does the file exist?` // 文件存在吗

    // 抛出加载失败的错误。
    const importerMod: ModuleNode | undefined = server.moduleGraph.idToModuleMap
      .get(id)
      ?.importers.values()
      .next().value
    const importer = importerMod?.file || importerMod?.url
    const err: any = new Error(
      `Failed to load url ${url} (resolved id: ${id})${
        importer ? ` in ${importer}` : ''
      }. ${msg}`,
    )
    err.code = isPublicFile ? ERR_LOAD_PUBLIC_URL : ERR_LOAD_URL
    throw err
  }

  // 如果服务器正在重启 && 不是 SSR 场景下，抛出错误
  if (server._restartPromise && !ssr) throwClosedServerError()

  // ensure module in graph after successful load 成功加载后确保图中的模块
  // 从模块图中加载对应的模块实例，如果存在的话，直接从对应缓存中提取，否则新建一个模块实例
  mod ??= await moduleGraph._ensureEntryFromUrl(url, ssr, undefined, resolved)

  // transform
  const transformStart = debugTransform ? performance.now() : 0 // 记录转换开始时间。
  // 执行插件的转换函数。
  const transformResult = await pluginContainer.transform(code, id, {
    inMap: map,
    ssr,
  })
  // 处理转换结果。
  const originalCode = code // 原 code
  if (
    transformResult == null ||
    (isObject(transformResult) && transformResult.code == null)
  ) {
    // no transform applied, keep code as-is 如果没有进行转换，记录调试信息。
    debugTransform?.(
      timeFrom(transformStart) + colors.dim(` [skipped] ${prettyUrl}`),
    )
  } else {
    // 记录转换成功的时间。
    debugTransform?.(`${timeFrom(transformStart)} ${prettyUrl}`)
    code = transformResult.code!
    map = transformResult.map
  }

  // 标准化源映射。
  let normalizedMap: SourceMap | { mappings: '' } | null
  if (typeof map === 'string') {
    normalizedMap = JSON.parse(map)
  } else if (map) {
    normalizedMap = map as SourceMap | { mappings: '' }
  } else {
    normalizedMap = null
  }

  // 如果存在源映射且模块有文件路径，处理源映射的内容和路径。
  if (normalizedMap && 'version' in normalizedMap && mod.file) {
    if (normalizedMap.mappings) {
      await injectSourcesContent(normalizedMap, mod.file, logger)
    }

    const sourcemapPath = `${mod.file}.map`
    applySourcemapIgnoreList(
      normalizedMap,
      sourcemapPath,
      config.server.sourcemapIgnoreList,
      logger,
    )

    if (path.isAbsolute(mod.file)) {
      let modDirname
      for (
        let sourcesIndex = 0;
        sourcesIndex < normalizedMap.sources.length;
        ++sourcesIndex
      ) {
        const sourcePath = normalizedMap.sources[sourcesIndex]
        if (sourcePath) {
          // Rewrite sources to relative paths to give debuggers the chance
          // to resolve and display them in a meaningful way (rather than
          // with absolute paths).
          if (path.isAbsolute(sourcePath)) {
            modDirname ??= path.dirname(mod.file)
            normalizedMap.sources[sourcesIndex] = path.relative(
              modDirname,
              sourcePath,
            )
          }
        }
      }
    }
  }

  // 如果服务器正在重启 && 不是 SSR 场景下，抛出错误
  if (server._restartPromise && !ssr) throwClosedServerError()

  const result =
    ssr && !server.config.experimental.skipSsrTransform
      ? await server.ssrTransform(code, normalizedMap, url, originalCode)
      : ({
          code,
          map: normalizedMap,
          etag: getEtag(code, { weak: true }), // 根据 code 获得一个 Etag
        } satisfies TransformResult)

  // Only cache the result if the module wasn't invalidated while it was 仅当模块在失效时未失效时才缓存结果
  // being processed, so it is re-processed next time if it is stale 正在处理中，因此如果过时，下次会重新处理
  if (timestamp > mod.lastInvalidationTimestamp)
    moduleGraph.updateModuleTransformResult(mod, result, ssr)

  return result
}

/**
 * When a module is soft-invalidated, we can preserve its previous `transformResult` and
 * return similar code to before:
 *
 * - Client: We need to transform the import specifiers with new timestamps
 * - SSR: We don't need to change anything as `ssrLoadModule` controls it
 */
async function handleModuleSoftInvalidation(
  mod: ModuleNode,
  ssr: boolean,
  timestamp: number,
  server: ViteDevServer,
) {
  const transformResult = ssr ? mod.ssrInvalidationState : mod.invalidationState

  // Reset invalidation state
  if (ssr) mod.ssrInvalidationState = undefined
  else mod.invalidationState = undefined

  // Skip if not soft-invalidated
  if (!transformResult || transformResult === 'HARD_INVALIDATED') return

  if (ssr ? mod.ssrTransformResult : mod.transformResult) {
    throw new Error(
      `Internal server error: Soft-invalidated module "${mod.url}" should not have existing transform result`,
    )
  }

  let result: TransformResult
  // For SSR soft-invalidation, no transformation is needed
  if (ssr) {
    result = transformResult
  }
  // For client soft-invalidation, we need to transform each imports with new timestamps if available
  else {
    await init
    const source = transformResult.code
    const s = new MagicString(source)
    const [imports] = parseImports(source, mod.id || undefined)

    for (const imp of imports) {
      let rawUrl = source.slice(imp.s, imp.e)
      if (rawUrl === 'import.meta') continue

      const hasQuotes = rawUrl[0] === '"' || rawUrl[0] === "'"
      if (hasQuotes) {
        rawUrl = rawUrl.slice(1, -1)
      }

      const urlWithoutTimestamp = removeTimestampQuery(rawUrl)
      // hmrUrl must be derived the same way as importAnalysis
      const hmrUrl = unwrapId(
        stripBase(removeImportQuery(urlWithoutTimestamp), server.config.base),
      )
      for (const importedMod of mod.clientImportedModules) {
        if (importedMod.url !== hmrUrl) continue
        if (importedMod.lastHMRTimestamp > 0) {
          const replacedUrl = injectQuery(
            urlWithoutTimestamp,
            `t=${importedMod.lastHMRTimestamp}`,
          )
          const start = hasQuotes ? imp.s + 1 : imp.s
          const end = hasQuotes ? imp.e - 1 : imp.e
          s.overwrite(start, end, replacedUrl)
        }

        if (imp.d === -1 && server.config.server.preTransformRequests) {
          // pre-transform known direct imports
          server.warmupRequest(hmrUrl, { ssr })
        }

        break
      }
    }

    // Update `transformResult` with new code. We don't have to update the sourcemap
    // as the timestamp changes doesn't affect the code lines (stable).
    const code = s.toString()
    result = {
      ...transformResult,
      code,
      etag: getEtag(code, { weak: true }),
    }
  }

  // Only cache the result if the module wasn't invalidated while it was
  // being processed, so it is re-processed next time if it is stale
  if (timestamp > mod.lastInvalidationTimestamp)
    server.moduleGraph.updateModuleTransformResult(mod, result, ssr)

  return result
}
