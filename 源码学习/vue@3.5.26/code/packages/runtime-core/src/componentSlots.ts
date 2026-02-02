import { type ComponentInternalInstance, currentInstance } from './component'
import {
  type VNode,
  type VNodeChild,
  type VNodeNormalizedChildren,
  normalizeVNode,
} from './vnode'
import {
  EMPTY_OBJ,
  type IfAny,
  type Prettify,
  ShapeFlags,
  SlotFlags,
  def,
  isArray,
  isFunction,
} from '@vue/shared'
import { warn } from './warning'
import { isKeepAlive } from './components/KeepAlive'
import {
  type ContextualRenderFn,
  currentRenderingInstance,
  withCtx,
} from './componentRenderContext'
import { isHmrUpdating } from './hmr'
import { DeprecationTypes, isCompatEnabled } from './compat/compatConfig'
import { TriggerOpTypes, trigger } from '@vue/reactivity'
import { createInternalObject } from './internalObject'

export type Slot<T extends any = any> = (
  ...args: IfAny<T, any[], [T] | (T extends undefined ? [] : never)>
) => VNode[]

export type InternalSlots = {
  [name: string]: Slot | undefined
}

export type Slots = Readonly<InternalSlots>

declare const SlotSymbol: unique symbol
export type SlotsType<T extends Record<string, any> = Record<string, any>> = {
  [SlotSymbol]?: T
}

export type StrictUnwrapSlotsType<
  S extends SlotsType,
  T = NonNullable<S[typeof SlotSymbol]>,
> = [keyof S] extends [never] ? Slots : Readonly<T> & T

export type UnwrapSlotsType<
  S extends SlotsType,
  T = NonNullable<S[typeof SlotSymbol]>,
> = [keyof S] extends [never]
  ? Slots
  : Readonly<
      Prettify<{
        [K in keyof T]: NonNullable<T[K]> extends (...args: any[]) => any
          ? T[K]
          : Slot<T[K]>
      }>
    >

export type RawSlots = {
  [name: string]: unknown
  // manual render fn hint to skip forced children updates
  $stable?: boolean
  /**
   * for tracking slot owner instance. This is attached during
   * normalizeChildren when the component vnode is created.
   * @internal
   */
  _ctx?: ComponentInternalInstance | null
  /**
   * indicates compiler generated slots
   * we use a reserved property instead of a vnode patchFlag because the slots
   * object may be directly passed down to a child component in a manual
   * render function, and the optimization hint need to be on the slot object
   * itself to be preserved.
   * @internal
   */
  _?: SlotFlags
}

const isInternalKey = (key: string) =>
  key === '_' || key === '_ctx' || key === '$stable'

/**
 * 将插槽值标准化为VNode数组
 *
 * 此函数用于处理Vue组件中插槽的内容，确保插槽值始终是VNode数组格式。
 * 如果传入的值是数组，则对数组中的每一项进行VNode标准化；
 * 如果不是数组，则将该值转换为单元素数组并进行标准化。
 *
 * @param value - 需要标准化的插槽值，可以是任意类型
 * @returns 返回标准化后的VNode数组
 */
const normalizeSlotValue = (value: unknown): VNode[] =>
  isArray(value)
    ? value.map(normalizeVNode)
    : [normalizeVNode(value as VNodeChild)]

