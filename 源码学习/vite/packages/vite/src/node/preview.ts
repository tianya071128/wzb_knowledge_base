import fs from 'node:fs'
import path from 'node:path'
import sirv from 'sirv'
import compression from '@polka/compression'
import connect from 'connect'
import type { Connect } from 'dep-types/connect'
import corsMiddleware from 'cors'
import { DEFAULT_PREVIEW_PORT } from './constants'
import type {
  HttpServer,
  ResolvedServerOptions,
  ResolvedServerUrls,
} from './server'
import { createServerCloseFn } from './server'
import type { CommonServerOptions } from './http'
import {
  httpServerStart,
  resolveHttpServer,
  resolveHttpsConfig,
  setClientErrorHandler,
} from './http'
import { openBrowser } from './server/openBrowser'
import { baseMiddleware } from './server/middlewares/base'
import { htmlFallbackMiddleware } from './server/middlewares/htmlFallback'
import { indexHtmlMiddleware } from './server/middlewares/indexHtml'
import { notFoundMiddleware } from './server/middlewares/notFound'
import { proxyMiddleware } from './server/middlewares/proxy'
import { resolveHostname, resolveServerUrls, shouldServeFile } from './utils'
import { printServerUrls } from './logger'
import { bindCLIShortcuts } from './shortcuts'
import type { BindCLIShortcutsOptions } from './shortcuts'
import { resolveConfig } from './config'
import type { InlineConfig, ResolvedConfig } from './config'

export interface PreviewOptions extends CommonServerOptions {}

export interface ResolvedPreviewOptions extends PreviewOptions {}

export function resolvePreviewOptions(
  preview: PreviewOptions | undefined,
  server: ResolvedServerOptions,
): ResolvedPreviewOptions {
  // The preview server inherits every CommonServerOption from the `server` config
  // except for the port to enable having both the dev and preview servers running
  // at the same time without extra configuration
  return {
    port: preview?.port,
    strictPort: preview?.strictPort ?? server.strictPort,
    host: preview?.host ?? server.host,
    https: preview?.https ?? server.https,
    open: preview?.open ?? server.open,
    proxy: preview?.proxy ?? server.proxy,
    cors: preview?.cors ?? server.cors,
    headers: preview?.headers ?? server.headers,
  }
}

