import path from 'node:path'
import type { IncomingMessage, Server } from 'node:http'
import { STATUS_CODES, createServer as createHttpServer } from 'node:http'
import type { ServerOptions as HttpsServerOptions } from 'node:https'
import { createServer as createHttpsServer } from 'node:https'
import type { Socket } from 'node:net'
import type { Duplex } from 'node:stream'
import colors from 'picocolors'
import type { WebSocket as WebSocketRaw } from 'ws'
import { WebSocketServer as WebSocketServerRaw_ } from 'ws'
import type { WebSocket as WebSocketTypes } from 'dep-types/ws'
import type { CustomPayload, ErrorPayload, HMRPayload } from 'types/hmrPayload'
import type { InferCustomEventPayload } from 'types/customEvent'
import type { ResolvedConfig } from '..'
import { isObject } from '../utils'
import type { HMRChannel } from './hmr'
import type { HttpServer } from '.'

/* In Bun, the `ws` module is overridden to hook into the native code. Using the bundled `js` version 在 Bun 中，“ws”模块被重写以挂钩到本机代码。使用捆绑的“js”版本
 * of `ws` will not work as Bun's req.socket does not allow reading/writing to the underlying socket. `ws` 将不起作用，因为 Bun 的 req.socket 不允许读/写底层套接字
 */
const WebSocketServerRaw = process.versions.bun
  ? // @ts-expect-error: Bun defines `import.meta.require`
    import.meta.require('ws').WebSocketServer
  : WebSocketServerRaw_

export const HMR_HEADER = 'vite-hmr'

export type WebSocketCustomListener<T> = (
  data: T,
  client: WebSocketClient,
) => void

export interface WebSocketServer extends HMRChannel {
  /**
   * Listen on port and host
   */
  listen(): void
  /**
   * Get all connected clients.
   */
  clients: Set<WebSocketClient>
  /**
   * Disconnect all clients and terminate the server.
   */
  close(): Promise<void>
  /**
   * Handle custom event emitted by `import.meta.hot.send` 处理“import.meta.hot.send”发出的自定义事件
   */
  on: WebSocketTypes.Server['on'] & {
    <T extends string>(
      event: T,
      listener: WebSocketCustomListener<InferCustomEventPayload<T>>,
    ): void
  }
  /**
   * Unregister event listener.
   */
  off: WebSocketTypes.Server['off'] & {
    (event: string, listener: Function): void
  }
}

export interface WebSocketClient {
  /**
   * Send event to the client
   */
  send(payload: HMRPayload): void
  /**
   * Send custom event
   */
  send(event: string, payload?: CustomPayload['data']): void
  /**
   * The raw WebSocket instance
   * @advanced
   */
  socket: WebSocketTypes
}

const wsServerEvents = [
  'connection',
  'error',
  'headers',
  'listening',
  'message',
]

/**
 * 创建一个WebSocket服务器。
 */
