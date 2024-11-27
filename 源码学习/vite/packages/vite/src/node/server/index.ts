import path from 'node:path'
import { execSync } from 'node:child_process'
import type * as net from 'node:net'
import { get as httpGet } from 'node:http'
import { get as httpsGet } from 'node:https'
import type * as http from 'node:http'
import { performance } from 'node:perf_hooks'
import type { Http2SecureServer } from 'node:http2'
import connect from 'connect'
import corsMiddleware from 'cors'
import colors from 'picocolors'
import chokidar from 'chokidar'
import type { FSWatcher, WatchOptions } from 'dep-types/chokidar'
import type { Connect } from 'dep-types/connect'
import launchEditorMiddleware from 'launch-editor-middleware'
import type { SourceMap } from 'rollup'
import picomatch from 'picomatch'
import type { Matcher } from 'picomatch'
import type { CommonServerOptions } from '../http'
import {
  httpServerStart,
  resolveHttpServer,
  resolveHttpsConfig,
  setClientErrorHandler,
} from '../http'
import type { InlineConfig, ResolvedConfig } from '../config'
import { isDepsOptimizerEnabled, resolveConfig } from '../config'
import {
  diffDnsOrderChange,
  isInNodeModules,
  isObject,
  isParentDirectory,
  mergeConfig,
  normalizePath,
  promiseWithResolvers,
  resolveHostname,
  resolveServerUrls,
} from '../utils'
import { getFsUtils } from '../fsUtils'
import { ssrLoadModule } from '../ssr/ssrModuleLoader'
import { ssrFixStacktrace, ssrRewriteStacktrace } from '../ssr/ssrStacktrace'
import { ssrTransform } from '../ssr/ssrTransform'
import { ERR_OUTDATED_OPTIMIZED_DEP } from '../plugins/optimizedDeps'
import { getDepsOptimizer, initDepsOptimizer } from '../optimizer'
import { bindCLIShortcuts } from '../shortcuts'
import type { BindCLIShortcutsOptions } from '../shortcuts'
import { CLIENT_DIR, DEFAULT_DEV_PORT } from '../constants'
import type { Logger } from '../logger'
import { printServerUrls } from '../logger'
import {
  createNoopWatcher,
  getResolvedOutDirs,
  resolveChokidarOptions,
  resolveEmptyOutDir,
} from '../watch'
import { initPublicFiles } from '../publicDir'
import { getEnvFilesForMode } from '../env'
import type { FetchResult } from '../../runtime/types'
import { ssrFetchModule } from '../ssr/ssrFetchModule'
import type { PluginContainer } from './pluginContainer'
import { ERR_CLOSED_SERVER, createPluginContainer } from './pluginContainer'
import type { WebSocketServer } from './ws'
import { createWebSocketServer } from './ws'
import { baseMiddleware } from './middlewares/base'
import { proxyMiddleware } from './middlewares/proxy'
import { htmlFallbackMiddleware } from './middlewares/htmlFallback'
import {
  cachedTransformMiddleware,
  transformMiddleware,
} from './middlewares/transform'
import {
  createDevHtmlTransformFn,
  indexHtmlMiddleware,
} from './middlewares/indexHtml'
import {
  servePublicMiddleware,
  serveRawFsMiddleware,
  serveStaticMiddleware,
} from './middlewares/static'
import { timeMiddleware } from './middlewares/time'
import type { ModuleNode } from './moduleGraph'
import { ModuleGraph } from './moduleGraph'
import { notFoundMiddleware } from './middlewares/notFound'
import { errorMiddleware, prepareError } from './middlewares/error'
import type { HMRBroadcaster, HmrOptions } from './hmr'
import {
  createHMRBroadcaster,
  createServerHMRChannel,
  getShortName,
  handleHMRUpdate,
  updateModules,
} from './hmr'
import { openBrowser as _openBrowser } from './openBrowser'
import type { TransformOptions, TransformResult } from './transformRequest'
import { transformRequest } from './transformRequest'
import { searchForWorkspaceRoot } from './searchRoot'
import { warmupFiles } from './warmup'

export interface ServerOptions extends CommonServerOptions {
  /**
   * Configure HMR-specific options (port, host, path & protocol)
   */
  hmr?: HmrOptions | boolean
  /**
   * Warm-up files to transform and cache the results in advance. This improves the
   * initial page load during server starts and prevents transform waterfalls.
   */
  warmup?: {
    /**
     * The files to be transformed and used on the client-side. Supports glob patterns.
     */
    clientFiles?: string[]
    /**
     * The files to be transformed and used in SSR. Supports glob patterns.
     */
    ssrFiles?: string[]
  }
  /**
   * chokidar watch options or null to disable FS watching
   * https://github.com/paulmillr/chokidar#api
   */
  watch?: WatchOptions | null
  /**
   * Create Vite dev server to be used as a middleware in an existing server
   * @default false
   */
  middlewareMode?:
    | boolean
    | {
        /**
         * Parent server instance to attach to
         *
         * This is needed to proxy WebSocket connections to the parent server.
         */
        server: http.Server
      }
  /**
   * Options for files served via '/\@fs/'.
   */
  fs?: FileSystemServeOptions
  /**
   * Origin for the generated asset URLs.
   *
   * @example `http://127.0.0.1:8080`
   */
  origin?: string
  /**
   * Pre-transform known direct imports
   * @default true
   */
  preTransformRequests?: boolean
  /**
   * Whether or not to ignore-list source files in the dev server sourcemap, used to populate
   * the [`x_google_ignoreList` source map extension](https://developer.chrome.com/blog/devtools-better-angular-debugging/#the-x_google_ignorelist-source-map-extension).
   *
   * By default, it excludes all paths containing `node_modules`. You can pass `false` to
   * disable this behavior, or, for full control, a function that takes the source path and
   * sourcemap path and returns whether to ignore the source path.
   */
  sourcemapIgnoreList?:
    | false
    | ((sourcePath: string, sourcemapPath: string) => boolean)
}

export interface ResolvedServerOptions
  extends Omit<ServerOptions, 'fs' | 'middlewareMode' | 'sourcemapIgnoreList'> {
  fs: Required<FileSystemServeOptions>
  middlewareMode: NonNullable<ServerOptions['middlewareMode']>
  sourcemapIgnoreList: Exclude<
    ServerOptions['sourcemapIgnoreList'],
    false | undefined
  >
}

export interface FileSystemServeOptions {
  /**
   * Strictly restrict file accessing outside of allowing paths.
   *
   * Set to `false` to disable the warning
   *
   * @default true
   */
  strict?: boolean

  /**
   * Restrict accessing files outside the allowed directories.
   *
   * Accepts absolute path or a path relative to project root.
   * Will try to search up for workspace root by default.
   */
  allow?: string[]

  /**
   * Restrict accessing files that matches the patterns.
   *
   * This will have higher priority than `allow`.
   * picomatch patterns are supported.
   *
   * @default ['.env', '.env.*', '*.crt', '*.pem']
   */
  deny?: string[]