/**
 * Vue3 内部专属函数 - 【原始函数式插槽】→【标准Slot类型】的精细化包装器
 * 核心使命：
 *    1. 防止重复标准化：通过`_n`标记检测已标准化的插槽，直接返回避免重复处理（修复#5353）；
 *    2. 绑定渲染上下文：通过`withCtx`为原始插槽函数绑定指定上下文`ctx`，保证插槽内可正确访问组件实例；
 *    3. 开发环境合规性校验：检测插槽函数在**渲染函数外被调用**的违规行为，警告依赖追踪失效问题；
 *    4. 标准化返回值：执行原始插槽函数后，通过`normalizeSlotValue`统一返回值为VNode/VNode数组；
 *    5. 标记非编译插槽：为包装后的插槽函数设置`_c=false`，明确区分「运行时标准化插槽」和「编译器处理的插槽」；
 *    6. 输出标准Slot类型：最终返回符合Vue内部规范的Slot函数，可直接被`renderSlot`调用渲染；
 * 核心关联：被`normalizeObjectSlots`调用，是函数式插槽标准化的**核心步骤**，
 *            承接原始函数式插槽，输出可直接用于渲染的标准插槽函数，是插槽渲染的基础保障。
 *
 *
 * @param {string} key 插槽名（如default/title），用于开发环境警告的上下文提示
 * @param {Function} rawSlot 原始未标准化的函数式插槽（如作用域插槽函数、手写的插槽函数）
 * @param {ComponentInternalInstance | null | undefined} ctx 插槽需要绑定的渲染上下文实例，保证插槽内访问组件实例的正确性
 * @returns {Slot} 标准化后的标准Slot类型函数，带上下文绑定、返回值标准化、合规性校验的插槽函数
 */
const normalizeSlot = (
  key: string,
  rawSlot: Function,
  ctx: ComponentInternalInstance | null | undefined,
): Slot => {
  // 检测原始插槽函数是否带有`_n`标记 → 已完成标准化（修复#5353重复标准化问题）
  // `_n`标记是当前函数标准化后添加的标识，避免同一插槽被多次包装导致的逻辑冲突/性能损耗
  if ((rawSlot as any)._n) {
    // already normalized - #5353 已经正常化
    return rawSlot as Slot
  }

  // 核心：通过`withCtx`包装原始插槽函数，绑定渲染上下文+封装执行逻辑，生成标准化插槽函数
  // withCtx：Vue内部工具，为函数绑定指定的组件实例上下文，保证函数内`this`/实例相关访问（如props/emit）正确
  const normalized = withCtx((...args: any[]) => {
    // 开发环境专属：检测插槽函数是否在**渲染函数外被调用**，违规则抛出警告
    if (
      __DEV__ &&
      currentInstance &&
      !(ctx === null && currentRenderingInstance) &&
      !(ctx && ctx.root !== currentInstance.root)
    ) {
      warn(
        `Slot "${key}" invoked outside of the render function: ` + // 在渲染函数外部调用了插槽“${key}”：
          `this will not track dependencies used in the slot. ` + // 这不会追踪插槽中使用的依赖项。
          `Invoke the slot function inside the render function instead.`, // 请在渲染函数内部调用插槽函数
      )
    }

    // 执行原始插槽函数并传入作用域参数，再标准化返回值
    // 1. rawSlot(...args)：执行原始插槽，传入作用域插槽的参数（如子组件传递的props）
    // 2. normalizeSlotValue：统一插槽返回值为VNode/VNode数组，抹平返回值类型差异
    return normalizeSlotValue(rawSlot(...args))
  }, ctx) as Slot

  // 标记当前插槽为「非编译插槽」（_c=false），区分编译器处理的插槽（_c=true）
  // ContextualRenderFn：withCtx包装后返回的带上下文的渲染函数类型
  // NOT a compiled slot
  ;(normalized as ContextualRenderFn)._c = false
  return normalized
}

/**
 * Vue3 内部专属函数 - 【原始对象式插槽】到【组件内部标准化插槽】的精细化处理函数
 * 核心使命：
 *    1. 遍历原始对象式插槽，过滤Vue内部保留键，仅处理真实插槽名对应的插槽值；
 *    2. 标准化函数式插槽：调用normalizeSlot包装插槽函数，绑定渲染上下文，保证执行时this/参数正确；
 *    3. 标准化非函数式插槽：将非函数值转为标准VNode结构，包装为惰性执行的函数，统一插槽调用规范；
 *    4. 开发环境性能提示：检测到非函数插槽时抛出警告，建议使用函数插槽提升渲染性能；
 *    5. 兼容Vue2渲染函数：兼容模式下关闭非函数插槽的警告，保持Vue2的插槽使用行为；
 *    6. 最终构建纯净的InternalSlots：所有插槽均为函数类型，供renderSlot惰性执行渲染；
 *
 * 核心关联：被normalizeSlots核心函数调用，是assignSlots初步分配后的**插槽值精细化标准化步骤**，
 *            衔接RawSlots原始插槽和最终供渲染使用的InternalSlots，是组件插槽处理的关键环节。
 *
 *
 * @param {RawSlots} rawSlots 原始对象式插槽（来自normalizeChildren处理，含插槽值+_ctx等内部标记）
 * @param {InternalSlots} slots 组件内部标准化插槽对象（最终产物，所有属性均为插槽函数，供renderSlot使用）
 * @param {ComponentInternalInstance} instance 组件内部实例（开发环境兼容判断、警告信息上下文用）
 * @returns {void} 无返回值，直接修改入参slots，挂载标准化后的插槽函数
 */
