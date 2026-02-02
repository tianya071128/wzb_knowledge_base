import {
  EMPTY_ARR,
  PatchFlags,
  ShapeFlags,
  SlotFlags,
  extend,
  isArray,
  isFunction,
  isObject,
  isOn,
  isString,
  normalizeClass,
  normalizeStyle,
} from '@vue/shared'
import {
  type ClassComponent,
  type Component,
  type ComponentInternalInstance,
  type ConcreteComponent,
  type Data,
  isClassComponent,
} from './component'
import type { RawSlots } from './componentSlots'
import {
  type ReactiveFlags,
  type Ref,
  isProxy,
  isRef,
  toRaw,
} from '@vue/reactivity'
import type { AppContext } from './apiCreateApp'
import {
  type Suspense,
  type SuspenseBoundary,
  type SuspenseImpl,
  isSuspense,
} from './components/Suspense'
import type { DirectiveBinding } from './directives'
import {
  type TransitionHooks,
  setTransitionHooks,
} from './components/BaseTransition'
import { warn } from './warning'
import {
  type Teleport,
  type TeleportImpl,
  isTeleport,
} from './components/Teleport'
import {
  currentRenderingInstance,
  currentScopeId,
} from './componentRenderContext'
import type { RendererElement, RendererNode } from './renderer'
import { NULL_DYNAMIC_COMPONENT } from './helpers/resolveAssets'
import { hmrDirtyComponents } from './hmr'
import { convertLegacyComponent } from './compat/component'
import { convertLegacyVModelProps } from './compat/componentVModel'
import { defineLegacyVNodeProperties } from './compat/renderFn'
import { ErrorCodes, callWithAsyncErrorHandling } from './errorHandling'
import type { ComponentPublicInstance } from './componentPublicInstance'
import { isInternalObject } from './internalObject'

export const Fragment = Symbol.for('v-fgt') as any as {
  __isFragment: true
  new (): {
    $props: VNodeProps
  }
}
export const Text: unique symbol = Symbol.for('v-txt')
export const Comment: unique symbol = Symbol.for('v-cmt')
export const Static: unique symbol = Symbol.for('v-stc')

export type VNodeTypes =
  /**
   * 普通 HTML / 自定义元素标签名
   *  -- 最常用的类型，比如 'div'、'span'、'button'、'my-custom-element'（自定义元素），对应原生 DOM 元素。
   */
  | string
  /**
   * 已创建的虚拟DOM节点对象
   * -- 表示一个完整的VNode实例，包含所有渲染所需的信息如标签名、属性、子节点等
   */
  | VNode
  /**
   * 组件定义
   * -- 用户定义或内置的组件函数、类或配置对象，用于渲染组件实例
   */
  | Component
  /**
   * 文本节点类型
   * -- 表示纯文本内容的虚拟DOM节点，用于渲染文本内容而非元素
   */
  | typeof Text
  /**
   * 静态节点类型
   * -- 表示不会改变的静态内容，Vue会对其进行特殊优化处理
   */
  | typeof Static
  /**
   * 注释节点类型
   * -- 表示DOM中的注释节点
   */
  | typeof Comment
  /**
   * 片段类型
   * -- Vue 3中的Fragment组件，允许组件返回多个根节点
   */
  | typeof Fragment
  /**
   * 传送门类型
   * -- Vue 3中的Teleport组件，用于将内容渲染到DOM树的任意位置（如body或其他DOM节点）
   */
  | typeof Teleport
  /**
   * 传送门实现类型
   * -- Teleport组件的内部实现类型
   */
  | typeof TeleportImpl
  /**
   * 异步组件占位符类型
   * -- Vue 3中的Suspense组件，用于处理异步组件加载状态
   */
  | typeof Suspense
  /**
   * 异步组件实现类型
   * -- Suspense组件的内部实现类型
   */
  | typeof SuspenseImpl

export type VNodeRef =
  | string
  | Ref
  | ((
      ref: Element | ComponentPublicInstance | null,
      refs: Record<string, any>,
    ) => void)

export type VNodeNormalizedRefAtom = {
  /**
   * 该 ref 所属的组件内部实例（上下文）
   *
   * component instance 组件实例
   */
  i: ComponentInternalInstance
  /**
   * 实际的 ref 核心值（VNodeRef 是 ref 的原始类型）
   *   1. 字符串：如 ref="foo" → r = "foo"；
   *   2. 函数：如 ref={el => {}} → r = 该函数；
   *   3. 响应式 ref 对象：如 ref={fooRef}（setup 中声明的 const fooRef = ref()）→ r = fooRef；
   * - 这是 ref 的 “核心值”，Vue 最终要把 DOM / 组件实例赋值给这个 r
   *
   * Actual ref 实际参考值
   */
  r: VNodeRef
  /**
   * 挂载到 componetnsInstance.refs 参考使用的 key
   *
   * setup ref key 设置参考键
   */
  k?: string
  /**
   * refInFor 标记（是否在 v-for 循环中）
   *  - 作用：Vue 识别到 f: true 时，会把多个 ref 收集到数组中（而非覆盖）
   *
   * refInFor marker refInFor 标记
   */
  f?: boolean
}

export type VNodeNormalizedRef =
  | VNodeNormalizedRefAtom
  | VNodeNormalizedRefAtom[]

type VNodeMountHook = (vnode: VNode) => void
type VNodeUpdateHook = (vnode: VNode, oldVNode: VNode) => void
export type VNodeHook =
  | VNodeMountHook
  | VNodeUpdateHook
  | VNodeMountHook[]
  | VNodeUpdateHook[]

// https://github.com/microsoft/TypeScript/issues/33099
export type VNodeProps = {
  key?: PropertyKey
  ref?: VNodeRef
  ref_for?: boolean
  ref_key?: string

  // vnode hooks
  onVnodeBeforeMount?: VNodeMountHook | VNodeMountHook[]
  onVnodeMounted?: VNodeMountHook | VNodeMountHook[]
  onVnodeBeforeUpdate?: VNodeUpdateHook | VNodeUpdateHook[]
  onVnodeUpdated?: VNodeUpdateHook | VNodeUpdateHook[]
  onVnodeBeforeUnmount?: VNodeMountHook | VNodeMountHook[]
  onVnodeUnmounted?: VNodeMountHook | VNodeMountHook[]
}

type VNodeChildAtom =
  | VNode
  | string
  | number
  | boolean
  | null
  | undefined
  | void

export type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChildAtom>

export type VNodeChild = VNodeChildAtom | VNodeArrayChildren

export type VNodeNormalizedChildren =
  | string
  | VNodeArrayChildren
  | RawSlots
  | null

export interface VNode<
  HostNode = RendererNode,
  HostElement = RendererElement,
  ExtraProps = { [key: string]: any },
