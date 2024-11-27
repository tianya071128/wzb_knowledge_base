import type { ErrorPayload, HMRPayload } from 'types/hmrPayload'
import type { ViteHotContext } from 'types/hot'
import type { InferCustomEventPayload } from 'types/customEvent'
import { HMRClient, HMRContext } from '../shared/hmr'
import { ErrorOverlay, overlayId } from './overlay'
import '@vite/env'

// injected by the hmr plugin when served 服务时由 hmr 插件注入
declare const __BASE__: string
declare const __SERVER_HOST__: string
declare const __HMR_PROTOCOL__: string | null
declare const __HMR_HOSTNAME__: string | null
declare const __HMR_PORT__: number | null
declare const __HMR_DIRECT_TARGET__: string
declare const __HMR_BASE__: string
declare const __HMR_TIMEOUT__: number
declare const __HMR_ENABLE_OVERLAY__: boolean

console.debug('[vite] connecting...')

// import.meta.url: 将特定上下文的元数据暴露给 JavaScript 模块。它包含了这个模块的信息，例如这个模块的 URL。
const importMetaUrl = new URL(import.meta.url)

// use server configuration, then fallback to inference 使用服务器配置，然后退到推理
const serverHost = __SERVER_HOST__ // localhost:9000/
// 如果没有注入 ws 协议的, 那么有当前环境决定
const socketProtocol =
  __HMR_PROTOCOL__ || (importMetaUrl.protocol === 'https:' ? 'wss' : 'ws')
const hmrPort = __HMR_PORT__
// 得出 ws 的 host: localhost:9000/
const socketHost = `${__HMR_HOSTNAME__ || importMetaUrl.hostname}:${
  hmrPort || importMetaUrl.port
}${__HMR_BASE__}`
const directSocketHost = __HMR_DIRECT_TARGET__
const base = __BASE__ || '/'

let socket: WebSocket
try {
  let fallback: (() => void) | undefined
  // only use fallback when port is inferred to prevent confusion 仅在推断端口时使用后备，以防止混淆
  if (!hmrPort) {
    fallback = () => {
      // fallback to connecting directly to the hmr server 退回到直接连接到HMR服务器
      // for servers which does not support proxying websocket 对于不支持代理websocket的服务器
      socket = setupWebSocket(socketProtocol, directSocketHost, () => {
        const currentScriptHostURL = new URL(import.meta.url)
        const currentScriptHost =
          currentScriptHostURL.host +
          currentScriptHostURL.pathname.replace(/@vite\/client$/, '')
        console.error(
          '[vite] failed to connect to websocket.\n' +
            'your current setup:\n' +
            `  (browser) ${currentScriptHost} <--[HTTP]--> ${serverHost} (server)\n` +
            `  (browser) ${socketHost} <--[WebSocket (failing)]--> ${directSocketHost} (server)\n` +
            'Check out your Vite / network configuration and https://vitejs.dev/config/server-options.html#server-hmr .',
        )
      })
      socket.addEventListener(
        'open',
        () => {
          console.info(
            '[vite] Direct websocket connection fallback. Check out https://vitejs.dev/config/server-options.html#server-hmr to remove the previous connection error.',
          )
        },
        { once: true },
      )
    }
  }

  socket = setupWebSocket(socketProtocol, socketHost, fallback)
} catch (error) {
  console.error(`[vite] failed to connect to websocket (${error}). `)
}

/**
 * 设置WebSocket连接
 *
 * @param protocol - WebSocket协议，如wss或ws
 * @param hostAndPath - WebSocket服务器的主机和路径
 * @param onCloseWithoutOpen - 可选参数，当WebSocket连接在未打开状态下关闭时调用的回调函数
 * @returns 返回创建的WebSocket对象
 */
