import {
  type Target,
  isReadonly,
  isShallow,
  toRaw,
  toReactive,
  toReadonly,
} from './reactive'
import { ITERATE_KEY, MAP_KEY_ITERATE_KEY, track, trigger } from './dep'
import { ReactiveFlags, TrackOpTypes, TriggerOpTypes } from './constants'
import {
  capitalize,
  extend,
  hasChanged,
  hasOwn,
  isMap,
  toRawType,
} from '@vue/shared'
import { warn } from './warning'

type CollectionTypes = IterableCollections | WeakCollections

type IterableCollections = (Map<any, any> | Set<any>) & Target
type WeakCollections = (WeakMap<any, any> | WeakSet<any>) & Target
type MapTypes = (Map<any, any> | WeakMap<any, any>) & Target
type SetTypes = (Set<any> | WeakSet<any>) & Target

const toShallow = <T extends unknown>(value: T): T => value

const getProto = <T extends CollectionTypes>(v: T): any =>
  Reflect.getPrototypeOf(v)

/**
 * 创建集合迭代器方法的包装函数（keys/values/entries/Symbol.iterator）
 *
 * 核心作用：
 *    1. 依赖收集：非只读集合触发 ITERATE/MAP_KEY_ITERATE 依赖收集；
 *    2. 迭代值包装：将迭代结果包装为响应式/只读/浅响应值；
 *    3. 行为兼容：遵循迭代器协议（next/Symbol.iterator），保证原生迭代行为；
 *
 * @param method 迭代器方法名（keys/values/entries/Symbol.iterator）
 * @param isReadonly 是否为只读集合
 * @param isShallow 是否为浅响应集合
 * @returns 包装后的迭代器方法
 */
function createIterableMethod(
  method: string | symbol,
  isReadonly: boolean,
  isShallow: boolean,
) {
  return function (
    this: IterableCollections, // this 指向响应式集合代理对象
    ...args: unknown[] // 迭代器方法参数（如 entries 的参数）
  ): Iterable<unknown> & Iterator<unknown> {
    // 1. 获取响应式集合的原始目标（ReactiveFlags.RAW 指向原始集合）
    const target = this[ReactiveFlags.RAW]
    // 2. 穿透代理获取最原始的集合（避免嵌套响应式）
    const rawTarget = toRaw(target)
    // 3. 判断是否为Map类型（Map的迭代器返回 [key, value] 对，Set返回单个值）
    const targetIsMap = isMap(rawTarget)
    // 4. 判断是否为键值对迭代（entries/Map的Symbol.iterator 返回 [key, value]）
    const isPair =
      method === 'entries' || (method === Symbol.iterator && targetIsMap)
    // 5. 判断是否仅迭代键（Map的keys方法）
    const isKeyOnly = method === 'keys' && targetIsMap
    // 6. 创建原始迭代器（基于原始集合执行方法）
    const innerIterator = target[method](...args)
    // 7. 确定值包装函数：
    //    - 浅响应 → toShallow（返回原始值）
    //    - 只读 → toReadonly（返回只读响应式）
    //    - 深响应 → toReactive（返回深响应式）
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive

    // 8. 非只读集合：触发迭代依赖收集
    !isReadonly &&
      track(
        rawTarget, // 依赖收集的目标：原始集合
        TrackOpTypes.ITERATE, // 操作类型：迭代
        // 依赖key：Map键迭代用 MAP_KEY_ITERATE_KEY，其他用 ITERATE_KEY
        isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY,
      )

    // return a wrapped iterator which returns observed versions of the 返回一个包装好的迭代器，该迭代器返回被观察到的版本
    // values emitted from the real iterator 从实际迭代器中发出的值
    // 9. 返回包装后的迭代器（遵循迭代器/可迭代协议）
    return {
      // iterator protocol 迭代器协议
      next() {
        // 9.1 调用原始迭代器的 next()
        const { value, done } = innerIterator.next()

        // 9.2 迭代完成：直接返回 { value, done }
        //     未完成：包装值后返回（键值对分别包装/单个值包装）
        return done
          ? { value, done }
          : {
              value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value), // 键值对：key/value 都包装
              done,
            }
      },
      // iterable protocol 可迭代协议
      [Symbol.iterator]() {
        return this
      },
    }
  }
}

