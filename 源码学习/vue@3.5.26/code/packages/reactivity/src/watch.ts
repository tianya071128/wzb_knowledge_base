import {
  EMPTY_OBJ,
  NOOP,
  hasChanged,
  isArray,
  isFunction,
  isMap,
  isObject,
  isPlainObject,
  isSet,
  remove,
} from '@vue/shared'
import { warn } from './warning'
import type { ComputedRef } from './computed'
import { ReactiveFlags } from './constants'
import {
  type DebuggerOptions,
  EffectFlags,
  type EffectScheduler,
  ReactiveEffect,
  pauseTracking,
  resetTracking,
} from './effect'
import { isReactive, isShallow } from './reactive'
import { type Ref, isRef } from './ref'
import { getCurrentScope } from './effectScope'

// These errors were transferred from `packages/runtime-core/src/errorHandling.ts`
// to @vue/reactivity to allow co-location with the moved base watch logic, hence
// it is essential to keep these values unchanged.
export enum WatchErrorCodes {
  WATCH_GETTER = 2,
  WATCH_CALLBACK,
  WATCH_CLEANUP,
}

export type WatchEffect = (onCleanup: OnCleanup) => void

export type WatchSource<T = any> = Ref<T, any> | ComputedRef<T> | (() => T)

export type WatchCallback<V = any, OV = any> = (
  value: V,
  oldValue: OV,
  onCleanup: OnCleanup,
) => any

export type OnCleanup = (cleanupFn: () => void) => void

/**
 * Watch 函数的配置选项接口
 * 定义了观察器的各种行为参数，扩展自 DebuggerOptions
 */
export interface WatchOptions<Immediate = boolean> extends DebuggerOptions {
  /** 是否立即执行一次回调函数  */
  immediate?: Immediate
  /** 深度监听选项，可以是布尔值或深度限制数值 */
  deep?: boolean | number
  /** 是否只监听一次，触发后自动停止，默认为 false */
  once?: boolean
  /** 自定义调度器，用于控制回调的执行时机 */
  scheduler?: WatchScheduler
  /** 警告信息处理函数，接收警告消息和额外参数 */
  onWarn?: (msg: string, ...args: any[]) => void
  /**
   * @internal 内部使用，用于增强任务函数的功能
   */
  augmentJob?: (job: (...args: any[]) => void) => void
  /**
   * @internal 内部使用，用于调用指定函数并处理可能的错误
   */
  call?: (
    fn: Function | Function[],
    type: WatchErrorCodes,
    args?: unknown[],
  ) => void
}

export type WatchStopHandle = () => void

export interface WatchHandle extends WatchStopHandle {
  pause: () => void
  resume: () => void
  stop: () => void
}

// initial value for watchers to trigger on undefined initial values 观察者在未定义的初始值上触发的初始值
const INITIAL_WATCHER_VALUE = {}

export type WatchScheduler = (job: () => void, isFirstRun: boolean) => void

/**
 * 存储与每个响应式 effect 关联的清理函数数组
 * 用于在 effect 重新运行或停止时清理之前的副作用
 */

const cleanupMap: WeakMap<ReactiveEffect, (() => void)[]> = new WeakMap()
/** 当前活跃的监听器（Watcher） */
let activeWatcher: ReactiveEffect | undefined = undefined

/**
 * Returns the current active effect if there is one. 如果存在则返回当前激活的效果
 */
export function getCurrentWatcher(): ReactiveEffect<any> | undefined {
  return activeWatcher
}

/**
 * Registers a cleanup callback on the current active effect. This 在当前活动效果上注册一个清理回调函数。这
 * registered cleanup callback will be invoked right before the 注册的清理回调函数将在...之前被调用
 * associated effect re-runs. 相关效应的重现
 *
 * @param cleanupFn - The callback function to attach to the effect's cleanup. 附加到效果清理的回调函数
 * @param failSilently - if `true`, will not throw warning when called without 如果为`true`，则在没有参数的情况下调用时不会抛出警告
 * an active effect. 积极影响
 * @param owner - The effect that this cleanup function should be attached to. 此清理函数应附加到的效果
 * By default, the current active effect. 默认情况下，指当前生效的效果
 */
