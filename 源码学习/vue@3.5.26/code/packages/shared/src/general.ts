import { makeMap } from './makeMap'

export const EMPTY_OBJ: { readonly [key: string]: any } = __DEV__
  ? Object.freeze({})
  : {}
export const EMPTY_ARR: readonly never[] = __DEV__ ? Object.freeze([]) : []

export const NOOP = (): void => {}

/**
 * Always return false.
 */
export const NO = () => false

/**
 * 检测 key 是否为 on开头的属性，如onClick/onInput
 */
export const isOn = (key: string): boolean =>
  key.charCodeAt(0) === 111 /* o */ &&
  key.charCodeAt(1) === 110 /* n */ &&
  // uppercase letter 大写字母
  (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97)

export const isModelListener = (key: string): key is `onUpdate:${string}` =>
  key.startsWith('onUpdate:')

export const extend: typeof Object.assign = Object.assign

/**
 * 从数组中移除指定元素
 * @param arr 要操作的数组
 * @param el 要从数组中移除的元素
 */
export const remove = <T>(arr: T[], el: T): void => {
  const i = arr.indexOf(el)
  if (i > -1) {
    arr.splice(i, 1)
  }
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
  val: object,
  key: string | symbol,
): key is keyof typeof val => hasOwnProperty.call(val, key)

export const isArray: typeof Array.isArray = Array.isArray
export const isMap = (val: unknown): val is Map<any, any> =>
  toTypeString(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> =>
  toTypeString(val) === '[object Set]'

export const isDate = (val: unknown): val is Date =>
  toTypeString(val) === '[object Date]'
export const isRegExp = (val: unknown): val is RegExp =>
  toTypeString(val) === '[object RegExp]'
/** 检查给定值是否为函数类型 */
export const isFunction = (val: unknown): val is Function =>
  typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

/**
 * 检查给定值是否为Promise对象
 * 判断依据是该值具有isObject或isFunction类型，并且拥有then和catch方法
 *
 * @param val - 待检查的值
 * @returns 如果val是Promise则返回true，否则返回false
 */
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return (
    (isObject(val) || isFunction(val)) &&
    isFunction((val as any).then) &&
    isFunction((val as any).catch)
  )
}

export const objectToString: typeof Object.prototype.toString =
  Object.prototype.toString
export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1)
}

export const isPlainObject = (val: unknown): val is object =>
  toTypeString(val) === '[object Object]'

export const isIntegerKey = (key: unknown): boolean =>
  isString(key) &&
  key !== 'NaN' &&
  key[0] !== '-' &&
  '' + parseInt(key, 10) === key

/**
 * Vue3 核心工具函数 - 判断【属性名是否为Vue内置的保留属性】
 * 返回值：true → 是Vue保留属性，由Vue内部单独处理，不绑定为DOM原生属性；
 *        false → 是普通业务属性，需要通过hostPatchProp绑定到元素的真实DOM上。
 * 实现方式：通过Vue内置的makeMap工具生成哈希表查询函数，查询效率O(1)，极致高性能；
 * 编译优化：/*@__PURE__*\/ 标记为纯函数，无副作用，支持打包工具tree-shaking和预编译优化；
 * 核心细节：拼接字符串开头加逗号，是为了让空字符串""也能被正确匹配为保留属性；
 * 调用场景：mountElement/patchElement的props遍历环节，过滤保留属性，避免误挂载。
 */
export const isReservedProp: (key: string) => boolean = /*@__PURE__*/ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ',key,ref,ref_for,ref_key,' +
    'onVnodeBeforeMount,onVnodeMounted,' +
    'onVnodeBeforeUpdate,onVnodeUpdated,' +
    'onVnodeBeforeUnmount,onVnodeUnmounted',
)

export const isBuiltInDirective: (key: string) => boolean =
  /*@__PURE__*/ makeMap(
    'bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo',
  )

/**
 * 缓存字符串处理函数的结果，避免重复计算
 * 对于相同的输入字符串，直接从缓存中返回之前计算的结果
 *
 * @param fn - 需要被缓存的字符串处理函数，接收一个字符串参数并返回处理后的字符串
 * @returns 返回一个具有相同签名的函数，但带有缓存功能
 */
const cacheStringFunction = <T extends (str: string) => string>(fn: T): T => {
  // 创建一个空对象作为缓存存储，使用Record<string, string>类型定义键值对
  const cache: Record<string, string> = Object.create(null)
  // 返回一个新的函数，该函数首先检查缓存中是否已有结果，如果没有则调用原函数并将结果存入缓存
  return ((str: string) => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }) as T
}

