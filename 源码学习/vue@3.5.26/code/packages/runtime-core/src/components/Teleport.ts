import type { ComponentInternalInstance } from '../component'
import type { SuspenseBoundary } from './Suspense'
import {
  type ElementNamespace,
  MoveType,
  type RendererElement,
  type RendererInternals,
  type RendererNode,
  type RendererOptions,
  queuePostRenderEffect,
  traverseStaticChildren,
} from '../renderer'
import type { VNode, VNodeArrayChildren, VNodeProps } from '../vnode'
import { ShapeFlags, isString } from '@vue/shared'
import { warn } from '../warning'
import { isHmrUpdating } from '../hmr'

export type TeleportVNode = VNode<RendererNode, RendererElement, TeleportProps>

export interface TeleportProps {
  to: string | RendererElement | null | undefined
  disabled?: boolean
  defer?: boolean
}

export const TeleportEndKey: unique symbol = Symbol('_vte')

/**
 * 检查给定类型是否为Teleport组件
 *
 * @param type - 要检查的类型或组件对象
 * @returns 如果该类型是Teleport组件则返回true，否则返回false
 */
export const isTeleport = (type: any): boolean => type.__isTeleport

/**
 * 检查Teleport组件是否被禁用
 *
 * @param props - VNode的属性对象，可能包含disabled属性
 * @returns 如果props中存在disabled属性且其值为真值或空字符串，则返回true；否则返回false
 */
const isTeleportDisabled = (props: VNode['props']): boolean =>
  props && (props.disabled || props.disabled === '')

/**
 * 检查Teleport组件是否被设置为延迟渲染模式
 * 当props中存在defer属性且其值为true或空字符串时，表示该Teleport组件将在下一个tick延迟渲染其内容
 *
 * @param props - VNode的props对象，包含Teleport组件的所有属性
 * @returns 如果props中存在defer属性（值为true或空字符串），则返回true；否则返回false
 */
const isTeleportDeferred = (props: VNode['props']): boolean =>
  props && (props.defer || props.defer === '')

const isTargetSVG = (target: RendererElement): boolean =>
  typeof SVGElement !== 'undefined' && target instanceof SVGElement

const isTargetMathML = (target: RendererElement): boolean =>
  typeof MathMLElement === 'function' && target instanceof MathMLElement

/**
 * 解析Teleport的目标元素
 * 根据传入的props和选择器函数，解析并返回Teleport组件要传送的目标元素
 *
 * @param props - Teleport组件的属性对象，包含to、disabled等属性
 * @param select - 渲染器提供的querySelector函数，用于根据选择器字符串查找DOM元素
 * @returns 返回解析到的目标元素，如果无法解析则返回null
 */
const resolveTarget = <T = RendererElement>(
  props: TeleportProps | null,
  select: RendererOptions['querySelector'],
): T | null => {
  const targetSelector = props && props.to
  // 处理字符串形式的选择器
  if (isString(targetSelector)) {
    if (!select) {
      __DEV__ &&
        warn(
          `Current renderer does not support string target for Teleports. ` + // 当前渲染器不支持传送的字符串目标
            `(missing querySelector renderer option)`, // （缺少 querySelector 渲染器选项）
        )
      return null
    } else {
      const target = select(targetSelector)

      // 开发环境下验证目标元素是否存在
      if (__DEV__ && !target && !isTeleportDisabled(props)) {
        warn(
          `Failed to locate Teleport target with selector "${targetSelector}". ` + // 无法使用选择器“${targetSelector}”找到传送目标。
            `Note the target element must exist before the component is mounted - ` + // 注意目标元素必须在组件挂载之前存在
            `i.e. the target cannot be rendered by the component itself, and ` + // 即目标不能由组件本身渲染，并且
            `ideally should be outside of the entire Vue component tree.`, // 理想情况下应该位于整个 Vue 组件树之外
        )
      }
      return target as T
    }
  }
  // 其他情况: 直接传入DOM元素的情况
  else {
    if (__DEV__ && !targetSelector && !isTeleportDisabled(props)) {
      warn(`Invalid Teleport target: ${targetSelector}`) // 传送目标无效
    }
    return targetSelector as T
  }
}

