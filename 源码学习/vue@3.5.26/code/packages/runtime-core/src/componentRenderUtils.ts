import {
  type ComponentInternalInstance,
  type Data,
  type FunctionalComponent,
  getComponentName,
} from './component'
import {
  Comment,
  type VNode,
  type VNodeArrayChildren,
  blockStack,
  cloneVNode,
  createVNode,
  isVNode,
  normalizeVNode,
} from './vnode'
import { ErrorCodes, handleError } from './errorHandling'
import { PatchFlags, ShapeFlags, isModelListener, isOn } from '@vue/shared'
import { warn } from './warning'
import { isHmrUpdating } from './hmr'
import type { NormalizedProps } from './componentProps'
import { isEmitListener } from './componentEmits'
import { setCurrentRenderingInstance } from './componentRenderContext'
import {
  DeprecationTypes,
  isCompatEnabled,
  warnDeprecation,
} from './compat/compatConfig'
import { shallowReadonly } from '@vue/reactivity'
import { setTransitionHooks } from './components/BaseTransition'

/**
 * dev only flag to track whether $attrs was used during render.
 * If $attrs was used during render then the warning for failed attrs
 * fallthrough can be suppressed.
 */
let accessedAttrs: boolean = false

export function markAttrsAccessed(): void {
  accessedAttrs = true
}

type SetRootFn = ((root: VNode) => void) | undefined

/**
 * Vue3 核心内部函数 - 组件根VNode的【唯一生成入口】
 * 核心使命：执行组件的render函数（或函数式组件逻辑），基于组件实例的状态（props/setupState/data等）生成标准化的根VNode；
 *          处理属性透传、指令/过渡继承、Vue2兼容等边界逻辑，最终返回可被patch函数处理的根VNode
 * 核心关联：在setupRenderEffect的componentUpdateFn中被调用，是组件渲染/更新的核心前置步骤
 *
 *
 * @param {ComponentInternalInstance} instance 组件内部实例，包含所有渲染所需的状态（props/setupState/render等）
 * @returns {VNode} 标准化的组件根虚拟DOM节点，作为patch函数的输入，最终渲染为真实DOM
 */
