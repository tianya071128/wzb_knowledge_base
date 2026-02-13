import {
  type Component,
  type ComponentInternalInstance,
  type ComponentOptions,
  type ConcreteComponent,
  currentInstance,
  getComponentName,
  isInSSRComponentSetup,
} from './component'
import { isFunction, isObject } from '@vue/shared'
import type { ComponentPublicInstance } from './componentPublicInstance'
import { type VNode, createVNode } from './vnode'
import { defineComponent } from './apiDefineComponent'
import { warn } from './warning'
import { ref } from '@vue/reactivity'
import { ErrorCodes, handleError } from './errorHandling'
import { isKeepAlive } from './components/KeepAlive'
import { markAsyncBoundary } from './helpers/useId'
import { type HydrationStrategy, forEachElement } from './hydrationStrategies'

export type AsyncComponentResolveResult<T = Component> = T | { default: T } // es modules

export type AsyncComponentLoader<T = any> = () => Promise<
  AsyncComponentResolveResult<T>
>

export interface AsyncComponentOptions<T = any> {
  loader: AsyncComponentLoader<T>
  loadingComponent?: Component
  errorComponent?: Component
  delay?: number
  timeout?: number
  suspensible?: boolean
  hydrate?: HydrationStrategy
  onError?: (
    error: Error,
    retry: () => void,
    fail: () => void,
    attempts: number,
  ) => any
}

export const isAsyncWrapper = (i: ComponentInternalInstance | VNode): boolean =>
  !!(i.type as ComponentOptions).__asyncLoader

/**
 * Vue3 异步组件定义核心函数
 * 核心作用：
 *  1. 封装异步组件的加载逻辑, 返回一个组件对象
 *  2. 处理异步组件的加载, 根据不同状态返回对应的组件
 *  3. 支持重试逻辑: 这个重试是实时重试的, 而不是支持用户任意时段重试
 *      - 根据用户传入的 onError 方法, 在回调中调用重试方法
 *      - 如果需要实现用户任意时段重试, 可能得方案:
 *         -- 继续在 defineAsyncComponent 封装一层, 点击重试按钮时, 重新返回一个新的 defineAsyncComponent --> 因为 steup 里面的状态是固定的, 无法在外部改变
 *         -- 还需要借助 @fatso83/retry-dynamic-import 库重写 () => import('xxx') 中的请求地址, 携带一个随机数, 绕开浏览器的缓存
 *  4. ref 透传
 *      - 在 createInnerComp 方法
 *
 * @param source 异步组件源，可以是两种形式：
 *   - AsyncComponentLoader<T>：纯加载器函数（返回组件的 Promise）；
 *   - AsyncComponentOptions<T>：完整选项对象（包含 loader、loadingComponent、errorComponent 等配置）；
 *
 * @returns T 包装后的异步组件（本质是一个名为 AsyncComponentWrapper 的包装组件）
 */
/*@__NO_SIDE_EFFECTS__*/
export function defineAsyncComponent<
  T extends Component = { new (): ComponentPublicInstance },