const normalizeObjectSlots = (
  rawSlots: RawSlots,
  slots: InternalSlots,
  instance: ComponentInternalInstance,
) => {
  // 提取原始插槽的渲染上下文（由normalizeChildren绑定，保证插槽执行时能访问组件实例）
  const ctx = rawSlots._ctx

  // 遍历原始对象式插槽的所有键（含真实插槽名：default/xxx，及内部键：_/_ctx等）
  for (const key in rawSlots) {
    // 跳过Vue内部保留键（如_、_ctx），仅处理真实的插槽名，保证内部slots对象的纯净性
    if (isInternalKey(key)) continue

    // 获取当前插槽名对应的原始插槽值（可能是函数/非函数，如数组/VNode/文本等）
    const value = rawSlots[key]
    // 分支1：原始插槽值为函数 → 标准化函数式插槽（核心推荐用法）
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx)
    }
    // 分支2：原始插槽值为非空非函数 → 标准化非函数式插槽（兼容用法，开发环境提示性能问题）
    else if (value != null) {
      if (
        __DEV__ &&
        !(
          __COMPAT__ && // Vue2兼容模式开启
          isCompatEnabled(DeprecationTypes.RENDER_FUNCTION, instance) // 启用了渲染函数兼容
        )
      ) {
        warn(
          `Non-function value encountered for slot "${key}". ` + // 插槽遇到非功能值
            `Prefer function slots for better performance.`, // 优先选择函数槽以获得更好的性能
        )
      }
      // 标准化非函数插槽值：将任意非函数值转为标准的VNode/VNode数组结构
      const normalized = normalizeSlotValue(value)
      // 包装为无参惰性执行函数，赋值到内部插槽对象 → 统一插槽调用规范（所有插槽均为函数）
      slots[key] = () => normalized
    }
  }
}

/**
 * 规范化 VNode 插槽值
 * 将传入的children值规范化为函数类型的插槽，并将其设置为组件实例的默认插槽
 *
 * @param instance - 组件内部实例，用于访问组件的状态和插槽
 * @param children - VNode规范化的子节点，将被转换为默认插槽的内容
 */
const normalizeVNodeSlots = (
  instance: ComponentInternalInstance,
  children: VNodeNormalizedChildren,
) => {
  // 在开发模式下，对于非KeepAlive组件且未启用兼容模式时，如果默认插槽不是函数类型则发出警告
  if (
    __DEV__ &&
    !isKeepAlive(instance.vnode) &&
    !(__COMPAT__ && isCompatEnabled(DeprecationTypes.RENDER_FUNCTION, instance))
  ) {
    warn(
      `Non-function value encountered for default slot. ` + // 默认槽遇到非函数值
        `Prefer function slots for better performance.`, // 优先选择函数槽以获得更好的性能
    )
  }
  // 将插槽值进行规范化处理
  const normalized = normalizeSlotValue(children)
  // 将规范化后的值包装为函数并赋值给实例的默认插槽
  instance.slots.default = () => normalized
}

