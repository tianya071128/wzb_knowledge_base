import {
  type ComponentInternalInstance,
  type ComponentOptions,
  type SetupContext,
  getCurrentInstance,
} from '../component'
import {
  Comment,
  Fragment,
  type VNode,
  type VNodeArrayChildren,
  cloneVNode,
  isSameVNodeType,
} from '../vnode'
import { warn } from '../warning'
import { isKeepAlive } from './KeepAlive'
import { toRaw } from '@vue/reactivity'
import { ErrorCodes, callWithAsyncErrorHandling } from '../errorHandling'
import { PatchFlags, ShapeFlags, isArray, isFunction } from '@vue/shared'
import { onBeforeUnmount, onMounted } from '../apiLifecycle'
import { isTeleport } from './Teleport'
import type { RendererElement } from '../renderer'
import { SchedulerJobFlags } from '../scheduler'

type Hook<T = () => void> = T | T[]

export const leaveCbKey: unique symbol = Symbol('_leaveCb')
const enterCbKey: unique symbol = Symbol('_enterCb')

export interface BaseTransitionProps<HostElement = RendererElement> {
  mode?: 'in-out' | 'out-in' | 'default'
  appear?: boolean

  // If true, indicates this is a transition that doesn't actually insert/remove 如果为真，则表示这是一个实际上并不进行插入/移除的转换
  // the element, but toggles the show / hidden status instead. 该元素，但会切换其显示/隐藏状态
  // The transition hooks are injected, but will be skipped by the renderer. 过渡钩子已注入，但将被渲染器跳过
  // Instead, a custom directive can control the transition by calling the 相反，自定义指令可以通过调用来控制过渡
  // injected hooks (e.g. v-show).注入式钩子（例如 v-show）
  persisted?: boolean

  // Hooks. Using camel case for easier usage in render functions & JSX.
  // In templates these can be written as @before-enter="xxx" as prop names
  // are camelized.
  onBeforeEnter?: Hook<(el: HostElement) => void>
  onEnter?: Hook<(el: HostElement, done: () => void) => void>
  onAfterEnter?: Hook<(el: HostElement) => void>
  onEnterCancelled?: Hook<(el: HostElement) => void>
  // leave
  onBeforeLeave?: Hook<(el: HostElement) => void>
  onLeave?: Hook<(el: HostElement, done: () => void) => void>
  onAfterLeave?: Hook<(el: HostElement) => void>
  onLeaveCancelled?: Hook<(el: HostElement) => void> // only fired in persisted mode
  // appear
  onBeforeAppear?: Hook<(el: HostElement) => void>
  onAppear?: Hook<(el: HostElement, done: () => void) => void>
  onAfterAppear?: Hook<(el: HostElement) => void>
  onAppearCancelled?: Hook<(el: HostElement) => void>
}

export interface TransitionHooks<HostElement = RendererElement> {
  mode: BaseTransitionProps['mode']
  persisted: boolean
  beforeEnter(el: HostElement): void
  enter(el: HostElement): void
  leave(el: HostElement, remove: () => void): void
  clone(vnode: VNode): TransitionHooks<HostElement>
  // optional
  afterLeave?(): void
  delayLeave?(
    el: HostElement,
    earlyRemove: () => void,
    delayedLeave: () => void,
  ): void
  delayedLeave?(): void
}

export type TransitionHookCaller = <T extends any[] = [el: any]>(
  hook: Hook<(...args: T) => void> | undefined,
  args?: T,
) => void

export type PendingCallback = (cancelled?: boolean) => void

export interface TransitionState {
  isMounted: boolean
  isLeaving: boolean
  isUnmounting: boolean
  // Track pending leave callbacks for children of the same key. 跟踪相同键的子级的待处理休假回调
  // This is used to force remove leaving a child when a new copy is entering. 这用于在新副本进入时强制删除留下的子项
  leavingVNodes: Map<any, Record<string, VNode>>
}

export interface TransitionElement {
  // in persisted mode (e.g. v-show), the same element is toggled, so the
  // pending enter/leave callbacks may need to be cancelled if the state is toggled
  // before it finishes.
  [enterCbKey]?: PendingCallback
  [leaveCbKey]?: PendingCallback
}

/**
 * Vue3 <transition> 组件的核心状态管理 Hook
 *
 * @returns TransitionState 包含组件过渡相关状态的对象
 */
export function useTransitionState(): TransitionState {
  // 1. 初始化过渡状态容器，所有状态初始化为默认值
  const state: TransitionState = {
    // 标记 Transition 组件是否已挂载到 DOM：
    // - false：组件未挂载，暂不执行动画（避免操作未挂载的 DOM）；
    // - true：组件已挂载，可正常执行入场/离场动画。
    isMounted: false,
    // 标记是否处于离场动画中：
    // - true：离场动画执行中，Transition 渲染函数返回空占位符（避免新旧节点同时显示）；
    // - false：无离场动画，正常渲染子节点。
    isLeaving: false,
    // 标记 Transition 组件是否正在卸载：
    // - true：组件即将卸载，需终止未完成的动画，避免操作已销毁的 DOM；
    // - false：组件正常运行，可执行动画。
    isUnmounting: false,
    // 缓存正在执行离场动画的 VNode：
    // - Key：VNode 的唯一标识（如 key）；Value：对应的 VNode 实例；
    // - 作用：避免 GC 提前回收离场 VNode，保证离场动画完整执行；动画完成后需手动删除缓存。
    leavingVNodes: new Map(),
  }

  // 2. 组件挂载完成后，更新 isMounted 为 true
  // 触发时机：Transition 组件的根节点挂载到 DOM 后执行；
  // 目的：标识组件已就绪，后续可正常执行入场/离场动画（避免操作未挂载的 DOM 导致报错）。
  onMounted(() => {
    state.isMounted = true
  })

  // 3. 组件卸载前，更新 isUnmounting 为 true
  // 触发时机：Transition 组件即将卸载（onBeforeUnmount 钩子）；
  // 目的：标记组件进入卸载流程，Transition 的动画逻辑会根据该状态终止未完成的动画，避免操作已销毁的 DOM/实例。
  onBeforeUnmount(() => {
    state.isUnmounting = true
  })

  // 4. 返回状态容器，供 Transition 的 setup 函数使用
  // 注意：该状态对象会被 Transition 的渲染函数直接修改（如 state.isLeaving = true），
  // 因仅在同步渲染流程中使用，无需响应式（ref/reactive），提升性能。
  return state
}

