import { type VNode, type VNodeChild, isVNode } from './vnode'
import {
  EffectScope,
  type ReactiveEffect,
  TrackOpTypes,
  isRef,
  markRaw,
  pauseTracking,
  proxyRefs,
  resetTracking,
  shallowReadonly,
  track,
} from '@vue/reactivity'
import {
  type ComponentPublicInstance,
  type ComponentPublicInstanceConstructor,
  PublicInstanceProxyHandlers,
  RuntimeCompiledPublicInstanceProxyHandlers,
  createDevRenderContext,
  exposePropsOnRenderContext,
  exposeSetupStateOnRenderContext,
  publicPropertiesMap,
} from './componentPublicInstance'
import {
  type ComponentPropsOptions,
  type NormalizedPropsOptions,
  initProps,
  normalizePropsOptions,
} from './componentProps'
import {
  type InternalSlots,
  type Slots,
  type SlotsType,
  type UnwrapSlotsType,
  initSlots,
} from './componentSlots'
import { warn } from './warning'
import { ErrorCodes, callWithErrorHandling, handleError } from './errorHandling'
import {
  type AppConfig,
  type AppContext,
  createAppContext,
} from './apiCreateApp'
import { type Directive, validateDirectiveName } from './directives'
import {
  type ComponentOptions,
  type ComputedOptions,
  type MergedComponentOptions,
  type MethodOptions,
  applyOptions,
  resolveMergedOptions,
} from './componentOptions'
import {
  type EmitFn,
  type EmitsOptions,
  type EmitsToProps,
  type ObjectEmitsOptions,
  type ShortEmitsToObject,
  emit,
  normalizeEmitsOptions,
} from './componentEmits'
import {
  EMPTY_OBJ,
  type IfAny,
  NOOP,
  ShapeFlags,
  extend,
  getGlobalThis,
  isArray,
  isFunction,
  isObject,
  isPromise,
  makeMap,
} from '@vue/shared'
import type { SuspenseBoundary } from './components/Suspense'
import type { CompilerOptions } from '@vue/compiler-core'
import { markAttrsAccessed } from './componentRenderUtils'
import { currentRenderingInstance } from './componentRenderContext'
import { endMeasure, startMeasure } from './profiling'
import { convertLegacyRenderFn } from './compat/renderFn'
import {
  type CompatConfig,
  globalCompatConfig,
  validateCompatConfig,
} from './compat/compatConfig'
import type { SchedulerJob } from './scheduler'
import type { LifecycleHooks } from './enums'

// Augment GlobalComponents
import type { TeleportProps } from './components/Teleport'
import type { SuspenseProps } from './components/Suspense'
import type { KeepAliveProps } from './components/KeepAlive'
import type { BaseTransitionProps } from './components/BaseTransition'
import type { DefineComponent } from './apiDefineComponent'
import { markAsyncBoundary } from './helpers/useId'
import { isAsyncWrapper } from './apiAsyncComponent'
import type { RendererElement } from './renderer'

export type Data = Record<string, unknown>

/**
 * Public utility type for extracting the instance type of a component.
 * Works with all valid component definition types. This is intended to replace
 * the usage of `InstanceType<typeof Comp>` which only works for
 * constructor-based component definition types.
 *
 * @example
 * ```ts
 * const MyComp = { ... }
 * declare const instance: ComponentInstance<typeof MyComp>
 * ```
 */
export type ComponentInstance<T> = T extends { new (): ComponentPublicInstance }
  ? InstanceType<T>
  : T extends FunctionalComponent<infer Props, infer Emits>
    ? ComponentPublicInstance<Props, {}, {}, {}, {}, ShortEmitsToObject<Emits>>
    : T extends Component<
          infer PropsOrInstance,
          infer RawBindings,
          infer D,
          infer C,
          infer M
        >
      ? PropsOrInstance extends { $props: unknown }
        ? // T is returned by `defineComponent()`
          PropsOrInstance
        : // NOTE we override Props/RawBindings/D to make sure is not `unknown`
          ComponentPublicInstance<
            unknown extends PropsOrInstance ? {} : PropsOrInstance,
            unknown extends RawBindings ? {} : RawBindings,
            unknown extends D ? {} : D,
            C,
            M
          >
      : never // not a vue Component

/**
 * For extending allowed non-declared props on components in TSX
 */
export interface ComponentCustomProps {}

/**
 * For globally defined Directives
 * Here is an example of adding a directive `VTooltip` as global directive:
 *
 * @example
 * ```ts
 * import VTooltip from 'v-tooltip'
 *
 * declare module '@vue/runtime-core' {
 *   interface GlobalDirectives {
 *     VTooltip
 *   }
 * }
 * ```
 */
export interface GlobalDirectives {}

/**
 * For globally defined Components
 * Here is an example of adding a component `RouterView` as global component:
 *
 * @example
 * ```ts
 * import { RouterView } from 'vue-router'
 *
 * declare module '@vue/runtime-core' {
 *   interface GlobalComponents {
 *     RouterView
 *   }
 * }
 * ```
 */
export interface GlobalComponents {
  Teleport: DefineComponent<TeleportProps>
  Suspense: DefineComponent<SuspenseProps>
  KeepAlive: DefineComponent<KeepAliveProps>
  BaseTransition: DefineComponent<BaseTransitionProps>
}

/**
 * Default allowed non-declared props on component in TSX
 */
export interface AllowedComponentProps {
  class?: unknown
  style?: unknown
}

// Note: can't mark this whole interface internal because some public interfaces
// extend it.
export interface ComponentInternalOptions {
  /**
   * @internal
   */
  __scopeId?: string
  /**
   * @internal
   */
  __cssModules?: Data
  /**
   * @internal
   */
  __hmrId?: string
  /**
   * Compat build only, for bailing out of certain compatibility behavior
   */
  __isBuiltIn?: boolean
  /**
   * This one should be exposed so that devtools can make use of it
   */
  __file?: string
  /**
   * name inferred from filename
   */
  __name?: string
}

export interface FunctionalComponent<
  P = {},
  E extends EmitsOptions | Record<string, any[]> = {},
  S extends Record<string, any> = any,
  EE extends EmitsOptions = ShortEmitsToObject<E>,
> extends ComponentInternalOptions {
  // use of any here is intentional so it can be a valid JSX Element constructor
  (
    props: P & EmitsToProps<EE>,
    ctx: Omit<SetupContext<EE, IfAny<S, {}, SlotsType<S>>>, 'expose'>,
  ): any
  props?: ComponentPropsOptions<P>
  emits?: EE | (keyof EE)[]
  slots?: IfAny<S, Slots, SlotsType<S>>
  inheritAttrs?: boolean
  displayName?: string
  compatConfig?: CompatConfig
}

export interface ClassComponent {
  new (...args: any[]): ComponentPublicInstance<any, any, any, any, any>
  __vccOpts: ComponentOptions
}

/**
 * Concrete component type matches its actual value: it's either an options
 * object, or a function. Use this where the code expects to work with actual
 * values, e.g. checking if its a function or not. This is mostly for internal
 * implementation code.
 */
export type ConcreteComponent<
  Props = {},
  RawBindings = any,
  D = any,
  C extends ComputedOptions = ComputedOptions,
  M extends MethodOptions = MethodOptions,
  E extends EmitsOptions | Record<string, any[]> = {},
  S extends Record<string, any> = any,
> =
  | ComponentOptions<Props, RawBindings, D, C, M>
  | FunctionalComponent<Props, E, S>

/**
 * A type used in public APIs where a component type is expected.
 * The constructor type is an artificial type returned by defineComponent().
 */
export type Component<
  PropsOrInstance = any,
  RawBindings = any,
  D = any,
  C extends ComputedOptions = ComputedOptions,
  M extends MethodOptions = MethodOptions,
  E extends EmitsOptions | Record<string, any[]> = {},
  S extends Record<string, any> = any,
> =
  | ConcreteComponent<PropsOrInstance, RawBindings, D, C, M, E, S>
  | ComponentPublicInstanceConstructor<PropsOrInstance>

export type { ComponentOptions }

export type LifecycleHook<TFn = Function> = (TFn & SchedulerJob)[] | null

// use `E extends any` to force evaluating type to fix #2362
export type SetupContext<
  E = EmitsOptions,
  S extends SlotsType = {},
> = E extends any
  ? {
      attrs: Data
      slots: UnwrapSlotsType<S>
      emit: EmitFn<E>
      expose: <Exposed extends Record<string, any> = Record<string, any>>(
        exposed?: Exposed,
      ) => void
    }
  : never

/**
 * @internal
 */