/**
 * 创建只读集合的修改方法拦截器（add/set/delete/clear）
 *
 * 核心作用：
 *  1. 开发环境：抛出修改只读集合的警告；
 *  2. 生产环境：返回固定值（保证行为兼容）；
 *
 * @param type 触发操作类型（ADD/SET/DELETE/CLEAR）
 * @returns 只读拦截方法
 */
function createReadonlyMethod(type: TriggerOpTypes): Function {
  return function (this: CollectionTypes, ...args: unknown[]) {
    // 开发环境：输出修改只读集合的警告
    if (__DEV__) {
      const key = args[0] ? `on key "${args[0]}" ` : ``
      warn(
        `${capitalize(type)} operation ${key}failed: target is readonly.`,
        toRaw(this),
      )
    }

    // 生产环境：返回兼容值
    return type === TriggerOpTypes.DELETE
      ? false
      : type === TriggerOpTypes.CLEAR
        ? undefined
        : this
  }
}

type Instrumentations = Record<string | symbol, Function | number>

/**
 * 创建集合的 instrumentation（方法/属性拦截集合）
 *
 * 核心作用：
 *    1. 重写集合的核心方法（get/has/forEach/size/迭代器/修改方法）；
 *    2. 适配只读/浅响应/深响应场景；
 *    3. 处理响应式键匹配（响应式key ↔ 原始key）；
 *
 * @param readonly 是否为只读集合
 * @param shallow 是否为浅响应集合
 * @returns 集合方法/属性拦截集合
 */
