import {
  type Target,
  isReadonly,
  isShallow,
  reactive,
  reactiveMap,
  readonly,
  readonlyMap,
  shallowReactiveMap,
  shallowReadonlyMap,
  toRaw,
} from './reactive'
import { arrayInstrumentations } from './arrayInstrumentations'
import { ReactiveFlags, TrackOpTypes, TriggerOpTypes } from './constants'
import { ITERATE_KEY, track, trigger } from './dep'
import {
  hasChanged,
  hasOwn,
  isArray,
  isIntegerKey,
  isObject,
  isSymbol,
  makeMap,
} from '@vue/shared'
import { isRef } from './ref'
import { warn } from './warning'

const isNonTrackableKeys = /*@__PURE__*/ makeMap(`__proto__,__v_isRef,__isVue`)
/**
 * 创建一个包含内置 Symbol 的 Set 集合
 * 此集合用于存储 JavaScript 内置的 Symbol 类型键
 * 在 iOS 10.x 系统中，Object.getOwnPropertyNames(Symbol) 可能会枚举出 'arguments' 和 'caller'
 * 但在 Symbol 上访问它们会导致 TypeError，因为 Symbol 是严格模式下的函数
 * 因此需要过滤掉这些属性，然后将剩余的属性转换为实际的 Symbol 值，并只保留确实是 Symbol 类型的值
 */
const builtInSymbols = new Set(
  /*@__PURE__*/
  Object.getOwnPropertyNames(Symbol)
    // ios10.x Object.getOwnPropertyNames(Symbol) can enumerate 'arguments' and 'caller' 在iOS 10.x中，使用Object.getOwnPropertyNames(Symbol)可以枚举到'arguments'和'caller'
    // but accessing them on Symbol leads to TypeError because Symbol is a strict mode 但在Symbol上访问它们会导致TypeError，因为Symbol是严格模式下的
    // function
    .filter(key => key !== 'arguments' && key !== 'caller')
    .map(key => Symbol[key as keyof SymbolConstructor])
    .filter(isSymbol),
)

function hasOwnProperty(this: object, key: unknown) {
  // #10455 hasOwnProperty may be called with non-string values 可以使用非字符串值调用 hasOwnProperty
  if (!isSymbol(key)) key = String(key)
  const obj = toRaw(this)
  // 依赖收集
  track(obj, TrackOpTypes.HAS, key)
  return obj.hasOwnProperty(key as string)
}

/**
 * Vue3 响应式 Proxy 处理器基类（所有响应式处理器的通用逻辑封装）
 *
 * 核心作用：
 *   1. 统一管理响应式标记（IS_REACTIVE/IS_READONLY/IS_SHALLOW/RAW）的读取逻辑；
 *   2. 封装 get 拦截的通用流程：特殊 key 处理 → 数组/内置方法适配 → Reflect.get 取值 → 依赖收集 → 浅层/只读/Ref 解包 → 嵌套对象递归代理；
 *   3. 通过构造函数参数控制行为：区分只读/浅层/可修改响应式；
 *   4. 适配不同数据类型：数组、Ref、普通对象、Symbol 内置属性等；
 *
 * 构造函数参数：
 * @param _isReadonly 是否为只读代理（protected 修饰，子类可访问），默认 false；
 * @param _isShallow 是否为浅层响应式（protected 修饰，子类可访问），默认 false；
 */
class BaseReactiveHandler implements ProxyHandler<Target> {
  constructor(
    protected readonly _isReadonly = false,
    protected readonly _isShallow = false,
  ) {}

