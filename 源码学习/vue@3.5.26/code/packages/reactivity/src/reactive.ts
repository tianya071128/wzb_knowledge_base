import { def, hasOwn, isObject, toRawType } from '@vue/shared'
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReactiveHandlers,
  shallowReadonlyHandlers,
} from './baseHandlers'
import {
  mutableCollectionHandlers,
  readonlyCollectionHandlers,
  shallowCollectionHandlers,
  shallowReadonlyCollectionHandlers,
} from './collectionHandlers'
import type { RawSymbol, Ref, UnwrapRefSimple } from './ref'
import { ReactiveFlags } from './constants'
import { warn } from './warning'

export interface Target {
  [ReactiveFlags.SKIP]?: boolean
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
  [ReactiveFlags.IS_SHALLOW]?: boolean
  [ReactiveFlags.RAW]?: any
}

/**
 * 存储响应式对象与其原始对象之间映射关系的 WeakMap
 *
 * 作用：缓存通过 reactive() 函数创建的响应式代理对象，确保同一原始对象多次调用 reactive() 时返回相同的代理对象
 *
 * 映射关系：原始对象 (Target) -> 响应式代理对象 (Proxy)
 *
 * 使用场景：
 *  - reactive(target) 执行时，先检查此 map 中是否已存在 target 的记录，如有则直接返回缓存的代理对象
 *  - 避免重复创建响应式代理，提高性能并保证引用一致性
 */
export const reactiveMap: WeakMap<Target, any> = new WeakMap<Target, any>()
/** 浅层响应式对象的缓存映射表 */
export const shallowReactiveMap: WeakMap<Target, any> = new WeakMap<
  Target,
  any
>()
/**
 * 存储只读响应式对象的映射表，用于缓存已创建的只读响应式对象
 * 当一个目标对象被转换为只读响应式对象时，会将其原始对象作为键，只读响应式对象作为值存储在此映射表中
 */
export const readonlyMap: WeakMap<Target, any> = new WeakMap<Target, any>()
/**
 * 存储浅层只读响应式对象的映射表，用于缓存已创建的浅层只读响应式对象
 * 当一个目标对象被转换为浅层只读响应式对象时，会将其原始对象作为键，浅层只读响应式对象作为值存储在此映射表中
 */
export const shallowReadonlyMap: WeakMap<Target, any> = new WeakMap<
  Target,
  any
>()

enum TargetType {
  /** 无效类型（不可代理） */
  INVALID = 0,
  /** 普通类型（对象/数组） */
  COMMON = 1,
  /** 集合类型（Map/Set/WeakMap/WeakSet） */
  COLLECTION = 2,
}

/**
 * 将原始类型字符串映射到对应的 TargetType 枚举值
 *
 * @param rawType - 原始类型字符串，表示 JavaScript 对象的类型，如 'Object'、'Array'、'Map' 等
 * @returns 返回 TargetType 枚举值，用于标识对象是否可以被响应式处理
 *          - TargetType.COMMON: 普通对象类型 ('Object' 或 'Array')
 *          - TargetType.COLLECTION: 集合类型 ('Map', 'Set', 'WeakMap', 'WeakSet')
 *          - TargetType.INVALID: 不支持响应式的无效类型
 */
function targetTypeMap(rawType: string) {
  switch (rawType) {
    case 'Object':
    case 'Array':
      return TargetType.COMMON
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return TargetType.COLLECTION
    default:
      return TargetType.INVALID
  }
}

/**
 * Vue3 响应式系统 - 目标对象类型判断核心函数
 *
 * 核心作用：
 *   1. 筛选可被响应式代理的对象：排除跳过标记对象、不可扩展对象；
 *   2. 精准分类目标类型：根据原始类型字符串（如 "Object"/"Map"）映射为 TargetType 枚举；
 *   3. 为 createReactiveObject 提供依据：决定是否创建代理、使用普通/集合处理器；
 *
 * @param value 要判断的目标对象（Target 类型：可能是普通对象/数组/Map/Set/Date/Symbol 等）；
 * @returns TargetType 枚举值：
 *   - TargetType.INVALID：无效类型（不可代理）；
 *   - TargetType.COMMON：普通类型（对象/数组）；
 *   - TargetType.COLLECTION：集合类型（Map/Set/WeakMap/WeakSet）；
 *
 * 核心判断逻辑（优先级从高到低）：
 * 1. 有 SKIP 标记 → INVALID；
 * 2. 不可扩展对象 → INVALID；
 * 3. 否则根据原始类型映射为 COMMON/COLLECTION/INVALID；
 */