export function renderComponentRoot(
  instance: ComponentInternalInstance,
): VNode {
  // 解构组件实例的核心渲染状态
  const {
    type: Component, // 组件类型（对象/函数，区分状态式/函数式组件）
    vnode, // 组件自身的VNode
    proxy, // 组件代理对象（模板中this的指向，整合props/setupState/data）
    withProxy, // 适配with块编译的render函数的代理（仅运行时编译场景）
    propsOptions: [propsOptions], // 组件声明的props选项（用于过滤v-model透传事件）
    slots, // 组件插槽
    attrs, // 组件的非props属性（$attrs）
    emit, // 组件的emit方法（触发自定义事件）
    render, // 组件的render函数（模板编译生成/手动定义）
    renderCache, // 渲染缓存（优化静态节点，避免重复创建）
    props, // 组件接收的props
    data, // 选项式API的data状态
    setupState, // setup函数返回的状态
    ctx, // 组件上下文（包含$slots/$emit/$attrs等）
    inheritAttrs, // 组件的inheritAttrs选项（控制非props属性是否自动透传）
  } = instance

  // 1. 设置当前渲染的组件实例，缓存旧实例（避免多组件渲染时上下文污染）
  const prev = setCurrentRenderingInstance(instance)

  // 核心变量初始化
  let result // 存储render函数执行后的原始VNode结果
  let fallthroughAttrs // 标记需要透传给根节点的非props属性
  if (__DEV__) {
    accessedAttrs = false // 开发环境：标记是否手动访问过$attrs（用于后续警告）
  }

  try {
    // ========== 分支1：状态式组件渲染（普通.vue组件，ShapeFlags.STATEFUL_COMPONENT） ==========
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      // withProxy is a proxy with a different `has` trap only for withProxy 是一个带有不同 `has` 陷阱的代理，仅适用于
      // runtime-compiled render functions using `with` block. 使用“with”块的运行时编译的渲染函数

      // 选择要使用的代理对象：优先withProxy（适配with块编译的render），否则用默认proxy
      const proxyToUse = withProxy || proxy

      // 'this' isn't available in production builds with `<script setup>`, “this”在使用“<script setup>”的生产版本中不可用
      // so warn if it's used in dev. 因此，如果在开发中使用它，请发出警告
      // 开发环境：<script setup>中警告模板使用this（因为setup中this是undefined）
      const thisProxy =
        __DEV__ && setupState.__isScriptSetup
          ? new Proxy(proxyToUse!, {
              get(target, key, receiver) {
                warn(
                  // 属性
                  `Property '${String(
                    key,
                  )}' was accessed via 'this'. Avoid using 'this' in templates.`, // 是通过“this”访问的。避免在模板中使用“this”
                )
                return Reflect.get(target, key, receiver)
              },
            })
          : proxyToUse

      // ✅ 核心：执行render函数，生成VNode并标准化
      result = normalizeVNode(
        render!.call(
          thisProxy, // render函数的this指向（组件代理对象）
          proxyToUse!, // 第一个参数：组件代理（模板中可访问的this）
          renderCache, // 第二个参数：渲染缓存（优化静态节点）
          __DEV__ ? shallowReadonly(props) : props, // 第三个参数：props（开发环境只读）
          setupState, // 第四个参数：setup返回的状态
          data, // 第五个参数：选项式API的data状态
          ctx, // 第六个参数：组件上下文（$slots/$emit等）
        ),
      )

      // 状态式组件默认透传所有attrs
      fallthroughAttrs = attrs
    }
    // ========== 分支2：函数式组件渲染（FunctionalComponent） ==========
    else {
      // 类型断言为函数式组件
      // functional
      const render = Component as FunctionalComponent
      // in dev, mark attrs accessed if optional props (attrs === props) 在 dev 中，如果可选 props 则标记访问的 attrs (attrs === props)

      // 开发环境：如果attrs和props指向同一对象（可选props），标记attrs已访问
      if (__DEV__ && attrs === props) {
        markAttrsAccessed()
      }
      // ✅ 核心：执行函数式组件的render函数，生成VNode并标准化
      result = normalizeVNode(
        // 区分函数式组件是否接收第二个参数（上下文对象）
        render.length > 1
          ? render(
              __DEV__ ? shallowReadonly(props) : props,
              __DEV__
                ? {
                    get attrs() {
                      markAttrsAccessed()
                      return shallowReadonly(attrs)
                    },
                    slots,
                    emit,
                  }
                : { attrs, slots, emit },
            )
          : render(
              __DEV__ ? shallowReadonly(props) : props, // 仅接收props的简单函数式组件
              null as any /* we know it doesn't need it */,
            ),
      )

      // 确定函数式组件的属性透传规则：
      // - 声明了props：透传所有attrs
      // - 未声明props：过滤非props属性（仅透传class/style/事件等）
      fallthroughAttrs = Component.props
        ? attrs
        : getFunctionalFallthrough(attrs)
    }
  } catch (err) {
    blockStack.length = 0 // 清空区块栈（优化相关）
    handleError(err, instance, ErrorCodes.RENDER_FUNCTION) // 统一处理渲染错误
    result = createVNode(Comment) // 生成空注释VNode，保证页面不白屏
  }

  // ========== 属性透传（Attr Fallthrough）核心处理 ==========
  // attr merging  属性合并
  // in dev mode, comments are preserved, and it's possible for a template 在开发模式下，注释会被保留，并且模板可以
  // to have comments along side the root element which makes it a fragment 在根元素旁边添加注释，使其成为一个片段
  // 开发环境：处理模板中包含注释导致根节点为Fragment的情况，提取真实根节点
  let root = result
  let setRoot: SetRootFn = undefined
  if (
    __DEV__ &&
    result.patchFlag > 0 &&
    result.patchFlag & PatchFlags.DEV_ROOT_FRAGMENT
  ) {
    ;[root, setRoot] = getChildRoot(result) // 提取Fragment中的真实根节点
  }

  // 当需要透传属性且inheritAttrs不为false时（默认true）
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs) // 透传属性的key列表
    const { shapeFlag } = root // 根节点的形状标识

    if (keys.length) {
      // 场景1：根节点是元素/组件 → 自动透传属性
      if (shapeFlag & (ShapeFlags.ELEMENT | ShapeFlags.COMPONENT)) {
        // 过滤v-model的onUpdate:xxx事件：如果组件声明了对应props，说明自己处理，无需透传
        if (propsOptions && keys.some(isModelListener)) {
          // If a v-model listener (onUpdate:xxx) has a corresponding declared 如果一个v-model监听器（onUpdate:xxx）有一个对应的声明
          // prop, it indicates this component expects to handle v-model and prop，它表示此组件期望处理v-model和
          // it should not fallthrough. 它不应该失效。
          // related: #1543, #1643, #1989 相关：#1543、#1643、#1989

          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions,
          )
        }
        // ✅ 核心：克隆VNode并合并透传属性（VNode不可变，需克隆后修改）
        root = cloneVNode(root, fallthroughAttrs, false, true)
      }
      // 场景2：根节点不是元素/组件（Fragment/Text/Teleport）→ 开发环境警告
      else if (__DEV__ && !accessedAttrs && root.type !== Comment) {
        const allAttrs = Object.keys(attrs)
        const eventAttrs: string[] = [] // 存储非props事件属性
        const extraAttrs: string[] = [] // 存储非props普通属性

        // 分类遍历所有attrs
        for (let i = 0, l = allAttrs.length; i < l; i++) {
          const key = allAttrs[i]
          // 判断是否为事件属性（on开头）
          if (isOn(key)) {
            // ignore v-model handlers when they fail to fallthrough 当 v-model 处理程序失败时忽略它们
            if (!isModelListener(key)) {
              // remove `on`, lowercase first letter to reflect event casing 移除“on”，并将首字母改为小写，以符合事件的大小写规则
              // accurately 准确地
              // 排除v-model的onUpdate:xxx事件
              eventAttrs.push(key[2].toLowerCase() + key.slice(3))
            }
          } else {
            extraAttrs.push(key) // 普通非props属性
          }
        }
        if (extraAttrs.length) {
          warn(
            `Extraneous non-props attributes (` + // 无关的非道具属性
              `${extraAttrs.join(', ')}) ` +
              `were passed to component but could not be automatically inherited ` + // 被传递给组件，但无法自动继承
              `because component renders fragment or text or teleport root nodes.`, // 因为组件会渲染片段、文本或传送根节点
          )
        }
        if (eventAttrs.length) {
          warn(
            `Extraneous non-emits event listeners (` + // 无关的非发射事件监听器
              `${eventAttrs.join(', ')}) ` +
              `were passed to component but could not be automatically inherited ` + // 被传递给组件，但无法自动继承
              `because component renders fragment or text root nodes. ` + // 因为组件会渲染片段或文本根节点
              `If the listener is intended to be a component custom event listener only, ` + // 如果该监听器仅作为组件自定义事件监听器
              `declare it using the "emits" option.`, // 使用“emits”选项来声明它
          )
        }
      }
    }
  }

  // ========== Vue2兼容逻辑：class/style强制透传 ==========
  if (
    __COMPAT__ && // 开启Vue2兼容模式
    isCompatEnabled(DeprecationTypes.INSTANCE_ATTRS_CLASS_STYLE, instance) &&
    vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT && // 状态式组件
    root.shapeFlag & (ShapeFlags.ELEMENT | ShapeFlags.COMPONENT) // 根节点是元素/组件
  ) {
    const { class: cls, style } = vnode.props || {} // 提取组件的class/style属性
    if (cls || style) {
      // 开发环境：inheritAttrs=false时警告（Vue2中class/style仍会透传）
      if (__DEV__ && inheritAttrs === false) {
        warnDeprecation(
          DeprecationTypes.INSTANCE_ATTRS_CLASS_STYLE,
          instance,
          getComponentName(instance.type),
        )
      }
      // 强制克隆VNode并合并class/style
      root = cloneVNode(
        root,
        {
          class: cls,
          style: style,
        },
        false,
        true,
      )
    }
  }

  // ========== 指令继承：组件上的指令透传到根节点 ==========
  // inherit directives 继承指令
  if (vnode.dirs) {
    // 开发环境警告：根节点不是元素时，指令无法生效
    if (__DEV__ && !isElementRoot(root)) {
      warn(
        `Runtime directive used on component with non-element root node. ` + // 运行时指令用于具有非元素根节点的组件
          `The directives will not function as intended.`, // 这些指令将不会按预期发挥作用
      )
    }
    // clone before mutating since the root may be a hoisted vnode 由于根可能是提升的 vnode，因此在变异之前进行克隆
    // 克隆VNode（避免修改缓存的静态VNode）
    root = cloneVNode(root, null, false, true)
    // 合并指令：根节点已有指令则拼接，无则直接赋值
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs
  }

  // ========== 过渡动画继承：组件上的Transition透传到根节点 ==========
  // inherit transition data 继承转换数据
  if (vnode.transition) {
    // 开发环境警告：根节点不是元素时，过渡动画无法生效
    if (__DEV__ && !isElementRoot(root)) {
      warn(
        `Component inside <Transition> renders non-element root node ` + // <Transition> 内的组件渲染非元素根节点
          `that cannot be animated.`, // 无法动画化的
      )
    }
    // 为根节点绑定过渡钩子函数
    setTransitionHooks(root, vnode.transition)
  }

  // ========== 最终结果处理：恢复根节点引用 ==========
  if (__DEV__ && setRoot) {
    setRoot(root) // 开发环境：更新Fragment中的真实根节点
  } else {
    result = root // 非开发环境：直接替换为处理后的根节点
  }

  // 2. 恢复之前的渲染实例，避免上下文污染
  setCurrentRenderingInstance(prev)
  return result // 返回处理后的标准化根VNode（供patch函数渲染/更新DOM）
}