  /**
   * Enable caching of fs calls. It is enabled by default if no custom watch ignored patterns are provided.
   *
   * @experimental
   * @default undefined
   */
  cachedChecks?: boolean
}

export type ServerHook = (
  this: void,
  server: ViteDevServer,
) => (() => void) | void | Promise<(() => void) | void>

export type HttpServer = http.Server | Http2SecureServer

export interface ViteDevServer {
  /**
   * The resolved vite config object 解析后的vite配置对象
   */
  config: ResolvedConfig
  /**
   * A connect app instance. 连接应用程序实例。
   * - Can be used to attach custom middlewares to the dev server. 可用于将自定义中间件连接到开发服务器。
   * - Can also be used as the handler function of a custom http server 也可以用作自定义http服务器的处理程序函数
   *   or as a middleware in any connect-style Node.js frameworks 或者作为任何连接风格Node.js框架中的中间件
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * native Node http server instance 本机节点http服务器实例
   * will be null in middleware mode 在中间件模式中将为null
   */
  httpServer: HttpServer | null
  /**
   * chokidar watcher instance chokidar观察者实例
   * https://github.com/paulmillr/chokidar#api
   */
  watcher: FSWatcher
  /**
   * web socket server with `send(payload)` method 具有“send（payload）”方法的web套接字服务器
   * @deprecated use `hot` instead
   */
  ws: WebSocketServer
  /**
   * HMR broadcaster that can be used to send custom HMR messages to the client HMR广播器，可用于向客户端发送自定义HMR消息
   *
   * Always sends a message to at least a WebSocket client. Any third party can 始终至少向WebSocket客户端发送消息。任何第三方都可以
   * add a channel to the broadcaster to process messages 向广播添加频道以处理消息
   */
  hot: HMRBroadcaster
  /**
   * Rollup plugin container that can run plugin hooks on a given file 可以在给定文件上运行插件挂钩的汇总插件容器
   */
  pluginContainer: PluginContainer
  /**
   * Module graph that tracks the import relationships, url to file mapping 跟踪导入关系、url 到文件映射的模块图
   * and hmr state. 和hmr状态
   */
  moduleGraph: ModuleGraph
  /**
   * The resolved urls Vite prints on the CLI. null in middleware mode or 已解析的URL Vite将打印在CLI上。在中间件模式下为null或
   * before `server.listen` is called. 在调用“server.elisten”之前。
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Programmatically resolve, load and transform a URL and get the result 以编程方式解析、加载和转换URL并获得结果
   * without going through the http request pipeline. 而不经过http请求管道
   */
  transformRequest(
    url: string,
    options?: TransformOptions,
  ): Promise<TransformResult | null>
  /**
   * Same as `transformRequest` but only warm up the URLs so the next request 与“transformRequest”相同，但仅预热URL，以便下一个请求
   * will already be cached. The function will never throw as it handles and 将已被缓存。函数在处理和时永远不会抛出
   * reports errors internally. 内部报告错误
   */
  warmupRequest(url: string, options?: TransformOptions): Promise<void>
  /**
   * Apply vite built-in HTML transforms and any plugin HTML transforms. 应用vite内置HTML转换和任何插件HTML转换
   */
  transformIndexHtml(
    url: string,
    html: string,
    originalUrl?: string,
  ): Promise<string>
  /**
   * Transform module code into SSR format. 将模块代码转换为SSR格式
   */
  ssrTransform(
    code: string,
    inMap: SourceMap | { mappings: '' } | null,
    url: string,
    originalCode?: string,
  ): Promise<TransformResult | null>
  /**
   * Load a given URL as an instantiated module for SSR. 加载给定的URL作为SSR的实例化模块
   */
  ssrLoadModule(
    url: string,
    opts?: { fixStacktrace?: boolean },
  ): Promise<Record<string, any>>
  /**
   * Fetch information about the module for Vite SSR runtime. 获取有关Vite SSR运行时模块的信息
   * @experimental
   */
  ssrFetchModule(id: string, importer?: string): Promise<FetchResult>
  /**
   * Returns a fixed version of the given stack 返回给定堆栈的固定版本
   */
  ssrRewriteStacktrace(stack: string): string
  /**
   * Mutates the given SSR error by rewriting the stacktrace 通过重写堆栈来更改给定的SSR错误
   */
  ssrFixStacktrace(e: Error): void
  /**
   * Triggers HMR for a module in the module graph. You can use the `server.moduleGraph` 触发模块图中某个模块的HMR。您可以使用`server.moduleGraph`
   * API to retrieve the module to be reloaded. If `hmr` is false, this is a no-op. API检索要重新加载的模块。如果“hmr”为false，则这是一个无操作
   */
  reloadModule(module: ModuleNode): Promise<void>
  /**
   * Start the server. 启动服务器
   */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
  /**
   * Stop the server. 停止服务器
   */
  close(): Promise<void>
  /**
   * Print server urls 打印服务器URL
   */
  printUrls(): void
  /**
   * Bind CLI shortcuts 绑定CLI快捷方式
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<ViteDevServer>): void
  /**
   * Restart the server. 重新启动服务器
   *
   * @param forceOptimize - force the optimizer to re-bundle, same as --force cli flag 强制优化器重新绑定，与--force-cli标志相同
   */
  restart(forceOptimize?: boolean): Promise<void>

  /**
   * Open browser 打开浏览器
   */
  openBrowser(): void
  /**
   * Calling `await server.waitForRequestsIdle(id)` will wait until all static imports 调用`wait-server.waitForRequestsIdle（id）`将等待所有静态导入
   * are processed. If called from a load or transform plugin hook, the id needs to be 被处理。如果从加载或转换插件挂钩调用，则id需要
   * passed as a parameter to avoid deadlocks. Calling this function after the first 作为参数传递以避免死锁。在第一个之后调用此函数
   * static imports section of the module graph has been processed will resolve immediately. 静态导入部分的模块图已被处理，将立即解析。
   * @experimental
   */
  waitForRequestsIdle: (ignoredId?: string) => Promise<void>
  /**
   * @internal
   */
  _registerRequestProcessing: (id: string, done: () => Promise<unknown>) => void
  /**
   * @internal
   */
  _onCrawlEnd(cb: () => void): void
  /**
   * @internal
   */
  _setInternalServer(server: ViteDevServer): void
  /**
   * @internal
   */
  _importGlobMap: Map<string, { affirmed: string[]; negated: string[] }[]>
  /**
   * 重启服务器 Promise, 一次只允许重启一次
   * @internal
   */
  _restartPromise: Promise<void> | null
  /**
   * @internal
   */
  _forceOptimizeOnRestart: boolean
  /**
   * @internal 正在请求的队列
   */
  _pendingRequests: Map<
    string,
    {
      request: Promise<TransformResult | null>
      timestamp: number
      abort: () => void
    }
  >
  /**
   * @internal
   */
  _fsDenyGlob: Matcher
  /**
   * 快捷键配置项
   * @internal
   */
  _shortcutsOptions?: BindCLIShortcutsOptions<ViteDevServer>
  /**
   * @internal
   */
  _currentServerPort?: number | undefined
  /**
   * @internal
   */
  _configServerPort?: number | undefined
}

