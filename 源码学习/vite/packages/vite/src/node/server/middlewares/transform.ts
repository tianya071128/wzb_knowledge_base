import path from 'node:path'
import fsp from 'node:fs/promises'
import type { Connect } from 'dep-types/connect'
import colors from 'picocolors'
import type { ExistingRawSourceMap } from 'rollup'
import type { ViteDevServer } from '..'
import {
  createDebugger,
  fsPathFromId,
  injectQuery,
  isImportRequest,
  isJSRequest,
  normalizePath,
  prettifyUrl,
  removeImportQuery,
  removeTimestampQuery,
  urlRE,
} from '../../utils'
import { send } from '../send'
import { ERR_LOAD_URL, transformRequest } from '../transformRequest'
import { applySourcemapIgnoreList } from '../sourcemap'
import { isHTMLProxy } from '../../plugins/html'
import { DEP_VERSION_RE, FS_PREFIX } from '../../constants'
import {
  isCSSRequest,
  isDirectCSSRequest,
  isDirectRequest,
} from '../../plugins/css'
import {
  ERR_FILE_NOT_FOUND_IN_OPTIMIZED_DEP_DIR,
  ERR_OPTIMIZE_DEPS_PROCESSING_ERROR,
  ERR_OUTDATED_OPTIMIZED_DEP,
} from '../../plugins/optimizedDeps'
import { ERR_CLOSED_SERVER } from '../pluginContainer'
import { getDepsOptimizer } from '../../optimizer'
import { cleanUrl, unwrapId, withTrailingSlash } from '../../../shared/utils'
import { NULL_BYTE_PLACEHOLDER } from '../../../shared/constants'

const debugCache = createDebugger('vite:cache')

const knownIgnoreList = new Set(['/', '/favicon.ico'])

/**
 * A middleware that short-circuits the middleware chain to serve cached transformed modules 一个中间件，可以使中间件链短路以服务缓存的转换模块
 */