/**
 * dev only
 * In dev mode, template root level comments are rendered, which turns the
 * template into a fragment root, but we need to locate the single element
 * root for attrs and scope id processing.
 */
const getChildRoot = (vnode: VNode): [VNode, SetRootFn] => {
  const rawChildren = vnode.children as VNodeArrayChildren
  const dynamicChildren = vnode.dynamicChildren
  const childRoot = filterSingleRoot(rawChildren, false)
  if (!childRoot) {
    return [vnode, undefined]
  } else if (
    __DEV__ &&
    childRoot.patchFlag > 0 &&
    childRoot.patchFlag & PatchFlags.DEV_ROOT_FRAGMENT
  ) {
    return getChildRoot(childRoot)
  }

  const index = rawChildren.indexOf(childRoot)
  const dynamicIndex = dynamicChildren ? dynamicChildren.indexOf(childRoot) : -1
  const setRoot: SetRootFn = (updatedRoot: VNode) => {
    rawChildren[index] = updatedRoot
    if (dynamicChildren) {
      if (dynamicIndex > -1) {
        dynamicChildren[dynamicIndex] = updatedRoot
      } else if (updatedRoot.patchFlag > 0) {
        vnode.dynamicChildren = [...dynamicChildren, updatedRoot]
      }
    }
  }
  return [normalizeVNode(childRoot), setRoot]
}