/**
 * Vue3 响应式系统核心工具函数：为监听器注册清理函数（onWatcherCleanup） --> https://cn.vuejs.org/api/reactivity-core#onwatchercleanup
 *
 * 核心作用：
 * 1. 多清理函数管理：为指定监听器（Watcher）注册多个清理函数（存入数组），支持批量执行；
 * 2. 上下文关联：默认关联当前活跃监听器（activeWatcher），也可手动指定目标监听器；
 * 3. 开发环境校验：无关联监听器且未开启静默模式时抛出警告，提示错误使用场景；
 * 4. 内存安全保障：注册的清理函数会在监听器更新/停止时批量执行，释放临时资源；
 *
 * 核心区别（与 onEffectCleanup 对比）：
 * - onEffectCleanup：为普通副作用（ReactiveEffect）注册**单个**清理函数；
 * - onWatcherCleanup：为监听器（Watcher）注册**多个**清理函数（数组存储）；
 *
 * 典型使用场景：
 * - watch 回调中注册多个异步操作的取消逻辑（如同时取消多个 fetch 请求）；
 * - 监听器依赖多个临时资源时，批量注册清理逻辑；
 * - 自定义监听器实现中，管理多组清理函数；
 *
 * @param cleanupFn 清理函数（用户定义的逻辑，如取消定时器、abort 请求、移除事件监听）；
 * @param failSilently 静默失败标记（默认 false）：
 *                     - false：开发环境无关联监听器时抛出警告；
 *                     - true：无关联监听器时静默失败，不抛警告；
 * @param owner 目标监听器（ReactiveEffect 实例，默认关联当前活跃监听器 activeWatcher）；
 */
export function onWatcherCleanup(
  cleanupFn: () => void,
  failSilently = false,
  owner: ReactiveEffect | undefined = activeWatcher,
): void {
  // 1. 核心逻辑：若存在关联的监听器（owner）→ 注册清理函数
  if (owner) {
    // 1.1 从 cleanupMap 中获取该监听器已注册的清理函数数组
    // cleanupMap 是全局 Map：key = ReactiveEffect（监听器），value = 清理函数数组
    let cleanups = cleanupMap.get(owner)
    // 1.2 若数组不存在 → 初始化并存入 cleanupMap
    if (!cleanups) cleanupMap.set(owner, (cleanups = []))
    // 1.3 将新的清理函数添加到数组末尾（支持注册多个）
    cleanups.push(cleanupFn)
  } else if (__DEV__ && !failSilently) {
    warn(
      `onWatcherCleanup() was called when there was no active watcher` + // 调用 onWatcherCleanup() 时，没有可关联的活跃监听器
        ` to associate with.`,
    )
  }
}

/**
 * Vue3 watch/watchEffect 底层核心实现函数
 *
 * 核心作用：
 *    1. 监听源解析：支持 ref/reactive/数组/函数等多种监听源，统一转换为 getter 函数；
 *    2. 依赖收集：通过 ReactiveEffect 执行 getter，收集监听源的响应式依赖；
 *    3. 更新触发：依赖变化时通过 scheduler 执行作业（job），触发回调/副作用；
 *    4. 回调处理：对比新旧值、执行清理函数、处理 immediate/once/deep 等配置；
 *    5. 生命周期管理：提供 stop/pause/resume 方法，支持监听的停止/暂停/恢复；
 *    6. 错误处理：统一封装 getter/回调/清理函数的执行，捕获并处理错误；
 *
 * @param source 监听源：
 *               - WatchSource (ref/reactive 对象/() => 值)；
 *               - WatchSource[] (多个监听源)；
 *               - WatchEffect (无回调的监听函数，即 watchEffect)；
 *               - object (直接监听的响应式对象)；
 * @param cb 监听回调（可选）：
 *           - WatchCallback (有 source 时的回调，接收 newVal/oldVal/onCleanup)；
 *           - null/undefined (watchEffect 场景，无回调)；
 * @param options 监听配置项（默认空对象）：
 *                - immediate：是否立即执行回调；
 *                - deep：是否深度监听；
 *                - once：是否只执行一次；
 *                - scheduler：自定义调度器；
 *                - augmentJob：作业增强函数（添加标记）；
 *                - call：错误处理封装函数；
 *                - onTrack/onTrigger：调试钩子；
 * @returns WatchHandle 监听句柄，包含 stop/pause/resume 方法，调用 stop 可停止监听；
 */