  /**
   * Proxy 的 get 拦截方法（核心逻辑，所有响应式对象的属性读取都会经过此方法）
   * 核心职责：
   *  1. 响应式标记（ReactiveFlags）的特殊读取逻辑；
   *  2. 数组/内置方法（如 push/hasOwnProperty）的适配；
   *  3. 调用 Reflect.get 获取原始值（保证行为规范）；
   *  4. 非跟踪属性（如 Symbol 内置属性）直接返回；
   *  5. 依赖收集: **可修改响应式对象执行依赖收集**；
   *  6. 浅层响应式直接返回值，不递归代理；
   *  7. **Ref 解包（数组索引访问 Ref 时不解包）**；
   *  8. 嵌套对象处理: 嵌套对象递归转为响应式/只读（深度响应式）；
   *
   * @param target 被代理的原始目标对象；
   * @param key 要读取的属性名/索引（字符串/符号）；
   * @param receiver 代理对象本身（或继承代理的对象）；
   * @returns 处理后的属性值（可能是原始值/Ref 解包后的值/嵌套响应式代理）；
   */
  get(target: Target, key: string | symbol, receiver: object): any {
    // 1. 特殊 key 处理：ReactiveFlags.SKIP → 直接返回目标对象的 SKIP 标记值
    if (key === ReactiveFlags.SKIP) return target[ReactiveFlags.SKIP]

    // 解构构造函数参数，简化后续逻辑
    const isReadonly = this._isReadonly,
      isShallow = this._isShallow

    // 2. 响应式标记读取逻辑（核心：标识响应式对象的类型）
    // IS_REACTIVE：只读代理返回 false，可修改代理返回 true
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }
    // IS_READONLY：只读代理返回 true，可修改代理返回 false
    else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    // IS_SHALLOW：浅层响应式返回 true，深度返回 false
    else if (key === ReactiveFlags.IS_SHALLOW) {
      return isShallow
    }
    // RAW：返回原始目标对象（核心逻辑：仅当 receiver 是当前代理/同源原型时返回，避免非法访问）
    else if (key === ReactiveFlags.RAW) {
      if (
        receiver ===
          (isReadonly
            ? isShallow
              ? shallowReadonlyMap
              : readonlyMap
            : isShallow
              ? shallowReactiveMap
              : reactiveMap
          ).get(target) ||
        // receiver is not the reactive proxy, but has the same prototype 接收器不是响应式代理，但具有相同的原型
        // this means the receiver is a user proxy of the reactive proxy 这意味着接收者是响应式代理的用户代理
        Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)
      ) {
        return target
      }
      // early return undefined 提前返回未定义
      return
    }

    // 3. 数组/内置方法适配（仅可修改响应式对象生效）
    const targetIsArray = isArray(target)

    if (!isReadonly) {
      // 3.1 数组特殊方法适配：如 push/pop/shift 等，返回包装后的方法（避免触发无限依赖收集）
      let fn: Function | undefined
      if (targetIsArray && (fn = arrayInstrumentations[key])) {
        return fn
      }
      // 3.2 hasOwnProperty 方法适配：返回包装后的方法，保证 this 指向代理对象
      if (key === 'hasOwnProperty') {
        return hasOwnProperty
      }
    }

    // 4. 核心取值：调用 Reflect.get 获取原始值（遵循 ES 规范，保证 this 指向正确）
    const res = Reflect.get(
      target,
      key,
      // if this is a proxy wrapping a ref, return methods using the raw ref 如果这是包装引用的代理，则使用原始引用返回方法
      // as receiver so that we don't have to call `toRaw` on the ref in all 作为接收者，这样我们就不必在所有的 ref 上调用 `toRaw`
      // its class methods 它的类方法
      // 特殊处理：若目标是 Ref，使用原始 Ref 作为 receiver，避免在 Ref 方法中调用 toRaw
      isRef(target) ? target : receiver,
    )

    // 5. 非跟踪属性处理：Symbol 内置属性/不可跟踪 key（如 __proto__）直接返回，不收集依赖
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res
    }

    // 6. 依赖收集：仅可修改响应式对象（非只读）执行 track，记录当前 key 被访问
    //    只读响应式因为不可更改, 所以不会触发依赖变化, 也就无需进行依赖收集
    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key)
    }

    // 7. 浅层响应式：直接返回原始值，不递归处理嵌套对象
    if (isShallow) {
      return res
    }

    // 8. Ref 解包逻辑（核心：数组索引访问 Ref 时不解包，其他场景解包）
    if (isRef(res)) {
      // 数组 + 整数索引 → 不解包（如 reactive([ref(1)])[0] 仍返回 Ref 实例）
      // 其他场景 → 解包（如 reactive({ a: ref(1) }).a 返回 1）
      // ref unwrapping - skip unwrap for Array + integer key. ref 解包 - 跳过数组 + 整数键的解包
      const value = targetIsArray && isIntegerKey(key) ? res : res.value

      // 只读代理：若解包后的值是对象，转为只读代理
      return isReadonly && isObject(value) ? readonly(value) : value
    }

    // 9. 嵌套对象递归代理（深度响应式核心）
    if (isObject(res)) {
      // Convert returned value into a proxy as well. we do the isObject check 同时将返回值转换为代理对象。我们进行isObject检查
      // here to avoid invalid value warning. Also need to lazy access readonly 这里是为了避免无效值警告。还需要延迟访问只读属性
      // and reactive here to avoid circular dependency. 并且在此处使用响应式编程以避免循环依赖
      return isReadonly ? readonly(res) : reactive(res)
    }

    // 10. 基础类型：直接返回原始值
    return res
  }
}

