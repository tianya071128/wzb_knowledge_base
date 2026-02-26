import {
  type IfAny,
  hasChanged,
  isArray,
  isFunction,
  isIntegerKey,
  isObject,
} from '@vue/shared'
import { Dep, getDepFromReactive } from './dep'
import {
  type Builtin,
  type ShallowReactiveMarker,
  type Target,
  isProxy,
  isReactive,
  isReadonly,
  isShallow,
  toRaw,
  toReactive,
} from './reactive'
import type { ComputedRef, WritableComputedRef } from './computed'
import { ReactiveFlags, TrackOpTypes, TriggerOpTypes } from './constants'
import { warn } from './warning'

declare const RefSymbol: unique symbol
export declare const RawSymbol: unique symbol

export interface Ref<T = any, S = T> {
  get value(): T
  set value(_: S)
  /**
   * Type differentiator only.
   * We need this to be in public d.ts but don't want it to show up in IDE
   * autocomplete, so we use a private Symbol instead.
   */
  [RefSymbol]: true
}

/**
 * Checks if a value is a ref object. 检查一个值是否为引用对象
 *
 * @param r - The value to inspect. 要检查的值
 * @see {@link https://vuejs.org/api/reactivity-utilities.html#isref}
 */
export function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
export function isRef(r: any): r is Ref {
  // 检查对象是否存在以及其IS_REF标志是否为true
  return r ? r[ReactiveFlags.IS_REF] === true : false
}

/**
 * Takes an inner value and returns a reactive and mutable ref object, which 接受一个内部值并返回一个响应式的、可变的引用对象，该对象
 * has a single property `.value` that points to the inner value. 它只有一个属性 `.value`，用于指向内部值
 *
 * @param value - The object to wrap in the ref. 要包裹在引用（ref）中的对象
 * @see {@link https://vuejs.org/api/reactivity-core.html#ref}
 */
export function ref<T>(
  value: T,
): [T] extends [Ref] ? IfAny<T, Ref<T>, T> : Ref<UnwrapRef<T>, UnwrapRef<T> | T>
export function ref<T = any>(): Ref<T | undefined>
export function ref(value?: unknown) {
  return createRef(value, false)
}

declare const ShallowRefMarker: unique symbol

export type ShallowRef<T = any, S = T> = Ref<T, S> & {
  [ShallowRefMarker]?: true
}

/**
 * Shallow version of {@link ref}.  浅层版本的{@link ref}
 *
 * @example
 * ```js
 * const state = shallowRef({ count: 1 })
 *
 * // does NOT trigger change 不会触发更改
 * state.value.count = 2
 *
 * // does trigger change 会触发更改
 * state.value = { count: 2 }
 * ```
 *
 * @param value - The "inner value" for the shallow ref. 浅层引用的“内部值”。
 * @see {@link https://vuejs.org/api/reactivity-advanced.html#shallowref}
 */
export function shallowRef<T>(
  value: T,
): Ref extends T
  ? T extends Ref
    ? IfAny<T, ShallowRef<T>, T>
    : ShallowRef<T>
  : ShallowRef<T>
export function shallowRef<T = any>(): ShallowRef<T | undefined>
export function shallowRef(value?: unknown) {
  // 根据第二个参数控制
  return createRef(value, true)
}

/**
 * 创建一个响应式引用对象
 * 如果传入的值已经是Ref对象，则直接返回该对象
 * 否则创建一个新的RefImpl实例
 *
 * @param rawValue - 原始值，可以是任意类型
 * @param shallow - 是否为浅层响应式
 * @returns 返回已存在的Ref对象或新创建的RefImpl实例
 */
function createRef(rawValue: unknown, shallow: boolean) {
  // 检查是否已经是Ref对象
  if (isRef(rawValue)) {
    return rawValue
  }

  // 创建新的 RefImpl 实例
  return new RefImpl(rawValue, shallow)
}

/**
 * @internal
 */