function getTargetType(value: Target) {
  // 判断是否为“无效代理目标”（满足任一条件即返回 INVALID）
  return value[ReactiveFlags.SKIP] || !Object.isExtensible(value)
    ? TargetType.INVALID // 无效类型：直接返回 INVALID，不创建代理
    : targetTypeMap(toRawType(value)) // 有效类型：根据原始类型字符串映射为 TargetType
}

// only unwrap nested ref
export type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRefSimple<T>

declare const ReactiveMarkerSymbol: unique symbol

export interface ReactiveMarker {
  [ReactiveMarkerSymbol]?: void
}

export type Reactive<T> = UnwrapNestedRefs<T> &
  (T extends readonly any[] ? ReactiveMarker : {})

/**
 * Vue3 创建深度响应式对象的核心 API（reactive 入口函数）
 *
 * Returns a reactive proxy of the object. 返回对象的响应式代理
 *
 * The reactive conversion is "deep": it affects all nested properties. A 该响应式转换是“深度的”：它会影响所有嵌套的属性。A.
 * reactive object also deeply unwraps any properties that are refs while 在处理时，响应式对象还会深度解构所有为ref类型的属性
 * maintaining reactivity. 保持反应性
 *
 * @example
 * ```js
 * const obj = reactive({ count: 0 })
 * ```
 *
 * @param target - The source object. 源对象
 * @see {@link https://vuejs.org/api/reactivity-core.html#reactive}
 */
export function reactive<T extends object>(target: T): Reactive<T>
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version. 如果试图观察一个只读代理，则返回其只读版本

  // 前置校验：如果目标对象是只读代理（由 readonly() 创建），直接返回原对象
  if (isReadonly(target)) {
    return target
  }

  // 核心逻辑：委托给 createReactiveObject 创建响应式代理
  return createReactiveObject(
    target, // 要代理的原始目标对象
    false, // isReadonly：是否为只读代理（false = 可修改的响应式）
    mutableHandlers, // 普通对象/数组的 Proxy 处理器（包含 get/set/deleteProperty 等拦截逻辑）
    mutableCollectionHandlers, // 集合类型（Map/Set/WeakMap/WeakSet）的 Proxy 处理器（适配集合的 get/has/set 等方法）
    reactiveMap, // 响应式代理缓存 Map：key = 原始对象，value = 代理对象（避免重复代理）
  )
}

export declare const ShallowReactiveMarker: unique symbol

export type ShallowReactive<T> = T & { [ShallowReactiveMarker]?: true }

/**
 * Shallow version of {@link reactive}. {@link reactive}的浅层版本
 *
 * Unlike {@link reactive}, there is no deep conversion: only root-level 与{@link reactive}不同，这里没有深度转换：只有根级转换
 * properties are reactive for a shallow reactive object. Property values are 对于浅反应对象，属性是反应性的。属性值是
 * stored and exposed as-is - this also means properties with ref values will 按原样存储和公开——这也意味着带有引用值的属性将
 * not be automatically unwrapped. 不会被自动拆开
 *
 * @example
 * ```js
 * const state = shallowReactive({
 *   foo: 1,
 *   nested: {
 *     bar: 2
 *   }
 * })
 *
 * // mutating state's own properties is reactive 更改状态自身的属性是响应式的
 * state.foo++
 *
 * // ...but does not convert nested objects 但下层嵌套对象不会被转为响应式
 * isReactive(state.nested) // false
 *
 * // NOT reactive 不是响应式的
 * state.nested.bar++
 * ```
 *
 * @param target - The source object. 源对象
 * @see {@link https://vuejs.org/api/reactivity-advanced.html#shallowreactive}
 */
export function shallowReactive<T extends object>(
  target: T,
): ShallowReactive<T> {
  // 核心逻辑：委托给 createReactiveObject 创建浅层响应式代理
  return createReactiveObject(
    target, // 要代理的原始目标对象
    false, // isReadonly：是否为只读代理（false = 可修改的浅层响应式）
    shallowReactiveHandlers, // 普通对象/数组的浅层响应式 Proxy 处理器（MutableReactiveHandler 实例，isShallow = true）
    shallowCollectionHandlers, // 集合类型的浅层响应式 Proxy 处理器
    shallowReactiveMap, // 浅层响应式代理缓存 Map：key = 原始对象，value = 浅层代理对象（避免重复代理）
  )
}

