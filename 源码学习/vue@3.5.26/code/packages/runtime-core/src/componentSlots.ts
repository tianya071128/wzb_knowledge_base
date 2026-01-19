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

const normalizeSlotValue = (value: unknown): VNode[] =>
  isArray(value)
    ? value.map(normalizeVNode)
    : [normalizeVNode(value as VNodeChild)]

const normalizeSlot = (
  key: string,
  rawSlot: Function,
  ctx: ComponentInternalInstance | null | undefined,
): Slot => {
  if ((rawSlot as any)._n) {
    // already normalized - #5353
    return rawSlot as Slot
  }
  const normalized = withCtx((...args: any[]) => {
    if (
      __DEV__ &&
      currentInstance &&
      !(ctx === null && currentRenderingInstance) &&
      !(ctx && ctx.root !== currentInstance.root)
    ) {
      warn(
        `Slot "${key}" invoked outside of the render function: ` +
          `this will not track dependencies used in the slot. ` +
          `Invoke the slot function inside the render function instead.`,
      )
    }
    return normalizeSlotValue(rawSlot(...args))
  }, ctx) as Slot
  // NOT a compiled slot
  ;(normalized as ContextualRenderFn)._c = false
  return normalized
}

const normalizeObjectSlots = (
  rawSlots: RawSlots,
  slots: InternalSlots,
  instance: ComponentInternalInstance,
) => {
  const ctx = rawSlots._ctx
  for (const key in rawSlots) {
    if (isInternalKey(key)) continue
    const value = rawSlots[key]
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx)
    } else if (value != null) {
      if (
        __DEV__ &&
        !(
          __COMPAT__ &&
          isCompatEnabled(DeprecationTypes.RENDER_FUNCTION, instance)
        )
      ) {
        warn(
          `Non-function value encountered for slot "${key}". ` +
            `Prefer function slots for better performance.`,
        )
      }
      const normalized = normalizeSlotValue(value)
      slots[key] = () => normalized
    }
  }
}

const normalizeVNodeSlots = (
  instance: ComponentInternalInstance,
  children: VNodeNormalizedChildren,
) => {
  if (
    __DEV__ &&
    !isKeepAlive(instance.vnode) &&
    !(__COMPAT__ && isCompatEnabled(DeprecationTypes.RENDER_FUNCTION, instance))
  ) {
    warn(
      `Non-function value encountered for default slot. ` +
        `Prefer function slots for better performance.`,
    )
  }
  const normalized = normalizeSlotValue(children)
  instance.slots.default = () => normalized
}

const assignSlots = (
  slots: InternalSlots,
  children: Slots,
  optimized: boolean,
) => {
  for (const key in children) {
    // #2893
    // when rendering the optimized slots by manually written render function,
    // do not copy the `slots._` compiler flag so that `renderSlot` creates
    // slot Fragment with BAIL patchFlag to force full updates
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
  } else if (children) {
    // 3. ✅ 分支3：当前VNode子节点 不是插槽对象，但存在子节点（如手写h函数的VNode数组、文本节点）
    // normalizeVNodeSlots：将所有非对象式的子节点，统一标准化为【默认插槽(default)】
    // 无论传入的是单个VNode、VNode数组、文本节点，最终都会被封装成 默认插槽的函数，存入 slots.default
    normalizeVNodeSlots(instance, children)
  }

  // 4. 兜底情况：children为null/undefined → 无任何插槽，instance.slots 为空对象，无需处理
}

export const updateSlots = (
  instance: ComponentInternalInstance,
  children: VNodeNormalizedChildren,
  optimized: boolean,
): void => {
  const { vnode, slots } = instance
  let needDeletionCheck = true
  let deletionComparisonTarget = EMPTY_OBJ
  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
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

  // delete stale slots
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key]
      }
    }
  }
}