/**
 * Vue3 Ref 响应式实现的核心类（ref/shallowRef 的底层载体）
 *
 * 核心作用：
 *    1. 为单个值（原始类型/对象类型）提供响应式能力：通过 value 访问器拦截读取/修改操作；
 *    2. 支持浅层/深度响应式：isShallow 参数控制是否递归将对象转为 reactive；
 *    3. 依赖管理：通过 dep 收集依赖，值变化时触发更新；
 *    4. 类型标记：通过 ReactiveFlags.IS_REF 标识为 Ref 类型，便于响应式系统识别解包；
 *
 *
 * 核心属性：
 *    - _value：对外暴露的实际值（深度响应式下，对象类型会被转为 reactive）；
 *    - _rawValue：原始值（未做响应式处理的原始数据，用于值变化对比）；
 *    - dep：依赖管理器（Dep 实例），收集访问 value 的副作用函数，值变化时触发更新；
 *    - [ReactiveFlags.IS_REF]：只读标记，固定为 true，标识当前实例是 Ref 类型；
 *    - [ReactiveFlags.IS_SHALLOW]：只读标记，标识是否为浅层 Ref（shallowRef）；
 */
class RefImpl<T = any> {
  // 对外暴露的实际值（深度 Ref 中，对象会被转为 reactive；浅层 Ref 中直接存储原始值）
  _value: T
  // 原始值（未做响应式处理，用于对比新值/旧值是否真的变化）
  private _rawValue: T

  // 依赖管理器：收集所有依赖该 Ref 的副作用函数（如组件渲染函数）
  dep: Dep = new Dep()

  // 只读标记：标识当前实例是 Ref 类型（响应式系统解包时会识别该标记）
  public readonly [ReactiveFlags.IS_REF] = true
  // 只读标记：标识是否为浅层 Ref（默认 false，shallowRef 会设为 true）
  public readonly [ReactiveFlags.IS_SHALLOW]: boolean = false

  /**
   * 构造函数：初始化 Ref 实例，处理原始值/响应式值
   *
   * @param value 初始值（支持原始类型/对象类型）；
   * @param isShallow 是否为浅层 Ref：
   *                  - true（shallowRef）：直接存储原始值，不递归转为 reactive；
   *                  - false（ref）：对象类型值会被转为 reactive（深度响应式）；
   */
  constructor(value: T, isShallow: boolean) {
    // 存储原始值：浅层 Ref 直接存原值，深度 Ref 取 toRaw 后的原始对象（避免代理嵌套）
    this._rawValue = isShallow ? value : toRaw(value)
    // 存储响应式值：浅层 Ref 直接存原值，深度 Ref 对对象类型调用 toReactive 转为 reactive
    this._value = isShallow ? value : toReactive(value)
    // 标记是否为浅层 Ref
    this[ReactiveFlags.IS_SHALLOW] = isShallow
  }

  /**
   * value 访问器的 get 方法（读取 ref.value 时触发）
   *
   * 核心职责：
   *  1. 依赖收集：记录当前访问 value 的副作用函数（如组件渲染函数）；
   *  2. 返回实际值 _value（深度 Ref 中可能是 reactive 对象）；
   *  3. 开发环境：传递详细的跟踪信息（target/type/key），便于调试；
   */
  get value() {
    // 开发环境：带详细参数收集依赖，方便调试响应式追踪
    if (__DEV__) {
      this.dep.track({
        target: this, // 依赖目标：当前 Ref 实例
        type: TrackOpTypes.GET, // 跟踪类型：读取操作
        key: 'value', // 跟踪的键：固定为 'value'（Ref 只有 value 一个可访问属性）
      })
    }
    // 生产环境：简化依赖收集，提升性能
    else {
      this.dep.track()
    }

    // 返回处理后的响应式值 --> 如果是对象, 那么已经通过 toReactive 响应式了的
    return this._value
  }

