import {
  Comment,
  Fragment,
  Static,
  Text,
  type VNode,
  type VNodeArrayChildren,
  type VNodeHook,
  type VNodeProps,
  cloneIfMounted,
  createVNode,
  invokeVNodeHook,
  isSameVNodeType,
  normalizeVNode,
} from './vnode'
import {
  type ComponentInternalInstance,
  type ComponentOptions,
  type Data,
  type LifecycleHook,
  createComponentInstance,
  setupComponent,
} from './component'
import {
  filterSingleRoot,
  renderComponentRoot,
  shouldUpdateComponent,
  updateHOCHostEl,
} from './componentRenderUtils'
import {
  EMPTY_ARR,
  EMPTY_OBJ,
  NOOP,
  PatchFlags,
  ShapeFlags,
  def,
  getGlobalThis,
  invokeArrayFns,
  isArray,
  isReservedProp,
} from '@vue/shared'
import {
  type SchedulerJob,
  SchedulerJobFlags,
  type SchedulerJobs,
  flushPostFlushCbs,
  flushPreFlushCbs,
  queueJob,
  queuePostFlushCb,
} from './scheduler'
import {
  EffectFlags,
  ReactiveEffect,
  pauseTracking,
  resetTracking,
} from '@vue/reactivity'
import { updateProps } from './componentProps'
import { updateSlots } from './componentSlots'
import { popWarningContext, pushWarningContext, warn } from './warning'
import { type CreateAppFunction, createAppAPI } from './apiCreateApp'
import { setRef } from './rendererTemplateRef'
import {
  type SuspenseBoundary,
  type SuspenseImpl,
  isSuspense,
  queueEffectWithSuspense,
} from './components/Suspense'
import {
  TeleportEndKey,
  type TeleportImpl,
  type TeleportVNode,
} from './components/Teleport'
import { type KeepAliveContext, isKeepAlive } from './components/KeepAlive'
import { isHmrUpdating, registerHMR, unregisterHMR } from './hmr'
import { type RootHydrateFunction, createHydrationFunctions } from './hydration'
import { invokeDirectiveHook } from './directives'
import { endMeasure, startMeasure } from './profiling'
import {
  devtoolsComponentAdded,
  devtoolsComponentRemoved,
  devtoolsComponentUpdated,
  setDevtoolsHook,
} from './devtools'
import { initFeatureFlags } from './featureFlags'
import { isAsyncWrapper } from './apiAsyncComponent'
import { isCompatEnabled } from './compat/compatConfig'
import { DeprecationTypes } from './compat/compatConfig'
import { type TransitionHooks, leaveCbKey } from './components/BaseTransition'
import type { VueElement } from '@vue/runtime-dom'

export interface Renderer<HostElement = RendererElement> {
  render: RootRenderFunction<HostElement>
  createApp: CreateAppFunction<HostElement>
}

export interface HydrationRenderer extends Renderer<Element | ShadowRoot> {
  hydrate: RootHydrateFunction
}

export type ElementNamespace = 'svg' | 'mathml' | undefined

export type RootRenderFunction<HostElement = RendererElement> = (
  vnode: VNode | null,
  container: HostElement,
  namespace?: ElementNamespace,
) => void

/**
 * 与平台无关的 DOM 操作 API
 *  - 浏览器环境见 runtime-dom/src/nodeOps.ts 文件定义
 */
export interface RendererOptions<
  HostNode = RendererNode,
  HostElement = RendererElement,
> {
  /**
   * 【核心】更新/修补元素节点的属性/特性/事件绑定，是diff算法中属性更新的核心方法
   * 负责处理：原生DOM属性(class/style/id)、DOM特性、Vue指令、事件绑定(@click等)的新增/更新/移除
   * @param el 要更新属性的「真实宿主元素节点」
   * @param key 要更新的属性/特性/事件名 (如: 'class' | 'style' | 'onClick' | 'id')
   * @param prevValue 该属性的旧值，首次挂载为 undefined/null
   * @param nextValue 该属性的新值，不需要更新则为 undefined/null
   * @param namespace 可选，元素的命名空间，处理 svg/math 等特殊标签的属性命名空间（如 xmlns）
   * @param parentComponent 可选，当前元素所属的父组件内部实例，用于处理指令/事件的上下文
   */
  patchProp(
    el: HostElement,
    key: string,
    prevValue: any,
    nextValue: any,
    namespace?: ElementNamespace,
    parentComponent?: ComponentInternalInstance | null,
  ): void
  /**
   * 将一个真实节点插入到指定的父容器中，是所有「挂载/插入」操作的底层实现
   * Vue 内部的 hostInsert 就是调用此方法，也是最常用的宿主操作之一
   * @param el 要被插入的「真实宿主节点」(元素/文本/注释都可以)
   * @param parent 父容器「真实宿主元素节点」，只能是元素节点（能容纳子节点）
   * @param anchor 可选，锚点「真实宿主节点」；插入规则：将 el 插入到 parent 中 anchor 节点的【前面】
   *               传 null 则表示插入到 parent 的子节点列表的「最后面」
   */
  insert(el: HostNode, parent: HostElement, anchor?: HostNode | null): void
  /**
   * 从宿主环境中移除指定的真实节点，清理节点相关的所有资源，无返回值
   * 会自动处理节点的父级关联、事件解绑等，避免内存泄漏
   * @param el 要被移除的「真实宿主节点」(元素/文本/注释都可以)
   */
  remove(el: HostNode): void
  /**
   * 创建一个「真实的宿主元素节点」
   * Vue 内部的 hostCreateElement 就是调用此方法，对应浏览器的 document.createElement
   * @param type 元素的标签名 (如: 'div' | 'span' | 'svg' | 'button')
   * @param namespace 可选，元素命名空间，处理 svg/math 等特殊标签（如 svg 标签需要 xmlns="http://www.w3.org/2000/svg"）
   * @param isCustomizedBuiltIn 可选，标记是否是「自定义内置元素」(如 <button is="my-button">)
   * @param vnodeProps 可选，当前元素对应的VNode属性集合，用于创建自定义元素时传递属性
   * @returns 创建好的「真实宿主元素节点」
   */
  createElement(
    type: string,
    namespace?: ElementNamespace,
    isCustomizedBuiltIn?: string,
    vnodeProps?: (VNodeProps & { [key: string]: any }) | null,
  ): HostElement
  /**
   * 创建一个「真实的宿主文本节点」
   * Vue 内部的 hostCreateText 就是调用此方法，对应浏览器的 document.createTextNode
   * @param text 文本节点的内容字符串
   * @returns 创建好的「真实宿主文本节点」
   */
  createText(text: string): HostNode
  /**
   * 创建一个「真实的宿主注释节点」
   * Vue 内部的 hostCreateComment 就是调用此方法，对应浏览器的 document.createComment
   * @param text 注释节点的内容字符串
   * @returns 创建好的「真实宿主注释节点」
   */
  createComment(text: string): HostNode
  /**
   * 修改「文本节点」的内容，只作用于文本类型的宿主节点
   * Vue 内部的 hostSetText 就是调用此方法，对应浏览器的 textNode.nodeValue = text
   * 也是 processText 文本更新逻辑中最核心的调用方法
   * @param node 要修改的「真实宿主文本节点」
   * @param text 新的文本内容字符串
   */
  setText(node: HostNode, text: string): void
  /**
   * 修改「元素节点」的文本内容（覆盖元素的所有子节点）
   * 区别于 setText：setText 操作「文本节点」，此方法操作「元素节点」
   * 对应浏览器的 element.textContent = text，会清空元素原有所有子节点，直接替换为文本
   * @param node 要修改的「真实宿主元素节点」
   * @param text 要设置的文本内容字符串
   */
  setElementText(node: HostElement, text: string): void
  /**
   * 获取指定节点的「父元素节点」
   * @param node 任意「真实宿主节点」
   * @returns 该节点的父元素节点，无则返回 null (文本/注释节点的父级一定是元素节点)
   */
  parentNode(node: HostNode): HostElement | null
  /**
   * 获取指定节点的「下一个兄弟节点」
   * 核心用于「锚点定位」，比如 patch 中卸载旧节点时获取锚点、insert 插入节点时的位置计算
   * @param node 任意「真实宿主节点」
   * @returns 该节点的下一个兄弟节点，无则返回 null
   */
  nextSibling(node: HostNode): HostNode | null
  /**
   * 【可选方法】根据选择器查询匹配的第一个元素节点
   * 非所有平台都需要实现（比如小程序无选择器概念），所以是可选属性
   * @param selector CSS选择器字符串 (如: '#app' | '.container' | 'div')
   * @returns 匹配到的元素节点，无则返回 null
   */
  querySelector?(selector: string): HostElement | null
  /**
   * 【可选方法】为元素节点设置 SFC 样式隔离的「作用域ID」
   * 仅在 Vue 单文件组件 <style scoped> 时生效，会给元素添加 data-v-xxx 属性
   * 非所有平台需要，故为可选方法
   * @param el 要设置的「真实宿主元素节点」
   * @param id 样式隔离的唯一标识ID (如: 'data-v-7ba5bd90')
   */
  setScopeId?(el: HostElement, id: string): void
  /**
   * 【可选方法】克隆一个已存在的真实宿主节点
   * 用于静态节点复用、缓存节点等性能优化场景，Vue内部按需调用
   * @param node 要克隆的「真实宿主节点」
   * @returns 克隆后的新节点
   */
  cloneNode?(node: HostNode): HostNode
  /**
   * 【可选方法】批量插入「静态文本内容」，是 Vue 的静态内容渲染性能优化方法
   * 直接插入一段HTML字符串/静态文本，比逐个创建节点再插入效率高得多
   * 用于静态提升、缓存静态节点等编译优化场景，返回插入后的起止节点用于后续更新
   * @param content 要插入的静态文本/HTML字符串
   * @param parent 父容器元素节点
   * @param anchor 插入的锚点节点
   * @param namespace 元素命名空间
   * @param start 可选，插入内容的起始节点
   * @param end 可选，插入内容的结束节点
   * @returns 包含插入后【起始节点、结束节点】的元组
   */
  insertStaticContent?(
    content: string,
    parent: HostElement,
    anchor: HostNode | null,
    namespace: ElementNamespace,
    start?: HostNode | null,
    end?: HostNode | null,
  ): [HostNode, HostNode]
}

// Renderer Node can technically be any object in the context of core renderer
// logic - they are never directly operated on and always passed to the node op
// functions provided via options, so the internal constraint is really just
// a generic object.
export interface RendererNode {
  [key: string | symbol]: any
}

export interface RendererElement extends RendererNode {}

// An object exposing the internals of a renderer, passed to tree-shakeable
// features so that they can be decoupled from this file. Keys are shortened
// to optimize bundle size.
export interface RendererInternals<
  HostNode = RendererNode,
  HostElement = RendererElement,
> {
  p: PatchFn
  um: UnmountFn
  r: RemoveFn
  m: MoveFn
  mt: MountComponentFn
  mc: MountChildrenFn
  pc: PatchChildrenFn
  pbc: PatchBlockChildrenFn
  n: NextFn
  o: RendererOptions<HostNode, HostElement>
}

// These functions are created inside a closure and therefore their types cannot
// be directly exported. In order to avoid maintaining function signatures in
// two places, we declare them once here and use them inside the closure.
type PatchFn = (
  n1: VNode | null, // null means this is a mount
  n2: VNode,
  container: RendererElement,
  anchor?: RendererNode | null,
  parentComponent?: ComponentInternalInstance | null,
  parentSuspense?: SuspenseBoundary | null,
  namespace?: ElementNamespace,
  slotScopeIds?: string[] | null,
  optimized?: boolean,
) => void

type MountChildrenFn = (
  children: VNodeArrayChildren,
  container: RendererElement,
  anchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  namespace: ElementNamespace,
  slotScopeIds: string[] | null,
  optimized: boolean,
  start?: number,
) => void

type PatchChildrenFn = (
  n1: VNode | null,
  n2: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  namespace: ElementNamespace,
  slotScopeIds: string[] | null,
  optimized: boolean,
) => void

type PatchBlockChildrenFn = (
  oldChildren: VNode[],
  newChildren: VNode[],
  fallbackContainer: RendererElement,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  namespace: ElementNamespace,
  slotScopeIds: string[] | null,
) => void

type MoveFn = (
  vnode: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  type: MoveType,
  parentSuspense?: SuspenseBoundary | null,
) => void

type NextFn = (vnode: VNode) => RendererNode | null

type UnmountFn = (
  vnode: VNode,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  doRemove?: boolean,
  optimized?: boolean,
) => void

type RemoveFn = (vnode: VNode) => void

type UnmountChildrenFn = (
  children: VNode[],
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  doRemove?: boolean,
  optimized?: boolean,
  start?: number,
) => void

export type MountComponentFn = (
  initialVNode: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  namespace: ElementNamespace,
  optimized: boolean,
) => void

