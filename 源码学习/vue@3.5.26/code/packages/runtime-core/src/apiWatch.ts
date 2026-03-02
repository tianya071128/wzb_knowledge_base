import {
  type WatchOptions as BaseWatchOptions,
  type DebuggerOptions,
  type ReactiveMarker,
  type WatchCallback,
  type WatchEffect,
  type WatchHandle,
  type WatchSource,
  watch as baseWatch,
} from '@vue/reactivity'
import { type SchedulerJob, SchedulerJobFlags, queueJob } from './scheduler'
import { EMPTY_OBJ, NOOP, extend, isFunction, isString } from '@vue/shared'
import {
  type ComponentInternalInstance,
  currentInstance,
  isInSSRComponentSetup,
  setCurrentInstance,
} from './component'
import { callWithAsyncErrorHandling } from './errorHandling'
import { queuePostRenderEffect } from './renderer'
import { warn } from './warning'
import type { ObjectWatchOptionItem } from './componentOptions'
import { useSSRContext } from './helpers/useSsrContext'
import type { ComponentPublicInstance } from './componentPublicInstance'

export type {
  WatchHandle,
  WatchStopHandle,
  WatchEffect,
  WatchSource,
  WatchCallback,
  OnCleanup,
} from '@vue/reactivity'

type MaybeUndefined<T, I> = I extends true ? T | undefined : T

type MapSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? MaybeUndefined<V, Immediate>
    : T[K] extends object
      ? MaybeUndefined<T[K], Immediate>
      : never
}

export interface WatchEffectOptions extends DebuggerOptions {
  flush?: 'pre' | 'post' | 'sync'
}

export interface WatchOptions<Immediate = boolean> extends WatchEffectOptions {
  immediate?: Immediate
  deep?: boolean | number
  once?: boolean
}

// Simple effect. 简单效果
/**
 * 创建一个侦听器，当依赖的数据变化时执行指定的副作用函数
 * 这个函数会立即执行一次副作用函数，并开始追踪其依赖关系
 *
 * @param effect - 需要被侦听的副作用函数，当其依赖的数据变化时会被重新执行
 * @param options - 可选的配置选项，用于控制侦听行为，如刷新时机等
 * @returns 返回一个WatchHandle对象，可用于停止侦听或进行其他操作
 */
export function watchEffect(
  effect: WatchEffect,
  options?: WatchEffectOptions,
): WatchHandle {
  return doWatch(effect, null, options)
}

/**
 * 创建一个在组件更新后执行的侦听副作用函数
 * 此函数确保副作用在DOM更新完成后运行
 *
 * @param effect - 副作用函数，当依赖项变化时执行
 * @param options - 可选的调试选项，用于调试目的
 * @returns 返回一个WatchHandle对象，可用于停止侦听器
 */
export function watchPostEffect(
  effect: WatchEffect,
  options?: DebuggerOptions,
): WatchHandle {
  return doWatch(
    effect,
    null,
    __DEV__
      ? extend({}, options as WatchEffectOptions, { flush: 'post' })
      : { flush: 'post' },
  )
}

/**
 * 创建一个同步执行的监听副作用函数
 * 该函数创建一个在数据变化时立即同步执行的watcher，而不是在下一个tick或微任务中执行
 *
 * @param effect - 监听的副作用函数，当依赖的数据发生变化时会执行此函数
 * @param options - 调试选项，可选参数，用于配置调试相关的行为
 * @returns WatchHandle - 返回一个watch处理器，可用于停止监听或进行其他操作
 */
export function watchSyncEffect(
  effect: WatchEffect,
  options?: DebuggerOptions,
): WatchHandle {
  return doWatch(
    effect,
    null,
    __DEV__
      ? extend({}, options as WatchEffectOptions, { flush: 'sync' })
      : { flush: 'sync' },
  )
}

export type MultiWatchSources = (WatchSource<unknown> | object)[]

// overload: single source + cb 过载：单源+cb
export function watch<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, MaybeUndefined<T, Immediate>>,
  options?: WatchOptions<Immediate>,
): WatchHandle

// overload: reactive array or tuple of multiple sources + cb 重载：多个源的反应数组或元组 + cb
export function watch<
  T extends Readonly<MultiWatchSources>,
  Immediate extends Readonly<boolean> = false,
>(
  sources: readonly [...T] | T,
  cb: [T] extends [ReactiveMarker]
    ? WatchCallback<T, MaybeUndefined<T, Immediate>>
    : WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>,
): WatchHandle

// overload: array of multiple sources + cb 重载：多个源数组 + cb
export function watch<
  T extends MultiWatchSources,
  Immediate extends Readonly<boolean> = false,
>(
  sources: [...T],
  cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>,
): WatchHandle

