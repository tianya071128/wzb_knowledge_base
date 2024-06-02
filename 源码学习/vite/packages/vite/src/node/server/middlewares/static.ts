import path from 'node:path'
import type { OutgoingHttpHeaders, ServerResponse } from 'node:http'
import type { Options } from 'sirv'
import sirv from 'sirv'
import type { Connect } from 'dep-types/connect'
import escapeHtml from 'escape-html'
import type { ViteDevServer } from '../..'
import { FS_PREFIX } from '../../constants'
import {
  fsPathFromId,
  fsPathFromUrl,
  isFileReadable,
  isImportRequest,
  isInternalRequest,
  isParentDirectory,
  isSameFileUri,
  normalizePath,
  removeLeadingSlash,
} from '../../utils'
import {
  cleanUrl,
  isWindows,
  slash,
  withTrailingSlash,
} from '../../../shared/utils'

const knownJavascriptExtensionRE = /\.[tj]sx?$/

const sirvOptions = ({
  getHeaders,
}: {
  getHeaders: () => OutgoingHttpHeaders | undefined
}): Options => {
  return {
    dev: true,
    etag: true,
    extensions: [],
    setHeaders(res, pathname) {
      // Matches js, jsx, ts, tsx.
      // The reason this is done, is that the .ts file extension is reserved
      // for the MIME type video/mp2t. In almost all cases, we can expect
      // these files to be TypeScript files, and for Vite to serve them with
      // this Content-Type.
      if (knownJavascriptExtensionRE.test(pathname)) {
        res.setHeader('Content-Type', 'text/javascript')
      }
      const headers = getHeaders()
      if (headers) {
        for (const name in headers) {
          res.setHeader(name, headers[name]!)
        }
      }
    },
  }
}

// 用于服务静态文件的中间件。
export function servePublicMiddleware(
  server: ViteDevServer,
  /** 静态资源文件列表 */
  publicFiles?: Set<string>,
): Connect.NextHandleFunction {
  const dir = server.config.publicDir // 获取公共目录并初始化sirv服务器实例用于服务静态文件。
  // 用于提供静态文件的优化中间件
  const serve = sirv(
    dir,
    sirvOptions({
      getHeaders: () => server.config.server.headers,
    }),
  )

  // 处理一下请求网址
  const toFilePath = (url: string) => {
    let filePath = cleanUrl(url)
    if (filePath.indexOf('%') !== -1) {
      try {
        filePath = decodeURI(filePath) // 解码由encodeURI 创建或其他流程得到的统一资源标识符
      } catch (err) {
        /* malform uri */
      }
    }
    return normalizePath(filePath)
  }

  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...` 保留命名函数。该名称通过“DEBUG=connect:dispatcher ...”在调试日志中可见
  return function viteServePublicMiddleware(req, res, next) {
    // To avoid the performance impact of `existsSync` on every request, we check against an 为了避免“existsSync”对每个请求的性能影响，我们检查
    // in-memory set of known public files. This set is updated on restarts. 已知公共文件的内存集中。此集在重新启动时更新。
    // also skip import request and internal requests `/@fs/ /@vite-client` etc... 也跳过导入请求和内部请求`/@fs//@vite-client`等。。。
    // 检测是否为公共资源的请求，不是的话 next
    if (
      (publicFiles && !publicFiles.has(toFilePath(req.url!))) ||
      isImportRequest(req.url!) ||
      isInternalRequest(req.url!)
    ) {
      return next()
    }
    // 处理静态资源
    serve(req, res, next)
  }
}