function setupWebSocket(
  protocol: string,
  hostAndPath: string,
  onCloseWithoutOpen?: () => void,
) {
  // 创建WebSocket实例，使用传入的协议和服务器地址
  const socket = new WebSocket(`${protocol}://${hostAndPath}`, 'vite-hmr')
  // 初始化连接状态标志为false
  let isOpened = false

  // 监听 WebSocket 的打开事件
  socket.addEventListener(
    'open',
    () => {
      // 连接打开时，将连接状态设置为true，并通知监听器连接已建立
      isOpened = true
      notifyListeners('vite:ws:connect', { webSocket: socket })
    },
    { once: true },
  )

  // Listen for messages 监听信息
  // 监听 WebSocket 的消息事件
  socket.addEventListener('message', async ({ data }) => {
    // 接收到消息时，解析JSON格式的数据，并处理消息
    handleMessage(JSON.parse(data))
  })

  // ping server ping服务器
  // 监听 WebSocket 的关闭事件
  socket.addEventListener('close', async ({ wasClean }) => {
    // wasClean: 表示连接是否完全关闭。
    // 如果连接正常关闭，则不执行任何操作
    if (wasClean) return

    // 如果连接从未打开过，并且提供了关闭回调函数，则调用该回调函数
    if (!isOpened && onCloseWithoutOpen) {
      onCloseWithoutOpen()
      return
    }

    // 通知监听器WebSocket连接已断开
    notifyListeners('vite:ws:disconnect', { webSocket: socket })

    // 如果当前环境有document对象，则提示服务器连接丢失，并尝试重新连接
    if (hasDocument) {
      console.log(`[vite] server connection lost. polling for restart...`) // [vite]服务器连接丢失轮询重启
      await waitForSuccessfulPing(protocol, hostAndPath)
      location.reload()
    }
  })

  return socket
}

function cleanUrl(pathname: string): string {
  const url = new URL(pathname, 'http://vitejs.dev')
  url.searchParams.delete('direct')
  return url.pathname + url.search
}

let isFirstUpdate = true // 第一次 HMR 更新标识
const outdatedLinkTags = new WeakSet<HTMLLinkElement>()

// 防抖重载页面
const debounceReload = (time: number) => {
  let timer: ReturnType<typeof setTimeout> | null
  return () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      location.reload()
    }, time)
  }
}
const pageReload = debounceReload(50)

const hmrClient = new HMRClient(
  // 使用 console 打印
  console,
  {
    isReady: () => socket && socket.readyState === 1,
    send: (message) => socket.send(message),
  },
  // 通过 import 请求更新模块
  // 返回请求结果
  async function importUpdatedModule({
    acceptedPath, // 请求路径 -- /src/components/HelloWorld.vue
    timestamp, // 更新时间戳 -- 1724651557368
    explicitImportRequired,
    isWithinCircularImport,
  }) {
    const [acceptedPathWithoutQuery, query] = acceptedPath.split(`?`)
    // 请求模块
    const importPromise = import(
      /* @vite-ignore */
      base +
        acceptedPathWithoutQuery.slice(1) +
        `?${explicitImportRequired ? 'import&' : ''}t=${timestamp}${
          query ? `&${query}` : ''
        }`
    )
    if (isWithinCircularImport) {
      importPromise.catch(() => {
        console.info(
          // [hmr]${acceptedPath}未能应用hmr，因为它位于循环导入中。正在重新加载页面以重置执行顺序。
          `[hmr] ${acceptedPath} failed to apply HMR as it's within a circular import. Reloading page to reset the execution order. ` +
            // 要调试和打破循环导入，如果文件更改触发了循环依赖路径，您可以运行“vite--debug hmr”来记录循环依赖路径。
            `To debug and break the circular import, you can run \`vite --debug hmr\` to log the circular dependency path if a file change triggered it.`,
        )
        // 重载页面
        pageReload()
      })
    }
    return await importPromise
  },
)

/**
 * 处理 服务器 发送过来的消息: 根据不同的消息类型执行不同的操作，如连接、更新、自定义、完全重载和修剪
 * @param payload HMR负载，包含类型和数据
 * @returns
 */