export function filterSingleRoot(
  children: VNodeArrayChildren,
  recurse = true,
): VNode | undefined {
  let singleRoot
  for (let i = 0; i < children.length; i++) {
    const child = children[i]
    if (isVNode(child)) {
      // ignore user comment
      if (child.type !== Comment || child.children === 'v-if') {
        if (singleRoot) {
          // has more than 1 non-comment child, return now
          return
        } else {
          singleRoot = child
          if (
            __DEV__ &&
            recurse &&
            singleRoot.patchFlag > 0 &&
            singleRoot.patchFlag & PatchFlags.DEV_ROOT_FRAGMENT
          ) {
            return filterSingleRoot(singleRoot.children as VNodeArrayChildren)
          }
        }
      }
    } else {
      return
    }
  }
  return singleRoot
}

const getFunctionalFallthrough = (attrs: Data): Data | undefined => {
  let res: Data | undefined
  for (const key in attrs) {
    if (key === 'class' || key === 'style' || isOn(key)) {
      ;(res || (res = {}))[key] = attrs[key]
    }
  }
  return res
}

const filterModelListeners = (attrs: Data, props: NormalizedProps): Data => {
  const res: Data = {}
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key]
    }
  }
  return res
}

const isElementRoot = (vnode: VNode) => {
  return (
    vnode.shapeFlag & (ShapeFlags.COMPONENT | ShapeFlags.ELEMENT) ||
    vnode.type === Comment // potential v-if branch switch
  )
}