>(source: AsyncComponentLoader<T> | AsyncComponentOptions<T>): T {
  // 1. 标准化入参：若传入的是纯加载器函数，转为完整选项对象（{ loader: 函数 }）
  if (isFunction(source)) {
    source = { loader: source }
  }

  // 2. 解构异步组件选项，设置默认值
  const {
    loader, // 核心：组件加载器函数（返回 Promise<Component>）
    loadingComponent, // 加载中显示的组件
    errorComponent, // 加载失败显示的组件
    delay = 200, // 延迟显示 loadingComponent 的时间（ms），默认 200ms（避免加载过快导致loading闪烁）
    hydrate: hydrateStrategy, // SSR 水合策略（自定义水合时机/逻辑）
    timeout, // 加载超时时间（ms），undefined 表示永不超时
    suspensible = true, // 是否允许被 Suspense 控制，默认 true
    onError: userOnError, // 用户自定义的加载错误回调（支持重试/失败处理）
  } = source

  // 3. 核心状态管理：避免重复请求 + 缓存已解析组件
  let pendingRequest: Promise<ConcreteComponent> | null = null // 挂起的加载请求（复用请求，避免重复加载）
  let resolvedComp: ConcreteComponent | undefined // 已解析的组件（缓存，加载完成后复用）

  // 4. 重试逻辑：记录重试次数 + 重试函数
  let retries = 0 // 已重试次数
  const retry = () => {
    retries++ // 重试次数+1
    pendingRequest = null // 清空挂起请求，允许重新发起加载
    return load() // 重新执行加载逻辑
  }

  /**
   * 核心加载函数：封装组件加载的完整逻辑
   * 核心特性：
   *  1. 请求复用：若已有挂起的请求，直接返回该请求（避免重复加载）；
   *  2. 错误处理：支持用户自定义 onError 回调（重试/失败）；
   *  3. 模块兼容：处理 ES Module 默认导出（comp.default）；
   *  4. 参数校验：开发环境校验加载结果的合法性；
   *  5. 缓存更新：加载完成后更新 resolvedComp 缓存。
   *
   * @returns Promise<ConcreteComponent> 组件加载 Promise
   */
  const load = (): Promise<ConcreteComponent> => {
    let thisRequest: Promise<ConcreteComponent> // 当前请求（用于判断是否为最新请求）
    return (
      pendingRequest || // 优先复用挂起的请求
      (thisRequest = pendingRequest = // 无挂起请求则新建请求，并赋值给 pendingRequest
        loader()
          // 处理加载错误
          .catch(err => {
            // 标准化错误：确保 err 是 Error 实例
            err = err instanceof Error ? err : new Error(String(err))
            // 有用户自定义错误回调：交给用户处理（支持重试/失败）
            if (userOnError) {
              return new Promise((resolve, reject) => {
                // 用户回调的三个参数：错误对象、重试函数、失败函数、当前重试次数
                const userRetry = () => resolve(retry()) // 用户调用 retry 时，解析为重试后的 Promise
                const userFail = () => reject(err) // 用户调用 fail 时，拒绝 Promise
                userOnError(err, userRetry, userFail, retries + 1)
              })
            }
            // 无用户自定义错误回调：直接抛出错误
            else {
              throw err
            }
          })
          // 处理加载成功
          .then((comp: any) => {
            // 边界处理：当前请求已不是最新请求（比如快速多次触发加载）→ 返回最新的挂起请求
            if (thisRequest !== pendingRequest && pendingRequest) {
              return pendingRequest
            }

            // 开发环境警告：加载器返回 undefined
            if (__DEV__ && !comp) {
              warn(
                `Async component loader resolved to undefined. ` + // 异步组件加载器解析为未定义
                  `If you are using retry(), make sure to return its return value.`, // 如果您使用 retry()，请确保返回其返回值
              )
            }

            // 模块兼容：处理 ES Module 默认导出（如 export default 组件）
            // interop module default 互操作模块默认值
            if (
              comp &&
              (comp.__esModule || comp[Symbol.toStringTag] === 'Module')
            ) {
              comp = comp.default
            }

            // 开发环境校验：加载结果必须是对象/函数（合法的 Vue 组件）
            if (__DEV__ && comp && !isObject(comp) && !isFunction(comp)) {
              throw new Error(`Invalid async component load result: ${comp}`) // 无效的异步组件加载结果
            }

            // 更新缓存：已解析的组件存入 resolvedComp
            resolvedComp = comp
            return comp
          }))
    )
  }

  // 5. 返回包装组件（AsyncComponentWrapper）：承载异步组件的所有逻辑
  return defineComponent({
    name: 'AsyncComponentWrapper',

    __asyncLoader: load, // Vue 内部标识：挂载加载函数（供 Suspense/渲染器使用）

    __asyncHydrate(el, instance, hydrate) {
      let patched = false
      ;(instance.bu || (instance.bu = [])).push(() => (patched = true))
      const performHydrate = () => {
        // skip hydration if the component has been patched
        if (patched) {
          if (__DEV__) {
            warn(
              `Skipping lazy hydration for component '${getComponentName(resolvedComp!) || resolvedComp!.__file}': ` +
                `it was updated before lazy hydration performed.`,
            )
          }
          return
        }
        hydrate()
      }
      const doHydrate = hydrateStrategy
        ? () => {
            const teardown = hydrateStrategy(performHydrate, cb =>
              forEachElement(el, cb),
            )
            if (teardown) {
              ;(instance.bum || (instance.bum = [])).push(teardown)
            }
          }
        : performHydrate
      if (resolvedComp) {
        doHydrate()
      } else {
        load().then(() => !instance.isUnmounted && doHydrate())
      }
    },

    /**
     * Vue 内部 getter：获取已解析的组件（供渲染器判断是否加载完成）
     */
    get __asyncResolved() {
      return resolvedComp
    },

    /**
     * 异步组件包装器的 setup 函数：核心逻辑入口
     *
     * 核心职责：
     *    1. 标记异步边界（供 Suspense 识别）；
     *    2. 处理不同场景的加载逻辑（Suspense/SSR vs 普通场景）；
     *    3. 管理加载状态（加载中/错误/延迟）；
     *    4. 处理超时、重试、KeepAlive 兼容；
     *    5. 返回动态渲染函数（根据状态渲染加载/错误/目标组件）。
     */
    setup() {
      const instance = currentInstance! // 当前组件实例（异步组件包装器实例）
      markAsyncBoundary(instance) // 标记为异步边界（供 Suspense 组件识别）

      // 场景1：组件已解析（缓存命中）→ 直接返回目标组件的渲染函数
      // already resolved 已经解决了
      if (resolvedComp) {
        return () => createInnerComp(resolvedComp!, instance)
      }

      /**
       * 内部错误处理函数：统一处理加载错误
       * @param err 加载错误对象
       */
      const onError = (err: Error) => {
        pendingRequest = null // 清空挂起请求，允许重新加载
        // 全局错误处理：上报错误 + 开发环境警告（若未提供 errorComponent 则抛出错误）
        handleError(
          err,
          instance,
          ErrorCodes.ASYNC_COMPONENT_LOADER,
          // 有 errorComponent 则不抛出错误（用户已处理）
          !errorComponent /* do not throw in dev if user provided error component */, // 如果用户提供了错误组件，则不要将其放入 dev
        )
      }

      // suspense-controlled or SSR. 悬念控制或SSR
      // 场景2：Suspense 控制下 或 SSR 场景 → 返回 Promise（供 Suspense/SSR 等待）
      if (
        (__FEATURE_SUSPENSE__ && suspensible && instance.suspense) ||
        (__SSR__ && isInSSRComponentSetup)
      ) {
        return load()
          .then(comp => {
            // 加载成功：返回目标组件的渲染函数
            return () => createInnerComp(comp, instance)
          })
          .catch(err => {
            // 加载失败：处理错误 + 返回错误组件（若有）
            onError(err)
            return () =>
              errorComponent
                ? createVNode(errorComponent as ConcreteComponent, {
                    error: err, // 传递错误对象给错误组件
                  })
                : null
          })
      }

      // 场景3：普通浏览器场景（非 Suspense/SSR）→ 管理加载状态，返回动态渲染函数
      const loaded = ref(false) // 标记：组件是否加载完成
      const error = ref() // 加载错误对象（存储失败信息）
      const delayed = ref(!!delay) // 标记：是否还在延迟期（避免 loading 闪烁）

      // 延迟逻辑：delay 时间后，取消延迟标记（显示 loadingComponent）
      if (delay) {
        setTimeout(() => {
          delayed.value = false
        }, delay)
      }

      // 超时逻辑：超时未加载完成则触发错误
      if (timeout != null) {
        setTimeout(() => {
          if (!loaded.value && !error.value) {
            const err = new Error(
              `Async component timed out after ${timeout}ms.`, // 异步组件超时后
            )
            onError(err) // 超出处理
            error.value = err
          }
        }, timeout)
      }

      // 执行组件加载
      load()
        .then(() => {
          // 加载成功：更新状态 + 兼容 KeepAlive
          loaded.value = true
          if (instance.parent && isKeepAlive(instance.parent.vnode)) {
            // parent is keep-alive, force update so the loaded component's 父级保持活动状态，强制更新，以便加载的组件的
            // name is taken into account 名称被考虑在内
            // 父组件是 KeepAlive：强制更新父组件，保证异步组件名称被纳入缓存逻辑
            instance.parent.update()
          }
        })
        .catch(err => {
          onError(err) // 加载失败：更新错误状态
          error.value = err
        })

      // 返回动态渲染函数：根据状态渲染不同内容
      return () => {
        // 状态1：加载完成 → 渲染目标组件
        if (loaded.value && resolvedComp) {
          return createInnerComp(resolvedComp, instance)
        }
        // 状态2：加载失败 → 渲染错误组件（若有）
        else if (error.value && errorComponent) {
          return createVNode(errorComponent, {
            error: error.value,
          })
        }
        // 状态3：加载中且过了延迟期 → 渲染加载组件
        else if (loadingComponent && !delayed.value) {
          return createInnerComp(
            loadingComponent as ConcreteComponent,
            instance,
          )
        }
      }
    },
  }) as T
}