> {
  /**
   * 标记当前对象是 VNode（而非普通 JS 对象），Vue 内部通过这个标识快速判断类型
   * @internal
   */
  __v_isVNode: true

  /**
   * 告诉 Vue 响应式系统 “跳过对这个 VNode 的代理”，因为 VNode 不需要响应式追踪，避免性能开销
   * @internal
   */
  [ReactiveFlags.SKIP]: true

  /** VNode 的类型，比如：元素标签（div/span）、组件（MyComponent）、Fragment（片段）、Teleport 等 */
  type: VNodeTypes
  // VNode 的属性集合，包含 DOM 属性（如 class/style）、Vue 内置 props（如 key/ref）、自定义扩展属性
  props: (VNodeProps & ExtraProps) | null
  // 节点唯一标识，用于 diff 算法优化（判断节点是否可复用），值可以是字符串 / 数字 / Symbol
  key: PropertyKey | null
  // 引用属性，关联真实 DOM 元素或组件实例（对应模板中的 ref 指令）
  ref: VNodeNormalizedRef | null
  /**
   * SFC 样式隔离的作用域 ID（对应 <style scoped>），创建 VNode 时从当前渲染上下文赋值
   *
   * SFC only. This is assigned on vnode creation using currentScopeId 仅限 SFC。这是在使用 currentScopeId 创建 vnode 时分配的
   * which is set alongside currentRenderingInstance. 与 currentRenderingInstance 一起设置
   */
  scopeId: string | null
  /**
   * 插槽样式隔离 ID（对应 <style :slotted>），仅用于插槽片段 / 组件 VNode，实现插槽样式隔离
   *
   * SFC only. This is assigned to: 仅限 SFC。这被分配给
   * - Slot fragment vnodes with :slotted SFC styles. 具有 :slotted SFC 样式的插槽片段 vnode
   * - Component vnodes (during patch/hydration) so that its root node can 组件 vnode（在补丁/水合作用期间），以便其根节点可以
   *   inherit the component's slotScopeIds 继承组件的slotScopeIds
   * @internal
   */
  slotScopeIds: string[] | null
  /** 子节点（已规范化），可以是字符串（文本）、VNode 数组、插槽函数等 */
  children: VNodeNormalizedChildren
  /** 组件实例（仅组件类型 VNode 有值），指向组件的内部实例（包含组件的状态、生命周期等） */
  component: ComponentInternalInstance | null
  /** 自定义指令集合（如 v-if/v-for/ 自定义指令），存储指令的绑定信息 */
  dirs: DirectiveBinding[] | null
  /** 过渡动画钩子（对应 <transition> 组件），存储动画的触发 / 结束等钩子函数 */
  transition: TransitionHooks<HostElement> | null

  // DOM
  /** VNode 对应的真实 DOM 节点（挂载后赋值），比如 div 元素对象 */
  el: HostNode | null
  /** 异步组件的占位节点（加载中显示的内容） */
  placeholder: HostNode | null // async component el placeholder 异步组件 el 占位符
  /** 片段（Fragment）的锚点节点，用于定位 Fragment 的位置 */
  anchor: HostNode | null // fragment anchor fragment anchor
  /** Teleport（瞬移）的目标容器（对应 to 属性） */
  target: HostElement | null // teleport target 传送目标
  /** Teleport 目标容器的起始节点，用于精准插入位置 */
  targetStart: HostNode | null // teleport target start anchor 传送目标起始锚点
  /** Teleport 目标容器的锚点节点，用于精准插入位置 */
  targetAnchor: HostNode | null // teleport target anchor 传送目标锚点
  /**
   * number of elements contained in a static vnode 静态 vnode 中包含的元素数量
   * @internal
   */
  staticCount: number

  // suspense
  /** 关联的 Suspense 边界实例（对应 <Suspense> 组件） */
  suspense: SuspenseBoundary | null
  /**
   * SSR（服务端渲染）的内容节点
   * @internal
   */
  ssContent: VNode | null
  /**
   * SSR 降级回退节点（Suspense 加载中显示的内容）
   * @internal
   */
  ssFallback: VNode | null

  // optimization only 仅优化
  /** 形状标记（位运算值），快速判断 VNode 类型（如元素 / 组件）和子节点类型（文本 / 数组），避免频繁 typeof 判断 */
  shapeFlag: number
  /** 补丁标记（位运算值），标记 VNode 的动态部分（如动态文本、动态 class），更新时只处理标记的部分，而非全量对比 */
  patchFlag: number
  /**
   * 动态 props 名称数组（记录哪些 props 是动态变化的）
   * @internal
   */
  dynamicProps: string[] | null
  /**
   * 动态子节点集合（块树优化用），仅收集动态子节点，更新时直接遍历，跳过静态节点
   *   -- 动态子节点: 依赖了响应式变量或者 props 等节点, 在更新渲染时, 有可能会变化的节点
   * @internal
   */
  dynamicChildren: (VNode[] & { hasOnce?: boolean }) | null

  // application root node only 仅应用程序根节点
  appContext: AppContext | null

  /**
   * 当前 VNode 所属的组件实例（词法作用域的所有者）
   * @internal lexical scope owner instance 词法作用域所有者实例
   */
  ctx: ComponentInternalInstance | null

  /**
   * v-memo 指令专属，存储缓存依赖数组
   * @internal attached by v-memo 附有 v-memo
   */
  memo?: any[]
  /**
   * v-memo 缓存索引（内部清理缓存用）
   * @internal index for cleaning v-memo cache 用于清理 v-memo 缓存的索引
   */
  cacheIndex?: number
  /**
   * 兼容模式专属，标记是否是 Vue 2 兼容根节点
   * @internal __COMPAT__ only
   */
  isCompatRoot?: true
  /**
   * 自定义元素拦截钩子（内部用于自定义元素处理）
   * @internal custom element interception hook 自定义元素拦截钩子
   */
  ce?: (instance: ComponentInternalInstance) => void
}

// Since v-if and v-for are the two possible ways node structure can dynamically
// change, once we consider v-if branches and each v-for fragment a block, we
// can divide a template into nested blocks, and within each block the node
// structure would be stable. This allows us to skip most children diffing
// and only worry about the dynamic nodes (indicated by patch flags).
export const blockStack: VNode['dynamicChildren'][] = []
export let currentBlock: VNode['dynamicChildren'] = null

/**
 * Open a block.
 * This must be called before `createBlock`. It cannot be part of `createBlock`
 * because the children of the block are evaluated before `createBlock` itself
 * is called. The generated code typically looks like this:
 *
 * ```js
 * function render() {
 *   return (openBlock(),createBlock('div', null, [...]))
 * }
 * ```
 * disableTracking is true when creating a v-for fragment block, since a v-for
 * fragment always diffs its children.
 *
 * @private
 */
export function openBlock(disableTracking = false): void {
  blockStack.push((currentBlock = disableTracking ? null : []))
}

export function closeBlock(): void {
  blockStack.pop()
  currentBlock = blockStack[blockStack.length - 1] || null
}

