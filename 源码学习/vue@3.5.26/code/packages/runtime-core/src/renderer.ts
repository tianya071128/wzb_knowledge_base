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
   *  - 首次渲染: 调用 mountElement 方法执行渲染
   *  - 更新渲染: 调用 patchElement 方法执行更新
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
      // full diff 全量 diff
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

  /**
   * Vue3 核心函数 - 【元素属性增量更新核心入口】，负责新旧属性的差异对比与更新指令下发
   * 核心职责：对比元素的新旧属性对象，增量处理：移除废弃属性、更新变化/新增属性，不做全量覆盖
   * 核心原则：最小化DOM操作，只处理「有差异」的属性，无差异则无任何操作
   * 核心设计：只做属性差异判断，不直接操作DOM → 真实DOM操作交给hostPatchProp，实现跨平台解耦
   * 核心特性：过滤Vue保留属性、兼容命名空间、对表单value属性做特殊兜底处理、纯增量更新无冗余逻辑
   *
   *  - ✅ 步骤一：清理「废弃属性」→ 遍历旧属性，移除「旧有但新无」的属性
   *  - ✅ 步骤二：增量更新「新增 / 变化属性」→ 遍历新属性，更新差异属性
   *  - 核心通过 hostPatchProp 方法实现新增和删除属性
   *
   *
   * @param {RendererElement} el 真实的DOM元素对象，属性要挂载的目标元素
   * @param {Data} oldProps 旧VNode的属性对象，可能为EMPTY_OBJ(无属性)
   * @param {Data} newProps 新VNode的属性对象，可能为EMPTY_OBJ(无属性)
   * @param {ComponentInternalInstance | null} parentComponent 父组件实例，用于指令/事件/依赖收集
   * @param {ElementNamespace} namespace 元素命名空间(html/svg/mathml)，决定属性解析规则
   * @returns {void} 无返回值，所有操作均为下发更新指令到hostPatchProp，由其执行真实DOM副作用
   */
  const patchProps = (
    el: RendererElement,
    oldProps: Data,
    newProps: Data,
    parentComponent: ComponentInternalInstance | null,
    namespace: ElementNamespace,
  ) => {
    // ========== 核心前置判断：新旧属性对象是否全等，全等则无任何属性变化，直接返回 ==========
    // 全等说明属性无任何增删改，无需后续所有处理，性能最优的快速路径
    if (oldProps !== newProps) {
      // ========== 第一步：处理「旧属性的废弃逻辑」→ 移除 旧有但新属性中不存在 的属性 ==========
      // 只有旧属性不是空对象时，才需要遍历处理，空对象无属性可移除，跳过该逻辑
      if (oldProps !== EMPTY_OBJ) {
        // 遍历旧属性对象的所有属性key
        for (const key in oldProps) {
          // 过滤条件：
          // 1. isReservedProp(key) → 是Vue保留属性，跳过（不处理DOM属性）
          // 2. !(key in newProps) → 该属性在新属性中不存在 → 属于「废弃属性」需要移除
          if (!isReservedProp(key) && !(key in newProps)) {
            // 调用宿主适配层API，移除该属性：新值传null，表示删除/解绑该属性
            hostPatchProp(
              el,
              key,
              oldProps[key], // 旧值
              null, // 新值为null → 核心标识：移除属性/解绑事件/清空样式
              namespace,
              parentComponent,
            )
          }
        }
      }

      // ========== 第二步：处理「新属性的增量更新」→ 更新 新增/值发生变化 的属性 ==========
      // 遍历新属性对象的所有属性key，处理新增/变化的属性
      for (const key in newProps) {
        // empty string is not valid prop 空字符串不是有效的 prop
        // 1. 跳过Vue的内部保留属性，这类属性不渲染为DOM属性（如key/ref/slot）
        if (isReservedProp(key)) continue
        // 2. 获取当前属性的 新值/旧值
        const next = newProps[key]
        const prev = oldProps[key]
        // defer patching value 延迟修补 value
        // 3. 核心更新判断条件：新值 !== 旧值 且 不是value属性 → 执行属性更新
        // 注：value 属性这里先延迟更新(defer patching value)，放到最后单独兜底处理
        if (next !== prev && key !== 'value') {
          hostPatchProp(el, key, prev, next, namespace, parentComponent)
        }
      }

      // ========== 第三步：特殊兜底处理 → 单独更新 value 属性 ==========
      // 核心原因：表单控件(input/select/textarea)的value属性有特殊的更新时机和逻辑，
      // 延迟到所有属性更新完成后单独处理，能避免和其他属性（如checked/disabled）的更新冲突，保证赋值正确
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

  /**
   * Vue3 核心核心函数 - 【组件类型VNode专属处理入口】，组件渲染的总调度中心
   * 核心职责：统一分发组件的所有处理逻辑，只做分支判断，不做具体业务逻辑
   * 核心逻辑：三分支极简分发 → 无旧VNode=首次渲染 → 是缓存组件则激活，否则挂载；有旧VNode=组件更新
   * 处理场景：普通组件挂载、缓存组件激活、组件增量更新，覆盖Vue所有组件的渲染生命周期
   *
   *  - 初始挂载: 调用 mountComponent 方法创建组件
   *
   * @param {VNode | null} n1 组件的旧VNode节点，null 表示【组件首次渲染/挂载】
   * @param {VNode} n2 组件的新VNode节点，必传（当前要渲染的最新组件节点）
   * @param {RendererElement} container 真实DOM容器，组件要挂载的父容器
   * @param {RendererNode | null} anchor 锚点DOM节点，组件插入/移动的参考位置，保证挂载位置正确
   * @param {ComponentInternalInstance | null} parentComponent 父组件实例，组件上下文、生命周期调度、依赖收集
   * @param {SuspenseBoundary | null} parentSuspense 父级Suspense边界，处理异步组件的加载/错误状态
   * @param {ElementNamespace} namespace 元素命名空间(html/svg/mathml)，组件内部元素的属性解析规则
   * @param {string[] | null} slotScopeIds 插槽作用域ID，用于组件内部插槽的scoped样式隔离
   * @param {boolean} optimized 是否为编译优化后的VNode，透传给子函数做性能优化
   * @returns {void} 无返回值，所有具体逻辑由子函数(mountComponent/updateComponent/activate)执行
   */
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
    // 第一步：给新组件VNode赋值插槽作用域ID，用于组件内部插槽的scoped样式隔离，保证样式生效
    n2.slotScopeIds = slotScopeIds

    // ========== 核心分支一：n1为null → 无旧组件VNode，当前是【组件首次渲染/挂载阶段】 ==========
    if (n1 == null) {
      // 子分支1.1：当前组件是【被KeepAlive缓存的组件】→ 执行缓存组件的「激活」逻辑，复用实例，不重新挂载
      if (n2.shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
        // parentComponent 一定存在(KeepAlive作为父组件)，非空断言后获取KeepAlive上下文，调用激活方法
        ;(parentComponent!.ctx as KeepAliveContext).activate(
          n2,
          container,
          anchor,
          namespace,
          optimized,
        )
      }
      // 子分支1.2：当前是【普通组件】→ 执行组件的「首次挂载」逻辑，创建实例、初始化、渲染DOM
      else {
        // 挂载组件
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
    }
    // ========== 核心分支二：n1不为null → 存在旧组件VNode，当前是【组件增量更新阶段】 ==========
    else {
      // 执行组件的「增量更新」逻辑，对比新旧组件VNode，执行重渲染、最小化DOM更新
      updateComponent(n1, n2, optimized)
    }
  }

  /**
   * Vue3 终极核心函数 - 组件【首次挂载】的唯一入口，组件诞生的完整生命周期实现
   * 核心职责：完成组件从「虚拟VNode」到「真实DOM渲染」的全流程，包含：创建实例→初始化配置→执行setup→处理异步→创建响应式渲染→渲染DOM
   * 核心流程：组件实例化 → 开发环境处理 → KeepAlive特殊注入 → 组件核心初始化 → 异步组件处理 → 创建渲染副作用 → 完成挂载
   * 处理范围：所有普通Vue组件的首次挂载，兼容Vue2兼容模式、异步组件、KeepAlive组件、开发环境所有调试能力
   * 核心特性：无冗余逻辑、步骤严谨、兼容所有场景、响应式核心绑定、承上启下连接VNode与真实DOM
   *
   *  - 1. 创建实例: createComponentInstance 方法创建实例, 初始化一些字段, 不做更多处理
   *  - 2. 执行 steup 方法(同时适配处理选项式 API): setupComponent 方法大致会处理 props、slots, 最主要执行 steup 方法
   *  - 3. 调用 setupRenderEffect 方法
   *        - 大致为将渲染VNode包装为响应式副作用，实现「状态变更 → 自动更新 DOM」
   *        - 生成VNode, 调用 patch 方法渲染VNode
   *
   * @param {VNode} initialVNode 组件的根VNode节点，组件的虚拟载体，挂载后会赋值真实DOM到el属性
   * @param {RendererElement} container 真实DOM容器，组件最终要挂载到的父容器
   * @param {RendererNode | null} anchor 锚点DOM节点，组件插入的参考位置，保证挂载位置精准无误
   * @param {ComponentInternalInstance | null} parentComponent 父组件实例，组件的上下文归属，用于依赖收集/生命周期调度
   * @param {SuspenseBoundary | null} parentSuspense 父级Suspense异步边界，处理异步组件的加载状态
   * @param {ElementNamespace} namespace 元素命名空间(html/svg/mathml)，组件内部元素的属性解析规则
   * @param {boolean} optimized 是否为编译优化后的VNode，透传做渲染性能优化
   * @returns {void} 无返回值，所有操作均为组件实例的初始化和DOM渲染的副作用
   */
  const mountComponent: MountComponentFn = (
    initialVNode,
    container,
    anchor,
    parentComponent,
    parentSuspense,
    namespace: ElementNamespace,
    optimized,
  ) => {
    // ========== 步骤1：处理Vue2兼容模式 - 预创建的组件实例兜底 ==========
    // 2.x compat may pre-create the component instance before actually compat可能会在实际创建组件实例之前预先创建它
    // mounting 安装

    // 兼容场景：Vue2迁移Vue3时，组件实例可能在挂载前就被提前创建，这里做兜底复用
    const compatMountInstance =
      __COMPAT__ && initialVNode.isCompatRoot && initialVNode.component

    // ========== 步骤2：创建/复用 组件的【内部核心实例】ComponentInternalInstance ✅核心核心 ==========
    // 组件实例是组件的灵魂，所有组件的上下文、数据、生命周期都挂载在这个实例上
    // 优先级：兼容模式的预创建实例 > 全新创建实例
    // 并且把创建好的实例挂载到组件VNode上：initialVNode.component，后续更新时可直接复用该实例
    const instance: ComponentInternalInstance =
      compatMountInstance ||
      (initialVNode.component = createComponentInstance(
        initialVNode, // 组件根VNode
        parentComponent, // 父组件实例
        parentSuspense, // 父级异步边界
      ))

    // ========== 步骤3：开发环境专属 - 注册组件的热更新(HMR) ==========
    // 开发环境下，如果组件有热更新标识(__hmrId)，注册热更新逻辑，修改代码无需刷新页面，提升开发体验
    if (__DEV__ && instance.type.__hmrId) {
      registerHMR(instance)
    }

    // ========== 步骤4：开发环境专属 - 开启警告上下文+挂载性能打点 ==========
    // pushWarningContext：绑定当前组件VNode的警告上下文，开发环境报错时能精准定位到组件位置
    // startMeasure：开启组件挂载的性能打点，统计mount/init阶段的耗时，开发环境性能分析用
    if (__DEV__) {
      pushWarningContext(initialVNode)
      startMeasure(instance, `mount`)
    }

    // ========== 步骤5：特殊逻辑注入 - 给KeepAlive组件注入渲染器内部实例 ==========
    // inject renderer internals for keepAlive 为 keepAlive 注入渲染器内部结构
    // 如果当前挂载的是KeepAlive组件，将渲染器的核心内部实例注入到KeepAlive的上下文
    // 作用：让KeepAlive能调用渲染器的底层API，实现组件的缓存/激活/失活逻辑
    if (isKeepAlive(initialVNode)) {
      ;(instance.ctx as KeepAliveContext).renderer = internals
    }

    // ========== 步骤6：组件【核心初始化】setupComponent ✅重中之重 核心核心 ==========
    // resolve props and slots for setup context 解析设置上下文的 props 和 slot
    // 非兼容模式/非预创建实例，执行组件的完整初始化流程，这一步是组件的「五脏六腑配齐」的核心
    // 兼容模式的预创建实例已经完成过初始化，这里跳过避免重复执行
    if (!(__COMPAT__ && compatMountInstance)) {
      if (__DEV__) {
        startMeasure(instance, `init`) // 开发环境：开启初始化阶段的性能打点
      }
      // 执行组件初始化：解析props、解析slots、执行setup函数、绑定render函数、初始化上下文
      setupComponent(instance, false, optimized)
      if (__DEV__) {
        endMeasure(instance, `init`) // 开发环境：结束初始化性能打点
      }
    }

    // ========== 步骤7：开发环境专属 - 热更新时清空组件VNode的真实DOM引用 ==========
    // avoid hydration for hmr updating 避免水合以进行 HMR 更新
    // 热更新时避免复用旧的DOM节点，防止热更新后DOM结构错乱，只在开发环境生效
    if (__DEV__ && isHmrUpdating) initialVNode.el = null

    // ========== 步骤8：核心分支判断 - 处理【异步组件(Suspense)】和【普通同步组件】 ==========
    // setup() is async. This component relies on async logic to be resolved setup() 是异步的。该组件依赖异步逻辑来解析
    // before proceeding 在继续之前
    // __FEATURE_SUSPENSE__：是否开启异步组件特性；instance.asyncDep：组件是否是异步组件(setup返回Promise)
    // ✔️ 分支8.1：当前是【异步组件】，交给父级Suspense异步边界处理
    if (__FEATURE_SUSPENSE__ && instance.asyncDep) {
      // 注册异步依赖：Suspense会等待异步组件加载完成后，再执行后续的渲染逻辑
      parentSuspense &&
        parentSuspense.registerDep(instance, setupRenderEffect, optimized)

      // Give it a placeholder if this is not hydration 如果这不是水合作用，就给它一个占位符
      // TODO handle self-defined fallback TODO 处理自定义回退

      // 异步组件加载过程中，创建【注释占位符节点】，避免DOM结构塌陷
      // 只有组件还没有真实DOM时，才创建占位符
      if (!initialVNode.el) {
        const placeholder = (instance.subTree = createVNode(Comment))
        processCommentNode(null, placeholder, container!, anchor)
        initialVNode.placeholder = placeholder.el
      }
    }
    // ✔️ 分支8.2：当前是【普通同步组件】✅ 99%的业务组件走这个分支
    else {
      // 创建组件的【响应式渲染副作用】，这是Vue「数据驱动视图」的终极核心
      // 内部逻辑：执行render生成VNode树 → 调用patch渲染真实DOM → 收集响应式依赖 → 数据变化触发重渲染
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

    // ========== 步骤9：开发环境专属 - 清理警告上下文+结束挂载性能打点 ==========
    if (__DEV__) {
      popWarningContext() // 弹出当前组件的警告上下文，恢复全局上下文
      endMeasure(instance, `mount`) // 结束组件挂载的性能打点，统计总耗时
    }
  }

  /**
   * Vue3 内部核心函数 - 组件VNode更新的【核心处理入口】
   * 核心使命：处理组件类型VNode的更新逻辑，判断组件是否需要真正更新，
   *          区分「异步SUSPENSE未解析」「正常更新」「无需更新」三种场景，执行对应逻辑
   * 核心关联：在patch过程中，当新旧VNode均为组件类型时被调用，是组件更新的核心分发器
   *
   *
   * @param {VNode} n1 旧的组件VNode（prevVNode）
   * @param {VNode} n2 新的组件VNode（nextVNode）
   * @param {boolean} optimized 是否开启优化更新（由编译阶段标记，如静态提升/补丁标记）
   */
  const updateComponent = (n1: VNode, n2: VNode, optimized: boolean) => {
    // ========== 核心：复用组件实例 ==========
    // 组件更新时，新旧VNode指向同一个组件实例（避免重复创建实例），将n2的component指向n1的实例
    const instance = (n2.component = n1.component)!

    // ========== 第一步：判断组件是否需要更新 ==========
    // shouldUpdateComponent：核心判断逻辑，对比新旧VNode的props/slots/shapeFlag等，返回是否需要更新组件
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (
        __FEATURE_SUSPENSE__ && // 开启SUSPENSE特性
        instance.asyncDep && // 组件有异步依赖（如Suspense包裹的异步组件）
        !instance.asyncResolved // 异步依赖尚未解析完成
      ) {
        // async & still pending - just update props and slots 异步且仍待处理 - 只需更新 props 和 slot
        // since the component's reactive effect for render isn't set-up yet 因为组件的渲染反应效果尚未设置
        // 场景说明：异步组件仍处于pending状态（渲染未完成），此时无需触发完整的render更新，
        // 仅需更新props和slots（因为组件的渲染响应式effect还未建立，触发update也无效）

        if (__DEV__) {
          pushWarningContext(n2) // 开发环境：推入警告上下文（关联当前VNode，方便警告定位）
        }
        // 预渲染阶段更新：仅更新组件的props/slots/attrs等状态，不触发render更新
        updateComponentPreRender(instance, n2, optimized)
        if (__DEV__) {
          popWarningContext()
        }
        return
      } else {
        // 标记组件实例的下一个VNode为新VNode（n2），供update effect使用
        // normal update
        instance.next = n2
        // instance.update is the reactive effect. instance.update 是反应效果
        // ✅ 核心：执行组件的更新effect（instance.update是响应式effect函数）
        // instance.update由setupRenderEffect创建，执行后会触发renderComponentRoot生成新VNode，再执行patch更新DOM
        instance.update()
      }
    }
    // ========== 分支2：无需更新组件 ==========
    else {
      // no update needed. just copy over properties 无需更新。只需复制属性
      // 无需更新时，直接复用旧VNode的el（真实DOM节点），保证新VNode和真实DOM的关联正确
      n2.el = n1.el
      // 更新组件实例的vnode属性为新VNode（保持实例和最新VNode的关联）
      instance.vnode = n2
    }
  }

  /**
   * Vue3 核心内部函数 - 组件渲染副作用的【唯一创建入口】，也是组件挂载/更新逻辑的「终极执行器」
   * 核心使命：创建响应式副作用（ReactiveEffect）包裹组件的挂载/更新逻辑，让组件状态变更时自动触发DOM渲染/更新；
   *          首次执行触发组件「挂载」，后续响应式状态变更触发「更新」，是连接组件状态与DOM的核心桥梁
   * 核心特性：① 区分挂载（mount）/更新（update）两个阶段，执行对应生命周期钩子；② 兼容SSR水合（hydration）；③ 支持Suspense/KeepAlive/Teleport；
   *          ④ 开发环境性能打点、调试工具集成；⑤ 完美处理组件递归更新、HOC高阶组件；⑥ 统一的错误/兼容处理
   *
   *  - 定义 componentUpdateFn（组件挂载 / 更新的实际执行体）
   *      -- 首次挂载
   *          --- 生成 VNode: 调用组件的 render 方法生成 VNode
   *          --- 挂载：调用 patch 方法渲染VNode
   *      -- 状态更新: 渲染函数(render)依赖的响应式数据发生变更, 就会重新触发 componentUpdateFn 方法启动更新
   *          --- 获取最新的 VNode: 调用组件的 render 方法生成 VNode
   *          --- 更新：调用 patch 方法比对新旧 VNode
   *  - 创建响应式副作用：将 componentUpdateFn 包装为响应式副作用，实现「状态变更 → 自动更新 DOM」
   *  - 首次执行 update() --> 最终执行 componentUpdateFn 方法
   *
   *
   * @param {ComponentInternalInstance} instance 组件内部实例，所有操作基于该实例
   * @param {VNode} initialVNode 组件初始VNode，首次挂载时使用
   * @param {Container} container 组件挂载的目标容器（DOM元素/ShadowRoot等）
   * @param {Anchor} anchor 挂载的锚点元素，用于指定插入位置（比如兄弟节点前）
   * @param {SuspenseBoundary | null} parentSuspense 父级Suspense边界，用于异步组件管理
   * @param {ElementNamespace} namespace 元素命名空间（如svg/html/svg），处理不同命名空间的DOM操作
   * @param {boolean} optimized 是否启用优化模式（编译期优化）
   * @returns {void} 无返回值，所有副作用直接绑定到组件实例
   */
  const setupRenderEffect: SetupRenderEffectFn = (
    instance,
    initialVNode,
    container,
    anchor,
    parentSuspense,
    namespace: ElementNamespace,
    optimized,
  ) => {
    // ========== 核心内部函数：组件挂载/更新的「实际执行逻辑」 ==========
    // componentUpdateFn 是副作用的核心执行体，分为「首次挂载」和「状态更新」两个分支
    const componentUpdateFn = () => {
      // ========== 分支1：首次挂载阶段（!instance.isMounted） ==========
      if (!instance.isMounted) {
        let vnodeHook: VNodeHook | null | undefined // 存储VNode钩子函数（如onVnodeBeforeMount）
        const { el, props } = initialVNode // 从初始VNode获取宿主元素、props
        const { bm, m, parent, root, type } = instance // 解构实例的生命周期钩子/关联实例
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode) // 判断是否为异步包装VNode

        // 暂停组件递归更新：执行beforeMount钩子时禁止递归触发组件更新，避免逻辑混乱
        toggleRecurse(instance, false)

        // 1. 执行组件的 beforeMount 生命周期钩子（选项式API：beforeMount，组合式API：onBeforeMount）
        // beforeCreate 和 created 钩子会在 ./componentOptions.ts 文件中的 applyOptions 方法中执行
        // beforeMount hook before挂载钩子
        if (bm) {
          invokeArrayFns(bm)
        }

        // 2. 执行 VNode 钩子：onVnodeBeforeMount（组件VNode的挂载前钩子）
        // onVnodeBeforeMount 挂载前的 onVnode
        if (
          !isAsyncWrapperVNode &&
          (vnodeHook = props && props.onVnodeBeforeMount)
        ) {
          invokeVNodeHook(vnodeHook, parent, initialVNode)
        }

        // 3. 兼容Vue2：触发 hook:beforeMount 事件（__COMPAT__ 模式下）
        if (
          __COMPAT__ &&
          isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
        ) {
          instance.emit('hook:beforeMount')
        }

        // 恢复组件递归更新
        toggleRecurse(instance, true)

        // ========== 挂载核心逻辑：分「SSR水合」和「普通挂载」 ==========
        // 场景1：SSR客户端激活（Hydration）- 复用服务端渲染的DOM，只做状态激活
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
        }
        // 场景2：普通客户端挂载（非SSR）
        else {
          // custom element style injection 自定义元素样式注入
          // 自定义元素（Custom Element）样式注入：ShadowRoot场景下的样式处理
          if (
            root.ce &&
            // @ts-expect-error _def is private
            (root.ce as VueElement)._def.shadowRoot !== false
          ) {
            root.ce._injectChildStyle(type)
          }

          // 开发环境：记录render耗时
          if (__DEV__) {
            startMeasure(instance, `render`)
          }
          // ✅ 核心：生成组件根VNode（subTree）→ 执行renderComponentRoot（调用组件render函数）
          const subTree = (instance.subTree = renderComponentRoot(instance))
          // 开发环境：结束render耗时
          if (__DEV__) {
            endMeasure(instance, `render`)
          }

          // 开发环境：记录patch耗时
          if (__DEV__) {
            startMeasure(instance, `patch`)
          }
          // ✅ 核心：执行patch，将VNode挂载到真实DOM容器 → 首次DOM渲染的核心
          patch(
            null, // 旧VNode为null（首次挂载）
            subTree, // 新VNode（组件根VNode）
            container, // 挂载容器
            anchor, // 锚点元素
            instance, // 当前组件实例
            parentSuspense, // 父级Suspense
            namespace, // 元素命名空间
          )
          if (__DEV__) {
            endMeasure(instance, `patch`)
          }
          // 关联初始VNode的el到真实DOM元素（subTree.el是patch后生成的真实DOM）
          initialVNode.el = subTree.el
        }

        // 4. 执行 mounted 生命周期钩子（异步队列执行，确保DOM已挂载完成）
        // mounted hook
        if (m) {
          queuePostRenderEffect(m, parentSuspense)
        }

        // 5. 执行 VNode 钩子：onVnodeMounted（异步队列执行）
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

        // 6. 兼容Vue2：触发 hook:mounted 事件（异步队列执行）
        if (
          __COMPAT__ &&
          isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
        ) {
          queuePostRenderEffect(
            () => instance.emit('hook:mounted'),
            parentSuspense,
          )
        }

        // activated hook for keep-alive roots. 激活保持活动根的钩子
        // #1742 activated hook must be accessed after first render #1742 必须在首次渲染后访问已激活的钩子
        // since the hook may be injected by a child keep-alive 由于钩子可能被子进程保持活动状态时注入
        // 7. KeepAlive 专属：执行 activated 钩子（首次挂载且组件被KeepAlive包裹时）
        if (
          initialVNode.shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE ||
          (parent &&
            isAsyncWrapper(parent.vnode) &&
            parent.vnode.shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE)
        ) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense)
          // 兼容Vue2：触发 hook:activated 事件
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

        // 8. 标记组件已挂载完成，后续执行进入「更新阶段」
        instance.isMounted = true

        // 9. 开发环境/生产调试工具：通知devtools组件已添加
        if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
          devtoolsComponentAdded(instance)
        }

        // 10. 内存泄漏预防：解除对挂载阶段临时变量的引用
        // #2458: deference mount-only object parameters to prevent memleaks 遵循仅挂载对象参数以防止内存泄漏
        initialVNode = container = anchor = null as any
      }
      // 分支2：状态更新阶段（instance.isMounted 为 true）
      else {
        // 解构实例的更新相关变量：next（待更新VNode）、bu（beforeUpdate钩子）、u（updated钩子）等
        let { next, bu, u, parent, vnode } = instance

        // Suspense 兼容：处理未完成水合的异步根组件，避免更新崩溃
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

        // updateComponent 更新组件
        // This is triggered by mutation of component's own state (next: null) 这是由组件自身状态（next：null）的突变触发的
        // OR parent calling processComponent (next: VNode) 或者父级调用 processComponent 函数（下一个参数为 VNode）

        // 更新组件的前置处理：区分「自身状态更新」和「父组件触发更新」
        let originNext = next
        let vnodeHook: VNodeHook | null | undefined
        // 开发环境：推入警告上下文，方便定位更新相关的警告
        if (__DEV__) {
          pushWarningContext(next || instance.vnode)
        }

        // Disallow component effect recursion during pre-lifecycle hooks. 在前生命周期钩子期间禁止组件效应递归
        // 暂停组件递归更新：执行beforeUpdate钩子时禁止递归触发更新
        toggleRecurse(instance, false)

        // 处理待更新VNode（父组件触发更新时next有值，自身状态更新时next为null）
        if (next) {
          next.el = vnode.el
          updateComponentPreRender(instance, next, optimized)
        } else {
          next = vnode
        }

        // 1. 执行 beforeUpdate 生命周期钩子
        // beforeUpdate hook
        if (bu) {
          invokeArrayFns(bu)
        }

        // 2. 执行 VNode 钩子：onVnodeBeforeUpdate
        // onVnodeBeforeUpdate
        if ((vnodeHook = next.props && next.props.onVnodeBeforeUpdate)) {
          invokeVNodeHook(vnodeHook, parent, next, vnode)
        }

        // 3. 兼容Vue2：触发 hook:beforeUpdate 事件
        if (
          __COMPAT__ &&
          isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
        ) {
          instance.emit('hook:beforeUpdate')
        }

        // 恢复组件递归更新
        toggleRecurse(instance, true)

        // render
        if (__DEV__) {
          startMeasure(instance, `render`)
        }

        // 4. 生成新的组件根VNode（nextTree）→ 基于最新状态重新执行render函数
        const nextTree = renderComponentRoot(instance)
        if (__DEV__) {
          endMeasure(instance, `render`)
        }
        const prevTree = instance.subTree // 缓存旧的subTree（更新前的VNode）
        instance.subTree = nextTree // 更新实例的subTree为新VNode

        // 5. ✅ 核心：执行patch，对比新旧VNode，更新真实DOM
        if (__DEV__) {
          startMeasure(instance, `patch`)
        }
        patch(
          prevTree, // 旧VNode
          nextTree, // 新VNode
          // parent may have changed if it's in a teleport 如果处于传送状态，父级可能已更改
          // 挂载容器：Teleport场景下父节点可能变化，取旧VNode的真实父节点 --> 通过不依赖平台的方法实时获取一次
          hostParentNode(prevTree.el!)!,
          // anchor may have changed if it's in a fragment 如果锚点位于片段中，则可能已更改
          // 锚点元素：Fragment场景下锚点可能变化，取旧VNode的下一个宿主节点
          getNextHostNode(prevTree),
          instance, // 当前组件实例
          parentSuspense, // 父级Suspense
          namespace, // 元素命名空间
        )
        if (__DEV__) {
          endMeasure(instance, `patch`)
        }

        // 6. 关联新VNode的el到真实DOM元素
        next.el = nextTree.el

        // 7. HOC（高阶组件）专属：自身触发更新时，更新父组件VNode的el（保证HOC的DOM关联正确）
        if (originNext === null) {
          // self-triggered update. In case of HOC, update parent component 自触发更新。若发生 HOC（高阶组件），则更新父组件
          // vnode el. HOC is indicated by parent instance's subTree pointing vnode元素。HOC由父实例的子树指向来指示
          // to child component's vnode 到子组件的虚拟节点（vnode）
          updateHOCHostEl(instance, nextTree.el)
        }

        // 8. 执行 updated 生命周期钩子（异步队列执行，确保DOM已更新完成）
        // updated hook
        if (u) {
          queuePostRenderEffect(u, parentSuspense)
        }

        // 9. 执行 VNode 钩子：onVnodeUpdated（异步队列执行）
        // onVnodeUpdated
        if ((vnodeHook = next.props && next.props.onVnodeUpdated)) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook!, parent, next!, vnode),
            parentSuspense,
          )
        }

        // 10. 兼容Vue2：触发 hook:updated 事件（异步队列执行）
        if (
          __COMPAT__ &&
          isCompatEnabled(DeprecationTypes.INSTANCE_EVENT_HOOKS, instance)
        ) {
          queuePostRenderEffect(
            () => instance.emit('hook:updated'),
            parentSuspense,
          )
        }

        // 11. 开发环境/生产调试工具：通知devtools组件已更新
        if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
          devtoolsComponentUpdated(instance)
        }

        // 12. 开发环境：弹出警告上下文，恢复默认
        if (__DEV__) {
          popWarningContext()
        }
      }
    }

    // ========== 核心：创建响应式副作用（ReactiveEffect），绑定到组件实例 ==========
    // create reactive effect for rendering 创建渲染反应效果
    instance.scope.on() // 激活组件副作用作用域，接管后续副作用管理
    const effect = (instance.effect = new ReactiveEffect(componentUpdateFn))
    instance.scope.off() // 关闭组件副作用作用域（仅创建时临时开启）

    // 1. 定义instance.update：手动触发副作用执行的方法（强制更新组件）
    const update = (instance.update = effect.run.bind(effect))
    // 2. 定义instance.job：调度器任务（通过队列执行，避免重复更新）
    const job: SchedulerJob = (instance.job = effect.runIfDirty.bind(effect))
    job.i = instance // 关联任务到组件实例（调度器用）
    job.id = instance.uid // 任务唯一ID（去重/排序用）
    // 3. 设置副作用调度器：状态变更时，将job推入更新队列，而非立即执行（批处理优化）
    effect.scheduler = () => queueJob(job)

    // 4. 允许组件递归更新：#1801 #2043 组件渲染副作用需要支持递归更新（如更新中修改状态）
    // allowRecurse
    // #1801, #2043 component render effects should allow recursive updates 组件渲染效果应该允许递归更新
    toggleRecurse(instance, true)

    // 5. 开发环境：绑定依赖收集/触发的钩子（onTrack/onTrigger），用于调试
    if (__DEV__) {
      effect.onTrack = instance.rtc
        ? e => invokeArrayFns(instance.rtc!, e)
        : void 0
      effect.onTrigger = instance.rtg
        ? e => invokeArrayFns(instance.rtg!, e)
        : void 0
    }

    // 6. ✅ 首次执行update：触发组件「首次挂载」→ 执行componentUpdateFn的挂载分支
    update()
  }

  /**
   * Vue3 内部核心函数 - 组件预渲染阶段的【状态同步函数】
   * 核心使命：在组件真正执行render更新前，同步更新组件实例的核心状态（props/slots），
   *          并处理props更新触发的预刷新watcher；仅同步状态，不触发组件的render/补丁更新，
   *          主要用于「异步组件pending」「SUSPENSE未解析」等无需立即渲染的场景
   * 核心关联：在updateComponent的SUSPENSE异步未解析分支中被调用，是组件“只更状态不渲染”的核心逻辑
   *
   *
   * @param {ComponentInternalInstance} instance 待更新的组件内部实例
   * @param {VNode} nextVNode 新的组件VNode（包含最新的props/slots）
   * @param {boolean} optimized 是否开启编译优化（用于props/slots的优化更新）
   */
  const updateComponentPreRender = (
    instance: ComponentInternalInstance,
    nextVNode: VNode,
    optimized: boolean,
  ) => {
    // ========== 步骤1：绑定新VNode到组件实例 ==========
    // 确保新VNode的component属性指向当前组件实例，建立VNode与实例的关联
    nextVNode.component = instance

    // ========== 步骤2：保存旧props，更新实例的VNode关联 ==========
    // 缓存实例当前的旧props（用于后续props对比更新）
    const prevProps = instance.vnode.props
    // 将组件实例的vnode属性更新为新VNode（同步实例与最新VNode的关联）
    instance.vnode = nextVNode
    // 清空实例的next属性（待更新VNode），避免残留的next影响后续逻辑
    instance.next = null

    // ========== 步骤3：核心更新 - Props和Slots ==========
    // 1. 更新组件实例的props：对比新旧props，同步最新props到instance.props
    updateProps(instance, nextVNode.props, prevProps, optimized)
    // 2. 更新组件实例的slots：对比新旧slots，同步最新slots到instance.slots
    updateSlots(instance, nextVNode.children, optimized)

    // ========== 步骤4：处理预刷新回调（Pre-Flush Watchers） ==========
    // 暂停响应式依赖追踪：避免更新过程中触发不必要的依赖收集（性能优化）
    pauseTracking()
    // props update may have triggered pre-flush watchers. props 更新可能触发了 pre-flush 观察者
    // flush them before the render update. 在渲染更新之前刷新它们
    // props更新可能触发预刷新阶段的watcher（如watch的flush: 'pre'），
    // 需要在组件render更新前手动刷新这些watcher，保证状态同步
    flushPreFlushCbs(instance)
    // 恢复响应式依赖追踪：还原正常的依赖收集逻辑
    resetTracking()
  }

  /**
   * Vue3 核心核心函数 - 新旧VNode子节点的【全量Diff算法主入口】，子节点增量更新的兜底核心
   * 核心职责：对比新旧VNode的子节点（c1旧，c2新），根据「新旧子节点的类型组合」，执行差异化的增量更新逻辑
   * 核心能力：处理所有子节点场景：文本↔文本、文本↔数组、数组↔数组、数组↔空、空↔数组、空↔空
   * 核心逻辑：编译优化路径优先(patchFlag>0) → 无优化则按子节点类型全量判断 → 最小化DOM操作（复用/移动优先，挂载/卸载兜底）
   *   - 如果是编译器优化: 会走快捷通道调用对应的 diff 算法, 编译器保证两个新旧都是数组
   *      -- 如果是带 key 的子数组, 调用 patchKeyedChildren 方法(双端对比 + 最长递增子序列算法)
   *      -- 如果是不带 key 的子数组, 调用 patchUnkeyedChildren 方法比对
   *   - 其他根据新旧子节点的类型判断:
   *      -- ✔️ 场景 1：【新子节点 = 纯文本】 → 两种子情况
   *          --- 旧的子节点是数组, 调用 unmountChildren 方法卸载旧的子节点
   *          --- 新旧文本不同, 更新容器的文本内容
   *      -- ✔️ 场景 2：【新子节点 = 数组】 → 两种子情况
   *          --- 旧的子节点是数组, 调用 patchKeyedChildren 方法比对
   *          --- 旧的子节点是文本或空, 则先清空容器的文本内容, 在调用 mountChildren 方法挂载子节点
   *      -- 场景 3：【新子节点 = 无子节点 (null/undefined)】 → 两种子情况
   *          --- 旧的子节点是数组, 调用 unmountChildren 卸载旧的子节点
   *          --- 旧的子节点是文本, 则清空容器的文本内容
   *
   *
   * @param {VNode} n1 旧的父级VNode节点，取其children作为旧子节点c1
   * @param {VNode} n2 新的父级VNode节点，取其children作为新子节点c2
   * @param {Element} container 真实DOM容器，子节点挂载的父容器
   * @param {Element | null} anchor 锚点DOM节点，DOM插入/移动的参考位置，保证节点位置正确
   * @param {ComponentInternalInstance | null} parentComponent 父组件实例，用于钩子执行/指令/依赖收集
   * @param {SuspenseBoundary | null} parentSuspense 父级Suspense边界，用于异步组件的副作用调度
   * @param {ElementNamespace} namespace 元素命名空间(html/svg/mathml)，传给子节点处理函数做规范兼容
   * @param {string[] | null} slotScopeIds 插槽作用域ID，用于scoped样式隔离
   * @param {boolean} [optimized=false] 是否为编译优化后的VNode，默认false → 走全量diff
   * @returns {void} 无返回值，所有操作均为真实DOM的增/删/改/移副作用
   */
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
    // ========== 第一步：初始化变量，解构新旧子节点 + 形状标记 ==========
    // 旧子节点：取旧VNode的children，无则为undefined/null
    const c1 = n1 && n1.children
    // 旧VNode的形状标记：无旧VNode则为0，用于判断旧子节点的类型
    const prevShapeFlag = n1 ? n1.shapeFlag : 0
    // 新子节点：取新VNode的children，无则为undefined/null
    const c2 = n2.children
    // 解构新VNode的 补丁标记(patchFlag) + 形状标记(shapeFlag)
    const { patchFlag, shapeFlag } = n2

    // ========== 第二步：【编译优化快速路径 - 优先级最高 ✅性能最优】 ==========
    // fast path 快速路径
    // patchFlag > 0 说明编译器给子节点打了优化标记，无需全量类型判断，直接走对应优化逻辑
    if (patchFlag > 0) {
      // 分支1：子节点是【带key的VNode数组】→ 走最优diff算法 patchKeyedChildren
      // 备注：该标记包含「全key/部分key」两种情况，只要有key就走这个逻辑
      if (patchFlag & PatchFlags.KEYED_FRAGMENT) {
        // this could be either fully-keyed or mixed (some keyed some not) 这可以是完全键控的，也可以是混合键控的（部分键控，部分非键控）
        // presence of patchFlag means children are guaranteed to be arrays patchFlag 的存在意味着 children 必定是数组
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
        return // 执行完直接返回，不走后续逻辑
      }
      // 分支2：子节点是【无key的VNode数组】→ 走简单diff算法 patchUnkeyedChildren
      else if (patchFlag & PatchFlags.UNKEYED_FRAGMENT) {
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
        return // 执行完直接返回，不走后续逻辑
      }
    }

    // ========== 第三步：【无编译优化 - 全量子节点类型判断 核心主逻辑】 ==========
    // children has 3 possibilities: text, array or no children. 子项有 3 种可能性：文本、数组或无子项。
    // 核心说明：子节点只有3种可能 → 纯文本、VNode数组、无子节点(null/undefined)
    // 所有逻辑基于「新旧子节点的类型组合」做差异化处理，共6种组合场景，全覆盖无遗漏
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // text children fast path 文本子节点快速路径

      // ✅ 场景1：新子节点 是【纯文本】
      // 子场景1.1：旧子节点 是【VNode数组】→ 先卸载所有旧的数组子节点，再设置新文本
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1 as VNode[], parentComponent, parentSuspense)
      }
      // 子场景1.2：新旧文本内容不同 → 直接更新容器的文本内容，复用容器DOM，无其他操作
      if (c2 !== c1) {
        hostSetElementText(container, c2 as string)
      }
    } else {
      // ✅ 场景2：新子节点 不是文本 → 即【数组/无子节点】
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // prev children was array 之前的子节点是数组
        // ✅ 子场景2.1：旧子节点 是【VNode数组】
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // two arrays, cannot assume anything, do full diff 两个数组，不能假设任何事情，进行完整的比较
          // ✅ 组合：旧数组 → 新数组 → 核心场景，走全量最优diff算法 patchKeyedChildren
          // 对比新旧数组子节点，完成增删改移，最小化DOM操作，Vue3 Diff核心
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
        }
        // ✅ 组合：旧数组 → 新的无子节点 → 直接卸载所有旧子节点即可
        else {
          // no new children, just unmount old
          unmountChildren(c1 as VNode[], parentComponent, parentSuspense, true)
        }
      }
      // ✅ 子场景2.2：旧子节点 是【纯文本 / 无子节点(null/undefined)】
      else {
        // prev children was text OR null 之前的子节点的值为文本或为空
        // new children is array OR null 现在的子节点的值为数组或为空
        // ✅ 子场景2.2：旧子节点 是【纯文本 / 无子节点(null/undefined)】
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // ✅ 组合：旧文本 → 新数组/空 → 先清空容器的文本内容，为后续挂载数组做准备
          hostSetElementText(container, '')
        }
        // mount new if array 挂载新的子节点数组
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 批量挂载子节点
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

  // can be all-keyed or mixed 可以是全键控或混合键控
  /**
   * Vue3 终极核心函数 - 带key的VNode数组子节点【最优Diff算法】，双端对比+最长递增子序列的完整实现
   * 核心职责：对比带key的新旧子节点数组(c1旧/c2新)，完成「新增、删除、修改、移动」四大操作，极致最小化DOM操作
   * 核心原则：能复用则复用、能更新则更新、能移动则移动、能卸载则卸载、最后才挂载 → 无任何冗余DOM操作
   * 核心算法：分5个阶段执行，从简单到复杂，层层兜底，覆盖所有数组操作场景：正序/倒序/乱序/增删/替换
   *   - ✅ 阶段 1：从头同步匹配，如果是同类型节点则patch更新，否则终止匹配
   *   - ✅ 阶段 2：从尾同步匹配，如果是同类型则patch更新，否则终止匹配
   *   - 此时剩下三种情况：
   *      -- ✅ 阶段 3：旧完新剩 → 批量挂载新增节点
   *      -- ✅ 阶段 4：新完旧剩 → 批量卸载多余节点
   *      -- ✅ 阶段 5：新旧都剩 → 乱序序列的核心处理
   *          --- ✔️ 5.1 构建 keyToNewIndexMap：key→新索引的映射表，让后续的节点匹配通过 key 快速查找(O(1))
   *          --- ✔️ 5.2 遍历旧数组，完成「匹配更新 + 标记删除 + 记录位置」
   *                  ---- 遍历旧数组剩余节点，通过 key或者暴力查找可复用的 快速查找新数组中的对应节点，完成 3 件事：
   *                        ----- 无匹配 → 卸载旧节点；
   *                        ----- 有匹配 → patch更新节点，复用 DOM；
   *                        ----- 记录「新索引→旧索引」的映射关系到 newIndexToOldIndexMap
   *                  ---- 通过maxNewIndexSoFar判断节点是否需要移动 → 节点乱序的核心判断依据
   *                        ----- 如果当前新索引 > 之前的最大索引 → 节点顺序正常，无需移动；
   *                        ----- 如果当前新索引 < 之前的最大索引 → 节点顺序被打乱，标记moved=true，需要后续移动；
   *           --- ✔️ 5.3 最长递增子序列 + 反向遍历移动 / 挂载节点
   *                   ---- 生成最长递增子序列：基于newIndexToOldIndexMap生成，该序列的含义是 「无需移动的稳定节点索引」 → 这些节点的相对顺序在新旧数组中一致，不需要移动，能最大程度减少 DOM 操作；
   *                   ---- 反向遍历新数组：反向遍历能复用已更新节点的 DOM 作为锚点，保证节点插入的位置绝对正确
   *                   ---- 节点处理逻辑
   *                          ----- 映射表值为 0 → 新增节点，执行挂载；
   *                          ----- 节点不在稳定序列中 → 调用move移动节点，无 DOM 重建；
   *                          ----- 节点在稳定序列中 → 无需移动，游标前移即可；
   *
   *
   * @param {VNode[]} c1 旧的子节点VNode数组（必带key，或部分带key）
   * @param {VNodeArrayChildren} c2 新的子节点VNode数组（必带key，或部分带key）
   * @param {RendererElement} container 真实DOM容器，子节点挂载的父容器
   * @param {RendererNode | null} parentAnchor 父级锚点，兜底的DOM插入参考位置
   * @param {ComponentInternalInstance | null} parentComponent 父组件实例，钩子/指令/依赖收集
   * @param {SuspenseBoundary | null} parentSuspense 父级Suspense边界，异步组件副作用调度
   * @param {ElementNamespace} namespace 命名空间(html/svg/mathml)，保证标签/属性解析正确
   * @param {string[] | null} slotScopeIds 插槽作用域ID，scoped样式隔离
   * @param {boolean} optimized 是否为编译优化后的VNode，true则走编译优化逻辑
   * @returns {void} 无返回值，所有操作均为真实DOM的增/删/改/移副作用
   */
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
    // ========== 初始化核心变量 ==========
    let i = 0 // 数组「起始游标」，从头部开始遍历，双端对比的核心游标
    const l2 = c2.length // 新数组的总长度
    // 旧数组的「尾部游标」，初始指向最后一个元素
    let e1 = c1.length - 1 // prev ending index 之前结束索引
    // 新数组的「尾部游标」，初始指向最后一个元素
    let e2 = l2 - 1 // next ending index 下一个结束索引

    // ========== 阶段1: 从头开始同步匹配 (sync from start) ✅最简单场景，正序相同节点 ==========
    // 1. sync from start 从头开始同步
    // (a b) c
    // (a b) d e

    // 匹配规则：从数组头部(i=0)开始，依次对比c1[i]和c2[i]，直到节点不匹配为止
    // 适用场景：数组开头的节点无变化，例如：(a b) c  →  (a b) d e
    while (i <= e1 && i <= e2) {
      const n1 = c1[i] // 旧数组当前游标节点
      // 标准化/克隆新数组节点，统一格式，避免复用副作用
      const n2 = (c2[i] = optimized
        ? cloneIfMounted(c2[i] as VNode)
        : normalizeVNode(c2[i]))

      // 是可复用的同类型节点 → 调用patch更新节点（属性/子节点），复用真实DOM
      if (isSameVNodeType(n1, n2)) {
        // 无需描点, 应该肯定可以复用, 直接操作之前的 DOM
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
        break // 节点不匹配，终止头部匹配，进入后续阶段
      }
      i++ // 游标后移，继续匹配下一个节点
    }

    // ========== 阶段2: 从尾开始同步匹配 (sync from end) ✅次简单场景，倒序相同节点 ==========
    // 2. sync from end 从末尾同步
    // a (b c)
    // d e (b c)

    // 匹配规则：从数组尾部(e1/e2)开始，依次对比c1[e1]和c2[e2]，直到节点不匹配为止
    // 适用场景：数组结尾的节点无变化，例如：a (b c)  →  d e (b c)
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1] // 旧数组尾部当前节点
      // 标准化/克隆新数组节点
      const n2 = (c2[e2] = optimized
        ? cloneIfMounted(c2[e2] as VNode)
        : normalizeVNode(c2[e2]))

      // 是可复用的同类型节点 → patch更新，复用真实DOM
      if (isSameVNodeType(n1, n2)) {
        // 无需描点, 应该肯定可以复用, 直接操作之前的 DOM
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
        break // 节点不匹配，终止尾部匹配，进入后续阶段
      }
      e1-- // 旧数组尾部游标前移
      e2-- // 新数组尾部游标前移
    }

    // ========== 阶段3: 旧数组遍历完毕，新数组还有剩余 → 批量挂载新增节点 ✅新增场景 ==========
    // 3. common sequence + mount 通用序列+挂载
    // (a b)
    // (a b) c
    // i = 2, e1 = 1, e2 = 2
    // (a b)
    // c (a b)
    // i = 0, e1 = -1, e2 = 0

    // 触发条件：i > e1 → 旧数组的所有节点都完成了匹配，新数组还有未匹配的节点
    // 适用场景1：旧: [a,b]  → 新: [a,b,c]  (i=2, e1=1, e2=2)
    // 适用场景2：旧: []     → 新: [a,b,c]  (i=0, e1=-1, e2=2)
    // 适用场景3：旧: [a,b]  → 新: [c,a,b]  (i=0, e1=-1, e2=0)
    if (i > e1) {
      if (i <= e2) {
        // 计算新增节点的「插入锚点」：新数组剩余节点的下一个节点的el，无则用父级锚点
        const nextPos = e2 + 1
        const anchor = nextPos < l2 ? (c2[nextPos] as VNode).el : parentAnchor

        // 遍历新数组剩余节点，批量执行「挂载」操作（patch(null, n2)）
        while (i <= e2) {
          /**
           * 可能需要描点(描点是当前要插入位置的下一个节点)
           *  - 如果尾部匹配到了的话, 那么就是尾部匹配的元素
           *  - 没有的话, 就直接不需要描点, 插入到最后一个
           *  - parentAnchor 应该是其他作用, 暂不关心
           */
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

    // ========== 阶段4: 新数组遍历完毕，旧数组还有剩余 → 批量卸载多余节点 ✅删除场景 ==========
    // 4. common sequence + unmount 通用序列+卸载
    // (a b) c
    // (a b)
    // i = 2, e1 = 2, e2 = 1
    // a (b c)
    // (b c)
    // i = 0, e1 = 0, e2 = -1

    // 触发条件：i > e2 → 新数组的所有节点都完成了匹配，旧数组还有未匹配的节点
    // 适用场景1：旧: [a,b,c]  → 新: [a,b]  (i=2, e1=2, e2=1)
    // 适用场景2：旧: [a,b,c]  → 新: []     (i=0, e1=2, e2=-1)
    // 适用场景3：旧: [a,b,c]  → 新: [b,c]  (i=0, e1=0, e2=-1)
    else if (i > e2) {
      // 遍历旧数组剩余节点，批量执行「卸载」操作，清理DOM/事件/组件
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true)
        i++
      }
    }

    // ========== 阶段5: 最复杂场景 → 新旧数组都有剩余节点，且为「乱序序列」 ✅核心核心核心 ==========
    // 5. unknown sequence 未知序列
    // [i ... e1 + 1]: a b [c d e] f g
    // [i ... e2 + 1]: a b [e d c h] f g
    // i = 2, e1 = 4, e2 = 5

    // 触发条件：i <= e1 && i <= e2 → 首尾匹配后，中间部分的节点是乱序的，无法通过简单遍历匹配
    // 适用场景：旧: [a,b,c,d,e,f]  → 新: [a,b,e,d,c,h,f]
    // 核心处理逻辑：构建key映射表 → 匹配节点更新 → 标记移动 → 最长递增子序列计算 → 移动+挂载节点
    else {
      // 旧数组剩余节点的「起始游标」(start 1)
      const s1 = i // prev starting index 上一个开始索引
      // 新数组剩余节点的「起始游标」(start 2)
      const s2 = i // next starting index 下一个开始索引

      // ========== 5.1 构建「新数组key:索引」的映射表 keyToNewIndexMap ==========
      // 5.1 build key:index map for newChildren 构建 key:newChildren 的索引图

      // 核心目的：通过节点的key，能在O(1)时间内找到新数组中对应的节点索引，避免暴力遍历，性能从O(n²)→O(n)
      const keyToNewIndexMap: Map<PropertyKey, number> = new Map()
      // 构建新的子节点的 Map, 必须需要存在 Key
      for (i = s2; i <= e2; i++) {
        const nextChild = (c2[i] = optimized
          ? cloneIfMounted(c2[i] as VNode)
          : normalizeVNode(c2[i]))
        if (nextChild.key != null) {
          // 开发环境：检测重复key，抛出警告 → key必须唯一的原因
          if (__DEV__ && keyToNewIndexMap.has(nextChild.key)) {
            warn(
              `Duplicate keys found during update:`, // 更新期间发现重复密钥
              JSON.stringify(nextChild.key),
              `Make sure keys are unique.`, // 确保密钥是唯一的
            )
          }

          // 存入映射表：key → 新数组索引
          keyToNewIndexMap.set(nextChild.key, i)
        }
      }

      // ========== 5.2 遍历旧数组剩余节点，完成「匹配更新+标记删除+记录节点位置」 ==========
      // 5.2 loop through old children left to be patched and try to patch 循环遍历剩下要修补的老孩子并尝试修补
      // matching nodes & remove nodes that are no longer present 匹配节点并删除不再存在的节点
      let j // 临时游标，用于无key节点的暴力匹配
      let patched = 0 // 已完成patch更新的节点数量
      const toBePatched = e2 - s2 + 1 // 新数组剩余节点的总数量（需要被patch的节点数）
      let moved = false // 标记：是否存在节点需要「移动」，初始为false
      // used to track whether any node has moved 用于跟踪任何节点是否移动
      let maxNewIndexSoFar = 0 // 记录遍历过程中，遇到的最大新数组索引值 → 核心判断节点是否需要移动
      // works as Map<newIndex, oldIndex> 作为 Map<newIndex, oldIndex> 类型工作
      // Note that oldIndex is offset by +1 注意，oldIndex 被偏移了 +1
      // and oldIndex = 0 is a special value indicating the new node has 而oldIndex = 0是一个特殊值，表示新节点具有
      // no corresponding old node. 没有对应的旧节点。
      // used for determining longest stable subsequence 用于确定最长稳定子序列

      // 构建 新索引→旧索引 的映射表 newIndexToOldIndexMap，长度=toBePatched
      // 核心规则：1. 初始值全为0，表示「无对应旧节点，需要挂载」
      //          2. 赋值为 i+1（旧索引+1），因为旧索引可能为0，用+1避免和初始值混淆
      //          3. 该数组是生成「最长递增子序列」的核心依据
      const newIndexToOldIndexMap = new Array(toBePatched)
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0

      // 遍历旧数组的剩余节点，逐个匹配+更新
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i] // 旧数组当前节点
        // 已匹配的节点数 ≥ 需要匹配的节点数 → 剩余旧节点无匹配，直接卸载
        if (patched >= toBePatched) {
          // all new children have been patched so this can only be a removal 所有新的子项都已修补，因此这只能是删除
          unmount(prevChild, parentComponent, parentSuspense, true)
          continue
        }
        let newIndex // 新数组中匹配到的节点索引
        // 情况1：旧节点有key → 通过映射表快速查找新数组中的对应索引（O(1)）
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          // key-less node, try to locate a key-less node of the same type 无键节点，尝试定位相同类型的无键节点

          // 情况2：旧节点无key → 兜底暴力匹配，找同类型且未被匹配的节点（性能差，不推荐）
          for (j = s2; j <= e2; j++) {
            // 在这里不会匹配到新数组中存在 key 的节点, 因为 isSameVNodeType 方法保证 key 需要一致
            if (
              newIndexToOldIndexMap[j - s2] === 0 &&
              isSameVNodeType(prevChild, c2[j] as VNode)
            ) {
              newIndex = j
              break
            }
          }
        }

        // 无匹配到新节点 → 该旧节点被删除，执行卸载
        if (newIndex === undefined) {
          unmount(prevChild, parentComponent, parentSuspense, true)
        }
        // 有匹配到新节点
        else {
          // 有匹配到新节点 → 新索引 → 旧索引+1
          newIndexToOldIndexMap[newIndex - s2] = i + 1

          // 核心判断：是否需要移动节点
          // 如果 当前新索引 < 之前的最大新索引 → 节点顺序被打乱，需要移动 → 标记moved=true
          // 如果 当前新索引 > 之前的最大新索引 → 更新最大索引，节点顺序正常，无需移动
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            moved = true
          }

          // 匹配成功 → 调用patch更新节点（属性/子节点），复用真实DOM
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

      // ========== 5.3 核心收尾：基于「最长递增子序列」完成「节点移动+新增挂载」 ==========
      // 5.3 move and mount 移动和安装
      // generate longest stable subsequence only when nodes have moved 仅当节点移动时才生成最长的稳定子序列

      // 生成最长递增子序列：只有节点需要移动时(moved=true)才生成，否则无需处理
      // 该序列的含义：「无需移动的稳定节点索引」，这些节点保持原有顺序，其余节点按需移动即可
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : EMPTY_ARR
      j = increasingNewIndexSequence.length - 1 // 最长递增子序列的尾部游标，反向遍历
      // looping backwards so that we can use last patched node as anchor 向后循环，以便我们可以使用最后修补的节点作为锚点
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i // 新数组的真实索引
        const nextChild = c2[nextIndex] as VNode // 新数组当前节点
        const anchorVNode = c2[nextIndex + 1] as VNode // 锚点节点：当前节点的下一个节点
        // 计算最终的插入锚点：优先用下一个节点的el，异步组件则用占位符，兜底用父锚点
        const anchor =
          nextIndex + 1 < l2
            ? // #13559, #14173 fallback to el placeholder for unresolved async component 对于未解析的异步组件，回退到 el 占位符
              anchorVNode.el || resolveAsyncComponentPlaceholder(anchorVNode)
            : parentAnchor

        // 情况1：映射表值为0 → 无对应旧节点，是新增节点 → 执行挂载操作
        if (newIndexToOldIndexMap[i] === 0) {
          // mount new 安装新的
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
          // move if: 如果移动
          // There is no stable subsequence (e.g. a reverse) 没有稳定的子序列（例如反向）
          // OR current node is not among the stable sequence 或者当前节点不在稳定序列之中
          // 移动条件：1. 无稳定序列  2. 当前节点不在稳定序列中
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

  /**
   * Vue3 内部核心工具函数 - 递归获取指定VNode对应的「下一个宿主节点（真实DOM节点）」
   * 核心使命：在patch更新阶段（尤其是列表/Fragment/Teleport场景），精准找到当前VNode对应的真实DOM节点的下一个兄弟节点，
   *          作为patch的锚点（anchor），保证DOM插入/移动的位置准确；处理组件、Suspense、Teleport等特殊VNode类型的边界场景
   * 核心关联：在setupRenderEffect的update分支中，调用patch时作为锚点参数传入，是DOM操作位置精准性的关键保障
   *
   * @type {NextFn} 函数类型：接收VNode，返回Element | Text | Comment | null（真实DOM节点/空）
   * @param {VNode} vnode 目标VNode，需要获取其对应的下一个真实DOM节点
   * @returns {Element | Text | Comment | null} 当前VNode对应的下一个宿主节点（真实DOM），无则返回null
   */
  const getNextHostNode: NextFn = vnode => {
    // ========== 分支1：处理组件类型VNode（ShapeFlags.COMPONENT） ==========
    // 组件VNode本身无直接对应的真实DOM，需递归获取组件内部根VNode（subTree）的下一个宿主节点
    if (vnode.shapeFlag & ShapeFlags.COMPONENT) {
      return getNextHostNode(vnode.component!.subTree)
    }
    // ========== 分支2：处理Suspense类型VNode（开启Suspense特性时） ==========
    if (__FEATURE_SUSPENSE__ && vnode.shapeFlag & ShapeFlags.SUSPENSE) {
      // Suspense有专属的next方法，返回其内部逻辑计算的下一个宿主节点（适配异步加载场景）
      return vnode.suspense!.next()
    }

    // ========== 分支3：基础逻辑：获取当前VNode对应真实DOM的下一个兄弟节点 ==========
    // 优先取vnode.anchor（锚点节点），无则取vnode.el（当前VNode对应的真实DOM节点），
    // 调用平台无关的hostNextSibling获取下一个兄弟节点（适配浏览器/小程序等不同平台）
    const el = hostNextSibling((vnode.anchor || vnode.el)!)

    // ========== 分支4：修复Teleport场景的下一个节点查找问题（#9071, #9313） ==========
    // 问题背景：Teleport的内容会被移动到其他DOM位置，导致nextSibling查找时被干扰，
    // 比如Teleport内容的结束标记会出现在正常节点之间，需跳过这些标记
    // TeleportEndKey：Vue3内部标记Teleport内容结束的特殊Symbol键
    // #9071, #9313
    // teleported content can mess up nextSibling searches during patch so 传送的内容可能会在补丁期间扰乱 nextSibling 搜索，因此
    // we need to skip them during nextSibling search 我们需要在 nextSibling 搜索期间跳过它们
    const teleportEnd = el && el[TeleportEndKey]

    // 如果找到Teleport结束标记节点，则跳过它，继续找下一个兄弟节点；否则返回原el
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

/**
 * Vue3 内部核心纯工具函数 - 解析当前VNode的「子节点应该使用的命名空间」
 * 核心职责：根据父元素的当前命名空间 + 当前VNode的标签类型+属性，判断子节点的命名空间继承规则
 * 核心逻辑：判断是否是「能嵌套HTML的特殊标签」，若是则返回undefined(等价HTML命名空间)，否则继承父级命名空间
 *
 * @param {VNode} { type, props } - 解构传入的当前VNode节点，仅用到两个属性：
 *                                  type：当前节点的标签类型（如 'foreignObject' / 'annotation-xml' / 'div' / 'svg'）
 *                                  props：当前节点的属性对象（可能为null/undefined）
 * @param {ElementNamespace} currentNamespace - 当前父元素的命名空间（父级传递下来的，如svg/mathml/html）
 * @returns {ElementNamespace} - 返回子节点应该使用的最终命名空间：要么是undefined(HTML)，要么继承父级的命名空间
 */
function resolveChildrenNamespace(
  { type, props }: VNode,
  currentNamespace: ElementNamespace,
): ElementNamespace {
  // 核心判断逻辑：满足以下两个特殊场景之一 → 返回undefined(子节点用HTML命名空间)，否则返回父级命名空间
  return (
    // 场景1：父级是SVG命名空间 + 当前标签是foreignObject → SVG的官方特殊标签，内部支持嵌套HTML
    (currentNamespace === 'svg' && type === 'foreignObject') ||
      // 场景2：父级是MathML命名空间 + 当前标签是annotation-xml + 存在encoding属性 + encoding属性包含'html' → MathML的HTML嵌套场景
      (currentNamespace === 'mathml' &&
        type === 'annotation-xml' &&
        props &&
        props.encoding &&
        props.encoding.includes('html'))
      ? // 满足任一特殊场景 → 返回undefined，Vue内部会将undefined解析为「html命名空间」
        undefined
      : // 不满足特殊场景 → 子节点继承父级的命名空间（默认规则）
        currentNamespace
  )
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