// overload: watching reactive object w/ cb 重载：用 cb 观察反应对象
export function watch<
  T extends object,
  Immediate extends Readonly<boolean> = false,
>(
  source: T,
  cb: WatchCallback<T, MaybeUndefined<T, Immediate>>,
  options?: WatchOptions<Immediate>,
): WatchHandle

// implementation 实现
export function watch<T = any, Immediate extends Readonly<boolean> = false>(
  source: T | WatchSource<T>,
  cb: any,
  options?: WatchOptions<Immediate>,
): WatchHandle {
  if (__DEV__ && !isFunction(cb)) {
    warn(
      `\`watch(fn, options?)\` signature has been moved to a separate API. ` + // `\`watch(fn, options?)\` 签名已移至单独的 API。 `
        `Use \`watchEffect(fn, options?)\` instead. \`watch\` now only ` + // 请使用`watchEffect(fn, options?)`替代。`watch`现在仅支持`
        `supports \`watch(source, cb, options?) signature.`, //  `supports \`watch(source, cb, options?) 签名。
    )
  }
  return doWatch(source as any, cb, options)
}

/**
 * Vue3 watch/watchEffect 核心封装函数（doWatch）
 *
 * 核心作用：
 *    1. 参数校验：开发环境校验 watch 配置项（immediate/deep/once）的合法性，避免误用；
 *    2. 配置整合：合并用户传入的 options，补充错误处理、调度器等基础配置；
 *    3. 调度器定制：根据 flush 选项（pre/sync/post）配置不同的作业调度策略；
 *    4. 作业标记：为调度器作业添加 ALLOW_RECURSE/PRE 标记，适配递归触发、执行时机；
 *    5. SSR 适配：服务端渲染场景下处理 watcher 的执行/清理逻辑，避免客户端/服务端行为不一致；
 *    6. 入口封装：调用底层 baseWatch 实现核心监听逻辑，返回统一的停止句柄；
 *
 * @param source 监听源：
 *               - WatchSource (ref/reactive 对象/() => 值)；
 *               - WatchSource[] (多个监听源)；
 *               - WatchEffect (无回调的监听函数，即 watchEffect)；
 *               - object (直接监听的响应式对象)；
 * @param cb 监听回调：
 *           - WatchCallback (有 source 时的回调，接收 newVal/oldVal/onCleanup)；
 *           - null (watchEffect 场景，无回调)；
 * @param options 监听配置项（默认空对象）：
 *                - immediate：是否立即执行回调；
 *                - deep：是否深度监听；
 *                - flush：执行时机（pre/sync/post）；
 *                - once：是否只执行一次；
 * @returns WatchHandle 停止监听的句柄（包含 stop/pause/resume 方法）；
 */
