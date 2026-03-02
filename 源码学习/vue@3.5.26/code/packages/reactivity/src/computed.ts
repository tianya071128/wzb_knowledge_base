import { isFunction } from '@vue/shared'
import {
  type DebuggerEvent,
  type DebuggerOptions,
  EffectFlags,
  type Subscriber,
  activeSub,
  batch,
  refreshComputed,
} from './effect'
import type { Ref } from './ref'
import { warn } from './warning'
import { Dep, type Link, globalVersion } from './dep'
import { ReactiveFlags, TrackOpTypes } from './constants'

declare const ComputedRefSymbol: unique symbol
declare const WritableComputedRefSymbol: unique symbol

interface BaseComputedRef<T, S = T> extends Ref<T, S> {
  [ComputedRefSymbol]: true
  /**
   * @deprecated computed no longer uses effect
   */
  effect: ComputedRefImpl
}

export interface ComputedRef<T = any> extends BaseComputedRef<T> {
  readonly value: T
}

export interface WritableComputedRef<T, S = T> extends BaseComputedRef<T, S> {
  [WritableComputedRefSymbol]: true
}

export type ComputedGetter<T> = (oldValue?: T) => T
export type ComputedSetter<T> = (newValue: T) => void

export interface WritableComputedOptions<T, S = T> {
  get: ComputedGetter<T>
  set: ComputedSetter<S>
}

/**
 * @private exported by @vue/reactivity for Vue core use, but not exported from 由@vue/reactivity导出供Vue核心使用，但未从该库导出
 * the main vue package 主Vue包
 */
/**
 * Vue3 计算属性的底层核心实现类（ComputedRefImpl）
 *
 * 核心定位：
 *    1. 双特性融合：同时实现 Ref 接口（__v_isRef = true）和 Subscriber（订阅者）接口，既支持 .value 访问，又能订阅响应式值变化；
 *    2. 懒更新+缓存：仅当依赖变化且被访问时才重新计算，计算结果缓存到 _value，避免重复计算；
 *    3. 依赖双向管理：
 *       - dep：管理“使用当前计算属性的副作用”（如组件渲染函数）；
 *       - deps：追踪“当前计算属性依赖的响应式值”（如 ref/reactive 对象）；
 *    4. 只读/可写适配：根据是否传入 setter 标记只读状态，可写场景调用 setter 触发值修改；
 *    5. 批量更新：依赖变化时通过 batch 批量触发更新，避免频繁执行副作用；
 *    6. 调试支持：开发环境提供 onTrack/onTrigger 钩子，追踪依赖收集和更新触发；
 *
 * 核心接口/类型说明：
 *    - Subscriber：订阅者接口，定义响应式系统中“可被通知更新”的对象规范，包含 notify()、deps、flags 等核心属性/方法；
 *    - Dep：依赖管理器类，用于收集/触发副作用函数；
 *    - EffectFlags：副作用标记枚举，核心值：
 *      - DIRTY：标记计算属性“脏值”（依赖变化，需重新计算）；
 *      - NOTIFIED：标记计算属性已被通知更新，避免重复批量处理；
 *    - TrackOpTypes/TriggerOpTypes：操作类型枚举，用于调试追踪；
 *    - DebuggerEvent：调试事件类型，包含 target/type/key 等追踪信息；
 */
export class ComputedRefImpl<T = any> implements Subscriber {
  /**
   * @internal 内部属性：缓存计算属性的最新值，仅当依赖变化且被访问时更新
   * 核心逻辑：仅当依赖变化且被访问（get value）时更新，未变化时直接返回缓存值
   */
  _value: any = undefined

  /**
   * @internal 内部属性：依赖管理器（Dep 实例）
   *
   * 核心作用：
   *    1. 收集所有**使用当前计算属性**的副作用（如组件渲染函数、watch 回调）；
   *    2. 计算属性值更新时，通过 dep.notify() 触发这些副作用重新执行；
   *    3. 绑定当前 ComputedRefImpl 实例作为 dep 的 owner，关联依赖关系；
   */
  readonly dep: Dep = new Dep(this)

  /**
   * @internal 内部属性：标记当前实例是 Ref 类型，与普通 ref 兼容（isRef 检测返回 true）
   * 替代 ReactiveFlags.IS_REF，为了向后兼容保留的标记
   */
  readonly __v_isRef = true

  // TODO isolatedDeclarations ReactiveFlags.IS_REF TODO 隔离声明 ReactiveFlags.IS_REF
  /**
   * @internal 内部属性：标记计算属性是否只读（无 setter 时为 true）
   */
  readonly __v_isReadonly: boolean

  // TODO isolatedDeclarations ReactiveFlags.IS_READONLY
  // A computed is also a subscriber that tracks other deps 一个计算属性（computed）也是一个订阅者，用于跟踪其他依赖项