type ProcessTextOrCommentFn = (
  n1: VNode | null,
  n2: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
) => void

export type SetupRenderEffectFn = (
  instance: ComponentInternalInstance,
  initialVNode: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  parentSuspense: SuspenseBoundary | null,
  namespace: ElementNamespace,
  optimized: boolean,
) => void

export enum MoveType {
  ENTER,
  LEAVE,
  REORDER,
}

export const queuePostRenderEffect: (
  fn: SchedulerJobs,
  suspense: SuspenseBoundary | null,
) => void = __FEATURE_SUSPENSE__
  ? __TEST__
    ? // vitest can't seem to handle eager circular dependency
      (fn: Function | Function[], suspense: SuspenseBoundary | null) =>
        queueEffectWithSuspense(fn, suspense)
    : queueEffectWithSuspense
  : queuePostFlushCb

/**
 * The createRenderer function accepts two generic arguments: createRenderer 函数接受两个通用参数
 * HostNode and HostElement, corresponding to Node and Element types in the HostNode 和 HostElement，分别对应中的 Node 和 Element 类型
 * host environment. For example, for runtime-dom, HostNode would be the DOM 宿主环境。例如，对于runtime-dom，HostNode将是DOM
 * `Node` interface and HostElement would be the DOM `Element` interface. `Node` 接口和 HostElement 将是 DOM `Element` 接口
 *
 * Custom renderers can pass in the platform specific types like this: 自定义渲染器可以像这样传入平台特定类型
 *
 * ``` js
 * const { render, createApp } = createRenderer<Node, Element>({
 *   patchProp,
 *   ...nodeOps
 * })
 * ```
 */
/**
 * 执行自定义渲染器, 这样不必约束单个平台，但是需要提供 RendererOptions 定义一些接口供渲染器定义
 *  - 本质上 Vue 自身的 @vue/runtime-dom 也是利用这套 API 实现的。
 *   --> https://cn.vuejs.org/api/custom-renderer.html
 */
export function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement,
>(options: RendererOptions<HostNode, HostElement>): Renderer<HostElement> {
  return baseCreateRenderer<HostNode, HostElement>(options)
}

// Separate API for creating hydration-enabled renderer.
// Hydration logic is only used when calling this function, making it
// tree-shakable.
export function createHydrationRenderer(
  options: RendererOptions<Node, Element>,
): HydrationRenderer {
  return baseCreateRenderer(options, createHydrationFunctions)
}

// overload 1: no hydration --> 非 hydration, hydration(应该是指代 SSR 时的水合作用)
function baseCreateRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement,
>(options: RendererOptions<HostNode, HostElement>): Renderer<HostElement>

// overload 2: with hydration
function baseCreateRenderer(
  options: RendererOptions<Node, Element>,
  createHydrationFns: typeof createHydrationFunctions,
): HydrationRenderer

