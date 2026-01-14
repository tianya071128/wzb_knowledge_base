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
 * We expose a subset of properties on the internal instance as they are
 * useful for advanced external libraries and tools.
 */
export interface ComponentInternalInstance {
  uid: number
  type: ConcreteComponent
  parent: ComponentInternalInstance | null
  root: ComponentInternalInstance
  appContext: AppContext
  /**
   * Vnode representing this component in its parent's vdom tree
   */
  vnode: VNode
  /**
   * The pending new vnode from parent updates
   * @internal
   */
  next: VNode | null
  /**
   * Root vnode of this component's own vdom tree
   */
  subTree: VNode
  /**
   * Render effect instance
   */
  effect: ReactiveEffect
  /**
   * Force update render effect
   */
  update: () => void
  /**
   * Render effect job to be passed to scheduler (checks if dirty)
   */
  job: SchedulerJob
  /**
   * The render function that returns vdom tree.
   * @internal
   */
  render: InternalRenderFunction | null
  /**
   * SSR render function
   * @internal
   */
  ssrRender?: Function | null
  /**
   * Object containing values this component provides for its descendants
   * @internal
   */
  provides: Data
  /**
   * for tracking useId()
   * first element is the current boundary prefix
   * second number is the index of the useId call within that boundary
   * @internal
   */
  ids: [string, number, number]
  /**
   * Tracking reactive effects (e.g. watchers) associated with this component
   * so that they can be automatically stopped on component unmount
   * @internal
   */
  scope: EffectScope
  /**
   * cache for proxy access type to avoid hasOwnProperty calls
   * @internal
   */
  accessCache: Data | null
  /**
   * cache for render function values that rely on _ctx but won't need updates
   * after initialized (e.g. inline handlers)
   * @internal
   */
  renderCache: (Function | VNode | undefined)[]

  /**
   * Resolved component registry, only for components with mixins or extends
   * @internal
   */
  components: Record<string, ConcreteComponent> | null
  /**
   * Resolved directive registry, only for components with mixins or extends
   * @internal
   */
  directives: Record<string, Directive> | null
  /**
   * Resolved filters registry, v2 compat only
   * @internal
   */
  filters?: Record<string, Function>
  /**
   * resolved props options
   * @internal
   */
  propsOptions: NormalizedPropsOptions
  /**
   * resolved emits options
   * @internal
   */
  emitsOptions: ObjectEmitsOptions | null
  /**
   * resolved inheritAttrs options
   * @internal
   */
  inheritAttrs?: boolean
  /**
   * Custom Element instance (if component is created by defineCustomElement)
   * @internal
   */
  ce?: ComponentCustomElementInterface
  /**
   * is custom element? (kept only for compatibility)
   * @internal
   */
  isCE?: boolean
  /**
   * custom element specific HMR method
   * @internal
   */
  ceReload?: (newStyles?: string[]) => void

  // the rest are only for stateful components ---------------------------------

  // main proxy that serves as the public instance (`this`)
  proxy: ComponentPublicInstance | null

  // exposed properties via expose()
  exposed: Record<string, any> | null
  exposeProxy: Record<string, any> | null

  /**
   * alternative proxy used only for runtime-compiled render functions using
   * `with` block
   * @internal
   */
  withProxy: ComponentPublicInstance | null
  /**
   * This is the target for the public instance proxy. It also holds properties
   * injected by user options (computed, methods etc.) and user-attached
   * custom properties (via `this.x = ...`)
   * @internal
   */
  ctx: Data

  // state
  data: Data
  props: Data
  attrs: Data
  slots: InternalSlots
  refs: Data
  emit: EmitFn

  /**
   * used for keeping track of .once event handlers on components
   * @internal
   */
  emitted: Record<string, boolean> | null
  /**
   * used for caching the value returned from props default factory functions to
   * avoid unnecessary watcher trigger
   * @internal
   */
  propsDefaults: Data
  /**
   * setup related
   * @internal
   */
  setupState: Data
  /**
   * devtools access to additional info
   * @internal
   */
  devtoolsRawSetupState?: any
  /**
   * @internal
   */
  setupContext: SetupContext | null

  /**
   * suspense related
   * @internal
   */
  suspense: SuspenseBoundary | null
  /**
   * suspense pending batch id
   * @internal
   */
  suspenseId: number
  /**
   * @internal
   */
  asyncDep: Promise<any> | null
  /**
   * @internal
   */
  asyncResolved: boolean