export function watch(
  source: WatchSource | WatchSource[] | WatchEffect | object,
  cb?: WatchCallback | null,
  options: WatchOptions = EMPTY_OBJ,
): WatchHandle {
  // 1. 解构配置项，简化后续逻辑
  const { immediate, deep, once, scheduler, augmentJob, call } = options

  // 2. 定义无效监听源警告函数：开发环境提示非法的监听源类型
  const warnInvalidSource = (s: unknown) => {
    ;(options.onWarn || warn)(
      `Invalid watch source: `, // watch来源无效
      s,
      `A watch source can only be a getter/effect function, a ref, ` + // 监视源只能是 getter/effect 函数、ref、
        `a reactive object, or an array of these types.`, // 反应式对象或这些类型的数组
    )
  }

  // 3. 响应式对象的 getter 构建函数：处理 deep 配置的差异化遍历逻辑
  const reactiveGetter = (source: object) => {
    // traverse will happen in wrapped getter below 遍历将发生在下面的包装吸气剂中
    // deep: true → 直接返回源对象（后续 traverse 会深度遍历）
    if (deep) return source

    // for `deep: false | 0` or shallow reactive, only traverse root-level properties 对于`deep: false | 0`或浅层响应式，仅遍历根级属性
    if (isShallow(source) || deep === false || deep === 0)
      return traverse(source, 1)

    // for `deep: undefined` on a reactive object, deeply traverse all properties 对于响应式对象上的“deep: undefined”，深度遍历所有属性
    return traverse(source)
  }

  // 4. 核心变量声明
  let effect: ReactiveEffect // 响应式副作用实例，负责依赖收集和触发
  let getter: () => any // 依赖收集的核心 getter 函数（由监听源转换而来）
  let cleanup: (() => void) | undefined // 清理函数（用户通过 onCleanup 注册）
  let boundCleanup: typeof onWatcherCleanup // 绑定的清理函数注册方法
  let forceTrigger = false // 是否强制触发更新（浅响应式/响应式对象默认强制触发）
  let isMultiSource = false // 是否为多监听源（source 是数组）

  // 5. 解析监听源，构建对应的 getter 函数
  // 5.1 监听 ref
  if (isRef(source)) {
    // getter 返回 ref.value
    getter = () => source.value
    // 浅 ref 强制触发更新（避免值未变化但内部属性变化时不触发）
    forceTrigger = isShallow(source)
  }
  // 5.2 监听 reactive 对象
  else if (isReactive(source)) {
    // 5.2 getter 使用 reactiveGetter
    getter = () => reactiveGetter(source)
    // 响应式对象默认强制触发更新
    forceTrigger = true
  }
  // 5.3 监听数组（多源）
  else if (isArray(source)) {
    isMultiSource = true
    // 多源中存在响应式/浅响应式对象 → 强制触发更新
    forceTrigger = source.some(s => isReactive(s) || isShallow(s))

    // getter 遍历数组，解析每个源
    getter = () =>
      source.map(s => {
        // 数组项是 ref → 返回 value
        if (isRef(s)) {
          return s.value
        }
        // 数组项是 reactive → 使用 reactiveGetter
        else if (isReactive(s)) {
          return reactiveGetter(s)
        }
        // 数组项是函数 → 执行函数（封装错误处理）
        else if (isFunction(s)) {
          return call ? call(s, WatchErrorCodes.WATCH_GETTER) : s()
        }
        // 非法类型 → 开发环境警告
        else {
          __DEV__ && warnInvalidSource(s)
        }
      })
  }
  // 5.4 监听函数
  else if (isFunction(source)) {
    // 有回调（watch(source, cb)）→ getter 执行该函数
    if (cb) {
      // getter with cb 带 cb 的 getter
      getter = call
        ? () => call(source, WatchErrorCodes.WATCH_GETTER)
        : (source as () => any)
    } else {
      // no cb -> simple effect 无cb -> 简单effect
      // getter 封装清理函数执行逻辑
      getter = () => {
        // 执行副作用前先执行清理函数（上一轮的清理逻辑）
        if (cleanup) {
          pauseTracking() // 暂停依赖收集（清理函数不应收集依赖）
          try {
            cleanup()
          } finally {
            resetTracking() // 恢复依赖收集
          }
        }

        // 标记当前活跃的 watcher，便于依赖收集时关联
        const currentEffect = activeWatcher
        activeWatcher = effect
        try {
          // 执行 watchEffect 函数，传入清理函数注册方法
          return call
            ? call(source, WatchErrorCodes.WATCH_CALLBACK, [boundCleanup])
            : source(boundCleanup)
        } finally {
          // 恢复活跃 watcher
          activeWatcher = currentEffect
        }
      }
    }
  }
  // 5.6 非法监听源
  else {
    // getter 为空函数，开发环境警告
    getter = NOOP
    __DEV__ && warnInvalidSource(source)
  }

  // 6. 处理 deep 配置（有回调时）：包装 getter 为深度遍历版本
  if (cb && deep) {
    const baseGetter = getter
    // deep 为 true → 遍历深度无限，否则取指定深度
    const depth = deep === true ? Infinity : deep
    // 新 getter：执行原 getter 后深度遍历返回值，触发所有嵌套属性的依赖收集
    getter = () => traverse(baseGetter(), depth)
  }

  // 7. 获取当前作用域，用于副作用的生命周期管理
  const scope = getCurrentScope()
  // 8. 构建监听停止句柄：停止副作用 + 从作用域中移除
  const watchHandle: WatchHandle = () => {
    effect.stop() // 停止副作用，清理所有依赖
    // 存在作用域的, 清除掉
    if (scope && scope.active) {
      remove(scope.effects, effect) // 从当前作用域移除副作用
    }
  }

  // 9. 处理 once 配置（有回调时）：执行一次后自动停止监听
  if (once && cb) {
    const _cb = cb
    cb = (...args) => {
      _cb(...args) // 执行原回调
      watchHandle() // 停止监听
    }
  }

  // 10. 初始化旧值：多源初始化为数组（填充初始标记），单源初始化为初始标记
  let oldValue: any = isMultiSource
    ? new Array((source as []).length).fill(INITIAL_WATCHER_VALUE)
    : INITIAL_WATCHER_VALUE

  // 11. 构建核心作业函数：依赖变化时执行的逻辑
  const job = (immediateFirstRun?: boolean) => {
    // 11.1 前置校验：副作用未激活 或 非脏值且非首次立即执行 → 跳过
    if (
      !(effect.flags & EffectFlags.ACTIVE) ||
      (!effect.dirty && !immediateFirstRun)
    ) {
      return
    }

    // 11.2 有回调场景（watch(source, cb)）
    if (cb) {
      // watch(source, cb)
      // 执行 getter，获取新值（触发依赖收集）
      const newValue = effect.run()

      // 判断是否需要触发回调：deep/强制触发/新旧值变化
      if (
        deep ||
        forceTrigger ||
        (isMultiSource
          ? (newValue as any[]).some((v, i) => hasChanged(v, oldValue[i])) // 多源：任意一个值变化
          : hasChanged(newValue, oldValue)) // 单源：值变化
      ) {
        // cleanup before running cb again 再次运行 cb 之前进行清理
        if (cleanup) {
          cleanup()
        }

        // 标记当前活跃 watcher
        const currentWatcher = activeWatcher
        activeWatcher = effect
        try {
          // 构建回调参数：新值、旧值（首次为 undefined）、清理函数注册方法
          const args = [
            newValue,
            // pass undefined as the old value when it's changed for the first time 第一次更改时将 undefined 作为旧值传递
            oldValue === INITIAL_WATCHER_VALUE
              ? undefined
              : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE
                ? []
                : oldValue,
            boundCleanup,
          ]
          // 更新旧值为新值
          oldValue = newValue
          // 执行回调（封装错误处理）
          call
            ? call(cb!, WatchErrorCodes.WATCH_CALLBACK, args)
            : // @ts-expect-error
              cb!(...args)
        } finally {
          activeWatcher = currentWatcher // 恢复活跃 watcher
        }
      }
    } else {
      // 11.3 无回调场景（watchEffect）→ 直接执行副作用
      // watchEffect
      effect.run()
    }
  }

  // 12. 作业增强：执行 augmentJob（添加 ALLOW_RECURSE/PRE 等标记）
  if (augmentJob) {
    augmentJob(job)
  }

  // 13. 创建响应式副作用实例：关联 getter，负责依赖收集
  effect = new ReactiveEffect(getter)

  // 14. 配置副作用的调度器：依赖变化时执行 job
  effect.scheduler = scheduler
    ? () => scheduler(job, false)
    : (job as EffectScheduler)

  /**
   * 15. 绑定清理函数注册方法：用户调用 onCleanup 时注册清理逻辑
   *      - 回调中的 onCleanup 实现, 用于副作用清理 --> https://cn.vuejs.org/guide/essentials/watchers.html#side-effect-cleanup
   */
  boundCleanup = fn => onWatcherCleanup(fn, false, effect)

  /**
   * 16. 配置副作用的停止钩子：执行所有注册的清理函数
   *      - 当停止 watch 时, 会调用这个函数
   */
  cleanup = effect.onStop = () => {
    // 从 cleanupMap 中提取对应的副作用清理函数
    const cleanups = cleanupMap.get(effect)
    if (cleanups) {
      // 执行所有清理函数（封装错误处理）
      if (call) {
        call(cleanups, WatchErrorCodes.WATCH_CLEANUP)
      } else {
        for (const cleanup of cleanups) cleanup()
      }
      // 清理完后删除映射，避免内存泄漏
      cleanupMap.delete(effect)
    }
  }

  // 17. 开发环境：配置调试钩子（onTrack/onTrigger）
  if (__DEV__) {
    effect.onTrack = options.onTrack
    effect.onTrigger = options.onTrigger
  }

  // initial run 初始运行
  /**
   * 18. 首次执行逻辑
   *      effect.run() 和 job 的不同之处
   */
  if (cb) {
    if (immediate) {
      // 18.1 有回调 + immediate → 执行 job（首次立即执行）
      job(true)
    } else {
      // 18.2 有回调 + 非 immediate → 执行 getter，初始化旧值
      oldValue = effect.run()
    }
  }
  // 18.3 无回调 + 自定义调度器 → 通过调度器执行首次运行
  else if (scheduler) {
    scheduler(job.bind(null, true), true)
  }
  // 18.4 无回调 + 无调度器 → 直接执行副作用
  else {
    effect.run()
  }

  // 19. 扩展监听句柄：添加 pause/resume/stop 方法
  watchHandle.pause = effect.pause.bind(effect)
  watchHandle.resume = effect.resume.bind(effect)
  watchHandle.stop = watchHandle

  // 20. 返回监听句柄
  return watchHandle
}