export interface ResolvedServerUrls {
  local: string[]
  network: string[]
}

// 创建服务器实例
export function createServer(
  inlineConfig: InlineConfig = {},
): Promise<ViteDevServer> {
  return _createServer(inlineConfig, { hotListen: true })
}

/**
 * 创建服务器实例
 *  1. 解析配置项，得到配置对象
 *  2. 创建 ws 服务
 *  3. 创建 hot 广播实例，并添加两个通道(基于 ws 服务的通道以及 HMR 通道)
 *  4. 启动 chokidar 监听文件变化器，并注册一些监听文件相关事件
 *  5. 执行插件的 configureServer 钩子：https://cn.vitejs.dev/guide/api-plugin.html#configureserver
 *  6. 注册各类中间件
 *      6.1 记录请求处理的时间，如果开启了的话
 *      6.2 处理 cors 中间件
 *      6.3 缓存转换中间件，检测请求是否走的是协商缓存
 *      6.4 proxy 代理中间件
 *      6.5 在编辑器支持中打开：访问 /__open-in-editor?file=文件路径 时, 会通过 launch-editor(https://github.com/yyx990803/launch-editor) 在编辑器中打开对应的文件
 *      6.6 静态文件中间件：在 /public 下提供静态文件
 *      6.7 用于处理Vite开发服务器的资源转换。
 *      6.8 提供静态文件？- serveRawFsMiddleware、serveStaticMiddleware
 *      6.9 转换index.html
 *      6.10 处理404，最后一个中间件，当其他的中间件都没有处理请求的时候在这里处理
 *      6.11 错误处理程序
 *      6.12 用户插件注册的中间件
 *  7. 生成一个服务器选项的配置项 ViteDevServer
 */
/**
 * 客户端请求资源：当存在客户端请求时，会通过启用的服务器通过各个中间件实现各种转换逻辑
 *  1. 对于 html 文件：
 *      -- 转换处理：主要使用 indexHtmlMiddleware 中间件进行处理, 之后 send 请求
 *      -- 请求预热：预热请求可见 indexHtmlMiddleware 中间件，最终会调用 preTransformRequest -> serever.warmupRequest -> transformRequest 方法调用
 *  2. 对于 js(vue、ts等)、css(scss、less等) 等文件：
 *      -- 转换处理：在 transformMiddleware 中间件中会调用 transformRequest -> ... -> loadAndTransform 方法中, 会执行插件的 'load' 和 'transform' 钩子, 调用插件执行转换，之后 send 请求
 *          --- 依赖的请求(例如: D:/低代码/project/wzb/源码学习/vite/playground/vue/node_modules/.vite/deps/vue.js?v=d9566fb3):
 *                会在 optimizedDepsPlugin 插件中, 注册 'load' 钩子处理，等待依赖优化的完成，之后直接读取对应的 依赖文件。
 *      -- 预热请求：在 importAnalysisPlugin 插件中,注册的 'transform' 钩子中调用 serever.warmupRequest -> transformRequest 方法执行预热请求
 */