export type InternalRenderFunction = {
  (
    ctx: ComponentPublicInstance,
    cache: ComponentInternalInstance['renderCache'],
    // for compiler-optimized bindings
    $props: ComponentInternalInstance['props'],
    $setup: ComponentInternalInstance['setupState'],
    $data: ComponentInternalInstance['data'],
    $options: ComponentInternalInstance['ctx'],
  ): VNodeChild
  _rc?: boolean // isRuntimeCompiled

  // __COMPAT__ only
  _compatChecked?: boolean // v3 and already checked for v2 compat
  _compatWrapped?: boolean // is wrapped for v2 compat
}

/**
 * We expose a subset of properties on the internal instance as they are 我们按照原样公开内部实例上的一部分属性
 * useful for advanced external libraries and tools. 对高级外部库和工具有用
 *
 * 组件的「灵魂蓝图」，组件的所有状态、上下文、渲染逻辑、生命周期、响应式依赖，全部在此定义
 */
export interface ComponentInternalInstance {
  // ===================================== 【模块1：基础核心标识 - 组件的身份与层级关系】 =====================================

  /** 组件实例的全局唯一自增ID，每个实例一个唯一uid，永不重复，用于标识区分组件 */
  uid: number
  /** 当前组件的真实定义(如setup/render/props配置)，类型为具体的组件结构 */
  type: ConcreteComponent
  /** 父组件的内部实例，null表示根组件，用于构建组件树层级关系、继承上下文 */
  parent: ComponentInternalInstance | null
  /** 组件树的根组件内部实例，所有组件的root最终都指向根组件，实现$root的底层支持 */
  root: ComponentInternalInstance
  /** 应用全局上下文，包含全局组件/指令/provide/插件等配置，子组件继承父组件的appContext */
  appContext: AppContext

  // ===================================== 【模块2：虚拟节点与渲染核心 - 组件的VNode关联与渲染驱动】 =====================================
  /**
   * Vnode representing this component in its parent's vdom tree Vnode 代表其父级 vdom 树中的该组件
   * 当前组件在父组件VNode树中的根VNode节点，实例与VNode永久绑定
   */
  vnode: VNode
  /**
   * The pending new vnode from parent updates 来自父级更新的挂起的新 vnode
   * 父组件更新时传入的「待更新新VNode」，用于异步更新队列的调度，更新完成后会替换vnode
   * @internal
   */
  next: VNode | null
  /**
   * Root vnode of this component's own vdom tree 该组件自己的 vdom 树的根 vnode
   * 当前组件自身渲染生成的「根VNode子树」，是组件渲染的核心依据，patch函数的入参
   */
  subTree: VNode
  /**
   * Render effect instance 渲染效果实例
   * 组件的核心【响应式渲染副作用】，数据变化时自动执行触发重渲染，是数据驱动视图的核心
   */
  effect: ReactiveEffect
  /**
   * Force update render effect 强制更新渲染效果
   * 组件的强制更新方法，手动调用可强制触发组件重渲染，对应业务中的 this.$forceUpdate
   */
  update: () => void
  /**
   * Render effect job to be passed to scheduler (checks if dirty) 渲染效果作业传递给调度程序（检查是否脏）
   * 组件更新的调度任务，会被加入异步调度队列，带脏值检查逻辑，避免重复更新
   */
  job: SchedulerJob
  /**
   * The render function that returns vdom tree. 返回vdom树的render函数
   * 组件的内部渲染函数，返回组件的VNode树，由setup解析或组件自身定义
   * @internal
   */
  render: InternalRenderFunction | null
  /**
   * SSR render function SSR渲染函数
   * SSR服务端渲染专属的渲染函数，仅在服务端渲染时生效
   * @internal
   */
  ssrRender?: Function | null

  // ===================================== 【模块3：依赖注入与性能缓存 - 跨组件通信 + 框架级性能优化】 =====================================
  /**
   * Object containing values this component provides for its descendants 包含该组件为其后代提供的值的对象
   * 组件提供的依赖注入数据，基于原型链继承父组件的provides，是provide/inject的底层实现载体
   * @internal
   */
  provides: Data
  /**
   * for tracking useId() 用于跟踪`useId()`函数
   * first element is the current boundary prefix 第一个元素是当前边界前缀
   * second number is the index of the useId call within that boundary 第二个数字是该边界内useId调用的索引
   *
   * 用于追踪useId()的生成标识，数组结构：[当前边界前缀, 边界内调用索引, 全局索引]，保证ID唯一性
   * @internal
   */
  ids: [string, number, number]
  /**
   * Tracking reactive effects (e.g. watchers) associated with this component 追踪与此组件相关的响应式效应（例如观察者）
   * so that they can be automatically stopped on component unmount 以便它们在组件卸载时能自动停止
   *
   * 组件的响应式副作用作用域，统一管理组件内的effect/computed/watch，卸载时一键销毁防内存泄漏
   * @internal
   */
  scope: EffectScope
  /**
   * cache for proxy access type to avoid hasOwnProperty calls 缓存代理访问类型以避免 hasOwnProperty 调用
   *
   * 属性访问缓存，缓存proxy的属性访问类型，避免频繁调用hasOwnProperty做存在性检查，提升访问性能
   * @internal
   */
  accessCache: Data | null
  /**
   * cache for render function values that rely on _ctx but won't need updates 缓存依赖于_ctx但不需要更新的渲染函数值
   * after initialized (e.g. inline handlers) 初始化后（例如，内联处理程序）
   *
   * 渲染函数缓存，缓存依赖_ctx但初始化后无需更新的内容(如内联事件处理器)，避免重复创建提升渲染性能
   * @internal
   */
  renderCache: (Function | VNode | undefined)[]

  // ===================================== 【模块4：组件资源与配置解析 - 组件的静态配置标准化】 =====================================
  /**
   * Resolved component registry, only for components with mixins or extends 已解决的组件注册表，仅适用于具有 mixins 或 extends 的组件
   *
   * 解析后的组件局部注册资源表，仅对有mixins/extends的组件生效，存储注册的局部组件
   * @internal
   */
  components: Record<string, ConcreteComponent> | null
  /**
   * Resolved directive registry, only for components with mixins or extends 已解决的指令注册表，仅适用于具有 mixins 或 extends 的组件
   *
   * 解析后的指令局部注册资源表，仅对有mixins/extends的组件生效，存储注册的局部指令
   * @internal
   */
  directives: Record<string, Directive> | null
  /**
   * Resolved filters registry, v2 compat only 已解决过滤器注册表，仅兼容 v2
   *
   * Vue2兼容模式专属 - 解析后的过滤器注册表，Vue3已移除过滤器，仅做兼容处理
   * @internal
   */
  filters?: Record<string, Function>
  /**
   * resolved props options 已解决的道具选项
   *
   * 标准化后的props配置，包含props的类型、默认值、校验规则，由normalizePropsOptions解析生成
   * @internal
   */
  propsOptions: NormalizedPropsOptions
  /**
   * resolved emits options 已解决发出选项
   *
   * 标准化后的emits配置，包含自定义事件的校验规则，由normalizeEmitsOptions解析生成
   * @internal
   */
  emitsOptions: ObjectEmitsOptions | null
  /**
   * resolved inheritAttrs options 解决了继承属性选项
   *
   * 是否继承父组件的非props属性到组件根元素，默认值为true，可在组件中手动配置关闭
   * @internal
   */
  inheritAttrs?: boolean

  // ===================================== 【模块5：自定义元素(Web Component)兼容区 - 框架底层兼容逻辑】 =====================================
  /**
   * Custom Element instance (if component is created by defineCustomElement) 自定义元素实例（如果组件是通过defineCustomElement创建的）
   *
   * 自定义元素实例接口，仅当组件由defineCustomElement创建时生效，绑定原生自定义元素的实例
   * @internal
   */
  ce?: ComponentCustomElementInterface
  /**
   * is custom element? (kept only for compatibility) 是自定义元素吗？ （仅为兼容性而保留）
   *
   * 是否为自定义元素的标记，仅做兼容处理，Vue3内部使用
   * @internal
   */
  isCE?: boolean
  /**
   * custom element specific HMR method 自定义元素特定的 HMR 方法
   *
   * 自定义元素专属的热更新方法，用于更新自定义元素的样式，开发环境生效
   * @internal
   */
  ceReload?: (newStyles?: string[]) => void

  // the rest are only for stateful components 其余的仅适用于有状态组件 ---------------------------------
  // ===================================== 【模块6：公共实例与代理相关 - 对外暴露的安全访问层】 仅适用于有状态组件 =====================================

  // main proxy that serves as the public instance (`this`) 充当公共实例的主代理（`this`）
  /** 组件的公共实例代理对象，业务开发中this的指向、ref获取的组件实例，都是该代理对象，安全隔离内部实例 */
  proxy: ComponentPublicInstance | null