  /**
   * @internal 内部属性：依赖链表头节点
   *
   * 核心作用：
   *    1. 追踪当前计算属性**依赖的响应式值**（如 ref/reactive 对象/其他 computed）；
   *    2. 依赖的响应式值变化时，会调用当前实例的 notify() 方法；
   *    3. 链表结构优化批量更新时的依赖遍历性能；
   */
  deps?: Link = undefined

  /**
   * @internal 内部属性：依赖链表尾节点
   * 作用：优化链表操作（新增依赖时直接追加到尾部，无需遍历链表），提升依赖收集性能
   */
  depsTail?: Link = undefined

  /**
   * @internal 内部属性：副作用状态标记（EffectFlags 枚举）
   * 核心值：
   * - EffectFlags.DIRTY：初始值，标记计算属性需要重新计算；
   * - EffectFlags.NOTIFIED：标记已被通知更新，避免重复批量处理；
   */
  flags: EffectFlags = EffectFlags.DIRTY

  /**
   * @internal 内部属性：全局版本号，用于快速判断依赖是否变化
   * 初始值为 globalVersion - 1，保证首次访问时一定会重新计算
   */
  globalVersion: number = globalVersion - 1

  /**
   * @internal 内部属性：是否为服务端渲染场景
   * SSR 场景下跳过客户端响应式逻辑（无缓存/依赖收集），直接执行 getter 计算值
   */
  isSSR: boolean

  /**
   * @internal 内部属性：订阅者链表的下一个节点，用于批量更新时的链表管理
   */
  next?: Subscriber = undefined

  // for backwards compat 用于向后兼容
  // 向后兼容属性：将当前实例赋值给 effect，模拟旧版 effect 结构
  effect: this = this

  // dev only
  /**
   * @internal 开发环境专用：依赖收集时触发的调试钩子
   * 触发时机：访问计算属性.value 时，收集使用该计算属性的副作用
   */
  onTrack?: (event: DebuggerEvent) => void
  // dev only
  /**
   * @internal 开发环境专用：计算属性更新触发时的调试钩子
   * 触发时机：计算属性依赖变化，调用 notify() 时
   */
  onTrigger?: (event: DebuggerEvent) => void

  /**
   * @internal 开发环境专用：标记是否需要警告递归调用
   * 避免计算属性内部递归访问自身导致无限循环
   */
  _warnRecursive?: boolean

  /**
   * 构造函数：初始化计算属性核心配置
   *
   * @param fn 计算属性的 getter 函数，用于计算衍生值；
   * @param setter 可选，计算属性的 setter 函数，传入则为可写计算属性；
   * @param isSSR 是否为服务端渲染场景；
   */
  constructor(
    public fn: ComputedGetter<T>,
    private readonly setter: ComputedSetter<T> | undefined,
    isSSR: boolean,
  ) {
    // 标记只读状态：无 setter 则为只读（ReactiveFlags.IS_READONLY 标记）
    this[ReactiveFlags.IS_READONLY] = !setter
    // 存储 SSR 标记，区分客户端/服务端逻辑
    this.isSSR = isSSR
  }

  /**
   * @internal 订阅者接口（Subscriber）核心实现：依赖变化时的通知处理
   *
   * 触发时机：计算属性依赖的响应式值（如 ref/reactive）发生变化时，被依赖的 Dep 调用
   *
   * 核心逻辑：
   *    1. 标记计算属性为脏值（DIRTY），表示需要重新计算；
   *    2. 未被标记为已通知（NOTIFIED）且非自递归时，加入批量更新队列；
   *    3. 避免重复入队和无限递归；
   *
   * @returns true 表示成功加入批量更新队列，void 表示跳过
   */
  notify(): true | void {
    // 1. 标记为脏值（按位或操作，保留原有标记）
    this.flags |= EffectFlags.DIRTY

    // 2. 入队条件：
    //    - 未被标记为已通知（避免重复入队）；
    //    - 当前活跃订阅者（activeSub）不是自身（避免自递归）；
    if (
      !(this.flags & EffectFlags.NOTIFIED) &&
      // avoid infinite self recursion 防止无限自递归
      activeSub !== this
    ) {
      // 3. 加入批量更新队列：
      //    - 第一个参数：当前计算属性实例；
      //    - 第二个参数：标记为 computed 类型更新（优先处理）；
      batch(this, true)
      return true
    } else if (__DEV__) {
      // TODO warn
    }
  }