function createInstrumentations(
  readonly: boolean,
  shallow: boolean,
): Instrumentations {
  const instrumentations: Instrumentations = {
    /**
     * 重写 Map/WeakMap 的 get 方法
     *
     * 核心逻辑：
     *    1. 依赖收集：非只读集合收集 GET 依赖（响应式key + 原始key）；
     *    2. 键匹配：优先匹配响应式key，再匹配原始key；
     *    3. 值包装：根据响应式类型（浅/深/只读）包装返回值；
     *    4. 兼容：readonly(reactive(Map)) 嵌套场景；
     */
    get(this: MapTypes, key: unknown) {
      // #1772: readonly(reactive(Map)) should return readonly + reactive version readonly(reactive(Map)) 应该返回只读+反应版本
      // of the value 的价值

      // 1. 获取响应式集合的原始目标
      const target = this[ReactiveFlags.RAW]
      // 2. 穿透代理获取最原始的Map
      const rawTarget = toRaw(target)
      // 3. 穿透代理获取key的原始值
      const rawKey = toRaw(key)

      // 4. 非只读集合：收集 GET 依赖
      if (!readonly) {
        // 4.1 若响应式key与原始key不同 → 收集响应式key的依赖
        if (hasChanged(key, rawKey)) {
          track(rawTarget, TrackOpTypes.GET, key)
        }
        // 4.2 收集原始key的依赖（保证原始key查找也能触发更新）
        track(rawTarget, TrackOpTypes.GET, rawKey)
      }

      // 5. 获取原始Map的has方法（兼容不同环境）
      const { has } = getProto(rawTarget)
      // 6. 确定值包装函数（浅/只读/深响应）
      const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive

      // 7. 优先匹配响应式key → 包装返回值
      if (has.call(rawTarget, key)) {
        return wrap(target.get(key))
      }
      // 8. 响应式key未匹配 → 匹配原始key → 包装返回值
      else if (has.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey))
      }
      // 9. 嵌套响应式场景（readonly(reactive(Map))）：
      //    保证内层reactive Map能自行追踪依赖
      else if (target !== rawTarget) {
        // #3602 readonly(reactive(Map)) 只读（响应式（Map））
        // ensure that the nested reactive `Map` can do tracking for itself 确保嵌套的响应式`Map`能够自行进行跟踪
        target.get(key)
      }
    },

    /**
     * 重写集合的 size 属性
     * 核心逻辑：非只读集合收集 ITERATE 依赖，返回原始集合的 size
     */
    get size() {
      // 1. 获取响应式集合的原始目标
      const target = (this as unknown as IterableCollections)[ReactiveFlags.RAW]

      // 2. 非只读集合：收集迭代依赖（size变化会影响迭代结果）
      !readonly && track(toRaw(target), TrackOpTypes.ITERATE, ITERATE_KEY)

      // 3. 返回原始集合的 size（保证数值正确）
      return target.size
    },

    /**
     * 重写集合的 has 方法（判断是否包含指定key/value）
     * 核心逻辑：
     * 1. 依赖收集：非只读集合收集 HAS 依赖（响应式key + 原始key）；
     * 2. 键匹配：优先匹配响应式key，再匹配原始key；
     */
    has(this: CollectionTypes, key: unknown): boolean {
      // 1. 获取原始目标和原始key
      const target = this[ReactiveFlags.RAW]
      const rawTarget = toRaw(target)
      const rawKey = toRaw(key)

      // 2. 非只读集合：收集 HAS 依赖
      if (!readonly) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, TrackOpTypes.HAS, key)
        }
        track(rawTarget, TrackOpTypes.HAS, rawKey)
      }

      // 3. 键匹配逻辑：
      //    - 响应式key === 原始key → 直接调用原生has；
      //    - 否则 → 先匹配响应式key，再匹配原始key；
      return key === rawKey
        ? target.has(key)
        : target.has(key) || target.has(rawKey)
    },

    /**
     * 重写集合的 forEach 方法
     *
     * 核心逻辑：
     *    1. 依赖收集：非只读集合收集 ITERATE 依赖；
     *    2. 回调适配：
     *       - thisArg 绑定正确的上下文；
     *       - value/key 包装为响应式/只读/浅响应值；
     *       - 第三个参数绑定为响应式集合（而非原始集合）；
     */
    forEach(this: IterableCollections, callback: Function, thisArg?: unknown) {
      // 1. 响应式集合代理对象
      const observed = this
      // 2. 原始目标和原始集合
      const target = observed[ReactiveFlags.RAW]
      const rawTarget = toRaw(target)
      // 3. 确定值包装函数
      const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive

      // 4. 非只读集合：收集迭代依赖
      !readonly && track(rawTarget, TrackOpTypes.ITERATE, ITERATE_KEY)

      return target.forEach((value: unknown, key: unknown) => {
        // important: make sure the callback is 重要提示：请确保回调函数是
        // 1. invoked with the reactive map as `this` and 3rd arg 1. 以响应式映射作为`this`和第三个参数进行调用
        // 2. the value received should be a corresponding reactive/readonly. 2. 收到的值应该是相应的响应式/只读值。

        return callback.call(
          thisArg, // 回调的this指向
          wrap(value), // 包装后的value（响应式/只读/浅响应）
          wrap(key), // 包装后的key（响应式/只读/浅响应）
          observed, // 第三个参数：响应式集合（而非原始集合）
        )
      })
    },
  }

  /**
   * 扩展 instrumentation：添加修改方法（add/set/delete/clear）
   *    - 只读集合：使用 createReadonlyMethod 创建拦截器（抛警告+返回兼容值）；
   *    - 可变集合：重写修改方法，触发依赖更新；
   */
  extend(
    instrumentations,
    readonly
      ? {
          // 只读集合：使用 createReadonlyMethod 创建拦截器（抛警告+返回兼容值）
          add: createReadonlyMethod(TriggerOpTypes.ADD),
          set: createReadonlyMethod(TriggerOpTypes.SET),
          delete: createReadonlyMethod(TriggerOpTypes.DELETE),
          clear: createReadonlyMethod(TriggerOpTypes.CLEAR),
        }
      : {
          /**
           * 重写 Set/WeakSet 的 add 方法
           *
           * 核心逻辑：
           *    1. 值处理：非浅响应场景下，将value转为原始值；
           *    2. 存在性检查：避免重复添加；
           *    3. 触发更新：新增值时触发 ADD 类型的 trigger；
           */
          add(this: SetTypes, value: unknown) {
            // 1. 非浅响应场景：将value转为原始值（避免响应式值作为Set元素）
            if (!shallow && !isShallow(value) && !isReadonly(value)) {
              value = toRaw(value)
            }
            // 2. 获取原始集合和原型方法
            const target = toRaw(this)
            const proto = getProto(target)
            // 3. 检查是否已存在该值
            const hadKey = proto.has.call(target, value)

            // 4. 不存在则添加，并触发 ADD 更新
            if (!hadKey) {
              target.add(value)
              // 5. 触发依赖更新
              trigger(target, TriggerOpTypes.ADD, value, value)
            }

            // 返回自身（兼容原生行为）
            return this
          },

          /**
           * 重写 Map/WeakMap 的 set 方法
           *
           * 核心逻辑：
           *    1. 值处理：非浅响应场景下，将value转为原始值；
           *    2. 键匹配：检查响应式key/原始key是否存在；
           *    3. 开发环境：警告重复的原始/响应式key；
           *    4. 触发更新：新增键触发 ADD，修改值触发 SET；
           */
          set(this: MapTypes, key: unknown, value: unknown) {
            // 1. 非浅响应场景：将value转为原始值
            if (!shallow && !isShallow(value) && !isReadonly(value)) {
              value = toRaw(value)
            }
            // 2. 获取原始集合和原型方法
            const target = toRaw(this)
            const { has, get } = getProto(target)

            // 3. 检查响应式key是否存在
            let hadKey = has.call(target, key)
            // 4. 响应式key不存在 → 检查原始key
            if (!hadKey) {
              key = toRaw(key)
              hadKey = has.call(target, key)
            }
            // 5. 开发环境：检查是否同时存在原始/响应式key（避免不一致）
            else if (__DEV__) {
              checkIdentityKeys(target, has, key)
            }

            // 6. 获取旧值
            const oldValue = get.call(target, key)
            // 7. 执行原生set方法
            target.set(key, value)
            // 8. 触发更新：
            //    - 新增键 → ADD 类型；
            //    - 修改值 → SET 类型（值变化时）；
            if (!hadKey) {
              trigger(target, TriggerOpTypes.ADD, key, value)
            } else if (hasChanged(value, oldValue)) {
              trigger(target, TriggerOpTypes.SET, key, value, oldValue)
            }

            // 9. 返回自身（兼容原生行为）
            return this
          },

          /**
           * 重写集合的 delete 方法
           *
           * 核心逻辑：
           *    1. 键匹配：检查响应式key/原始key是否存在；
           *    2. 开发环境：警告重复的原始/响应式key；
           *    3. 触发更新：删除存在的键时触发 DELETE 更新；
           */
          delete(this: CollectionTypes, key: unknown) {
            // 1. 获取原始集合和原型方法
            const target = toRaw(this)
            const { has, get } = getProto(target)
            // 2. 检查响应式key是否存在
            let hadKey = has.call(target, key)
            // 3. 响应式key不存在 → 检查原始key
            if (!hadKey) {
              key = toRaw(key)
              hadKey = has.call(target, key)
            }
            // 4. 开发环境：检查重复key
            else if (__DEV__) {
              checkIdentityKeys(target, has, key)
            }

            // 5. 获取旧值
            const oldValue = get ? get.call(target, key) : undefined

            // 6. 执行原生delete方法
            // forward the operation before queueing reactions 在排队反应之前转发操作
            const result = target.delete(key)
            // 7. 触发更新：删除存在的键时
            if (hadKey) {
              trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue)
            }

            // 8. 返回删除结果（boolean）
            return result
          },

          /**
           * 重写集合的 clear 方法
           *
           * 核心逻辑：
           *    1. 存在性检查：集合非空时才触发更新；
           *    2. 触发更新：CLEAR 类型，携带旧集合快照（开发环境）；
           */
          clear(this: IterableCollections) {
            // 1. 获取原始集合
            const target = toRaw(this)
            // 2. 检查集合是否有元素
            const hadItems = target.size !== 0
            // 3. 开发环境：创建旧集合快照（便于调试）
            const oldTarget = __DEV__
              ? isMap(target)
                ? new Map(target)
                : new Set(target)
              : undefined

            // forward the operation before queueing reactions 在排队反应之前转发操作
            // 4. 执行原生clear方法
            const result = target.clear()
            // 5. 触发更新：集合非空时
            if (hadItems) {
              trigger(
                target,
                TriggerOpTypes.CLEAR,
                undefined,
                undefined,
                oldTarget,
              )
            }

            // 6. 返回clear结果（undefined）
            return result
          },
        },
  )

  /**
   * 扩展 instrumentation：添加迭代器方法（keys/values/entries/Symbol.iterator）
   * 通过 createIterableMethod 创建包装后的迭代器方法
   */
  const iteratorMethods = [
    'keys',
    'values',
    'entries',
    Symbol.iterator,
  ] as const

  iteratorMethods.forEach(method => {
    instrumentations[method] = createIterableMethod(method, readonly, shallow)
  })

  return instrumentations
}