const TransitionHookValidator = [Function, Array]

export const BaseTransitionPropsValidators: Record<string, any> = {
  mode: String,
  appear: Boolean,
  /**
   * 该 DOM 可能不通过 v-if 切换, 而是 v-show(或其他方式) 切换, 此时添加标记
   * 在渲染器中不执行钩子, 由其他地方执行
   */
  persisted: Boolean,
  // enter
  onBeforeEnter: TransitionHookValidator,
  onEnter: TransitionHookValidator,
  onAfterEnter: TransitionHookValidator,
  onEnterCancelled: TransitionHookValidator,
  // leave
  onBeforeLeave: TransitionHookValidator,
  onLeave: TransitionHookValidator,
  onAfterLeave: TransitionHookValidator,
  onLeaveCancelled: TransitionHookValidator,
  // appear
  onBeforeAppear: TransitionHookValidator,
  onAppear: TransitionHookValidator,
  onAfterAppear: TransitionHookValidator,
  onAppearCancelled: TransitionHookValidator,
}

const recursiveGetSubtree = (instance: ComponentInternalInstance): VNode => {
  const subTree = instance.subTree
  return subTree.component ? recursiveGetSubtree(subTree.component) : subTree
}

const BaseTransitionImpl: ComponentOptions = {
  name: `BaseTransition`,

  props: BaseTransitionPropsValidators,

  /**
   * Vue3 <transition> 组件核心 setup 函数
   *
   * 核心作用：最主要是封装了一些 hook 在 vnode.transition(具体作用的元素) 上, 供渲染器在不同时机触发
   *    1. 找到作用的 VNode
   *        1.1 从子节点中找到第一个非注释节点（注释节点是Vue内部占位符，无需过渡）
   *              - 组件VNode不会继续提取组件VNode的根VNode, 因为这个组件VNode可能还没有渲染
   *              - 组件VNode
   *                 -- 如果存在实例的话, 会在下面的 setTransitionHooks 的方法中找到 vnode.component.subTree 添加到根元素中
   *                 -- 如果初始化时, 此时没有实例也就没有渲染过, 会在后续渲染的时候通过将 vnode.transition 透传到根元素的vnode中(如果非根, 那么会警告)
   *        1.2 特殊处理 KeepAlive 和 Teleport 组件，见 getInnerChild 方法处理逻辑
   *    2. 封装 hook, 添加到 VNode.transition 中, 后续供渲染器在不同阶段使用实现过渡动画
   *    3. 从 instance.subTree 中提取出旧的 VNode, 处理新旧节点切换的过渡模式
   *        3.1
   *
   *  hook 触发的时机: 在 resolveTransitionHooks 方法中 hook 对象中查看详情
   *
   * @param props Transition组件的基础props（BaseTransitionProps），包含name/mode/duration/enterFrom等配置
   * @param { slots } SetupContext 解构出slots，Transition仅处理默认插槽的子节点
   * @returns () => VNode | undefined 动态渲染函数，返回最终要渲染的VNode（或占位符）
   */
  setup(props: BaseTransitionProps, { slots }: SetupContext) {
    // 获取当前Transition组件的内部实例，非空断言：Transition作为内置组件，实例一定存在
    const instance = getCurrentInstance()!
    // 初始化过渡状态管理对象（内部hook，返回isLeaving等状态变量，控制过渡流程）
    const state = useTransitionState()

    // ********** Transition的核心渲染函数 **********
    // 每次组件更新时执行，决定最终渲染的内容
    return () => {
      // 1. 获取默认插槽的原始子节点，过滤掉过渡相关的包装节点（getTransitionRawChildren）
      // 第二个参数true：强制获取原始子节点，跳过过渡的内部包装逻辑
      const children =
        slots.default && getTransitionRawChildren(slots.default(), true)

      // 无有效子节点 → 返回undefined，不渲染任何内容
      if (!children || !children.length) {
        return
      }

      /**
       * 2. 从子节点中找到第一个非注释节点（注释节点是Vue内部占位符，无需过渡）
       *     - 组件VNode不会继续提取组件VNode的根VNode, 因为这个组件VNode可能还没有渲染
       *     - 组件VNode
       *        -- 如果存在实例的话, 会在下面的 setTransitionHooks 的方法中找到 vnode.component.subTree 添加到根元素中
       *        -- 如果初始化时, 此时没有实例也就没有渲染过, 会在后续渲染的时候通过将 vnode.transition 透传到根元素的vnode中(如果非根, 那么会警告)
       */
      const child: VNode = findNonCommentChild(children)

      // 性能优化：跳过props的响应式追踪，直接使用原始props（过渡props无需响应式更新，提升性能）
      // there's no need to track reactivity for these props so use the raw 无需跟踪这些道具的反应性，因此使用原始
      // props for a bit better perf 道具以获得更好的性能
      const rawProps = toRaw(props)
      // 解构过渡模式（mode）：default/out-in/in-out，控制入场/离场顺序
      const { mode } = rawProps

      // 开发环境校验：mode必须是合法值，否则输出警告
      // check mode
      if (
        __DEV__ &&
        mode &&
        mode !== 'in-out' &&
        mode !== 'out-in' &&
        mode !== 'default'
      ) {
        warn(`invalid <transition> mode: ${mode}`) // <transition> 模式无效
      }

      // 3. 若当前处于离场动画中（isLeaving=true）→ 返回空占位符节点
      // 空占位符：保证DOM结构稳定，避免离场过程中节点突然消失，导致动画中断
      if (state.isLeaving) {
        return emptyPlaceholder(child)
      }

      // 4. 兼容KeepAlive场景：获取KeepAlive包裹的真实子VNode（跳过KeepAlive的包装层）
      // in the case of <transition><keep-alive/></transition>, we need to  在<transition><keep-alive></transition>的情况下，我们需要
      // compare the type of the kept-alive children. 比较 kept-alive 的类型。
      const innerChild = getInnerChild(child)
      // 无真实子节点（如KeepAlive无缓存）→ 返回空占位符
      if (!innerChild) {
        return emptyPlaceholder(child)
      }

      // 5. 解析入场过渡钩子（enterHooks）：包含beforeEnter/enter/afterEnter等生命周期
      let enterHooks = resolveTransitionHooks(
        innerChild, // 要执行入场动画的目标VNode
        rawProps, // 原始过渡props（无响应式）
        state, // 过渡状态对象
        instance, // 当前Transition组件实例
        // 钩子更新回调，保证cloneVNode后enterHooks是最新的（修复#11061）
        // #11061, ensure enterHooks is fresh after clone 确保克隆后 EnterHooks 是新鲜的
        hooks => (enterHooks = hooks), // 钩子更新回调，缓存最新的入场钩子
      )

      // 6. 若目标节点不是注释节点 → 将入场钩子绑定到VNode上（供渲染器执行动画）
      // setTransitionHooks：Vue内部方法，将过渡钩子挂载到VNode的transition属性上
      if (innerChild.type !== Comment) {
        setTransitionHooks(innerChild, enterHooks)
      }

      // 7. 获取上一次渲染的子VNode（旧节点）：用于判断是否需要执行离场动画
      // instance.subTree：组件上一次渲染的标准化VNode树
      let oldInnerChild = instance.subTree && getInnerChild(instance.subTree)

      // 8. 核心逻辑：处理新旧节点切换的过渡模式（判断是否需要执行离场动画）
      // 触发条件：存在旧节点 + 旧节点非注释 + 新旧节点类型不同 + 递归子树非注释
      // handle mode 处理方式
      if (
        oldInnerChild &&
        oldInnerChild.type !== Comment &&
        !isSameVNodeType(oldInnerChild, innerChild) &&
        recursiveGetSubtree(instance).type !== Comment
      ) {
        let leavingHooks = resolveTransitionHooks(
          oldInnerChild,
          rawProps,
          state,
          instance,
        )
        // update old tree's hooks in case of dynamic transition
        setTransitionHooks(oldInnerChild, leavingHooks)
        // switching between different views
        if (mode === 'out-in' && innerChild.type !== Comment) {
          state.isLeaving = true
          // return placeholder node and queue update when leave finishes
          leavingHooks.afterLeave = () => {
            state.isLeaving = false
            // #6835
            // it also needs to be updated when active is undefined
            if (!(instance.job.flags! & SchedulerJobFlags.DISPOSED)) {
              instance.update()
            }
            delete leavingHooks.afterLeave
            oldInnerChild = undefined
          }
          return emptyPlaceholder(child)
        } else if (mode === 'in-out' && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (
            el: TransitionElement,
            earlyRemove,
            delayedLeave,
          ) => {
            const leavingVNodesCache = getLeavingNodesForType(
              state,
              oldInnerChild!,
            )
            leavingVNodesCache[String(oldInnerChild!.key)] = oldInnerChild!
            // early removal callback
            el[leaveCbKey] = () => {
              earlyRemove()
              el[leaveCbKey] = undefined
              delete enterHooks.delayedLeave
              oldInnerChild = undefined
            }
            enterHooks.delayedLeave = () => {
              delayedLeave()
              delete enterHooks.delayedLeave
              oldInnerChild = undefined
            }
          }
        } else {
          oldInnerChild = undefined
        }
      }
      // 无新旧节点切换 → 重置旧节点
      else if (oldInnerChild) {
        oldInnerChild = undefined
      }

      // 9. 返回最终要渲染的子节点（执行入场动画）
      return child
    }
  },
}