export function serveStaticMiddleware(
  server: ViteDevServer,
): Connect.NextHandleFunction {
  const dir = server.config.root
  const serve = sirv(
    dir,
    sirvOptions({
      getHeaders: () => server.config.server.headers,
    }),
  )

  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...` 保留命名函数。该名称通过“DEBUG=connect:dispatcher ...”在调试日志中可见
  return function viteServeStaticMiddleware(req, res, next) {
    // only serve the file if it's not an html request or ends with `/` 仅当文件不是 html 请求或以“/”结尾时才提供文件
    // so that html requests can fallthrough to our html middleware for 这样 html 请求就可以传递到我们的 html 中间件
    // special processing 特殊加工
    // also skip internal requests `/@fs/ /@vite-client` etc... 还跳过内部请求 `/@fs/ /@vite-client` 等...
    const cleanedUrl = cleanUrl(req.url!)
    if (
      cleanedUrl[cleanedUrl.length - 1] === '/' ||
      path.extname(cleanedUrl) === '.html' ||
      isInternalRequest(req.url!)
    ) {
      return next()
    }

    const url = new URL(req.url!.replace(/^\/{2,}/, '/'), 'http://example.com')
    const pathname = decodeURI(url.pathname)

    // apply aliases to static requests as well
    let redirectedPathname: string | undefined
    for (const { find, replacement } of server.config.resolve.alias) {
      const matches =
        typeof find === 'string'
          ? pathname.startsWith(find)
          : find.test(pathname)
      if (matches) {
        redirectedPathname = pathname.replace(find, replacement)
        break
      }
    }
    if (redirectedPathname) {
      // dir is pre-normalized to posix style
      if (redirectedPathname.startsWith(withTrailingSlash(dir))) {
        redirectedPathname = redirectedPathname.slice(dir.length)
      }
    }

    const resolvedPathname = redirectedPathname || pathname
    let fileUrl = path.resolve(dir, removeLeadingSlash(resolvedPathname))
    if (
      resolvedPathname[resolvedPathname.length - 1] === '/' &&
      fileUrl[fileUrl.length - 1] !== '/'
    ) {
      fileUrl = withTrailingSlash(fileUrl)
    }
    if (!ensureServingAccess(fileUrl, server, res, next)) {
      return
    }

    if (redirectedPathname) {
      url.pathname = encodeURI(redirectedPathname)
      req.url = url.href.slice(url.origin.length)
    }

    serve(req, res, next)
  }
}

export function serveRawFsMiddleware(
  server: ViteDevServer,
): Connect.NextHandleFunction {
  const serveFromRoot = sirv(
    '/',
    sirvOptions({
      getHeaders: () =>
        /** 指定服务器响应的 header。 */
        server.config.server.headers,
    }),
  )

  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...` 保留命名函数。该名称通过“DEBUG=connect:dispatcher ...”在调试日志中可见
  return function viteServeRawFsMiddleware(req, res, next) {
    const url = new URL(req.url!.replace(/^\/{2,}/, '/'), 'http://example.com')
    // In some cases (e.g. linked monorepos) files outside of root will 在某些情况下（例如，链接的monorespo）根目录之外的文件将
    // reference assets that are also out of served root. In such cases 也超出服务根的参考资产。在这种情况下
    // the paths are rewritten to `/@fs/` prefixed paths and must be served by 路径被重写为“/@fs/”前缀路径，并且必须由
    // searching based from fs root. 基于fs根进行搜索。
    if (url.pathname.startsWith(FS_PREFIX)) {
      const pathname = decodeURI(url.pathname)
      // restrict files outside of `fs.allow` 限制“fs.allow”之外的文件
      if (
        !ensureServingAccess(
          slash(path.resolve(fsPathFromId(pathname))),
          server,
          res,
          next,
        )
      ) {
        return
      }

      let newPathname = pathname.slice(FS_PREFIX.length)
      if (isWindows) newPathname = newPathname.replace(/^[A-Z]:/i, '')

      url.pathname = encodeURI(newPathname)
      req.url = url.href.slice(url.origin.length)
      serveFromRoot(req, res, next)
    } else {
      next()
    }
  }
}

/**
 * Check if the url is allowed to be served, via the `server.fs` config. 通过 `server.fs` 配置检查是否允许提供该 url
 */
/**
 * 检查是否允许服务文件。
 *
 * 此函数用于确定是否应该从开发服务器中服务给定的文件URL。它基于配置的文件系统权限规则来决策。
 * 如果文件系统权限配置为非严格模式，则默认允许服务文件。在严格模式下，它会进一步检查文件是否被明确禁止，
 * 是否位于安全模块路径中，或者是否被允许的文件路径之一包含。
 *
 * @param url 文件的URL，用于定位要检查的文件。
 * @param server Vite开发服务器实例，包含配置和模块图等信息，用于检查文件服务的权限。
 * @returns 如果允许服务文件，则返回true；否则返回false。
 */
export function isFileServingAllowed(
  url: string,
  server: ViteDevServer,
): boolean {
  if (!server.config.server.fs.strict) return true // 限制为工作区 root 路径以外的文件的访问。

  const file = fsPathFromUrl(url) // 从URL转换为文件系统路径。

  if (server._fsDenyGlob(file)) return false // 检查文件是否在禁止访问的文件列表中，如果在，则不允许服务该文件。

  if (server.moduleGraph.safeModulesPath.has(file)) return true // 如果文件位于安全模块路径中，则允许服务该文件。

  // 检查文件是否位于允许访问的文件路径之一中，或者是否被允许路径的父目录包含，如果是，则允许服务该文件。
  if (
    server.config.server.fs.allow.some(
      (uri) => isSameFileUri(uri, file) || isParentDirectory(uri, file),
    )
  )
    return true

  // 如果不符合任何允许的条件，则不允许服务该文件。
  return false
}

function ensureServingAccess(
  url: string,
  server: ViteDevServer,
  res: ServerResponse,
  next: Connect.NextFunction,
): boolean {
  if (isFileServingAllowed(url, server)) {
    return true
  }
  if (isFileReadable(cleanUrl(url))) {
    const urlMessage = `The request url "${url}" is outside of Vite serving allow list.`
    const hintMessage = `
${server.config.server.fs.allow.map((i) => `- ${i}`).join('\n')}

Refer to docs https://vitejs.dev/config/server-options.html#server-fs-allow for configurations and more details.`

    server.config.logger.error(urlMessage)
    server.config.logger.warnOnce(hintMessage + '\n')
    res.statusCode = 403
    res.write(renderRestrictedErrorHTML(urlMessage + '\n' + hintMessage))
    res.end()
  } else {
    // if the file doesn't exist, we shouldn't restrict this path as it can
    // be an API call. Middlewares would issue a 404 if the file isn't handled
    next()
  }
  return false
}

function renderRestrictedErrorHTML(msg: string): string {
  // to have syntax highlighting and autocompletion in IDE
  const html = String.raw
  return html`
    <body>
      <h1>403 Restricted</h1>
      <p>${escapeHtml(msg).replace(/\n/g, '<br/>')}</p>
      <style>
        body {
          padding: 1em 2em;
        }
      </style>
    </body>
  `
}