async function handleMessage(payload: HMRPayload) {
  // 消息类型匹配
  switch (payload.type) {
    // 连接成功消息
    case 'connected':
      console.debug(`[vite] connected.`)
      hmrClient.messenger.flush()
      // proxy(nginx, docker) hmr ws maybe caused timeout, 代理(nginx, docker) HMR可能导致超时
      // so send ping package let ws keep alive. 所以发送ping包让ws保持活力
      setInterval(() => {
        if (socket.readyState === socket.OPEN) {
          socket.send('{"type":"ping"}')
        }
      }, __HMR_TIMEOUT__)
      break
    // 模块热替换执行
    case 'update':
      notifyListeners('vite:beforeUpdate', payload)
      // 是否是浏览器环境
      if (hasDocument) {
        // if this is the first update and there's already an error overlay, it 如果这是第一次更新，并且已经存在错误覆盖
        // means the page opened with existing server compile error and the whole 指打开时存在服务器编译错误的页面和整个
        // module script failed to load (since one of the nested imports is 500). 模块脚本加载失败（因为其中一个嵌套导入为500）。
        // in this case a normal update won't work and a full reload is needed. 在这种情况下，正常的更新将不起作用，需要完全重新加载。

        // 第一次 HMR 更新 && 存在浏览器错误
        if (isFirstUpdate && hasErrorOverlay()) {
          // 重载页面
          window.location.reload()
          return
        } else {
          // 如果启用了错误信息的展示, 那么就清空错误提示的展示
          if (enableOverlay) {
            clearErrorOverlay()
          }
          // 标记重置
          isFirstUpdate = false
        }
      }
      // payload 数据示例
      // {
      //   type: 'update', 消息类型
      //   updates: [
      //     {
      //       type: 'js-update', // 更新文件类型: js-update 和 css-update
      //       timestamp: 1724650923887, // 时间轴
      //       path: '/src/components/HelloWorld.vue', // 更新的文件路径
      //       acceptedPath: '/src/components/HelloWorld.vue',
      //       explicitImportRequired: false,
      //       isWithinCircularImport: false,
      //       ssrInvalidates: [],
      //     },
      //     {
      //       type: 'js-update',
      //       timestamp: 1724650923887,
      //       path: '/src/components/HelloWorld2.vue',
      //       acceptedPath: '/src/components/HelloWorld2.vue',
      //       explicitImportRequired: false,
      //       isWithinCircularImport: false,
      //       ssrInvalidates: [],
      //     },
      //   ],
      // }
      await Promise.all(
        payload.updates.map(async (update): Promise<void> => {
          // 如果是 js 文件更新
          if (update.type === 'js-update') {
            return hmrClient.queueUpdate(update)
          }

          // css-update
          // this is only sent when a css file referenced with <link> is updated
          const { path, timestamp } = update
          const searchUrl = cleanUrl(path)
          // can't use querySelector with `[href*=]` here since the link may be
          // using relative paths so we need to use link.href to grab the full
          // URL for the include check.
          const el = Array.from(
            document.querySelectorAll<HTMLLinkElement>('link'),
          ).find(
            (e) =>
              !outdatedLinkTags.has(e) && cleanUrl(e.href).includes(searchUrl),
          )

          if (!el) {
            return
          }

          const newPath = `${base}${searchUrl.slice(1)}${
            searchUrl.includes('?') ? '&' : '?'
          }t=${timestamp}`

          // rather than swapping the href on the existing tag, we will
          // create a new link tag. Once the new stylesheet has loaded we
          // will remove the existing link tag. This removes a Flash Of
          // Unstyled Content that can occur when swapping out the tag href
          // directly, as the new stylesheet has not yet been loaded.
          return new Promise((resolve) => {
            const newLinkTag = el.cloneNode() as HTMLLinkElement
            newLinkTag.href = new URL(newPath, el.href).href
            const removeOldEl = () => {
              el.remove()
              console.debug(`[vite] css hot updated: ${searchUrl}`)
              resolve()
            }
            newLinkTag.addEventListener('load', removeOldEl)
            newLinkTag.addEventListener('error', removeOldEl)
            outdatedLinkTags.add(el)
            el.after(newLinkTag)
          })
        }),
      )
      notifyListeners('vite:afterUpdate', payload)
      break
    case 'custom': {
      notifyListeners(payload.event, payload.data)
      break
    }
    case 'full-reload':
      notifyListeners('vite:beforeFullReload', payload) // 通知客户端注册的事件
      if (hasDocument) {
        if (payload.path && payload.path.endsWith('.html')) {
          // if html file is edited, only reload the page if the browser is 如果HTML文件被编辑，只有在浏览器是当前页面时才重新加载页面
          // currently on that page. 当前在该页面上
          const pagePath = decodeURI(location.pathname)
          const payloadPath = base + payload.path.slice(1)
          // 检测当前页面是否为被编辑的 html
          if (
            pagePath === payloadPath ||
            payload.path === '/index.html' ||
            (pagePath.endsWith('/') && pagePath + 'index.html' === payloadPath)
          ) {
            pageReload()
          }
          return
        } else {
          pageReload()
        }
      }
      break
    case 'prune':
      notifyListeners('vite:beforePrune', payload)
      await hmrClient.prunePaths(payload.paths)
      break
    case 'error': {
      notifyListeners('vite:error', payload)
      if (hasDocument) {
        const err = payload.err
        if (enableOverlay) {
          createErrorOverlay(err)
        } else {
          console.error(
            `[vite] Internal Server Error\n${err.message}\n${err.stack}`,
          )
        }
      }
      break
    }
    default: {
      const check: never = payload
      return check
    }
  }
}