  // exposed properties via expose() 通过expose()暴露属性
  /** 组件通过expose()主动暴露的属性集合，仅暴露该对象内的属性给父组件，做访问权限控制 */
  exposed: Record<string, any> | null
  /** 暴露属性的代理对象，对exposed做一层代理，保证访问安全 */
  exposeProxy: Record<string, any> | null

  /**
   * alternative proxy used only for runtime-compiled render functions using 仅用于运行时编译的渲染函数的替代代理
   * `with` block `with` 块
   *
   * 仅运行时编译的渲染函数专属代理，兼容Vue2的with语法，Vue3中极少使用
   * @internal
   */
  withProxy: ComponentPublicInstance | null
  /**
   * This is the target for the public instance proxy. It also holds properties 这是公共实例代理的目标对象。它还包含属性
   * injected by user options (computed, methods etc.) and user-attached 由用户选项（如计算、方法等）和用户附加内容注入
   * custom properties (via `this.x = ...`) 自定义属性（通过`this.x = ...`）
   *
   * 组件的渲染上下文对象，内部实例的核心数据载体，组件内this的最终指向(开发/生产环境差异化创建)
   * @internal
   */
  ctx: Data

  // ===================================== 【模块7：核心状态数据容器 - 组件的所有业务数据都存在这里 ✅ 业务开发最核心】 =====================================
  // state
  /** Vue2选项式API的data数据容器，存储响应式的状态数据，Vue3中优先级低于setupState */
  data: Data
  /** 组件接收的父组件传入的props属性，标准化后的响应式数据，只读不可修改 */
  props: Data
  /** 组件接收的「非props属性」集合，父组件传入的未被props声明的属性，统一存放在这里做透传 */
  attrs: Data
  /** 组件接收的插槽内容，标准化后的内部插槽结构，包含默认插槽、具名插槽、作用域插槽 */
  slots: InternalSlots
  /** 组件内所有ref="xxx"的元素/组件引用集合，业务中this.$refs/refs.xxx的底层载体 */
  refs: Data
  /** 组件的事件派发方法，绑定了当前实例上下文，业务中this.$emit/emit的底层实现 */
  emit: EmitFn

  // ===================================== 【模块8：事件与Props辅助区 - 框架内部的辅助缓存】 =====================================
  /**
   * used for keeping track of .once event handlers on components 用于跟踪组件上的 .once 事件处理程序
   *
   * 用于追踪组件的.once修饰符事件，记录已派发过的事件，避免重复触发once事件
   * @internal
   */
  emitted: Record<string, boolean> | null
  /**
   * used for caching the value returned from props default factory functions to 用于缓存从props默认工厂函数返回的值
   * avoid unnecessary watcher trigger 避免不必要的观察者触发
   *
   * Props默认值缓存，缓存props默认值工厂函数的返回值，避免重复执行工厂函数触发不必要的依赖更新
   * @internal
   */
  propsDefaults: Data

  // ===================================== 【模块9：Setup组合式API专属区 - Vue3新特性核心载体】 =====================================
  /**
   * setup related setup相关
   *
   * Setup函数的返回值数据容器，Setup内定义的响应式数据、方法、计算属性，全部存放在这里 ✅ Vue3核心
   * @internal
   */
  setupState: Data
  /**
   * devtools access to additional info devtools 访问附加信息
   *
   * 开发工具专属，存储Setup的原始状态，用于devtools调试时展示完整的Setup数据
   * @internal
   */
  devtoolsRawSetupState?: any
  /**
   * Setup函数的上下文对象，包含emit、slots、attrs、expose等，传给setup函数的第二个入参
   * @internal
   */
  setupContext: SetupContext | null

  // ===================================== 【模块10：异步组件Suspense专属区 - 异步加载逻辑支持】 =====================================
  /**
   * suspense related suspense相关
   *
   * 父级Suspense异步边界实例，标记当前组件是否属于异步边界，用于管理异步组件的加载状态
   * @internal
   */
  suspense: SuspenseBoundary | null
  /**
   * suspense pending batch id 暂挂待处理批次 ID
   *
   * Suspense的待处理批次ID，用于调度多个异步组件的加载顺序
   * @internal
   */
  suspenseId: number
  /**
   * 组件的异步依赖Promise对象，当setup返回Promise时赋值，标记当前是异步组件
   * @internal
   */
  asyncDep: Promise<any> | null
  /**
   * 异步组件的加载完成状态标记，true表示异步依赖已解析完成，可执行后续渲染
   * @internal
   */
  asyncResolved: boolean

  // ===================================== 【模块11：生命周期状态标记 - 组件的运行时状态】 =====================================
  // lifecycle
  /** 是否已完成挂载（执行完mounted钩子），挂载后永久为true */
  isMounted: boolean
  /** 是否已完成卸载（执行完unmounted钩子），卸载后永久为true */
  isUnmounted: boolean
  /** 是否被KeepAlive组件失活，KeepAlive缓存的组件卸载时会标记为失活而非卸载 */
  isDeactivated: boolean

  // ===================================== 【模块12：生命周期钩子函数 - 标准枚举版 ✅ 完整所有生命周期】 =====================================
  /**
   * 组件创建前钩子 - beforeCreate
   * @internal
   */
  [LifecycleHooks.BEFORE_CREATE]: LifecycleHook
  /**
   * 组件创建完成钩子 - created
   * @internal
   */
  [LifecycleHooks.CREATED]: LifecycleHook
  /**
   * 组件挂载前钩子 - beforeMount
   * @internal
   */
  [LifecycleHooks.BEFORE_MOUNT]: LifecycleHook
  /**
   * 组件挂载完成钩子 - mounted
   * @internal
   */
  [LifecycleHooks.MOUNTED]: LifecycleHook
  /**
   * 组件更新前钩子 - beforeUpdate
   * @internal
   */
  [LifecycleHooks.BEFORE_UPDATE]: LifecycleHook
  /**
   * 组件更新完成钩子 - updated
   * @internal
   */
  [LifecycleHooks.UPDATED]: LifecycleHook
  /**
   * 组件卸载前钩子 - beforeUnmount
   * @internal
   */
  [LifecycleHooks.BEFORE_UNMOUNT]: LifecycleHook
  /**
   * 组件卸载完成钩子 - unmounted
   * @internal
   */
  [LifecycleHooks.UNMOUNTED]: LifecycleHook
  /**
   * 渲染依赖追踪钩子 - renderTracked，开发环境生效，追踪响应式依赖收集
   * @internal
   */
  [LifecycleHooks.RENDER_TRACKED]: LifecycleHook
  /**
   * 渲染触发钩子 - renderTriggered，开发环境生效，响应式数据变化触发渲染时调用
   * @internal
   */
  [LifecycleHooks.RENDER_TRIGGERED]: LifecycleHook
  /**
   * 组件被激活钩子 - activated，仅KeepAlive缓存组件生效
   * @internal
   */
  [LifecycleHooks.ACTIVATED]: LifecycleHook
  /**
   * 组件被失活钩子 - deactivated，仅KeepAlive缓存组件生效
   * @internal
   */
  [LifecycleHooks.DEACTIVATED]: LifecycleHook
  /**
   * 错误捕获钩子 - errorCaptured，捕获子组件的渲染错误
   * @internal
   */
  [LifecycleHooks.ERROR_CAPTURED]: LifecycleHook
  /**
   * 服务端预取钩子 - serverPrefetch，SSR服务端渲染时的异步数据预取
   * @internal
   */
  [LifecycleHooks.SERVER_PREFETCH]: LifecycleHook<() => Promise<unknown>>

  // ===================================== 【模块13：工具方法缓存区 - 框架内部性能优化，缓存绑定后的方法】 =====================================
  /**
   * For caching bound $forceUpdate on public proxy access 用于在公共代理访问上缓存绑定 $forceUpdate
   *
   * 缓存绑定后的$forceUpdate方法，避免每次访问都重新绑定上下文，提升性能
   * @internal
   */
  f?: () => void
  /**
   * For caching bound $nextTick on public proxy access 用于在公共代理访问上缓存绑定 $nextTick
   *
   * 缓存绑定后的$nextTick方法，避免每次访问都重新绑定上下文，提升性能
   * @internal
   */
  n?: () => Promise<void>
  /**
   * `updateTeleportCssVars`
   * For updating css vars on contained teleports 用于更新包含的传送点上的CSS变量
   *
   * 用于更新Teleport组件的CSS变量，内部方法，处理Teleport的样式透传
   * @internal
   */
  ut?: (vars?: Record<string, unknown>) => void

  // ===================================== 【模块14：开发环境与兼容专属区 - 无生产环境损耗】 =====================================
  /**
   * dev only. For style v-bind hydration mismatch checks 仅限开发人员。用于 v-bind 风格水合作用不匹配检查
   * 开发环境专属，用于style v-bind的hydration匹配检查，校验服务端与客户端样式是否一致
   * @internal
   */
  getCssVars?: () => Record<string, unknown>

