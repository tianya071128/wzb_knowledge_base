import {
  type ComponentInternalInstance,
  currentInstance,
  isInSSRComponentSetup,
  setCurrentInstance,
} from './component'
import type { ComponentPublicInstance } from './componentPublicInstance'
import { ErrorTypeStrings, callWithAsyncErrorHandling } from './errorHandling'
import { warn } from './warning'
import { toHandlerKey } from '@vue/shared'
import {
  type DebuggerEvent,
  pauseTracking,
  resetTracking,
} from '@vue/reactivity'
import { LifecycleHooks } from './enums'

export { onActivated, onDeactivated } from './components/KeepAlive'

/**
 * Vue3 生命周期钩子注入核心函数
 * 核心作用：
 *   1. 将用户/内部定义的生命周期钩子注入到目标组件实例的对应钩子队列；
 *   2. 包装原始钩子，添加错误处理、暂停响应式追踪、绑定当前组件实例等通用逻辑；
 *   3. 缓存包装后的钩子（__weh），保证调度器能正确去重，避免钩子重复执行；
 *   4. 支持控制钩子注入到队列的头部/尾部，适配 KeepAlive 等特殊场景；
 *   5. 开发环境下，无有效目标实例时给出精准警告，引导用户正确使用生命周期钩子。
 *
 *
 * @param type 生命周期钩子类型（如 LifecycleHooks.MOUNTED/LifecycleHooks.UPDATED 等）
 * @param hook 要注入的原始生命周期钩子函数，附带 __weh 属性（缓存带错误处理的包装钩子）
 * @param target 钩子要注入的目标组件内部实例，默认值为当前激活的组件实例（currentInstance）
 * @param prepend 是否将钩子注入到队列头部（默认 false，注入尾部），适配 KeepAlive 等需要优先执行的场景
 * @returns Function | undefined - 返回包装后的钩子（注入到队列的实际钩子），无目标实例时返回 undefined
 */
export function injectHook(
  type: LifecycleHooks,
  hook: Function & { __weh?: Function },
  target: ComponentInternalInstance | null = currentInstance,
  prepend: boolean = false,
): Function | undefined {
  // ********** 核心分支：存在有效目标组件实例时，执行钩子注入逻辑 **********
  if (target) {
    // 1. 获取/初始化目标实例的对应生命周期钩子队列
    // 逻辑：若 target[type] 已存在则直接使用，否则初始化为空数组（如 target.mounted = []）
    const hooks = target[type] || (target[type] = [])
    // cache the error handling wrapper for injected hooks so the same hook 为注入的钩子缓存错误处理包装器，以便相同的钩子
    // can be properly deduped by the scheduler. "__weh" stands for "with error 调度器可以正确地进行去重处理。“__weh”代表“with error（有错误）”
    // handling". “处理”。
    // 2. 包装原始钩子：添加错误处理、响应式追踪暂停、当前实例绑定等通用逻辑
    // 缓存包装后的钩子到 hook.__weh，避免重复包装（保证同一个原始钩子只生成一个包装钩子）
    // 原因：调度器（scheduler）会根据函数引用去重，重复包装会导致去重失效，钩子多次执行
    const wrappedHook =
      hook.__weh ||
      (hook.__weh = (...args: unknown[]) => {
        // disable tracking inside all lifecycle hooks 在所有生命周期钩子中禁用跟踪
        // since they can potentially be called inside effects. 因为它们可能被称为内部效应
        // 2.1 暂停响应式追踪
        // 原因：生命周期钩子可能在响应式 effect 内部被调用，暂停追踪可避免意外的依赖收集，防止响应式逻辑异常
        pauseTracking()

        // Set currentInstance during hook invocation. 在钩子调用期间设置 currentInstance
        // This assumes the hook does not synchronously trigger other hooks, which 这假设该钩子不会同步触发其他钩子
        // can only be false when the user does something really funky. 只有当用户做出非常古怪的事情时，它才会出错
        // 2.2 绑定当前组件实例到全局 currentInstance
        // setCurrentInstance：Vue 内部方法，将 target 设为全局当前激活的组件实例，返回重置函数
        // 作用：保证钩子执行时，getCurrentInstance() 能正确获取到所属的组件实例（用户可能在钩子中调用此 API）
        // 注释说明：假设钩子不会同步触发其他钩子（除非用户写了非常规代码），因此只需单次绑定
        const reset = setCurrentInstance(target)

        // 2.3 执行原始钩子，并包裹异步错误处理逻辑
        // callWithAsyncErrorHandling：Vue 内部核心错误处理方法，捕获钩子执行的同步/异步错误，
        // 并根据钩子类型（type）上报错误，保证单个钩子报错不阻塞整个应用
        const res = callWithAsyncErrorHandling(hook, target, type, args)

        // 2.4 重置全局 currentInstance 到之前的状态
        // 避免钩子执行后，currentInstance 残留为当前 target，导致后续逻辑获取错误的实例
        reset()

        // 2.5 恢复响应式追踪
        resetTracking()
        return res
      })

    // 3. 将包装后的钩子注入到钩子队列，控制注入顺序
    if (prepend) {
      hooks.unshift(wrappedHook) // prepend=true：注入到队列头部（如 KeepAlive 钩子需要优先执行）
    } else {
      hooks.push(wrappedHook) // prepend=false：默认注入到队列尾部（常规生命周期钩子）
    }

    // 4. 返回包装后的钩子（供后续清理逻辑使用，如 injectToKeepAliveRoot 中的卸载清理）
    return wrappedHook
  }
  // ********** 开发环境分支：无有效目标实例时，给出精准警告 **********
  else if (__DEV__) {
    const apiName = toHandlerKey(ErrorTypeStrings[type].replace(/ hook$/, ''))
    warn(
      `${apiName} is called when there is no active component instance to be ` + // 当没有活动的组件实例时，会调用它
        `associated with. ` + // 与...相关
        `Lifecycle injection APIs can only be used during execution of setup().` + // 生命周期注入API只能在setup()执行期间使用
        (__FEATURE_SUSPENSE__
          ? ` If you are using async setup(), make sure to register lifecycle ` + // 如果你正在使用async setup()，请确保注册生命周期
            `hooks before the first await statement.` // 在第一个 await 语句之前的钩子
          : ``),
    )
  }
}