/**
 * Vue3 异步组件内部 VNode 创建辅助函数
 * 核心作用：
 *    1. 基于异步加载完成的真实组件（comp）创建 VNode；
 *    2. 让内部真实组件继承异步包装器（AsyncComponentWrapper）的关键属性，保证：
 *       - ref 透传：用户给异步组件绑定的 ref 能正确指向内部真实组件（而非包装器）；
 *       - 自定义元素回调透传：包装器的自定义元素处理逻辑传递给内部组件；
 *    3. 清理包装器的自定义元素回调（ce），避免重复处理。
 *
 * 参数说明：
 * @param comp 异步加载完成的真实组件（ConcreteComponent：Vue 内部类型，代表合法的组件类型）
 * @param parent 异步组件包装器（AsyncComponentWrapper）的组件内部实例
 * @returns VNode 内部真实组件的 VNode（已继承包装器的关键属性）
 */
function createInnerComp(
  comp: ConcreteComponent,
  parent: ComponentInternalInstance,
) {
  // 1. 从异步包装器的 VNode 中解构关键属性
  //      ref：用户给异步组件绑定的 ref（如 <AsyncComp ref="myRef" />）；
  //      props：传递给异步组件的 props（需透传给内部真实组件）；
  //      children：异步组件的子节点（需透传给内部真实组件）；
  //      ce：自定义元素回调（Vue 内部用于处理自定义元素的钩子，如 defineCustomElement 相关）；
  const { ref, props, children, ce } = parent.vnode

  // 2. 创建内部真实组件的 VNode
  // 核心：将包装器接收的 props/children 透传给内部组件，保证属性/子节点正常传递
  const vnode = createVNode(comp, props, children)

  // 3. 继承 ref：让用户绑定的 ref 指向内部真实组件（而非包装器）
  // 设计目的：用户使用 ref 访问异步组件时，拿到的是真实组件实例，而非包装器实例（符合直觉）
  // ensure inner component inherits the async wrapper's ref owner 确保内部组件继承异步包装器的引用所有者
  vnode.ref = ref

  // 4. 传递自定义元素回调（ce）：让内部组件继承包装器的自定义元素处理逻辑
  // 注释：pass the custom element callback on to the inner comp
  // pass the custom element callback on to the inner comp 将自定义元素回调传递给内部组件
  // and remove it from the async wrapper 并将其从异步包装器中删除
  vnode.ce = ce
  delete parent.vnode.ce // 5. 清理包装器的 ce 属性：避免后续逻辑重复处理自定义元素回调

  // 6. 返回内部真实组件的 VNode（供异步包装器的渲染函数使用）
  return vnode
}
