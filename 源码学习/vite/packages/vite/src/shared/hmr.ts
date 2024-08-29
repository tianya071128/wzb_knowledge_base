import type { Update } from 'types/hmrPayload'
import type { ModuleNamespace, ViteHotContext } from 'types/hot'
import type { InferCustomEventPayload } from 'types/customEvent'

type CustomListenersMap = Map<string, ((data: any) => void)[]>

interface HotModule {
  /** 模块 id */
  id: string
  /** 当模块 HMR 时, 执行的回调 */
  callbacks: HotCallback[]
}

interface HotCallback {
  // the dependencies must be fetchable paths
  deps: string[]
  fn: (modules: Array<ModuleNamespace | undefined>) => void
}

export interface HMRLogger {
  error(msg: string | Error): void
  debug(...msg: unknown[]): void
}

export interface HMRConnection {
  /**
   * Checked before sending messages to the client.
   */
  isReady(): boolean
  /**
   * Send message to the client.
   */
  send(messages: string): void
}

export class HMRContext implements ViteHotContext {
  private newListeners: CustomListenersMap

  constructor(
    private hmrClient: HMRClient, // HMR 客户端对象
    private ownerPath: string, // 模块路径
  ) {
    // 确保模块路径在HMR客户端的数据映射中存在
    if (!hmrClient.dataMap.has(ownerPath)) {
      hmrClient.dataMap.set(ownerPath, {})
    }

    // when a file is hot updated, a new context is created 当文件进行热更新时，会创建一个新的上下文
    // clear its stale callbacks 清除其过时的回调
    const mod = hmrClient.hotModulesMap.get(ownerPath)
    if (mod) {
      mod.callbacks = []
    }

    // clear stale custom event listeners 清除过时的自定义事件侦听器
    const staleListeners = hmrClient.ctxToListenersMap.get(ownerPath)
    if (staleListeners) {
      for (const [event, staleFns] of staleListeners) {
        const listeners = hmrClient.customListenersMap.get(event)
        if (listeners) {
          hmrClient.customListenersMap.set(
            event,
            listeners.filter((l) => !staleFns.includes(l)),
          )
        }
      }
    }

    this.newListeners = new Map()
    hmrClient.ctxToListenersMap.set(ownerPath, this.newListeners)
  }

  get data(): any {
    return this.hmrClient.dataMap.get(this.ownerPath)
  }

  /**
   * 处理模块热更新的接受逻辑 -- 参考: https://cn.vitejs.dev/guide/api-hmr.html#hot-accept-cb
   *
   * 本函数支持不同的调用方式来指定依赖模块并接受其更新它可以根据传入参数的不同
   * 来自动调整如何接受依赖模块的更新，包括自我接受、显式依赖和依赖数组等形式
   * 如果使用不当，会抛出错误提示
   *
   * @param deps 可选参数，可以是字符串、函数或数组，用于指定依赖的模块路径
   * @param callback 可选参数，是一个函数，当依赖模块更新时会被调用
   * @throws 当`deps`和`callback`的使用方式不正确时抛出异常
   */
  accept(deps?: any, callback?: any): void {
    // 接收模块自身
    if (typeof deps === 'function' || !deps) {
      // self-accept: hot.accept(() => {})
      this.acceptDeps([this.ownerPath], ([mod]) => deps?.(mod))
    }
    // `deps`是字符串时，表示显式依赖，即接受指定模块的更新，并可选择执行`callback`
    else if (typeof deps === 'string') {
      // explicit deps
      this.acceptDeps([deps], ([mod]) => callback?.(mod))
    }
    // 当`deps`是数组时，表示有多个依赖模块，接受这些模块的更新，并可选择执行`callback`
    else if (Array.isArray(deps)) {
      this.acceptDeps(deps, callback)
    }
    // 当`deps`的类型既不是函数、未定义、字符串也不是数组时，视为使用不当，抛出错误
    else {
      throw new Error(`invalid hot.accept() usage.`)
    }
  }

  // export names (first arg) are irrelevant on the client side, they're
  // extracted in the server for propagation
  acceptExports(
    _: string | readonly string[],
    callback: (data: any) => void,
  ): void {
    this.acceptDeps([this.ownerPath], ([mod]) => callback?.(mod))
  }

  /**
   * 对应 API: 清除任何由其更新副本产生的持久副作用 -- https://cn.vitejs.dev/guide/api-hmr#hot-dispose-cb
   *  在这里添加到 disposeMap 集合中
   *  在模块更新后, 会执行 disposeMap 中注册的回调(对应的是旧模块)
   * @param cb
   */
  dispose(cb: (data: any) => void): void {
    // 只会存在一个清理副作用的回调, 如果模块更新了, 那么之前的也就失效
    // 但是如果更新文件就是将 import.meta.hot.dispose 方法删除的话, 那么之前的回调会一直存在
    this.hmrClient.disposeMap.set(this.ownerPath, cb)
  }