export async function _createServer(
  inlineConfig: InlineConfig = {},
  options: { hotListen: boolean },
): Promise<ViteDevServer> {
  // 解析配置项
  const config = await resolveConfig(inlineConfig, 'serve')

  // 初始化 publicDir 配置项的文件列表的 Promise 状态，后续在处理
  const initPublicFilesPromise = initPublicFiles(config)

  const { root, server: serverConfig } = config
  // 处理 server.https 的相关配置项
  const httpsOptions = await resolveHttpsConfig(config.server.https)
  const { middlewareMode } = serverConfig

  // 获取解析后的输出目录集合。
  const resolvedOutDirs = getResolvedOutDirs(
    config.root,
    config.build.outDir,
    config.build.rollupOptions?.output,
  )
  // 处理 build.emptyOutDir -- https://cn.vitejs.dev/config/build-options.html#build-emptyoutdir
  // 若 outDir 在根目录之外则会抛出一个警告避免意外删除掉重要的文件。可以设置该选项来关闭这个警告
  const emptyOutDir = resolveEmptyOutDir(
    config.build.emptyOutDir,
    config.root,
    resolvedOutDirs,
  )
  // 处理 server.watch -- https://cn.vitejs.dev/config/server-options.html#server-watch
  // 根据给定的配置和选项解析Chokidar监视器的选项。
  const resolvedWatchOptions = resolveChokidarOptions(
    config,
    {
      disableGlobbing: true,
      ...serverConfig.watch,
    },
    resolvedOutDirs,
    emptyOutDir,
  )

  const middlewares = connect() as Connect.Server // 中间件
  // server.middlewareMode: 以中间件模式创建 Vite 服务器。
  // 此时不创建 http 实例, 否则使用默认创建
  const httpServer = middlewareMode
    ? null
    : // 根据提供的配置和应用创建一个 HTTP(HTTPS、HTTP2) 服务器。
      await resolveHttpServer(serverConfig, middlewares, httpsOptions)

  // 创建 ws 服务
  const ws = createWebSocketServer(httpServer, config, httpsOptions)
  // 创建一个热模块替换（HMR）广播器实例，并添加 ws 通道和 HMR 通道
  const hot = createHMRBroadcaster()
    .addChannel(ws) // ws 的类型继承了 HMRChannel 的, 所有也可以视为一个 HMR 通道
    .addChannel(createServerHMRChannel())

  // 添加自定义 hmr 通道
  if (typeof config.server.hmr === 'object' && config.server.hmr.channels) {
    config.server.hmr.channels.forEach((channel) => hot.addChannel(channel))
  }

  // 处理的出静态资源的文件列表
  const publicFiles = await initPublicFilesPromise
  const { publicDir } = config

  if (httpServer) {
    // 处理客户端请求(401、431)等错误的处理器
    setClientErrorHandler(httpServer, config.logger)
  }

  // eslint-disable-next-line eqeqeq
  const watchEnabled = serverConfig.watch !== null // 是否启用监听文件变化
  // 文件监听器
  const watcher = watchEnabled
    ? (chokidar.watch(
        // config file dependencies and env file might be outside of root 配置文件依赖项和环境文件可能位于根目录之外
        [
          root,
          ...config.configFileDependencies,
          ...getEnvFilesForMode(config.mode, config.envDir),
          // Watch the public directory explicitly because it might be outside 显式监视公共目录，因为它可能位于外部
          // of the root directory. 根目录
          ...(publicDir && publicFiles ? [publicDir] : []),
        ],
        resolvedWatchOptions,
      ) as FSWatcher)
    : createNoopWatcher(resolvedWatchOptions)

  // 生成一个模块图
  // 传入一个获取模块id的解析器
  const moduleGraph: ModuleGraph = new ModuleGraph((url, ssr) =>
    container.resolveId(url, undefined, { ssr }),
  )

  // 作用? 后续实际作用时在研究
  const container = await createPluginContainer(config, moduleGraph, watcher)
  // 创建一个用于关闭HTTP服务器的函数。
  const closeHttpServer = createServerCloseFn(httpServer)

  let exitProcess: () => void // 退出进程方法

  // 创建一个转换 index.html 的方法
  const devHtmlTransformFn = createDevHtmlTransformFn(config)

  const onCrawlEndCallbacks: (() => void)[] = []
  const crawlEndFinder = setupOnCrawlEnd(() => {
    onCrawlEndCallbacks.forEach((cb) => cb())
  })
  function waitForRequestsIdle(ignoredId?: string): Promise<void> {
    return crawlEndFinder.waitForRequestsIdle(ignoredId)
  }
  function _registerRequestProcessing(id: string, done: () => Promise<any>) {
    crawlEndFinder.registerRequestProcessing(id, done)
  }
  function _onCrawlEnd(cb: () => void) {
    onCrawlEndCallbacks.push(cb)
  }

  let server: ViteDevServer = {
    /** 配置对象 */
    config,
    /** 中间件 */
    middlewares,
    httpServer,
    /** 监听器 */
    watcher,
    /** 插件执行容器 */
    pluginContainer: container,
    ws,
    hot,
    /** 模块图 */
    moduleGraph,
    resolvedUrls: null, // will be set on listen
    ssrTransform(
      code: string,
      inMap: SourceMap | { mappings: '' } | null,
      url: string,
      originalCode = code,
    ) {
      return ssrTransform(code, inMap, url, originalCode, server.config)
    },
    // 对请求URL进行转换处理
    transformRequest(url, options) {
      return transformRequest(url, server, options)
    },
    // 对给定的URL进行预热请求处理。
    // 例如请求 index.html，会扫描文件，对其中的文件请求预先加载
    async warmupRequest(url, options) {
      try {
        await transformRequest(url, server, options)
      } catch (e) {
        if (
          e?.code === ERR_OUTDATED_OPTIMIZED_DEP ||
          e?.code === ERR_CLOSED_SERVER
        ) {
          // these are expected errors 这些都是预期的错误
          return
        }
        // Unexpected error, log the issue but avoid an unhandled exception 意外错误，记录问题但避免未处理的异常
        server.config.logger.error(`Pre-transform error: ${e.message}`, {
          error: e,
          timestamp: true,
        })
      }
    },
    // 转换 index.html 文件 -- 在这里调用插件的 transformIndexHtml 钩子执行转换机制
    transformIndexHtml(url, html, originalUrl) {
      return devHtmlTransformFn(server, url, html, originalUrl)
    },
    async ssrLoadModule(url, opts?: { fixStacktrace?: boolean }) {
      return ssrLoadModule(
        url,
        server,
        undefined,
        undefined,
        opts?.fixStacktrace,
      )
    },
    async ssrFetchModule(url: string, importer?: string) {
      return ssrFetchModule(server, url, importer)
    },
    ssrFixStacktrace(e) {
      ssrFixStacktrace(e, moduleGraph)
    },
    ssrRewriteStacktrace(stack: string) {
      return ssrRewriteStacktrace(stack, moduleGraph)
    },
    async reloadModule(module) {
      if (serverConfig.hmr !== false && module.file) {
        updateModules(module.file, [module], Date.now(), server)
      }
    },
    /**
     * 监听指定端口并启动服务器。
     * 如果服务器已经在运行，则根据参数决定是否重新启动服务器并更新URL。
     *
     * @param {number} [port] - 要监听的端口号。可选参数，默认为未指定。
     * @param {boolean} [isRestart] - 指示是否重新启动已经运行的服务器。可选参数，默认为false。
     * @returns {Promise<Object>} - 返回服务器对象的Promise。
     */
    async listen(port?: number, isRestart?: boolean) {
      await startServer(server, port) // 启动服务器
      if (httpServer) {
        // 解析出本地和网络的服务器URL列表。
        server.resolvedUrls = await resolveServerUrls(
          httpServer,
          config.server,
          config,
        )
        // 启动服务器后自动在浏览器中打开应用程序
        if (!isRestart && config.server.open) server.openBrowser()
      }
      return server
    },
    /**
     * 打开浏览器并导航到指定的 URL。
     * 该函数首先从服务器配置中获取打开选项和目标 URL，
     * 然后根据配置预先发送请求以加速页面加载。
     * 如果预处理请求已启用，它将立即以异步方式发送 HTTP GET 请求。
     */
    openBrowser() {
      const options = server.config.server // 获取服务器配置
      // 尝试获取本地或网络URL
      const url =
        server.resolvedUrls?.local[0] ?? server.resolvedUrls?.network[0]
      if (url) {
        // 根据配置构建浏览器打开的URL路径
        const path =
          typeof options.open === 'string'
            ? new URL(options.open, url).href
            : url

        // We know the url that the browser would be opened to, so we can 我们知道浏览器将被打开的url，因此我们可以
        // start the request while we are awaiting the browser. This will 在等待浏览器时启动请求。这将
        // start the crawling of static imports ~500ms before. 开始爬行静态导入~500ms之前。
        // preTransformRequests needs to be enabled for this optimization. 此优化需要启用preTransformRequest。
        // 如果预处理请求已启用，则提前发送请求以加速静态导入的爬取
        if (server.config.server.preTransformRequests) {
          setTimeout(() => {
            // 根据URL协议选择GET方法
            const getMethod = path.startsWith('https:') ? httpsGet : httpGet

            // 发送GET请求
            getMethod(
              path,
              {
                headers: {
                  // Allow the history middleware to redirect to /index.html  允许历史中间件重定向到/index.html
                  Accept: 'text/html',
                },
              },
              (res) => {
                res.on('end', () => {
                  // Ignore response, scripts discovered while processing the entry
                  // will be preprocessed (server.config.server.preTransformRequests)
                })
              },
            )
              .on('error', () => {
                // Ignore errors
              })
              .end()
          }, 0)
        }

        _openBrowser(path, true, server.config.logger)
      } else {
        // 如果没有可用的URL，则记录警告
        server.config.logger.warn('No URL available to open in browser')
      }
    },
    /**
     * 异步关闭服务器
     * 如果不在中间件模式下，移除信号量和输入流的监听器
     * 等待所有关闭操作的完成，包括文件系统监视器、热更新、容器、爬虫、依赖优化器以及HTTP服务器的关闭
     * 等待所有挂起的请求完成，然后清除已解析的URLs
     */
    async close() {
      // 如果不在中间件模式下，移除进程退出信号监听器
      if (!middlewareMode) {
        process.off('SIGTERM', exitProcess)
        // 如果不是在CI环境中，移除标准输入结束的监听器
        if (process.env.CI !== 'true') {
          process.stdin.off('end', exitProcess)
        }
      }
      // 等待所有关闭操作的Promise同时解决或拒绝
      await Promise.allSettled([
        watcher.close(), // 文件监听器关闭
        hot.close(), // hot 关闭
        container.close(), // 插件容器的关闭
        crawlEndFinder?.cancel(),
        getDepsOptimizer(server.config)?.close(), // 优化器的关闭
        getDepsOptimizer(server.config, true)?.close(), // 优化器的关闭
        closeHttpServer(),
      ])
      // Await pending requests. We throw early in transformRequest 等待挂起的请求。我们在 transformRequest 的早期抛出
      // and in hooks if the server is closing for non-ssr requests, 如果服务器正在关闭非SSR请求，则在钩子中
      // so the import analysis plugin stops pre-transforming static 所以导入分析插件停止预转换静态
      // imports and this block is resolved sooner. 并且该块可以更快地解决
      // During SSR, we let pending requests finish to avoid exposing 在SSR期间，我们让挂起的请求完成以避免暴露
      // the server closed error to the users. 服务器向用户关闭错误
      // 等待挂起的请求完成在非SSR请求中会提前抛出异常，以避免暴露服务器已关闭的错误给用户
      while (server._pendingRequests.size > 0) {
        await Promise.allSettled(
          [...server._pendingRequests.values()].map(
            (pending) => pending.request,
          ),
        )
      }
      server.resolvedUrls = null
    },
    /**
     * 打印已解析的服务器URLs。
     *   ➜  Local:   http://localhost:5173/
     *   ➜  Network: use --host to expose
     */
    printUrls() {
      if (server.resolvedUrls) {
        // 存在已解析的URLs时，打印它们
        printServerUrls(
          server.resolvedUrls,
          serverConfig.host,
          config.logger.info,
        )
      } else if (middlewareMode) {
        throw new Error('cannot print server URLs in middleware mode.') // 无法在中间件模式下打印服务器 URL
      } else {
        throw new Error(
          'cannot print server URLs before server.listen is called.', // 在调用 server.listen 之前无法打印服务器 URL
        )
      }
    },
    /**
     * 绑定CLI快捷键到给定的服务器实例：处理 press h + enter to show help(按 h + Enter 显示帮助) 功能
     */
    bindCLIShortcuts(options) {
      bindCLIShortcuts(server, options)
    },
    /**
     * 异步重启服务器
     * 此方法通过优化或强制重启来处理服务器重启请求
     * 它使用一个承诺（promise）来确保一次只有一个重启过程可以执行
     * 如果另一个重启过程已经在进行中，这个承诺将会让当前调用等待，直到前一个过程完成
     *
     * @param forceOptimize 可选参数，指示是否强制优化服务器状态
     *                      当此参数为true时，服务器将执行优化步骤，这可能延长重启过程
     *                      默认情况下，优化步骤将根据服务器的当前状态决定是否执行
     * @returns 返回一个承诺，该承诺将在重启过程开始时解析
     */
    async restart(forceOptimize?: boolean) {
      // 检查是否有重启过程已经在进行中
      // 如果没有，创建一个新的重启过程，并记录是否需要强制优化
      if (!server._restartPromise) {
        server._forceOptimizeOnRestart = !!forceOptimize
        server._restartPromise = restartServer(server).finally(() => {
          // 重启过程结束后，重置重启相关状态，以允许未来的重启调用
          server._restartPromise = null
          server._forceOptimizeOnRestart = false
        })
      }
      return server._restartPromise
    },

    waitForRequestsIdle,
    _registerRequestProcessing,
    _onCrawlEnd,

    _setInternalServer(_server: ViteDevServer) {
      // Rebind internal the server variable so functions reference the user 在服务器变量内部重新绑定，以便函数引用用户
      // server instance after a restart 重启后的服务器实例
      server = _server
    },
    _restartPromise: null,
    _importGlobMap: new Map(),
    _forceOptimizeOnRestart: false,
    /** 正在请求的队列 */
    _pendingRequests: new Map(),
    _fsDenyGlob: picomatch(
      // matchBase: true does not work as it's documented
      // https://github.com/micromatch/picomatch/issues/89
      // convert patterns without `/` on our side for now
      config.server.fs.deny.map((pattern) =>
        pattern.includes('/') ? pattern : `**/${pattern}`,
      ),
      {
        matchBase: false,
        nocase: true,
        dot: true,
      },
    ),
    _shortcutsOptions: undefined,
  }

  // maintain consistency with the server instance after restarting. 重启后保持与服务器实例的一致性
  const reflexServer = new Proxy(server, {
    get: (_, property: keyof ViteDevServer) => {
      return server[property]
    },
    set: (_, property: keyof ViteDevServer, value: never) => {
      server[property] = value
      return true
    },
  })

  /**
   * 在非中间件模式下，设置进程退出的处理逻辑。
   * 该逻辑包括：
   * 1. 当接收到 SIGTERM 信号时，异步关闭服务器后退出进程。
   * 2. 如果当前不在持续集成环境中，当标准输入结束时也将触发退出进程的逻辑。
   */
  if (!middlewareMode) {
    exitProcess = async () => {
      try {
        await server.close()
      } finally {
        process.exit()
      }
    }
    process.once('SIGTERM', exitProcess)
    if (process.env.CI !== 'true') {
      process.stdin.on('end', exitProcess)
    }
  }

  // 处理 HMR
  const onHMRUpdate = async (
    type: 'create' | 'delete' | 'update',
    file: string,
  ) => {
    // hmr 是否禁用
    if (serverConfig.hmr !== false) {
      try {
        await handleHMRUpdate(type, file, server)
      } catch (err) {
        hot.send({
          type: 'error',
          err: prepareError(err),
        })
      }
    }
  }

  const onFileAddUnlink = async (file: string, isUnlink: boolean) => {
    file = normalizePath(file)
    await container.watchChange(file, { event: isUnlink ? 'delete' : 'create' })

    if (publicDir && publicFiles) {
      if (file.startsWith(publicDir)) {
        const path = file.slice(publicDir.length)
        publicFiles[isUnlink ? 'delete' : 'add'](path)
        if (!isUnlink) {
          const moduleWithSamePath = await moduleGraph.getModuleByUrl(path)
          const etag = moduleWithSamePath?.transformResult?.etag
          if (etag) {
            // The public file should win on the next request over a module with the
            // same path. Prevent the transform etag fast path from serving the module
            moduleGraph.etagToModuleMap.delete(etag)
          }
        }
      }
    }
    if (isUnlink) moduleGraph.onFileDelete(file)
    await onHMRUpdate(isUnlink ? 'delete' : 'create', file)
  }

  // 当监视的目录或文件中的某些内容发生更改时触发
  watcher.on('change', async (file) => {
    // 变化的文件
    file = normalizePath(file)
    // 通知插件容器文件变化
    await container.watchChange(file, { event: 'update' })
    // invalidate module graph cache on file change 在文件更改时使模块图缓存无效
    moduleGraph.onFileChange(file)
    await onHMRUpdate('update', file)
  })

  // 初始化 watcher 文件监听器一些事件
  getFsUtils(config).initWatcher?.(watcher)

  // watcher 文件监听器 add 事件：当添加了监听的文件后触发
  watcher.on('add', (file) => {
    onFileAddUnlink(file, false)
  })
  // watcher 文件监听器 unlink 事件：当监听文件被删除后触发
  watcher.on('unlink', (file) => {
    onFileAddUnlink(file, true)
  })

  // 自定义 HMR 事件：当使用 import.meta.hot.invalidate() 使一个模块失效时 -- https://cn.vitejs.dev/guide/api-hmr.html#hot-onevent-cb
  hot.on('vite:invalidate', async ({ path, message }) => {
    const mod = moduleGraph.urlToModuleMap.get(path)
    if (
      mod &&
      mod.isSelfAccepting &&
      mod.lastHMRTimestamp > 0 &&
      !mod.lastHMRInvalidationReceived
    ) {
      mod.lastHMRInvalidationReceived = true
      config.logger.info(
        colors.yellow(`hmr invalidate `) +
          colors.dim(path) +
          (message ? ` ${message}` : ''),
        { timestamp: true },
      )
      const file = getShortName(mod.file!, config.root)
      updateModules(
        file,
        [...mod.importers],
        mod.lastHMRTimestamp,
        server,
        true,
      )
    }
  })

  // 服务器启动事件,更新端口,因为这可能与初始值不同
  if (!middlewareMode && httpServer) {
    httpServer.once('listening', () => {
      // update actual port since this may be different from initial value 更新实际端口，因为这可能与初始值不同
      serverConfig.port = (httpServer.address() as net.AddressInfo).port
    })
  }

  // 执行 configureServer 钩子：https://cn.vitejs.dev/guide/api-plugin.html#configureserver
  // apply server configuration hooks from plugins 从插件应用服务器配置挂钩
  const postHooks: ((() => void) | void)[] = [] // 插件的 configureServer 钩子可以返回一个后置调用函数, 用于在内部中间件运行成功后执行
  for (const hook of config.getSortedPluginHooks('configureServer')) {
    postHooks.push(await hook(reflexServer))
  }

  // Internal middlewares 内部中间件 ------------------------------------------------------

  // request timer 请求定时器
  // 用于记录请求处理的时间。
  if (process.env.DEBUG) {
    middlewares.use(timeMiddleware(root))
  }

  // cors (enabled by default) cors（默认启用）
  const { cors } = serverConfig
  // 使用 cors 库作为处理 cors 中间件
  if (cors !== false) {
    middlewares.use(corsMiddleware(typeof cors === 'boolean' ? {} : cors))
  }

  // 缓存转换中间件，检测请求是否走的是协商缓存 -- 可以使中间件链短路以服务缓存的转换模块
  middlewares.use(cachedTransformMiddleware(server))

  // proxy 中间件
  const { proxy } = serverConfig
  if (proxy) {
    const middlewareServer =
      (isObject(middlewareMode) ? middlewareMode.server : null) || httpServer
    middlewares.use(proxyMiddleware(middlewareServer, proxy, config))
  }

  // base 该中间件仅在 (base !== '/') 时才处于活动状态
  if (config.base !== '/') {
    middlewares.use(baseMiddleware(config.rawBase, !!middlewareMode))
  }

  // open in editor support 在编辑器支持中打开
  // 访问 /__open-in-editor?file=文件路径 时, 会通过 launch-editor(https://github.com/yyx990803/launch-editor) 在编辑器中打开对应的文件
  middlewares.use('/__open-in-editor', launchEditorMiddleware())

  // ping request handler ping 请求处理程序
  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...` 保留命名函数。该名称通过“DEBUG=connect:dispatcher ...”在调试日志中可见
  middlewares.use(function viteHMRPingMiddleware(req, res, next) {
    if (req.headers['accept'] === 'text/x-vite-ping') {
      res.writeHead(204).end()
    } else {
      next()
    }
  })

  // serve static files under /public 在 /public 下提供静态文件
  // this applies before the transform middleware so that these files are served 这适用于转换中间件之前，以便提供这些文件
  // as-is without transforms. 按原样不进行转换
  if (publicDir) {
    middlewares.use(servePublicMiddleware(server, publicFiles))
  }

  // main transform middleware 主要转换中间件
  // 用于处理Vite开发服务器的资源转换。
  middlewares.use(transformMiddleware(server))

  // serve static files 提供静态文件
  middlewares.use(serveRawFsMiddleware(server))
  middlewares.use(serveStaticMiddleware(server))

  // html fallback html 后备
  if (config.appType === 'spa' || config.appType === 'mpa') {
    // 在 SPA 中, 如果访问的是 /(或/index)，那么在这里就处理一下请求地址，规整成 'xxx/xxx.html'
    // 例如：访问 '/' --> '/index.html'
    middlewares.use(
      htmlFallbackMiddleware(
        root,
        config.appType === 'spa',
        getFsUtils(config),
      ),
    )
  }

  // configureServer 钩子可以返回一个后置调用函数集合执行
  // run post config hooks 运行配置后钩子
  // This is applied before the html middleware so that user middleware can 这在 html 中间件之前应用，以便用户中间件可以
  // serve custom content instead of index.html. 提供自定义内容而不是index.html。
  postHooks.forEach((fn) => fn && fn())

  if (config.appType === 'spa' || config.appType === 'mpa') {
    // transform index.html 转换index.html
    middlewares.use(indexHtmlMiddleware(root, server))

    // handle 404s 处理404，最后一个中间件，当其他的中间件都没有处理请求的时候在这里处理
    middlewares.use(notFoundMiddleware())
  }

  // error handler 错误处理程序
  middlewares.use(errorMiddleware(server, !!middlewareMode))

  // httpServer.listen can be called multiple times httpServer.listen 可以被多次调用
  // when port when using next port number 当端口使用下一个端口号时
  // this code is to avoid calling buildStart multiple times 这段代码是为了避免多次调用 buildStart
  let initingServer: Promise<void> | undefined // 服务器正在启动的 Promise
  let serverInited = false // 服务器是否初始化标志
  const initServer = async () => {
    if (serverInited) return // 如果启动过, 则直接返回
    if (initingServer) return initingServer // 如果正在启动的话, 直接返回之前的 Promise

    initingServer = (async function () {
      await container.buildStart({}) // 启动执行插件的 buildStart 钩子：https://cn.rollupjs.org/plugin-development/#buildstart */
      // start deps optimizer after all container plugins are ready 所有容器插件准备就绪后启动 deps 优化器
      if (isDepsOptimizerEnabled(config, false)) {
        // 如果启动预构建优化的话, 执行启动依赖优化的程序
        await initDepsOptimizer(config, server)
      }
      // 提前转换和缓存文件以进行预热。可以在服务器启动时提高初始页面加载速度，并防止转换瀑布。
      warmupFiles(server)
      initingServer = undefined
      serverInited = true // 服务器启动完成
    })()
    return initingServer
  }

  // 如果不是中间件模式并且存在 http 服务器的话, 重写 listen 方法, 以在启动服务器之前做一些操作
  if (!middlewareMode && httpServer) {
    // overwrite listen to init optimizer before server start 在服务器启动之前覆盖监听 init 优化器
    const listen = httpServer.listen.bind(httpServer)
    httpServer.listen = (async (port: number, ...args: any[]) => {
      try {
        // ensure ws server started 确保 ws 服务器已启动
        hot.listen()
        await initServer() // 启动服务之前做一些操作
      } catch (e) {
        httpServer.emit('error', e)
        return
      }
      return listen(port, ...args) // 启动服务器
    }) as any
  } else {
    if (options.hotListen) {
      hot.listen()
    }
    await initServer()
  }

  return server
}

/**
 * 启动Vite开发服务器。
 *
 * @param server ViteDevServer实例，代表一个Vite开发服务器。
 * @param inlinePort 可选参数，指定要监听的端口号。如果未提供，则使用配置文件中的端口号。
 * @returns Promise<void> 无返回值的Promise。
 * @throws Error 如果在中间件模式下调用服务器监听方法，则抛出错误。
 */
async function startServer(
  server: ViteDevServer,
  inlinePort?: number,
): Promise<void> {
  const httpServer = server.httpServer
  // 检查httpServer是否存在，如果不存在则抛出错误。
  if (!httpServer) {
    throw new Error('Cannot call server.listen in middleware mode.') // 中间件模式下无法调用server.listen
  }

  const options = server.config.server
  // 解析主机名。
  const hostname = await resolveHostname(options.host)
  const configPort = inlinePort ?? options.port
  // When using non strict port for the dev server, the running port can be different from the config one. 当开发服务器使用非严格端口时，运行端口可以与配置端口不同
  // When restarting, the original port may be available but to avoid a switch of URL for the running 重新启动时，原始端口可能可用，但要避免运行时切换 URL
  // browser tabs, we enforce the previously used port, expect if the config port changed. 浏览器选项卡，我们强制执行以前使用的端口，预计配置端口是否更改
  // 确定一个端口号
  const port =
    (!configPort || configPort === server._configServerPort
      ? server._currentServerPort
      : configPort) ?? DEFAULT_DEV_PORT
  server._configServerPort = configPort

  // 启动HTTP服务器并返回实际监听的端口号。
  const serverPort = await httpServerStart(httpServer, {
    port,
    strictPort: options.strictPort,
    host: hostname.host,
    logger: server.config.logger,
  })
  server._currentServerPort = serverPort
}

/**
 * 创建一个用于关闭HTTP服务器的函数。
 *
 * @param server 可以是HttpServer对象或null。如果为null，则返回一个不做任何操作的关闭函数。
 * @returns 返回一个函数，调用该函数将尝试关闭服务器。如果服务器已启动且有连接，则先关闭所有连接，然后再关闭服务器。
 */
export function createServerCloseFn(
  server: HttpServer | null,
): () => Promise<void> {
  // 不存在服务器的话, 则返回个默认关闭方法
  if (!server) {
    return () => Promise.resolve()
  }

  let hasListened = false // 服务器启动标记
  // 打开连接的套接字
  const openSockets = new Set<net.Socket>()

  // connection：当建立新的 TCP 流时会触发此事件。
  server.on('connection', (socket) => {
    openSockets.add(socket) // 将套接字收集起来
    // 在套接字关闭时, 从收集器中删除
    socket.on('close', () => {
      openSockets.delete(socket)
    })
  })

  // 服务器成功启动后，标记为已监听
  server.once('listening', () => {
    hasListened = true
  })

  // 服务关闭服务器的方法
  return () =>
    new Promise<void>((resolve, reject) => {
      openSockets.forEach((s) => s.destroy()) // 销毁所有的套接字
      if (hasListened) {
        // 如果启动了的话, 调用 close 执行关闭
        server.close((err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      } else {
        resolve()
      }
    })
}

// 处理为绝对路径
function resolvedAllowDir(root: string, dir: string): string {
  return normalizePath(path.resolve(root, dir))
}

/** 处理服务器配置项 -- https://cn.vitejs.dev/config/server-options.html */
export function resolveServerOptions(
  /** 根目录 */
  root: string,
  /** 开发服务器选项 */
  raw: ServerOptions | undefined,
  /** 记录器 */
  logger: Logger,
): ResolvedServerOptions {
  // 组装一下 开发服务器选项
  const server: ResolvedServerOptions = {
    preTransformRequests: true,
    ...(raw as Omit<ResolvedServerOptions, 'sourcemapIgnoreList'>),
    sourcemapIgnoreList:
      raw?.sourcemapIgnoreList === false
        ? () => false
        : raw?.sourcemapIgnoreList || isInNodeModules,
    middlewareMode: raw?.middlewareMode || false,
  }
  let allowDirs = server.fs?.allow
  const deny = server.fs?.deny || ['.env', '.env.*', '*.{crt,pem}'] // 用于限制 Vite 开发服务器提供敏感文件的黑名单。

  if (!allowDirs) {
    allowDirs = [searchForWorkspaceRoot(root)] // 查找到最近的工作区目录作为默认值
  }

  // process.versions 列出了 Node.js 的版本字符串及其依赖
  if (process.versions.pnp) {
    try {
      const enableGlobalCache =
        execSync('yarn config get enableGlobalCache', { cwd: root })
          .toString()
          .trim() === 'true'
      const yarnCacheDir = execSync(
        `yarn config get ${enableGlobalCache ? 'globalFolder' : 'cacheFolder'}`,
        { cwd: root },
      )
        .toString()
        .trim()
      allowDirs.push(yarnCacheDir)
    } catch (e) {
      // 获取纱线缓存目录错误
      logger.warn(`Get yarn cache dir error: ${e.message}`, {
        timestamp: true,
      })
    }
  }

  allowDirs = allowDirs.map((i) => resolvedAllowDir(root, i)) // 处理 server.fs.allow 为绝对路径

  // only push client dir when vite itself is outside-of-root 仅当 vite 本身位于 root 之外时推送客户端目录
  const resolvedClientDir = resolvedAllowDir(root, CLIENT_DIR)
  if (!allowDirs.some((dir) => isParentDirectory(dir, resolvedClientDir))) {
    allowDirs.push(resolvedClientDir)
  }

  // 处理完成 server.fs 文件相关选项
  server.fs = {
    strict: server.fs?.strict ?? true,
    allow: allowDirs,
    deny,
    cachedChecks: server.fs?.cachedChecks,
  }

  // 检查 server.origin 是否以 / 结尾
  if (server.origin?.endsWith('/')) {
    server.origin = server.origin.slice(0, -1)
    logger.warn(
      colors.yellow(
        // server.origin 不应以“/”结尾。使用
        `${colors.bold('(!)')} server.origin should not end with "/". Using "${
          server.origin
        }" instead.`,
      ),
    )
  }

  return server
}
/**
 * 异步重启服务器函数
 * 该函数通过创建一个新的服务器实例来重启服务器，并将新实例的属性赋值给原实例
 * 这样可以在不更换原服务器实例的情况下，重新加载配置文件，并重新创建插件和中间件
 *
 * @param server - 待重启的服务器实例
 */