/**
 * 通知监听器有新的事件发生
 *
 * 此函数的目的是将事件和相关数据传递给hmrClient，由它来通知所有注册了对应事件的监听器
 * 它不直接操作监听器，而是通过hmrClient来间接通知，这样的设计使得代码更加模块化，易于维护和测试
 *
 * @param event string类型的event参数，表示发生的事件名称
 * @param data any类型的data参数，表示与事件相关的数据，类型为any以便于传递各种不同类型的数据
 * @returns void此函数没有返回值
 */
function notifyListeners<T extends string>(
  event: T,
  data: InferCustomEventPayload<T>,
): void
function notifyListeners(event: string, data: any): void {
  hmrClient.notifyListeners(event, data)
}

const enableOverlay = __HMR_ENABLE_OVERLAY__ // 开发服务器错误的屏蔽启用标识 -- https://cn.vitejs.dev/config/server-options.html#server-hmr
const hasDocument = 'document' in globalThis

function createErrorOverlay(err: ErrorPayload['err']) {
  clearErrorOverlay()
  document.body.appendChild(new ErrorOverlay(err))
}

/**
 * 清除错误覆盖层
 *
 * 此函数负责关闭或隐藏所有具有指定ID的错误覆盖层元素
 * 通过文档查询选择器来获取所有匹配的元素，并调用它们的关闭方法
 */
function clearErrorOverlay() {
  document.querySelectorAll<ErrorOverlay>(overlayId).forEach((n) => n.close())
}

/**
 * 检查是否有错误覆盖层
 *
 * 此函数用于确定当前文档对象模型中是否存在特定的错误覆盖层它通过选择器匹配来查找元素，
 * 如果找到任何匹配的元素，则表示错误覆盖层存在，函数返回true；否则，返回false。
 *
 * @returns {boolean} 如果错误覆盖层存在，则返回true；否则返回false
 */
function hasErrorOverlay() {
  // 通过querySelectorAll检查是否存在具有指定ID的选择器元素，如果存在则返回true，否则返回false
  return document.querySelectorAll(overlayId).length
}