  prune(cb: (data: any) => void): void {
    this.hmrClient.pruneMap.set(this.ownerPath, cb)
  }

  // Kept for backward compatibility (#11036)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  decline(): void {}

  invalidate(message: string): void {
    this.hmrClient.notifyListeners('vite:invalidate', {
      path: this.ownerPath,
      message,
    })
    this.send('vite:invalidate', { path: this.ownerPath, message })
    this.hmrClient.logger.debug(
      `[vite] invalidate ${this.ownerPath}${message ? `: ${message}` : ''}`,
    )
  }

  on<T extends string>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void {
    const addToMap = (map: Map<string, any[]>) => {
      const existing = map.get(event) || []
      existing.push(cb)
      map.set(event, existing)
    }
    addToMap(this.hmrClient.customListenersMap)
    addToMap(this.newListeners)
  }

  off<T extends string>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void {
    const removeFromMap = (map: Map<string, any[]>) => {
      const existing = map.get(event)
      if (existing === undefined) {
        return
      }
      const pruned = existing.filter((l) => l !== cb)
      if (pruned.length === 0) {
        map.delete(event)
        return
      }
      map.set(event, pruned)
    }
    removeFromMap(this.hmrClient.customListenersMap)
    removeFromMap(this.newListeners)
  }

  send<T extends string>(event: T, data?: InferCustomEventPayload<T>): void {
    this.hmrClient.messenger.send(
      JSON.stringify({ type: 'custom', event, data }),
    )
  }

  /**
   * 接受依赖并注册热更新回调函数
   *
   * 该方法主要用于模块热更新中，接受一组依赖模块名和一个回调函数，
   * 当这些依赖模块发生变化时，将执行回调函数
   *
   * @param deps 依赖模块名数组，表示需要监听变化的模块
   * @param callback 回调函数，当依赖模块发生变化时会被调用，默认为空函数
   */
  private acceptDeps(
    deps: string[],
    callback: HotCallback['fn'] = () => {},
  ): void {
    // 获取当前模块的HMR信息，如果不存在则创建一个新的HotModule对象
    const mod: HotModule = this.hmrClient.hotModulesMap.get(this.ownerPath) || {
      id: this.ownerPath,
      callbacks: [],
    }
    mod.callbacks.push({
      deps,
      fn: callback,
    })
    this.hmrClient.hotModulesMap.set(this.ownerPath, mod)
  }
}

class HMRMessenger {
  constructor(private connection: HMRConnection) {}

  private queue: string[] = []

  public send(message: string): void {
    this.queue.push(message)
    this.flush()
  }

  public flush(): void {
    if (this.connection.isReady()) {
      this.queue.forEach((msg) => this.connection.send(msg))
      this.queue = []
    }
  }
}

/**
 * HRM 的客户端对象
 */
export class HMRClient {
  public hotModulesMap = new Map<string, HotModule>()
  // 清除副作用 Map<模块路径, 回调> -- https://cn.vitejs.dev/guide/api-hmr.html#hot-dispose-cb
  public disposeMap = new Map<string, (data: any) => void | Promise<void>>()
  public pruneMap = new Map<string, (data: any) => void | Promise<void>>()
  // Map<模块路径, >
  public dataMap = new Map<string, any>()
  public customListenersMap: CustomListenersMap = new Map()
  public ctxToListenersMap = new Map<string, CustomListenersMap>()

  public messenger: HMRMessenger

  constructor(
    public logger: HMRLogger,
    connection: HMRConnection,
    // This allows implementing reloading via different methods depending on the environment
    private importUpdatedModule: (update: Update) => Promise<ModuleNamespace>,
  ) {
    this.messenger = new HMRMessenger(connection)
  }

  /**
   * 异步通知监听器
   *
   * 本函数通过事件名称查找对应的回调函数列表，并依次调用这些回调函数通知它们指定事件已发生
   * 主要用于事件驱动模型中，确保所有关注该事件的监听器都能得到通知
   *
   * @param event 事件名称，用于标识需要触发的回调函数列表
   * @param data 事件数据，传递给每个回调函数的具体数据
   * @returns 无返回值
   */
  public async notifyListeners<T extends string>(
    event: T,
    data: InferCustomEventPayload<T>,
  ): Promise<void>
  public async notifyListeners(event: string, data: any): Promise<void> {
    // 根据事件名称从映射中获取回调函数列表
    const cbs = this.customListenersMap.get(event)

    // 如果找到了对应的回调函数列表，则对列表中的每个回调函数进行调用
    if (cbs) {
      // 使用 Promise.allSettled 确保所有的回调函数都被调用，而不在乎它们的执行结果
      // 这样做的目的是保证即使某些回调函数出现异常，也不影响其他回调函数被调用
      await Promise.allSettled(cbs.map((cb) => cb(data)))
    }
  }