export const TeleportImpl = {
  /** 组件名称 */
  name: 'Teleport',
  /** 标识为 Teleport 组件, 在渲染时就自行渲染逻辑 */
  __isTeleport: true,
  /**
   * Vue3 <Teleport> 组件核心渲染处理方法
   * 作用：处理Teleport专用VNode的首次挂载、更新全生命周期逻辑，实现内容的跨容器渲染、状态切换、子节点更新
   *
   *  - 首次渲染:
   *      -- 占位节点: 开发环境下为注释节点, 其他环境下为空文本节点
   *          --- vnode.el: 在原组件容器中起始节点
   *          --- vnode.anchor: 在原组件容器中的锚点
   *          --- vnode.targetStart: Teleport 目标容器的起始节点，用于精准插入位置
   *          --- vnode.targetAnchor: Teleport 目标容器的锚点节点，用于精准插入位置
   *          --- vnode.target: Teleport 目标容器
   *      -- 通过这些占位节点, 以及来根据 disabled 和 to 来确定挂载容器
   *      -- 通过 mountChildren 方法挂载子节点
   *          --- 如果是禁用, 则挂载到原容器中 --> container: 使用传入的, anchor 使用 vnode.anchor
   *          --- 非禁用, 则挂载到目标容器中 --> container: 使用 to 属性表示的目标容器的, anchor 使用 vnode.targetAnchor
   *      -- Teleport 组件本身没有对应的节点, 只需要将子节点挂载到对应的容器中即可
   *
   *  - 更新渲染
   *      -- 根据 disabled 和 to 的变化, 重新挂载占位节点和子节点
   *
   * @param n1 旧的Teleport VNode，首次挂载为null，更新阶段为上一次的Teleport VNode
   * @param n2 新的Teleport VNode，本次要渲染/更新的核心对象（包含Teleport的props/children/target等信息）
   * @param container Teleport原组件所在的父容器（渲染占位节点的容器）
   * @param anchor 原容器中的锚点节点，用于确定占位节点/子节点的插入位置
   * @param parentComponent 父组件的内部实例，可为null，用于子节点的组件上下文继承
   * @param parentSuspense 父级Suspense边界实例，可为null，用于结合Suspense的延迟挂载/副作用调度
   * @param namespace 元素命名空间（如html/svg/mathml），保证不同命名空间下DOM创建的正确性
   * @param slotScopeIds 插槽的CSS作用域ID，用于Scoped CSS的样式隔离
   * @param optimized 是否开启优化更新（由编译器标记，开启则走快速更新路径）
   * @param internals 渲染器内部方法集合，封装了通用的DOM操作、子节点处理方法，避免重复实现
   * @returns void 无返回值
   */
  process(
    n1: TeleportVNode | null,
    n2: TeleportVNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    namespace: ElementNamespace,
    slotScopeIds: string[] | null,
    optimized: boolean,
    internals: RendererInternals,
  ): void {
    // 解构渲染器内部通用方法，Teleport复用这些方法实现DOM操作和子节点处理，减少冗余
    // mc: mountChildren 挂载子节点；pc: patchChildren 更新子节点；pbc: patchBlockChildren 块子节点快速更新
    // o: 渲染器的原生DOM操作方法集：insert(插入节点)、querySelector(查询目标容器)、createText(创建文本节点)、createComment(创建注释节点)
    const {
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      o: { insert, querySelector, createText, createComment },
    } = internals

    // 1. 判断Teleport是否被禁用：解析n2.props中的disabled属性（true则禁用，内容渲染到原容器而非目标容器）
    const disabled = isTeleportDisabled(n2.props)
    // 2. 解构n2的核心属性：节点类型标记、子节点、动态子节点（优化更新时使用）
    let { shapeFlag, children, dynamicChildren } = n2

    // #3302
    // HMR updated, force full diff HMR 更新，强制完全 diff

    // #3302 修复HMR更新的bug：HMR更新时强制关闭优化更新，走全量diff
    // 原因：HMR是热模块替换，需要全量对比子节点，不能走优化的快速路径
    if (__DEV__ && isHmrUpdating) {
      optimized = false
      dynamicChildren = null
    }

    // ********** 核心分支1：首次挂载阶段（n1为null，当前Teleport是第一次渲染）**********
    if (n1 == null) {
      // insert anchors in the main view 在主视图中插入锚点
      // 1. 在**原组件容器**中插入占位锚点节点，用于标记Teleport的位置（内容实际渲染到目标容器，原位置只留锚点）
      // 开发环境创建注释节点（便于调试），生产环境创建空文本节点（性能更优）
      const placeholder = (n2.el = __DEV__
        ? createComment('teleport start')
        : createText(''))
      const mainAnchor = (n2.anchor = __DEV__
        ? createComment('teleport end')
        : createText(''))

      // 将开始/结束锚点插入原容器的指定锚点位置，保留Teleport在原DOM树的位置标记
      insert(placeholder, container, anchor)
      insert(mainAnchor, container, anchor)

      // 封装**子节点通用挂载方法**：将Teleport的子节点挂载到「指定容器」的「指定锚点」处
      // 注：Vue编译器和VNode规范化保证Teleport的子节点一定是数组，无需额外处理
      const mount = (container: RendererElement, anchor: RendererNode) => {
        // Teleport *always* has Array children. This is enforced in both the 传送*总是*有数组子项。这在两个国家都强制执行
        // compiler and vnode children normalization. 编译器和 vnode 子级标准化

        // 判断子节点为数组类型（Teleport的强制约束）
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(
            children as VNodeArrayChildren, // 要挂载的子节点数组
            container, // 挂载的目标容器（原容器/teleport目标容器）
            anchor, // 目标容器的锚点
            parentComponent, // 继承父组件实例
            parentSuspense, // 继承父级Suspense
            namespace, // 元素命名空间
            slotScopeIds, // 插槽作用域ID
            optimized, // 是否开启优化挂载
          )
        }
      }

      // 封装**挂载到Teleport目标容器**的核心逻辑：解析目标、适配命名空间、挂载子节点
      const mountToTarget = () => {
        // 解析Teleport的目标容器：根据props中的to属性，通过querySelector获取真实DOM节点
        const target = (n2.target = resolveTarget(n2.props, querySelector))
        // 准备目标容器的锚点节点：用于确定子节点在目标容器的插入位置 --> 在目标容器中插入两个锚点
        const targetAnchor = prepareAnchor(target, n2, createText, insert)

        // 解析到有效目标容器时执行
        if (target) {
          // #2652 we could be teleporting from a non-SVG tree into an SVG tree 我们可以从非 SVG 树传送到 SVG 树
          if (namespace !== 'svg' && isTargetSVG(target)) {
            namespace = 'svg'
          } else if (namespace !== 'mathml' && isTargetMathML(target)) {
            // 同理，适配MathML命名空间
            namespace = 'mathml'
          }

          // track CE teleport targets 追踪CE传送目标
          // 追踪自定义元素(CE)的Teleport目标容器：避免自定义元素场景下的内存泄漏
          if (parentComponent && parentComponent.isCE) {
            ;(
              parentComponent.ce!._teleportTargets ||
              (parentComponent.ce!._teleportTargets = new Set())
            ).add(target)
          }

          // 非禁用状态下：将子节点挂载到Teleport目标容器，同时更新CSS变量
          if (!disabled) {
            mount(target, targetAnchor)
            updateCssVars(n2, false) // false表示未禁用，按目标容器更新CSS变量
          }
        } else if (__DEV__ && !disabled) {
          warn(
            'Invalid Teleport target on mount:',
            target,
            `(${typeof target})`,
          )
        }
      }

      // 处理Teleport禁用状态：禁用时将子节点挂载到**原组件容器**（主锚点处），而非目标容器
      if (disabled) {
        mount(container, mainAnchor)
        updateCssVars(n2, true) // true表示禁用，按原容器更新CSS变量
      }

      // 处理**延迟挂载**：判断props是否有deferred（延迟挂载标记）
      if (isTeleportDeferred(n2.props)) {
        // 给占位节点加挂载标记：标记为未挂载状态，用于后续更新阶段判断
        n2.el!.__isMounted = false
        // 将挂载逻辑加入「渲染后副作用队列」：在DOM渲染完成后执行，避免首屏阻塞
        queuePostRenderEffect(() => {
          mountToTarget()
          delete n2.el!.__isMounted
        }, parentSuspense)
      }
      // 非延迟挂载：直接执行挂载到目标容器的逻辑
      else {
        mountToTarget()
      }
    }
    // ********** 核心分支2：更新阶段（n1不为null，当前Teleport是二次渲染/更新）**********
    else {
      // 处理**未完成的延迟挂载**：如果n2是延迟挂载且n1的占位节点还未完成挂载，延迟执行更新逻辑
      if (isTeleportDeferred(n2.props) && n1.el!.__isMounted === false) {
        queuePostRenderEffect(() => {
          // 将当前process方法加入渲染后队列，等待挂载完成后再执行更新
          TeleportImpl.process(
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
        }, parentSuspense)
        return // 提前返回，避免本次重复处理
      }

      // 1. 继承旧VNode的核心DOM节点/属性：无需重新创建，复用已有节点（性能优化）
      // update content 更新内容
      n2.el = n1.el // 复用原占位节点（teleport start）
      n2.targetStart = n1.targetStart // 复用目标容器的开始锚点
      const mainAnchor = (n2.anchor = n1.anchor)! // 复用原容器的结束锚点
      const target = (n2.target = n1.target)! // 复用旧的目标容器
      const targetAnchor = (n2.targetAnchor = n1.targetAnchor)! // 复用目标容器的锚点
      // 2. 获取旧的禁用状态：用于判断本次更新是否是「禁用状态切换」
      const wasDisabled = isTeleportDisabled(n1.props)
      // 3. 确定本次更新的**当前容器/锚点**：根据旧的禁用状态决定（禁用则用原容器，否则用目标容器）
      const currentContainer = wasDisabled ? container : target
      const currentAnchor = wasDisabled ? mainAnchor : targetAnchor

      // 再次适配SVG/MathML命名空间：更新阶段目标容器可能变化，重新校验并切换
      if (namespace === 'svg' || isTargetSVG(target)) {
        namespace = 'svg'
      } else if (namespace === 'mathml' || isTargetMathML(target)) {
        namespace = 'mathml'
      }

      // ********** 子节点更新逻辑：区分「优化快速路径」和「全量diff路径」**********
      if (dynamicChildren) {
        // fast path when the teleport happens to be a block root 当传送恰好是块根时的快速路径
        // 快速路径：存在动态子节点（编译器标记optimized），走块子节点快速更新
        patchBlockChildren(
          n1.dynamicChildren!, // 旧的动态子节点
          dynamicChildren, // 新的动态子节点
          currentContainer, // 当前更新的容器（原/目标）
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
        )
        // even in block tree mode we need to make sure all root-level nodes 即使在块树模式下，我们也需要确保所有根级节点
        // in the teleport inherit previous DOM references so that they can 在传送中继承以前的 DOM 引用，以便它们可以
        // be moved in future patches.将在未来的补丁中移动。
        // in dev mode, deep traversal is necessary for HMR 开发模式下，HMR需要深度遍历
        traverseStaticChildren(n1, n2, !__DEV__)
      } else if (!optimized) {
        // 非优化路径：走全量diff更新子节点，处理子节点的增、删、改、移
        patchChildren(
          n1, // 旧VNode
          n2, // 新VNode
          currentContainer, // 当前更新的容器
          currentAnchor, // 当前更新的锚点
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          false, // 非块节点，标记为false
        )
      }

      // ********** 禁用状态/目标容器 变更处理：核心更新逻辑 **********
      if (disabled) {
        // 情况1：本次更新为「启用 → 禁用」（旧未禁用，新禁用）
        if (!wasDisabled) {
          // 将Teleport内容从「目标容器」移动到「原组件容器」，移动类型为状态切换
          // enabled -> disabled 启用->禁用
          // move into main container 移入主容器
          moveTeleport(
            n2,
            container,
            mainAnchor,
            internals,
            TeleportMoveTypes.TOGGLE,
          )
        } else {
          // #7835
          // When `teleport` is disabled, `to` may change, making it always old, 当 `teleport` 被禁用时，`to` 可能会改变，使其总是旧的
          // to ensure the correct `to` when enabled 确保启用时正确的“to”
          // 处理：禁用状态下若to属性变化，强制将新VNode的to赋值为旧VNode的to，保证后续启用时使用正确的目标
          if (n2.props && n1.props && n2.props.to !== n1.props.to) {
            n2.props.to = n1.props.to
          }
        }
      } else {
        // target changed
        // 情况2：本次更新为「启用状态」（新未禁用），处理「目标容器变化」或「禁用 → 启用」
        // 判断props中的to属性是否变化（目标容器是否需要更新）
        if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
          // 解析新的目标容器
          const nextTarget = (n2.target = resolveTarget(
            n2.props,
            querySelector,
          ))

          // 目标容器变化：将Teleport内容移动到新的目标容器，移动类型为目标变更
          if (nextTarget) {
            moveTeleport(
              n2,
              nextTarget,
              null,
              internals,
              TeleportMoveTypes.TARGET_CHANGE,
            )
          } else if (__DEV__) {
            warn(
              'Invalid Teleport target on update:', // 更新时传送目标无效
              target,
              `(${typeof target})`,
            )
          }
        }
        // 情况3：本次更新为「禁用 → 启用」（旧禁用，新启用）
        else if (wasDisabled) {
          // disabled -> enabled 禁用 -> 启用
          // move into teleport target 进入传送目标
          // 将Teleport内容从「原组件容器」移动到「目标容器」，移动类型为状态切换
          moveTeleport(
            n2,
            target,
            targetAnchor,
            internals,
            TeleportMoveTypes.TOGGLE,
          )
        }
      }
      // 最后：根据当前禁用状态，更新Teleport的CSS变量（适配容器变化后的样式）
      updateCssVars(n2, disabled)
    }
  },

  /**
   * Vue3 <Teleport> 组件专属卸载/移除核心方法
   *
   *
   * 核心作用：处理Teleport组件的卸载逻辑，完成「目标容器锚点清理、原容器锚点清理、子节点彻底卸载」，
   *          同时通过doRemove/shouldRemove参数灵活控制「是否移除DOM节点」，适配不同卸载场景（如Suspense挂起/组件真正卸载）
   *
   * 核心设计：
   *   1. 先清理锚点DOM，后卸载子节点
   *   2. 区分目标容器/原容器的锚点清理
   *   3. 调用 unmount 方法卸载子节点
   *
   * @param vnode Teleport的VNode对象，包含所有需要清理的锚点、子节点、目标容器引用
   * @param parentComponent 父组件的内部实例，可为null，用于子节点卸载时的上下文继承
   * @param parentSuspense 父级Suspense边界实例，可为null，适配Suspense挂起/恢复时的卸载逻辑
   * @param internals 渲染器内部方法集，解构使用2个核心方法：
   *                  - um: unmount：Vue渲染器的**组件/节点彻底卸载方法**（含生命周期、事件、指令销毁）
   *                  - o.remove: hostRemove：平台通用的**原生DOM节点移除方法**（仅删除DOM，不处理组件逻辑）
   * @param doRemove 布尔值，核心控制是否**移除原容器的占位锚点DOM节点**，同时影响子节点的卸载策略；
   *                 true=真正卸载（如组件销毁），false=临时卸载（如Suspense挂起，仅卸载子节点逻辑，保留DOM）
   * @returns void 无返回值
   */
  remove(
    vnode: VNode,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    { um: unmount, o: { remove: hostRemove } }: RendererInternals,
    doRemove: boolean,
  ): void {
    // 解构Teleport VNode的核心属性，均为之前挂载/更新阶段赋值的专属属性
    const {
      shapeFlag,
      children, // Teleport子节点数组；
      anchor, // 原容器结束占位锚点
      targetStart, // 目标容器的开始锚点；
      targetAnchor, // 目标容器的结束锚点；
      target, // Teleport目标容器
      props, // Teleport的props配置
    } = vnode

    // ********** 第一步：清理「目标容器」中的锚点DOM节点 **********
    // 若target存在（说明Teleport曾挂载到目标容器，非一直禁用状态），移除目标容器的start/anchor锚点
    // 这些锚点是纯DOM节点（注释/文本），直接用hostRemove原生移除即可，无需卸载逻辑
    if (target) {
      hostRemove(targetStart!)
      hostRemove(targetAnchor!)
    }

    // an unmounted teleport should always unmount its children whether it's disabled or not 卸载的传送应该始终卸载其子项，无论它是否被禁用
    // ********** 第二步：清理「原容器」中的结束占位锚点DOM节点 **********
    // doRemove为true时（真正卸载），才移除原容器的结束锚点；false时（临时卸载）保留，为后续恢复做准备
    // 源码原注释：已卸载的Teleport无论是否禁用，都应卸载其子节点（核心原则）
    doRemove && hostRemove(anchor!)

    // ********** 第三步：彻底卸载Teleport的子节点（核心逻辑）**********
    // 校验子节点类型：Vue编译器强制Teleport的子节点仅为「数组」或「无」，只需处理数组子节点
    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 计算子节点的「是否从DOM移除」标记：shouldRemove = 真正卸载 OR Teleport未被禁用
      // 核心逻辑：
      // 1. doRemove=true（真正卸载）：无论是否禁用，子节点都要从DOM移除
      // 2. doRemove=false（临时卸载）：仅当Teleport未禁用（内容在目标容器）时，子节点才从DOM移除；禁用时（内容在原容器）保留DOM
      const shouldRemove = doRemove || !isTeleportDisabled(props)

      // 遍历所有子节点，逐个调用渲染器的unmount方法完成**彻底卸载**
      for (let i = 0; i < (children as VNode[]).length; i++) {
        const child = (children as VNode[])[i]
        unmount(
          child, // 要卸载的子VNode（组件/普通元素）
          parentComponent, // 继承父组件实例，用于组件卸载的生命周期上下文
          parentSuspense, // 继承父级Suspense，适配Suspense的卸载/恢复逻辑
          shouldRemove, // 关键：是否将子节点从DOM中移除（false则仅销毁逻辑，保留DOM）
          !!child.dynamicChildren, // 是否为动态子节点，告知unmount走对应的优化卸载路径
        )
      }
    }
  },

  /**
   * 移动 Teleport
   */
  move: moveTeleport as typeof moveTeleport,
  hydrate: hydrateTeleport as typeof hydrateTeleport,
}