  /**
   * v2 compat only, for caching mutated $options 仅 v2 兼容，用于缓存变异的 $options
   *
   * Vue2兼容模式专属，缓存合并后的组件选项，仅在Vue2迁移时生效
   * @internal
   */
  resolvedOptions?: MergedComponentOptions
}

const emptyAppContext = createAppContext()

let uid = 0

/**
 * Vue3 底层核心函数 - 组件内部实例【唯一工厂创建函数】，组件实例的「毛坯诞生地」
 * 核心职责：纯函数无副作用，创建并初始化组件核心内部实例 ComponentInternalInstance，为实例的所有属性赋默认初始值，返回结构完整的实例毛坯
 * 核心边界：只创建实例+初始化字段，不执行任何业务逻辑（无setup执行、无props解析、无渲染操作），后续由setupComponent完成组件初始化
 * 核心特性：纯工厂模式、继承父组件上下文、原型链实现依赖注入、开发/生产环境差异化优化、字段无遗漏、兼容所有组件类型、无副作用
 *
 *  - 1. 创建并初始化「组件内部实例」的所有字段
 *  - 2. 初始化一些字段
 *
 * @param {VNode} vnode 当前组件的根VNode节点，获取组件类型/应用上下文等核心信息
 * @param {ComponentInternalInstance | null} parent 父组件的内部实例，用于继承上下文、依赖注入、确定组件层级关系
 * @param {SuspenseBoundary | null} suspense 父级Suspense异步边界，用于标记组件的异步归属，处理异步组件逻辑
 * @returns {ComponentInternalInstance} 返回初始化完成的组件内部实例「毛坯」，后续交给setupComponent做精细化初始化
 */
export function createComponentInstance(
  vnode: VNode,
  parent: ComponentInternalInstance | null,
  suspense: SuspenseBoundary | null,
): ComponentInternalInstance {
  // 1. 获取组件的「真实定义类型」，vnode.type在组件VNode中就是我们编写的组件本身(对象/单文件组件)
  const type = vnode.type as ConcreteComponent

  // 2. 继承/获取 应用上下文appContext - 核心继承规则
  // inherit parent app context - or - if root, adopt from root vnode 继承父应用上下文 - 或者 - 如果是根应用，则从根应用节点（vnode）继承
  // 优先级：有父组件 → 继承父组件的appContext > 无父组件 → 使用当前VNode的appContext > 兜底使用空上下文
  // 作用：实现全局配置(全局组件/指令/provide)在组件树中全局共享
  const appContext =
    (parent ? parent.appContext : vnode.appContext) || emptyAppContext

  // 3. 核心：创建并初始化 组件内部实例的所有属性，赋默认初始值 ✅
  const instance: ComponentInternalInstance = {
    // ===== 基础标识 & 核心关联 - 组件的基础身份信息 =====
    uid: uid++, // 全局自增唯一ID，每个组件实例一个唯一标识，永不重复
    vnode, // 当前组件对应的根VNode，实例与VNode永久绑定
    type, // 当前组件的真实定义(setup/render/props等)
    parent, // 父组件实例，构建组件树层级关系，用于上下文继承
    appContext, // 应用上下文，全局配置共享
    root: null!, // to be immediately set 立即设置 --> 组件树的根实例，【立即会被赋值】，根组件的root是自己，子组件的root是根组件
    next: null, // 组件更新时的下一个VNode，用于异步更新队列调度
    // 组件渲染生成的子VNode树，创建后会立即赋值，是patch渲染的核心依据
    subTree: null!, // will be set synchronously right after creation 创建后会同步设置
    effect: null!, // 组件的核心渲染副作用effect(setupRenderEffect创建)，数据变化触发重渲染的核心
    // 组件的更新函数，创建后立即赋值，手动触发组件更新的入口
    update: null!, // will be set synchronously right after creation 创建后会同步设置
    job: null!, // 组件更新的调度任务，加入到微任务队列中执行，实现异步更新
    scope: new EffectScope(true /* detached */), // 独立的副作用作用域，统一管理组件内所有响应式副作用，卸载时一键销毁防内存泄漏

    // ===== 渲染相关 - 组件的渲染配置与缓存 =====
    render: null, // 组件的渲染函数，后续由setupComponent解析赋值(setup返回的函数/组件自身的render)
    proxy: null, // 组件的代理对象，开发环境用于this的属性访问校验/警告，生产环境为null
    exposed: null, // 组件通过expose暴露的属性，供父组件通过ref访问
    exposeProxy: null, // 暴露属性的代理对象，做访问控制
    withProxy: null, // with语句的代理对象，兼容Vue2的with语法

    // ===== 依赖注入 & 缓存 - 跨组件通信与性能优化 =====
    provides: parent ? parent.provides : Object.create(appContext.provides), // 依赖注入的核心，原型链继承：子继承父，根继承全局，实现跨层级传值
    ids: parent ? parent.ids : ['', 0, 0], // 组件的唯一标识数组，用于v-for的key优化/缓存
    accessCache: null!, // 属性访问缓存，优化组件内属性的访问速度
    renderCache: [], // 渲染缓存，缓存组件内的静态节点/组件，避免重复创建VNode提升性能

    // ===== 资源配置 - 组件内解析的本地资源 =====
    // local resolved assets 本地解析资产
    components: null, // 组件内注册的局部组件，后续解析赋值
    directives: null, // 组件内注册的局部指令，后续解析赋值

    // ===== Props & Emits 配置 - 组件的属性与事件配置 =====
    // resolved props and emits options 解析 props 并发出选项
    propsOptions: normalizePropsOptions(type, appContext), // 标准化组件的props配置，解析props的类型/默认值/校验规则
    emitsOptions: normalizeEmitsOptions(type, appContext), // 标准化组件的emits配置，解析自定义事件的校验规则

    // ===== 事件派发 - 组件的emit方法相关 =====
    // emit
    emit: null!, // to be set immediately 立即设置 --> 组件的事件派发方法，【立即会被赋值】，绑定了当前实例上下文
    emitted: null, // 记录组件已经派发过的事件，避免重复派发

    // props default value props 默认值
    propsDefaults: EMPTY_OBJ, // props的默认值对象，后续解析赋值

    // ===== 透传属性 - inheritAttrs 配置 =====
    // inheritAttrs
    inheritAttrs: type.inheritAttrs, // 是否继承父组件的非props属性到根元素，默认true

    // ===== 核心状态容器 - 组件的所有数据都存在这里 ✅【业务开发最常用】=====
    // state
    ctx: EMPTY_OBJ, // 组件的渲染上下文，组件内部的this指向该对象，开发/生产环境差异化创建
    data: EMPTY_OBJ, // 组件的data数据(Vue2选项式)，响应式数据容器
    props: EMPTY_OBJ, // 组件接收的props属性，解析后赋值，响应式
    attrs: EMPTY_OBJ, // 组件接收的非props属性，透传属性容器
    slots: EMPTY_OBJ, // 组件接收的插槽内容，解析后赋值
    refs: EMPTY_OBJ, // 组件内的ref引用集合，所有ref="xxx"的元素/组件都存在这里
    setupState: EMPTY_OBJ, // setup函数的返回值对象，setup内定义的响应式数据/方法都存在这里
    setupContext: null, // setup函数的上下文对象，包含emit/slots/attrs等

    // ===== 异步组件 & Suspense 相关 - 异步加载逻辑 =====
    // suspense related
    suspense, // 父级Suspense异步边界，标记组件是否属于异步边界
    suspenseId: suspense ? suspense.pendingId : 0, // 异步边界的唯一ID，用于调度异步组件的加载状态
    asyncDep: null, // 组件的异步依赖Promise，标记是否为异步组件(setup返回Promise)
    asyncResolved: false, // 异步组件是否加载完成的状态标记

    // ===== 生命周期状态标记 - 组件的运行状态 =====
    // lifecycle hooks 生命周期挂钩
    // not using enums here because it results in computed properties 此处不使用枚举，因为它会导致计算属性
    isMounted: false, // 是否已挂载完成
    isUnmounted: false, // 是否已卸载
    isDeactivated: false, // 是否已被KeepAlive失活

    // ===== 生命周期钩子函数 - 所有钩子初始值为null，后续注册时赋值 ✅【简写含义全注释】=====
    bc: null, // beforeCreate 生命周期钩子
    c: null, // created 生命周期钩子
    bm: null, // beforeMount 生命周期钩子
    m: null, // mounted 生命周期钩子
    bu: null, // beforeUpdate 生命周期钩子
    u: null, // updated 生命周期钩子
    um: null, // unmounted 生命周期钩子
    bum: null, // beforeUnmount 生命周期钩子
    da: null, // deactivated 生命周期钩子(KeepAlive)
    a: null, // activated 生命周期钩子(KeepAlive)
    rtg: null, // renderTracked 生命周期钩子，追踪渲染依赖
    rtc: null, // renderTriggered 生命周期钩子，触发渲染时调用
    ec: null, // errorCaptured 生命周期钩子，捕获子组件错误
    sp: null, // suspense 相关钩子，处理异步加载状态
  }

  // 4. 差异化创建组件的「渲染上下文ctx」- 开发环境/生产环境分离，兼顾调试与性能
  if (__DEV__) {
    // 开发环境：创建带调试能力的上下文，包含属性访问校验、警告提示、this代理等，提升开发体验
    instance.ctx = createDevRenderContext(instance)
  } else {
    // 生产环境：极简上下文，只保留实例的引用(_指向当前实例)，无任何调试逻辑，极致压缩体积提升性能
    instance.ctx = { _: instance }
  }

  // 5. 赋值组件树的「根实例」- 核心规则
  // 有父组件 → 继承父组件的根实例 | 无父组件(根组件) → 根实例就是自己
  instance.root = parent ? parent.root : instance

  // 6. 赋值组件的「emit方法」- 绑定当前实例上下文，永久挂载到实例上
  // 绑定后：组件内部调用emit('event')，本质就是调用emit(instance, 'event')，自动携带当前实例
  instance.emit = emit.bind(null, instance)

  // 7. 兼容处理：自定义元素(Web Component)的特殊初始化逻辑
  // vnode.ce是自定义元素的处理钩子，存在时执行，完成自定义元素的实例绑定
  // apply custom element special handling 应用自定义元素特殊处理
  if (vnode.ce) {
    vnode.ce(instance)
  }

  // 8. 返回最终的「组件内部实例毛坯」，后续交给setupComponent做精细化初始化
  return instance
}