export interface PreviewServer {
  /**
   * The resolved vite config object 已解析的vite配置对象
   */
  config: ResolvedConfig
  /**
   * Stop the server. 停止服务器
   */
  close(): Promise<void>
  /**
   * A connect app instance. 连接应用程序实例。
   * - Can be used to attach custom middlewares to the preview server. -可用于将自定义中间件附加到预览服务器。
   * - Can also be used as the handler function of a custom http server -也可以用作自定义http服务器的处理程序函数
   *   or as a middleware in any connect-style Node.js frameworks 或者作为任何连接风格Node.js框架中的中间件
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * native Node http server instance 本机节点http服务器实例
   */
  httpServer: HttpServer
  /**
   * The resolved urls Vite prints on the CLI. 已解析的URL Vite将打印在CLI上。
   * null before server is listening. 在服务器侦听之前为null。
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Print server urls 打印服务器网址
   */
  printUrls(): void
  /**
   * Bind CLI shortcuts 绑定 CLI 快捷方式
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<PreviewServer>): void
}

export type PreviewServerHook = (
  this: void,
  server: PreviewServer,
) => (() => void) | void | Promise<(() => void) | void>

/**
 * Starts the Vite server in preview mode, to simulate a production deployment 以预览模式启动Vite服务器，以模拟生产部署
 * 处理预览模式
 *  1. 调用 resolveConfig 方法解析配置项，得到一个配置对象
 *  2. 创建 http 服务器
 *  3. 注册各类中间件，以处理请求
 *  4. 启动 http 服务器
 */
export async function preview(
  inlineConfig: InlineConfig = {},
): Promise<PreviewServer> {
  // 解析配置项，得到一个配置对象
  const config = await resolveConfig(
    inlineConfig,
    'serve',
    'production',
    'production',
    true,
  )

  // 输出目录：D:\\低代码\\project\\wzb\\源码学习\\vite\\playground\\vue\\dist
  const distDir = path.resolve(config.root, config.build.outDir)
  // 检测是否可以提供服务
  if (
    !fs.existsSync(distDir) && // 目录不存在的话
    // error if no plugins implement `configurePreviewServer` 如果没有插件实现“configurePreviewServer”，则会出现错误
    config.plugins.every((plugin) => !plugin.configurePreviewServer) && // 检测是否有插件实现了 configurePreviewServer 钩子(用于自定义预览服务器)
    // error if called in CLI only. programmatic usage could access `httpServer` 如果仅在 CLI 中调用，则会出现错误。编程使用可以访问“httpServer”
    // and affect file serving 并影响文件服务
    process.argv[1]?.endsWith(path.normalize('bin/vite.js')) &&
    process.argv[2] === 'preview'
  ) {
    throw new Error(
      `The directory "${config.build.outDir}" does not exist. Did you build your project?`, // 目录“${config.build.outDir}”不存在。你建立你的项目了吗
    )
  }

  // 创建 http 服务器
  const app = connect() as Connect.Server
  const httpServer = await resolveHttpServer(
    config.preview,
    app,
    await resolveHttpsConfig(config.preview?.https),
  )
  setClientErrorHandler(httpServer, config.logger) // 设置 HTTP 错误处理程序

  const options = config.preview // 预览配置项 -- https://cn.vitejs.dev/config/preview-options.html#preview-proxy
  const logger = config.logger

  const server: PreviewServer = {
    config,
    middlewares: app,
    httpServer,
    close: createServerCloseFn(httpServer), // 创建一个用于关闭HTTP服务器的函数。
    resolvedUrls: null,
    // 打印启动的服务器 URLs
    printUrls() {
      if (server.resolvedUrls) {
        // 打印服务器URLs
        printServerUrls(server.resolvedUrls, options.host, logger.info)
      } else {
        throw new Error('cannot print server URLs before server is listening.') // 在服务器侦听之前无法打印服务器 URL
      }
    },
    // 绑定 CLI 快捷方式
    bindCLIShortcuts(options) {
      bindCLIShortcuts(server as PreviewServer, options)
    },
  }

  // apply server hooks from plugins 从插件应用服务器挂钩
  // 执行插件的 https://cn.vitejs.dev/guide/api-plugin.html#configurepreviewserver 钩子
  const postHooks: ((() => void) | void)[] = []
  for (const hook of config.getSortedPluginHooks('configurePreviewServer')) {
    postHooks.push(await hook(server))
  }

  // cors 中间件
  const { cors } = config.preview
  if (cors !== false) {
    app.use(corsMiddleware(typeof cors === 'boolean' ? {} : cors))
  }

  // proxy 代理中间件
  const { proxy } = config.preview
  if (proxy) {
    app.use(proxyMiddleware(httpServer, proxy, config))
  }

  // 内容压缩中间件
  app.use(compression())

  // base
  if (config.base !== '/') {
    app.use(baseMiddleware(config.rawBase, false))
  }

  // static assets 静态资源
  const headers = config.preview.headers
  const viteAssetMiddleware = (...args: readonly [any, any?, any?]) =>
    sirv(distDir, {
      etag: true,
      dev: true,
      extensions: [],
      ignores: false,
      setHeaders(res) {
        if (headers) {
          for (const name in headers) {
            res.setHeader(name, headers[name]!)
          }
        }
      },
      shouldServe(filePath) {
        return shouldServeFile(filePath, distDir)
      },
    })(...args)

  app.use(viteAssetMiddleware)

  // html fallback
  if (config.appType === 'spa' || config.appType === 'mpa') {
    app.use(htmlFallbackMiddleware(distDir, config.appType === 'spa'))
  }

  // apply post server hooks from plugins 从插件应用后服务器挂钩
  postHooks.forEach((fn) => fn && fn())

  if (config.appType === 'spa' || config.appType === 'mpa') {
    // transform index.html 转换index.html
    app.use(indexHtmlMiddleware(distDir, server))

    // handle 404s 处理 404
    app.use(notFoundMiddleware())
  }

  const hostname = await resolveHostname(options.host) // 返回并解析主机
  const port = options.port ?? DEFAULT_PREVIEW_PORT // 端口

  // 启动服务器
  await httpServerStart(httpServer, {
    port,
    strictPort: options.strictPort,
    host: hostname.host,
    logger,
  })

  // 解析服务器URLs
  server.resolvedUrls = await resolveServerUrls(
    httpServer,
    config.preview,
    config,
  )

  // 开发服务器启动时，自动在浏览器中打开应用程序。
  if (options.open) {
    const url = server.resolvedUrls?.local[0] ?? server.resolvedUrls?.network[0]
    if (url) {
      const path =
        typeof options.open === 'string' ? new URL(options.open, url).href : url
      openBrowser(path, true, logger)
    }
  }

  return server as PreviewServer
}