// Whether we should be tracking dynamic child nodes inside a block. 我们是否应该跟踪块内的动态子节点。
// Only tracks when this value is > 0 仅当此值大于0时进行跟踪
// We are not using a simple boolean because this value may need to be 我们没有使用简单的布尔值，因为这个值可能需要
// incremented/decremented by nested usage of v-once (see below) 通过嵌套使用v-once（见下文）进行递增/递减操作
export let isBlockTreeEnabled = 1

/**
 * Block tracking sometimes needs to be disabled, for example during the
 * creation of a tree that needs to be cached by v-once. The compiler generates
 * code like this:
 *
 * ``` js
 * _cache[1] || (
 *   setBlockTracking(-1, true),
 *   _cache[1] = createVNode(...),
 *   setBlockTracking(1),
 *   _cache[1]
 * )
 * ```
 *
 * @private
 */
export function setBlockTracking(value: number, inVOnce = false): void {
  isBlockTreeEnabled += value
  if (value < 0 && currentBlock && inVOnce) {
    // mark current block so it doesn't take fast path and skip possible
    // nested components during unmount
    currentBlock.hasOnce = true
  }
}

function setupBlock(vnode: VNode) {
  // save current block children on the block vnode
  vnode.dynamicChildren =
    isBlockTreeEnabled > 0 ? currentBlock || (EMPTY_ARR as any) : null
  // close block
  closeBlock()
  // a block is always going to be patched, so track it as a child of its
  // parent block
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode)
  }
  return vnode
}

/**
 * @private
 */
export function createElementBlock(
  type: string | typeof Fragment,
  props?: Record<string, any> | null,
  children?: any,
  patchFlag?: number,
  dynamicProps?: string[],
  shapeFlag?: number,
): VNode {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true /* isBlock */,
    ),
  )
}

/**
 * Create a block root vnode. Takes the same exact arguments as `createVNode`.
 * A block root keeps track of dynamic nodes within the block in the
 * `dynamicChildren` array.
 *
 * @private
 */
export function createBlock(
  type: VNodeTypes | ClassComponent,
  props?: Record<string, any> | null,
  children?: any,
  patchFlag?: number,
  dynamicProps?: string[],
): VNode {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true /* isBlock: prevent a block from tracking itself */,
    ),
  )
}

/**
 * 判断给定的值是否为VNode对象
 *
 * @param value - 待检测的值，可以是任意类型
 * @returns 如果值为VNode对象则返回true，否则返回false
 *
 * 通过检查对象的__v_isVNode属性是否为true来判断是否为VNode
 * VNode是虚拟DOM节点的表示，用于Vue等框架中的DOM操作
 */
export function isVNode(value: any): value is VNode {
  return value ? value.__v_isVNode === true : false
}

/**
 * Vue3 Diff算法 核心基石 - 判断两个VNode是否为【同类型可复用节点】
 * 核心规则：生产环境 仅判断「节点类型一致 + 节点key一致」；开发环境 额外兼容HMR热更新的组件重载逻辑
 * 返回值意义：true → 同类型节点，可复用旧节点执行更新；false → 不同节点，销毁旧节点+创建新节点
 * 核心价值：Diff算法的判断基准，决定了节点是「更新」还是「替换」，是Vue3更新性能的基础保障
 *
 * @param {VNode} n1 旧的VNode虚拟节点
 * @param {VNode} n2 新的VNode虚拟节点
 * @returns {boolean} 是否为同类型可复用的VNode节点
 */
export function isSameVNodeType(n1: VNode, n2: VNode): boolean {
  // 【仅开发环境生效】HMR热更新 专属兼容逻辑 (生产环境被tree-shaking移除)
  // 触发条件：开发环境 + 新节点是【组件类型】 + 旧节点已经有组件实例(已挂载)
  if (__DEV__ && n2.shapeFlag & ShapeFlags.COMPONENT && n1.component) {
    // 1. 获取当前组件对应的「热更新脏组件实例集合」
    // 含义：hmrDirtyComponents存储了所有被热更新修改过的组件，key是组件类型，value是该组件的实例集合
    const dirtyInstances = hmrDirtyComponents.get(n2.type as ConcreteComponent)

    // 2. 如果当前组件被热更新，且旧节点的组件实例在脏实例集合中 → 触发强制重载逻辑
    if (dirtyInstances && dirtyInstances.has(n1.component)) {
      // #7042, ensure the vnode being unmounted during HMR 确保在HMR（热模块刷新）过程中卸载vnode
      // bitwise operations to remove keep alive flags 通过位操作移除保持活动标志
      n1.shapeFlag &= ~ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
      n2.shapeFlag &= ~ShapeFlags.COMPONENT_KEPT_ALIVE

      // HMR only: if the component has been hot-updated, force a reload. 如果组件已经进行了热更新，则强制重新加载
      // 核心：HMR场景下，组件被修改后，强制返回false → 不复用旧组件实例，销毁旧的+创建新的，实现组件热重载
      return false
    }
  }

  // 双条件同时满足，才判定为「同类型可复用节点」，缺一不可！
  return n1.type === n2.type && n1.key === n2.key
}

let vnodeArgsTransformer:
  | ((
      args: Parameters<typeof _createVNode>,
      instance: ComponentInternalInstance | null,
    ) => Parameters<typeof _createVNode>)
  | undefined

/**
 * Internal API for registering an arguments transform for createVNode
 * used for creating stubs in the test-utils
 * It is *internal* but needs to be exposed for test-utils to pick up proper
 * typings
 */
export function transformVNodeArgs(
  transformer?: typeof vnodeArgsTransformer,
): void {
  vnodeArgsTransformer = transformer
}

const createVNodeWithArgsTransform = (
  ...args: Parameters<typeof _createVNode>
): VNode => {
  return _createVNode(
    ...(vnodeArgsTransformer
      ? vnodeArgsTransformer(args, currentRenderingInstance)
      : args),
  )
}
/**
 * 规范化VNode的key属性
 * 将传入的key值进行标准化处理，如果key存在则返回原值，否则返回null
 *
 * @param props - VNode属性对象，包含key属性
 * @param props.key - VNode的key值，可能为任意类型或undefined/null
 * @returns 返回标准化后的key值，如果原key存在则返回原值，否则返回null
 */
const normalizeKey = ({ key }: VNodeProps): VNode['key'] =>
  key != null ? key : null

/**
 * 标准化 ref 属性，将其转换为规范化的引用对象
 *
 * @param ref - ref 引用值，可以是字符串、函数、Ref 对象或数字类型
 * @param ref_key - ref 的键名，用于标识 ref 的名称
 * @param ref_for - 表示是否为 v-for 循环中的 ref，布尔值
 * @returns 返回标准化后的 VNodeNormalizedRefAtom 对象或 null
 */