const createHook =
  <T extends Function = () => any>(lifecycle: LifecycleHooks) =>
  (
    hook: T,
    target: ComponentInternalInstance | null = currentInstance,
  ): void => {
    // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
    if (
      !isInSSRComponentSetup ||
      lifecycle === LifecycleHooks.SERVER_PREFETCH
    ) {
      injectHook(lifecycle, (...args: unknown[]) => hook(...args), target)
    }
  }
type CreateHook<T = any> = (
  hook: T,
  target?: ComponentInternalInstance | null,
) => void

export const onBeforeMount: CreateHook = createHook(LifecycleHooks.BEFORE_MOUNT)
export const onMounted: CreateHook = createHook(LifecycleHooks.MOUNTED)
export const onBeforeUpdate: CreateHook = createHook(
  LifecycleHooks.BEFORE_UPDATE,
)
export const onUpdated: CreateHook = createHook(LifecycleHooks.UPDATED)
export const onBeforeUnmount: CreateHook = createHook(
  LifecycleHooks.BEFORE_UNMOUNT,
)
export const onUnmounted: CreateHook = createHook(LifecycleHooks.UNMOUNTED)
export const onServerPrefetch: CreateHook = createHook(
  LifecycleHooks.SERVER_PREFETCH,
)

export type DebuggerHook = (e: DebuggerEvent) => void
export const onRenderTriggered: CreateHook<DebuggerHook> =
  createHook<DebuggerHook>(LifecycleHooks.RENDER_TRIGGERED)
export const onRenderTracked: CreateHook<DebuggerHook> =
  createHook<DebuggerHook>(LifecycleHooks.RENDER_TRACKED)

export type ErrorCapturedHook<TError = unknown> = (
  err: TError,
  instance: ComponentPublicInstance | null,
  info: string,
) => boolean | void

export function onErrorCaptured<TError = Error>(
  hook: ErrorCapturedHook<TError>,
  target: ComponentInternalInstance | null = currentInstance,
): void {
  injectHook(LifecycleHooks.ERROR_CAPTURED, hook, target)
}