export enum TeleportMoveTypes {
  TARGET_CHANGE,
  TOGGLE, // enable / disable
  REORDER, // moved in the main view
}

/**
 * Vue3 Teleport 核心节点移动方法
 *
 * 核心作用：处理Teleport相关节点的跨容器/同容器移动，按需移动「目标容器锚点、原容器占位锚点、Teleport子节点」，
 *          仅移动DOM节点不重新创建，保留节点的事件、状态、属性，适配不同的移动场景（目标变更/状态切换/节点重排）
 *
 * 核心设计：根据moveType分支处理不同节点的移动逻辑，**按需移动**而非全量移动，避免无意义的DOM操作
 *
 *   -- 将 Teleport 的相关占位节点移动到正确位置
 *   -- 根据条件, 将 Teleport 的子节点移动到正确位置
 *
 *
 * @param vnode Teleport的VNode对象，包含所有需要移动的节点引用（占位锚点、目标锚点、子节点等）
 * @param container 节点要移动到的**目标容器**（真实DOM元素）
 * @param parentAnchor 目标容器中的**锚点节点**，用于确定移动后节点的插入位置（null则插入容器末尾）
 * @param internals 渲染器内部方法集，仅解构使用2个核心DOM操作方法：
 *                  - o.insert：原生DOM节点插入方法（Vue封装，兼容不同平台）
 *                  - m.move：Vue渲染器的节点移动方法（保留节点状态/事件，核心）
 * @param moveType 移动类型，默认值为REORDER（节点重排），枚举值为TeleportMoveTypes：
 *                 TARGET_CHANGE(目标容器变更) / TOGGLE(禁用状态切换) / REORDER(节点重排)
 * @returns void 无返回值
 */