export let currentInstance: ComponentInternalInstance | null = null

export const getCurrentInstance: () => ComponentInternalInstance | null = () =>
  currentInstance || currentRenderingInstance

let internalSetCurrentInstance: (
  instance: ComponentInternalInstance | null,
) => void
let setInSSRSetupState: (state: boolean) => void

/**
 * The following makes getCurrentInstance() usage across multiple copies of Vue
 * work. Some cases of how this can happen are summarized in #7590. In principle
 * the duplication should be avoided, but in practice there are often cases
 * where the user is unable to resolve on their own, especially in complicated
 * SSR setups.
 *
 * Note this fix is technically incomplete, as we still rely on other singletons
 * for effectScope and global reactive dependency maps. However, it does make
 * some of the most common cases work. It also warns if the duplication is
 * found during browser execution.
 */
if (__SSR__) {
  type Setter = (v: any) => void
  const g = getGlobalThis()
  const registerGlobalSetter = (key: string, setter: Setter) => {
    let setters: Setter[]
    if (!(setters = g[key])) setters = g[key] = []
    setters.push(setter)
    return (v: any) => {
      if (setters.length > 1) setters.forEach(set => set(v))
      else setters[0](v)
    }
  }
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    v => (currentInstance = v),
  )
  // also make `isInSSRComponentSetup` sharable across copies of Vue.
  // this is needed in the SFC playground when SSRing async components, since
  // we have to load both the runtime and the server-renderer from CDNs, they
  // contain duplicated copies of Vue runtime code.
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    v => (isInSSRComponentSetup = v),
  )
} else {
  internalSetCurrentInstance = i => {
    currentInstance = i
  }
  setInSSRSetupState = v => {
    isInSSRComponentSetup = v
  }
}

/**
 * 设置当前活跃的组件实例，并返回一个用于恢复之前实例的清理函数
 * 这个函数用于在组件渲染过程中临时切换当前组件上下文
 *
 * @param instance - 要设置为当前实例的组件内部实例对象
 * @returns 一个清理函数，调用它可以恢复到之前的组件实例上下文
 */
export const setCurrentInstance = (instance: ComponentInternalInstance) => {
  // 1. 缓存【切换前的全局当前实例】，用于后续重置恢复，避免全局上下文污染
  const prev = currentInstance
  // 2. 核心赋值：将传入的组件实例，设置为全局的「当前活跃组件实例」
  //    internalSetCurrentInstance 是内部私有方法，仅做单纯的 currentInstance = instance 赋值操作
  internalSetCurrentInstance(instance)
  // 3. 开启当前组件实例的「副作用作用域」
  //    scope.on()：激活作用域，接管后续该组件内所有响应式副作用(effect/computed/watch)的管理
  instance.scope.on()
  // 4. 返回一个闭包形式的【重置恢复函数】，闭包保留了 prev/instance 变量引用
  return (): void => {
    // 4.1 关闭当前实例的副作用作用域
    instance.scope.off()
    // 4.2 将全局的当前实例，恢复为之前缓存的 prev 实例，还原全局上下文
    internalSetCurrentInstance(prev)
  }
}

export const unsetCurrentInstance = (): void => {
  currentInstance && currentInstance.scope.off()
  internalSetCurrentInstance(null)
}

const isBuiltInTag = /*@__PURE__*/ makeMap('slot,component')

/**
 * 验证组件名称是否合法，确保不使用内置或保留的HTML元素作为组件ID
 *
 * @param name - 要验证的组件名称
 * @param appConfig - 应用配置对象，包含判断是否为原生标签的方法
 * @param appConfig.isNativeTag - 用于检查标签名是否为原生HTML标签的函数
 */
export function validateComponentName(
  name: string,
  { isNativeTag }: AppConfig,
): void {
  // 检查组件名称是否为内置标签或原生标签
  if (isBuiltInTag(name) || isNativeTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component id: ' + name, // 不要使用内置或保留的 HTML 元素作为组件 id
    )
  }
}

/**
 * 判断组件实例是否为有状态组件
 *
 * @param instance 组件内部实例
 * @returns 如果是STATEFUL_COMPONENT类型则返回对应的标志位数值，否则返回0
 */
export function isStatefulComponent(
  instance: ComponentInternalInstance,
): number {
  return instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
}

export let isInSSRComponentSetup = false

/**
 * Vue3 核心初始化函数 - 组件实例「精细化初始化」的唯一入口，组件毛坯的「精装修」
 * 核心职责：对createComponentInstance创建的空实例进行初始化赋能，完成3件核心事：初始化Props、初始化Slots、执行有状态组件的setup函数
 * 核心定位：承上启下的桥接函数，上接实例创建，下接渲染副作用创建，初始化完成后组件具备完整可渲染能力
 * 核心特性：区分有状态/无状态组件、兼容SSR服务端渲染、兼容编译优化、支持异步setup、纯初始化无副作用、无冗余逻辑
 *
 *  - 处理 props 并挂载到 instance.props
 *  - 处理 slots 并挂载到 instance.slots
 *  - 执行 setupStatefulComponent 方法，完成组件的setup函数执行
 *     -- 内部会执行 setCurrentInstance 方法, 会激活组件实例的 instance.scope, 从而收集其中所创建的响应式副作用 (即计算属性和侦听器)
 *
 * @param {ComponentInternalInstance} instance 组件内部实例（来自createComponentInstance的毛坯实例）
 * @param {boolean} isSSR 是否为服务端渲染模式，默认false，true时走SSR专属初始化逻辑
 * @param {boolean} optimized 是否启用编译优化模式，默认false，true时优化插槽初始化性能
 * @returns {Promise<void> | undefined} 仅当异步setup时返回Promise，同步setup/无状态组件返回undefined，供上层处理异步逻辑
 */
export function setupComponent(
  instance: ComponentInternalInstance,
  isSSR = false,
  optimized = false,
): Promise<void> | undefined {
  // 1. 服务端渲染专属：标记当前处于SSR的setup初始化阶段，内部逻辑会根据该标记做差异化处理，避免浏览器端DOM操作
  isSSR && setInSSRSetupState(isSSR)

  // 2. 从组件实例绑定的根VNode中，解构出父组件传入的props属性和children插槽内容
  // 这是后续初始化props和slots的原始数据源
  const { props, children } = instance.vnode
  // 3. 核心判断：当前组件是否为【有状态组件】(带setup/render/data的组件，日常开发的主流组件)
  const isStateful = isStatefulComponent(instance)

  // 4. 初始化组件Props属性 ✅核心步骤
  // 标准化解析父组件传入的props，校验类型/赋值默认值，最终挂载到 instance.props 上，供setup和组件内部访问
  initProps(instance, props, isStateful, isSSR)

  // 5. 初始化组件Slots插槽 ✅核心步骤
  // 标准化解析父组件传入的插槽(默认插槽/具名插槽/作用域插槽)，最终挂载到 instance.slots 上，供setup和render使用
  // 优化策略：开启编译优化/SSR时，走高性能的插槽初始化逻辑
  initSlots(instance, children, optimized || isSSR)

  // 6. 核心分支：根据组件类型差异化处理
  const setupResult = isStateful
    ? // ✔️ 有状态组件：执行【核心初始化子函数】，处理setup执行、返回值绑定、render挂载等核心逻辑
      // 该函数是Vue3组合式API的底层入口，执行完成后组件的核心能力全部配齐
      setupStatefulComponent(instance, isSSR)
    : undefined

  // 7. 服务端渲染专属：重置SSR的setup初始化标记，恢复默认状态
  isSSR && setInSSRSetupState(false)
  // 8. 返回初始化结果：异步setup返回Promise，同步返回undefined，供上层mountComponent处理异步逻辑
  return setupResult
}