async function restartServer(server: ViteDevServer) {
  // 记录重启开始时间
  global.__vite_start_time = performance.now()
  // 获取服务器的快捷键设置
  const shortcutsOptions = server._shortcutsOptions

  // 获取服务器的内联配置
  let inlineConfig = server.config.inlineConfig
  // 如果服务器强制优化重启，则合并配置以强制优化依赖
  if (server._forceOptimizeOnRestart) {
    inlineConfig = mergeConfig(inlineConfig, {
      optimizeDeps: {
        force: true,
      },
    })
  }

  // Reinit the server by creating a new instance using the same inlineConfig 通过使用相同的内联Config创建一个新实例来重新定义服务器
  // This will triger a reload of the config file and re-create the plugins and 这将触发重新加载配置文件并重新创建插件和
  // middlewares. We then assign all properties of the new server to the existing 中间件)。然后将新服务器的所有属性分配给现有服务器
  // server instance and set the user instance to be used in the new server. 服务器实例，并设置在新服务器中使用的用户实例
  // This allows us to keep the same server instance for the user. 这允许我们为用户保留相同的服务器实例
  {
    let newServer = null
    try {
      // delay ws server listen 延迟ws服务器监听
      newServer = await _createServer(inlineConfig, { hotListen: false })
    } catch (err: any) {
      // 出错时, 记录一下
      server.config.logger.error(err.message, {
        timestamp: true,
      })
      server.config.logger.error('server restart failed', { timestamp: true })
      return
    }

    // 关闭原服务器
    await server.close()

    // Assign new server props to existing server instance 将新服务器的属性赋值给原服务器实例
    // 复用之前服务器已解析的处理
    const middlewares = server.middlewares
    newServer._configServerPort = server._configServerPort
    newServer._currentServerPort = server._currentServerPort
    Object.assign(server, newServer)

    // Keep the same connect instance so app.use(vite.middlewares) works 保持相同的连接实例，这样app.use(vite.middleware)才能正常工作
    // after a restart in middlewareMode (.route is always '/') 在中间件模式下重启后(。路由总是'/')
    middlewares.stack = newServer.middlewares.stack
    server.middlewares = middlewares

    // Rebind internal server variable so functions reference the user server 重新绑定内部服务器变量，以便函数引用用户服务器
    newServer._setInternalServer(server)
  }

  // 获取服务器配置和日志记录器
  const {
    logger,
    server: { port, middlewareMode },
  } = server.config
  // 如果不是中间件模式，则重新监听指定端口
  if (!middlewareMode) {
    await server.listen(port, true)
  } else {
    // 否则，重新监听热更新
    server.hot.listen()
  }
  // 记录服务器重启信息
  logger.info('server restarted.', { timestamp: true })

  // 如果存在快捷键设置，则重新绑定快捷键
  if (shortcutsOptions) {
    shortcutsOptions.print = false
    bindCLIShortcuts(server, shortcutsOptions)
  }
}

