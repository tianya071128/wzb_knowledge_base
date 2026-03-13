import type { Connect } from 'dep-types/connect'
import { joinUrlSegments, stripBase } from '../../utils'
import { cleanUrl, withTrailingSlash } from '../../../shared/utils'

// this middleware is only active when (base !== '/') 该中间件仅在 (base !== '/') 时才处于活动状态

export function baseMiddleware(
  rawBase: string,
  middlewareMode: boolean,
): Connect.NextHandleFunction {
  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...` 保留命名函数。该名称通过“DEBUG=connect:dispatcher ...”在调试日志中可见
  return function viteBaseMiddleware(req, res, next) {
    const url = req.url!
    const pathname = cleanUrl(url)
    const base = rawBase

    if (pathname.startsWith(base)) {
      // rewrite url to remove base. this ensures that other middleware does
      // not need to consider base being prepended or not
      req.url = stripBase(url, base)
      return next()
    }

    // skip redirect and error fallback on middleware mode, #4057
    if (middlewareMode) {
      return next()
    }

    if (pathname === '/' || pathname === '/index.html') {
      // redirect root visit to based url with search and hash
      res.writeHead(302, {
        Location: base + url.slice(pathname.length),
      })
      res.end()
      return
    }

    // non-based page visit
    const redirectPath =
      withTrailingSlash(url) !== base ? joinUrlSegments(base, url) : base
    if (req.headers.accept?.includes('text/html')) {
      res.writeHead(404, {
        'Content-Type': 'text/html',
      })
      res.end(
        `The server is configured with a public base URL of ${base} - ` +
          `did you mean to visit <a href="${redirectPath}">${redirectPath}</a> instead?`,
      )
      return
    } else {
      // not found for resources 找不到资源
      res.writeHead(404, {
        'Content-Type': 'text/plain',
      })
      res.end(
        `The server is configured with a public base URL of ${base} - ` + // 服务器配置有公共基本 URL
          `did you mean to visit ${redirectPath} instead?`, // 您的意思是访问 ${redirectPath} 吗？
      )
      return
    }
  }
}