type Primitive = string | number | boolean | bigint | symbol | undefined | null
export type Builtin = Primitive | Function | Date | Error | RegExp
export type DeepReadonly<T> = T extends Builtin
  ? T
  : T extends Map<infer K, infer V>
    ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
    : T extends ReadonlyMap<infer K, infer V>
      ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
      : T extends WeakMap<infer K, infer V>
        ? WeakMap<DeepReadonly<K>, DeepReadonly<V>>
        : T extends Set<infer U>
          ? ReadonlySet<DeepReadonly<U>>
          : T extends ReadonlySet<infer U>
            ? ReadonlySet<DeepReadonly<U>>
            : T extends WeakSet<infer U>
              ? WeakSet<DeepReadonly<U>>
              : T extends Promise<infer U>
                ? Promise<DeepReadonly<U>>
                : T extends Ref<infer U, unknown>
                  ? Readonly<Ref<DeepReadonly<U>>>
                  : T extends {}
                    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
                    : Readonly<T>

/**
 * Vue3 创建深度只读响应式对象的核心 API（readonly 入口函数）
 *
 * Takes an object (reactive or plain) or a ref and returns a readonly proxy to 接受一个对象（响应式对象或普通对象）或一个引用，并返回一个只读代理
 * the original. 原件。
 *
 * A readonly proxy is deep: any nested property accessed will be readonly as 一个只读代理是深层次的：任何被访问的嵌套属性都将是只读的
 * well. It also has the same ref-unwrapping behavior as {@link reactive}, 嗯。它还具有与{@link reactive}相同的引用解包行为
 * except the unwrapped values will also be made readonly. 除了未包装的值也会被设为只读
 *
 * @example
 * ```js
 * const original = reactive({ count: 0 })
 *
 * const copy = readonly(original)
 *
 * watchEffect(() => {
 *   // works for reactivity tracking
 *   console.log(copy.count)
 * })
 *
 * // mutating original will trigger watchers relying on the copy 修改原始数据会触发依赖副本的观察者
 * original.count++
 *
 * // mutating the copy will fail and result in a warning 对副本进行修改将会失败，并显示警告
 * copy.count++ // warning!
 * ```
 *
 * @param target - The source object. 源对象
 * @see {@link https://vuejs.org/api/reactivity-core.html#readonly}
 */
export function readonly<T extends object>(
  target: T,
): DeepReadonly<UnwrapNestedRefs<T>> {
  // 核心逻辑：委托给 createReactiveObject 创建只读响应式代理
  return createReactiveObject(
    target, // 要代理的原始目标对象
    true, // isReadonly：是否为只读代理（true = 只读，禁止修改）
    readonlyHandlers, // 普通对象/数组的只读 Proxy 处理器（ReadonlyReactiveHandler 实例）
    readonlyCollectionHandlers, // 集合类型（Map/Set/WeakMap/WeakSet）的只读 Proxy 处理器
    readonlyMap, // 只读代理缓存 Map：key = 原始对象，value = 只读代理对象（避免重复代理）
  )
}

/**
 * Vue3 创建浅层只读响应式对象的核心 API（shallowReadonly 入口函数）
 *
 * Shallow version of {@link readonly}. {@link readonly}的浅层版本。
 *
 * Unlike {@link readonly}, there is no deep conversion: only root-level 与{@link readonly}不同，这里没有深度转换：只有根级转换
 * properties are made readonly. Property values are stored and exposed as-is - 属性被设为只读。属性值按原样存储和公开
 * this also means properties with ref values will not be automatically 这也意味着带有ref值的属性不会被自动
 * unwrapped. 未包装的
 *
 * @example
 * ```js
 * const state = shallowReadonly({
 *   foo: 1,
 *   nested: {
 *     bar: 2
 *   }
 * })
 *
 * // mutating state's own properties will fail 更改状态自身的属性会失败
 * state.foo++
 *
 * // ...but works on nested objects 但可以更改下层嵌套对象
 * isReadonly(state.nested) // false
 *
 * // works 这是可以通过的
 * state.nested.bar++
 * ```
 *
 * @param target - The source object. 源对象
 * @see {@link https://vuejs.org/api/reactivity-advanced.html#shallowreadonly}
 */