/**
 * Vue3 可修改响应式对象的 Proxy 处理器（继承自 BaseReactiveHandler）
 *
 * 核心作用：
 *  1. 扩展父类逻辑，实现可修改响应式对象的 set/deleteProperty/has/ownKeys 拦截方法；
 *  2. 处理属性修改逻辑：Ref 赋值特殊处理、浅层/深度响应式适配、新增/修改属性触发更新；
 *  3. 处理属性删除逻辑：删除成功后触发响应式更新；
 *  4. 处理存在性检查（in 操作符）和键遍历（Object.keys/for...in）的依赖收集；
 *  5. 适配数组索引操作、Ref 对象赋值等特殊场景；
 */
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow = false) {
    // 调用父类构造函数：_isReadonly = false（可修改），_isShallow = 传入的 isShallow
    super(false, isShallow)
  }

  /**
   * Proxy 的 set 拦截方法（属性赋值/修改时触发）
   *
   * 核心职责：
   *  1. 特殊场景处理：数组整数索引、Ref 对象赋值、浅层/深度响应式适配；
   *  2. 原始值处理：深度响应式下，获取旧值/新值的原始对象（toRaw）；
   *  3. Ref 赋值优化：直接修改 Ref 的 value 属性，无需替换整个 Ref；
   *  4. 新增/修改判断：区分是新增属性还是修改已有属性；
   *  5. 触发更新：根据新增/修改类型，调用 trigger 触发响应式更新；
   *
   * @param target 被代理的原始目标对象；
   * @param key 要赋值的属性名/索引；
   * @param value 要设置的新值；
   * @param receiver 代理对象本身；
   * @returns boolean 赋值是否成功（遵循 Reflect.set 的返回值规范）；
   */
  set(
    target: Record<string | symbol, unknown>,
    key: string | symbol,
    value: unknown,
    receiver: object,
  ): boolean {
    // 1. 获取旧值（原始目标对象的当前值）
    let oldValue = target[key]
    // 判断是否为“数组 + 整数索引”场景（如 arr[0] = 1）
    const isArrayWithIntegerKey = isArray(target) && isIntegerKey(key)

    // 2. 深度响应式处理（非浅层）
    if (!this._isShallow) {
      // 判断旧值是否为只读代理（避免修改只读值）
      const isOldValueReadonly = isReadonly(oldValue)

      // 新值/旧值非浅层且非只读 → 获取原始对象（避免代理嵌套）
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue) // 旧值转原始对象
        value = toRaw(value) // 新值转原始对象
      }

      // 3. Ref 赋值特殊处理（非数组整数索引 + 旧值是 Ref + 新值不是 Ref）
      if (!isArrayWithIntegerKey && isRef(oldValue) && !isRef(value)) {
        // 旧值是只读 Ref → 开发环境抛警告，返回赋值成功（避免报错）
        if (isOldValueReadonly) {
          if (__DEV__) {
            warn(
              `Set operation on key "${String(key)}" failed: target is readonly.`, // 对键“${String(key)}”的设置操作失败：目标为只读
              target[key],
            )
          }
          return true
        } else {
          // 旧值是可修改 Ref → 直接修改 Ref 的 value 属性（无需替换整个 Ref）
          // 触发依赖变更可由 Ref 决定触发
          oldValue.value = value
          return true
        }
      }
    } else {
      // in shallow mode, objects are set as-is regardless of reactive or not 在浅层模式下，无论是否响应，对象都会按原样设置
    }

    // 4. 判断属性是否已存在（区分新增/修改）
    const hadKey = isArrayWithIntegerKey
      ? Number(key) < target.length // 数组：索引 < 数组长度 → 已有属性（修改），否则新增
      : hasOwn(target, key) // 普通对象：通过 hasOwn 判断是否为自身属性

    // 5. 执行赋值操作（使用 Reflect.set 保证 ES 规范，处理 receiver 指向）
    // 特殊处理：若目标是 Ref，使用原始 Ref 作为 receiver，避免 this 指向错误
    const result = Reflect.set(
      target,
      key,
      value,
      isRef(target) ? target : receiver,
    )

    // 6. 触发更新：仅当 target 是 receiver 的原始对象时触发（避免原型链上的对象修改触发更新）
    // don't trigger if target is something up in the prototype chain of original 如果目标是原始原型链中的某个内容，则不触发
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        // 新增属性 → 触发 ADD 类型更新
        trigger(target, TriggerOpTypes.ADD, key, value)
      } else if (hasChanged(value, oldValue)) {
        // 修改已有属性且值变化 → 触发 SET 类型更新
        trigger(target, TriggerOpTypes.SET, key, value, oldValue)
      }
    }

    // 7. 返回赋值结果（遵循 Proxy 规范）
    return result
  }

  /**
   * Proxy 的 deleteProperty 拦截方法（删除属性时触发，如 delete obj.key）
   *
   * 核心职责：
   *  1. 判断属性是否为目标对象的自身属性；
   *  2. 执行删除操作；
   *  3. 删除成功且属性存在 → 触发 DELETE 类型更新；
   *
   * @param target 被代理的原始目标对象；
   * @param key 要删除的属性名；
   * @returns boolean 删除是否成功；
   */
  deleteProperty(
    target: Record<string | symbol, unknown>,
    key: string | symbol,
  ): boolean {
    // 1. 判断属性是否为目标对象的自身属性
    const hadKey = hasOwn(target, key)
    // 2. 获取旧值（用于 trigger 传递）
    const oldValue = target[key]
    // 3. 执行删除操作（Reflect.deleteProperty 遵循 ES 规范）
    const result = Reflect.deleteProperty(target, key)

    // 4. 删除成功且属性存在 → 触发 DELETE 类型更新
    if (result && hadKey) {
      trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue)
    }

    // 5. 返回删除结果
    return result
  }

  /**
   * Proxy 的 has 拦截方法（in 操作符触发，如 key in obj）
   * 核心职责：
   *  1. 执行存在性检查；
   *  2. 非 Symbol 内置属性 → 收集 HAS 类型依赖； --> 在新增/删除属性的时候结果就会发生变化, 所以进行依赖收集
   *
   * @param target 被代理的原始目标对象；
   * @param key 要检查的属性名；
   * @returns boolean 属性是否存在；
   */
  has(target: Record<string | symbol, unknown>, key: string | symbol): boolean {
    // 1. 执行存在性检查
    const result = Reflect.has(target, key)
    // 2. 非 Symbol 内置属性 → 收集 HAS 类型依赖（后续属性新增/删除时触发更新）
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      // 依赖收集
      track(target, TrackOpTypes.HAS, key)
    }
    return result
  }

  /**
   * Proxy 的 ownKeys 拦截方法（遍历键时触发，如 Object.keys/for...in/Object.getOwnPropertyNames）
   *
   * 核心职责：
   *  1. 收集 ITERATE 类型依赖（后续属性新增/删除/数组长度变化时触发更新）；
   *  2. 返回目标对象的自身键；
   *
   * @param target 被代理的原始目标对象；
   * @returns (string | symbol)[] 目标对象的自身键数组；
   */
  ownKeys(target: Record<string | symbol, unknown>): (string | symbol)[] {
    // 1. 收集 ITERATE 类型依赖：
    //  - 数组：跟踪 length 属性（数组长度变化触发更新）；
    //  - 普通对象：跟踪 ITERATE_KEY（属性新增/删除触发更新）；
    track(
      target,
      TrackOpTypes.ITERATE,
      isArray(target) ? 'length' : ITERATE_KEY,
    )

    // 2. 返回目标对象的自身键（遵循 ES 规范）
    return Reflect.ownKeys(target)
  }
}