const normalizeRef = ({
  ref,
  ref_key,
  ref_for,
}: VNodeProps): VNodeNormalizedRefAtom | null => {
  // 将数字类型的 ref 转换为字符串类型
  if (typeof ref === 'number') {
    ref = '' + ref
  }
  return (
    ref != null
      ? isString(ref) || isRef(ref) || isFunction(ref)
        ? {
            i: currentRenderingInstance,
            r: ref,
            k: ref_key,
            f: !!ref_for,
          }
        : ref
      : null
  ) as any
}

/**
 * 创建 Vue 基础虚拟节点（VNode）的核心函数
 * VNode 是对真实 DOM 的抽象描述，包含节点类型、属性、子节点等关键信息，是 Vue 虚拟 DOM 体系的核心
 *
 * @param type - VNode 类型，可包括元素标签、组件、Fragment、NULL_DYNAMIC_COMPONENT 等
 * @param props - 节点属性，包含 DOM 属性、VNode 专有属性等，默认值为 null
 * @param children - 子节点，可接受字符串、数组（子VNode）等类型，默认值为 null
 * @param patchFlag - 补丁标记，用于优化更新性能，标记节点哪些部分是动态的（如动态文本、动态属性），默认值为 0（无动态内容）
 * @param dynamicProps - 动态属性名数组，记录哪些 props 是动态变化的，默认值为 null
 * @param shapeFlag - 形状标记，用于快速判断 VNode 类型（如元素、组件、文本子节点等），默认根据 type 初始化（Fragment 为 0，普通元素为 ELEMENT）
 * @param isBlockNode - 是否为块节点（block node），块节点用于优化更新粒度，默认值为 false
 * @param needFullChildrenNormalization - 是否需要对所有子节点进行完整规范化，默认值为 false
 * @returns 初始化完成的基础 VNode 对象
 */
function createBaseVNode(
  type: VNodeTypes | ClassComponent | typeof NULL_DYNAMIC_COMPONENT,
  props: (Data & VNodeProps) | null = null,
  children: unknown = null,
  patchFlag = 0,
  dynamicProps: string[] | null = null,
  shapeFlag: number = type === Fragment ? 0 : ShapeFlags.ELEMENT,
  isBlockNode = false,
  needFullChildrenNormalization = false,
): VNode {
  // 创建基础 VNode 对象，初始化核心属性
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props), // key - 用于性能优化，用于判断VNode是否相同
    ref: props && normalizeRef(props), // ref - 模板引用处理
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance,
  } as VNode

  // 需要对子节点完整规范化
  if (needFullChildrenNormalization) {
    // 完整规范化子节点（处理所有类型的子节点，如文本、数组、插槽等）
    normalizeChildren(vnode, children)
    // normalize suspense
    // 若开启 Suspense 特性且当前 VNode 是 Suspense 类型，规范化其内部子节点
    if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
      ;(type as typeof SuspenseImpl).normalize(vnode)
    }
  } else if (children) {
    // compiled element vnode - if children is passed, only possible types are 已编译元素 vnode - 如果传递了子元素，则仅传递可能的类型
    // string or Array. 字符串或数组
    vnode.shapeFlag |= isString(children)
      ? ShapeFlags.TEXT_CHILDREN
      : ShapeFlags.ARRAY_CHILDREN
  }

  // validate key 验证key的有效性，防止NaN值
  if (__DEV__ && vnode.key !== vnode.key) {
    warn(`VNode created with invalid key (NaN). VNode type:`, vnode.type) // 使用无效键 (NaN) 创建的 VNode。虚拟节点类型
  }

  // track vnode for block tree 跟踪块树中的vnode
  if (
    isBlockTreeEnabled > 0 &&
    // avoid a block node from tracking itself 避免块节点跟踪自身
    !isBlockNode &&
    // has current parent block 有当前父块
    currentBlock &&
    // presence of a patch flag indicates this node needs patching on updates. 补丁标志的存在表明此节点在更新时需要进行补丁更新
    // component nodes also should always be patched, because even if the 组件节点也应当始终进行修补，因为即使
    // component doesn't need to update, it needs to persist the instance on to 组件不需要更新，它需要将实例持久化
    // the next vnode so that it can be properly unmounted later. 下一个 vnode，以便后续可以正确卸载
    (vnode.patchFlag > 0 || shapeFlag & ShapeFlags.COMPONENT) &&
    // the EVENTS flag is only for hydration and if it is the only flag, the EVENTS 标志仅用于水合，如果它是唯一标志，则
    // vnode should not be considered dynamic due to handler caching. 由于处理程序缓存，vnode 不应被视为动态
    vnode.patchFlag !== PatchFlags.NEED_HYDRATION
  ) {
    currentBlock.push(vnode)
  }

  // 兼容模式处理：适配 Vue 2 的 v-model 语法和旧版 VNode 属性
  if (__COMPAT__) {
    convertLegacyVModelProps(vnode) // 转换旧版 v-model 属性到 Vue 3 格式
    defineLegacyVNodeProperties(vnode) // 定义旧版 VNode 兼容属性（如 .native 事件、$attrs 等）
  }

  // 返回初始化完成的基础 VNode
  return vnode
}

export { createBaseVNode as createElementVNode }

export const createVNode = (
  __DEV__ ? createVNodeWithArgsTransform : _createVNode
) as typeof _createVNode

/**
 * 创建虚拟节点 (VNode), 是 `createVNode` 的底层实现
 * 负责 VNode 类型校验、属性规范化、形状标记编码、兼容性处理等前置逻辑，最终调用 createBaseVNode 生成 VNode
 * @param {VNodeTypes | ClassComponent | typeof NULL_DYNAMIC_COMPONENT} type VNode 类型
 *        （可取值：原生元素名(string)、组件对象(object/function)、Comment/Fragment/Teleport/Suspense 等内置类型）
 * @param {(Data & VNodeProps) | null} [props=null] VNode 对应的属性（如 class/style/onClick 等），默认 null
 * @param {unknown} [children=null] VNode 子节点（可取值：文本、数组、VNode 等），默认 null
 * @param {number} [patchFlag=0] 补丁标记（PatchFlags）：标记 VNode 中动态变化的部分，用于优化 diff 性能，默认 0（无动态内容）
 * @param {string[] | null} [dynamicProps=null] 动态属性名数组（如 ['class', 'style']），记录需要动态更新的 props，默认 null
 * @param {boolean} [isBlockNode=false] 是否为「块节点」（Block Tree 优化相关，标记当前 VNode 属于块节点），默认 false
 * @returns {VNode} 最终创建的虚拟节点
 */