export function createWebSocketServer(
  server: HttpServer | null,
  config: ResolvedConfig,
  httpsOptions?: HttpsServerOptions,
): WebSocketServer {
  let wss: WebSocketServerRaw_
  let wsHttpServer: Server | undefined = undefined

  const hmr = isObject(config.server.hmr) && config.server.hmr // server.hmr 禁用或配置 HMR 连接（用于 HMR websocket 必须使用不同的 http 服务器地址的情况）。 -- https://cn.vitejs.dev/config/server-options.html#server-hmr
  const hmrServer = hmr && hmr.server // server.hmr.server：自定义配置 HMR 连接的服务器
  const hmrPort = hmr && hmr.port // server.hmr.port：配置 HMR 连接的端口
  // TODO: the main server port may not have been chosen yet as it may use the next available 主服务器端口可能尚未选择，因为它可能使用下一个可用的端口
  const portsAreCompatible = !hmrPort || hmrPort === config.server.port
  // 如果 ws 连接的端口与 http 服务的端口一致的话，可以共享 http 服务器 -- 因为 ws 协议是通过 http 进行连接的
  const wsServer = hmrServer || (portsAreCompatible && server)
  let hmrServerWsListener: (
    req: InstanceType<typeof IncomingMessage>,
    socket: Duplex,
    head: Buffer,
  ) => void
  // 自定义事件监听器映射
  const customListeners = new Map<string, Set<WebSocketCustomListener<any>>>()
  const clientsMap = new WeakMap<WebSocketRaw, WebSocketClient>()
  // 设置默认端口和主机
  const port = hmrPort || 24678
  const host = (hmr && hmr.host) || undefined

  // 如果可以共享服务器(或用户自定义配置)，那么通过 ws 库实现 ws 连接
  if (wsServer) {
    let hmrBase = config.base
    const hmrPath = hmr ? hmr.path : undefined
    if (hmrPath) {
      hmrBase = path.posix.join(hmrBase, hmrPath)
    }
    // 基于 ws 库创建 ws 服务器
    wss = new WebSocketServerRaw({ noServer: true })
    hmrServerWsListener = (req, socket, head) => {
      if (
        req.headers['sec-websocket-protocol'] === HMR_HEADER &&
        req.url === hmrBase
      ) {
        // 启动协议变更为 ws
        wss.handleUpgrade(req, socket as Socket, head, (ws) => {
          // 连接成功, 发送特定事件
          wss.emit('connection', ws, req)
        })
      }
    }
    // 监听服务器协议变更事件 -- https://nodejs.cn/api/http.html#%E4%BA%8B%E4%BB%B6upgrade
    wsServer.on('upgrade', hmrServerWsListener)
  }
  // 否则自定义创建 HTTP 服务器实现 ws 连接
  else {
    // http server request handler keeps the same with http 服务器请求处理程序与
    // https://github.com/websockets/ws/blob/45e17acea791d865df6b255a55182e9c42e5877a/lib/websocket-server.js#L88-L96
    const route = ((_, res) => {
      const statusCode = 426
      const body = STATUS_CODES[statusCode]
      if (!body)
        throw new Error(`No body text found for the ${statusCode} status code`)

      res.writeHead(statusCode, {
        'Content-Length': body.length,
        'Content-Type': 'text/plain',
      })
      res.end(body)
    }) as Parameters<typeof createHttpServer>[1]
    if (httpsOptions) {
      wsHttpServer = createHttpsServer(httpsOptions, route)
    } else {
      wsHttpServer = createHttpServer(route)
    }
    // vite dev server in middleware mode
    // need to call ws listen manually
    wss = new WebSocketServerRaw({ server: wsHttpServer })
  }

  // ws 连接后, 会触发 connection 事件, 在这里进行 ws 数据交互
  wss.on('connection', (socket) => {
    socket.on('message', (raw) => {
      if (!customListeners.size) return
      let parsed: any
      try {
        parsed = JSON.parse(String(raw))
      } catch {}
      if (!parsed || parsed.type !== 'custom' || !parsed.event) return
      const listeners = customListeners.get(parsed.event)
      if (!listeners?.size) return
      const client = getSocketClient(socket)
      listeners.forEach((listener) => listener(parsed.data, client))
    })
    socket.on('error', (err) => {
      config.logger.error(`${colors.red(`ws error:`)}\n${err.stack}`, {
        timestamp: true,
        error: err,
      })
    })
    // 与客户端建立连接后发送一条消息
    socket.send(JSON.stringify({ type: 'connected' }))
    if (bufferedError) {
      socket.send(JSON.stringify(bufferedError))
      bufferedError = null
    }
  })

  // ws 连接失败
  wss.on('error', (e: Error & { code: string }) => {
    if (e.code === 'EADDRINUSE') {
      config.logger.error(
        colors.red(`WebSocket server error: Port is already in use`), // WebSocket 服务器错误：端口已在使用中
        { error: e },
      )
    } else {
      config.logger.error(
        colors.red(`WebSocket server error:\n${e.stack || e.message}`), // WebSocket 服务器错误
        { error: e },
      )
    }
  })

  // Provide a wrapper to the ws client so we can send messages in JSON format 为 ws 客户端提供一个包装器，以便我们可以以 JSON 格式发送消息
  // To be consistent with server.ws.send 与server.ws.send保持一致
  function getSocketClient(socket: WebSocketRaw) {
    if (!clientsMap.has(socket)) {
      clientsMap.set(socket, {
        send: (...args) => {
          let payload: HMRPayload
          if (typeof args[0] === 'string') {
            payload = {
              type: 'custom',
              event: args[0],
              data: args[1],
            }
          } else {
            payload = args[0]
          }
          socket.send(JSON.stringify(payload))
        },
        socket,
      })
    }
    return clientsMap.get(socket)!
  }

  // On page reloads, if a file fails to compile and returns 500, the server 在页面重新加载时，如果文件编译失败并返回500，则服务器
  // sends the error payload before the client connection is established. 在建立客户端连接之前发送错误负载
  // If we have no open clients, buffer the error and send it to the next 如果我们没有打开的客户端，请缓冲错误并将其发送到下一个
  // connected client. 连接的客户端。
  let bufferedError: ErrorPayload | null = null

  // 暴露一些操作方法用于 ws 服务器
  return {
    name: 'ws',
    listen: () => {
      wsHttpServer?.listen(port, host)
    },
    on: ((event: string, fn: () => void) => {
      if (wsServerEvents.includes(event)) wss.on(event, fn)
      else {
        if (!customListeners.has(event)) {
          customListeners.set(event, new Set())
        }
        customListeners.get(event)!.add(fn)
      }
    }) as WebSocketServer['on'],
    off: ((event: string, fn: () => void) => {
      if (wsServerEvents.includes(event)) {
        wss.off(event, fn)
      } else {
        customListeners.get(event)?.delete(fn)
      }
    }) as WebSocketServer['off'],

    get clients() {
      return new Set(Array.from(wss.clients).map(getSocketClient))
    },
    /** 发送消息 */
    send(...args: any[]) {
      let payload: HMRPayload // 定义热模块替换（HMR）的载荷对象
      // 判断传入的第一个参数是否为字符串，如果是则构建一个自定义事件的载荷
      if (typeof args[0] === 'string') {
        payload = {
          type: 'custom',
          event: args[0],
          data: args[1],
        }
      }
      // 否则直接使用传入的参数作为载荷
      else {
        payload = args[0]
      }

      // 如果是错误类型且没有客户端连接，则缓冲错误信息，避免丢失
      if (payload.type === 'error' && !wss.clients.size) {
        bufferedError = payload
        return
      }

      // 将载荷对象转换为JSON字符串
      const stringified = JSON.stringify(payload)
      // 遍历所有WebSocket客户端连接
      wss.clients.forEach((client) => {
        // readyState 1 means the connection is open 就绪状态1表示连接是打开的
        if (client.readyState === 1) {
          client.send(stringified) // 发送消息
        }
      })
    },

    close() {
      // should remove listener if hmr.server is set
      // otherwise the old listener swallows all WebSocket connections
      if (hmrServerWsListener && wsServer) {
        wsServer.off('upgrade', hmrServerWsListener)
      }
      return new Promise((resolve, reject) => {
        wss.clients.forEach((client) => {
          client.terminate()
        })
        wss.close((err) => {
          if (err) {
            reject(err)
          } else {
            if (wsHttpServer) {
              wsHttpServer.close((err) => {
                if (err) {
                  reject(err)
                } else {
                  resolve()
                }
              })
            } else {
              resolve()
            }
          }
        })
      })
    },
  }
}