/**
 * Vue3 核心内部函数 - 【有状态组件初始化的唯一灵魂入口】，setupComponent 的核心子函数
 * 核心使命：组件初始化的总控中枢，承接已初始化的props/slots，完成开发环境校验、创建组件代理、执行setup函数、处理setup返回值、挂载组件状态、兜底完成初始化，让组件具备渲染能力
 * 核心能力：覆盖组件setup阶段的所有核心逻辑，兼容同步/异步setup，实现this代理，统一错误处理，极致性能优化
 * 核心价值：业务开发中所有setup、this、组件状态的底层支撑，所有.vue组件的核心初始化逻辑都在此落地
 *
 *  - 主要是执行 setup 方法
 *     -- 内部会执行 setCurrentInstance 方法, 会激活组件实例的 instance.scope, 从而收集其中所创建的响应式副作用 (即计算属性和侦听器)
 *
 * @param {ComponentInternalInstance} instance 组件内部实例，所有初始化结果挂载到该实例
 * @param {boolean} isSSR 是否为服务端渲染，SSR场景跳过浏览器端专属逻辑
 * @returns {Promise | void} 异步setup时返回Promise，同步setup时无返回值
 */
function setupStatefulComponent(
  instance: ComponentInternalInstance,
  isSSR: boolean,
) {
  // 1. 获取组件的完整配置对象，包含setup/data/methods等所有业务配置
  const Component = instance.type as ComponentOptions

  // ===== 【开发环境专属：严格合法性校验，生产环境被tree-shaking完全剔除，零性能损耗】 =====
  if (__DEV__) {
    // 1.1 校验当前组件自身的名称是否合法（不能是原生标签、含非法字符等）
    if (Component.name) {
      validateComponentName(Component.name, instance.appContext.config)
    }
    // 1.2 校验组件内部注册的子组件名称是否合法
    if (Component.components) {
      const names = Object.keys(Component.components)
      for (let i = 0; i < names.length; i++) {
        validateComponentName(names[i], instance.appContext.config)
      }
    }
    // 1.3 校验组件内部注册的自定义指令名称是否合法
    if (Component.directives) {
      const names = Object.keys(Component.directives)
      for (let i = 0; i < names.length; i++) {
        validateDirectiveName(names[i])
      }
    }
    // 1.4 校验：运行时版本的Vue不支持组件内的compilerOptions编译配置
    if (Component.compilerOptions && isRuntimeOnly()) {
      warn(
        `"compilerOptions" is only supported when using a build of Vue that ` + // “compilerOptions”仅在使用特定版本的Vue时受支持
          `includes the runtime compiler. Since you are using a runtime-only ` + // 包含了运行时编译器。由于你正在使用仅限运行时的版本
          `build, the options should be passed via your build tool config instead.`, // 在构建时，应通过构建工具配置来传递选项
      )
    }
  }

  // ===== 【性能优化：初始化组件属性访问缓存】 =====
  // 缓存组件渲染时访问的props/state等属性，避免重复查找，提升渲染性能，纯净无原型的空对象
  // 0. create render proxy property access cache 创建渲染代理属性访问缓存
  instance.accessCache = Object.create(null)

  // ===== 【Vue3核心设计：创建组件的渲染代理对象 → instance.proxy，这是组件内this的底层真身！】 =====
  // instance.ctx：组件原始上下文，存储组件状态；PublicInstanceProxyHandlers：代理拦截器，实现属性访问规则
  // 业务中组件内的this，本质就是这个Proxy代理，不是原始的ctx对象！
  // 1. create public instance / render proxy 创建公共实例/渲染代理
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers)

  // 开发环境专属：将props暴露到渲染上下文，方便调试和兼容
  if (__DEV__) {
    exposePropsOnRenderContext(instance)
  }

  // ===== 【核心核心：执行组件的setup函数，Vue3组合式API的入口】 =====
  // 2. 获取组件配置中的setup函数，无setup则直接进入兜底收尾逻辑
  // 2. call setup()
  const { setup } = Component
  if (setup) {
    // 2.1 暂停响应式依赖收集：setup执行过程中避免触发不必要的依赖收集，提升性能
    pauseTracking()

    // 2.2 创建setup的第二个入参：setupContext上下文对象
    // 规则：只有当setup函数的形参长度>1时，才创建setupContext，按需创建节省内存
    const setupContext = (instance.setupContext =
      setup.length > 1 ? createSetupContext(instance) : null)

    // 2.3 设置当前组件实例上下文：让setup中能通过getCurrentInstance()获取组件实例
    // reset：执行完成后恢复上下文的函数，避免实例污染
    // 重点: 并且在这个方法中会激活 instance.scope, 从而使 setup 的所有 watch/computed 等挂载到实例上
    const reset = setCurrentInstance(instance)

    // 2.4 带错误捕获的执行setup函数，这是setup真正被调用的地方！
    // 入参传递规则：第一个参数是props（开发环境浅层只读，生产环境浅层响应式），第二个参数是setupContext
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      ErrorCodes.SETUP_FUNCTION,
      [
        __DEV__ ? shallowReadonly(instance.props) : instance.props,
        setupContext,
      ],
    )

    // 2.5 判断setup返回值是否为Promise → 即是否是【异步setup】
    const isAsyncSetup = isPromise(setupResult)
    // 2.6 恢复响应式依赖收集 + 恢复组件实例上下文，清理副作用
    resetTracking()
    reset()

    // ===== 【分支1：处理【异步setup】的逻辑，返回Promise的情况】 =====
    if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
      // async setup / serverPrefetch, mark as async boundary for useId() 异步设置/serverPrefetch，标记为 useId() 的异步边界
      // 标记组件为「异步边界」，供useId等API使用，异步组件必须标记
      markAsyncBoundary(instance)
    }

    if (isAsyncSetup) {
      // 异步setup：Promise完成后，手动清除当前实例上下文，避免内存泄漏
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance)
      if (isSSR) {
        // return the promise so server-renderer can wait on it
        return setupResult
          .then((resolvedResult: unknown) => {
            handleSetupResult(instance, resolvedResult, isSSR)
          })
          .catch(e => {
            handleError(e, instance, ErrorCodes.SETUP_FUNCTION)
          })
      } else if (__FEATURE_SUSPENSE__) {
        // async setup returned Promise.
        // bail here and wait for re-entry.
        instance.asyncDep = setupResult
        if (__DEV__ && !instance.suspense) {
          const name = formatComponentName(instance, Component)
          warn(
            `Component <${name}>: setup function returned a promise, but no ` +
              `<Suspense> boundary was found in the parent component tree. ` +
              `A component with async setup() must be nested in a <Suspense> ` +
              `in order to be rendered.`,
          )
        }
      } else if (__DEV__) {
        warn(
          `setup() returned a Promise, but the version of Vue you are using ` +
            `does not support it yet.`,
        )
      }
    }
    // 处理【同步setup】的逻辑，返回普通值/对象/函数
    else {
      // 同步执行完成，直接处理setup的返回值，挂载到组件实例
      handleSetupResult(instance, setupResult, isSSR)
    }
  }
  // ===== 【兜底情况：组件无setup函数】 =====
  // 直接执行收尾函数，完成组件初始化，兼容选项式API（data/methods等）
  else {
    finishComponentSetup(instance, isSSR)
  }
}

/**
 * Vue3 核心内部函数 - 处理组件 setup 函数返回值的【唯一核心入口】
 * 核心使命：接收 setup 执行后的返回结果，根据返回值的「不同类型」做差异化的标准化处理，
 *          并将处理后的结果挂载到组件实例上，最终统一调用收尾函数完成组件初始化，让组件具备渲染能力
 * 核心关联：在 setupStatefulComponent 中被调用，无论是同步 setup 的直接返回值，还是异步 setup resolve 后的结果，
 *          最终都会流转到该函数处理；是连接 setup 执行与组件渲染的「核心桥梁」
 *
 *
 * @param {ComponentInternalInstance} instance 组件内部实例，处理后的结果最终挂载到该实例
 * @param {unknown} setupResult setup 函数执行后的返回值，类型未知（函数/对象/基本类型/undefined）
 * @param {boolean} isSSR 是否为服务端渲染环境，区分处理SSR和客户端渲染的逻辑
 * @returns {void} 无返回值，所有处理结果直接挂载到组件实例
 */