function _createVNode(
  type: VNodeTypes | ClassComponent | typeof NULL_DYNAMIC_COMPONENT,
  props: (Data & VNodeProps) | null = null,
  children: unknown = null,
  patchFlag: number = 0,
  dynamicProps: string[] | null = null,
  isBlockNode = false,
): VNode {
  // 处理无效/空 VNode 类型：默认转为注释节点（Comment）
  // NULL_DYNAMIC_COMPONENT 是 Vue 内置的「空动态组件」标识
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    // 开发环境：提示无效的 VNode 类型（生产环境静默处理）
    if (__DEV__ && !type) {
      warn(`Invalid vnode type when creating vnode: ${type}.`) // 创建 vnode 时 vnode 类型无效
    }
    // 空类型兜底为注释节点，避免渲染异常
    type = Comment
  }

  // 特殊场景：传入的 type 本身就是一个已存在的 VNode（如 <component :is="vnode"/> 用法）
  if (isVNode(type)) {
    // createVNode receiving an existing vnode. This happens in cases like createVNode 接收现有的 vnode。这种情况发生在类似的情况下
    // <component :is="vnode"/>
    // #2078 make sure to merge refs during the clone instead of overwriting it 确保在克隆期间合并引用而不是覆盖它

    // 克隆现有 VNode（避免修改原 VNode 引发副作用）
    // 第三个参数 true：合并 ref 属性（#2078 修复 ref 被覆盖的问题）
    const cloned = cloneVNode(type, props, true /* mergeRef: true */)
    // 如果传入了 children，规范化克隆后 VNode 的子节点（统一子节点格式：文本/数组/VNode）
    if (children) {
      normalizeChildren(cloned, children)
    }
    // Block Tree 优化：如果当前开启块树优化、且当前节点不是块节点、且存在当前块容器
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & ShapeFlags.COMPONENT) {
        currentBlock[currentBlock.indexOf(type)] = cloned
      } else {
        currentBlock.push(cloned)
      }
    }

    // 标记克隆的 VNode 为「强制退出优化」：需要全量 diff，不能走动态子节点优化
    cloned.patchFlag = PatchFlags.BAIL
    // 返回克隆后的 VNode（无需走后续创建流程）
    return cloned
  }

  // class component normalization. 类组件规范化
  // 类组件规范化：将 ClassComponent 实例转为其 __vccOpts 配置（Vue 3 对类组件的适配）
  if (isClassComponent(type)) {
    type = type.__vccOpts
  }

  // 2.x async/functional component compat 异步/功能组件兼容性
  // Vue 2.x 兼容性处理：转换旧版异步组件/函数式组件为 Vue 3 兼容格式
  // __COMPAT__ 为 true 时开启 2.x 兼容模式
  if (__COMPAT__) {
    type = convertLegacyComponent(type, currentRenderingInstance)
  }

  // class & style normalization. class & style 规范化
  // Props 规范化：处理 class/style 格式，克隆响应式 props 避免原对象被修改
  if (props) {
    // for reactive or proxy objects, we need to clone it to enable mutation. 对于反应式或代理对象，我们需要克隆它以启用突变。
    // 守卫响应式/代理对象：克隆 props 为普通对象，避免修改原响应式对象引发意外副作用
    props = guardReactiveProps(props)!
    // 解构 class 和 style 属性（高频动态属性，单独规范化）
    let { class: klass, style } = props
    // 规范化 class：支持数组/对象/字符串格式，最终转为空格分隔的字符串
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass)
    }

    // 规范化 style：支持数组/对象格式，处理响应式 style 克隆（避免修改原响应式对象）
    if (isObject(style)) {
      // reactive state objects need to be cloned since they are likely to be 反应式状态对象需要被克隆，因为它们很可能是
      // mutated 突变的
      // 响应式 style 对象需要克隆：因为 style 大概率会被动态修改（如 :style="{ color: red }"）
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style)
      }
      // 标准化 style 格式：合并数组 style、解析驼峰式属性（如 backgroundColor → background-color）
      props.style = normalizeStyle(style)
    }
  }

  // encode the vnode type information into a bitmap 将vnode类型信息编码为位图
  // 6. 编码 VNode 形状标记（shapeFlag）：用位掩码快速标识 VNode 类型，提升 diff 时的类型判断性能
  // 位运算判断 type 类型，最终生成一个数字（每一位代表一种类型）
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT // type 是字符串 → 原生元素节点（如 div/button）
    : __FEATURE_SUSPENSE__ && isSuspense(type)
      ? ShapeFlags.SUSPENSE // 开启 Suspense 特性且 type 是 Suspense → Suspense 组件
      : isTeleport(type)
        ? ShapeFlags.TELEPORT // type 是 Teleport → Teleport 组件
        : isObject(type)
          ? ShapeFlags.STATEFUL_COMPONENT // type 是对象 → 有状态组件（如 { setup() {} }）
          : isFunction(type)
            ? ShapeFlags.FUNCTIONAL_COMPONENT // type 是函数 → 函数式组件
            : 0 // 未知类型 → 0（无标记）

  // 开发环境警告：避免将组件对象设为响应式（会导致性能开销）
  if (__DEV__ && shapeFlag & ShapeFlags.STATEFUL_COMPONENT && isProxy(type)) {
    type = toRaw(type)
    warn(
      `Vue received a Component that was made a reactive object. This can ` + // Vue 接收到一个成为响应式对象的组件。这个可以
        `lead to unnecessary performance overhead and should be avoided by ` + // 导致不必要的性能开销，应该避免
        `marking the component with \`markRaw\` or using \`shallowRef\` ` + // 使用 \`markRaw\` 或使用 \`shallowRef\` 标记组件
        `instead of \`ref\`.`, // 而不是“参考”。
      `\nComponent that was made reactive: `, // 反应式的 nComponent
      type,
    )
  }

  // 调用基础 VNode 创建函数，生成最终的 VNode 并返回
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true, // 需要对所有子节点进行完整规范化
  )
}

export function guardReactiveProps(
  props: (Data & VNodeProps) | null,
): (Data & VNodeProps) | null {
  if (!props) return null
  return isProxy(props) || isInternalObject(props) ? extend({}, props) : props
}

/**
 * Vue3 核心底层函数：克隆一个VNode节点，生成全新的VNode副本
 * 核心特性：支持合并额外属性、合并ref、克隆过渡钩子
 * 核心价值：生成新的VNode引用，复用原节点内容，防止原VNode被修改/重复挂载导致的DOM异常、数据污染
 *
 *
 * @generic T VNode的type类型泛型
 * @generic U VNode的props类型泛型
 * @param {VNode<T, U>} vnode 源VNode节点，要被克隆的原始虚拟节点（必传）
 * @param {(Data & VNodeProps) | null} [extraProps=null] 可选，要追加/合并到克隆节点上的额外属性
 * @param {boolean} [mergeRef=false] 可选，是否合并ref属性；true=合并新旧ref，false=用新ref覆盖旧ref
 * @param {boolean} [cloneTransition=false] 可选，是否克隆过渡钩子；true=克隆transition并重置内部VNode引用，false=复用原过渡钩子
 * @returns {VNode<T, U>} 克隆后的全新VNode节点副本，与原节点内容一致，引用地址完全不同
 */