/**
 * Vue3 响应式系统核心工具函数：深度遍历任意值（traverse）
 *
 * 核心作用：
 *    1. 深度遍历：递归遍历对象/数组/Set/Map/Ref 等数据结构的所有嵌套属性；
 *    2. 深度限制：支持指定遍历深度（depth），避免无限递归遍历深层嵌套数据；
 *    3. 循环引用防护：通过 seen Map 记录已遍历对象和当前深度，避免循环引用导致的栈溢出；
 *    4. 跳过机制：跳过标记为 ReactiveFlags.SKIP 的对象（无需追踪的响应式对象）；
 *    5. 全类型适配：兼容 Ref/数组/Set/Map/普通对象/符号属性等所有常见数据类型；
 *
 * 典型使用场景：
 *    - watch 配置 deep: true 时，遍历监听对象的所有嵌套属性，触发依赖收集；
 *    - watchEffect 中需要深度追踪复杂对象变化时，手动调用 traverse 触发全量收集；
 *    - 响应式系统内部需要遍历数据结构的通用场景；
 *
 * @param value 待遍历的值（任意类型：基本类型/对象/数组/Ref/Set/Map 等）；
 * @param depth 遍历深度限制（默认 Infinity，即无限深度）；
 * @param seen 记录已遍历对象的 Map（内部递归使用，外部调用无需传参）：
 *             - key：已遍历的对象引用；
 *             - value：该对象对应的遍历深度；
 * @returns 原输入值（遍历过程无返回值，仅触发依赖收集，返回值为兼容链式调用）；
 */