if (__COMPAT__) {
  BaseTransitionImpl.__isBuiltIn = true
}

/**
 * Vue3 Transition 组件的单节点校验与提取函数
 *
 * 核心作用：
 *    1. 从子节点列表中找到第一个非注释节点（跳过 v-if 等生成的注释占位符）；
 *    2. 开发环境下校验是否存在多个非注释节点，给出警告（Transition 仅支持单个节点，多节点需用 TransitionGroup）；
 *    3. 生产环境下找到第一个有效节点后立即终止遍历，提升性能。
 *
 * @param children Transition 插槽的子 VNode 数组（已通过 getTransitionRawChildren 扁平化处理）
 * @returns VNode 第一个非注释的有效子节点（若全为注释节点，返回第一个子节点）
 */
function findNonCommentChild(children: VNode[]): VNode {
  // 1. 初始化默认子节点：默认取第一个子节点（可能是注释节点，后续会替换）
  let child: VNode = children[0]

  // 2. 子节点数量大于1时，执行单节点校验与有效节点查找
  if (children.length > 1) {
    // 标记是否已找到第一个非注释节点
    let hasFound = false
    // locate first non-comment child 找到第一个非评论子项
    // 遍历所有子节点，寻找第一个非注释节点，并校验是否存在多个有效节点
    for (const c of children) {
      // 跳过注释节点（v-if/v-else 等生成的占位符注释，无实际过渡意义）
      if (c.type !== Comment) {
        if (__DEV__ && hasFound) {
          // 开发环境下：若已找到过非注释节点（hasFound=true），说明存在多个有效节点，输出警告
          // warn more than one non-comment child 警告多个不发表评论的孩子
          warn(
            '<transition> can only be used on a single element or component. ' +
              'Use <transition-group> for lists.',
          )
          break
        }
        // 记录第一个非注释节点
        child = c
        // 标记已找到有效节点
        hasFound = true

        // 生产环境下：找到第一个有效节点后立即终止遍历（无需继续校验，提升性能）
        if (!__DEV__) break
      }
    }
  }

  // 3. 返回第一个非注释的有效子节点（若全为注释节点，返回初始的第一个子节点）
  return child
}