  public clear(): void {
    this.hotModulesMap.clear()
    this.disposeMap.clear()
    this.pruneMap.clear()
    this.dataMap.clear()
    this.customListenersMap.clear()
    this.ctxToListenersMap.clear()
  }

  // After an HMR update, some modules are no longer imported on the page HMR更新后，页面上不再导入某些模块
  // but they may have left behind side effects that need to be cleaned up 但它们可能留下了需要清理的副作用
  // 例如在 vue 文件: import.meta.hot.prune(()=>__vite__removeStyle(__vite__id)) -- 用于清理 css
  // (.e.g style injections)
  public async prunePaths(paths: string[]): Promise<void> {
    // hot.dispose 回调同样需要调用
    await Promise.all(
      paths.map((path) => {
        const disposer = this.disposeMap.get(path)
        if (disposer) return disposer(this.dataMap.get(path))
      }),
    )
    // 执行 hot.prune 注册的回调
    paths.forEach((path) => {
      const fn = this.pruneMap.get(path)
      if (fn) {
        fn(this.dataMap.get(path))
      }
    })
  }

  protected warnFailedUpdate(err: Error, path: string | string[]): void {
    if (!err.message.includes('fetch')) {
      this.logger.error(err)
    }
    this.logger.error(
      `[hmr] Failed to reload ${path}. ` +
        `This could be due to syntax errors or importing non-existent ` +
        `modules. (see errors above)`,
    )
  }

  // 更新队列
  private updateQueue: Promise<(() => void) | undefined>[] = []
  // 等待更新队列标识
  private pendingUpdateQueue = false

  /**
   * buffer multiple hot updates triggered by the same src change 缓冲由同一 src 更改触发的多个热更新
   * so that they are invoked in the same order they were sent. 以便它们按照发送的顺序被调用。
   * (otherwise the order may be inconsistent because of the http request round trip) （否则，由于http请求往返，顺序可能不一致）
   */
  public async queueUpdate(payload: Update): Promise<void> {
    this.updateQueue.push(this.fetchUpdate(payload))

    // 原因: 需要将同一的更新先收集起来
    if (!this.pendingUpdateQueue) {
      this.pendingUpdateQueue = true
      await Promise.resolve() // 延迟一下
      this.pendingUpdateQueue = false
      const loading = [...this.updateQueue]
      this.updateQueue = [] // 清空队列

      // 等待所有的请求模块队列请求完成后, 执行对应的回调
      ;(await Promise.all(loading)).forEach((fn) => fn && fn())
    }
  }

  /**
   * 异步获取更新逻辑
   * 该函数负责根据更新对象中的路径加载新的模块，并根据条件执行相应的回调函数
   * @param update 更新对象，包含更新的模块路径和接受的路径
   * @returns 返回一个函数，该函数在调用时会执行更新的清理和日志操作，或者不返回
   */
  private async fetchUpdate(update: Update): Promise<(() => void) | undefined> {
    const { path, acceptedPath } = update // 解构更新对象中的路径和接受路径
    const mod = this.hotModulesMap.get(path) // 从热模块映射中获取当前模块
    // 如果模块不存在，则返回
    if (!mod) {
      // In a code-splitting project, 在代码拆分项目中，
      // it is common that the hot-updating module is not loaded yet. 通常热更新模块尚未加载。
      // https://github.com/vitejs/vite/issues/721
      return
    }

    // 定义一个变量来存储获取的模块
    let fetchedModule: ModuleNamespace | undefined
    // 判断是否是自我更新
    const isSelfUpdate = path === acceptedPath

    // determine the qualified callbacks before we re-import the modules 在重新导入模块之前，确定合格的回调
    // 找到接收更新的模块回调
    const qualifiedCallbacks = mod.callbacks.filter(({ deps }) =>
      deps.includes(acceptedPath),
    )

    // 如果是自我更新或有合格的回调函数，则进行后续操作
    if (isSelfUpdate || qualifiedCallbacks.length > 0) {
      // 对应这个 API 的处理 -- https://cn.vitejs.dev/guide/api-hmr.html#hot-dispose-cb
      // 先执行旧模块的 disposer 回调
      const disposer = this.disposeMap.get(acceptedPath)
      if (disposer) await disposer(this.dataMap.get(acceptedPath))

      try {
        // 执行请求更新模块
        fetchedModule = await this.importUpdatedModule(update)
      } catch (e) {
        this.warnFailedUpdate(e, acceptedPath)
      }
    }

    // 返回一个函数
    // 用于后面在同一 SRC 中触发的更新, 在全部请求完成按照顺序通知
    return () => {
      for (const { deps, fn } of qualifiedCallbacks) {
        fn(
          deps.map((dep) => (dep === acceptedPath ? fetchedModule : undefined)),
        )
      }
      const loggedPath = isSelfUpdate ? path : `${acceptedPath} via ${path}`
      // 打印
      this.logger.debug(`[vite] hot updated: ${loggedPath}`)
    }
  }
}