export function handleSetupResult(
  instance: ComponentInternalInstance,
  setupResult: unknown,
  isSSR: boolean,
): void {
  // ========== 分支1: setup 返回值是【函数类型】 ==========
  if (isFunction(setupResult)) {
    // setup returned an inline render function 设置返回一个内联渲染函数
    if (__SSR__ && (instance.type as ComponentOptions).__ssrInlineRender) {
      // when the function's name is `ssrRender` (compiled by SFC inline mode), 当函数名为`ssrRender`时（通过SFC内联模式编译），
      // set it as ssrRender instead. 将其设置为 ssrRender。

      // SSR服务端渲染专属：如果是SFC内联编译的ssr渲染函数(函数名ssrRender)，
      // 则将其挂载为组件的服务端渲染函数，供服务端渲染器调用
      instance.ssrRender = setupResult
    } else {
      // 客户端渲染：将该函数赋值为组件的核心渲染函数，后续组件渲染时执行此函数生成VNode
      instance.render = setupResult as InternalRenderFunction
    }
  }
  // ========== 分支2: setup 返回值是【对象类型】(非null) ==========
  else if (isObject(setupResult)) {
    // 开发环境警告：禁止setup直接返回VNode节点，Vue规定需返回渲染函数/普通对象
    if (__DEV__ && isVNode(setupResult)) {
      warn(
        `setup() should not return VNodes directly - ` + // setup() 函数不应直接返回 VNodes
          `return a render function instead.`, // 返回一个渲染函数而非
      )
    }
    // setup返回了「响应式状态对象」，这是业务开发最常用的场景(return { xxx, yyy })
    // 该对象中的属性会成为组件的模板可访问状态、this可访问状态

    // setup returned bindings. 安装程序返回了绑定信息
    // assuming a render function compiled from template is present. 假设存在一个从模板编译而来的渲染函数
    // 开发环境/生产环境开启调试工具：缓存原始的setup返回对象，供VueDevtools调试查看，不影响运行逻辑
    if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
      instance.devtoolsRawSetupState = setupResult
    }

    // ✅ 核心处理：对setup返回的对象执行 proxyRefs 自动解包处理，挂载到组件实例的setupState属性
    // proxyRefs 是Vue3核心语法糖：让模板中访问ref属性时，无需手动写 .value，会自动解包
    instance.setupState = proxyRefs(setupResult)

    // 开发环境专属：将setupState暴露到组件的渲染上下文(ctx)，兼容this访问+方便调试
    if (__DEV__) {
      exposeSetupStateOnRenderContext(instance)
    }
  }
  // ========== 分支3: setup 返回【非函数/非对象】的其他值(且不是undefined) ==========
  else if (__DEV__ && setupResult !== undefined) {
    // 开发环境警告：Vue规范要求setup应返回「对象」或「渲染函数」，其他值无效
    warn(
      `setup() should return an object. Received: ${
        // setup() 应该返回一个对象。已收到
        setupResult === null ? 'null' : typeof setupResult
      }`,
    )
  }

  // ========== 最终统一兜底：执行组件初始化收尾函数 ==========
  // 无论setup返回什么，处理完成后都必须调用此函数，完成组件的最终初始化
  // 该函数会绑定组件渲染函数、兼容选项式API(data/methods等)，让组件正式具备渲染能力
  finishComponentSetup(instance, isSSR)
}

type CompileFunction = (
  template: string | object,
  options?: CompilerOptions,
) => InternalRenderFunction

let compile: CompileFunction | undefined
let installWithProxy: (i: ComponentInternalInstance) => void

/**
 * For runtime-dom to register the compiler. 用于runtime-dom注册编译器
 * Note the exported method uses any to avoid d.ts relying on the compiler types. 请注意，导出的方法使用 any 来避免 d.ts 依赖于编译器类型
 */
export function registerRuntimeCompiler(_compile: any): void {
  compile = _compile
  installWithProxy = i => {
    if (i.render!._rc) {
      i.withProxy = new Proxy(i.ctx, RuntimeCompiledPublicInstanceProxyHandlers)
    }
  }
}

// dev only
export const isRuntimeOnly = (): boolean => !compile

/**
 * 完成Vue组件实例的最终初始化设置（组件挂载前的核心收尾逻辑）
 * 核心职责：
 *  1. 标准化模板/渲染函数（无render时编译template生成render）
 *  2. 兼容处理Vue2.x的Options API
 *  3. 兼容模式下的旧版render函数转换
 *  4. 开发环境下对缺失模板/渲染函数的场景给出友好警告
 *
 * @param {ComponentInternalInstance} instance - 组件内部实例（Vue核心的组件实例对象）
 * @param {boolean} isSSR - 是否为SSR（服务端渲染）环境
 * @param {boolean} [skipOptions] - 是否跳过Options API的应用（仅兼容模式下使用）
 * @returns {void}
 */
export function finishComponentSetup(
  instance: ComponentInternalInstance,
  isSSR: boolean,
  skipOptions?: boolean,
): void {
  // 从组件实例中获取组件选项（类型断言为ComponentOptions便于操作）
  const Component = instance.type as ComponentOptions

  // ====================== 兼容模式处理（Vue2 -> Vue3） ======================
  if (__COMPAT__) {
    // 转换旧版（Vue2）的render函数，适配Vue3的渲染逻辑
    convertLegacyRenderFn(instance)

    // 开发环境下，校验组件自定义的兼容配置是否合法
    if (__DEV__ && Component.compatConfig) {
      validateCompatConfig(Component.compatConfig)
    }
  }

  // ====================== 模板/渲染函数标准化（核心逻辑） ======================
  // template / render function normalization 模板/渲染函数规范化
  // could be already set when returned from setup() 从setup()返回时可能已经设置好了
  // 仅当实例未设置render函数时才处理（setup返回的render优先级更高）
  if (!instance.render) {
    // only do on-the-fly compile if not in SSR - SSR on-the-fly compilation 仅在不在 SSR 中时进行即时编译 - SSR 即时编译
    // is done by server-renderer 由服务器渲染器完成

    // 非SSR环境 + 存在编译器 + 组件未定义render函数时，才进行运行时模板编译
    // 注：SSR的运行时编译由server-renderer单独处理，此处不参与
    // 也就是处理 template 选项, 运行时编辑模板 --> https://cn.vuejs.org/api/options-rendering.html#template
    if (!isSSR && compile && !Component.render) {
      // 确定要编译的模板来源（优先级：内联模板 > 组件自身template > 合并后的Options模板）
      const template =
        (__COMPAT__ &&
          instance.vnode.props &&
          instance.vnode.props['inline-template']) ||
        Component.template ||
        (__FEATURE_OPTIONS_API__ && resolveMergedOptions(instance).template)

      // 存在模板时，编译生成render函数
      if (template) {
        // 开发环境：开启编译性能打点（用于调试编译耗时）
        if (__DEV__) {
          startMeasure(instance, `compile`)
        }

        // 组装最终的编译器选项（多层合并，优先级：组件级 > 应用级 > 默认）
        // 1. 从应用上下文获取基础配置（自定义元素判断、编译器基础配置）
        const { isCustomElement, compilerOptions } = instance.appContext.config
        // 2. 从组件选项获取自定义配置（模板分隔符、组件级编译器选项）
        const { delimiters, compilerOptions: componentCompilerOptions } =
          Component
        // 3. 多层合并配置（后合并的配置会覆盖前序同名配置）
        const finalCompilerOptions: CompilerOptions = extend(
          extend(
            {
              isCustomElement,
              delimiters,
            },
            compilerOptions,
          ),
          componentCompilerOptions,
        )
        if (__COMPAT__) {
          // pass runtime compat config into the compiler
          finalCompilerOptions.compatConfig = Object.create(globalCompatConfig)
          if (Component.compatConfig) {
            // @ts-expect-error types are not compatible
            extend(finalCompilerOptions.compatConfig, Component.compatConfig)
          }
        }
        Component.render = compile(template, finalCompilerOptions)
        if (__DEV__) {
          endMeasure(instance, `compile`)
        }
      }
    }

    // 将组件的render函数（或空函数NOOP）挂载到实例上，作为内部渲染函数
    // 注：NOOP是空函数，避免render为undefined导致渲染报错
    instance.render = (Component.render || NOOP) as InternalRenderFunction

    // for runtime-compiled render functions using `with` blocks, the render 对于使用`with`块进行运行时编译的渲染函数，其渲染过程
    // proxy used needs a different `has` handler which is more performant and 所使用的代理需要一个不同的`has`处理程序，这个处理程序性能更高
    // also only allows a whitelist of globals to fallthrough. 也只允许白名单中的全局变量通过
    if (installWithProxy) {
      installWithProxy(instance)
    }
  }

  // ====================== Options API 支持（Vue2.x 语法适配） ======================
  // support for 2.x options 支持 2.x 选项
  // 启用Options API 且 非兼容模式跳过选项时，应用2.x的Options API逻辑
  if (__FEATURE_OPTIONS_API__ && !(__COMPAT__ && skipOptions)) {
    // 设置当前组件实例（保证Options API中this指向正确）
    const reset = setCurrentInstance(instance)
    // 暂停响应式追踪（避免Options API初始化时触发不必要的依赖收集）
    pauseTracking()
    try {
      // 核心：应用组件的Options API（props/methods/watch/computed等）
      applyOptions(instance)
    } finally {
      // 恢复响应式追踪（无论是否报错，都要恢复）
      resetTracking()
      // 重置当前组件实例（避免污染后续逻辑）
      reset()
    }
  }

  // ====================== 开发环境警告（缺失模板/渲染函数） ======================
  // warn missing template/render 警告缺少模板/渲染
  // the runtime compilation of template in SSR is done by server-render SSR中模板的运行时编译是由server-render完成的

  // 条件：开发环境 + 组件无render + 实例render为空函数 + 非SSR环境
  if (__DEV__ && !Component.render && instance.render === NOOP && !isSSR) {
    if (!compile && Component.template) {
      /* v8 ignore start */
      warn(
        `Component provided template option but ` + // 组件提供了模板选项，但是
          `runtime compilation is not supported in this build of Vue.` + // 此版本的 Vue 不支持运行时编译
          (__ESM_BUNDLER__
            ? ` Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".` // 将您的捆绑器配置为将“vue”别名为“vue/dist/vue.esm-bundler.js”
            : __ESM_BROWSER__
              ? ` Use "vue.esm-browser.js" instead.` // 使用“vue.esm-browser.js”代替
              : __GLOBAL__
                ? ` Use "vue.global.js" instead.` // 使用“vue.global.js”代替
                : ``) /* should not happen */,
      )
      /* v8 ignore stop */
    } else {
      warn(`Component is missing template or render function: `, Component) // 组件缺少模板或渲染功能
    }
  }
}