// export the public type for h/tsx inference 导出 h/tsx 推理的公共类型
// also to avoid inline import() in generated d.ts files 还可以避免在生成的 d.ts 文件中使用内联 import()
export const BaseTransition = BaseTransitionImpl as unknown as {
  new (): {
    $props: BaseTransitionProps<any>
    $slots: {
      default(): VNode[]
    }
  }
}

/**
 * 获取指定类型节点的离开状态节点缓存
 * 此函数用于获取与给定 vnode 类型关联的正在离开的虚拟节点记录
 *
 * @param state - 过渡状态对象，包含离开节点的映射信息
 * @param vnode - 虚拟节点，用于确定要查找的节点类型
 * @returns 返回一个记录对象，键为字符串，值为对应的虚拟节点
 */
function getLeavingNodesForType(
  state: TransitionState,
  vnode: VNode,
): Record<string, VNode> {
  // 获取离开节点映射表
  const { leavingVNodes } = state

  // 尝试从状态中获取当前节点类型的离开节点缓存
  let leavingVNodesCache = leavingVNodes.get(vnode.type)!

  // 如果没有找到对应类型的缓存，则创建一个新的空对象作为缓存
  if (!leavingVNodesCache) {
    leavingVNodesCache = Object.create(null)
    leavingVNodes.set(vnode.type, leavingVNodesCache)
  }
  return leavingVNodesCache
}

// The transition hooks are attached to the vnode as vnode.transition 转换钩子作为 vnode.transition 附加到 vnode
// and will be called at appropriate timing in the renderer. 并将在渲染器中的适当时间被调用
/**
 * Vue3 Transition 组件的过渡钩子解析核心函数
 * 核心作用：
 *    1. 解析 Transition props 中的所有过渡钩子（enter/leave/appear 系列），整合为标准化的 TransitionHooks 对象；
 *    2. 处理 appear 特性（首次挂载动画）、persisted（持久化过渡）、mode（过渡模式）等配置的钩子适配；
 *    3. 解决相同 key 节点（v-if/v-show）的过渡冲突，保证入场/离场钩子执行时序正确；
 *    4. 封装钩子执行的通用逻辑（异步错误处理、done 回调、取消逻辑）；
 *    5. 缓存离场中的 VNode，处理延迟离场/提前取消的边界场景；
 *    6. 提供 clone 方法，支持 VNode 克隆后钩子的重新解析（兼容动态过渡配置）。
 *
 *
 * @param vnode 要执行过渡动画的目标 VNode
 * @param props Transition 组件的基础 props（包含所有过渡钩子、appear/mode/persisted 等配置）
 * @param state Transition 组件的状态对象（isMounted/isUnmounting/leavingVNodes 等）
 * @param instance 当前 Transition 组件的内部实例
 * @param postClone 可选回调，VNode 克隆后触发（用于更新钩子缓存，修复 #11061）
 * @returns TransitionHooks 标准化的过渡钩子对象，包含 beforeEnter/enter/leave 等可执行方法
 */
