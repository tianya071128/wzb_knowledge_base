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

const cleanupMap: WeakMap<ReactiveEffect, (() => void)[]> = new WeakMap()
let activeWatcher: ReactiveEffect | undefined = undefined

/**
 * Returns the current active effect if there is one. 如果存在则返回当前激活的效果
 */
export function getCurrentWatcher(): ReactiveEffect<any> | undefined {
  return activeWatcher
}

/**
 * Registers a cleanup callback on the current active effect. This
 * registered cleanup callback will be invoked right before the
 * associated effect re-runs.
 *
 * @param cleanupFn - The callback function to attach to the effect's cleanup.
 * @param failSilently - if `true`, will not throw warning when called without
 * an active effect.
 * @param owner - The effect that this cleanup function should be attached to.
 * By default, the current active effect.
 */
export function onWatcherCleanup(
  cleanupFn: () => void,
  failSilently = false,
  owner: ReactiveEffect | undefined = activeWatcher,
): void {
  if (owner) {
    let cleanups = cleanupMap.get(owner)
    if (!cleanups) cleanupMap.set(owner, (cleanups = []))
    cleanups.push(cleanupFn)
  } else if (__DEV__ && !failSilently) {
    warn(
      `onWatcherCleanup() was called when there was no active watcher` +
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
    // traverse will happen in wrapped getter below
    if (deep) return source
    // for `deep: false | 0` or shallow reactive, only traverse root-level properties
    if (isShallow(source) || deep === false || deep === 0)
      return traverse(source, 1)
    // for `deep: undefined` on a reactive object, deeply traverse all properties
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

  // 16. 配置副作用的停止钩子：执行所有注册的清理函数
  cleanup = effect.onStop = () => {
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

export function traverse(
  value: unknown,
  depth: number = Infinity,
  seen?: Map<unknown, number>,
): unknown {
  if (depth <= 0 || !isObject(value) || (value as any)[ReactiveFlags.SKIP]) {
    return value
  }

  seen = seen || new Map()
  if ((seen.get(value) || 0) >= depth) {
    return value
  }
  seen.set(value, depth)
  depth--
  if (isRef(value)) {
    traverse(value.value, depth, seen)
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen)
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v: any) => {
      traverse(v, depth, seen)
    })
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen)
    }
    for (const key of Object.getOwnPropertySymbols(value)) {
      if (Object.prototype.propertyIsEnumerable.call(value, key)) {
        traverse(value[key as any], depth, seen)
      }
    }
  }
  return value
}
