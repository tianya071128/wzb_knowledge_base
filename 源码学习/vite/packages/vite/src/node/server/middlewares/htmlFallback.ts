import path from 'node:path'
import type { Connect } from 'dep-types/connect'
import { createDebugger } from '../../utils'
import type { FsUtils } from '../../fsUtils'
import { commonFsUtils } from '../../fsUtils'
import { cleanUrl } from '../../../shared/utils'

const debug = createDebugger('vite:html-fallback')

// 在 SPA 中, 如果访问的是 /(或/index)，那么在这里就处理一下请求地址，规整成 'xxx/xxx.html'
// 例如：访问 '/' --> '/index.html'
export function htmlFallbackMiddleware(
  root: string,
  spaFallback: boolean,
  fsUtils: FsUtils = commonFsUtils,
): Connect.NextHandleFunction {
  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...`
  return function viteHtmlFallbackMiddleware(req, res, next) {
    if (
      // Only accept GET or HEAD 只接受 GET 或 HEAD
      (req.method !== 'GET' && req.method !== 'HEAD') ||
      // Exclude default favicon requests 排除默认的网站图标请求
      req.url === '/favicon.ico' ||
      // Require Accept: text/html or */* 需要接受：text/html 或 */*
      !(
        req.headers.accept === undefined || // equivalent to `Accept: */*`
        req.headers.accept === '' || // equivalent to `Accept: */*`
        req.headers.accept.includes('text/html') ||
        req.headers.accept.includes('*/*')
      )
    ) {
      return next()
    }

    const url = cleanUrl(req.url!) // 请求 url
    const pathname = decodeURIComponent(url) // 请求路径

    // .html files are not handled by serveStaticMiddleware  .html 文件不由 serveStaticMiddleware 处理
    // so we need to check if the file exists 所以我们需要检查文件是否存在
    if (pathname.endsWith('.html')) {
      const filePath = path.join(root, pathname)
      if (fsUtils.existsSync(filePath)) {
        debug?.(`Rewriting ${req.method} ${req.url} to ${url}`)
        req.url = url
        return next()
      }
    }
    // trailing slash should check for fallback index.html 尾部斜杠应检查后备index.html
    else if (pathname[pathname.length - 1] === '/') {
      const filePath = path.join(root, pathname, 'index.html') // 生产完整的路径地址："D:\\低代码\\project\\wzb\\源码学习\\vite\\playground\\vue\\index.html"
      // 检测文件是否存在
      if (fsUtils.existsSync(filePath)) {
        const newUrl = url + 'index.html' // 重新组装一下路径
        debug?.(`Rewriting ${req.method} ${req.url} to ${newUrl}`)
        req.url = newUrl
        return next()
      }
    }
    // non-trailing slash should check for fallback .html
    else {
      const filePath = path.join(root, pathname + '.html')
      if (fsUtils.existsSync(filePath)) {
        const newUrl = url + '.html'
        debug?.(`Rewriting ${req.method} ${req.url} to ${newUrl}`)
        req.url = newUrl
        return next()
      }
    }

    if (spaFallback) {
      debug?.(`Rewriting ${req.method} ${req.url} to /index.html`)
      req.url = '/index.html'
    }

    next()
  }
}