export function resolveTransitionHooks(
  vnode: VNode,
  props: BaseTransitionProps<any>,
  state: TransitionState,
  instance: ComponentInternalInstance,
  postClone?: (hooks: TransitionHooks) => void,
): TransitionHooks {
  // 1. 解构 Transition props 中的核心配置和钩子
  const {
    appear, // 是否在首次挂载时执行 appear 动画（替代 enter 动画）
    mode, // 过渡模式（default/out-in/in-out）
    persisted = false, // 是否为持久化过渡（如 <keep-alive> 组件的过渡，不销毁 DOM）

    // 入场钩子（常规）
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,

    // 离场钩子
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    onLeaveCancelled,

    // 首次挂载钩子（appear 模式）
    onBeforeAppear,
    onAppear,
    onAfterAppear,
    onAppearCancelled,
  } = props

  // 2. 初始化核心缓存和标识
  const key = String(vnode.key)
  // 获取当前 VNode 类型对应的离场 VNode 缓存容器（避免同类型节点的动画冲突）
  const leavingVNodesCache = getLeavingNodesForType(state, vnode)

  // 3. 通用钩子执行器：封装错误处理，统一调用逻辑
  // TransitionHookCaller：Vue 内部类型，定义钩子调用函数的签名
  const callHook: TransitionHookCaller = (hook, args) => {
    // 钩子存在时，通过 callWithAsyncErrorHandling 执行（捕获同步/异步错误，上报到全局错误处理器）
    hook &&
      callWithAsyncErrorHandling(
        hook, // 要执行的钩子函数
        instance, // 所属组件实例
        ErrorCodes.TRANSITION_HOOK, // 错误类型标识（便于定位 Transition 钩子错误）
        args, // 传递给钩子的参数（如 el）
      )
  }

  // 4. 异步钩子执行器：处理接收 done 回调的异步钩子
  // 核心逻辑：自动判断钩子是否需要手动调用 done，未接收 done 参数则自动调用
  const callAsyncHook = (
    hook: Hook<(el: any, done: () => void) => void>,
    args: [TransitionElement, () => void],
  ) => {
    // 提取 done 回调
    const done = args[1]
    // 执行钩子
    callHook(hook, args)

    // 判断是否需要自动调用 done：
    // - 数组钩子：所有钩子的参数长度 <=1（未接收 done）→ 自动调用 done
    // - 单个钩子：参数长度 <=1 → 自动调用 done
    if (isArray(hook)) {
      if (hook.every(hook => hook.length <= 1)) done()
    } else if (hook.length <= 1) {
      done()
    }
  }

  // 5. 构建标准化的过渡钩子对象（核心）
  const hooks: TransitionHooks<TransitionElement> = {
    mode,
    persisted,
    /**
     * 在元素被插入到 DOM 之前被调用
     *  - 调用时机
     *      -- 若 persisted 为 false, 在 ../renderer 的 mountElement 中调用
     *      -- 若 persisted 为 true, 例如 v-show 中, 会在 VShow 指令中的 beforeMount 钩子中调用 --> /runtime-dom/src/directives/vShow.ts
     *  - 此时 DOM 已经准备好, 并且 props 属性和事件已经挂载, 只是没有添加到 DOM 树中
     *  - 执行最终传入的 props.onBeforeEnter 或者 props.onBeforeAppear(首次挂载并且开启 appear 模式)
     *      -- 对于不同平台, 在 BaseTransition 之上还封装了一层, 这里传入的钩子具体逻辑在 /runtime-dom/src/components/Transition.ts 的 resolveTransitionProps 方法中
     *          --- 执行用户自定义钩子
     *          --- 添加 `${name}-enter-from` 和 `${name}-enter-active` 类
     */
    beforeEnter(el) {
      // 默认使用常规 beforeEnter 钩子
      let hook = onBeforeEnter
      // 首次挂载且开启 appear 模式：使用 appear 钩子（优先级更高）
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter // 无 onBeforeAppear 则降级为 onBeforeEnter
        } else {
          return // 未开启 appear → 首次挂载不执行 beforeEnter
        }
      }

      // 处理场景1：同一元素（v-show）的未完成离场钩子 → 取消离场动画
      // for same element (v-show) 对于相同的元素（v-show）
      if (el[leaveCbKey]) {
        el[leaveCbKey](true /* cancelled */) // 标记为取消，执行离场取消逻辑
      }

      // 处理场景2：相同 key 的切换元素（v-if）的未完成离场钩子 → 强制提前移除
      // for toggled element with same key (v-if) 对于具有相同键的切换元素 (v-if)
      const leavingVNode = leavingVNodesCache[key]
      if (
        leavingVNode &&
        isSameVNodeType(vnode, leavingVNode) && // 新旧节点类型相同
        (leavingVNode.el as TransitionElement)[leaveCbKey]
      ) {
        // force early removal (not cancelled) 强制提前删除（未取消）
        ;(leavingVNode.el as TransitionElement)[leaveCbKey]!()
      }

      // 执行最终的 beforeEnter/appear 钩子
      callHook(hook, [el])
    },
    /**
     * 在元素被插入到 DOM 之后的下一帧被调用
     *  - 调用时机
     *      -- 若 persisted 为 false, 在 ../renderer 的 mountElement 中调用, 会在异步队列中保证插入到了 DOM 树中
     *      -- 若 persisted 为 true, 例如 v-show 中, 会在 VShow 指令中的 mounted 和 updated 钩子中调用 --> /runtime-dom/src/directives/vShow.ts
     *  - 此时已经插入到 DOM 树中
     *  - 执行最终传入的 props.onEnter、props.onAfterEnter, props.onEnterCancelled 或者 props.onAppear(首次挂载并且开启 appear 模式)、...
     *      -- 同理, 最终执行的钩子是在平台层的封装器中执行
     *          --- 执行用户自定义钩子
     *          --- 在下一帧(requestAnimationFrame API)中移除 `${name}-enter-from` 类名
     *          --- 添加 `${name}-enter-to` 类名
     *          --- 监听动画结束
     *              ---- 若用户自定义钩子中, 使用了 done 回调(检测用户自定义钩子的入参个数), 那么由用户自定义结束时机
     *              ---- 否则自定义监听动画结束
     *                  ----- 优先使用用户显式指定的时长（explicitTimeout），替代自动事件监听 --> 直接定时器监听
     *                  ----- 否则从目标元素 getComputedStyle 中提取 transition/animation 相关的样式、时间等信息
     *              ---- 动画结束后, 移除 `${name}-enter-to` 和 `${name}-enter-active` 类
     *      -- 在动画结束后, 最终会执行 done 回调
     *          --- 执行 onAfterEnter 或者 onEnterCancelled(取消进入动画) 钩子
     *          --- 如果是 in-out 模式, 那么 hooks.delayedLeave 上被挂载函数, 执行触发离场动画
     */
    enter(el) {
      let hook = onEnter // 默认使用常规 enter 钩子
      let afterHook = onAfterEnter // 默认使用常规 afterEnter 钩子
      let cancelHook = onEnterCancelled // 默认使用常规 enterCancelled 钩子

      // 首次挂载且开启 appear 模式：替换为 appear 系列钩子
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter
          afterHook = onAfterAppear || onAfterEnter
          cancelHook = onAppearCancelled || onEnterCancelled
        } else {
          return // 未开启 appear → 首次挂载不执行 enter
        }
      }

      // 防止 done 回调重复调用的标记
      let called = false
      // 定义 done 回调：标记动画完成，执行 afterHook/cancelHook，清理缓存
      const done = (el[enterCbKey] = (cancelled?) => {
        if (called) return // 已调用则直接返回，避免重复执行
        called = true

        // 根据是否取消，执行对应的钩子
        if (cancelled) {
          callHook(cancelHook, [el])
        } else {
          callHook(afterHook, [el])
        }

        // 若存在延迟离场回调（in-out 模式），执行该回调触发旧节点离场
        if (hooks.delayedLeave) {
          hooks.delayedLeave()
        }

        // 清理 DOM 上的 enter 回调，避免内存泄漏
        el[enterCbKey] = undefined
      })

      // 执行入场钩子：有自定义 hook 则调用，无则直接执行 done
      if (hook) {
        callAsyncHook(hook, [el, done])
      } else {
        done()
      }
    },

    leave(el, remove) {
      const key = String(vnode.key)
      if (el[enterCbKey]) {
        el[enterCbKey](true /* cancelled */)
      }
      if (state.isUnmounting) {
        return remove()
      }
      callHook(onBeforeLeave, [el])
      let called = false
      const done = (el[leaveCbKey] = (cancelled?) => {
        if (called) return
        called = true
        remove()
        if (cancelled) {
          callHook(onLeaveCancelled, [el])
        } else {
          callHook(onAfterLeave, [el])
        }
        el[leaveCbKey] = undefined
        if (leavingVNodesCache[key] === vnode) {
          delete leavingVNodesCache[key]
        }
      })
      leavingVNodesCache[key] = vnode
      if (onLeave) {
        callAsyncHook(onLeave, [el, done])
      } else {
        done()
      }
    },

    clone(vnode) {
      const hooks = resolveTransitionHooks(
        vnode,
        props,
        state,
        instance,
        postClone,
      )
      if (postClone) postClone(hooks)
      return hooks
    },
  }

  // 6. 返回标准化的过渡钩子对象（供渲染器执行）
  return hooks
}