  /**
   * value 访问器的 set 方法（修改 ref.value 时触发）
   *
   * 核心职责：
   *  1. 处理新值：浅层 Ref/只读值/浅层响应式值直接使用，否则取原始值；
   *  2. 值变化判断：对比新值与旧值（_rawValue），仅变化时执行更新；
   *  3. 更新值：同步更新 _rawValue 和 _value；
   *  4. 触发更新：通知所有依赖的副作用函数重新执行；
   *
   * @param newValue 要设置的新值；
   */
  set value(newValue) {
    // 旧值：取原始值（_rawValue），保证对比的是未做响应式处理的原始数据
    const oldValue = this._rawValue
    // 判断是否直接使用新值（无需转为原始值/响应式）：
    const useDirectValue =
      this[ReactiveFlags.IS_SHALLOW] || // 当前是浅层 Ref（IS_SHALLOW = true）
      isShallow(newValue) || // 新值是浅层响应式值
      isReadonly(newValue) // 新值是只读值
    // 处理新值：需直接使用则存原值，否则取 toRaw 后的原始值（避免代理嵌套）
    newValue = useDirectValue ? newValue : toRaw(newValue)

    // 核心判断：新值与旧值是否真的变化（hasChanged 处理 NaN/引用类型等边界）
    if (hasChanged(newValue, oldValue)) {
      // 1. 更新原始值
      this._rawValue = newValue
      // 2. 更新响应式值：需直接使用则存原值，否则转为 reactive（深度 Ref）
      this._value = useDirectValue ? newValue : toReactive(newValue)

      // 3. 触发更新：通知所有依赖的副作用函数重新执行
      if (__DEV__) {
        // 开发环境：传递详细的触发信息，便于调试
        this.dep.trigger({
          target: this,
          type: TriggerOpTypes.SET,
          key: 'value',
          newValue,
          oldValue,
        })
      } else {
        // 生产环境：简化触发逻辑，提升性能
        this.dep.trigger()
      }
    }
  }
}

/**
 * Vue3 手动触发 Ref 响应式更新的核心 API（triggerRef 入口函数）
 *
 * 核心作用：强制触发 Ref 的更新：绕过值变化判断，直接调用 dep.trigger() 通知依赖；
 *
 * Force trigger effects that depends on a shallow ref. This is typically used 依赖于浅层参考的强制触发效果。这通常用于
 * after making deep mutations to the inner value of a shallow ref. 对浅引用（shallow ref）的内部值进行深度修改后
 *
 * @example
 * ```js
 * const shallow = shallowRef({
 *   greet: 'Hello, world'
 * })
 *
 * // Logs "Hello, world" once for the first run-through
 * watchEffect(() => {
 *   console.log(shallow.value.greet)
 * })
 *
 * // This won't trigger the effect because the ref is shallow
 * shallow.value.greet = 'Hello, universe'
 *
 * // Logs "Hello, universe"
 * triggerRef(shallow)
 * ```
 *
 * @param ref - The ref whose tied effects shall be executed. 需执行其关联效果的引用
 * @see {@link https://vuejs.org/api/reactivity-advanced.html#triggerref}
 */
export function triggerRef(ref: Ref): void {
  // 核心判断：检查 Ref 实例是否有 dep 属性（仅 RefImpl/ObjectRefImpl 等有效 Ref 实例才有 dep）
  // ref may be an instance of ObjectRefImpl ref 可以是 ObjectRefImpl 的实例
  if ((ref as unknown as RefImpl).dep) {
    if (__DEV__) {
      // 开发环境：带详细参数触发更新，便于调试响应式追踪
      ;(ref as unknown as RefImpl).dep.trigger({
        target: ref,
        type: TriggerOpTypes.SET,
        key: 'value',
        newValue: (ref as unknown as RefImpl)._value,
      })
    } else {
      // 生产环境：简化触发逻辑，直接调用 dep.trigger()，提升性能
      ;(ref as unknown as RefImpl).dep.trigger()
    }
  }

  // 若 ref 无 dep 属性（非有效 Ref 实例），函数无任何操作，静默返回
}

export type MaybeRef<T = any> =
  | T
  | Ref<T>
  | ShallowRef<T>
  | WritableComputedRef<T>

export type MaybeRefOrGetter<T = any> = MaybeRef<T> | ComputedRef<T> | (() => T)

/**
 * Returns the inner value if the argument is a ref, otherwise return the 如果参数是引用，则返回内部值，否则返回
 * argument itself. This is a sugar function for 参数本身。这是一个糖衣函数
 * `val = isRef(val) ? val.value : val`. `val = isRef(val) ? val.value : val`
 *
 * @example
 * ```js
 * function useFoo(x: number | Ref<number>) {
 *   const unwrapped = unref(x)
 *   // unwrapped is guaranteed to be number now
 * }
 * ```
 *
 * @param ref - Ref or plain value to be converted into the plain value.  要转换为纯值的 Ref 或纯值
 * @see {@link https://vuejs.org/api/reactivity-utilities.html#unref}
 */