/**
 * Vue3 内部核心函数 - 判断组件是否需要执行更新的【核心决策函数】
 * 核心使命：通过对比新旧组件VNode的props、children、patchFlag、指令/过渡、热更新等维度，
 *          决定是否触发组件的更新逻辑（返回true则更新，false则跳过）；
 *          区分「编译优化模式（optimized）」和「手动render函数模式」，优化判断效率
 * 核心关联：在updateComponent中被调用，是组件是否执行instance.update()的唯一依据
 *
 *
 * @param {VNode} prevVNode 旧的组件VNode（上一轮渲染的VNode）
 * @param {VNode} nextVNode 新的组件VNode（本轮待渲染的VNode）
 * @param {boolean} [optimized] 是否开启编译优化（默认undefined，编译生成的render函数会标记为true）
 * @returns {boolean} true=组件需要更新，false=组件无需更新
 */
export function shouldUpdateComponent(
  prevVNode: VNode,
  nextVNode: VNode,
  optimized?: boolean,
): boolean {
  // ========== 第一步：解构新旧VNode和组件实例的核心属性 ==========
  const {
    props: prevProps, // 旧VNode的props
    children: prevChildren, // 旧VNode的children（插槽/子节点）
    component, // 旧VNode关联的组件实例
  } = prevVNode
  const {
    props: nextProps, // 新VNode的props
    children: nextChildren, // 新VNode的children
    patchFlag, // 新VNode的补丁标记（编译阶段生成，标记动态内容类型）
  } = nextVNode

  // 组件实例声明的emits选项（用于区分props和emit监听事件，避免误判更新）
  const emits = component!.emitsOptions

  // ========== 分支1：开发环境 - 父组件HMR热更新场景 ==========
  // 场景说明：父组件的render函数通过HMR热更新时，子组件的插槽内容可能已变化，
  // 即使props未变，也需要强制子组件更新（否则插槽内容不会刷新）
  // Parent component's render function was hot-updated. Since this may have 父组件的渲染函数已热更新。由于这可能
  // caused the child component's slots content to have changed, we need to 由于子组件的插槽内容发生了变化，我们需要
  // force the child to update as well. 也要强迫孩子进行更新
  if (__DEV__ && (prevChildren || nextChildren) && isHmrUpdating) {
    return true // 强制更新
  }

  // ========== 分支2：新VNode有指令/过渡 - 强制更新 ==========
  // force child update for runtime directive or transition on component vnode. 强制子组件更新运行时指令或组件 vnode 上的转换
  // 场景说明：组件VNode上绑定了运行时指令（如v-click-outside）或过渡动画（<Transition>），
  // 即使props/children未变，也需要更新以应用指令/过渡逻辑
  if (nextVNode.dirs || nextVNode.transition) {
    return true // 强制更新
  }

  // ========== 分支3：编译优化模式（optimized=true）- 基于patchFlag精准判断 ==========
  // 该路径为「编译生成的render函数」触发，仅对比编译阶段标记的动态内容，提升判断效率
  if (optimized && patchFlag >= 0) {
    // 子分支3.1：patchFlag包含动态插槽（DYNAMIC_SLOTS）- 需要更新
    // 场景：插槽内容引用了可能变化的值（如v-for中的变量、响应式数据）
    if (patchFlag & PatchFlags.DYNAMIC_SLOTS) {
      // slot content that references values that might have changed, 引用可能已更改的值的槽内容
      // e.g. in a v-for
      return true
    }
    // 子分支3.2：patchFlag包含全量props（FULL_PROPS）- 对比所有props
    if (patchFlag & PatchFlags.FULL_PROPS) {
      if (!prevProps) {
        // 旧props为空，新props存在 → 需要更新
        return !!nextProps
      }
      // presence of this flag indicates props are always non-null 此标志的存在表示 props 始终为非空
      // FULL_PROPS标记保证nextProps非空，调用hasPropsChanged深对比props是否变化（排除emit监听）
      return hasPropsChanged(prevProps, nextProps!, emits)
    }
    // 子分支3.3：patchFlag包含部分动态props（PROPS）- 仅对比动态props
    else if (patchFlag & PatchFlags.PROPS) {
      // 编译阶段标记的动态props列表（仅包含可能变化的props）
      const dynamicProps = nextVNode.dynamicProps!
      // 遍历所有动态props，逐一对比新旧值
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i]
        // 条件：1. 当前prop的新旧值不同 2. 该key不是emit监听事件（避免把emit事件误判为props更新）
        if (
          nextProps![key] !== prevProps![key] &&
          !isEmitListener(emits, key)
        ) {
          return true // 任意一个动态props变化 → 需要更新
        }
      }
    }
  }
  // ========== 分支4：非优化模式（optimized=false）- 手动render函数场景 ==========
  // 该路径为「手动编写的render函数」触发，无编译优化，需做全量判断
  else {
    // this path is only taken by manually written render functions 这条路径仅由手动编写的渲染函数采用
    // so presence of any children leads to a forced update 所以，只要有孩子在场，就会强制更新

    // 子分支4.1：存在children且非稳定节点 → 强制更新
    // 场景：手动render函数中返回的children无编译优化，只要存在children且不是$stable（稳定标记），
    // 就默认需要更新（避免遗漏插槽/子节点变化）
    if (prevChildren || nextChildren) {
      if (!nextChildren || !(nextChildren as any).$stable) {
        return true
      }
    }

    // 子分支4.2：props完全相同 → 无需更新
    if (prevProps === nextProps) {
      return false
    }

    // 子分支4.3：旧props为空，新props存在 → 需要更新
    if (!prevProps) {
      return !!nextProps
    }

    // 子分支4.4：新props为空，旧props存在 → 需要更新
    if (!nextProps) {
      return true
    }

    // 子分支4.5：对比所有props是否变化（排除emit监听）
    return hasPropsChanged(prevProps, nextProps, emits)
  }

  return false
}

function hasPropsChanged(
  prevProps: Data,
  nextProps: Data,
  emitsOptions: ComponentInternalInstance['emitsOptions'],
): boolean {
  const nextKeys = Object.keys(nextProps)
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i]
    if (
      nextProps[key] !== prevProps[key] &&
      !isEmitListener(emitsOptions, key)
    ) {
      return true
    }
  }
  return false
}

export function updateHOCHostEl(
  { vnode, parent }: ComponentInternalInstance,
  el: typeof vnode.el, // HostNode
): void {
  while (parent) {
    const root = parent.subTree
    if (root.suspense && root.suspense.activeBranch === vnode) {
      root.el = vnode.el
    }
    if (root === vnode) {
      ;(vnode = parent.vnode).el = el
      parent = parent.parent
    } else {
      break
    }
  }
}