// the placeholder really only handles one special case: KeepAlive 占位符实际上只处理一种特殊情况：KeepAlive
// in the case of a KeepAlive in a leave phase we need to return a KeepAlive 如果 KeepAlive 处于离开阶段，我们需要返回一个 KeepAlive
// placeholder with empty content to avoid the KeepAlive instance from being 带有空内容的占位符，以避免 KeepAlive 实例被
// unmounted. 未安装的
/**
 * Transition 组件的空占位符生成函数（仅处理 KeepAlive 特殊场景）
 *
 * 核心作用：
 *    1. 当 KeepAlive 组件处于离场动画阶段时，生成「空内容的 KeepAlive 克隆节点」作为占位符；
 *    2. 避免 KeepAlive 实例因子节点为空被意外卸载，保证其内部缓存的组件实例不丢失；
 *    3. 非 KeepAlive 节点直接返回 undefined（无需占位符）。
 *
 * @param vnode 待生成占位符的目标 VNode（通常是 Transition 包裹的 KeepAlive 组件 VNode）
 * @returns VNode | undefined - KeepAlive 节点返回空内容的克隆占位符，非 KeepAlive 节点返回 undefined
 */
function emptyPlaceholder(vnode: VNode): VNode | undefined {
  // 1. 仅处理 KeepAlive 组件 VNode（非 KeepAlive 直接返回 undefined）
  if (isKeepAlive(vnode)) {
    // 2. 克隆原始 KeepAlive VNode（避免修改原始 VNode 的状态，导致缓存逻辑异常）
    vnode = cloneVNode(vnode)
    // 3. 将克隆后的 VNode 的 children 设为 null（清空子内容，仅保留 KeepAlive 实例本身）
    // 作用：既让页面上不显示 KeepAlive 的子内容（符合离场动画的视觉效果），
    // 又保留 KeepAlive 实例不被卸载，保证其内部缓存的组件不丢失。
    vnode.children = null
    // 4. 返回空内容的 KeepAlive 占位符 VNode
    return vnode
  }
}