function moveTeleport(
  vnode: VNode,
  container: RendererElement,
  parentAnchor: RendererNode | null,
  { o: { insert }, m: move }: RendererInternals,
  moveType: TeleportMoveTypes = TeleportMoveTypes.REORDER,
): void {
  // move target anchor if this is a target change. 如果这是目标更改，则移动目标锚点。
  // ********** 分支1：处理「目标容器变更」(moveType=TARGET_CHANGE) **********
  // 场景：Teleport的to属性变化，内容需要从旧目标容器移动到新目标容器
  // 操作：将Teleport在**目标容器**的锚点节点，插入到新的目标容器指定位置
  // 作用：在新目标容器中标记Teleport内容的位置，为后续子节点移动提供锚点
  if (moveType === TeleportMoveTypes.TARGET_CHANGE) {
    // 非空断言(!)：调用此方法前，Vue内部已确保vnode.targetAnchor存在，安全使用
    insert(vnode.targetAnchor!, container, parentAnchor)
  }

  // 解构vnode的核心属性：减少重复取值，提升代码可读性
  // el:原容器开始占位锚点；anchor:原容器结束占位锚点；shapeFlag:VNode类型标记；children:子节点；props:Teleport的props
  const { el, anchor, shapeFlag, children, props } = vnode
  // 标记当前是否为「节点重排」类型，简化后续多次判断
  const isReorder = moveType === TeleportMoveTypes.REORDER

  // move main view anchor if this is a re-order. 如果这是重新排序，则移动主视图锚点
  // ********** 分支2：处理「节点重排」(moveType=REORDER) - 第一步 **********
  // 场景：Teleport在原DOM树中的位置需要重排（如父组件子节点顺序变化）
  // 操作：将Teleport在**原容器**的**开始占位锚点(el)**，移动到目标容器指定位置
  // 作用：先移动开始锚点，为后续子节点、结束锚点的移动确定基准位置
  if (isReorder) {
    insert(el!, container, parentAnchor)
  }
  // if this is a re-order and teleport is enabled (content is in target) 如果这是重新排序且传送功能已启用（内容在目标位置）
  // do not move children. So the opposite is: only move children if this 不要移动孩子。所以反过来说就是：只有在这个情况下才移动孩子
  // is not a reorder, or the teleport is disabled 这不是重新排序，或者传送功能被禁用了

  // ********** 核心逻辑：判断是否需要移动「Teleport实际子节点」**********
  // 移动子节点的条件：**不是重排场景** OR **Teleport被禁用**
  // 源码原注释解释反推：
  // - 若「是重排场景」且「Teleport未禁用」→ 内容已在目标容器，无需移动子节点（仅移动原容器的占位锚点即可）
  // - 其他情况（非重排/禁用）→ 必须移动子节点（跨容器移动的核心：子节点才是Teleport的实际内容）
  if (!isReorder || isTeleportDisabled(props)) {
    // Teleport has either Array children or no children. Teleport 有 Array 子项或没有子项
    // 校验子节点类型：Vue编译器和VNode规范化保证Teleport的子节点仅为「数组」或「无」，无需处理其他类型
    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 遍历所有子节点，逐个调用渲染器的move方法移动到目标容器
      for (let i = 0; i < (children as VNode[]).length; i++) {
        move(
          (children as VNode[])[i], // 要移动的子VNode
          container, // 移动到的目标容器
          parentAnchor, // 目标容器的锚点
          MoveType.REORDER, // 移动类型标记为重排，告知move方法保留节点状态
        )
      }
    }
  }

  // move main view anchor if this is a re-order. 如果这是重新排序，则移动主视图锚点
  // ********** 分支3：处理「节点重排」(moveType=REORDER) - 第二步 **********
  // 场景：同分支2，Teleport在原DOM树中的位置需要重排
  // 操作：将Teleport在**原容器**的**结束占位锚点(anchor)**，移动到目标容器指定位置
  // 作用：开始锚点→子节点→结束锚点 保持顺序，完整标记Teleport在原DOM树的位置
  if (isReorder) {
    insert(anchor!, container, parentAnchor)
  }
}