// implementation
function baseCreateRenderer(
  options: RendererOptions,
  createHydrationFns?: typeof createHydrationFunctions,
): any {
  // compile-time feature flags check 编译时功能标志检查
  if (__ESM_BUNDLER__ && !__TEST__) {
    initFeatureFlags()
  }

  // 给目标(window、或者其他)增加 __VUE__ 标记
  const target = getGlobalThis()
  target.__VUE__ = true
  if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
    setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target)
  }

  /** 与平台无关的 DOM 操作API */
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent,
  } = options

  // Note: functions inside this closure should use `const xxx = () => {}` 注意：此闭包内的函数应使用 const xxx = () => {}`
  // style in order to prevent being inlined by minifiers. 样式以防止被缩小器内联
  /**
   * Vue3 虚拟DOM核心补丁函数，Diff算法的主入口
   * 核心作用：对比新旧两个VNode(n1旧节点/n2新节点)的差异，将差异内容更新到真实DOM中，实现精准的DOM更新
   * 包含逻辑：节点复用判断、节点卸载、不同类型VNode的差异化更新、ref绑定/解绑等全量更新逻辑
   * @param {VNode | null} n1 旧的虚拟节点，首次渲染时为 null
   * @param {VNode} n2 新的虚拟节点，本次要渲染/更新的节点
   * @param {RendererElement} container 真实DOM容器，节点要挂载/更新到的父容器
   * @param {RendererNode | null} anchor 锚点DOM节点，用于精准插入新节点的位置（参照物），默认null
   * @param {ComponentInternalInstance | null} parentComponent 当前节点所属的父组件实例，默认null
   * @param {SuspenseBoundary | null} parentSuspense 当前节点所属的父级Suspense组件实例，处理异步组件用，默认null
   * @param {string | undefined} namespace DOM命名空间，处理svg、math等特殊标签的属性命名空间，默认undefined
   * @param {string[] | null} slotScopeIds 插槽的样式作用域ID，SFC的scoped样式隔离用，默认null
   * @param {boolean} optimized 是否开启编译优化模式，默认值：开发环境+热更新时关闭优化，否则根据新节点是否有动态子节点判断
   * @returns {void}
   */
  const patch: PatchFn = (
    n1,
    n2,
    container,
    anchor = null,
    parentComponent = null,
    parentSuspense = null,
    namespace = undefined,
    slotScopeIds = null,
    optimized = __DEV__ && isHmrUpdating ? false : !!n2.dynamicChildren,
  ) => {
    // 如果新旧 VNode 指向同一个内存地址，说明节点内容完全无变化，无需任何更新操作，直接终止执行
    if (n1 === n2) {
      return
    }

    // patching & not same type, unmount old tree 修补且类型不同，卸载旧树
    // 存在旧VNode 且 新旧VNode的类型不匹配（isSameVNodeType判断：type+key双匹配）
    // 类型不一致时无法做差异化更新，最优解是：先卸载旧VNode对应的整棵DOM树，后续直接挂载新节点
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1)
      unmount(n1, parentComponent, parentSuspense, true)
      n1 = null
    }

    // 如果新 VNode 的补丁标记是 BAIL(放弃优化)，则强制关闭编译优化模式
    // BAIL 标记表示当前节点的结构复杂，无法做静态/动态节点的优化，需要走全量的diff逻辑
    if (n2.patchFlag === PatchFlags.BAIL) {
      optimized = false
      n2.dynamicChildren = null
    }

    // 解构新VNode的核心属性，后续根据类型做差异化处理
    const { type, ref, shapeFlag } = n2
    // 根据 VNode 的不同type类型，执行对应的更新/挂载逻辑
    // 基于 VNode 的type做精准分流，不同类型的节点有专属的处理逻辑，职责单一
    switch (type) {
      // 文本类型VNode：<div>文本内容</div> 中的文本节点
      case Text:
        processText(n1, n2, container, anchor)
        break

      // 注释类型VNode：模板中的 <!-- xxx --> 注释节点
      case Comment:
        processCommentNode(n1, n2, container, anchor)
        break

      // 静态类型VNode：内容永远不会变化的节点（性能优化核心）
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, namespace)
        } else if (__DEV__) {
          patchStaticNode(n1, n2, container, namespace)
        }
        break

      // 片段类型VNode：<Fragment> 或 模板多根节点自动生成的片段节点
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
        break

      // 默认分支：处理 原生DOM元素/组件/Teleport/Suspense 等核心类型
      // 通过 shapeFlag 位运算快速判断具体类型，比多层if判断性能更高，Vue3核心性能优化点
      default:
        // 原生DOM元素类型：如 div/span/button 等普通HTML标签
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
          )
        }
        // 组件类型VNode：自定义组件/全局组件/异步组件等
        else if (shapeFlag & ShapeFlags.COMPONENT) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
          )
        }
        // Teleport瞬移组件类型：<Teleport to="body"> 对应的节点
        else if (shapeFlag & ShapeFlags.TELEPORT) {
          ;(type as typeof TeleportImpl).process(
            n1 as TeleportVNode,
            n2 as TeleportVNode,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals,
          )
        }
        // Suspense异步组件类型：<Suspense> 对应的节点（开启Suspense特性时生效）
        else if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
          ;(type as typeof SuspenseImpl).process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals,
          )
        }
        // 开发环境兜底警告：出现了无效的VNode类型
        else if (__DEV__) {
          warn('Invalid VNode type:', type, `(${typeof type})`)
        }
    }

    // set ref
    // ref是Vue的核心特性，用于获取真实DOM元素或组件实例，此处处理ref的更新逻辑
    // 情况1：新节点有ref属性 且 存在父组件 → 执行ref绑定/更新：解绑旧ref，绑定新ref
    if (ref != null && parentComponent) {
      setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2)
    } else if (ref == null && n1 && n1.ref != null) {
      setRef(n1.ref, null, parentSuspense, n1, true)
    }
  }

  /**
   * 处理【纯文本类型VNode】的初始化挂载与更新逻辑
   * 文本类型VNode的type固定为 Text，其children属性存储的就是文本内容本身（如 'hello vue3'）
   *  - 首次渲染: 创建文本节点并插入
   *  - 更新渲染: 获取文本节点，更新文本内容
   *
   * @param {VNode | null} n1 旧的文本虚拟节点，首次渲染时为null
   * @param {VNode} n2 新的文本虚拟节点，必传
   * @param {RendererElement} container 真实DOM父容器，文本节点要插入的容器
   * @param {RendererNode | null} anchor 锚点真实DOM节点，用于精准插入文本节点的位置，null则插入容器末尾
   */
  const processText: ProcessTextOrCommentFn = (n1, n2, container, anchor) => {
    // 首次渲染，无旧的文本VNode (n1 === null)
    if (n1 == null) {
      // 1. 创建真实的文本DOM节点：hostCreateText是平台无关的DOM操作API，入参就是文本内容(n2.children)
      // 2. 将创建好的真实文本节点赋值给n2.el，建立「虚拟节点」和「真实DOM」的映射关系
      // 3. 将真实文本节点插入到指定容器的锚点位置，完成文本节点的首次挂载
      hostInsert(
        (n2.el = hostCreateText(n2.children as string)),
        container,
        anchor,
      )
    }
    // 存在旧的文本VNode (n1 !== null)，执行更新逻辑
    else {
      // 核心优化：文本节点永远复用旧节点的真实DOM元素，避免重复创建/删除DOM，性能最优
      // n1存在则n1.el一定有值，所以用!强制非空断言
      const el = (n2.el = n1.el!)
      if (n2.children !== n1.children) {
        // We don't inherit el for cached text nodes in `traverseStaticChildren` 在`traverseStaticChildren`中，我们不会为缓存的文本节点继承el
        // to avoid retaining detached DOM nodes. However, the text node may be 以避免保留已分离的DOM节点。然而，文本节点可能
        // changed during HMR. In this case we need to replace the old text node 在HMR（热模块重新加载）过程中发生了变化。在这种情况下，我们需要替换旧的文本节点
        // with the new one. 用新的那个。

        // 【开发环境 + HMR热更新】的特殊兼容处理逻辑 - 生产环境不会走到这里
        if (
          __DEV__ && // 仅开发环境生效
          isHmrUpdating && // 当前处于热更新状态
          n2.patchFlag === PatchFlags.CACHED && // 新节点被标记为「缓存节点」
          '__elIndex' in n1 // 旧节点上存在elIndex（记录了节点在父容器中的索引位置）
        ) {
          // 获取容器的子节点集合（区分测试环境和生产环境的不同获取方式）
          const childNodes = __TEST__
            ? container.children
            : container.childNodes
          // 创建新的文本DOM节点，内容为新的文本值
          const newChild = hostCreateText(n2.children as string)
          // 复用旧节点的索引位置，赋值给新节点，保证插入位置不变
          const oldChild =
            childNodes[((n2 as any).__elIndex = (n1 as any).__elIndex)]
          // 把新文本节点插入到旧节点的位置
          hostInsert(newChild, container, oldChild)
          // 移除旧的文本节点，完成替换
          hostRemove(oldChild)
        } else {
          // 直接修改已有文本DOM节点的内容，无需创建/删除节点，极致高效
          // hostSetText 是平台无关的DOM操作API，作用：修改一个文本节点的内容
          hostSetText(el, n2.children as string)
        }
      }

      // 如果新旧文本内容一致(n2.children === n1.children)，则什么都不做，直接结束
    }
  }

  /**
   * 处理【注释类型VNode】的初始化挂载与更新逻辑
   * 注释类型VNode的type固定为 Comment，其children属性存储的是注释的文本内容
   * 类型同processText：ProcessTextOrCommentFn，入参规则和文本节点完全一致
   *  - 首次渲染: 直接创建注释节点并插入
   *  - 更新渲染: 不支持更新注释节点
   *
   * @param {VNode | null} n1 旧的注释虚拟节点，首次渲染时为 null
   * @param {VNode} n2 新的注释虚拟节点，必传（要渲染/更新的注释节点）
   * @param {RendererElement} container 真实DOM父容器，注释节点要插入的容器
   * @param {RendererNode | null} anchor 锚点真实DOM节点，控制注释节点插入的位置，null则插入容器末尾
   */
  const processCommentNode: ProcessTextOrCommentFn = (
    n1,
    n2,
    container,
    anchor,
  ) => {
    // 首次渲染，无旧注释节点
    if (n1 == null) {
      // 1. hostCreateComment：创建真实的浏览器注释DOM节点，入参是注释内容(n2.children)
      // 2. 兜底处理：(n2.children as string) || ''  防止注释内容为null/undefined，保证传入空字符串
      // 3. 把创建好的真实注释节点赋值给 n2.el ，建立「虚拟注释节点」和「真实注释DOM」的映射关系
      // 4. hostInsert：将真实注释节点插入到指定容器的锚点位置，完成注释节点的首次挂载
      hostInsert(
        (n2.el = hostCreateComment((n2.children as string) || '')),
        container,
        anchor,
      )
    }
    // 存在旧注释节点 (n1 !== null)，执行更新逻辑
    else {
      // 【Vue3 核心设计：注释节点 完全不支持动态更新！】
      // 不管新旧注释的内容是否发生变化，都不会做任何DOM内容更新操作  --> 也就是说, 注释内容变化, 不会触发更新, 除非重新渲染
      // 唯一做的事：复用旧注释节点的真实DOM元素，将旧节点的el赋值给新节点的el

      // there's no support for dynamic comments 没有对动态注释的支持
      n2.el = n1.el
    }
  }

  const mountStaticNode = (
    n2: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    namespace: ElementNamespace,
  ) => {
    // static nodes are only present when used with compiler-dom/runtime-dom
    // which guarantees presence of hostInsertStaticContent.
    ;[n2.el, n2.anchor] = hostInsertStaticContent!(
      n2.children as string,
      container,
      anchor,
      namespace,
      n2.el,
      n2.anchor,
    )
  }

  /**
   * Dev / HMR only
   */
  const patchStaticNode = (
    n1: VNode,
    n2: VNode,
    container: RendererElement,
    namespace: ElementNamespace,
  ) => {
    // static nodes are only patched during dev for HMR
    if (n2.children !== n1.children) {
      const anchor = hostNextSibling(n1.anchor!)
      // remove existing
      removeStaticNode(n1)
      // insert new
      ;[n2.el, n2.anchor] = hostInsertStaticContent!(
        n2.children as string,
        container,
        anchor,
        namespace,
      )
    } else {
      n2.el = n1.el
      n2.anchor = n1.anchor
    }
  }

  const moveStaticNode = (
    { el, anchor }: VNode,
    container: RendererElement,
    nextSibling: RendererNode | null,
  ) => {
    let next
    while (el && el !== anchor) {
      next = hostNextSibling(el)
      hostInsert(el, container, nextSibling)
      el = next
    }
    hostInsert(anchor!, container, nextSibling)
  }

  const removeStaticNode = ({ el, anchor }: VNode) => {
    let next
    while (el && el !== anchor) {
      next = hostNextSibling(el)
      hostRemove(el)
      el = next
    }
    hostRemove(anchor!)
  }

  /**
   * Vue3 核心函数 - 普通HTML元素类型VNode的专属处理入口 (元素渲染调度中心)
   * 核心职责：1. 处理SVG/MathML标签的命名空间赋值 2. 根据是否有旧节点，分发执行「首次挂载」或「更新」逻辑
   * 额外处理：兼容Vue自定义元素(CE)的patch生命周期钩子，保证自定义元素更新的正确性
   * 处理节点类型：div/p/span等原生HTML元素、svg/math特殊标签、Vue自定义元素(CE)
   *
   *
   * @param {VNode | null} n1 旧VNode节点；null = 首次渲染，非null = 更新渲染
   * @param {VNode} n2 新VNode节点 (本次要渲染的目标元素节点，必传)
   * @param {RendererElement} container 真实DOM父容器，节点最终挂载/更新到这个容器内
   * @param {RendererNode | null} anchor 锚点DOM节点，控制节点插入的位置（挂载时生效）
   * @param {ComponentInternalInstance | null} parentComponent 父组件内部实例，提供上下文(指令/插槽/依赖等)
   * @param {SuspenseBoundary | null} parentSuspense 父级Suspense实例，处理异步组件边界逻辑
   * @param {ElementNamespace} namespace DOM命名空间，初始值默认，会根据节点类型动态修正
   * @param {string[] | null} slotScopeIds SFC插槽样式隔离ID，用于<style :slotted>样式作用域隔离
   * @param {boolean} optimized 是否开启编译优化模式，透传给后续挂载/更新函数
   * @returns {void}
   */
  const processElement = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    namespace: ElementNamespace,
    slotScopeIds: string[] | null,
    optimized: boolean,
  ) => {
    // 原因：SVG/MathML标签有专属的XML命名空间，浏览器需要正确的命名空间才能解析其属性(如xlink:href)和子标签
    // 规则：匹配到对应标签，直接覆盖原始namespace值，后续挂载/更新时会透传该命名空间
    if (n2.type === 'svg') {
      namespace = 'svg'
    } else if (n2.type === 'math') {
      namespace = 'mathml'
    }

    // n1为null → 无旧节点，属于【首次渲染】
    if (n1 == null) {
      // 调用 mountElement 执行「全新元素挂载逻辑」：创建真实DOM、设置属性、挂载子节点、插入容器
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
      )
    }
    // n1不为null → 存在旧节点，属于【数据更新触发的重渲染】
    else {
      // 判断并获取当前节点是否为「Vue自定义元素(VueElement/CE)」 --> https://cn.vuejs.org/guide/extras/web-components.html#building-custom-elements-with-vue
      const customElement = !!(n1.el && (n1.el as VueElement)._isVueCE)
        ? (n1.el as VueElement)
        : null

      // 保证自定义元素的patch生命周期钩子成对执行，无论是否报错
      try {
        // 如果是Vue自定义元素，执行其内部的patch前置钩子：标记开始更新，做更新前准备
        if (customElement) {
          customElement._beginPatch()
        }

        // 核心执行：调用patchElement执行「元素节点更新逻辑」：对比新旧属性、更新样式/事件、更新子节点等
        patchElement(
          n1,
          n2,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
      } finally {
        // 无论patch过程是否报错，最终都要执行自定义元素的patch后置钩子：标记更新结束，做收尾清理
        if (customElement) {
          customElement._endPatch()
        }
      }
    }
  }

  /**
   * Vue3 核心底层函数 - 普通HTML原生元素的【首次完整挂载实现】
   * 完整职责：创建真实DOM节点 → 挂载子节点(文本/数组) → 触发指令created钩子 → 设置SFC样式隔离ID →
   *           批量绑定元素属性/事件 → 触发vnode挂载前置钩子 → 开发环境挂载调试标识 → 触发指令beforeMount钩子 →
   *           执行过渡入场前置钩子 → 插入真实DOM到页面容器 → 队列化执行挂载完成的后置钩子/过渡动画/指令挂载钩子
   * 核心特点：先挂载子节点，再设置父元素属性；核心DOM操作均为跨平台API封装；所有钩子/过渡均按生命周期顺序执行
   * 入参承接：完全承接processElement透传的入参，无额外新增参数
   *
   *
   * @param {VNode} vnode 本次要挂载的新VNode元素节点 (必传，无旧节点)
   * @param {RendererElement} container 真实DOM父容器，最终要把元素插入到这个容器内
   * @param {RendererNode | null} anchor 锚点DOM节点，控制元素插入到容器的指定位置（null则插入末尾）
   * @param {ComponentInternalInstance | null} parentComponent 父组件内部实例，提供上下文(指令/依赖/钩子执行)
   * @param {SuspenseBoundary | null} parentSuspense 父级Suspense实例，处理异步边界的钩子执行时机
   * @param {ElementNamespace} namespace DOM命名空间，svg/mathml/默认，用于创建带命名空间的元素
   * @param {string[] | null} slotScopeIds SFC插槽样式隔离ID，用于<style :slotted>的样式作用域隔离
   * @param {boolean} optimized 是否开启编译优化模式，透传给子节点的mountChildren使用
   * @returns {void}
   */
  const mountElement = (
    vnode: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    namespace: ElementNamespace,
    slotScopeIds: string[] | null,
    optimized: boolean,
  ) => {
    // 声明变量：el-当前元素的真实DOM节点；vnodeHook-VNode钩子函数的临时存储变量
    let el: RendererElement
    let vnodeHook: VNodeHook | undefined | null
    // 解构VNode的核心属性
    const { props, shapeFlag, transition, dirs } = vnode

    // 创建当前元素的【真实DOM节点】，并绑定到VNode的el属性上 (核心核心！)
    // vnode.el = 真实DOM，后续所有操作都基于这个真实DOM；el变量也指向该DOM，方便后续调用
    // hostCreateElement：跨平台DOM创建API，浏览器环境对应 document.createElementNS/.createElement
    el = vnode.el = hostCreateElement(
      vnode.type as string,
      namespace,
      props && props.is,
      props,
    )

    // mount children first, since some props may rely on child content 先安装children，因为某些道具可能依赖于子内容
    // being already rendered, e.g. `<select value>` 已经被渲染，例如 `<select value>`
    // 有些元素的props（如<select value>）依赖子节点渲染完成后再设置才生效，否则会出bug
    // 通过shapeFlag位运算判断子节点类型，精准分发处理逻辑，无冗余判断

    // 子节点是纯文本 → 直接设置元素的文本内容
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // hostSetElementText：跨平台API，浏览器环境对应 el.textContent = xxx
      hostSetElementText(el, vnode.children as string)
    }
    // 子节点是VNode数组 → 调用mountChildren批量递归挂载所有子节点
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 子节点会被挂载到当前元素el内部，el是子节点的父容器
      mountChildren(
        vnode.children as VNodeArrayChildren, // 子VNode数组
        el, // 子节点的父容器 = 当前元素的真实DOM
        null, // 子节点锚点：null → 插入到父容器末尾
        parentComponent, // 父组件实例透传
        parentSuspense, // 父Suspense实例透传
        resolveChildrenNamespace(vnode, namespace), // 解析子节点的命名空间（继承父元素）
        slotScopeIds, // 插槽样式隔离ID透传
        optimized, // 编译优化模式透传
      )
    }

    // 如果当前元素有指令(dirs) → 触发指令的【created】钩子
    // 指令生命周期：created → beforeMount → mounted → beforeUpdate → updated → unmounted
    // created时机：元素DOM创建完成，属性/子节点挂载完成，元素未插入页面时
    if (dirs) {
      // 触发指令的【created】钩子
      invokeDirectiveHook(vnode, null, parentComponent, 'created')
    }

    // scopeId
    // 设置【SFC样式隔离的scopeId】
    // 作用：给真实DOM添加data-v-xxx属性，配合<style scoped>实现组件样式隔离，不会污染其他组件
    // slotScopeIds：处理插槽内容的样式隔离，scopeId：处理组件自身元素的样式隔离
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent)

    // props
    // 处理当前元素的【props属性/事件绑定】
    if (props) {
      // 遍历所有props，批量绑定非保留属性/非value属性
      for (const key in props) {
        // 过滤：1. 先跳过value属性（单独特殊处理） 2. 跳过Vue的保留属性（key/ref/插槽等，内部已处理）
        if (key !== 'value' && !isReservedProp(key)) {
          // hostPatchProp：跨平台属性更新API，核心方法！
          // 功能：绑定原生属性(如id/class)、DOM事件(如onClick)、自定义属性等，null表示无旧值（首次挂载）
          hostPatchProp(el, key, null, props[key], namespace, parentComponent)
        }
      }
      /**
       * Special case for setting value on DOM elements: 在DOM元素上设置值的特殊情况
       * - it can be order-sensitive (e.g. should be set *after* min/max, #2325, #4024) 它可能是顺序敏感的（例如，应在最小值/最大值之后设置，#2325，#4024）
       * - it needs to be forced (#1471) 它需要被强制执行 (#1471)
       * #2353 proposes adding another renderer option to configure this, but #2353 提议增加另一个渲染器选项来配置这一点，但
       * the properties affects are so finite it is worth special casing it 这些属性的影响是如此有限，值得对其进行特殊处理
       * here to reduce the complexity. (Special casing it also should not 这里是为了降低复杂性。（特殊情况下，它也不应该
       * affect non-DOM renderers) 影响非DOM渲染器）
       */
      /**
       * 1. 顺序敏感：某些表单元素的value需要在min/max等属性之后设置才生效（如<input type="number">）
       * 2. 强制赋值：需要强制覆盖原生的默认值，避免原生表单元素的value绑定失效
       * 3. 影响范围小：仅对value属性特殊处理，不会增加复杂度，也不影响非DOM渲染器
       */
      if ('value' in props) {
        hostPatchProp(el, 'value', null, props.value, namespace)
      }

      // 触发VNode的【onVnodeBeforeMount】钩子
      // VNode生命周期钩子：挂载前执行，此时元素DOM已创建、属性已绑定、未插入页面
      if ((vnodeHook = props.onVnodeBeforeMount)) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode)
      }
    }

    // 【开发环境/调试模式专属】挂载调试标识
    // 生产环境会被tree-shaking移除，无性能损耗
    // 作用：给真实DOM挂载__vnode和__vueParentComponent属性，方便Vue Devtools调试、定位组件和VNode关联关系
    if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
      def(el, '__vnode', vnode, true)
      def(el, '__vueParentComponent', parentComponent, true)
    }

    // 步骤8：如果有指令 → 触发指令的【beforeMount】钩子
    // 时机：元素DOM就绪、属性绑定完成、即将插入页面时
    if (dirs) {
      // 触发指令的【beforeMount】钩子
      invokeDirectiveHook(vnode, null, parentComponent, 'beforeMount')
    }

    // #1583 For inside suspense + suspense not resolved case, enter hook should call when suspense resolved 对于内部挂起+未解决挂起的情况，挂起解决后应调用进入钩子
    // #1689 For inside suspense + suspense resolved case, just call it 对于内部悬念+悬念已解的案例，只需这样称呼它
    // needTransition：判断是否需要执行过渡钩子（有transition配置 + Suspense异步边界已就绪）
    const needCallTransitionHooks = needTransition(parentSuspense, transition)
    if (needCallTransitionHooks) {
      transition!.beforeEnter(el) // 过渡入场前的钩子，比如设置元素初始样式(透明度0)
    }

    // 【核心DOM操作】将真实DOM节点插入到页面的父容器中
    // hostInsert：跨平台插入API，浏览器环境对应 container.insertBefore(el, anchor)
    // 执行完这一步 → 元素才真正出现在页面上！！！前面所有步骤都是在内存中操作DOM，无页面重绘回流
    hostInsert(el, container, anchor)

    // 队列化执行【挂载完成的所有后置钩子/动画】
    // 触发条件：有VNode的mounted钩子 或 需要执行过渡动画 或 有指令 → 进入队列
    if (
      (vnodeHook = props && props.onVnodeMounted) ||
      needCallTransitionHooks ||
      dirs
    ) {
      // queuePostRenderEffect：Vue3的核心异步队列API，【DOM插入页面后异步执行】
      // 核心价值：1. 避免同步执行导致的多次页面重绘回流，提升性能 2. 保证钩子执行时机是「元素已在页面上」
      queuePostRenderEffect(() => {
        // 1. 触发VNode的【onVnodeMounted】钩子 → 挂载完成，元素已在页面
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode)
        // 2. 执行过渡动画的【enter】钩子 → 入场动画，比如从透明度0到1
        needCallTransitionHooks && transition!.enter(el)
        // 3. 触发指令的【mounted】钩子 → 指令生命周期的最后一步，元素已挂载完成
        dirs && invokeDirectiveHook(vnode, null, parentComponent, 'mounted')
      }, parentSuspense)
    }
  }

  /**
   * Vue3 核心底层函数 - SFC <style scoped> 样式隔离的【唯一实现】
   * 核心职责：给元素的真实DOM节点添加对应的 scopeId 标识(data-v-xxx属性)，实现样式私有化；
   * 完整处理逻辑：
   *  1. 给DOM添加当前组件自身的scopeId
   *  2. 给DOM添加插槽内容的所有slotScopeIds  --> 使用 :slotted() 选择器 - https://cn.vuejs.org/api/sfc-css-features.html#slotted-selectors
   *  3. 递归继承父组件的所有scopeId
   * 样式隔离原理：编译器会把<style scoped>内的样式选择器，自动拼接[data-v-xxx]属性选择器，DOM上有对应属性才会匹配样式，实现隔离
   * 入参承接：入参均从mountElement透传而来，包含真实DOM、当前VNode、各类隔离ID、父组件实例
   *
   * @param {RendererElement} el 当前元素的真实DOM节点，需要给它添加scopeId属性
   * @param {VNode} vnode 当前元素对应的VNode虚拟节点，存储自身的scopeId/slotScopeIds
   * @param {string | null} scopeId 当前组件自身的样式隔离ID，格式如 "data-v-7ba5bd90"，null则无
   * @param {string[] | null} slotScopeIds 插槽内容的样式隔离ID数组，处理<style :slotted>的插槽样式隔离，null则无
   * @param {ComponentInternalInstance | null} parentComponent 父组件的内部实例，用于递归继承父组件的scopeId，null则无父组件
   * @returns {void}
   */
  const setScopeId = (
    el: RendererElement,
    vnode: VNode,
    scopeId: string | null,
    slotScopeIds: string[] | null,
    parentComponent: ComponentInternalInstance | null,
  ) => {
    // 处理【当前组件自身的样式隔离ID - scopeId】
    // 如果当前组件有自身的scopeId（写了<style scoped>就会生成）
    if (scopeId) {
      // 核心操作：给真实DOM节点，添加对应的scopeId属性（如 data-v-7ba5bd90）
      // hostSetScopeId：跨平台DOM操作API，浏览器环境等价于 el.setAttribute(scopeId, '')
      hostSetScopeId(el, scopeId)
    }

    // 处理【插槽内容的样式隔离ID数组 - slotScopeIds】
    // 如果有插槽样式隔离ID（写了<style :slotted>就会生成该数组）
    if (slotScopeIds) {
      // 遍历所有插槽隔离ID，逐个添加到当前DOM节点上
      // 原因：插槽内容是父组件传递的，需要匹配父组件的插槽样式隔离规则，实现插槽样式私有化
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i])
      }
    }

    // 【递归核心逻辑】继承【父组件】的所有样式隔离ID (最关键的兜底逻辑)
    // 触发条件：当前元素有父组件实例 → 存在组件嵌套关系，需要递归继承父组件的scopeId
    if (parentComponent) {
      // 第一步：获取父组件渲染的「根VNode子树」
      let subTree = parentComponent.subTree

      // 【仅开发环境生效】兼容父组件根节点是「开发环境根Fragment」的特殊场景
      // 过滤逻辑：如果父组件根节点是带DEV_ROOT_FRAGMENT标记的Fragment，提取其真实的单根节点
      if (
        __DEV__ &&
        subTree.patchFlag > 0 &&
        subTree.patchFlag & PatchFlags.DEV_ROOT_FRAGMENT
      ) {
        subTree =
          filterSingleRoot(subTree.children as VNodeArrayChildren) || subTree
      }

      // 核心判断：当前VNode是否是「父组件的根节点」 或 「父组件Suspense的内容/兜底节点」
      // 满足该条件 → 当前元素需要继承父组件的scopeId，保证嵌套组件的样式隔离链完整
      if (
        vnode === subTree ||
        (isSuspense(subTree.type) &&
          (subTree.ssContent === vnode || subTree.ssFallback === vnode))
      ) {
        // 递归调用自身！把父组件的scopeId/slotScopeIds，添加到当前DOM节点上
        // 入参替换为：父组件的VNode、父组件的隔离ID、父组件的父实例 → 逐层向上继承，直到根组件
        const parentVNode = parentComponent.vnode
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent,
        )
      }
    }
  }

  /**
   * 批量挂载子VNode节点，仅负责【首次渲染】，无更新/diff逻辑
   *  - 核心逻辑：遍历子节点数组，对每一个子节点执行 空旧节点+新节点 的patch，完成全新挂载
   *  - 调用时机：在 processFragment 首次渲染、processElement 元素首次渲染、组件首次渲染等场景中，当需要挂载一组子节点（VNode 数组） 时，都会调用该方法。
   *
   * @param {VNodeArrayChildren} children 待挂载的子VNode数组，需要被批量处理的所有子节点
   * @param {RendererElement} container 真实DOM父容器，所有子节点最终挂载到这个容器内
   * @param {RendererNode | null} anchor 锚点真实DOM节点，控制子节点插入的位置；插入规则：所有子节点插入到该锚点【前面】
   * @param {ComponentInternalInstance | null} parentComponent 父组件内部实例，提供组件上下文（指令、插槽、依赖等）
   * @param {SuspenseBoundary | null} parentSuspense 父级Suspense组件实例，处理异步组件挂载的边界逻辑
   * @param {ElementNamespace} namespace DOM命名空间，处理svg/math等特殊标签的属性命名空间，保证浏览器正确解析
   * @param {string[] | null} slotScopeIds SFC插槽样式隔离ID，用于<style :slotted>的样式作用域隔离
   * @param {boolean} optimized 是否开启编译优化模式，编译器生成的节点会开启，手写render函数默认关闭
   * @param {number} start 遍历的起始索引，默认值为0；用于分片挂载/部分挂载，从指定下标开始处理子节点
   * @returns {void}
   */
  const mountChildren: MountChildrenFn = (
    children,
    container,
    anchor,
    parentComponent,
    parentSuspense,
    namespace: ElementNamespace,
    slotScopeIds,
    optimized,
    start = 0,
  ) => {
    // 核心循环：从起始索引start开始，遍历所有待挂载的子VNode节点
    for (let i = start; i < children.length; i++) {
      // 核心处理：标准化/克隆子节点，保证当前子节点是【合法可挂载的VNode对象】
      // 三元分支：根据是否开启优化模式，执行不同的节点处理逻辑，处理后重新赋值给原数组的当前项
      const child = (children[i] = optimized
        ? // 优化模式下：复用已挂载的节点，克隆一份新的VNode（避免同一个VNode被多次挂载导致DOM重复）
          cloneIfMounted(children[i] as VNode)
        : // 非优化模式下：标准化VNode，把非标准节点(字符串/数字/布尔值等)转为标准VNode
          normalizeVNode(children[i]))

      // 核心执行：调用patch函数，对当前子节点执行【首次挂载】
      // 关键点：第一个参数传null → 代表「无旧节点n1」，patch内部会走全新挂载逻辑，不走diff更新
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
      )
    }
  }

  /**
   * Vue3 Diff算法核心函数 - 「相同类型元素VNode」的增量更新主入口，DOM复用+最小更新的终极实现
   * 核心职责：复用新旧VNode对应的真实DOM元素(el)，仅对「有变化的内容」做精准增量更新，不销毁/重建DOM；
   * 核心逻辑：
   *   - DOM复用
   *   - 钩子/指令前置执行
   *   - 子节点增量更新
   *       - patchBlockChildren 块更新：✅性能天花板 → 编译器只收集「动态子节点」，更新时只遍历动态子节点、完全跳过静态子节点
   *       - patchChildren 全量 Diff：✅兜底兼容 → 无优化标记时，对所有子节点做「增 / 删 / 改 / 移」的全量对比，遵循 Vue3 的 Diff 算法规则
   *   - 属性增量更新
   *       - 精准标记的单个属性更新：有CLASS/STYLE/PROPS标记时，只更新对应的单个属性，比如只有 class 动态变化，就只调用hostPatchProp更新 class，其他属性完全不处理，性能极致；
   *       - 全量属性更新：有FULL_PROPS标记时，调用patchProps全量对比新旧 props，适配动态属性名的场景
   *       - 无标记兜底更新：无任何优化标记时，调用patchProps全量更新，保证正确性。
   *   - 文本内容更新
   *   - 钩子/指令后置异步执行；
   * 核心优化：编译优化标记(patchFlag/dynamicChildren)优先，走快速更新路径；无优化则走全量Diff兜底，兼顾性能与兼容；
   * 入参说明：Vue3 patch阶段的标准入参，涵盖元素更新所需的所有上下文信息
   *
   *
   * @param {VNode} n1 旧的元素VNode节点，包含旧的props/children/patchFlag/真实DOM(el)等信息
   * @param {VNode} n2 新的元素VNode节点，包含新的props/children/patchFlag/待更新的内容等信息
   * @param {ComponentInternalInstance|null} parentComponent 父组件实例，用于钩子执行/指令处理/依赖收集
   * @param {SuspenseBoundary|null} parentSuspense 父级Suspense边界，用于异步渲染的副作用队列调度
   * @param {ElementNamespace} namespace 元素命名空间，如HTML/SVG，传给patchProp做属性兼容处理
   * @param {string[]|null} slotScopeIds 插槽的作用域ID，用于样式隔离(如scoped样式)
   * @param {boolean} optimized 是否为编译器优化后的VNode，true=走优化路径，false=走全量Diff
   * @returns {void} 无返回值，所有操作均为对真实DOM的增量更新副作用
   */
  const patchElement = (
    n1: VNode,
    n2: VNode,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    namespace: ElementNamespace,
    slotScopeIds: string[] | null,
    optimized: boolean,
  ) => {
    // ========== 第一步：核心DOM复用 - 最重要的初始化逻辑 ==========
    // 复用旧VNode的真实DOM元素，赋值给新VNode的el属性 → 核心！不销毁、不重建，只复用DOM
    const el = (n2.el = n1.el!)
    // 开发环境/生产调试工具：给真实DOM挂载当前新VNode的引用，用于调试/DEVTOOLS解析
    if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
      el.__vnode = n2
    }

    // ========== 第二步：解构编译优化标记 & 初始化变量 ==========
    // 解构新VNode的编译优化标记：动态子节点、patchFlag二进制标记、自定义指令数组
    let { patchFlag, dynamicChildren, dirs } = n2
    // #1426 take the old vnode's patch flag into account since user may clone a 考虑到用户可能会克隆一个对象，因此需要将旧虚拟节点（vnode）的补丁标志纳入考虑
    // compiler-generated vnode, which de-opts to FULL_PROPS 编译器生成的虚拟节点（vnode），该节点取消了选择FULL_PROPS

    // 处理逻辑：将旧VNode的「全量属性标记(FULL_PROPS)」合并到新标记中，避免优化失效，强制走全量属性更新
    patchFlag |= n1.patchFlag & PatchFlags.FULL_PROPS
    // 解构新旧props，兜底为空对象常量，避免访问undefined报错
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ
    let vnodeHook: VNodeHook | undefined | null // 声明VNode钩子函数变量，用于后续钩子执行

    // ========== 第三步：执行【前置钩子/指令】- 更新前的回调逻辑 ==========
    // disable recurse in beforeUpdate hooks 在 beforeUpdate 挂钩中禁用递归

    // 临时关闭父组件的递归更新标记：避免beforeUpdate钩子中触发的数据更新，导致无限递归更新
    // 执行VNode的beforeUpdate钩子：<div v-on:vnode-before-update="handle">
    parentComponent && toggleRecurse(parentComponent, false)
    if ((vnodeHook = newProps.onVnodeBeforeUpdate)) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1)
    }
    // 执行自定义指令的 beforeUpdate 钩子：指令的更新前回调
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, 'beforeUpdate')
    }
    // 恢复父组件的递归更新标记，完成钩子执行
    parentComponent && toggleRecurse(parentComponent, true)

    // ========== 第四步：HMR热更新兼容处理 - 开发环境专属 ==========
    // 如果是HMR模块热更新触发的更新，强制关闭所有编译优化，走「全量Diff」
    // 原因：HMR更新后，编译优化标记可能失效，全量Diff能保证更新的正确性
    if (__DEV__ && isHmrUpdating) {
      // HMR updated, force full diff
      patchFlag = 0
      optimized = false
      dynamicChildren = null
    }

    // ========== 第五步：innerHTML/textContent 空值前置清空 - 临界兼容处理 ==========
    // #9135 innerHTML / textContent unset needs to happen before possible 在可能之前，需要先取消设置 innerHTML / textContent
    // new children mount 新增 children mount
    // 当旧props有innerHTML/textContent、新props为空时，需要「提前清空文本内容」
    // 执行时机：必须在子节点更新之前执行，避免清空操作覆盖后续挂载的子节点，导致子节点丢失
    if (
      (oldProps.innerHTML && newProps.innerHTML == null) ||
      (oldProps.textContent && newProps.textContent == null)
    ) {
      hostSetElementText(el, '') // 调用宿主环境API，清空元素的文本内容
    }

    // ========== 第六步：【核心子节点增量更新】- 优先级最高，分两种更新策略 ==========
    // 策略1：有编译优化的dynamicChildren → 走「块更新极速路径」patchBlockChildren ✅性能最优
    // 适用场景：编译器能精准收集到所有动态子节点，静态子节点完全跳过，只更新变化的动态子节点
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren!,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace), // 解析子节点的命名空间(SVG/HTML)
        slotScopeIds,
      )
      // 开发环境：遍历静态子节点，保证HMR热更新的正确性
      if (__DEV__) {
        // necessary for HMR
        traverseStaticChildren(n1, n2)
      }
    }
    // 策略2：无编译优化标记 → 走「全量子节点Diff路径」patchChildren ✅兜底兼容
    // 适用场景：无dynamicChildren、optimized=false，对所有子节点做全量的Diff对比，增/删/改/移，保证更新正确
    else if (!optimized) {
      // full diff
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false,
      )
    }

    // ========== 第七步：【核心元素属性增量更新】- 编译优化优先，最小化更新，Vue3核心性能点 ==========
    // patchFlag>0 说明：编译器给当前元素打了「动态内容标记」，有可更新的动态内容，走「快速更新路径」
    // 核心优势：编译器保证「新旧VNode的结构完全一致」，无需全量遍历，只更新标记的动态部分，无冗余判断
    if (patchFlag > 0) {
      // the presence of a patchFlag means this element's render code was 存在一个补丁标志（patchFlag）意味着该元素的渲染代码已经
      // generated by the compiler and can take the fast path. 由编译器生成，并且可以走快速通道
      // in this path old node and new node are guaranteed to have the same shape 在这条路径中，旧节点和新节点保证具有相同的形状
      // (i.e. at the exact same position in the source template) （即，在源模板中的完全相同位置）

      // 分支1：包含全量属性标记 → 走全量属性更新patchProps
      // 触发场景：元素有「动态属性名」(如 :[key]="value")，无法精准标记单个属性，只能全量对比props
      if (patchFlag & PatchFlags.FULL_PROPS) {
        // element props contain dynamic keys, full diff needed 元素属性包含动态键，需要进行完全差异比较
        patchProps(el, oldProps, newProps, parentComponent, namespace)
      }
      // 分支2：精准的动态属性标记 → 走「单个属性按需更新」，性能极致 ✅核心优化
      else {
        // class
        // this flag is matched when the element has dynamic class bindings. 当元素具有动态类绑定时，此标志会被匹配

        // 子分支1：有动态class标记 → 只更新class属性
        if (patchFlag & PatchFlags.CLASS) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, 'class', null, newProps.class, namespace)
          }
        }

        // style
        // this flag is matched when the element has dynamic style bindings 当元素具有动态样式绑定时，此标志与之匹配

        // 子分支2：有动态style标记 → 只更新style属性
        if (patchFlag & PatchFlags.STYLE) {
          hostPatchProp(el, 'style', oldProps.style, newProps.style, namespace)
        }

        // props
        // This flag is matched when the element has dynamic prop/attr bindings 当元素具有动态属性绑定时，此标志会被匹配
        // other than class and style. The keys of dynamic prop/attrs are saved for 除了类和样式之外。动态属性/特性的键被保存下来
        // faster iteration. 更快的迭代
        // Note dynamic keys like :[foo]="bar" will cause this optimization to 注意，像 :[foo]=“bar” 这样的动态键将导致此优化
        // bail out and go through a full diff because we need to unset the old key 退出并执行完整的差异比较，因为我们需要取消旧键的设置

        // 子分支3：有动态普通属性标记 → 只更新标记的动态属性
        if (patchFlag & PatchFlags.PROPS) {
          // if the flag is present then dynamicProps must be non-null 如果存在该标志，则dynamicProps必须为非空
          const propsToUpdate = n2.dynamicProps! // // 编译器已收集好所有动态属性名，存入dynamicProps数组，直接遍历即可
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i]
            const prev = oldProps[key]
            const next = newProps[key]
            // #1471 force patch value 强制补丁值

            // 强制更新value属性 + 新旧值不同时更新
            // 原因：表单元素的value可能存在「视图与模型不一致」的情况，强制更新保证正确性
            if (next !== prev || key === 'value') {
              hostPatchProp(el, key, prev, next, namespace, parentComponent)
            }
          }
        }
      }

      // text
      // This flag is matched when the element has only dynamic text children. 当元素仅包含动态文本子元素时，此标志即匹配

      // 子分支4：有动态文本标记 → 只更新元素的文本内容
      // 触发场景：元素只有动态文本子节点(如 <div>{{msg}}</div>)，直接更新文本，无需处理子节点
      if (patchFlag & PatchFlags.TEXT) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children as string)
        }
      }
    }
    // 兜底逻辑：无patchFlag + 无优化 → 走全量属性更新patchProps
    // 适用场景：无任何编译优化标记，全量对比新旧props，保证属性更新的正确性
    else if (!optimized && dynamicChildren == null) {
      // unoptimized, full diff 未优化，完整差异
      patchProps(el, oldProps, newProps, parentComponent, namespace)
    }

    // ========== 第八步：执行【后置异步钩子/指令】- 更新完成后的回调逻辑 ==========
    // 核心设计：后置钩子(updated)、指令updated钩子 全部放入「异步后置渲染队列」
    // 原因：保证钩子执行时，DOM已经完成所有更新，能获取到最新的DOM状态；异步执行不阻塞主线程，提升性能
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        // 执行VNode的updated钩子
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1)
        // 执行自定义指令的updated钩子
        dirs && invokeDirectiveHook(n2, n1, parentComponent, 'updated')
      }, parentSuspense)
    }
  }

  // The fast path for blocks. 块的快速路径
  /**
   * Vue3 编译优化核心 - 块级子节点高性能批量更新方法 (仅稳定Fragment触发)
   * 核心设计：专为「节点顺序永不改变」的稳定结构设计，放弃全量diff，采用【同下标一对一精准patch】
   * 核心优势：无key对比、无节点移动/增删逻辑、无父容器遍历，彻底规避传统diff的性能损耗，更新效率极致
   * 核心约束：新旧子节点数组长度必须一致、节点顺序完全不变、仅包含编译期标记的「动态子节点」
   * 调用场景：processFragment 更新阶段，满足稳定Fragment+动态子节点匹配的分支
   *
   *
   * @param {VNode[]} oldChildren 旧的动态子节点VNode数组 (编译期提取，仅含动态节点)
   * @param {VNode[]} newChildren 新的动态子节点VNode数组 (编译期提取，仅含动态节点，长度与旧数组一致)
   * @param {RendererElement} fallbackContainer 兜底的父容器DOM节点，用于无需动态获取容器的场景，避免DOM查询开销
   * @param {ComponentInternalInstance | null} parentComponent 父组件内部实例，提供上下文(指令/事件等)
   * @param {SuspenseBoundary | null} parentSuspense 父级Suspense实例，处理异步组件更新边界逻辑
   * @param {ElementNamespace} namespace DOM命名空间，处理svg/math等特殊标签的属性命名空间
   * @param {string[] | null} slotScopeIds SFC插槽样式隔离ID，用于<style :slotted>样式作用域隔离
   * @returns {void}
   */
  const patchBlockChildren: PatchBlockChildrenFn = (
    oldChildren,
    newChildren,
    fallbackContainer,
    parentComponent,
    parentSuspense,
    namespace: ElementNamespace,
    slotScopeIds,
  ) => {
    // 同下标遍历新旧动态子节点数组 (块级更新的灵魂)
    // 前提：编译器保证 newChildren.length === oldChildren.length，无需判断长度
    // 逻辑：因为是稳定Fragment，子节点顺序永不改变 → 直接按数组下标 旧节点 ↔ 新节点 一对一更新
    // 无key对比、无节点移动、无增删 → 这是Vue3最高性能的更新方式
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i] // 当前下标旧的动态子节点
      const newVNode = newChildren[i] // 当前下标新的动态子节点

      // Determine the container (parent element) for the patch. 确定补丁的容器（父元素）。
      // 核心目的：精准获取当前节点的真实挂载父容器，保证patch更新时DOM操作的正确性；
      // 兜底设计：能复用计算结果就复用，能避免DOM查询就避免，兼顾「正确性」与「性能」
      const container =
        // oldVNode may be an errored async setup() component inside Suspense oldVNode可能是Suspense内部的一个发生错误的异步setup()组件
        // which will not have a mounted element 它不会有安装的 element
        oldVNode.el &&
        // - In the case of a Fragment, we need to provide the actual parent 在Fragment的情况下，我们需要提供实际的父级
        // of the Fragment itself so it can move its children. 获取Fragment本身的引用，以便它可以移动其子节点
        (oldVNode.type === Fragment ||
          // - In the case of different nodes, there is going to be a replacement 在不同节点的情况下，将会进行替换
          // which also requires the correct parent container 这也需要正确的父容器
          !isSameVNodeType(oldVNode, newVNode) ||
          // - In the case of a component, it could contain anything. 就组件而言，它可以包含任何内容
          oldVNode.shapeFlag &
            (ShapeFlags.COMPONENT | ShapeFlags.TELEPORT | ShapeFlags.SUSPENSE))
          ? hostParentNode(oldVNode.el)!
          : // In other cases, the parent container is not actually used so we 在其他情况下，父容器实际上并未被使用，因此我们
            // just pass the block element here to avoid a DOM parentNode call. 只需在此处传递块级元素，以避免进行DOM的parentNode调用
            fallbackContainer

      // 调用patch函数，执行【同下标新旧节点的精准更新】
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true,
      )
    }
  }

  const patchProps = (
    el: RendererElement,
    oldProps: Data,
    newProps: Data,
    parentComponent: ComponentInternalInstance | null,
    namespace: ElementNamespace,
  ) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              namespace,
              parentComponent,
            )
          }
        }
      }
      for (const key in newProps) {
        // empty string is not valid prop
        if (isReservedProp(key)) continue
        const next = newProps[key]
        const prev = oldProps[key]
        // defer patching value
        if (next !== prev && key !== 'value') {
          hostPatchProp(el, key, prev, next, namespace, parentComponent)
        }
      }
      if ('value' in newProps) {
        hostPatchProp(el, 'value', oldProps.value, newProps.value, namespace)
      }
    }
  }

  /**
   * 处理【Fragment(片段)类型VNode】的初始化挂载与更新逻辑
   *  - Fragment核心特性：无真实DOM节点，仅作为虚拟容器包裹子节点，渲染后不生成任何冗余DOM
   *  - Fragment的children固定为VNode数组，不会是文本/单个节点
   *
   *  - 首次渲染:
   *      -- 建立两个锚点文本节点，作为 Fragment 的锚点, Fragment 的所有子节点插入到「起始锚点」和「结束锚点」之间
   *      -- 借用 mountChildren 方法直接渲染子节点
   *  - 更新渲染:
   *      -- 根据标记不同, 策略不同:
   *          --- 如果是 「节点顺序永不改变」的稳定结构设计, 则调用 patchBlockChildren 方法精准更新
   *          --- 否则, 调用 patchChildren 方法进行更新
   *
   * @param {VNode | null} n1 旧的Fragment虚拟节点，首次渲染为null
   * @param {VNode} n2 新的Fragment虚拟节点，本次要渲染/更新的核心节点
   * @param {RendererElement} container 真实DOM父容器，Fragment的子节点最终挂载到该容器
   * @param {RendererNode | null} anchor 锚点真实DOM节点，控制Fragment子节点的插入位置
   * @param {ComponentInternalInstance | null} parentComponent 父组件内部实例
   * @param {SuspenseBoundary | null} parentSuspense 父级Suspense组件实例
   * @param {ElementNamespace} namespace DOM命名空间，处理svg/math等特殊标签
   * @param {string[] | null} slotScopeIds SFC插槽样式隔离ID，用于<style :slotted>
   * @param {boolean} optimized 是否开启编译优化模式
   */
  const processFragment = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    namespace: ElementNamespace,
    slotScopeIds: string[] | null,
    optimized: boolean,
  ) => {
    // 创建/复用 Fragment 的「首尾锚点空文本节点」【Fragment的灵魂设计】
    // Fragment 本身无真实 el，Vue 用「两个空文本节点」作为 Fragment 的起止锚点：startAnchor + endAnchor
    // 作用：标记Fragment所有子节点的「范围」，方便后续批量更新/删除子节点，无需遍历整个父容器
    // 复用逻辑：有旧节点则复用旧锚点，无则创建新的空文本节点（文本内容为空字符串）
    const fragmentStartAnchor = (n2.el = n1 ? n1.el : hostCreateText(''))!
    const fragmentEndAnchor = (n2.anchor = n1 ? n1.anchor : hostCreateText(''))!

    // 解构新Fragment的核心优化标记，用于后续判断更新策略
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2

    // 开发环境兼容处理：HMR热更新 / 根节点Fragment 强制关闭优化
    if (
      __DEV__ &&
      // #5523 dev root fragment may inherit directives
      (isHmrUpdating || patchFlag & PatchFlags.DEV_ROOT_FRAGMENT)
    ) {
      // HMR更新/开发环境根Fragment，强制走全量diff，避免优化逻辑导致的更新异常
      // HMR updated / Dev root fragment (w/ comments), force full diff HMR 更新/开发根片段（带注释），强制完整 diff
      patchFlag = 0
      optimized = false
      dynamicChildren = null
    }

    // 插槽样式隔离：合并插槽作用域ID
    // 如果当前Fragment是插槽片段，且有专属的slotScopeIds，合并到父级的slotScopeIds中
    // 作用：保证SFC的<style :slotted>样式能正确作用到插槽内的节点，样式隔离生效
    // check if this is a slot fragment with :slotted scope ids 使用 :slotted 作用域ID 来检查这是否是一个插槽片段
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds
        ? slotScopeIds.concat(fragmentSlotScopeIds)
        : fragmentSlotScopeIds
    }

    // 首次渲染 Fragment
    if (n1 == null) {
      // 1. 先把「首尾锚点文本节点」插入到父容器的指定位置
      // 插入后：容器中就有了两个相邻的空文本节点，作为Fragment子节点的占位边界
      hostInsert(fragmentStartAnchor, container, anchor)
      hostInsert(fragmentEndAnchor, container, anchor)
      // a fragment can only have array children 一个片段只能有数组类型的子项
      // since they are either generated by the compiler, or implicitly created 因为它们要么是由编译器生成的，要么是隐式创建的
      // from arrays. 来自数组。

      // 2. 批量挂载 Fragment 的所有子节点
      // 核心规则：Fragment 的 children 一定是 VNode 数组，无 children 则兜底为空数组
      // 挂载规则：所有子节点插入到「起始锚点」和「结束锚点」之间，锚点传 fragmentEndAnchor 即可实现
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into  像`<></>`这样的片段将被编译成
        // a fragment which doesn't have a children. 一个没有子节点的片段。
        // In this case fallback to an empty array 在这种情况下，退而求其次，使用一个空数组
        (n2.children || []) as VNodeArrayChildren,
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
      )
    }
    // 更新阶段 Fragment
    else {
      // 更新阶段分「高性能块级更新」和「全量diff更新」两种策略，根据标记自动选择
      if (
        patchFlag > 0 &&
        patchFlag & PatchFlags.STABLE_FRAGMENT &&
        dynamicChildren &&
        // #2715 the previous fragment could've been a BAILed one as a result 因此，之前的片段本可以是一个保释片段
        // of renderSlot() with no valid children 在没有有效子元素的情况下调用 renderSlot()
        n1.dynamicChildren &&
        n1.dynamicChildren.length === dynamicChildren.length
      ) {
        // a stable fragment (template root or <template v-for>) doesn't need to 一个稳定的片段（模板根或<template v-for>）不需要
        // patch children order, but it may contain dynamicChildren. 补丁子级顺序，但它可能包含动态子级。
        // ✅ 最优更新策略：稳定Fragment的「块级子节点精准更新」 (高性能)
        // 稳定Fragment：指编译期确定的、子节点顺序永远不变的Fragment（如模板根节点/<template v-for>）
        // 特点：无需对比子节点顺序/结构，只需要更新「标记的动态子节点」即可，diff开销极小
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
        )
        if (__DEV__) {
          // necessary for HMR
          traverseStaticChildren(n1, n2)
        } else if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null ||
          (parentComponent && n2 === parentComponent.subTree)
        ) {
          traverseStaticChildren(n1, n2, true /* shallow */)
        }
      } else {
        // keyed / unkeyed, or manual fragments.
        // for keyed & unkeyed, since they are compiler generated from v-for,
        // each child is guaranteed to be a block so the fragment will never
        // have dynamicChildren.
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
      }
    }
  }

  const processComponent = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    namespace: ElementNamespace,
    slotScopeIds: string[] | null,
    optimized: boolean,
  ) => {
    n2.slotScopeIds = slotScopeIds
    if (n1 == null) {
      if (n2.shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
        ;(parentComponent!.ctx as KeepAliveContext).activate(
          n2,
          container,
          anchor,
          namespace,
          optimized,
        )
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized,
        )
      }
    } else {
      updateComponent(n1, n2, optimized)
    }
  }

  const mountComponent: MountComponentFn = (
    initialVNode,
    container,
    anchor,
    parentComponent,
    parentSuspense,
    namespace: ElementNamespace,
    optimized,
  ) => {
    // 2.x compat may pre-create the component instance before actually
    // mounting
    const compatMountInstance =
      __COMPAT__ && initialVNode.isCompatRoot && initialVNode.component
    const instance: ComponentInternalInstance =
      compatMountInstance ||
      (initialVNode.component = createComponentInstance(
        initialVNode,
        parentComponent,
        parentSuspense,
      ))

    if (__DEV__ && instance.type.__hmrId) {
      registerHMR(instance)
    }

    if (__DEV__) {
      pushWarningContext(initialVNode)
      startMeasure(instance, `mount`)
    }

    // inject renderer internals for keepAlive
    if (isKeepAlive(initialVNode)) {
      ;(instance.ctx as KeepAliveContext).renderer = internals
    }

    // resolve props and slots for setup context
    if (!(__COMPAT__ && compatMountInstance)) {
      if (__DEV__) {
        startMeasure(instance, `init`)
      }
      setupComponent(instance, false, optimized)
      if (__DEV__) {
        endMeasure(instance, `init`)
      }
    }

    // avoid hydration for hmr updating
    if (__DEV__ && isHmrUpdating) initialVNode.el = null

    // setup() is async. This component relies on async logic to be resolved
    // before proceeding
    if (__FEATURE_SUSPENSE__ && instance.asyncDep) {
      parentSuspense &&
        parentSuspense.registerDep(instance, setupRenderEffect, optimized)

      // Give it a placeholder if this is not hydration
      // TODO handle self-defined fallback
      if (!initialVNode.el) {
        const placeholder = (instance.subTree = createVNode(Comment))
        processCommentNode(null, placeholder, container!, anchor)
        initialVNode.placeholder = placeholder.el
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized,
      )
    }

    if (__DEV__) {
      popWarningContext()
      endMeasure(instance, `mount`)
    }
  }

  const updateComponent = (n1: VNode, n2: VNode, optimized: boolean) => {
    const instance = (n2.component = n1.component)!
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (
        __FEATURE_SUSPENSE__ &&
        instance.asyncDep &&
        !instance.asyncResolved
      ) {
        // async & still pending - just update props and slots
        // since the component's reactive effect for render isn't set-up yet
        if (__DEV__) {
          pushWarningContext(n2)
        }
        updateComponentPreRender(instance, n2, optimized)
        if (__DEV__) {
          popWarningContext()
        }
        return
      } else {
        // normal update
        instance.next = n2
        // instance.update is the reactive effect.
        instance.update()
      }
    } else {
      // no update needed. just copy over properties
      n2.el = n1.el
      instance.vnode = n2
    }
  }

  const setupRenderEffect: SetupRenderEffectFn = (
    instance,
    initialVNode,
    container,
    anchor,
    parentSuspense,
    namespace: ElementNamespace,
    optimized,
  ) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook: VNodeHook | null | undefined
        const { el, props } = initialVNode
        const { bm, m, parent, root, type } = instance
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode)

        toggleRecurse(instance, false)
        // beforeMount hook
        if (bm) {
          invokeArrayFns(bm)
        }
        // onVnodeBeforeMount
        if (
          !isAsyncWrapperVNode &&
          (vnodeHook = props && props.onVnodeBeforeMount)
        ) {
          invokeVNodeHook(vnodeHook, parent, initialVNode)
        }
        if (
          __COMPAT__ &&
          isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
        ) {
          instance.emit('hook:beforeMount')
        }
        toggleRecurse(instance, true)

        if (el && hydrateNode) {
          // vnode has adopted host node - perform hydration instead of mount.
          const hydrateSubTree = () => {
            if (__DEV__) {
              startMeasure(instance, `render`)
            }
            instance.subTree = renderComponentRoot(instance)
            if (__DEV__) {
              endMeasure(instance, `render`)
            }
            if (__DEV__) {
              startMeasure(instance, `hydrate`)
            }
            hydrateNode!(
              el as Node,
              instance.subTree,
              instance,
              parentSuspense,
              null,
            )
            if (__DEV__) {
              endMeasure(instance, `hydrate`)
            }
          }

          if (
            isAsyncWrapperVNode &&
            (type as ComponentOptions).__asyncHydrate
          ) {
            ;(type as ComponentOptions).__asyncHydrate!(
              el as Element,
              instance,
              hydrateSubTree,
            )
          } else {
            hydrateSubTree()
          }
        } else {
          // custom element style injection
          if (
            root.ce &&
            // @ts-expect-error _def is private
            (root.ce as VueElement)._def.shadowRoot !== false
          ) {
            root.ce._injectChildStyle(type)
          }

          if (__DEV__) {
            startMeasure(instance, `render`)
          }
          const subTree = (instance.subTree = renderComponentRoot(instance))
          if (__DEV__) {
            endMeasure(instance, `render`)
          }
          if (__DEV__) {
            startMeasure(instance, `patch`)
          }
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            namespace,
          )
          if (__DEV__) {
            endMeasure(instance, `patch`)
          }
          initialVNode.el = subTree.el
        }
        // mounted hook
        if (m) {
          queuePostRenderEffect(m, parentSuspense)
        }
        // onVnodeMounted
        if (
          !isAsyncWrapperVNode &&
          (vnodeHook = props && props.onVnodeMounted)
        ) {
          const scopedInitialVNode = initialVNode
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook!, parent, scopedInitialVNode),
            parentSuspense,
          )
        }
        if (
          __COMPAT__ &&
          isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
        ) {
          queuePostRenderEffect(
            () => instance.emit('hook:mounted'),
            parentSuspense,
          )
        }

        // activated hook for keep-alive roots.
        // #1742 activated hook must be accessed after first render
        // since the hook may be injected by a child keep-alive
        if (
          initialVNode.shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE ||
          (parent &&
            isAsyncWrapper(parent.vnode) &&
            parent.vnode.shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE)
        ) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense)
          if (
            __COMPAT__ &&
            isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
          ) {
            queuePostRenderEffect(
              () => instance.emit('hook:activated'),
              parentSuspense,
            )
          }
        }
        instance.isMounted = true

        if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
          devtoolsComponentAdded(instance)
        }

        // #2458: deference mount-only object parameters to prevent memleaks
        initialVNode = container = anchor = null as any
      } else {
        let { next, bu, u, parent, vnode } = instance

        if (__FEATURE_SUSPENSE__) {
          const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance)
          // we are trying to update some async comp before hydration
          // this will cause crash because we don't know the root node yet
          if (nonHydratedAsyncRoot) {
            // only sync the properties and abort the rest of operations
            if (next) {
              next.el = vnode.el
              updateComponentPreRender(instance, next, optimized)
            }
            // and continue the rest of operations once the deps are resolved
            nonHydratedAsyncRoot.asyncDep!.then(() => {
              // the instance may be destroyed during the time period
              if (!instance.isUnmounted) {
                componentUpdateFn()
              }
            })
            return
          }
        }

        // updateComponent
        // This is triggered by mutation of component's own state (next: null)
        // OR parent calling processComponent (next: VNode)
        let originNext = next
        let vnodeHook: VNodeHook | null | undefined
        if (__DEV__) {
          pushWarningContext(next || instance.vnode)
        }

        // Disallow component effect recursion during pre-lifecycle hooks.
        toggleRecurse(instance, false)
        if (next) {
          next.el = vnode.el
          updateComponentPreRender(instance, next, optimized)
        } else {
          next = vnode
        }

        // beforeUpdate hook
        if (bu) {
          invokeArrayFns(bu)
        }
        // onVnodeBeforeUpdate
        if ((vnodeHook = next.props && next.props.onVnodeBeforeUpdate)) {
          invokeVNodeHook(vnodeHook, parent, next, vnode)
        }
        if (
          __COMPAT__ &&
          isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
        ) {
          instance.emit('hook:beforeUpdate')
        }
        toggleRecurse(instance, true)

        // render
        if (__DEV__) {
          startMeasure(instance, `render`)
        }
        const nextTree = renderComponentRoot(instance)
        if (__DEV__) {
          endMeasure(instance, `render`)
        }
        const prevTree = instance.subTree
        instance.subTree = nextTree

        if (__DEV__) {
          startMeasure(instance, `patch`)
        }
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el!)!,
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace,
        )
        if (__DEV__) {
          endMeasure(instance, `patch`)
        }
        next.el = nextTree.el
        if (originNext === null) {
          // self-triggered update. In case of HOC, update parent component
          // vnode el. HOC is indicated by parent instance's subTree pointing
          // to child component's vnode
          updateHOCHostEl(instance, nextTree.el)
        }
        // updated hook
        if (u) {
          queuePostRenderEffect(u, parentSuspense)
        }
        // onVnodeUpdated
        if ((vnodeHook = next.props && next.props.onVnodeUpdated)) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook!, parent, next!, vnode),
            parentSuspense,
          )
        }
        if (
          __COMPAT__ &&
          isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
        ) {
          queuePostRenderEffect(
            () => instance.emit('hook:updated'),
            parentSuspense,
          )
        }

        if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
          devtoolsComponentUpdated(instance)
        }

        if (__DEV__) {
          popWarningContext()
        }
      }
    }

    // create reactive effect for rendering
    instance.scope.on()
    const effect = (instance.effect = new ReactiveEffect(componentUpdateFn))
    instance.scope.off()

    const update = (instance.update = effect.run.bind(effect))
    const job: SchedulerJob = (instance.job = effect.runIfDirty.bind(effect))
    job.i = instance
    job.id = instance.uid
    effect.scheduler = () => queueJob(job)

    // allowRecurse
    // #1801, #2043 component render effects should allow recursive updates
    toggleRecurse(instance, true)

    if (__DEV__) {
      effect.onTrack = instance.rtc
        ? e => invokeArrayFns(instance.rtc!, e)
        : void 0
      effect.onTrigger = instance.rtg
        ? e => invokeArrayFns(instance.rtg!, e)
        : void 0
    }

    update()
  }

  const updateComponentPreRender = (
    instance: ComponentInternalInstance,
    nextVNode: VNode,
    optimized: boolean,
  ) => {
    nextVNode.component = instance
    const prevProps = instance.vnode.props
    instance.vnode = nextVNode
    instance.next = null
    updateProps(instance, nextVNode.props, prevProps, optimized)
    updateSlots(instance, nextVNode.children, optimized)

    pauseTracking()
    // props update may have triggered pre-flush watchers.
    // flush them before the render update.
    flushPreFlushCbs(instance)
    resetTracking()
  }

  const patchChildren: PatchChildrenFn = (
    n1,
    n2,
    container,
    anchor,
    parentComponent,
    parentSuspense,
    namespace: ElementNamespace,
    slotScopeIds,
    optimized = false,
  ) => {
    const c1 = n1 && n1.children
    const prevShapeFlag = n1 ? n1.shapeFlag : 0
    const c2 = n2.children

    const { patchFlag, shapeFlag } = n2
    // fast path
    if (patchFlag > 0) {
      if (patchFlag & PatchFlags.KEYED_FRAGMENT) {
        // this could be either fully-keyed or mixed (some keyed some not)
        // presence of patchFlag means children are guaranteed to be arrays
        patchKeyedChildren(
          c1 as VNode[],
          c2 as VNodeArrayChildren,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
        return
      } else if (patchFlag & PatchFlags.UNKEYED_FRAGMENT) {
        // unkeyed
        patchUnkeyedChildren(
          c1 as VNode[],
          c2 as VNodeArrayChildren,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
        return
      }
    }

    // children has 3 possibilities: text, array or no children.
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // text children fast path
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1 as VNode[], parentComponent, parentSuspense)
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2 as string)
      }
    } else {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // prev children was array
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // two arrays, cannot assume anything, do full diff
          patchKeyedChildren(
            c1 as VNode[],
            c2 as VNodeArrayChildren,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
          )
        } else {
          // no new children, just unmount old
          unmountChildren(c1 as VNode[], parentComponent, parentSuspense, true)
        }
      } else {
        // prev children was text OR null
        // new children is array OR null
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(container, '')
        }
        // mount new if array
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(
            c2 as VNodeArrayChildren,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
          )
        }
      }
    }
  }

  const patchUnkeyedChildren = (
    c1: VNode[],
    c2: VNodeArrayChildren,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    namespace: ElementNamespace,
    slotScopeIds: string[] | null,
    optimized: boolean,
  ) => {
    c1 = c1 || EMPTY_ARR
    c2 = c2 || EMPTY_ARR
    const oldLength = c1.length
    const newLength = c2.length
    const commonLength = Math.min(oldLength, newLength)
    let i
    for (i = 0; i < commonLength; i++) {
      const nextChild = (c2[i] = optimized
        ? cloneIfMounted(c2[i] as VNode)
        : normalizeVNode(c2[i]))
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
      )
    }
    if (oldLength > newLength) {
      // remove old
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength,
      )
    } else {
      // mount new
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength,
      )
    }
  }

  // can be all-keyed or mixed
  const patchKeyedChildren = (
    c1: VNode[],
    c2: VNodeArrayChildren,
    container: RendererElement,
    parentAnchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    namespace: ElementNamespace,
    slotScopeIds: string[] | null,
    optimized: boolean,
  ) => {
    let i = 0
    const l2 = c2.length
    let e1 = c1.length - 1 // prev ending index
    let e2 = l2 - 1 // next ending index

    // 1. sync from start
    // (a b) c
    // (a b) d e
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = (c2[i] = optimized
        ? cloneIfMounted(c2[i] as VNode)
        : normalizeVNode(c2[i]))
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
      } else {
        break
      }
      i++
    }

    // 2. sync from end
    // a (b c)
    // d e (b c)
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = (c2[e2] = optimized
        ? cloneIfMounted(c2[e2] as VNode)
        : normalizeVNode(c2[e2]))
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
        )
      } else {
        break
      }
      e1--
      e2--
    }

    // 3. common sequence + mount
    // (a b)
    // (a b) c
    // i = 2, e1 = 1, e2 = 2
    // (a b)
    // c (a b)
    // i = 0, e1 = -1, e2 = 0
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1
        const anchor = nextPos < l2 ? (c2[nextPos] as VNode).el : parentAnchor
        while (i <= e2) {
          patch(
            null,
            (c2[i] = optimized
              ? cloneIfMounted(c2[i] as VNode)
              : normalizeVNode(c2[i])),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
          )
          i++
        }
      }
    }

    // 4. common sequence + unmount
    // (a b) c
    // (a b)
    // i = 2, e1 = 2, e2 = 1
    // a (b c)
    // (b c)
    // i = 0, e1 = 0, e2 = -1
    else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true)
        i++
      }
    }

    // 5. unknown sequence
    // [i ... e1 + 1]: a b [c d e] f g
    // [i ... e2 + 1]: a b [e d c h] f g
    // i = 2, e1 = 4, e2 = 5
    else {
      const s1 = i // prev starting index
      const s2 = i // next starting index

      // 5.1 build key:index map for newChildren
      const keyToNewIndexMap: Map<PropertyKey, number> = new Map()
      for (i = s2; i <= e2; i++) {
        const nextChild = (c2[i] = optimized
          ? cloneIfMounted(c2[i] as VNode)
          : normalizeVNode(c2[i]))
        if (nextChild.key != null) {
          if (__DEV__ && keyToNewIndexMap.has(nextChild.key)) {
            warn(
              `Duplicate keys found during update:`,
              JSON.stringify(nextChild.key),
              `Make sure keys are unique.`,
            )
          }
          keyToNewIndexMap.set(nextChild.key, i)
        }
      }

      // 5.2 loop through old children left to be patched and try to patch
      // matching nodes & remove nodes that are no longer present
      let j
      let patched = 0
      const toBePatched = e2 - s2 + 1
      let moved = false
      // used to track whether any node has moved
      let maxNewIndexSoFar = 0
      // works as Map<newIndex, oldIndex>
      // Note that oldIndex is offset by +1
      // and oldIndex = 0 is a special value indicating the new node has
      // no corresponding old node.
      // used for determining longest stable subsequence
      const newIndexToOldIndexMap = new Array(toBePatched)
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0

      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i]
        if (patched >= toBePatched) {
          // all new children have been patched so this can only be a removal
          unmount(prevChild, parentComponent, parentSuspense, true)
          continue
        }
        let newIndex
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          // key-less node, try to locate a key-less node of the same type
          for (j = s2; j <= e2; j++) {
            if (
              newIndexToOldIndexMap[j - s2] === 0 &&
              isSameVNodeType(prevChild, c2[j] as VNode)
            ) {
              newIndex = j
              break
            }
          }
        }
        if (newIndex === undefined) {
          unmount(prevChild, parentComponent, parentSuspense, true)
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            moved = true
          }
          patch(
            prevChild,
            c2[newIndex] as VNode,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
          )
          patched++
        }
      }

      // 5.3 move and mount
      // generate longest stable subsequence only when nodes have moved
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : EMPTY_ARR
      j = increasingNewIndexSequence.length - 1
      // looping backwards so that we can use last patched node as anchor
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i
        const nextChild = c2[nextIndex] as VNode
        const anchorVNode = c2[nextIndex + 1] as VNode
        const anchor =
          nextIndex + 1 < l2
            ? // #13559, #14173 fallback to el placeholder for unresolved async component
              anchorVNode.el || resolveAsyncComponentPlaceholder(anchorVNode)
            : parentAnchor
        if (newIndexToOldIndexMap[i] === 0) {
          // mount new
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
          )
        } else if (moved) {
          // move if:
          // There is no stable subsequence (e.g. a reverse)
          // OR current node is not among the stable sequence
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, MoveType.REORDER)
          } else {
            j--
          }
        }
      }
    }
  }

  const move: MoveFn = (
    vnode,
    container,
    anchor,
    moveType,
    parentSuspense = null,
  ) => {
    const { el, type, transition, children, shapeFlag } = vnode
    if (shapeFlag & ShapeFlags.COMPONENT) {
      move(vnode.component!.subTree, container, anchor, moveType)
      return
    }

    if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
      vnode.suspense!.move(container, anchor, moveType)
      return
    }

    if (shapeFlag & ShapeFlags.TELEPORT) {
      ;(type as typeof TeleportImpl).move(vnode, container, anchor, internals)
      return
    }

    if (type === Fragment) {
      hostInsert(el!, container, anchor)
      for (let i = 0; i < (children as VNode[]).length; i++) {
        move((children as VNode[])[i], container, anchor, moveType)
      }
      hostInsert(vnode.anchor!, container, anchor)
      return
    }

    if (type === Static) {
      moveStaticNode(vnode, container, anchor)
      return
    }

    // single nodes
    const needTransition =
      moveType !== MoveType.REORDER &&
      shapeFlag & ShapeFlags.ELEMENT &&
      transition
    if (needTransition) {
      if (moveType === MoveType.ENTER) {
        transition!.beforeEnter(el!)
        hostInsert(el!, container, anchor)
        queuePostRenderEffect(() => transition!.enter(el!), parentSuspense)
      } else {
        const { leave, delayLeave, afterLeave } = transition!
        const remove = () => {
          if (vnode.ctx!.isUnmounted) {
            hostRemove(el!)
          } else {
            hostInsert(el!, container, anchor)
          }
        }
        const performLeave = () => {
          // #13153 move kept-alive node before v-show transition leave finishes
          // it needs to call the leaving callback to ensure element's `display`
          // is `none`
          if (el!._isLeaving) {
            el![leaveCbKey](true /* cancelled */)
          }
          leave(el!, () => {
            remove()
            afterLeave && afterLeave()
          })
        }
        if (delayLeave) {
          delayLeave(el!, remove, performLeave)
        } else {
          performLeave()
        }
      }
    } else {
      hostInsert(el!, container, anchor)
    }
  }

  const unmount: UnmountFn = (
    vnode,
    parentComponent,
    parentSuspense,
    doRemove = false,
    optimized = false,
  ) => {
    const {
      type,
      props,
      ref,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs,
      cacheIndex,
    } = vnode

    if (patchFlag === PatchFlags.BAIL) {
      optimized = false
    }

    // unset ref
    if (ref != null) {
      pauseTracking()
      setRef(ref, null, parentSuspense, vnode, true)
      resetTracking()
    }

    // #6593 should clean memo cache when unmount
    if (cacheIndex != null) {
      parentComponent!.renderCache[cacheIndex] = undefined
    }

    if (shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
      ;(parentComponent!.ctx as KeepAliveContext).deactivate(vnode)
      return
    }

    const shouldInvokeDirs = shapeFlag & ShapeFlags.ELEMENT && dirs
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode)

    let vnodeHook: VNodeHook | undefined | null
    if (
      shouldInvokeVnodeHook &&
      (vnodeHook = props && props.onVnodeBeforeUnmount)
    ) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode)
    }

    if (shapeFlag & ShapeFlags.COMPONENT) {
      unmountComponent(vnode.component!, parentSuspense, doRemove)
    } else {
      if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
        vnode.suspense!.unmount(parentSuspense, doRemove)
        return
      }

      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, 'beforeUnmount')
      }

      if (shapeFlag & ShapeFlags.TELEPORT) {
        ;(vnode.type as typeof TeleportImpl).remove(
          vnode,
          parentComponent,
          parentSuspense,
          internals,
          doRemove,
        )
      } else if (
        dynamicChildren &&
        // #5154
        // when v-once is used inside a block, setBlockTracking(-1) marks the
        // parent block with hasOnce: true
        // so that it doesn't take the fast path during unmount - otherwise
        // components nested in v-once are never unmounted.
        !dynamicChildren.hasOnce &&
        // #1153: fast path should not be taken for non-stable (v-for) fragments
        (type !== Fragment ||
          (patchFlag > 0 && patchFlag & PatchFlags.STABLE_FRAGMENT))
      ) {
        // fast path for block nodes: only need to unmount dynamic children.
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true,
        )
      } else if (
        (type === Fragment &&
          patchFlag &
            (PatchFlags.KEYED_FRAGMENT | PatchFlags.UNKEYED_FRAGMENT)) ||
        (!optimized && shapeFlag & ShapeFlags.ARRAY_CHILDREN)
      ) {
        unmountChildren(children as VNode[], parentComponent, parentSuspense)
      }

      if (doRemove) {
        remove(vnode)
      }
    }

    if (
      (shouldInvokeVnodeHook &&
        (vnodeHook = props && props.onVnodeUnmounted)) ||
      shouldInvokeDirs
    ) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode)
        shouldInvokeDirs &&
          invokeDirectiveHook(vnode, null, parentComponent, 'unmounted')
      }, parentSuspense)
    }
  }

  const remove: RemoveFn = vnode => {
    const { type, el, anchor, transition } = vnode
    if (type === Fragment) {
      if (
        __DEV__ &&
        vnode.patchFlag > 0 &&
        vnode.patchFlag & PatchFlags.DEV_ROOT_FRAGMENT &&
        transition &&
        !transition.persisted
      ) {
        ;(vnode.children as VNode[]).forEach(child => {
          if (child.type === Comment) {
            hostRemove(child.el!)
          } else {
            remove(child)
          }
        })
      } else {
        removeFragment(el!, anchor!)
      }
      return
    }

    if (type === Static) {
      removeStaticNode(vnode)
      return
    }

    const performRemove = () => {
      hostRemove(el!)
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave()
      }
    }

    if (
      vnode.shapeFlag & ShapeFlags.ELEMENT &&
      transition &&
      !transition.persisted
    ) {
      const { leave, delayLeave } = transition
      const performLeave = () => leave(el!, performRemove)
      if (delayLeave) {
        delayLeave(vnode.el!, performRemove, performLeave)
      } else {
        performLeave()
      }
    } else {
      performRemove()
    }
  }

  const removeFragment = (cur: RendererNode, end: RendererNode) => {
    // For fragments, directly remove all contained DOM nodes.
    // (fragment child nodes cannot have transition)
    let next
    while (cur !== end) {
      next = hostNextSibling(cur)!
      hostRemove(cur)
      cur = next
    }
    hostRemove(end)
  }

  const unmountComponent = (
    instance: ComponentInternalInstance,
    parentSuspense: SuspenseBoundary | null,
    doRemove?: boolean,
  ) => {
    if (__DEV__ && instance.type.__hmrId) {
      unregisterHMR(instance)
    }

    const { bum, scope, job, subTree, um, m, a } = instance
    invalidateMount(m)
    invalidateMount(a)

    // beforeUnmount hook
    if (bum) {
      invokeArrayFns(bum)
    }

    if (
      __COMPAT__ &&
      isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
    ) {
      instance.emit('hook:beforeDestroy')
    }

    // stop effects in component scope
    scope.stop()

    // job may be null if a component is unmounted before its async
    // setup has resolved.
    if (job) {
      // so that scheduler will no longer invoke it
      job.flags! |= SchedulerJobFlags.DISPOSED
      unmount(subTree, instance, parentSuspense, doRemove)
    }
    // unmounted hook
    if (um) {
      queuePostRenderEffect(um, parentSuspense)
    }
    if (
      __COMPAT__ &&
      isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
    ) {
      queuePostRenderEffect(
        () => instance.emit('hook:destroyed'),
        parentSuspense,
      )
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true
    }, parentSuspense)

    if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
      devtoolsComponentRemoved(instance)
    }
  }

  const unmountChildren: UnmountChildrenFn = (
    children,
    parentComponent,
    parentSuspense,
    doRemove = false,
    optimized = false,
    start = 0,
  ) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized)
    }
  }

  const getNextHostNode: NextFn = vnode => {
    if (vnode.shapeFlag & ShapeFlags.COMPONENT) {
      return getNextHostNode(vnode.component!.subTree)
    }
    if (__FEATURE_SUSPENSE__ && vnode.shapeFlag & ShapeFlags.SUSPENSE) {
      return vnode.suspense!.next()
    }
    const el = hostNextSibling((vnode.anchor || vnode.el)!)
    // #9071, #9313
    // teleported content can mess up nextSibling searches during patch so
    // we need to skip them during nextSibling search
    const teleportEnd = el && el[TeleportEndKey]
    return teleportEnd ? hostNextSibling(teleportEnd) : el
  }

  let isFlushing = false
  /**
   * 渲染函数，负责将虚拟节点渲染到容器中
   * @param vnode - 虚拟节点，如果为null则执行卸载操作
   * @param container - 渲染容器
   * @param namespace - 命名空间
   */
  const render: RootRenderFunction = (vnode, container, namespace) => {
    let instance
    // 如果 vnode 为 null, 则执行卸载操作
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true)
        instance = container._vnode.component
      }
    } else {
      /**
       * 这里会做两个操作:
       *  - 如果 container._vnode 存在的话, 那么就会执行更新操作
       *  - 如果 container._vnode 不存在的话, 那么就会新增
       */
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace,
      )
    }
    container._vnode = vnode
    if (!isFlushing) {
      isFlushing = true
      flushPreFlushCbs(instance)
      flushPostFlushCbs()
      isFlushing = false
    }
  }

  const internals: RendererInternals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options,
  }

  let hydrate: ReturnType<typeof createHydrationFunctions>[0] | undefined
  let hydrateNode: ReturnType<typeof createHydrationFunctions>[1] | undefined
  if (createHydrationFns) {
    ;[hydrate, hydrateNode] = createHydrationFns(
      internals as RendererInternals<Node, Element>,
    )
  }

  return {
    render,
    hydrate,
    /**
     * 创建一个应用实例, 使用 createAppAPI 闭包
     */
    createApp: createAppAPI(render, hydrate),
  }
}