export function unref<T>(ref: MaybeRef<T> | ComputedRef<T>): T {
  // 检查是否为 ref
  return isRef(ref) ? ref.value : ref
}

/**
 * Normalizes values / refs / getters to values. 将值/引用/getter方法标准化为值
 * This is similar to {@link unref}, except that it also normalizes getters. 这与{@link unref}类似，但除了它还会对getter方法进行规范化
 * If the argument is a getter, it will be invoked and its return value will 如果参数是一个getter方法，则该方法将被调用，并且其返回值将
 * be returned. 被退回
 *
 * @example
 * ```js
 * toValue(1) // 1
 * toValue(ref(1)) // 1
 * toValue(() => 1) // 1
 * ```
 *
 * @param source - A getter, an existing ref, or a non-function value. 一个getter方法、一个现有的引用或一个非函数值
 * @see {@link https://vuejs.org/api/reactivity-utilities.html#tovalue}
 */
export function toValue<T>(source: MaybeRefOrGetter<T>): T {
  return isFunction(source) ? source() : unref(source)
}

const shallowUnwrapHandlers: ProxyHandler<any> = {
  get: (target, key, receiver) =>
    key === ReactiveFlags.RAW
      ? target
      : unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key]
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value
      return true
    } else {
      return Reflect.set(target, key, value, receiver)
    }
  },
}

/**
 * Returns a proxy for the given object that shallowly unwraps properties that
 * are refs. If the object already is reactive, it's returned as-is. If not, a
 * new reactive proxy is created.
 *
 * @param objectWithRefs - Either an already-reactive object or a simple object
 * that contains refs.
 */
export function proxyRefs<T extends object>(
  objectWithRefs: T,
): ShallowUnwrapRef<T> {
  return isReactive(objectWithRefs)
    ? (objectWithRefs as ShallowUnwrapRef<T>)
    : new Proxy(objectWithRefs, shallowUnwrapHandlers)
}

export type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void,
) => {
  get: () => T
  set: (value: T) => void
}

/**
 * Vue3 自定义 Ref 实现的核心类（customRef 的底层载体）
 *
 * 核心作用：
 *    1. 自定义响应式逻辑：**将依赖收集（track）和更新触发（trigger）的控制权交给开发者**；
 *    2. 适配 customRef 工厂函数：接收工厂函数返回的 get/set 方法，作为 value 访问器的核心逻辑；
 *    3. 标准 Ref 兼容：实现 IS_REF 标记，与普通 ref/shallowRef 兼容，支持自动解包等特性；
 *    4. 依赖管理：内置 Dep 实例，统一管理依赖收集与触发逻辑
 */
class CustomRefImpl<T> {
  // 依赖管理器：收集所有依赖该自定义 Ref 的副作用函数（如组件渲染函数）
  public dep: Dep

  // 私有属性：存储工厂函数返回的自定义 get/set 方法
  // ReturnType<CustomRefFactory<T>>['get']：提取工厂函数返回值中的 get 方法类型
  private readonly _get: ReturnType<CustomRefFactory<T>>['get']
  private readonly _set: ReturnType<CustomRefFactory<T>>['set']

  // 只读标记：标识当前实例是 Ref 类型，与普通 ref 保持一致，支持响应式系统自动解包
  public readonly [ReactiveFlags.IS_REF] = true

  // 存储自定义 Ref 的当前值（! 非空断言：初始化时由 get 方法赋值）
  public _value: T = undefined!

  /**
   * 构造函数：初始化自定义 Ref，绑定工厂函数的 get/set 逻辑
   *
   * @param factory 自定义 Ref 工厂函数：接收 track/trigger 方法，返回自定义的 get/set 逻辑；
   *                开发者通过该函数手动控制依赖收集和更新触发的时机；
   */
  constructor(factory: CustomRefFactory<T>) {
    // 1. 创建 Dep 实例并赋值给当前实例的 dep 属性
    const dep = (this.dep = new Dep())

    // 2. 调用工厂函数，传入绑定 this 的 track/trigger 方法：
    //    - dep.track.bind(dep)：将 track 方法的 this 绑定到当前 Dep 实例，避免 this 丢失；
    //    - dep.trigger.bind(dep)：同理，绑定 trigger 方法的 this；
    //    - 工厂函数返回自定义的 get/set 方法，开发者可在其中调用 track/trigger；
    const { get, set } = factory(dep.track.bind(dep), dep.trigger.bind(dep))

    // 3. 存储自定义的 get/set 方法，供 value 访问器调用
    this._get = get
    this._set = set
  }