interface TeleportTargetElement extends Element {
  // last teleport target
  _lpa?: Node | null
}

function hydrateTeleport(
  node: Node,
  vnode: TeleportVNode,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  slotScopeIds: string[] | null,
  optimized: boolean,
  {
    o: { nextSibling, parentNode, querySelector, insert, createText },
  }: RendererInternals<Node, Element>,
  hydrateChildren: (
    node: Node | null,
    vnode: VNode,
    container: Element,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    slotScopeIds: string[] | null,
    optimized: boolean,
  ) => Node | null,
): Node | null {
  function hydrateDisabledTeleport(
    node: Node,
    vnode: VNode,
    targetStart: Node | null,
    targetAnchor: Node | null,
  ) {
    vnode.anchor = hydrateChildren(
      nextSibling(node),
      vnode,
      parentNode(node)!,
      parentComponent,
      parentSuspense,
      slotScopeIds,
      optimized,
    )
    vnode.targetStart = targetStart
    vnode.targetAnchor = targetAnchor
  }

  const target = (vnode.target = resolveTarget<Element>(
    vnode.props,
    querySelector,
  ))
  const disabled = isTeleportDisabled(vnode.props)
  if (target) {
    // if multiple teleports rendered to the same target element, we need to
    // pick up from where the last teleport finished instead of the first node
    const targetNode =
      (target as TeleportTargetElement)._lpa || target.firstChild
    if (vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      if (disabled) {
        hydrateDisabledTeleport(
          node,
          vnode,
          targetNode,
          targetNode && nextSibling(targetNode),
        )
      } else {
        vnode.anchor = nextSibling(node)

        // lookahead until we find the target anchor
        // we cannot rely on return value of hydrateChildren() because there
        // could be nested teleports
        let targetAnchor = targetNode
        while (targetAnchor) {
          if (targetAnchor && targetAnchor.nodeType === 8) {
            if ((targetAnchor as Comment).data === 'teleport start anchor') {
              vnode.targetStart = targetAnchor
            } else if ((targetAnchor as Comment).data === 'teleport anchor') {
              vnode.targetAnchor = targetAnchor
              ;(target as TeleportTargetElement)._lpa =
                vnode.targetAnchor && nextSibling(vnode.targetAnchor as Node)
              break
            }
          }
          targetAnchor = nextSibling(targetAnchor)
        }

        // #11400 if the HTML corresponding to Teleport is not embedded in the
        // correct position on the final page during SSR. the targetAnchor will
        // always be null, we need to manually add targetAnchor to ensure
        // Teleport it can properly unmount or move
        if (!vnode.targetAnchor) {
          prepareAnchor(target, vnode, createText, insert)
        }

        hydrateChildren(
          targetNode && nextSibling(targetNode),
          vnode,
          target,
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized,
        )
      }
    }
    updateCssVars(vnode, disabled)
  } else if (disabled) {
    if (vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      hydrateDisabledTeleport(node, vnode, node, nextSibling(node))
    }
  }
  return vnode.anchor && nextSibling(vnode.anchor as Node)
}