/**
 * 创建集合拦截器的 getter 函数（Proxy 的 get 拦截器）
 *
 * 核心作用：
 *    1. 响应式标识处理：返回 IS_REACTIVE/IS_READONLY/RAW 标识；
 *    2. 方法/属性拦截：优先使用 instrumentation 中的包装方法，否则调用原生方法；
 *
 * @param isReadonly 是否为只读集合
 * @param shallow 是否为浅响应集合
 * @returns Proxy 的 get 陷阱函数
 */
function createInstrumentationGetter(isReadonly: boolean, shallow: boolean) {
  // 1. 创建当前场景的 instrumentation（方法/属性拦截集合）
  const instrumentations = createInstrumentations(isReadonly, shallow)

  return (
    target: CollectionTypes, // 原始集合目标
    key: string | symbol, // 要获取的键（方法/属性名）
    receiver: CollectionTypes, // 代理对象（this 指向）
  ) => {
    // 响应式标识处理

    // ReactiveFlags.IS_REACTIVE: 获取是否响应式标识
    if (key === ReactiveFlags.IS_REACTIVE) {
      // 返回是否只读
      return !isReadonly
    }
    // ReactiveFlags.IS_READONLY: 获取是否只读标识
    else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    // ReactiveFlags.RAW: 获取原始集合对象
    else if (key === ReactiveFlags.RAW) {
      return target
    }

    // 3. 方法/属性拦截逻辑：
    //    - 若 instrumentation 包含该键，且原始集合也有该键 → 使用 instrumentation 中的方法；
    //    - 否则 → 调用原生方法/属性；
    //    - 通过 Reflect.get 保证 this 绑定正确；
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target
        ? instrumentations
        : target,
      key,
      receiver,
    )
  }
}