  // lifecycle
  isMounted: boolean
  isUnmounted: boolean
  isDeactivated: boolean
  /**
   * @internal
   */
  [LifecycleHooks.BEFORE_CREATE]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.CREATED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.BEFORE_MOUNT]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.MOUNTED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.BEFORE_UPDATE]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.UPDATED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.BEFORE_UNMOUNT]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.UNMOUNTED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.RENDER_TRACKED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.RENDER_TRIGGERED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.ACTIVATED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.DEACTIVATED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.ERROR_CAPTURED]: LifecycleHook
  /**
   * @internal
   */
  [LifecycleHooks.SERVER_PREFETCH]: LifecycleHook<() => Promise<unknown>>

  /**
   * For caching bound $forceUpdate on public proxy access
   * @internal
   */
  f?: () => void
  /**
   * For caching bound $nextTick on public proxy access
   * @internal
   */
  n?: () => Promise<void>
  /**
   * `updateTeleportCssVars`
   * For updating css vars on contained teleports
   * @internal
   */
  ut?: (vars?: Record<string, unknown>) => void

  /**
   * dev only. For style v-bind hydration mismatch checks
   * @internal
   */
  getCssVars?: () => Record<string, unknown>

  /**
   * v2 compat only, for caching mutated $options
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

export const setCurrentInstance = (instance: ComponentInternalInstance) => {
  const prev = currentInstance
  internalSetCurrentInstance(instance)
  instance.scope.on()
  return (): void => {
    instance.scope.off()
    internalSetCurrentInstance(prev)
  }
}

export const unsetCurrentInstance = (): void => {
  currentInstance && currentInstance.scope.off()
  internalSetCurrentInstance(null)
}

const isBuiltInTag = /*@__PURE__*/ makeMap('slot,component')

export function validateComponentName(
  name: string,
  { isNativeTag }: AppConfig,
): void {
  if (isBuiltInTag(name) || isNativeTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component id: ' + name,
    )
  }
}

export function isStatefulComponent(
  instance: ComponentInternalInstance,
): number {
  return instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
}

export let isInSSRComponentSetup = false

export function setupComponent(
  instance: ComponentInternalInstance,
  isSSR = false,
  optimized = false,
): Promise<void> | undefined {
  isSSR && setInSSRSetupState(isSSR)

  const { props, children } = instance.vnode
  const isStateful = isStatefulComponent(instance)
  initProps(instance, props, isStateful, isSSR)
  initSlots(instance, children, optimized || isSSR)

  const setupResult = isStateful
    ? setupStatefulComponent(instance, isSSR)
    : undefined

  isSSR && setInSSRSetupState(false)
  return setupResult
}

function setupStatefulComponent(
  instance: ComponentInternalInstance,
  isSSR: boolean,
) {
  const Component = instance.type as ComponentOptions

  if (__DEV__) {
    if (Component.name) {
      validateComponentName(Component.name, instance.appContext.config)
    }
    if (Component.components) {
      const names = Object.keys(Component.components)
      for (let i = 0; i < names.length; i++) {
        validateComponentName(names[i], instance.appContext.config)
      }
    }
    if (Component.directives) {
      const names = Object.keys(Component.directives)
      for (let i = 0; i < names.length; i++) {
        validateDirectiveName(names[i])
      }
    }
    if (Component.compilerOptions && isRuntimeOnly()) {
      warn(
        `"compilerOptions" is only supported when using a build of Vue that ` +
          `includes the runtime compiler. Since you are using a runtime-only ` +
          `build, the options should be passed via your build tool config instead.`,
      )
    }
  }
  // 0. create render proxy property access cache
  instance.accessCache = Object.create(null)
  // 1. create public instance / render proxy
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers)
  if (__DEV__) {
    exposePropsOnRenderContext(instance)
  }
  // 2. call setup()
  const { setup } = Component
  if (setup) {
    pauseTracking()
    const setupContext = (instance.setupContext =
      setup.length > 1 ? createSetupContext(instance) : null)
    const reset = setCurrentInstance(instance)
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      ErrorCodes.SETUP_FUNCTION,
      [
        __DEV__ ? shallowReadonly(instance.props) : instance.props,
        setupContext,
      ],
    )
    const isAsyncSetup = isPromise(setupResult)
    resetTracking()
    reset()

    if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
      // async setup / serverPrefetch, mark as async boundary for useId()
      markAsyncBoundary(instance)
    }

    if (isAsyncSetup) {
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
    } else {
      handleSetupResult(instance, setupResult, isSSR)
    }
  } else {
    finishComponentSetup(instance, isSSR)
  }
}