async function waitForSuccessfulPing(
  socketProtocol: string,
  hostAndPath: string,
  ms = 1000,
) {
  const pingHostProtocol = socketProtocol === 'wss' ? 'https' : 'http'

  const ping = async () => {
    // A fetch on a websocket URL will return a successful promise with status 400,
    // but will reject a networking error.
    // When running on middleware mode, it returns status 426, and an cors error happens if mode is not no-cors
    try {
      await fetch(`${pingHostProtocol}://${hostAndPath}`, {
        mode: 'no-cors',
        headers: {
          // Custom headers won't be included in a request with no-cors so (ab)use one of the
          // safelisted headers to identify the ping request
          Accept: 'text/x-vite-ping',
        },
      })
      return true
    } catch {}
    return false
  }

  if (await ping()) {
    return
  }
  await wait(ms)

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (document.visibilityState === 'visible') {
      if (await ping()) {
        break
      }
      await wait(ms)
    } else {
      await waitForWindowShow()
    }
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function waitForWindowShow() {
  return new Promise<void>((resolve) => {
    const onChange = async () => {
      if (document.visibilityState === 'visible') {
        resolve()
        document.removeEventListener('visibilitychange', onChange)
      }
    }
    document.addEventListener('visibilitychange', onChange)
  })
}

const sheetsMap = new Map<string, HTMLStyleElement>()

// collect existing style elements that may have been inserted during SSR 收集可能在SSR期间插入的现有样式元素
// to avoid FOUC or duplicate styles 避免FOUC或重复样式
if ('document' in globalThis) {
  document
    .querySelectorAll<HTMLStyleElement>('style[data-vite-dev-id]')
    .forEach((el) => {
      sheetsMap.set(el.getAttribute('data-vite-dev-id')!, el)
    })
}

const cspNonce =
  'document' in globalThis
    ? document.querySelector<HTMLMetaElement>('meta[property=csp-nonce]')?.nonce
    : undefined

// all css imports should be inserted at the same position
// because after build it will be a single css file
let lastInsertedStyle: HTMLStyleElement | undefined

export function updateStyle(id: string, content: string): void {
  let style = sheetsMap.get(id)
  if (!style) {
    style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.setAttribute('data-vite-dev-id', id)
    style.textContent = content
    if (cspNonce) {
      style.setAttribute('nonce', cspNonce)
    }

    if (!lastInsertedStyle) {
      document.head.appendChild(style)

      // reset lastInsertedStyle after async
      // because dynamically imported css will be splitted into a different file
      setTimeout(() => {
        lastInsertedStyle = undefined
      }, 0)
    } else {
      lastInsertedStyle.insertAdjacentElement('afterend', style)
    }
    lastInsertedStyle = style
  } else {
    style.textContent = content
  }
  sheetsMap.set(id, style)
}

export function removeStyle(id: string): void {
  const style = sheetsMap.get(id)
  if (style) {
    document.head.removeChild(style)
    sheetsMap.delete(id)
  }
}

/**
 * 在 vite 内部, 如果检测到你使用了 import.meta.hot 相关 API, 那么就会自动注意一些代码:
 *  import {createHotContext as __vite__createHotContext} from "/@vite/client";
 *  import.meta.hot = __vite__createHotContext("/src/components/test.js");
 *
 *    这样, HMR 的 API 基本上都是 HMRContext 里暴露出来的, 这样就可以收集到所有的 HMR 模块进行处理
 *
 * @param ownerPath 模块文件路径
 */
export function createHotContext(ownerPath: string): ViteHotContext {
  return new HMRContext(hmrClient, ownerPath)
}

/**
 * urls here are dynamic import() urls that couldn't be statically analyzed
 */
export function injectQuery(url: string, queryToInject: string): string {
  // skip urls that won't be handled by vite
  if (url[0] !== '.' && url[0] !== '/') {
    return url
  }

  // can't use pathname from URL since it may be relative like ../
  const pathname = url.replace(/[?#].*$/, '')
  const { search, hash } = new URL(url, 'http://vitejs.dev')

  return `${pathname}?${queryToInject}${search ? `&` + search.slice(1) : ''}${
    hash || ''
  }`
}

export { ErrorOverlay }