// Force-casted public typing for h and TSX props inference 用于 h 和 TSX props 推理的强制公共类型
export const Teleport = TeleportImpl as unknown as {
  /** 标识为 Teleport 组件 */
  __isTeleport: true
  new (): {
    $props: VNodeProps & TeleportProps
    $slots: {
      default(): VNode[]
    }
  }
}

/**
 * 更新CSS变量相关的数据属性
 * 此函数用于在Teleport组件中处理CSS变量的作用域，通过设置data-v-owner属性来标识元素的所有者
 *
 * @param vnode - 虚拟节点对象，表示当前Teleport组件的虚拟DOM节点
 * @param isDisabled - 布尔值，指示Teleport是否被禁用（true表示Teleport被禁用，内容在原位置渲染；false表示Teleport启用，内容传送至目标位置）
 */
function updateCssVars(vnode: VNode, isDisabled: boolean) {
  // presence of .ut method indicates owner component uses css vars. .ut 方法的存在表明所有者组件使用 CSS 变量
  // code path here can assume browser environment. 这里的代码路径可以假设浏览器环境

  // 1. 核心判断依据：vnode.ctx(组件上下文)存在且包含.ut方法 → 说明组件使用了CSS变量/Scoped CSS
  //    .ut是Vue编译器为组件自动生成的内部方法（updateVars的缩写），专门用于更新组件CSS变量
  //    注：这里的代码路径可安全假设为浏览器环境，因为Teleport的DOM操作仅在浏览器执行，服务端渲染不会调用此方法
  const ctx = vnode.ctx
  if (ctx && ctx.ut) {
    // 2. 声明两个核心变量：遍历的起始节点(node)、结束锚点(anchor)
    //    根据Teleport是否禁用，选择**不同的节点范围**（因为禁用/未禁用时内容所在容器不同）
    let node, anchor

    if (isDisabled) {
      // 情况1：Teleport被禁用 → 内容渲染在**原组件容器**
      // 起始节点=Teleport在原容器的开始占位节点(vnode.el)
      // 结束锚点=Teleport在原容器的结束占位节点(vnode.anchor)
      node = vnode.el
      anchor = vnode.anchor
    } else {
      // 情况2：Teleport未禁用 → 内容渲染在**Teleport目标容器**
      // 起始节点=目标容器中的内容开始标记节点(vnode.targetStart)
      // 结束锚点=目标容器中的内容结束锚点节点(vnode.targetAnchor)
      node = vnode.targetStart
      anchor = vnode.targetAnchor
    }

    // 3. 遍历从startNode到endAnchor之间的**所有兄弟节点**（Teleport的实际渲染内容）
    //    终止条件：node遍历到anchor时停止（不包含anchor本身）
    while (node && node !== anchor) {
      // 仅对**元素节点**处理（nodeType===1 表示原生DOM元素，排除文本/注释/文档节点）

      // 给元素打上**组件归属标记**：data-v-owner = 组件唯一标识(ctx.uid)
      // 作用：关联跨容器的DOM元素到其所属的组件，让Scoped CSS的样式选择器能正确匹配
      // 注：ctx.uid是Vue为每个组件实例生成的唯一数字ID，避免多组件样式冲突
      if (node.nodeType === 1) node.setAttribute('data-v-owner', ctx.uid)
      // 遍历下一个兄弟节点，继续处理
      node = node.nextSibling
    }

    // 4. 调用组件编译器生成的CSS变量更新方法(ut)
    //    作用：将组件的自定义CSS变量、Scoped CSS的样式变量同步到所有带data-v-owner标记的DOM元素上
    //    最终实现：跨容器的Teleport内容，能正确应用所属组件的CSS样式和变量
    ctx.ut()
  }
}