function resolveChildrenNamespace(
  { type, props }: VNode,
  currentNamespace: ElementNamespace,
): ElementNamespace {
  return (currentNamespace === 'svg' && type === 'foreignObject') ||
    (currentNamespace === 'mathml' &&
      type === 'annotation-xml' &&
      props &&
      props.encoding &&
      props.encoding.includes('html'))
    ? undefined
    : currentNamespace
}

function toggleRecurse(
  { effect, job }: ComponentInternalInstance,
  allowed: boolean,
) {
  if (allowed) {
    effect.flags |= EffectFlags.ALLOW_RECURSE
    job.flags! |= SchedulerJobFlags.ALLOW_RECURSE
  } else {
    effect.flags &= ~EffectFlags.ALLOW_RECURSE
    job.flags! &= ~SchedulerJobFlags.ALLOW_RECURSE
  }
}

export function needTransition(
  parentSuspense: SuspenseBoundary | null,
  transition: TransitionHooks | null,
): boolean | null {
  return (
    (!parentSuspense || (parentSuspense && !parentSuspense.pendingBranch)) &&
    transition &&
    !transition.persisted
  )
}

/**
 * #1156
 * When a component is HMR-enabled, we need to make sure that all static nodes
 * inside a block also inherit the DOM element from the previous tree so that
 * HMR updates (which are full updates) can retrieve the element for patching.
 *
 * #2080
 * Inside keyed `template` fragment static children, if a fragment is moved,
 * the children will always be moved. Therefore, in order to ensure correct move
 * position, el should be inherited from previous nodes.
 */