  /**
   * value 访问器的 get 方法（读取 customRef.value 时触发）
   * 核心逻辑：调用工厂函数返回的自定义 get 方法，并用返回值更新 _value
   * 特点：依赖收集的时机完全由开发者在自定义 get 方法中通过调用 track() 控制
   */
  get value() {
    return (this._value = this._get())
  }

  /**
   * value 访问器的 set 方法（修改 customRef.value 时触发）
   * 核心逻辑：调用工厂函数返回的自定义 set 方法，传入新值
   * 特点：更新触发的时机完全由开发者在自定义 set 方法中通过调用 trigger() 控制
   * @param newVal 要设置的新值
   */
  set value(newVal) {
    this._set(newVal)
  }
}

/**
 * Creates a customized ref with explicit control over its dependency tracking 创建一个自定义的引用，可对其依赖跟踪进行显式控制
 * and updates triggering. 以及更新触发
 *
 * @param factory - The function that receives the `track` and `trigger` callbacks. 接收`track`和`trigger`回调函数的函数
 * @see {@link https://vuejs.org/api/reactivity-advanced.html#customref}
 */
export function customRef<T>(factory: CustomRefFactory<T>): Ref<T> {
  return new CustomRefImpl(factory) as any
}

export type ToRefs<T = any> = {
  [K in keyof T]: ToRef<T[K]>
}

/**
 * Vue3 批量将响应式对象属性转为 Ref 实例的核心工具函数（toRefs 入口函数）
 *
 * Converts a reactive object to a plain object where each property of the 将响应式对象转换为普通对象，其中每个属性
 * resulting object is a ref pointing to the corresponding property of the 生成的对象是一个引用，指向其对应属性
 * original object. Each individual ref is created using {@link toRef}. 原始对象。每个单独的引用都是使用{@link toRef}创建的。
 *
 * @param object - Reactive object to be made into an object of linked refs. 要转换为链接引用对象的响应式对象
 * @see {@link https://vuejs.org/api/reactivity-utilities.html#torefs}
 */
export function toRefs<T extends object>(object: T): ToRefs<T> {
  // 开发环境校验：若输入不是代理对象（非响应式），抛警告提示正确用法
  if (__DEV__ && !isProxy(object)) {
    warn(`toRefs() expects a reactive object but received a plain one.`) // toRefs() 预期接收一个响应式对象，但实际接收的是一个普通对象
  }

  // 初始化返回值：
  // - 数组输入 → 创建等长空数组（保证索引对应）；
  // - 对象输入 → 创建空对象；
  const ret: any = isArray(object) ? new Array(object.length) : {}

  // 遍历原对象的所有可枚举属性（包括数组索引）
  for (const key in object) {
    // 核心逻辑：将每个属性转为 ObjectRefImpl 实例（通过 propertyToRef 实现）
    // propertyToRef 内部会调用 new ObjectRefImpl(object, key)，保证 Ref 与原属性强关联
    ret[key] = propertyToRef(object, key)
  }

  // 返回转换后的对象/数组（TS 类型为 ToRefs<T>，保证类型安全）
  return ret
}

/**
 * Vue3 关联对象属性的 Ref 实现类（toRef 处理对象+key 输入时的底层载体）
 *
 * 核心作用：
 *  1. 双向关联：Ref.value 与原对象属性双向同步（修改 Ref.value → 原对象属性更新，反之亦然）；
 *  5. 依赖管理：复用原对象属性的 dep，保证 Ref 与原对象属性的响应式更新一致； --> 由源对象的依赖管理
 *
 * 核心特性：
 * - 关联特性：与原对象属性强绑定，无数据拷贝，所有操作直接作用于原对象；
 * - 解包适配：非数组整数索引场景下，自动解包嵌套 Ref（符合 Vue 模板解包规则）；
 * - 深浅适配：根据原对象的响应式层级，决定是否浅层处理（保留 Ref 不解包）；
 * - 依赖复用：复用原对象属性的 dep，保证 Ref 与原对象属性的更新逻辑一致；
 */