  /**
   * 计算属性值的 getter 访问器（核心入口）
   *
   * 核心逻辑：
   *    1. 依赖收集：收集使用该计算属性的副作用（如组件渲染）；
   *    2. 刷新计算：调用 refreshComputed 检查是否需要重新计算值并重新计算值
   *    3. 版本同步：更新依赖链表的版本号，保证依赖追踪的准确性；
   *    4. 返回缓存值：返回缓存的最新值
   *
   * @returns 计算属性的最新值（缓存值/重新计算后的值）
   */
  get value(): T {
    // 1. 依赖收集：
    //    作用：将当前访问的副作用（如渲染函数）加入 dep 的订阅列表
    const link = __DEV__
      ? this.dep.track({
          target: this,
          type: TrackOpTypes.GET,
          key: 'value',
        })
      : this.dep.track()

    // 2. 刷新计算值：
    //    - 检查 flags 是否为 DIRTY 且非 SSR；
    //    - 若是：执行 getter 重新计算值，更新 _value，清除 DIRTY 标记；
    //    - 若否：直接返回缓存的 _value；
    refreshComputed(this)

    // sync version after evaluation 评估后同步版本
    // 3. 版本同步：评估后同步依赖链表的版本号
    //    作用：标记该副作用已获取最新的计算属性值，避免重复更新
    if (link) {
      link.version = this.dep.version
    }

    // 4. 返回缓存的最新值
    return this._value
  }

  /**
   * 计算属性值的 setter 访问器（仅可写计算属性生效）
   *
   * 核心逻辑：
   *    1. 有 setter 时：执行 setter 函数，触发自定义写入逻辑；
   *        -- 直接通过函数写入, 是否触发响应式变更由用户定义的写入函数决定
   *        -- 如果在函数中改变了其他的响应式属性, 那么就会触发响应式属性的变更操作
   *    2. 无 setter 时（只读）：开发环境抛出警告，生产环境无操作；
   *
   * @param newValue 要设置的新值
   */
  set value(newValue) {
    if (this.setter) {
      // 1. 可写计算属性：执行自定义 setter 逻辑
      this.setter(newValue)
    } else if (__DEV__) {
      warn('Write operation failed: computed value is readonly') // 写入操作失败：计算值是只读的
    }
  }
}

/**
 * Vue3 创建计算属性的核心入口函数（computed API）
 *
 * Takes a getter function and returns a readonly reactive ref object for the 接受一个getter函数，并返回一个只读的响应式ref对象
 * returned value from the getter. It can also take an object with get and set 从getter方法返回的值。它也可以接受一个带有get和set方法的对象
 * functions to create a writable ref object. 用于创建可写引用对象的函数
 *
 * @example
 * ```js
 * // Creating a readonly computed ref: 创建一个只读的计算引用
 * const count = ref(1)
 * const plusOne = computed(() => count.value + 1)
 *
 * console.log(plusOne.value) // 2
 * plusOne.value++ // error
 * ```
 *
 * ```js
 * // Creating a writable computed ref: 创建一个可写的计算引用
 * const count = ref(1)
 * const plusOne = computed({
 *   get: () => count.value + 1,
 *   set: (val) => {
 *     count.value = val - 1
 *   }
 * })
 *
 * plusOne.value = 1
 * console.log(count.value) // 0
 * ```
 *
 * @param getter - Function that produces the next value. 生成下一个值的函数
 * @param debugOptions - For debugging. See {@link https://vuejs.org/guide/extras/reactivity-in-depth.html#computed-debugging}. 用于调试
 * @see {@link https://vuejs.org/api/reactivity-core.html#computed}
 */
export function computed<T>(
  getter: ComputedGetter<T>,
  debugOptions?: DebuggerOptions,
): ComputedRef<T>
export function computed<T, S = T>(
  options: WritableComputedOptions<T, S>,
  debugOptions?: DebuggerOptions,
): WritableComputedRef<T, S>
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions,
  isSSR = false,
) {
  // 声明 getter/setter 变量，用于存储最终的读取/修改逻辑
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T> | undefined

  // 分支1：入参是函数 → 只读计算属性（仅配置 getter，setter 为 undefined）
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
  }
  // 分支2：入参是配置对象 → 可写计算属性（分别提取 get/set 方法）
  else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  // 核心逻辑：创建 ComputedRefImpl 实例，传入 getter/setter 和 SSR 标记
  // ComputedRefImpl 是计算属性的底层实现类，封装了缓存、依赖收集、懒更新等核心逻辑
  const cRef = new ComputedRefImpl(getter, setter, isSSR)

  // 开发环境 + 配置了调试钩子 + 非 SSR → 挂载调试钩子到计算属性实例
  if (__DEV__ && debugOptions && !isSSR) {
    cRef.onTrack = debugOptions.onTrack // 依赖收集时触发的钩子
    cRef.onTrigger = debugOptions.onTrigger // 更新触发时触发的钩子
  }

  // 返回计算属性实例（类型断言为 any，兼容 Ref<T> 类型）
  return cRef as any
}