export function traverseStaticChildren(
  n1: VNode,
  n2: VNode,
  shallow = false,
): void {
  const ch1 = n1.children
  const ch2 = n2.children
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      // this is only called in the optimized path so array children are
      // guaranteed to be vnodes
      const c1 = ch1[i] as VNode
      let c2 = ch2[i] as VNode
      if (c2.shapeFlag & ShapeFlags.ELEMENT && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === PatchFlags.NEED_HYDRATION) {
          c2 = ch2[i] = cloneIfMounted(ch2[i] as VNode)
          c2.el = c1.el
        }
        if (!shallow && c2.patchFlag !== PatchFlags.BAIL)
          traverseStaticChildren(c1, c2)
      }
      // #6852 also inherit for text nodes
      if (c2.type === Text) {
        // avoid cached text nodes retaining detached dom nodes
        if (c2.patchFlag !== PatchFlags.CACHED) {
          c2.el = c1.el
        } else {
          // cache the child index for HMR updates
          ;(c2 as any).__elIndex =
            i +
            // take fragment start anchor into account
            (n1.type === Fragment ? 1 : 0)
        }
      }
      // #2324 also inherit for comment nodes, but not placeholders (e.g. v-if which
      // would have received .el during block patch)
      if (c2.type === Comment && !c2.el) {
        c2.el = c1.el
      }

      if (__DEV__) {
        c2.el && (c2.el.__vnode = c2)
      }
    }
  }
}

// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function getSequence(arr: number[]): number[] {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}

function locateNonHydratedAsyncRoot(
  instance: ComponentInternalInstance,
): ComponentInternalInstance | undefined {
  const subComponent = instance.subTree.component
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent
    } else {
      return locateNonHydratedAsyncRoot(subComponent)
    }
  }
}

export function invalidateMount(hooks: LifecycleHook): void {
  if (hooks) {
    for (let i = 0; i < hooks.length; i++)
      hooks[i].flags! |= SchedulerJobFlags.DISPOSED
  }
}

function resolveAsyncComponentPlaceholder(anchorVnode: VNode) {
  if (anchorVnode.placeholder) {
    return anchorVnode.placeholder
  }

  // anchor vnode maybe is a wrapper component has single unresolved async component
  const instance = anchorVnode.component
  if (instance) {
    return resolveAsyncComponentPlaceholder(instance.subTree)
  }

  return null
}