class ObjectRefImpl<T extends object, K extends keyof T> {
  // 只读标记：标识当前实例是 Ref 类型，与普通 ref/shallowRef 兼容（isRef 检测返回 true）
  public readonly [ReactiveFlags.IS_REF] = true
  // 存储当前读取的属性值（缓存，! 非空断言：初始化时由 get value 赋值）
  public _value: T[K] = undefined!

  // 私有属性：原对象的原始值（toRaw 后的对象，避免代理嵌套）
  private readonly _raw: T
  // 私有属性：是否浅层处理（决定是否解包嵌套 Ref）
  private readonly _shallow: boolean

  /**
   * 构造函数：初始化对象属性关联的 Ref，计算浅层标记 _shallow
   *
   * @param _object 原对象（响应式/普通对象均可）；
   * @param _key 要关联的属性名；
   * @param _defaultValue 可选默认值：原对象属性为 undefined 时使用；
   */
  constructor(
    private readonly _object: T,
    private readonly _key: K,
    private readonly _defaultValue?: T[K],
  ) {
    // 1. 获取原对象的原始值（toRaw 穿透响应式代理，避免代理嵌套）
    this._raw = toRaw(_object)

    // 2. 初始化浅层标记为 true（默认浅层处理）
    let shallow = true
    // 临时变量：遍历原对象的代理层级
    let obj = _object

    // 3. 核心判断：非“数组 + 整数索引”场景 → 需要判断是否解包 Ref
    // For an array with integer key, refs are not unwrapped 对于具有整数键的数组，引用不会解包
    if (!isArray(_object) || !isIntegerKey(String(_key))) {
      // 遍历原对象的代理层级（直到找到非代理对象或非浅层代理）
      // Otherwise, check each proxy layer for unwrapping 否则，检查每个代理层是否解包
      do {
        shallow = !isProxy(obj) || isShallow(obj)
      } while (shallow && (obj = (obj as Target)[ReactiveFlags.RAW])) // 继续遍历下一层代理（RAW 标记指向原始对象/外层代理）
    }

    // 4. 存储最终的浅层标记（决定 get/set 时是否解包 Ref）
    this._shallow = shallow
  }

  /**
   * value 访问器的 get 方法（读取 Ref.value 时触发）
   *
   * 核心逻辑：
   *  1. 读取原对象属性值；
   *  2. 浅层处理时解包嵌套 Ref（unref）；
   *  3. 属性值为 undefined 时使用默认值兜底；
   *  4. 缓存值到 _value 并返回；
   */
  get value() {
    // 1. 读取原对象的当前属性值  --> 依赖收集由 reactive 创建的响应式对象处理
    let val = this._object[this._key]
    // 2. 浅层处理 → 解包嵌套 Ref（unref：Ref 返 value，非 Ref 返自身）
    if (this._shallow) {
      val = unref(val)
    }

    // 3. 赋值并返回：属性值为 undefined 时使用默认值，否则使用属性值
    return (this._value = val === undefined ? this._defaultValue! : val)
  }

  /**
   * value 访问器的 set 方法（修改 Ref.value 时触发）
   *
   * 核心逻辑：
   *  1. 浅层处理且原属性是 Ref → 直接修改 Ref.value（保留 Ref 引用）；
   *  2. 其他场景 → 直接赋值给原对象属性；
   */
  set value(newVal) {
    // 1. 浅层处理 且 原对象的原始属性是 Ref → 直接修改 Ref.value（不替换 Ref）
    if (this._shallow && isRef(this._raw[this._key])) {
      const nestedRef = this._object[this._key]
      // 双重校验：确保是 Ref 实例
      if (isRef(nestedRef)) {
        nestedRef.value = newVal
        return
      }
    }

    // 2. 其他场景 → 直接赋值给原对象属性（同步修改原对象）
    this._object[this._key] = newVal
  }

  /**
   * 依赖管理器 getter：复用原对象属性的 dep
   * 核心作用：保证 Ref 的依赖收集/触发更新与原对象属性一致
   *
   * @returns Dep | undefined 原对象属性的 dep（无则返回 undefined）
   */
  get dep(): Dep | undefined {
    // 从原对象的原始值中获取属性对应的 dep
    return getDepFromReactive(this._raw, this._key)
  }
}