/**
 * Vue3 内置组件子节点穿透函数（专用于 Transition 组件）
 *
 * 核心作用：
 *    1. 穿透 KeepAlive/Teleport 等内置组件的包装层，提取真正需要执行过渡动画的内部子 VNode；
 *    2. 兼容 KeepAlive 的多状态/多子节点形态（已挂载组件、数组子节点、插槽子节点）；
 *    3. 处理 Teleport 组件的子节点，找到其第一个非注释有效子节点；
 *    4. 非内置组件直接返回自身，保证基础场景的简洁性。
 *
 * 设计背景：
 *    - KeepAlive/Teleport 是包装型内置组件，自身无真实 DOM，Transition 需要跳过包装层，处理其内部的真实节点；
 *    - KeepAlive 存在“已挂载（有 component 实例）”和“未挂载”两种状态，需分别处理子节点提取逻辑。
 *
 * @param vnode 待穿透的包装型 VNode（如 KeepAlive/Teleport 或普通节点）
 * @returns VNode | undefined - 穿透后得到的真实目标子节点，无有效节点时返回 undefined
 */
function getInnerChild(vnode: VNode): VNode | undefined {
  // ********** 分支1：非 KeepAlive 节点的处理逻辑 **********
  if (!isKeepAlive(vnode)) {
    // 1.1 处理 Teleport 组件：Teleport 是跨容器渲染组件，需提取其内部第一个非注释子节点
    if (isTeleport(vnode.type) && vnode.children) {
      // findNonCommentChild：找到 Teleport 子节点中第一个非注释节点（跳过占位符注释）
      return findNonCommentChild(vnode.children as VNode[])
    }

    // 1.2 普通节点（非 KeepAlive/非 Teleport）：直接返回自身（无需穿透）
    return vnode
  }

  // ********** 分支2：KeepAlive 节点的处理逻辑（核心）**********
  // 注释背景：#7121/#12465 修复 bug —— KeepAlive 已挂载时，需取其组件实例的 subTree（真实渲染的子树）
  // KeepAlive 已挂载（有 component 实例）：直接返回组件实例的 subTree（已渲染的真实子节点）
  // 原因：KeepAlive 挂载后，其内部缓存的组件会渲染到 subTree 中，这是真正需要过渡的节点
  // #7121,#12465 get the component subtree if it's been mounted 获取组件子树（如果已安装）
  if (vnode.component) {
    return vnode.component.subTree
  }

  // KeepAlive 未挂载：解析其 children，提取有效子节点
  const { shapeFlag, children } = vnode

  // 存在 children 时，根据 shapeFlag 处理不同类型的子节点
  if (children) {
    // 2.1 子节点为数组形态（ShapeFlags.ARRAY_CHILDREN）：取数组第一个子节点
    // 场景：KeepAlive 直接包裹单个节点（如 <KeepAlive><Comp/></KeepAlive>），children 为数组 [CompVNode]
    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      return (children as VNodeArrayChildren)[0] as VNode
    }

    // 2.2 子节点为插槽形态（ShapeFlags.SLOTS_CHILDREN）：执行默认插槽，获取插槽返回的子节点
    // 场景：KeepAlive 包裹插槽内容（如 <KeepAlive><slot/></KeepAlive>），children 是插槽对象
    if (
      shapeFlag & ShapeFlags.SLOTS_CHILDREN &&
      isFunction((children as any).default)
    ) {
      // 执行默认插槽函数，获取插槽渲染的子节点（这是 KeepAlive 要缓存的真实节点）
      return (children as any).default()
    }
  }
}

/**
 * Vue3 Transition 组件的过渡钩子绑定函数
 *
 * 核心作用：
 *    1. 将解析好的过渡钩子（TransitionHooks）绑定到目标 VNode 的 transition 属性上；
 *    2. 兼容不同类型的 VNode（组件/Suspense/普通节点），保证所有需要执行过渡的节点都能关联到正确的钩子；
 *    3. 组件 VNode 递归绑定到其子树（subTree），Suspense VNode 克隆钩子分别绑定到内容/兜底节点，避免钩子共享导致的动画异常。
 *
 * 设计背景：
 *    - 不同类型的 VNode 渲染逻辑不同（如组件 VNode 无真实 DOM，其真实节点在 subTree），需针对性绑定钩子；
 *    - 渲染器执行过渡动画时，会读取 VNode.transition 属性获取钩子，因此必须保证钩子绑定到正确的 VNode 上。
 * @param vnode 要绑定过渡钩子的目标 VNode
 * @param hooks 已解析的标准化过渡钩子对象（来自 resolveTransitionHooks）
 * @returns void
 */
export function setTransitionHooks(vnode: VNode, hooks: TransitionHooks): void {
  // ********** 分支1：处理组件类型 VNode（ShapeFlags.COMPONENT）**********
  // 条件：VNode 是组件类型 且 存在组件内部实例（已初始化）
  if (vnode.shapeFlag & ShapeFlags.COMPONENT && vnode.component) {
    // 1. 先将钩子绑定到组件 VNode 自身的 transition 属性
    vnode.transition = hooks

    // 2. 递归绑定到组件实例的 subTree（核心！）
    // 原因：组件 VNode 本身无对应的真实 DOM 节点，其真实渲染的内容在 component.subTree 中；
    // 渲染器执行过渡动画时，会处理 subTree 对应的 DOM，因此需将钩子绑定到 subTree 上。
    setTransitionHooks(vnode.component.subTree, hooks)
  }
  // ********** 分支2：处理 Suspense 类型 VNode（开启 SUSPENSE 特性时）**********
  else if (__FEATURE_SUSPENSE__ && vnode.shapeFlag & ShapeFlags.SUSPENSE) {
    // Suspense 有两个核心子节点：
    // - ssContent：Suspense 的真实内容节点（加载完成后显示）；
    // - ssFallback：加载中的兜底节点（加载未完成时显示）；
    // 逻辑：为两个子节点分别**克隆钩子**并绑定，避免共享同一个钩子实例导致动画时序冲突。
    vnode.ssContent!.transition = hooks.clone(vnode.ssContent!) // 内容节点绑定克隆后的钩子
    vnode.ssFallback!.transition = hooks.clone(vnode.ssFallback!) // 兜底节点绑定克隆后的钩子
  }
  // ********** 分支3：处理普通 VNode（元素/注释等）**********
  else {
    // 普通节点（如 div/span 等元素节点）直接绑定钩子到 transition 属性
    // 或者组件VNode还没有创建实例
    vnode.transition = hooks
  }
}