export function cloneVNode<T, U>(
  vnode: VNode<T, U>,
  extraProps?: (Data & VNodeProps) | null,
  mergeRef = false,
  cloneTransition = false,
): VNode<T, U> {
  // 这里刻意不使用对象展开(...)或Object.assign，目的是避免运行时枚举对象key的性能损耗，手动赋值性能最优
  // This is intentionally NOT using spread or extend to avoid the runtime 这是故意不使用spread或extend来避免运行时问题
  // key enumeration cost. 密钥枚举成本。
  const { props, ref, patchFlag, children, transition } = vnode // 解构原VNode的核心属性，只解构需要处理/判断的属性，其余属性后续手动赋值
  // 处理属性合并：如果传入了额外属性，合并「原节点props」和「额外props」，否则直接复用原props
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props

  // 核心：创建全新的VNode克隆副本，手动逐个赋值所有属性
  // 所有属性与原节点保持一致，保证克隆节点的内容和原节点完全相同
  // 重点处理：props/key/ref/children/patchFlag 这几个需要动态计算的属性，其余属性纯拷贝
  const cloned: VNode<T, U> = {
    __v_isVNode: true, // 固定标识：标记是VNode对象，区别于普通JS对象
    __v_skip: true, // 固定标识：diff算法中跳过该节点的子节点遍历（优化标记）
    type: vnode.type, // 核心：节点类型，与原节点完全一致 (div/组件/Fragment等)
    props: mergedProps, // 节点属性：使用合并后的属性（原属性+额外属性），无额外属性则复用原属性
    // 节点的唯一key：从合并后的props中标准化获取，保证key的合法性
    key: mergedProps && normalizeKey(mergedProps),

    // 处理ref属性的「合并/覆盖」规则 (Vue3 重点兼容逻辑)
    ref:
      // 分支1：传入了额外属性 且 额外属性中包含ref → 需要处理ref的合并/覆盖
      extraProps && extraProps.ref
        ? // #2078 in the case of <component :is="vnode" ref="extra"/> 在 <component :is="vnode" ref="extra"/> 的情况下，
          // if the vnode itself already has a ref, cloneVNode will need to merge 如果 vnode 本身已经有引用，cloneVNode 将需要进行合并
          // the refs so the single vnode can be set on multiple refs 引用，以便可以在多个引用上设置单个 vnode
          // 如果原VNode本身已有ref，克隆时需要合并两个ref，让单个VNode能被多个ref绑定
          mergeRef && ref
          ? // mergeRef=true 且 原节点有ref → 执行ref合并逻辑
            isArray(ref)
            ? // 原ref是数组 → 追加新的标准化ref到数组末尾
              ref.concat(normalizeRef(extraProps)!)
            : // 原ref是单个值 → 转为数组，存入新旧两个ref
              [ref, normalizeRef(extraProps)!]
          : // mergeRef=false → 直接使用新的标准化ref，覆盖原ref
            normalizeRef(extraProps)
        : // 无额外ref → 直接复用原节点的ref属性
          ref,
    scopeId: vnode.scopeId, // SFC样式隔离ID，纯拷贝
    slotScopeIds: vnode.slotScopeIds, // 插槽样式隔离ID数组，纯拷贝
    children:
      __DEV__ && patchFlag === PatchFlags.CACHED && isArray(children)
        ? // 开发环境 + 原节点是「缓存静态节点」 + 子节点是数组 → 对子节点执行深度克隆
          // 防止开发环境下缓存节点的子节点被共享修改，生产环境无需处理，直接复用
          (children as VNode[]).map(deepCloneVNode)
        : children,
    target: vnode.target, // Teleport瞬移组件的目标容器，纯拷贝
    targetStart: vnode.targetStart, // Teleport目标容器的起始锚点，纯拷贝
    targetAnchor: vnode.targetAnchor, // Teleport目标容器的结束锚点，纯拷贝
    staticCount: vnode.staticCount, // 静态节点计数，纯拷贝
    shapeFlag: vnode.shapeFlag, // 节点形状标记(位运算)，纯拷贝，与原节点一致
    // if the vnode is cloned with extra props, we can no longer assume its 如果克隆的vnode带有额外的属性，我们就不能再假定它
    // existing patch flag to be reliable and need to add the FULL_PROPS flag. 现有的补丁标志需要可靠，并且需要添加FULL_PROPS标志。
    // note: preserve flag for fragments since they use the flag for children 注意：为片段保留标志，因为它们将该标志用于子元素
    // fast paths only. 仅限快速通道。
    patchFlag:
      extraProps && vnode.type !== Fragment
        ? patchFlag === PatchFlags.CACHED // hoisted node
          ? PatchFlags.FULL_PROPS
          : patchFlag | PatchFlags.FULL_PROPS
        : patchFlag,
    dynamicProps: vnode.dynamicProps, // 动态属性数组，纯拷贝
    dynamicChildren: vnode.dynamicChildren, // 动态子节点数组，纯拷贝
    appContext: vnode.appContext, // 应用上下文，纯拷贝
    dirs: vnode.dirs, // 指令数组，纯拷贝
    transition, // 过渡钩子，先复用原过渡钩子，后续按需克隆

    // These should technically only be non-null on mounted VNodes. However, 从技术上讲，这些属性只应在已挂载的VNode上为非空。然而，
    // they *should* be copied for kept-alive vnodes. So we just always copy 对于保持活跃的vnodes，它们*应该*被复制。所以我们总是进行复制
    // them since them being non-null during a mount doesn't affect the logic as 因为它们在挂载期间非空并不会影响逻辑
    // they will simply be overwritten. 它们将被简单地覆盖
    // 以下属性理论上只有「已挂载的VNode」才会有值，但为了keep-alive组件的复用场景，需要全部拷贝
    // 即使在挂载阶段拷贝了这些属性也无影响，因为挂载时会被重新赋值，不影响核心逻辑
    component: vnode.component, // 组件实例，纯拷贝（仅组件类型VNode有值）
    suspense: vnode.suspense, // Suspense实例，纯拷贝（仅Suspense类型VNode有值）
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent), // 服务端渲染内容，递归克隆
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback), // 服务端渲染兜底内容，递归克隆
    placeholder: vnode.placeholder, // 占位节点，纯拷贝

    el: vnode.el, // 真实DOM映射，纯拷贝（⚠️ 重要：克隆节点会继承原节点的el，后续挂载时会被重置）
    anchor: vnode.anchor, // 锚点节点，纯拷贝（Fragment的结束锚点）
    ctx: vnode.ctx, // 组件上下文，纯拷贝
    ce: vnode.ce, // 编译器缓存，纯拷贝
  }

  // if the vnode will be replaced by the cloned one, it is necessary 如果该虚拟节点（vnode）将被克隆后的节点所替换，那么这是必要的
  // to clone the transition to ensure that the vnode referenced within 克隆转换以确保在...中引用的vnode
  // the transition hooks is fresh. 过渡钩很新鲜。
  if (transition && cloneTransition) {
    setTransitionHooks(
      cloned as VNode,
      transition.clone(cloned as VNode) as TransitionHooks,
    )
  }

  // 开启Vue2兼容模式时，为克隆节点定义遗留的VNode属性
  // 生产环境/非兼容模式下，这段代码会被tree-shaking移除，无性能损耗
  if (__COMPAT__) {
    defineLegacyVNodeProperties(cloned as VNode)
  }

  // 新节点与原节点「内容完全一致」，「内存引用地址完全不同」，是独立的全新对象
  return cloned
}