export function shallowReadonly<T extends object>(target: T): Readonly<T> {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap,
  )
}

/**
 * Vue3 响应式代理创建的核心底层函数（所有响应式 API 的通用实现）
 *
 * 核心作用：
 *  1. 过滤无效类型, 不进行代理, 直接返回源对象
 *  2. 处理器适配：根据目标类型（普通对象/集合）选择对应的 Proxy 处理器；
 *  3. 注意: 在这里, 会根据传入的 Proxy 处理器来处理具体逻辑, 并且不会深度代理嵌套对象
 *            - 在 get 拦截器中, 如果属性值是对象的话, 会调用 reactive 或 readonly 响应式数据后返回
 *
 * @param target 要转为响应式的目标对象（Target 类型：普通对象/数组/Map/Set 等）；
 * @param isReadonly 是否创建只读代理（true = readonly，false = reactive）；
 * @param baseHandlers 普通对象/数组的 Proxy 处理器（如 mutableHandlers/readonlyHandlers）；
 * @param collectionHandlers 集合类型（Map/Set/WeakMap/WeakSet）的 Proxy 处理器（如 mutableCollectionHandlers）；
 * @param proxyMap 代理缓存 WeakMap：key = 原始目标对象，value = 对应的 Proxy 实例（不同响应式类型使用不同的 proxyMap，如 reactiveMap/readonlyMap）；
 * @returns 响应式/只读 Proxy 代理对象（无效目标直接返回原对象）；
 */
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>,
) {
  // 1. 第一步校验：非对象类型直接返回（reactive/readonly 仅支持对象类型）
  if (!isObject(target)) {
    if (__DEV__) {
      warn(
        // 值不能被设为
        `value cannot be made ${isReadonly ? 'readonly' : 'reactive'}: ${String(
          target,
        )}`,
      )
    }
    return target
  }

  // target is already a Proxy, return it. 目标已经是代理对象，返回它
  // exception: calling readonly() on a reactive object 异常：对响应式对象调用readonly()方法
  // 2. 第二步校验：目标已是 Proxy 代理对象 → 直接返回（避免重复代理）
  //     -- 例外场景：对 reactive 对象调用 readonly()（允许，需创建新的只读代理） --> e.g: readonly(reactive({ count: 0 }))
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }

  // only specific value types can be observed. 只能观察到特定的值类型
  // 3. 第三步校验：判断目标类型是否为可代理类型（仅普通对象/数组/集合可代理）
  // getTargetType 逻辑：
  // - 检测 ReactiveFlags.SKIP 标记 → 跳过（返回 INVALID）；
  // - 检测是否为特殊对象（Date/RegExp/Symbol 等）→ 返回 INVALID；
  // - 普通对象/数组 → 返回 COMMON；
  // - Map/Set/WeakMap/WeakSet → 返回 COLLECTION；
  const targetType = getTargetType(target)
  // 无效类型（如 Symbol/Date/跳过标记对象）→ 直接返回原对象
  if (targetType === TargetType.INVALID) {
    return target
  }

  // target already has corresponding Proxy target已经有对应的Proxy
  // 4. 第四步校验：缓存校验 → 目标已存在对应的 Proxy → 直接返回缓存的代理
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  // 5. 核心逻辑：创建 Proxy 代理对象
  // 根据目标类型选择处理器：
  // - 集合类型（Map/Set 等）→ 使用 collectionHandlers；
  // - 普通对象/数组 → 使用 baseHandlers；
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers,
  )

  // 6. 缓存代理对象：存入 proxyMap，供后续复用
  proxyMap.set(target, proxy)

  // 7. 返回最终的响应式/只读代理对象
  return proxy
}

/**
 * Checks if an object is a proxy created by {@link reactive} or
 * {@link shallowReactive} (or {@link ref} in some cases).
 *
 * @example
 * ```js
 * isReactive(reactive({}))            // => true
 * isReactive(readonly(reactive({})))  // => true
 * isReactive(ref({}).value)           // => true
 * isReactive(readonly(ref({})).value) // => true
 * isReactive(ref(true))               // => false
 * isReactive(shallowRef({}).value)    // => false
 * isReactive(shallowReactive({}))     // => true
 * ```
 *
 * @param value - The value to check.
 * @see {@link https://vuejs.org/api/reactivity-utilities.html#isreactive}
 */