/**
 * Vue3 只读 Getter 型 Ref 实现类（toRef 处理函数输入时的底层载体）
 *
 * 核心作用：
 *  1. 只读特性：仅实现 value 的 get 访问器，无 set 方法，禁止修改 value；
 *  2. 动态计算：value 始终返回 getter 函数的执行结果，每次读取都会重新计算；
 *  3. 标准兼容：实现 IS_REF/IS_READONLY 标记，与普通 Ref/只读 Ref 行为一致；
 *  4. 轻量设计：无依赖管理（dep），仅聚焦“动态计算 + 只读”核心能力； --> 只读, 无需依赖管理
 *
 * 核心特性：
 * - 只读：无 set 方法，尝试修改 value 会抛出 TypeError（严格模式）/静默失败（非严格模式）；
 * - 动态：每次读取 value 都会执行 getter 函数，返回最新计算结果；
 * - 无响应式：自身不收集依赖、不触发更新（若 getter 内访问响应式值，会收集到对应响应式对象的 dep 中）；
 *
 */
class GetterRefImpl<T> {
  // 只读标记1：标识当前实例是 Ref 类型，与普通 ref/shallowRef 兼容（isRef 检测返回 true）
  public readonly [ReactiveFlags.IS_REF] = true
  // 只读标记2：标识当前实例是只读 Ref，与 readonly(ref()) 行为一致（isReadonly 检测返回 true）
  public readonly [ReactiveFlags.IS_READONLY] = true
  // 存储当前 value 的计算结果（! 非空断言：初始化时由 get 方法赋值）
  public _value: T = undefined!

  // 构造函数：初始化 Getter Ref，绑定 getter 函数
  constructor(private readonly _getter: () => T) {}

  /**
   * value 访问器的 get 方法（唯一的访问入口）
   *
   * 核心逻辑：执行 getter 函数，更新 _value 并返回最新计算结果
   *
   * 特点：
   *  1. 每次读取都会重新执行 getter，保证值是最新的；
   *  2. 无依赖收集逻辑（自身无 dep），若 getter 内访问响应式值，会触发对应值的 dep.track；
   *  3. 无 set 方法，因此该 Ref 是只读的；
   */
  get value() {
    // 执行 getter 函数，将结果赋值给 _value（缓存当前计算结果）并返回
    return (this._value = this._getter())
  }
}

export type ToRef<T> = IfAny<T, Ref<T>, [T] extends [Ref] ? T : Ref<T>>

/**
 * Used to normalize values / refs / getters into refs. 用于将值/引用/getter方法规范化为引用
 *
 * @example
 * ```js
 * // returns existing refs as-is
 * toRef(existingRef)
 *
 * // creates a ref that calls the getter on .value access
 * toRef(() => props.foo)
 *
 * // creates normal refs from non-function values
 * // equivalent to ref(1)
 * toRef(1)
 * ```
 *
 * Can also be used to create a ref for a property on a source reactive object. 也可用于为源响应式对象上的属性创建引用
 * The created ref is synced with its source property: mutating the source 创建的引用与其源属性同步：改变源属性
 * property will update the ref, and vice-versa. 属性会更新引用，反之亦然
 *
 * @example
 * ```js
 * const state = reactive({
 *   foo: 1,
 *   bar: 2
 * })
 *
 * const fooRef = toRef(state, 'foo')
 *
 * // mutating the ref updates the original
 * fooRef.value++
 * console.log(state.foo) // 2
 *
 * // mutating the original also updates the ref
 * state.foo++
 * console.log(fooRef.value) // 3
 * ```
 *
 * @param source - A getter, an existing ref, a non-function value, or a 一个getter方法、一个现有的引用、一个非函数值，或者一个
 *                 reactive object to create a property ref from.  用于从中创建属性引用的响应式对象
 * @param [key] - (optional) Name of the property in the reactive object. （可选）响应式对象中属性的名称
 * @see {@link https://vuejs.org/api/reactivity-utilities.html#toref}
 */
