import fsp from 'node:fs/promises'
import path from 'node:path'
import type { OutgoingHttpHeaders as HttpServerHeaders } from 'node:http'
import type { ServerOptions as HttpsServerOptions } from 'node:https'
import type { Connect } from 'dep-types/connect'
import colors from 'picocolors'
import type { ProxyOptions } from './server/middlewares/proxy'
import type { Logger } from './logger'
import type { HttpServer } from './server'

export interface CommonServerOptions {
  /**
   * Specify server port. Note if the port is already being used, Vite will
   * automatically try the next available port so this may not be the actual
   * port the server ends up listening on.
   */
  port?: number
  /**
   * If enabled, vite will exit if specified port is already in use
   */
  strictPort?: boolean
  /**
   * Specify which IP addresses the server should listen on.
   * Set to 0.0.0.0 to listen on all addresses, including LAN and public addresses.
   */
  host?: string | boolean
  /**
   * Enable TLS + HTTP/2.
   * Note: this downgrades to TLS only when the proxy option is also used.
   */
  https?: HttpsServerOptions
  /**
   * Open browser window on startup
   */
  open?: boolean | string
  /**
   * Configure custom proxy rules for the dev server. Expects an object
   * of `{ key: options }` pairs.
   * Uses [`http-proxy`](https://github.com/http-party/node-http-proxy).
   * Full options [here](https://github.com/http-party/node-http-proxy#options).
   *
   * Example `vite.config.js`:
   * ``` js
   * module.exports = {
   *   proxy: {
   *     // string shorthand: /foo -> http://localhost:4567/foo
   *     '/foo': 'http://localhost:4567',
   *     // with options
   *     '/api': {
   *       target: 'http://jsonplaceholder.typicode.com',
   *       changeOrigin: true,
   *       rewrite: path => path.replace(/^\/api/, '')
   *     }
   *   }
   * }
   * ```
   */
  proxy?: Record<string, string | ProxyOptions>
  /**
   * Configure CORS for the dev server.
   * Uses https://github.com/expressjs/cors.
   * Set to `true` to allow all methods from any origin, or configure separately
   * using an object.
   */
  cors?: CorsOptions | boolean
  /**
   * Specify server response headers.
   */
  headers?: HttpServerHeaders
}

/**
 * https://github.com/expressjs/cors#configuration-options
 */
export interface CorsOptions {
  origin?:
    | CorsOrigin
    | ((origin: string, cb: (err: Error, origins: CorsOrigin) => void) => void)
  methods?: string | string[]
  allowedHeaders?: string | string[]
  exposedHeaders?: string | string[]
  credentials?: boolean
  maxAge?: number
  preflightContinue?: boolean
  optionsSuccessStatus?: number
}

export type CorsOrigin = boolean | string | RegExp | (string | RegExp)[]

/**
 * 根据提供的配置和应用创建一个 HTTP(HTTPS、HTTP2) 服务器。
 * @param {CommonServerOptions} options - 服务器配置选项，包括代理设置。
 * @param {Connect.Server} app - 已配置的Connect应用程序实例。
 * @param {HttpsServerOptions} [httpsOptions] - HTTPS服务器的额外选项（可选）。
 * @returns {Promise<HttpServer>} 创建的HTTP服务器的Promise。
 */
export async function resolveHttpServer(
  { proxy }: CommonServerOptions,
  app: Connect.Server,
  httpsOptions?: HttpsServerOptions,
): Promise<HttpServer> {
  // 如果没有提供HTTPS选项，则创建一个HTTP服务器
  if (!httpsOptions) {
    const { createServer } = await import('node:http')
    return createServer(app)
  }

  // #484 fallback to http1 when proxy is needed. 需要代理时回退到 http1
  // 使用了 proxy 时, 不支持使用 h2，此时使用 node:https 创建 HTTPS 服务器
  if (proxy) {
    const { createServer } = await import('node:https')
    return createServer(httpsOptions, app)
  }
  // 否则创建一个 HTTP2
  else {
    const { createSecureServer } = await import('node:http2')
    return createSecureServer(
      {
        // Manually increase the session memory to prevent 502 ENHANCE_YOUR_CALM 手动增加会话内存以防止 502 ENHANCE_YOUR_CALM
        // errors on large numbers of requests 大量请求时出错
        maxSessionMemory: 1000,
        ...httpsOptions,
        allowHTTP1: true,
      },
      // @ts-expect-error TODO: is this correct?
      app,
    )
  }
}

// 处理 server.https 配置项
export async function resolveHttpsConfig(
  https: HttpsServerOptions | undefined,
): Promise<HttpsServerOptions | undefined> {
  if (!https) return undefined

  const [ca, cert, key, pfx] = await Promise.all([
    readFileIfExists(https.ca), // CA 证书文件
    readFileIfExists(https.cert), // PEM 格式的证书链。
    readFileIfExists(https.key), // PEM 格式的私钥。
    readFileIfExists(https.pfx), // PFX 或 PKCS12 编码的私钥和证书链。
  ])
  return { ...https, ca, cert, key, pfx }
}

// 读取文件
async function readFileIfExists(value?: string | Buffer | any[]) {
  if (typeof value === 'string') {
    return fsp.readFile(path.resolve(value)).catch(() => value)
  }
  return value
}

/**
 * 启动一个HTTP服务器，并返回服务器监听的端口号。
 * @param httpServer 一个已经配置好的HttpServer实例，准备开始监听请求。
 * @param serverOptions 服务器启动选项，包括端口号、是否严格端口、主机名和日志记录器。
 * @returns 返回一个Promise，解析为服务器监听的端口号。
 */
export async function httpServerStart(
  httpServer: HttpServer,
  serverOptions: {
    port: number
    strictPort: boolean | undefined
    host: string | undefined
    logger: Logger
  },
): Promise<number> {
  let { port, strictPort, host, logger } = serverOptions

  // 尝试启动服务器并处理可能的错误，如端口已被占用。
  return new Promise((resolve, reject) => {
    // 错误处理函数，特别是处理端口被占用的情况。
    const onError = (e: Error & { code?: string }) => {
      if (e.code === 'EADDRINUSE') {
        if (strictPort) {
          httpServer.removeListener('error', onError)
          reject(new Error(`Port ${port} is already in use`)) // 端口 ${port} 已被使用
        } else {
          logger.info(`Port ${port} is in use, trying another one...`) // 端口 ${port} 正在使用，请尝试另一个...
          httpServer.listen(++port, host)
        }
      } else {
        httpServer.removeListener('error', onError)
        reject(e)
      }
    }

    httpServer.on('error', onError) // 监听错误事件。

    httpServer.listen(port, host, () => {
      httpServer.removeListener('error', onError) // 成功时移除错误监听器。
      resolve(port) // 解析承诺，返回监听的端口号。
    })
  })
}

export function setClientErrorHandler(
  server: HttpServer,
  logger: Logger,
): void {
  // 如果客户端连接触发 'error' 事件，则会在此处转发。
  server.on('clientError', (err, socket) => {
    let msg = '400 Bad Request' // 400 错误请求
    if ((err as any).code === 'HPE_HEADER_OVERFLOW') {
      msg = '431 Request Header Fields Too Large' // 431 请求标头字段太大
      logger.warn(
        colors.yellow(
          'Server responded with status code 431. ' + // 服务器响应状态码 431。
            'See https://vitejs.dev/guide/troubleshooting.html#_431-request-header-fields-too-large.',
        ),
      )
    }
    if ((err as any).code === 'ECONNRESET' || !socket.writable) {
      return
    }
    socket.end(`HTTP/1.1 ${msg}\r\n\r\n`)
  })
}