export function handleSetupResult(
  instance: ComponentInternalInstance,
  setupResult: unknown,
  isSSR: boolean,
): void {
  if (isFunction(setupResult)) {
    // setup returned an inline render function
    if (__SSR__ && (instance.type as ComponentOptions).__ssrInlineRender) {
      // when the function's name is `ssrRender` (compiled by SFC inline mode),
      // set it as ssrRender instead.
      instance.ssrRender = setupResult
    } else {
      instance.render = setupResult as InternalRenderFunction
    }
  } else if (isObject(setupResult)) {
    if (__DEV__ && isVNode(setupResult)) {
      warn(
        `setup() should not return VNodes directly - ` +
          `return a render function instead.`,
      )
    }
    // setup returned bindings.
    // assuming a render function compiled from template is present.
    if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
      instance.devtoolsRawSetupState = setupResult
    }
    instance.setupState = proxyRefs(setupResult)
    if (__DEV__) {
      exposeSetupStateOnRenderContext(instance)
    }
  } else if (__DEV__ && setupResult !== undefined) {
    warn(
      `setup() should return an object. Received: ${
        setupResult === null ? 'null' : typeof setupResult
      }`,
    )
  }
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

export function finishComponentSetup(
  instance: ComponentInternalInstance,
  isSSR: boolean,
  skipOptions?: boolean,
): void {
  const Component = instance.type as ComponentOptions

  if (__COMPAT__) {
    convertLegacyRenderFn(instance)

    if (__DEV__ && Component.compatConfig) {
      validateCompatConfig(Component.compatConfig)
    }
  }

  // template / render function normalization
  // could be already set when returned from setup()
  if (!instance.render) {
    // only do on-the-fly compile if not in SSR - SSR on-the-fly compilation
    // is done by server-renderer
    if (!isSSR && compile && !Component.render) {
      const template =
        (__COMPAT__ &&
          instance.vnode.props &&
          instance.vnode.props['inline-template']) ||
        Component.template ||
        (__FEATURE_OPTIONS_API__ && resolveMergedOptions(instance).template)
      if (template) {
        if (__DEV__) {
          startMeasure(instance, `compile`)
        }
        const { isCustomElement, compilerOptions } = instance.appContext.config
        const { delimiters, compilerOptions: componentCompilerOptions } =
          Component
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

    instance.render = (Component.render || NOOP) as InternalRenderFunction

    // for runtime-compiled render functions using `with` blocks, the render
    // proxy used needs a different `has` handler which is more performant and
    // also only allows a whitelist of globals to fallthrough.
    if (installWithProxy) {
      installWithProxy(instance)
    }
  }

  // support for 2.x options
  if (__FEATURE_OPTIONS_API__ && !(__COMPAT__ && skipOptions)) {
    const reset = setCurrentInstance(instance)
    pauseTracking()
    try {
      applyOptions(instance)
    } finally {
      resetTracking()
      reset()
    }
  }

  // warn missing template/render
  // the runtime compilation of template in SSR is done by server-render
  if (__DEV__ && !Component.render && instance.render === NOOP && !isSSR) {
    if (!compile && Component.template) {
      /* v8 ignore start */
      warn(
        `Component provided template option but ` +
          `runtime compilation is not supported in this build of Vue.` +
          (__ESM_BUNDLER__
            ? ` Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
            : __ESM_BROWSER__
              ? ` Use "vue.esm-browser.js" instead.`
              : __GLOBAL__
                ? ` Use "vue.global.js" instead.`
                : ``) /* should not happen */,
      )
      /* v8 ignore stop */
    } else {
      warn(`Component is missing template or render function: `, Component)
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

export function getComponentPublicInstance(
  instance: ComponentInternalInstance,
): ComponentPublicInstance | ComponentInternalInstance['exposed'] | null {
  if (instance.exposed) {
    return (
      instance.exposeProxy ||
      (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key: string) {
          if (key in target) {
            return target[key]
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance)
          }
        },
        has(target, key: string) {
          return key in target || key in publicPropertiesMap
        },
      }))
    )
  } else {
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