const attrsProxyHandlers = __DEV__
  ? {
      get(target: Data, key: string) {
        markAttrsAccessed()
        track(target, TrackOpTypes.GET, '')
        return target[key]
      },
      set() {
        warn(`setupContext.attrs is readonly.`)
        return false
      },
      deleteProperty() {
        warn(`setupContext.attrs is readonly.`)
        return false
      },
    }
  : {
      get(target: Data, key: string) {
        track(target, TrackOpTypes.GET, '')
        return target[key]
      },
    }

/**
 * Dev-only
 */
function getSlotsProxy(instance: ComponentInternalInstance): Slots {
  return new Proxy(instance.slots, {
    get(target, key: string) {
      track(instance, TrackOpTypes.GET, '$slots')
      return target[key]
    },
  })
}

export function createSetupContext(
  instance: ComponentInternalInstance,
): SetupContext {
  const expose: SetupContext['expose'] = exposed => {
    if (__DEV__) {
      if (instance.exposed) {
        warn(`expose() should be called only once per setup().`)
      }
      if (exposed != null) {
        let exposedType: string = typeof exposed
        if (exposedType === 'object') {
          if (isArray(exposed)) {
            exposedType = 'array'
          } else if (isRef(exposed)) {
            exposedType = 'ref'
          }
        }
        if (exposedType !== 'object') {
          warn(
            `expose() should be passed a plain object, received ${exposedType}.`,
          )
        }
      }
    }
    instance.exposed = exposed || {}
  }

  if (__DEV__) {
    // We use getters in dev in case libs like test-utils overwrite instance
    // properties (overwrites should not be done in prod)
    let attrsProxy: Data
    let slotsProxy: Slots
    return Object.freeze({
      get attrs() {
        return (
          attrsProxy ||
          (attrsProxy = new Proxy(instance.attrs, attrsProxyHandlers))
        )
      },
      get slots() {
        return slotsProxy || (slotsProxy = getSlotsProxy(instance))
      },
      get emit() {
        return (event: string, ...args: any[]) => instance.emit(event, ...args)
      },
      expose,
    })
  } else {
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose,
    }
  }
}

/**
 * Vue3 内部核心函数 - 获取组件【对外暴露的公共实例】的专用函数
 * 核心使命：
 *   1. 优先返回组件通过 `defineExpose`/`expose()` 暴露的属性（封装为Proxy，仅允许访问暴露属性+Vue内置公共属性）；
 *   2. 未暴露属性时，返回组件默认的公共代理（instance.proxy）；
 *   3. 对暴露的属性做封装：自动解包Ref、标记为非响应式、拦截非法属性访问；
 * 核心关联：模板Ref绑定组件时（如 `<MyComp ref="compRef" />`），ref的值就是该函数返回的公共实例；
 *          也用于 `$parent`/`$children` 等组件间访问场景。
 *
 *
 * @param {ComponentInternalInstance} instance 组件内部实例（私有，包含所有内部状态）
 * @returns {ComponentPublicInstance | ComponentInternalInstance['exposed'] | null} 组件对外的公共实例：
 *          - 有exposed时：返回封装后的Proxy（仅暴露指定属性+内置公共属性）；
 *          - 无exposed时：返回instance.proxy（默认公共代理）；
 *          - 极端场景：返回null（如组件未初始化完成）。
 */
export function getComponentPublicInstance(
  instance: ComponentInternalInstance,
): ComponentPublicInstance | ComponentInternalInstance['exposed'] | null {
  // ========== 分支1：组件通过defineExpose/expose()暴露了属性 → 返回封装后的Proxy ==========
  if (instance.exposed) {
    return (
      // 优先使用缓存的exposeProxy（避免重复创建Proxy，提升性能）
      instance.exposeProxy ||
      // 缓存未命中 → 创建新的Proxy并赋值给exposeProxy
      (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        // Proxy的get拦截：拦截属性访问（控制公共实例能访问的属性）
        get(target, key: string) {
          if (key in target) {
            return target[key]
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance)
          }
        },
        // Proxy的has拦截：拦截`key in instance`判断（保证in操作符的一致性）
        has(target, key: string) {
          return key in target || key in publicPropertiesMap
        },
      }))
    )
  }
  // ========== 分支2：组件未暴露任何属性 → 返回默认的公共代理（instance.proxy） ==========
  else {
    // instance.proxy是组件默认的公共代理：
    // - 包含setup返回的所有属性；
    // - 包含Vue内置的公共属性（$el/$props等）；
    // - 是模板中`this`的指向；
    return instance.proxy
  }
}

const classifyRE = /(?:^|[-_])\w/g
const classify = (str: string): string =>
  str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '')

export function getComponentName(
  Component: ConcreteComponent,
  includeInferred = true,
): string | false | undefined {
  return isFunction(Component)
    ? Component.displayName || Component.name
    : Component.name || (includeInferred && Component.__name)
}

export function formatComponentName(
  instance: ComponentInternalInstance | null,
  Component: ConcreteComponent,
  isRoot = false,
): string {
  let name = getComponentName(Component)
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/)
    if (match) {
      name = match[1]
    }
  }

  if (!name && instance) {
    // try to infer the name based on reverse resolution
    const inferFromRegistry = (
      registry: Record<string, any> | undefined | null,
    ) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key
        }
      }
    }
    name =
      inferFromRegistry(instance.components) ||
      (instance.parent &&
        inferFromRegistry(
          (instance.parent.type as ComponentOptions).components,
        )) ||
      inferFromRegistry(instance.appContext.components)
  }

  return name ? classify(name) : isRoot ? `App` : `Anonymous`
}
/**
 * 判断给定的值是否为类组件
 * 通过检查值是否为函数且具有 '__vccOpts' 属性来确定是否为类组件
 *
 * @param value - 待检查的值
 * @returns 如果值是类组件则返回 true，否则返回 false
 */
export function isClassComponent(value: unknown): value is ClassComponent {
  return isFunction(value) && '__vccOpts' in value
}

export interface ComponentCustomElementInterface {
  /**
   * @internal
   */
  _injectChildStyle(type: ConcreteComponent): void
  /**
   * @internal
   */
  _removeChildStyle(type: ConcreteComponent): void
  /**
   * @internal
   */
  _setProp(
    key: string,
    val: any,
    shouldReflect?: boolean,
    shouldUpdate?: boolean,
  ): void
  /**
   * @internal
   */
  _beginPatch(): void
  /**
   * @internal
   */
  _endPatch(): void
  /**
   * @internal attached by the nested Teleport when shadowRoot is false.
   */
  _teleportTargets?: Set<RendererElement>
}