/**
 * Vue3 内部专属函数 - 组件【原始插槽对象 → 内部插槽对象】的分配桥接函数
 * 核心关联：被`normalizeSlots`等插槽处理核心函数调用，是组件内部`InternalSlots`对象构建的关键步骤，
 *            衔接`normalizeChildren`处理后的原始插槽和渲染时实际使用的内部插槽。
 *
 *  - 一般而言, 使用 vue 文件时的插槽都是【编译优化后的插槽对象】, 无需在额外处理, 将 vnode.props.children, 遍历直接挂载到 instance.slots 上
 *
 *
 * @param {InternalSlots} slots 组件内部标准化后的插槽对象（最终供`renderSlot`渲染使用，纯插槽函数集合）
 * @param {Slots} children 原始待分配的插槽对象（如`normalizeChildren`处理后的`SLOTS_CHILDREN`，可能含内部标记）
 * @param {boolean} optimized 是否为**优化模式**（标记插槽是否来自手写渲染函数的优化实现/编译优化后的插槽）
 * @returns {void} 无返回值，直接修改入参`slots`对象，为其挂载有效插槽函数
 */
const assignSlots = (
  slots: InternalSlots,
  children: Slots,
  optimized: boolean,
) => {
  for (const key in children) {
    // #2893
    // when rendering the optimized slots by manually written render function, 当通过手动编写的渲染函数来渲染优化后的插槽时
    // do not copy the `slots._` compiler flag so that `renderSlot` creates 不要复制`slots._`编译器标志，以便`renderSlot`能够创建
    // slot Fragment with BAIL patchFlag to force full updates 带有BAIL补丁标志的插槽片段，用于强制进行全面更新
    if (optimized || !isInternalKey(key)) {
      slots[key] = children[key]
    }
  }
}

/**
 * Vue3 核心初始化函数 - 组件插槽初始化的【唯一底层入口】，setupComponent的核心子函数
 * 核心使命：标准化处理组件的所有插槽形式，初始化插槽容器，根据VNode子节点类型自动识别插槽格式，完成插槽的统一标准化，最终挂载到instance.slots
 * 核心特性：基于位运算快速判断插槽类型、兼容所有插槽形式(默认/具名/作用域)、区分编译优化/非优化插槽、纯初始化无副作用、性能极致优化
 * 核心价值：业务开发中setupContext.slots / this.$slots 的底层数据来源，所有插槽的访问和使用都基于该函数的处理结果
 *
 *
 * @param {ComponentInternalInstance} instance 组件内部实例，标准化后的插槽最终挂载到 instance.slots
 * @param {VNodeNormalizedChildren} children 组件根VNode的标准化子节点，插槽的原始数据源，支持插槽对象/VNode数组/文本/null
 * @param {boolean} optimized 是否启用编译优化模式，true=走快速赋值逻辑，false=走完整标准化逻辑
 * @returns {void} 无返回值，所有处理结果直接挂载到组件实例的 slots 属性上
 */
export const initSlots = (
  instance: ComponentInternalInstance,
  children: VNodeNormalizedChildren,
  optimized: boolean,
): void => {
  // 1. 初始化组件的插槽容器，并挂载到组件实例上
  // createInternalObject：创建纯净无原型的内部空对象，专门存储插槽，避免污染全局常量，保证插槽对象独立
  const slots = (instance.slots = createInternalObject())

  // 2. ✅ 核心判断（位运算）：当前组件VNode的子节点 是否是【对象式插槽】(编译后的标准插槽)
  // ShapeFlags.SLOTS_CHILDREN：标识VNode子节点为插槽对象；位运算& 快速校验，性能远高于普通判断
  if (instance.vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    // 2.1 确认是原始插槽对象，取出编译器的标记属性 _ (内部标识，用于编译优化)
    const type = (children as RawSlots)._
    if (type) {
      // 2.2 分支1：当前是【编译优化后的插槽对象】
      // assignSlots：快速浅拷贝优化后的插槽到目标容器，无额外标准化处理，极致高效
      assignSlots(slots, children as Slots, optimized)
      // make compiler marker non-enumerable
      // 编译优化专属：将编译器的标记属性 _ 定义到插槽容器上，且设置为【非枚举属性】
      // 目的：标记该插槽是编译优化后的，后续更新时可复用优化逻辑；非枚举避免遍历slots时拿到该内部属性
      if (optimized) {
        def(slots, '_', type, true)
      }
    } else {
      // 2.3 分支2：当前是【非优化的原始对象式插槽】
      // normalizeObjectSlots：完整标准化处理原始插槽对象，处理默认插槽、具名插槽、作用域插槽的参数和返回值
      // 最终将标准化后的插槽函数，挂载到 slots 容器中
      normalizeObjectSlots(children as RawSlots, slots, instance)
    }
  }
  // 3. ✅ 纯初始化无副作用：当前VNode子节点 存在对象式插槽，但无子节点（如手写h函数的VNode对象）
  else if (children) {
    // 3. ✅ 分支3：当前VNode子节点 不是插槽对象，但存在子节点（如手写h函数的VNode数组、文本节点）
    // normalizeVNodeSlots：将所有非对象式的子节点，统一标准化为【默认插槽(default)】
    // 无论传入的是单个VNode、VNode数组、文本节点，最终都会被封装成 默认插槽的函数，存入 slots.default
    normalizeVNodeSlots(instance, children)
  }

  // 4. 兜底情况：children为null/undefined → 无任何插槽，instance.slots 为空对象，无需处理
}