export function traverse(
  value: unknown,
  depth: number = Infinity,
  seen?: Map<unknown, number>,
): unknown {
  // 1. 遍历终止条件（满足任一则直接返回，不继续遍历）：
  if (
    depth <= 0 || // depth <= 0：已达到指定遍历深度；
    !isObject(value) || // 非对象/数组（基本类型，无需遍历）；
    (value as any)[ReactiveFlags.SKIP] // 对象标记为 SKIP（跳过追踪）；
  ) {
    return value
  }

  // 2. 初始化 seen Map（首次调用时创建，递归调用时复用）
  seen = seen || new Map()

  // 3. 循环引用防护：若对象已遍历过且记录的深度 ≥ 当前深度 → 跳过，避免循环递归
  if ((seen.get(value) || 0) >= depth) {
    return value
  }

  // 4. 记录当前对象的遍历深度 → 标记已遍历，防止循环引用
  seen.set(value, depth)
  // 5. 遍历深度递减 → 嵌套层级每深入一层，深度减 1
  depth--

  // 6. 按数据类型分支处理，递归遍历内部值
  // 6.1 处理 Ref 类型：遍历 Ref 的 value 属性（自动解包）
  if (isRef(value)) {
    traverse(value.value, depth, seen)
  }
  // 6.2 处理数组类型：遍历数组的每一个元素
  else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen)
    }
  }
  // 6.3 处理 Set/Map 类型：遍历其所有值（forEach 兼容 Set/Map 的遍历）
  else if (isSet(value) || isMap(value)) {
    value.forEach((v: any) => {
      traverse(v, depth, seen)
    })
  }
  // 6.4 处理普通对象（纯对象，非数组/Set/Map/Ref）
  else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen)
    }

    // 6.4.2 遍历对象的 Symbol 键属性（保证 Symbol 属性也被追踪）
    for (const key of Object.getOwnPropertySymbols(value)) {
      if (Object.prototype.propertyIsEnumerable.call(value, key)) {
        traverse(value[key as any], depth, seen)
      }
    }
  }

  // 7. 返回原输入值 → 兼容链式调用（如 traverse(obj).xxx）
  return value
}