/**
 * Vue3 Transition 组件的子节点预处理函数
 *
 * 核心作用：
 *    1. 扁平化嵌套的 Fragment 节点（如 v-for 生成的 <template v-for>），提取真正需要过渡的原始子节点；
 *    2. 继承父节点 key，解决 <template v-for> 场景下的 key 冲突/丢失问题（#5360）；
 *    3. 可选过滤注释节点（v-if 占位符），仅保留有效过渡节点；
 *    4. 多 keyed Fragment 场景下降级 patchFlag，强制全量 diff，避免静态绑定不一致导致的过渡异常（#1126）。
 *
 * @param children 待处理的原始子 VNode 数组（Transition 插槽的子节点）
 * @param keepComment 是否保留注释节点，默认 false（过滤 v-if 等生成的占位符注释）
 * @param parentKey 父节点的 key，用于子节点 key 继承（处理 <template v-for> 场景）
 * @returns VNode[] 扁平化后的原始子 VNode 数组（仅包含有效过渡节点）
 */
export function getTransitionRawChildren(
  children: VNode[],
  keepComment: boolean = false,
  parentKey?: VNode['key'],
): VNode[] {
  // 初始化返回数组：存储扁平化后的有效子节点
  let ret: VNode[] = []
  // 统计 keyed Fragment 数量：用于后续判断是否需要降级 patchFlag
  let keyedFragmentCount = 0

  // 遍历所有子节点，逐个处理
  for (let i = 0; i < children.length; i++) {
    let child = children[i]

    // ********** 核心：处理 key 继承（解决 <template v-for> 的 key 冲突问题 #5360）**********
    // 逻辑：
    // - 无父 key：直接使用子节点自身的 key；
    // - 有父 key：父 key + 子 key（无则用索引 i）拼接，保证 key 唯一性；
    // 场景：<template v-for="item in list" :key="item.id"> 内部的节点，继承父 key 避免重复。
    // #5360 inherit parent key in case of <template v-for> 在 <template v-for> 的情况下继承父键
    const key =
      parentKey == null
        ? child.key
        : String(parentKey) + String(child.key != null ? child.key : i)

    // ********** 处理 Fragment 节点（如 v-for 生成的 <template>）**********
    // Fragment 是 Vue 内部的虚拟节点类型，用于表示多节点片段（无真实 DOM 节点）
    // handle fragment children case, e.g. v-for 处理片段子案例，例如v-for
    if (child.type === Fragment) {
      // 若该 Fragment 是带 key 的（KEYED_FRAGMENT），统计数量（用于后续 patchFlag 降级）
      if (child.patchFlag & PatchFlags.KEYED_FRAGMENT) keyedFragmentCount++

      // 递归处理 Fragment 的子节点，扁平化嵌套结构，并继承当前拼接的 key
      ret = ret.concat(
        getTransitionRawChildren(child.children as VNode[], keepComment, key),
      )
    }
    // ********** 处理非 Fragment 节点：过滤注释节点（可选）**********
    // 逻辑：
    // - keepComment=true：保留所有节点（包括注释）；
    // - keepComment=false：过滤注释节点（如 v-if 生成的占位符注释）；
    // comment placeholders should be skipped, e.g. v-if 应跳过评论占位符，例如v-if
    else if (keepComment || child.type !== Comment) {
      // 若有拼接后的 key，克隆 VNode 并设置新 key（避免修改原始 VNode）；否则直接使用原节点
      ret.push(key != null ? cloneVNode(child, { key }) : child)
    }
  }
  // #1126 if a transition children list contains multiple sub fragments, these 如果一个过渡子列表包含多个子片段，这些
  // fragments will be merged into a flat children array. Since each v-for 片段将被合并到一个平面子数组中。由于每个 v-for
  // fragment may contain different static bindings inside, we need to de-op 片段内部可能包含不同的静态绑定，我们需要解操作
  // these children to force full diffs to ensure correct behavior. 这些孩子强制执行完全差异以确保正确的行为
  // ********** 兼容处理：多 keyed Fragment 场景下降级 patchFlag（#1126）**********
  // 问题背景：
  // - 多个 v-for Fragment 合并为扁平数组后，每个 Fragment 内部的静态绑定可能不同；
  // - 若使用默认 patchFlag，Vue 的优化 diff 可能跳过必要的更新，导致过渡行为异常；
  // 解决方案：
  // - 将所有节点的 patchFlag 设为 BAIL（强制全量 diff），保证每个节点都被完整对比，行为正确。
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = PatchFlags.BAIL
    }
  }

  // 返回扁平化、处理完 key、过滤/保留注释后的原始子节点数组
  return ret
}