/**
 * 集合(Set/Map)的访问都是通过方法, 方法的获取首先是 get 拦截器, 所以在 get 拦截器中对方法进行重写
 */

/** 可变深响应集合拦截器（reactive(Map/Set)） */
export const mutableCollectionHandlers: ProxyHandler<CollectionTypes> = {
  get: /*@__PURE__*/ createInstrumentationGetter(false, false),
}

/** 浅响应集合拦截器（shallowReactive(Map/Set)） */
export const shallowCollectionHandlers: ProxyHandler<CollectionTypes> = {
  get: /*@__PURE__*/ createInstrumentationGetter(false, true),
}

/** 只读深响应集合拦截器（readonly(Map/Set)） */
export const readonlyCollectionHandlers: ProxyHandler<CollectionTypes> = {
  get: /*@__PURE__*/ createInstrumentationGetter(true, false),
}

/** 浅只读集合拦截器（shallowReadonly(Map/Set)） */
export const shallowReadonlyCollectionHandlers: ProxyHandler<CollectionTypes> =
  {
    get: /*@__PURE__*/ createInstrumentationGetter(true, true),
  }

/**
 * 开发环境工具函数：检查集合中是否同时存在原始/响应式key
 * 核心作用：警告用户避免同时使用原始/响应式key（可能导致不一致）
 *
 * @param target 原始集合
 * @param has 集合的has方法
 * @param key 响应式key
 */
function checkIdentityKeys(
  target: CollectionTypes,
  has: (key: unknown) => boolean,
  key: unknown,
) {
  const rawKey = toRaw(key)

  // 若响应式key ≠ 原始key，且原始集合包含原始key → 抛出警告
  if (rawKey !== key && has.call(target, rawKey)) {
    const type = toRawType(target)
    warn(
      `Reactive ${type} contains both the raw and reactive ` + // `响应式${type}同时包含原始类型和响应式类型`
        `versions of the same object${type === `Map` ? ` as keys` : ``}, ` + // 同一对象的版本${type === 'Map' ? '作为键' : ''}
        `which can lead to inconsistencies. ` + // 这可能会导致不一致
        `Avoid differentiating between the raw and reactive versions ` + // 避免区分原始版本和响应式版本
        `of an object and only use the reactive version if possible.`, // “一个对象，如果可能的话，只使用反应式版本
    )
  }
}