function doWatch(
  source: WatchSource | WatchSource[] | WatchEffect | object,
  cb: WatchCallback | null,
  options: WatchOptions = EMPTY_OBJ,
): WatchHandle {
  // 1. 解构核心配置项，简化后续逻辑
  const { immediate, deep, flush, once } = options

  // 2. 开发环境参数合法性校验：仅当无回调（watchEffect 场景）时，提示无效配置
  if (__DEV__ && !cb) {
    // watchEffect 不支持 immediate 配置 → 警告
    if (immediate !== undefined) {
      warn(
        `watch() "immediate" option is only respected when using the ` + // watch() 的 "immediate" 选项仅在使用时有效
          `watch(source, callback, options?) signature.`, // watch(source, callback, options?) 签名。
      )
    }
    // watchEffect 不支持 deep 配置 → 警告
    if (deep !== undefined) {
      warn(
        `watch() "deep" option is only respected when using the ` +
          `watch(source, callback, options?) signature.`,
      )
    }
    // watchEffect 不支持 once 配置 → 警告
    if (once !== undefined) {
      warn(
        `watch() "once" option is only respected when using the ` +
          `watch(source, callback, options?) signature.`,
      )
    }
  }

  // 3. 整合基础配置：拷贝用户配置，避免修改原对象
  const baseWatchOptions: BaseWatchOptions = extend({}, options)

  // 4. 开发环境补充警告处理函数，便于捕获 watch 内部警告
  if (__DEV__) baseWatchOptions.onWarn = warn

  // immediate watcher or watchEffect 立即观察者或 watchEffect
  // 5. 判断是否需要“立即执行”：
  //    - 有回调 + immediate：watch(source, cb, { immediate: true })；
  //    - 无回调（watchEffect） + flush ≠ post：默认 pre/sync 时机立即执行；
  const runsImmediately = (cb && immediate) || (!cb && flush !== 'post')

  // 6. SSR（服务端渲染）场景适配
  let ssrCleanup: (() => void)[] | undefined
  if (__SSR__ && isInSSRComponentSetup) {
    if (flush === 'sync') {
      // 6.1 flush: sync → 收集清理函数到 SSR 上下文，便于组件卸载时清理
      const ctx = useSSRContext()!
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = [])
    } else if (!runsImmediately) {
      // 6.2 非立即执行 → 返回空的停止句柄（SSR 下无需执行客户端调度逻辑）
      const watchStopHandle = () => {}
      watchStopHandle.stop = NOOP
      watchStopHandle.resume = NOOP
      watchStopHandle.pause = NOOP
      return watchStopHandle
    }
  }

  // 7. 获取当前组件实例，用于错误处理时关联组件上下文
  const instance = currentInstance
  // 7.1 配置错误处理函数：封装回调执行，统一处理异步/同步错误
  baseWatchOptions.call = (fn, type, args) =>
    callWithAsyncErrorHandling(fn, instance, type, args)

  // scheduler 调度程序
  // 8. 配置调度器（scheduler）：根据 flush 选项定制作业执行策略
  let isPre = false // 标记是否为 pre 时机执行

  // 8.1 flush: post → 组件渲染后执行（放入 postRender 队列）
  if (flush === 'post') {
    // post --> 在组件渲染后执行, 使用 queuePostRenderEffect 调度器
    baseWatchOptions.scheduler = job => {
      queuePostRenderEffect(job, instance && instance.suspense)
    }
  }
  // 8.2 flush: pre（默认） → 组件渲染前执行
  else if (flush !== 'sync') {
    // default: 'pre'
    isPre = true
    baseWatchOptions.scheduler = (job, isFirstRun) => {
      if (isFirstRun) {
        /**
         * 首次执行 → 直接执行，不加入队列
         *  - 当 watchEffect(() => {xxx}) --> 该函数会同步执行一次, 当依赖变更时, 就使用 queueJob 队列调度
         */
        job()
      } else {
        // 非首次 → 加入预渲染队列，组件渲染前执行
        queueJob(job)
      }
    }
  }
  // 8.3 flush: sync → 不配置 scheduler，底层 baseWatch 会同步执行

  // 9. 作业增强函数：为调度器作业添加标记，控制执行逻辑
  baseWatchOptions.augmentJob = (job: SchedulerJob) => {
    // important: mark the job as a watcher callback so that scheduler knows 重要：将作业标记为观察者回调，以便调度程序知道
    // it is allowed to self-trigger (#1727) 允许自触发 (#1727)

    // 9.1 有回调（watch）→ 标记允许递归触发（ALLOW_RECURSE）
    //     原因：watch 回调不追踪依赖，递归触发通常是开发者有意为之（如修改监听源）
    if (cb) {
      job.flags! |= SchedulerJobFlags.ALLOW_RECURSE
    }

    // 9.2 pre 时机执行 → 标记 PRE，并关联组件实例 ID/引用
    if (isPre) {
      job.flags! |= SchedulerJobFlags.PRE
      if (instance) {
        job.id = instance.uid // 关联组件 ID，便于调度器按组件顺序执行
        ;(job as SchedulerJob).i = instance // 关联组件实例，便于错误追踪
      }
    }
  }

  // 10. 调用底层 baseWatch 实现核心监听逻辑，返回停止句柄
  const watchHandle = baseWatch(source, cb, baseWatchOptions)

  // 11. SSR 场景收尾：
  if (__SSR__ && isInSSRComponentSetup) {
    if (ssrCleanup) {
      ssrCleanup.push(watchHandle)
    } else if (runsImmediately) {
      watchHandle()
    }
  }

  // 12. 返回停止监听的句柄（用户可调用 watchHandle.stop() 停止监听）
  return watchHandle
}

// this.$watch
export function instanceWatch(
  this: ComponentInternalInstance,
  source: string | Function,
  value: WatchCallback | ObjectWatchOptionItem,
  options?: WatchOptions,
): WatchHandle {
  const publicThis = this.proxy
  const getter = isString(source)
    ? source.includes('.')
      ? createPathGetter(publicThis!, source)
      : () => publicThis![source as keyof typeof publicThis]
    : source.bind(publicThis, publicThis)
  let cb
  if (isFunction(value)) {
    cb = value
  } else {
    cb = value.handler as Function
    options = value
  }
  const reset = setCurrentInstance(this)
  const res = doWatch(getter, cb.bind(publicThis), options)
  reset()
  return res
}

export function createPathGetter(
  ctx: ComponentPublicInstance,
  path: string,
): () => WatchSource | WatchSource[] | WatchEffect | object {
  const segments = path.split('.')
  return (): WatchSource | WatchSource[] | WatchEffect | object => {
    let cur = ctx
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i] as keyof typeof cur]
    }
    return cur
  }
}