/**
 * Vue3 只读响应式对象的 Proxy 处理器（继承自 BaseReactiveHandler）
 * 核心作用：
 *  1. 基于父类通用逻辑，实现只读响应式对象的核心特性：仅允许读取，禁止修改/删除属性；
 *  2. 覆写 set/deleteProperty 方法：拦截属性修改/删除操作，开发环境抛警告，生产环境静默返回成功；
 *  3. 支持浅层只读（shallowReadonly）：通过构造函数参数控制 _isShallow；
 *
 * @param isShallow 是否为浅层只读（默认 false），传递给父类的 _isShallow；
 *                 - true：浅层只读（仅第一层属性只读，嵌套对象可修改）；
 *                 - false：深度只读（所有层级属性均只读）；
 */
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow = false) {
    // 调用父类构造函数：_isReadonly = true（只读），_isShallow = 传入的 isShallow
    super(true, isShallow)
  }

  /**
   * Proxy 的 set 拦截方法（属性赋值/修改时触发）
   *
   * @param target 被代理的只读原始目标对象；
   * @param key 要赋值的属性名/索引；
   * @returns boolean 固定返回 true（遵循 Proxy 规范，避免赋值操作抛出 TypeError）；
   */
  set(target: object, key: string | symbol) {
    // 开发环境：抛警告，提示用户该对象是只读的，无法修改属性
    if (__DEV__) {
      warn(
        `Set operation on key "${String(key)}" failed: target is readonly.`, // 对键“${String(key)}”的设置操作失败：目标为只读
        target, // 附带目标对象，方便开发者定位问题
      )
    }

    // 静默返回 true，不执行实际赋值
    return true
  }

  /**
   * Proxy 的 deleteProperty 拦截方法（删除属性时触发，如 delete obj.key）
   *
   * @param target 被代理的只读原始目标对象；
   * @param key 要删除的属性名；
   * @returns boolean 固定返回 true（遵循 Proxy 规范，避免删除操作抛出 TypeError）；
   */
  deleteProperty(target: object, key: string | symbol) {
    // 开发环境：抛警告，提示用户该对象是只读的，无法删除属性
    if (__DEV__) {
      warn(
        `Delete operation on key "${String(key)}" failed: target is readonly.`, // 对键“${String(key)}”的删除操作失败：目标为只读
        target,
      )
    }
    return true
  }
}