/**
 * Internal function to restart the Vite server and print URLs if changed 重新启动 Vite 服务器并打印 URL（如果更改）的内部函数
 *
 * 重启服务器并在URL发生变化时记录日志
 *
 * 此函数用于重启服务器并检查重启前后的URL是否发生变化如果发生变化，则记录相应的日志信息
 * 主要用于开发环境下，当代码发生变化并且需要重启服务器时，能够清晰地反馈服务器状态的变化
 *
 * @param server Vite开发服务器实例
 * @returns 无返回值
 */
export async function restartServerWithUrls(
  server: ViteDevServer,
): Promise<void> {
  // 检查是否处于中间件模式，如果是，则直接重启服务器
  if (server.config.server.middlewareMode) {
    await server.restart()
    return
  }

  // 提取重启前的服务器端口、主机名和URLs
  const { port: prevPort, host: prevHost } = server.config.server
  const prevUrls = server.resolvedUrls

  // 重启服务器
  await server.restart()

  // 提取重启后的服务器端口、主机名
  const {
    logger,
    server: { port, host },
  } = server.config
  // 检查重启后的URL是否与之前的不同如果不同，则记录日志并打印新URLs
  if (
    (port ?? DEFAULT_DEV_PORT) !== (prevPort ?? DEFAULT_DEV_PORT) ||
    host !== prevHost ||
    diffDnsOrderChange(prevUrls, server.resolvedUrls)
  ) {
    logger.info('')
    server.printUrls()
  }
}