/**
 * Vue3 内部核心函数 - 组件插槽（Slots）的【精准更新函数】
 * 核心使命：根据父组件传入的最新VNode子节点（children），更新组件实例的slots对象，
 *          区分「编译优化插槽」「动态插槽」「原始插槽」，处理HMR热更新、稳定插槽跳过更新、
 *          过期插槽清理等边界场景，保证插槽内容与父组件传入的最新状态同步
 *
 *
 * @param {ComponentInternalInstance} instance 待更新的组件内部实例
 * @param {VNodeNormalizedChildren} children 新的VNode子节点（父组件传入的插槽内容）
 * @param {boolean} optimized 是否开启编译优化（决定插槽更新策略）
 * @returns {void} 无返回值，直接修改instance的slots对象
 */
export const updateSlots = (
  instance: ComponentInternalInstance,
  children: VNodeNormalizedChildren,
  optimized: boolean,
): void => {
  // ========== 第一步：解构组件实例的核心属性 ==========
  const { vnode, slots } = instance
  // 标记：是否需要检查并删除过期插槽（默认true，即默认需要清理）
  let needDeletionCheck = true
  // 对比目标：用于判断插槽是否过期（默认空对象，后续根据场景赋值）
  let deletionComparisonTarget = EMPTY_OBJ

  // ========== 分支1：当前VNode包含插槽子节点（SLOTS_CHILDREN标记） ==========
  // ShapeFlags.SLOTS_CHILDREN：表示VNode的children是插槽对象（而非普通VNode数组）
  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    // 类型断言：children是原始插槽对象（RawSlots），_属性存储插槽标记（SlotFlags）
    const type = (children as RawSlots)._
    if (type) {
      // compiled slots.
      if (__DEV__ && isHmrUpdating) {
        // Parent was HMR updated so slot content may have changed.
        // force update slots and mark instance for hmr as well
        assignSlots(slots, children as Slots, optimized)
        trigger(instance, TriggerOpTypes.SET, '$slots')
      } else if (optimized && type === SlotFlags.STABLE) {
        // compiled AND stable.
        // no need to update, and skip stale slots removal.
        needDeletionCheck = false
      } else {
        // compiled but dynamic (v-if/v-for on slots) - update slots, but skip
        // normalization.
        assignSlots(slots, children as Slots, optimized)
      }
    } else {
      needDeletionCheck = !(children as RawSlots).$stable
      normalizeObjectSlots(children as RawSlots, slots, instance)
    }
    deletionComparisonTarget = children as RawSlots
  } else if (children) {
    // non slot object children (direct value) passed to a component
    normalizeVNodeSlots(instance, children)
    deletionComparisonTarget = { default: 1 }
  }

  // delete stale slots 删除陈旧的插槽
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key]
      }
    }
  }
}