export function isReactive(value: unknown): boolean {
  if (isReadonly(value)) {
    return isReactive((value as Target)[ReactiveFlags.RAW])
  }
  return !!(value && (value as Target)[ReactiveFlags.IS_REACTIVE])
}

/**
 * 检查传入的值是否为只读对象。只读对象的属性可以更改，但他们不能通过传入的对象直接赋值。
 *
 * Checks whether the passed value is a readonly object. The properties of a 检查传入的参数值是否为只读对象。只读对象的属性
 * readonly object can change, but they can't be assigned directly via the 只读对象可以更改，但不能通过（某种方式）直接赋值
 * passed object. 传递的对象
 *
 * The proxies created by {@link readonly} and {@link shallowReadonly} are 由{@link readonly}和{@link shallowReadonly}创建的代理是
 * both considered readonly, as is a computed ref without a set function. 两者都被视为只读，就像没有设置函数的计算引用一样。
 *
 * @param value - The value to check. 要检查的值
 * @see {@link https://vuejs.org/api/reactivity-utilities.html#isreadonly}
 */
export function isReadonly(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_READONLY])
}

/**
 * 检查一个值是否为浅层响应式对象
 *
 * @param value 要检查的值
 * @returns 如果值是浅层响应式对象则返回 true，否则返回 false
 */
export function isShallow(value: unknown): boolean {
  return !!(value && (value as Target)[ReactiveFlags.IS_SHALLOW])
}

/**
 * Checks if an object is a proxy created by {@link reactive}, // 检查对象是否是由以下对象创建的代理
 * {@link readonly}, {@link shallowReactive} or {@link shallowReadonly}.
 *
 * @param value - The value to check.
 * @see {@link https://vuejs.org/api/reactivity-utilities.html#isproxy}
 */
export function isProxy(value: any): boolean {
  return value ? !!value[ReactiveFlags.RAW] : false
}

/**
 * Returns the raw, original object of a Vue-created proxy.
 *
 * `toRaw()` can return the original object from proxies created by
 * {@link reactive}, {@link readonly}, {@link shallowReactive} or
 * {@link shallowReadonly}.
 *
 * This is an escape hatch that can be used to temporarily read without
 * incurring proxy access / tracking overhead or write without triggering
 * changes. It is **not** recommended to hold a persistent reference to the
 * original object. Use with caution.
 *
 * @example
 * ```js
 * const foo = {}
 * const reactiveFoo = reactive(foo)
 *
 * console.log(toRaw(reactiveFoo) === foo) // true
 * ```
 *
 * @param observed - The object for which the "raw" value is requested.
 * @see {@link https://vuejs.org/api/reactivity-advanced.html#toraw}
 */
export function toRaw<T>(observed: T): T {
  const raw = observed && (observed as Target)[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}

export type Raw<T> = T & { [RawSymbol]?: true }

/**
 * Marks an object so that it will never be converted to a proxy. Returns the
 * object itself.
 *
 * @example
 * ```js
 * const foo = markRaw({})
 * console.log(isReactive(reactive(foo))) // false
 *
 * // also works when nested inside other reactive objects
 * const bar = reactive({ foo })
 * console.log(isReactive(bar.foo)) // false
 * ```
 *
 * **Warning:** `markRaw()` together with the shallow APIs such as
 * {@link shallowReactive} allow you to selectively opt-out of the default
 * deep reactive/readonly conversion and embed raw, non-proxied objects in your
 * state graph.
 *
 * @param value - The object to be marked as "raw".
 * @see {@link https://vuejs.org/api/reactivity-advanced.html#markraw}
 */
export function markRaw<T extends object>(value: T): Raw<T> {
  if (!hasOwn(value, ReactiveFlags.SKIP) && Object.isExtensible(value)) {
    def(value, ReactiveFlags.SKIP, true)
  }
  return value
}

/**
 * Returns a reactive proxy of the given value (if possible).
 *
 * If the given value is not an object, the original value itself is returned.
 *
 * @param value - The value for which a reactive proxy shall be created.
 */
export const toReactive = <T extends unknown>(value: T): T =>
  isObject(value) ? reactive(value) : value

/**
 * Returns a readonly proxy of the given value (if possible).
 *
 * If the given value is not an object, the original value itself is returned.
 *
 * @param value - The value for which a readonly proxy shall be created.
 */
export const toReadonly = <T extends unknown>(value: T): DeepReadonly<T> =>
  isObject(value) ? readonly(value) : (value as DeepReadonly<T>)