/**
 * 准备Teleport组件的目标锚点元素
 * 创建用于标记Teleport内容在目标容器中起始和结束位置的文本节点
 *
 * @param target - Teleport组件的目标DOM元素，可能为空
 * @param vnode - Teleport组件对应的虚拟节点
 * @param createText - 用于创建文本节点的渲染器方法
 * @param insert - 用于插入节点到DOM的渲染器方法
 * @returns 返回作为目标锚点的文本节点
 */
function prepareAnchor(
  target: RendererElement | null,
  vnode: TeleportVNode,
  createText: RendererOptions['createText'],
  insert: RendererOptions['insert'],
) {
  // 创建标记Teleport内容开始位置的文本节点
  const targetStart = (vnode.targetStart = createText(''))
  // 创建标记Teleport内容结束位置的文本节点
  const targetAnchor = (vnode.targetAnchor = createText(''))

  // 附加特殊属性，以便在渲染器的nextSibling搜索中跳过传送的内容
  // attach a special property, so we can skip teleported content in 附加一个特殊的属性，这样我们就可以跳过传送的内容
  // renderer's nextSibling search 渲染器的 nextSibling 搜索
  targetStart[TeleportEndKey] = targetAnchor

  // 将开始和结束标记插入到目标元素中
  if (target) {
    insert(targetStart, target)
    insert(targetAnchor, target)
  }

  return targetAnchor
}