const callCrawlEndIfIdleAfterMs = 50

interface CrawlEndFinder {
  registerRequestProcessing: (id: string, done: () => Promise<any>) => void
  waitForRequestsIdle: (ignoredId?: string) => Promise<void>
  cancel: () => void
}

function setupOnCrawlEnd(onCrawlEnd: () => void): CrawlEndFinder {
  const registeredIds = new Set<string>() // 正在处理的 id 集合
  const seenIds = new Set<string>() // 已处理的 id 集合
  const onCrawlEndPromiseWithResolvers = promiseWithResolvers<void>()

  let timeoutHandle: NodeJS.Timeout | undefined

  let cancelled = false
  function cancel() {
    cancelled = true
  }

  let crawlEndCalled = false
  function callOnCrawlEnd() {
    if (!cancelled && !crawlEndCalled) {
      crawlEndCalled = true
      onCrawlEnd()
    }
    onCrawlEndPromiseWithResolvers.resolve()
  }

  function registerRequestProcessing(
    id: string,
    done: () => Promise<any>,
  ): void {
    // 检查请求ID是否已被处理过，以避免重复处理相同请求。
    if (!seenIds.has(id)) {
      seenIds.add(id) // 将请求ID标记为已处理，防止重复处理。
      registeredIds.add(id) // 将请求ID注册到处理中的请求列表中。
      // 执行处理请求的回调函数，并捕获任何可能的错误，确保错误不会影响后续操作。
      // 最后，无论成功还是失败，都会标记该请求为已完成。
      done()
        .catch(() => {})
        .finally(() => markIdAsDone(id))
    }
  }

  function waitForRequestsIdle(ignoredId?: string): Promise<void> {
    if (ignoredId) {
      seenIds.add(ignoredId)
      markIdAsDone(ignoredId)
    }
    return onCrawlEndPromiseWithResolvers.promise
  }

  function markIdAsDone(id: string): void {
    if (registeredIds.has(id)) {
      registeredIds.delete(id)
      checkIfCrawlEndAfterTimeout()
    }
  }

  function checkIfCrawlEndAfterTimeout() {
    if (cancelled || registeredIds.size > 0) return

    if (timeoutHandle) clearTimeout(timeoutHandle)
    timeoutHandle = setTimeout(
      callOnCrawlEndWhenIdle,
      callCrawlEndIfIdleAfterMs,
    )
  }
  async function callOnCrawlEndWhenIdle() {
    if (cancelled || registeredIds.size > 0) return
    callOnCrawlEnd()
  }

  return {
    registerRequestProcessing,
    waitForRequestsIdle,
    cancel,
  }
}