const camelizeRE = /-\w/g
/**
 * 将连字符格式的字符串转换为驼峰命名格式
 * 例如: 'foo-bar' => 'fooBar', 'foo-bar-baz' => 'fooBarBaz'
 *
 * @param str - 需要进行驼峰化的字符串，通常是以连字符分隔的字符串
 * @returns 返回转换为驼峰命名格式的字符串
 * @private
 */
export const camelize: (str: string) => string = cacheStringFunction(
  (str: string): string => {
    return str.replace(camelizeRE, c => c.slice(1).toUpperCase())
  },
)

const hyphenateRE = /\B([A-Z])/g
/**
 * @private
 */
export const hyphenate: (str: string) => string = cacheStringFunction(
  (str: string) => str.replace(hyphenateRE, '-$1').toLowerCase(),
)

/**
 * @private
 */
export const capitalize: <T extends string>(str: T) => Capitalize<T> =
  cacheStringFunction(<T extends string>(str: T) => {
    return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>
  })

/**
 * @private
 */
export const toHandlerKey: <T extends string>(
  str: T,
) => T extends '' ? '' : `on${Capitalize<T>}` = cacheStringFunction(
  <T extends string>(str: T) => {
    const s = str ? `on${capitalize(str)}` : ``
    return s as T extends '' ? '' : `on${Capitalize<T>}`
  },
)

// compare whether a value has changed, accounting for NaN.
export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)

export const invokeArrayFns = (fns: Function[], ...arg: any[]): void => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](...arg)
  }
}

/**
 * Vue3 核心底层工具函数 - 封装原生 Object.defineProperty API 的极简通用版
 * 核心职责：给指定对象定义一个属性，统一配置属性描述符，简化重复的属性定义代码；
 * 核心默认规则：定义的属性【默认只读、不可枚举、可配置】，仅可写性(writable)支持外部传参配置；
 * 设计价值：Vue源码内部统一用该函数定义「私有/内部属性」，避免各处重复编写Object.defineProperty的完整配置，减少冗余；
 *
 * @param {object} obj 要定义属性的「目标对象」(必填)，可以是任意普通对象/数组/DOM元素对象
 * @param {string | symbol} key 要定义的「属性名/属性标识」(必填)，支持字符串/ES6 Symbol，避免属性名冲突
 * @param {any} value 要给属性赋值的「属性值」(必填)，可以是任意类型：基本类型、对象、函数、VNode、组件实例等
 * @param {boolean} [writable=false] 可选配置：属性是否「可写」，默认false(只读)，true则支持修改属性值
 * @returns {void} 无返回值
 */
export const def = (
  obj: object,
  key: string | symbol,
  value: any,
  writable = false,
): void => {
  // 核心：调用ES5原生API Object.defineProperty，完成属性定义
  Object.defineProperty(obj, key, {
    configurable: true, // 属性描述符：可配置 → 允许后续删除该属性/重新定义该属性的描述符
    enumerable: false, // 属性描述符：不可枚举 → 核心！该属性不会出现在for...in/Object.keys/Object.values的遍历结果中
    writable, // 属性描述符：可写性 → 由入参控制，默认false(只读)，true则可通过 obj[key] = xxx 修改值
    value, // 属性描述符：属性值 → 赋值为传入的value参数
  })
}

/**
 * "123-foo" will be parsed to 123
 * This is used for the .number modifier in v-model
 */
export const looseToNumber = (val: any): any => {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

/**
 * Only concerns number-like strings
 * "123-foo" will be returned as-is
 */
export const toNumber = (val: any): any => {
  const n = isString(val) ? Number(val) : NaN
  return isNaN(n) ? val : n
}

// for typeof global checks without @types/node
declare var global: {}

let _globalThis: any
/**
 * 获取全局对象
 * 该函数用于在不同环境中获取全局对象，优先级为：globalThis > self > window > global
 * 如果所有可能的全局对象都不存在，则返回一个空对象
 *
 * @returns {any} 全局对象或空对象
 */
export const getGlobalThis = (): any => {
  return (
    _globalThis ||
    (_globalThis =
      typeof globalThis !== 'undefined'
        ? globalThis
        : typeof self !== 'undefined'
          ? self
          : typeof window !== 'undefined'
            ? window
            : typeof global !== 'undefined'
              ? global
              : {})
  )
}

const identRE = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/

export function genPropsAccessExp(name: string): string {
  return identRE.test(name)
    ? `__props.${name}`
    : `__props[${JSON.stringify(name)}]`
}

export function genCacheKey(source: string, options: any): string {
  return (
    source +
    JSON.stringify(options, (_, val) =>
      typeof val === 'function' ? val.toString() : val,
    )
  )
}