/** Vue3 响应式系统 - 普通对象/数组的可修改响应式处理器（mutableHandlers） */
export const mutableHandlers: ProxyHandler<object> =
  /*@__PURE__*/ new MutableReactiveHandler()

/** Vue3 响应式系统 - 普通对象/数组的只读响应式处理器（mutableHandlers） */
export const readonlyHandlers: ProxyHandler<object> =
  /*@__PURE__*/ new ReadonlyReactiveHandler()

/** Vue3 响应式系统 - 普通对象/数组的可修改浅层响应式处理器（shallowReactiveHandlers） */
export const shallowReactiveHandlers: MutableReactiveHandler =
  /*@__PURE__*/ new MutableReactiveHandler(true)

// Props handlers are special in the sense that it should not unwrap top-level 道具处理程序（Props handlers）的特殊性在于，它不应解包顶层数据
// refs (in order to allow refs to be explicitly passed down), but should refs（以便明确传递 refs），但应该
// retain the reactivity of the normal readonly object. 保持正常只读对象的反应性
/** Vue3 响应式系统 - 普通对象/数组的只读浅层响应式处理器（mutableHandlers） */
export const shallowReadonlyHandlers: ReadonlyReactiveHandler =
  /*@__PURE__*/ new ReadonlyReactiveHandler(true)