/**
 * Dev only, for HMR of hoisted vnodes reused in v-for
 * https://github.com/vitejs/vite/issues/2022
 */
/**
 * 【开发环境专用】递归深度克隆VNode节点，基于浅克隆cloneVNode实现
 * 核心逻辑：先浅克隆当前VNode，再递归遍历并深度克隆所有子VNode数组，做到「当前节点+所有子孙节点」全克隆
 * 核心价值：防止开发环境下，缓存的静态节点的子节点被多个父节点共享引用、意外修改，导致渲染异常
 * 调用限制：仅在 cloneVNode 内部的子节点处理逻辑中被调用，无单独调用场景
 *
 * @param {VNode} vnode 要被深度克隆的源VNode节点（标准合法VNode）
 * @returns {VNode} 深度克隆后的全新VNode，当前节点+所有子孙节点均为新引用，与原节点完全解耦
 */
function deepCloneVNode(vnode: VNode): VNode {
  // 第一步：调用基础的cloneVNode，对【当前VNode节点本身】做一层浅克隆
  // 得到一个和当前节点内容一致、引用独立的浅克隆节点
  const cloned = cloneVNode(vnode)

  // 第二步：递归处理子节点 - 仅当「原节点的子节点是VNode数组」时，才执行递归
  // 1. isArray(vnode.children)：判断子节点是否为数组（只有数组型子节点才需要递归克隆）
  // 2. 文本/注释/单个VNode等非数组子节点，直接复用浅克隆的结果即可，无需处理
  if (isArray(vnode.children)) {
    // 遍历原节点的子VNode数组，对每一个子节点【递归调用deepCloneVNode】
    // 把递归克隆后的全新子节点数组，赋值给克隆节点的children属性
    cloned.children = (vnode.children as VNode[]).map(deepCloneVNode)
  }
  return cloned
}

/**
 * @private
 */
export function createTextVNode(text: string = ' ', flag: number = 0): VNode {
  return createVNode(Text, null, text, flag)
}

/**
 * @private
 */
export function createStaticVNode(
  content: string,
  numberOfNodes: number,
): VNode {
  // A static vnode can contain multiple stringified elements, and the number
  // of elements is necessary for hydration.
  const vnode = createVNode(Static, null, content)
  vnode.staticCount = numberOfNodes
  return vnode
}

/**
 * @private
 */
export function createCommentVNode(
  text: string = '',
  // when used as the v-else branch, the comment node must be created as a
  // block to ensure correct updates.
  asBlock: boolean = false,
): VNode {
  return asBlock
    ? (openBlock(), createBlock(Comment, null, text))
    : createVNode(Comment, null, text)
}

/**
 * Vue3 核心通用函数 - 任意子节点类型 → 标准VNode的**统一标准化入口**
 * 核心关联：被createVNode、renderSlot、normalizeChildren等核心函数调用，是Vue虚拟DOM体系中**所有子节点进入渲染流程前的必经步骤**，
 *            为渲染器（renderer）提供统一的VNode输入，是虚拟DOM渲染的基础保障。
 * @param {VNodeChild} child 待标准化的原始子节点，为Vue内置联合类型，包含所有可能的子节点类型
 * @returns {VNode} 标准化后的**唯一标准VNode实例**，类型为注释/片段/已有VNode克隆/文本中的一种
 */
export function normalizeVNode(child: VNodeChild): VNode {
  // 分支1：空值（null/undefined）或布尔值 → 转为注释VNode作为空占位符
  // 场景：模板中v-if="false"、v-else等返回布尔值/空值的情况，用注释节点占位不影响DOM结构
  if (child == null || typeof child === 'boolean') {
    // empty placeholder 空占位符
    return createVNode(Comment)
  }
  // 分支2：原始子节点为数组 → 转为Fragment（片段）VNode，包裹所有子节点
  else if (isArray(child)) {
    // fragment 分段
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode 重用vnode时避免引用污染
      child.slice(),
    )
  }
  // 分支3：原始子节点已是VNode实例 → 按需克隆（仅已挂载的克隆），直接返回/返回克隆体
  // 场景：编译后的模板几乎都会生成纯VNode数组，这是**最常见的执行分支**
  else if (isVNode(child)) {
    // already vnode, this should be the most common since compiled templates 已经是vnode，这应该是编译模板以来最常见的
    // always produce all-vnode children arrays 始终生成全 vnode 子数组
    return cloneIfMounted(child)
  }
  // 分支4：其他类型（字符串/数字/Symbol等基本类型）→ 转为文本VNode
  else {
    // strings and numbers 字符串和数字
    return createVNode(Text, null, String(child))
  }
}

// optimized normalization for template-compiled render fns 模板编译渲染 fns 的优化标准化
/**
 * 【优化模式专用】按需克隆VNode节点：仅当节点「已挂载/是缓存节点」且「非memo缓存节点」时，才执行克隆
 * 核心设计：能复用原节点就复用，避免无意义的克隆消耗性能；必须克隆时才克隆，避免DOM挂载异常
 * 核心解决：同一个VNode被多次挂载导致的「一份VNode对应多份真实DOM」的重复渲染问题
 *
 *
 * @param {VNode} child 待检测/克隆的标准VNode节点（优化模式下编译器保证入参必为合法VNode）
 * @returns {VNode} 返回原VNode 或 克隆后的新VNode副本
 */
export function cloneIfMounted(child: VNode): VNode {
  // 满足条件 → 返回【原节点】，无需克隆
  // 不满足条件 → 返回【克隆后的新节点】，必须克隆
  return (child.el === null && child.patchFlag !== PatchFlags.CACHED) ||
    child.memo
    ? child
    : cloneVNode(child)
}

/**
 * Vue3 内部核心函数 - VNode子节点的【标准化处理核心】
 * 核心使命：
 *   1. 统一子节点格式：将任意类型的children（null/数组/对象/函数/基本类型）转换为Vue内部可统一处理的标准化格式；
 *   2. 标记子节点类型：为VNode设置对应的ShapeFlags子节点标记（数组/文本/插槽），支撑后续渲染/patch逻辑；
 *   3. 处理插槽（Slots）：解析插槽对象、绑定渲染上下文、标记插槽稳定性（静态/动态/转发）、设置动态插槽补丁标记；
 *   4. 特殊VNode适配：为ELEMENT/TELEPORT类型VNode做专属子节点处理（如Teleport强制子节点为数组）；
 *   5. 编译插槽兼容：处理withCtx编译的插槽标记（_c/_d），保证编译插槽的标准化逻辑正确执行；
 *
 * 核心关联：VNode创建阶段（createVNode/h/tsx）同步调用，是Vue虚拟DOM渲染体系的前置基础，决定子节点后续如何被渲染和更新。
 * @param {VNode} vnode 待处理的VNode实例（最终将标准化后的子节点和标记挂载到该实例）
 * @param {unknown} children 原始未标准化的子节点（任意类型，如模板中的子元素、组件的插槽、直接的文本/数字等）
 * @returns {void} 无返回值，直接修改入参vnode的children和shapeFlag属性
 */