export function toRef<T>(
  value: T,
): T extends () => infer R
  ? Readonly<Ref<R>>
  : T extends Ref
    ? T
    : Ref<UnwrapRef<T>>
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
): ToRef<T[K]>
export function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue: T[K],
): ToRef<Exclude<T[K], undefined>>
export function toRef(
  source: Record<string, any> | MaybeRef,
  key?: string,
  defaultValue?: unknown,
): Ref {
  // 分支1：source 已是 Ref 实例 → 直接返回，避免重复包装（性能优化）
  if (isRef(source)) {
    return source
  }
  // 分支2：source 是函数 → 转为 GetterRefImpl 实例（只读 Ref，值由函数执行结果决定）
  else if (isFunction(source)) {
    return new GetterRefImpl(source) as any
  }
  // 分支3：source 是对象 且 传入了 key 参数 → 转为关联对象属性的 Ref（ObjectRefImpl）
  else if (isObject(source) && arguments.length > 1) {
    // propertyToRef 核心逻辑：创建 ObjectRefImpl，关联 source[key]，不存在则用 defaultValue
    return propertyToRef(source, key!, defaultValue)
  }
  // 分支4：其他情况（普通值/无 key 的对象）→ 调用 ref() 包装为普通 RefImpl 实例
  else {
    return ref(source)
  }
}

/**
 * 将对象的指定属性转换为一个 ref 对象，使得对该 ref 的操作会同步到原对象的属性上
 * 此函数创建一个 ObjectRefImpl 实例，将源对象的特定键绑定到 ref 上
 *
 * @param source - 源对象，从中提取属性的原始对象
 * @param key - 源对象上的属性名，要转换为 ref 的属性键
 * @param defaultValue - 当源对象中指定键的值为 undefined 时使用的默认值
 * @returns 返回一个 ObjectRefImpl 实例，它实现了 ref 接口并代理对源对象属性的访问
 */
function propertyToRef(
  source: Record<string, any>,
  key: string,
  defaultValue?: unknown,
) {
  return new ObjectRefImpl(source, key, defaultValue) as any
}

/**
 * This is a special exported interface for other packages to declare 这是一个特殊的导出接口，供其他包进行声明
 * additional types that should bail out for ref unwrapping. For example 针对引用解包应处理的其他类型。例如
 * \@vue/runtime-dom can declare it like so in its d.ts: \@vue/runtime-dom 可以在其 d.ts 中这样声明
 *
 * ``` ts
 * declare module '@vue/reactivity' {
 *   export interface RefUnwrapBailTypes {
 *     runtimeDOMBailTypes: Node | Window
 *   }
 * }
 * ```
 */
export interface RefUnwrapBailTypes {}

export type ShallowUnwrapRef<T> = {
  [K in keyof T]: DistributeRef<T[K]>
}

type DistributeRef<T> = T extends Ref<infer V, unknown> ? V : T

export type UnwrapRef<T> =
  T extends ShallowRef<infer V, unknown>
    ? V
    : T extends Ref<infer V, unknown>
      ? UnwrapRefSimple<V>
      : UnwrapRefSimple<T>

export type UnwrapRefSimple<T> = T extends
  | Builtin
  | Ref
  | RefUnwrapBailTypes[keyof RefUnwrapBailTypes]
  | { [RawSymbol]?: true }
  ? T
  : T extends Map<infer K, infer V>
    ? Map<K, UnwrapRefSimple<V>> & UnwrapRef<Omit<T, keyof Map<any, any>>>
    : T extends WeakMap<infer K, infer V>
      ? WeakMap<K, UnwrapRefSimple<V>> &
          UnwrapRef<Omit<T, keyof WeakMap<any, any>>>
      : T extends Set<infer V>
        ? Set<UnwrapRefSimple<V>> & UnwrapRef<Omit<T, keyof Set<any>>>
        : T extends WeakSet<infer V>
          ? WeakSet<UnwrapRefSimple<V>> & UnwrapRef<Omit<T, keyof WeakSet<any>>>
          : T extends ReadonlyArray<any>
            ? { [K in keyof T]: UnwrapRefSimple<T[K]> }
            : T extends object & { [ShallowReactiveMarker]?: never }
              ? {
                  [P in keyof T]: P extends symbol ? T[P] : UnwrapRef<T[P]>
                }
              : T