export function cachedTransformMiddleware(
  server: ViteDevServer,
): Connect.NextHandleFunction {
  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...` 保留命名函数。该名称通过“DEBUG=connect:dispatcher ...”在调试日志中可见
  return function viteCachedTransformMiddleware(req, res, next) {
    // check if we can return 304 early 检查我们是否可以提前返回 304
    const ifNoneMatch = req.headers['if-none-match'] // HTTP 协商缓存头部字段
    if (ifNoneMatch) {
      const moduleByEtag = server.moduleGraph.getModuleByEtag(ifNoneMatch)
      if (moduleByEtag?.transformResult?.etag === ifNoneMatch) {
        // For CSS requests, if the same CSS file is imported in a module, 对于CSS请求，如果在模块中导入相同的CSS文件，
        // the browser sends the request for the direct CSS request with the etag 浏览器使用etag发送对直接CSS请求的请求
        // from the imported CSS module. We ignore the etag in this case. 从导入的CSS模块。在这种情况下，我们忽略etag。
        const maybeMixedEtag = isCSSRequest(req.url!)
        if (!maybeMixedEtag) {
          debugCache?.(`[304] ${prettifyUrl(req.url!, server.config.root)}`)
          res.statusCode = 304
          return res.end()
        }
      }
    }

    next()
  }
}

// 该函数作为中间件处理请求，用于处理Vite开发服务器的资源转换。
export function transformMiddleware(
  server: ViteDevServer,
): Connect.NextHandleFunction {
  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...` 保留命名函数。该名称通过“DEBUG=connect:dispatcher ...”在调试日志中可见

  // check if public dir is inside root dir 检查公共目录是否在根目录内
  const { root, publicDir } = server.config
  const publicDirInRoot = publicDir.startsWith(withTrailingSlash(root))
  const publicPath = `${publicDir.slice(root.length)}/`

  return async function viteTransformMiddleware(req, res, next) {
    // 如果不是 GET 请求, 或者请求路径是 '/' 或 '/favicon.ico'，则直接略过，会有其他的中间件处理一下
    if (req.method !== 'GET' || knownIgnoreList.has(req.url!)) {
      return next()
    }

    let url: string
    try {
      // 从URL中移除时间戳查询参数等信息, 重新规范 url --> '/src/main.js'
      url = decodeURI(removeTimestampQuery(req.url!)).replace(
        NULL_BYTE_PLACEHOLDER,
        '\0',
      )
    } catch (e) {
      return next(e)
    }

    const withoutQuery = cleanUrl(url)

    try {
      const isSourceMap = withoutQuery.endsWith('.map') // 如果是 sourceMap 文件的请求
      // since we generate source map references, handle those requests here 由于我们生成源映射引用，因此在此处处理这些请求
      if (isSourceMap) {
        const depsOptimizer = getDepsOptimizer(server.config, false) // non-ssr
        if (depsOptimizer?.isOptimizedDepUrl(url)) {
          // If the browser is requesting a source map for an optimized dep, it
          // means that the dependency has already been pre-bundled and loaded
          const sourcemapPath = url.startsWith(FS_PREFIX)
            ? fsPathFromId(url)
            : normalizePath(path.resolve(server.config.root, url.slice(1)))
          try {
            const map = JSON.parse(
              await fsp.readFile(sourcemapPath, 'utf-8'),
            ) as ExistingRawSourceMap

            applySourcemapIgnoreList(
              map,
              sourcemapPath,
              server.config.server.sourcemapIgnoreList,
              server.config.logger,
            )

            return send(req, res, JSON.stringify(map), 'json', {
              headers: server.config.server.headers,
            })
          } catch (e) {
            // Outdated source map request for optimized deps, this isn't an error
            // but part of the normal flow when re-optimizing after missing deps
            // Send back an empty source map so the browser doesn't issue warnings
            const dummySourceMap = {
              version: 3,
              file: sourcemapPath.replace(/\.map$/, ''),
              sources: [],
              sourcesContent: [],
              names: [],
              mappings: ';;;;;;;;;',
            }
            return send(req, res, JSON.stringify(dummySourceMap), 'json', {
              cacheControl: 'no-cache',
              headers: server.config.server.headers,
            })
          }
        } else {
          const originalUrl = url.replace(/\.map($|\?)/, '$1')
          const map = (
            await server.moduleGraph.getModuleByUrl(originalUrl, false)
          )?.transformResult?.map
          if (map) {
            return send(req, res, JSON.stringify(map), 'json', {
              headers: server.config.server.headers,
            })
          } else {
            return next()
          }
        }
      }

      // 检查路径是否以公共路径开头, 否则打印警告
      if (publicDirInRoot && url.startsWith(publicPath)) {
        warnAboutExplicitPublicPathInUrl(url)
      }

      if (
        isJSRequest(url) || // 是否为 js 类型导入(vue 文件也当成 js 处理)
        isImportRequest(url) ||
        isCSSRequest(url) || // 是否为 css(或 scss 等) 文件请求
        isHTMLProxy(url)
      ) {
        // strip ?import 剥离？导入
        url = removeImportQuery(url) // 从URL中移除 import= 查询字符串
        // Strip valid id prefix. This is prepended to resolved Ids that are 去掉有效的 ID 前缀。这是在已解析的 ID 之前添加的
        // not valid browser import specifiers by the importAnalysis plugin. importAnalysis 插件的浏览器导入说明符无效
        url = unwrapId(url)

        // for CSS, we differentiate between normal CSS requests and imports 对于 CSS，我们区分普通 CSS 请求和导入
        if (isCSSRequest(url)) {
          if (
            req.headers.accept?.includes('text/css') &&
            !isDirectRequest(url)
          ) {
            url = injectQuery(url, 'direct')
          }

          // check if we can return 304 early for CSS requests. These aren't handled 检查我们是否可以为 CSS 请求提前返回 304。这些不处理
          // by the cachedTransformMiddleware due to the browser possibly mixing the 由于浏览器可能会混合使用 cachedTransformMiddleware
          // etags of direct and imported CSS 直接CSS和导入CSS的etag
          const ifNoneMatch = req.headers['if-none-match']
          if (
            ifNoneMatch &&
            (await server.moduleGraph.getModuleByUrl(url, false))
              ?.transformResult?.etag === ifNoneMatch
          ) {
            debugCache?.(`[304] ${prettifyUrl(url, server.config.root)}`)
            res.statusCode = 304
            return res.end()
          }
        }

        // resolve, load and transform using the plugin container 使用插件容器解析、加载和转换
        const result = await transformRequest(url, server, {
          html: req.headers.accept?.includes('text/html'),
        })
        if (result) {
          const depsOptimizer = getDepsOptimizer(server.config, false) // non-ssr
          const type = isDirectCSSRequest(url) ? 'css' : 'js'
          const isDep =
            DEP_VERSION_RE.test(url) || depsOptimizer?.isOptimizedDepUrl(url)
          return send(req, res, result.code, type, {
            etag: result.etag,
            // allow browser to cache npm deps!
            cacheControl: isDep ? 'max-age=31536000,immutable' : 'no-cache',
            headers: server.config.server.headers,
            map: result.map,
          })
        }
      }
    } catch (e) {
      if (e?.code === ERR_OPTIMIZE_DEPS_PROCESSING_ERROR) {
        // Skip if response has already been sent
        if (!res.writableEnded) {
          res.statusCode = 504 // status code request timeout
          res.statusMessage = 'Optimize Deps Processing Error'
          res.end()
        }
        // This timeout is unexpected
        server.config.logger.error(e.message)
        return
      }
      if (e?.code === ERR_OUTDATED_OPTIMIZED_DEP) {
        // Skip if response has already been sent
        if (!res.writableEnded) {
          res.statusCode = 504 // status code request timeout
          res.statusMessage = 'Outdated Optimize Dep'
          res.end()
        }
        // We don't need to log an error in this case, the request
        // is outdated because new dependencies were discovered and
        // the new pre-bundle dependencies have changed.
        // A full-page reload has been issued, and these old requests
        // can't be properly fulfilled. This isn't an unexpected
        // error but a normal part of the missing deps discovery flow
        return
      }
      if (e?.code === ERR_CLOSED_SERVER) {
        // Skip if response has already been sent
        if (!res.writableEnded) {
          res.statusCode = 504 // status code request timeout
          res.statusMessage = 'Outdated Request'
          res.end()
        }
        // We don't need to log an error in this case, the request
        // is outdated because new dependencies were discovered and
        // the new pre-bundle dependencies have changed.
        // A full-page reload has been issued, and these old requests
        // can't be properly fulfilled. This isn't an unexpected
        // error but a normal part of the missing deps discovery flow
        return
      }
      if (e?.code === ERR_FILE_NOT_FOUND_IN_OPTIMIZED_DEP_DIR) {
        // Skip if response has already been sent
        if (!res.writableEnded) {
          res.statusCode = 404
          res.end()
        }
        server.config.logger.warn(colors.yellow(e.message))
        return
      }
      if (e?.code === ERR_LOAD_URL) {
        // Let other middleware handle if we can't load the url via transformRequest
        return next()
      }
      return next(e)
    }

    next()
  }

  /**
   * 检查URL中是否显式使用了公共路径，并给出相应的警告信息。
   * 该函数主要处理导入请求，针对不同情况提供对应的解决方案。
   *
   * @param url 待检查的URL字符串
   */
  function warnAboutExplicitPublicPathInUrl(url: string) {
    let warning: string

    if (isImportRequest(url)) {
      const rawUrl = removeImportQuery(url)
      if (urlRE.test(url)) {
        warning =
          `Assets in the public directory are served at the root path.\n` + // 公共目录中的资产在根路径中提供
          // 使用 ${colors.cyan(rawUrl)} 代替
          `Instead of ${colors.cyan(rawUrl)}, use ${colors.cyan(
            rawUrl.replace(publicPath, '/'),
          )}.`
      } else {
        warning =
          'Assets in public directory cannot be imported from JavaScript.\n' + // 公共目录中的资源无法从 JavaScript 导入
          // 如果您打算导入该资源，请将文件放在 src 目录中，然后使用
          `If you intend to import that asset, put the file in the src directory, and use ${colors.cyan(
            rawUrl.replace(publicPath, '/src/'),
          )} instead of ${colors.cyan(rawUrl)}.\n` +
          // 如果您打算使用该资产的 URL，请使用
          `If you intend to use the URL of that asset, use ${colors.cyan(
            injectQuery(rawUrl.replace(publicPath, '/'), 'url'),
          )}.`
      }
    } else {
      warning =
        // 公共目录中的文件在根路径中提供
        `Files in the public directory are served at the root path.\n` +
        `Instead of ${colors.cyan(url)}, use ${colors.cyan(
          url.replace(publicPath, '/'),
        )}.`
    }

    // 使用服务器配置中的日志记录器发出黄色警告
    server.config.logger.warn(colors.yellow(warning))
  }
}