export function normalizeChildren(vnode: VNode, children: unknown): void {
  // 初始化子节点类型标记（0表示未初始化，后续会赋值为ShapeFlags中的子节点类型）
  let type = 0
  // 解构VNode自身的形状标记（用于判断VNode类型：ELEMENT/TELEPORT/组件等）
  const { shapeFlag } = vnode

  // ========== 分支1：原始children为null/undefined → 标准化为null ==========
  if (children == null) {
    children = null
  }
  // ========== 分支2：原始children为数组 → 标记为数组子节点 ==========
  else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
  } else if (typeof children === 'object') {
    // 子分支3.1：当前VNode是普通DOM元素/TELEPORT → 提取插槽default作为子节点（不处理插槽结构）
    if (shapeFlag & (ShapeFlags.ELEMENT | ShapeFlags.TELEPORT)) {
      // Normalize slot to plain children for plain element and Teleport 将插槽标准化为普通元素和传送的普通子元素
      // 普通元素/TELEPORT不支持复杂插槽，仅提取插槽对象的default插槽作为子节点
      const slot = (children as any).default
      if (slot) {
        // _c marker is added by withCtx() indicating this is a compiled slot _c 标记由 withCtx() 添加，指示这是一个编译槽
        slot._c && (slot._d = false)
        // 递归调用标准化：执行插槽函数得到实际子节点，继续标准化处理
        normalizeChildren(vnode, slot())
        // 标准化完成后将_d置为true，恢复标记
        slot._c && (slot._d = true)
      }
      return // 已递归处理完子节点，直接返回（无需后续赋值）
    }
    // 子分支3.2：当前VNode是组件 → 标记为插槽子节点，处理插槽对象的上下文和稳定性
    else {
      type = ShapeFlags.SLOTS_CHILDREN
      // 获取插槽对象的内置标记（_：SlotFlags，标识插槽类型：STABLE/动态/转发等）
      const slotFlag = (children as RawSlots)._
      // 情况1：插槽未标准化（无_slotFlag）且不是Vue内部对象 → 绑定当前渲染上下文
      if (!slotFlag && !isInternalObject(children)) {
        // if slots are not normalized, attach context instance 如果插槽未标准化，则附加上下文实例
        // (compiled / normalized slots already have context) （已编译/已规范化的插槽已有上下文）
        // 未编译/未标准化的插槽需要绑定渲染实例上下文，保证插槽内可访问组件实例（如this/setup上下文）
        ;(children as RawSlots)._ctx = currentRenderingInstance
      }
      // 情况2：插槽是**转发插槽（FORWARDED）** 且存在当前渲染实例 → 继承父组件的插槽稳定性标记
      else if (slotFlag === SlotFlags.FORWARDED && currentRenderingInstance) {
        // 转发插槽：子组件从父组件接收的插槽，其稳定性由父组件的插槽类型决定
        // a child component receives forwarded slots from the parent. 子组件接收来自父组件的转发槽
        // its slot type is determined by its parent's slot type. 它的槽类型由其父槽类型决定。
        if (
          (currentRenderingInstance.slots as RawSlots)._ === SlotFlags.STABLE
        ) {
          // 父组件是静态插槽 → 子组件转发插槽也标记为静态
          ;(children as RawSlots)._ = SlotFlags.STABLE
        } else {
          // 父组件是动态插槽 → 子组件转发插槽标记为动态，并为VNode添加动态插槽补丁标记
          ;(children as RawSlots)._ = SlotFlags.DYNAMIC
          vnode.patchFlag |= PatchFlags.DYNAMIC_SLOTS
        }
      }
    }
  }
  // ========== 分支4：原始children为函数 → 转换为默认插槽对象，绑定渲染上下文 ==========
  else if (isFunction(children)) {
    // 函数式children会被Vue解析为**默认插槽**，包装为标准插槽对象
    // 绑定currentRenderingInstance作为插槽上下文，保证函数内可访问组件实例
    children = { default: children, _ctx: currentRenderingInstance }
    type = ShapeFlags.SLOTS_CHILDREN
  }
  // ========== 分支5：原始children为基本类型（字符串/数字/布尔等）→ 标准化为文本 ==========
  else {
    // 所有非对象/非函数/非数组的基本类型，统一转换为字符串（如数字123→"123"，布尔true→"true"）
    children = String(children)

    // force teleport children to array so it can be moved around 强制将子项传送到阵列中，以便可以四处移动
    // 特殊处理：TELEPORT类型VNode → 强制转为数组包裹的文本VNode（TELEPORT需要移动子节点，数组更易操作）
    if (shapeFlag & ShapeFlags.TELEPORT) {
      type = ShapeFlags.ARRAY_CHILDREN
      // 创建文本VNode，包裹标准化后的字符串，放入数组
      children = [createTextVNode(children as string)]
    }
    // 普通VNode（如ELEMENT/组件）→ 标记为文本子节点
    else {
      type = ShapeFlags.TEXT_CHILDREN
    }
  }

  // ========== 最终步骤：将标准化后的子节点和类型标记挂载到VNode ==========
  // 为VNode赋值标准化后的子节点（指定类型为VNodeNormalizedChildren，保证类型安全）
  vnode.children = children as VNodeNormalizedChildren
  // 将子节点类型标记合并到VNode的shapeFlag中（按位或，保留原有VNode类型，添加子节点类型）
  vnode.shapeFlag |= type
}

export function mergeProps(...args: (Data & VNodeProps)[]): Data {
  const ret: Data = {}
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i]
    for (const key in toMerge) {
      if (key === 'class') {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class])
        }
      } else if (key === 'style') {
        ret.style = normalizeStyle([ret.style, toMerge.style])
      } else if (isOn(key)) {
        const existing = ret[key]
        const incoming = toMerge[key]
        if (
          incoming &&
          existing !== incoming &&
          !(isArray(existing) && existing.includes(incoming))
        ) {
          ret[key] = existing
            ? [].concat(existing as any, incoming as any)
            : incoming
        }
      } else if (key !== '') {
        ret[key] = toMerge[key]
      }
    }
  }
  return ret
}

export function invokeVNodeHook(
  hook: VNodeHook,
  instance: ComponentInternalInstance | null,
  vnode: VNode,
  prevVNode: VNode | null = null,
): void {
  callWithAsyncErrorHandling(hook, instance, ErrorCodes.VNODE_HOOK, [
    vnode,
    prevVNode,
  ])
}
