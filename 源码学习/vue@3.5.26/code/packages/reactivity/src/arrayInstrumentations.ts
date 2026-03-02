import { TrackOpTypes } from './constants'
import { endBatch, pauseTracking, resetTracking, startBatch } from './effect'
import {
  isProxy,
  isReactive,
  isReadonly,
  isShallow,
  toRaw,
  toReactive,
  toReadonly,
} from './reactive'
import { ARRAY_ITERATE_KEY, track } from './dep'
import { isArray } from '@vue/shared'

/**
 * Track array iteration and return: 跟踪数组迭代并返回
 * - if input is reactive: a cloned raw array with reactive values 如果输入是响应式的：一个带有响应式值的克隆原始数组
 * - if input is non-reactive or shallowReactive: the original raw array 如果输入是非响应式或浅响应式的：原始的原始数组
 */
export function reactiveReadArray<T>(array: T[]): T[] {
  // 1. 提取数组的原始值（toRaw 是响应式系统核心工具，穿透代理获取原始 target）
  //    无论 array 是浅/深响应式代理，都能拿到其包装的原始数组
  const raw = toRaw(array)

  // 2. 边界判断：若原始值等于入参数组 → 说明入参是普通数组（非响应式）
  //    直接返回原始值，无需后续依赖收集和映射处理
  if (raw === array) return raw

  // 3. 依赖收集核心逻辑：仅对响应式数组触发 ARRAY_ITERATE 依赖追踪
  track(
    raw, // 原始数组（依赖收集的目标，而非代理）；
    TrackOpTypes.ITERATE, // 操作类型为“迭代/遍历”；
    ARRAY_ITERATE_KEY, // 数组迭代的专用 key（区别于普通属性 key）；
  )

  // 4. 根据响应式类型返回对应结构：
  //    - 浅响应数组（isShallow(array) 为 true）：直接返回原始数组，元素保持原始值；
  //    - 深响应数组（isShallow(array) 为 false）：原始数组每个元素通过 toReactive 转为响应式后返回；
  //    - toReactive 作用：原始值 → 响应式值（对象/数组转 reactive，基本类型返回自身）
  return isShallow(array) ? raw : raw.map(toReactive)
}

/**
 * Track array iteration and return raw array 跟踪数组迭代并返回原始数组
 */
/**
 * 跟踪数组迭代并返回原始数组
 *
 * 此函数用于在访问响应式数组时进行依赖跟踪，确保在使用浅层响应式数组时能够正确追踪到迭代操作，
 * 同时返回原始数组以保持性能。
 *
 * @template T 数组元素的类型
 * @param {T[]} arr 输入的数组，可能为响应式或非响应式数组
 * @returns {T[]} 返回经过 toRaw 处理后的原始数组
 */
export function shallowReadArray<T>(arr: T[]): T[] {
  track((arr = toRaw(arr)), TrackOpTypes.ITERATE, ARRAY_ITERATE_KEY)
  return arr
}

/**
 * 将目标项转换为与目标相同类型的包装对象
 * 如果目标是只读的，则将项转换为只读类型；否则将项转换为响应式类型
 *
 * @param target - 目标对象，用于判断需要将item转换为何种类型
 * @param item - 需要被转换的对象
 * @returns 转换后的对象，如果target是只读的则返回只读对象，否则返回响应式对象
 */
function toWrapped(target: unknown, item: unknown) {
  if (isReadonly(target)) {
    return isReactive(target) ? toReadonly(toReactive(item)) : toReadonly(item)
  }
  return toReactive(item)
}

/**
 * Vue3 响应式系统核心：数组方法拦截器集合（arrayInstrumentations）
 *
 * 核心作用：
 *    1. 重写原生数组方法，保证响应式数组调用方法时的响应式正确性；
 *    2. 区分“读取类方法”（如 forEach/map）和“修改类方法”（如 push/splice）：
 *       - 读取类：触发依赖收集，返回响应式值；
 *       - 修改类：避免不必要的依赖收集，触发依赖更新；
 *    3. 处理数组方法的参数/返回值：原始值读取、响应式值返回，兼容原生行为；
 *    4. 覆盖所有常用数组方法（遍历/查找/修改/转换），保证功能完整性；
 *
 */
export const arrayInstrumentations: Record<string | symbol, Function> = <any>{
  // 核心配置：取消原型链继承，避免污染原生数组原型
  __proto__: null,

  /**
   * 拦截数组的 Symbol.iterator 迭代器（for...of 循环触发）
   *
   * @returns 包装后的迭代器，遍历项返回响应式值
   */
  [Symbol.iterator]() {
    return iterator(this, Symbol.iterator, item => toWrapped(this, item))
  },

  /**
   * 拦截 concat 方法：拼接数组时读取原始值，避免不必要的依赖收集
   *
   * @param args 拼接的参数列表
   * @returns 拼接后的新数组（原始值拼接，保证原生行为）
   */
  concat(...args: unknown[]) {
    // 1. reactiveReadArray(this)：读取响应式数组的原始值（不触发依赖收集）
    // 2. 遍历参数：若参数是数组 → 读取其原始值；非数组 → 直接使用
    // 3. 调用原生 concat 方法，返回拼接结果
    return reactiveReadArray(this).concat(
      ...args.map(x => (isArray(x) ? reactiveReadArray(x) : x)),
    )
  },

  /**
   * 拦截 entries 方法：返回 [索引, 值] 迭代器，值包装为响应式
   *
   * @returns 包装后的迭代器，值项为响应式
   */
  entries() {
    return iterator(this, 'entries', (value: [number, unknown]) => {
      // entries 返回 [index, value]，仅将 value 包装为响应式
      value[1] = toWrapped(this, value[1])
      return value
    })
  },

  /**
   * 拦截 every 方法：测试数组所有元素是否满足回调条件
   *
   * @param fn 回调函数 (item, index, array) => boolean
   * @param thisArg 回调函数的 this 指向
   * @returns 布尔值（是否所有元素满足条件）
   */
  every(
    fn: (item: unknown, index: number, array: unknown[]) => unknown,
    thisArg?: unknown,
  ) {
    return apply(this, 'every', fn, thisArg, undefined, arguments)
  },

  /**
   * 拦截 filter 方法：过滤出满足条件的元素，返回响应式新数组
   *
   * @param fn 过滤回调 (item, index, array) => boolean
   * @param thisArg 回调 this 指向
   * @returns 过滤后的新数组（元素为响应式）
   */
  filter(
    fn: (item: unknown, index: number, array: unknown[]) => unknown,
    thisArg?: unknown,
  ) {
    return apply(
      this,
      'filter',
      fn,
      thisArg,
      // 返回值转换：将过滤结果的每个元素包装为响应式
      v => v.map((item: unknown) => toWrapped(this, item)),
      arguments,
    )
  },

  /**
   * 拦截 find 方法：查找第一个满足条件的元素，返回响应式值
   *
   * @param fn 查找回调 (item, index, array) => boolean
   * @param thisArg 回调 this 指向
   * @returns 找到的元素（响应式）或 undefined
   */
  find(
    fn: (item: unknown, index: number, array: unknown[]) => boolean,
    thisArg?: unknown,
  ) {
    return apply(
      this,
      'find',
      fn,
      thisArg,
      // 返回值转换：将找到的元素包装为响应式
      item => toWrapped(this, item),
      arguments,
    )
  },

  /**
   * 拦截 findIndex 方法：查找第一个满足条件的元素索引
   * @param fn 查找回调 (item, index, array) => boolean
   * @param thisArg 回调 this 指向
   * @returns 元素索引（-1 表示未找到）
   */
  findIndex(
    fn: (item: unknown, index: number, array: unknown[]) => boolean,
    thisArg?: unknown,
  ) {
    return apply(this, 'findIndex', fn, thisArg, undefined, arguments)
  },

  /**
   * 拦截 findLast 方法：从后往前查找第一个满足条件的元素，返回响应式值
   * @param fn 查找回调 (item, index, array) => boolean
   * @param thisArg 回调 this 指向
   * @returns 找到的元素（响应式）或 undefined
   */
  findLast(
    fn: (item: unknown, index: number, array: unknown[]) => boolean,
    thisArg?: unknown,
  ) {
    return apply(
      this,
      'findLast',
      fn,
      thisArg,
      // 返回值转换：将找到的元素包装为响应式
      item => toWrapped(this, item),
      arguments,
    )
  },

  /**
   * 拦截 findLastIndex 方法：从后往前查找第一个满足条件的元素索引
   * @param fn 查找回调 (item, index, array) => boolean
   * @param thisArg 回调 this 指向
   * @returns 元素索引（-1 表示未找到）
   */
  findLastIndex(
    fn: (item: unknown, index: number, array: unknown[]) => boolean,
    thisArg?: unknown,
  ) {
    return apply(this, 'findLastIndex', fn, thisArg, undefined, arguments)
  },

  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement flat、flatMap 可以从 ARRAY_ITERATE 中受益，但实现起来并不简单

  /**
   * 拦截 forEach 方法：遍历数组所有元素，执行回调
   *
   * @param fn 遍历回调 (item, index, array) => void
   * @param thisArg 回调 this 指向
   * @returns void
   */
  forEach(
    fn: (item: unknown, index: number, array: unknown[]) => unknown,
    thisArg?: unknown,
  ) {
    return apply(this, 'forEach', fn, thisArg, undefined, arguments)
  },

  /**
   * 拦截 includes 方法：判断数组是否包含指定元素
   *
   * @param args 参数列表（value, fromIndex?）
   * @returns 布尔值（是否包含）
   */
  includes(...args: unknown[]) {
    return searchProxy(this, 'includes', args)
  },

  /**
   * 拦截 indexOf 方法：查找元素的第一个索引
   *
   * @param args 参数列表（value, fromIndex?）
   * @returns 元素索引（-1 表示未找到）
   */
  indexOf(...args: unknown[]) {
    return searchProxy(this, 'indexOf', args)
  },

  /**
   * 拦截 join 方法：将数组元素拼接为字符串
   * @param separator 分隔符（默认 ','）
   * @returns 拼接后的字符串
   */
  join(separator?: string) {
    return reactiveReadArray(this).join(separator)
  },

  // keys() iterator only reads `length`, no optimization required keys() 迭代器只读取 `length`，不需要优化
  /**
   * 拦截 lastIndexOf 方法：查找元素的最后一个索引
   *
   * @param args 参数列表（value, fromIndex?）
   * @returns 元素索引（-1 表示未找到）
   */
  lastIndexOf(...args: unknown[]) {
    return searchProxy(this, 'lastIndexOf', args)
  },

  /**
   * 拦截 map 方法：遍历数组，返回回调处理后的新数组
   *
   * @param fn 映射回调 (item, index, array) => unknown
   * @param thisArg 回调 this 指向
   * @returns 映射后的新数组
   */
  map(
    fn: (item: unknown, index: number, array: unknown[]) => unknown,
    thisArg?: unknown,
  ) {
    return apply(this, 'map', fn, thisArg, undefined, arguments)
  },

  /**
   * 拦截 pop 方法：删除并返回数组最后一个元素
   *
   * @returns 被删除的元素（原始值）
   */
  pop() {
    return noTracking(this, 'pop')
  },

  /**
   * 拦截 push 方法：向数组末尾添加元素
   *
   * @param args 待添加的元素列表
   * @returns 添加后的数组长度
   */
  push(...args: unknown[]) {
    return noTracking(this, 'push', args)
  },

  /**
   * 拦截 reduce 方法：从左到右归约数组为单个值
   *
   * @param fn 归约回调 (acc, item, index, array) => unknown
   * @param args 额外参数（初始值 init?）
   * @returns 归约后的结果
   */
  reduce(
    fn: (
      acc: unknown,
      item: unknown,
      index: number,
      array: unknown[],
    ) => unknown,
    ...args: unknown[]
  ) {
    return reduce(this, 'reduce', fn, args)
  },

  /**
   * 拦截 reduceRight 方法：从右到左归约数组为单个值
   *
   * @param fn 归约回调 (acc, item, index, array) => unknown
   * @param args 额外参数（初始值 init?）
   * @returns 归约后的结果
   */
  reduceRight(
    fn: (
      acc: unknown,
      item: unknown,
      index: number,
      array: unknown[],
    ) => unknown,
    ...args: unknown[]
  ) {
    return reduce(this, 'reduceRight', fn, args)
  },

  /**
   * 拦截 shift 方法：删除并返回数组第一个元素
   * @returns 被删除的元素（原始值）
   */
  shift() {
    return noTracking(this, 'shift')
  },

  // slice could use ARRAY_ITERATE but also seems to beg for range tracking slice 可以使用 ARRAY_ITERATE 但似乎也需要范围跟踪

  /**
   * 拦截 some 方法：测试数组是否有至少一个元素满足回调条件
   *
   * @param fn 测试回调 (item, index, array) => boolean
   * @param thisArg 回调 this 指向
   * @returns 布尔值（是否有元素满足条件）
   */
  some(
    fn: (item: unknown, index: number, array: unknown[]) => unknown,
    thisArg?: unknown,
  ) {
    return apply(this, 'some', fn, thisArg, undefined, arguments)
  },

  /**
   * 拦截 splice 方法：删除/添加/替换数组元素
   *
   * @param args 参数列表（start, deleteCount?, ...items?）
   * @returns 被删除的元素数组（原始值）
   */
  splice(...args: unknown[]) {
    return noTracking(this, 'splice', args)
  },

  /**
   * 拦截 toReversed 方法：返回反转后的新数组（原始值）
   *
   * @returns 反转后的新数组
   */
  toReversed() {
    // @ts-expect-error user code may run in es2016+
    return reactiveReadArray(this).toReversed()
  },

  /**
   * 拦截 toSorted 方法：返回排序后的新数组（原始值）
   *
   * @param comparer 排序比较函数 (a, b) => number
   * @returns 排序后的新数组
   */
  toSorted(comparer?: (a: unknown, b: unknown) => number) {
    // @ts-expect-error user code may run in es2016+
    return reactiveReadArray(this).toSorted(comparer)
  },

  /**
   * 拦截 toSpliced 方法：返回 splice 后的新数组（原始值）
   *
   * @param args splice 参数列表
   * @returns 新数组
   */
  toSpliced(...args: unknown[]) {
    // @ts-expect-error user code may run in es2016+
    return (reactiveReadArray(this).toSpliced as any)(...args)
  },

  /**
   * 拦截 unshift 方法：向数组开头添加元素
   *
   * @param args 待添加的元素列表
   * @returns 添加后的数组长度
   */
  unshift(...args: unknown[]) {
    return noTracking(this, 'unshift', args)
  },

  /**
   * 拦截 values 方法：返回数组值的迭代器，值为响应式
   *
   * @returns 包装后的迭代器
   */
  values() {
    return iterator(this, 'values', item => toWrapped(this, item))
  },
}

// instrument iterators to take ARRAY_ITERATE dependency 仪器迭代器采用 ARRAY_ITERATE 依赖项
/**
 * Vue3 响应式系统核心工具函数：包装数组迭代器方法（iterator）
 *
 * 核心作用：
 *    1. 依赖收集：为数组迭代器添加 ARRAY_ITERATE 依赖追踪（简化版，适配多数场景）；
 *    2. 迭代器包装：重写迭代器的 next() 方法，将遍历值包装为响应式；
 *    3. 行为兼容：保证迭代器的原生行为（如 done/value 规范），仅增强响应式能力；
 *    4. 浅响应适配：浅响应数组（shallow）不包装值，仅处理深响应数组；
 *
 * 设计妥协说明（核心注释翻译）：
 *    - 此处收集 ARRAY_ITERATE 依赖并非严格等价于在代理数组上调用 iterate；
 *    - 创建迭代器本身不会访问数组属性，仅当调用 .next() 时才会访问 length 和索引；
 *    - 极端场景：迭代器可能在一个 effect 作用域创建、另一个作用域部分遍历、第三个作用域继续遍历；
 *    - 但由于 JS 迭代器只能读取一次，这种场景不常见，因此该依赖追踪的简化方案是可接受的；
 *
 * @param self 响应式数组实例（代理对象）；
 * @param method 数组迭代器方法名（如 Symbol.iterator/entries/values）；
 * @param wrapValue 值包装函数：将迭代器返回的原始值转换为响应式值；
 * @returns 包装后的迭代器（兼容原生 IterableIterator 规范，增强响应式能力）；
 */
function iterator(
  self: unknown[],
  method: keyof Array<unknown>,
  wrapValue: (value: any) => unknown,
) {
  // note that taking ARRAY_ITERATE dependency here is not strictly equivalent 注意，此处引入ARRAY_ITERATE依赖并不完全等效
  // to calling iterate on the proxied array. 对代理数组调用 iterate 方法
  // creating the iterator does not access any array property: 创建迭代器并不会访问任何数组属性:
  // it is only when .next() is called that length and indexes are accessed.  只有在调用 .next() 时，才会访问 length 和索引。
  // pushed to the extreme, an iterator could be created in one effect scope, 推到极端情况，一个迭代器可以在一个作用域内创建
  // partially iterated in another, then iterated more in yet another. 在另一个中部分迭代，然后在另一个中进一步迭代
  // given that JS iterator can only be read once, this doesn't seem like 鉴于JavaScript迭代器只能读取一次，这似乎不太可能
  // a plausible use-case, so this tracking simplification seems ok. 这是一个合理的用例，因此这种跟踪简化似乎是可行的

  // 1. 读取响应式数组的浅原始值（shallowReadArray）：
  //    - 浅读取：仅获取数组的原始引用，不递归读取元素；
  //    - 目的：避免创建迭代器时触发不必要的依赖收集，仅在 next() 时收集；
  const arr = shallowReadArray(self)

  // 2. 创建原生迭代器：
  //    - 调用原始数组的迭代器方法（如 arr[Symbol.iterator]()）；
  //    - 类型断言：迭代器需包含 _next 临时属性（后续重写 next 时使用）；
  const iter = (arr[method] as any)() as IterableIterator<unknown> & {
    _next: IterableIterator<unknown>['next']
  }

  // 3. 仅当“原始数组 ≠ 响应式数组”且“非浅响应数组”时，重写迭代器的 next() 方法：
  //    - arr !== self：说明 self 是响应式代理（原始数组 arr 是 target）；
  //    - !isShallow(self)：深响应数组才需要包装值（浅响应直接返回原始值）；
  if (arr !== self && !isShallow(self)) {
    // 3.1 缓存原生 next 方法到 _next 属性，避免重写后丢失原生逻辑；
    iter._next = iter.next

    // 3.2 重写 next() 方法：核心逻辑——包装遍历值为响应式；
    iter.next = () => {
      // 3.2.1 调用原生 next() 方法，获取迭代结果（{ value, done }）；
      const result = iter._next()

      // 3.2.2 若迭代未完成（done=false），将 value 包装为响应式；
      //        wrapValue：外部传入的包装函数（如 toWrapped，保证值的响应式）；
      if (!result.done) {
        result.value = wrapValue(result.value)
      }

      // 3.2.3 返回包装后的迭代结果，保持原生规范；
      return result
    }
  }

  // 4. 返回包装后的迭代器（原生/重写后）；
  return iter
}

// in the codebase we enforce es2016, but user code may run in environments
// higher than that
type ArrayMethods = keyof Array<any> | 'findLast' | 'findLastIndex'

const arrayProto = Array.prototype
// instrument functions that read (potentially) all items 读取（可能）所有项目的仪器功能
// to take ARRAY_ITERATE dependency 获取 ARRAY_ITERATE 依赖

/**
 * Vue3 响应式系统核心工具函数：执行数组遍历/判断类方法（apply）
 *
 * 核心作用：
 *    1. 兼容处理：区分原生数组方法和用户扩展数组方法，适配不同调用逻辑；
 *    2. 回调包装：让回调函数接收响应式值（深响应数组）或原始值（浅响应数组），保证响应式正确性；
 *    3. 返回值处理：按需将方法执行结果包装为响应式，适配浅/深响应数组场景；
 *    4. 上下文保持：保证数组方法的 this 指向、参数传递与原生行为一致；
 *
 * 典型使用场景：
 *    - 数组 every/filter/find/forEach/map/some 等方法的拦截实现（arrayInstrumentations 中）；
 *    - 需统一执行数组遍历方法并处理响应式参数/返回值的场景；
 *
 * 参数说明：
 * @param self 响应式数组实例（Proxy 代理对象）；
 * @param method 要执行的数组方法名（如 'every'/'filter'/'map'）；
 * @param fn 用户传入的回调函数 (item, index, array) => unknown；
 * @param thisArg 回调函数的 this 指向；
 * @param wrappedRetFn 可选 - 返回值包装函数：处理方法执行结果（如 filter 需包装数组元素为响应式）；
 * @param args 可选 - 原始参数列表（兼容用户扩展数组的参数不确定性）；
 * @returns 数组方法执行结果（按需包装为响应式）；
 */
function apply(
  self: unknown[],
  method: ArrayMethods,
  fn: (item: unknown, index: number, array: unknown[]) => unknown,
  thisArg?: unknown,
  wrappedRetFn?: (result: any) => unknown,
  args?: IArguments,
) {
  // 1. 读取响应式数组的浅原始值（仅获取数组本身，不递归解包元素）
  //    shallowReadArray：避免读取时触发不必要的依赖收集，仅返回原始数组引用
  const arr = shallowReadArray(self)

  // 2. 判断是否需要包装值：
  //    - arr !== self → self 是响应式代理（非原始数组）；
  //    - !isShallow(self) → 深响应数组（浅响应无需包装元素）；
  //    满足以上两个条件 → 需要将回调参数/返回值包装为响应式
  const needsWrap = arr !== self && !isShallow(self)
  // 3. 获取原始数组的方法引用（如 arr.every/arr.filter）
  // @ts-expect-error our code is limited to es2016 but user code is not 我们的代码仅限于 es2016 但用户代码不是
  const methodFn = arr[method]

  // ====================== 兼容用户扩展数组逻辑（#11759 修复） ======================
  // 核心逻辑：若当前数组方法不是原生 Array.prototype 上的方法 → 说明是用户扩展的 Array 子类方法
  // 此时参数顺序/类型未知，跳过浅读取处理，直接调用 apply 保证兼容性

  // #11759
  // If the method being called is from a user-extended Array, the arguments will be unknown 如果正在调用的方法来自用户扩展的Array，则参数将为未知
  // (unknown order and unknown parameter types). In this case, we skip the shallowReadArray （未知顺序和未知参数类型）。在这种情况下，我们跳过shallowReadArray
  // handling and directly call apply with self. 处理并直接调用带有 self 的 apply 方法
  if (methodFn !== arrayProto[method as any]) {
    // 3.1 直接调用扩展方法：this 绑定到响应式数组 self，参数使用原始 args
    const result = methodFn.apply(self, args)
    // 3.2 按需包装返回值：深响应数组 → 包装为响应式；浅响应/非响应式 → 返回原始结果
    return needsWrap ? toReactive(result) : result
  }

  // 4. 初始化包装后的回调函数（默认使用用户传入的原始 fn）
  let wrappedFn = fn
  // 5. 仅当 self 是响应式代理时（arr !== self），包装回调函数
  if (arr !== self) {
    // 5.1 深响应数组（needsWrap=true）→ 包装回调参数为响应式
    if (needsWrap) {
      wrappedFn = function (this: unknown, item, index) {
        // 核心：调用原始回调时，将 item 包装为响应式值（toWrapped），array 参数绑定为响应式数组 self
        //      this 绑定为用户指定的 thisArg，保证回调上下文一致
        return fn.call(this, toWrapped(self, item), index, self)
      }
    }
    // 5.2 浅响应数组（needsWrap=false）且回调需要第三个参数（array）→ 修正 array 参数为响应式 self
    else if (fn.length > 2) {
      wrappedFn = function (this: unknown, item, index) {
        // 核心：item 保持原始值（浅响应），但 array 参数绑定为响应式数组 self（而非原始 arr）
        //      保证回调中访问 array 时能触发依赖收集
        return fn.call(this, item, index, self)
      }
    }
  }

  // 6. 执行原生数组方法：
  //    - this 绑定到原始数组 arr（保证方法原生行为）；
  //    - 参数为包装后的回调 wrappedFn + 用户指定的 thisArg；
  const result = methodFn.call(arr, wrappedFn, thisArg)

  // 7. 处理返回值：
  //    - 深响应数组 + 有返回值包装函数 → 调用 wrappedRetFn 包装结果；
  //    - 其他场景 → 返回原始结果；
  return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result
}

// instrument reduce and reduceRight to take ARRAY_ITERATE dependency reduce和reduceRight 采取 ARRAY_ITERATE依赖
/**
 * Vue3 响应式系统核心工具函数：执行数组归约类方法（reduce/reduceRight）
 *
 * 核心作用：
 *    1. 响应式适配：
 *       - 深响应数组：归约回调接收响应式的元素值，保证归约过程中能触发依赖收集；
 *       - 浅响应数组：仅修正回调的 array 参数为响应式代理，元素保持原始值；
 *    2. 行为兼容：保证 reduce/reduceRight 的参数传递、this 指向、返回值与原生一致；
 *    3. 性能优化：基于浅读取的原始数组执行方法，避免不必要的依赖收集；
 *
 * 解决的核心问题：
 *  - 归约回调中访问的数组元素需是响应式（深响应），且 array 参数需指向响应式代理而非原始数组；
 *  - 例：reactive([1,2,3]).reduce((acc, item) => acc + item) → item 是响应式值，能触发依赖收集；
 *
 * 参数说明：
 * @param self 响应式数组实例（Proxy 代理对象）；
 * @param method 归约方法名（'reduce'/'reduceRight'）；
 * @param fn 用户传入的归约回调函数 (acc, item, index, array) => unknown；
 * @param args 归约方法的额外参数（如初始值 init，格式：[init] 或 []）；
 * @returns 归约方法执行结果（任意类型，取决于回调的返回值）；
 */
function reduce(
  self: unknown[],
  method: keyof Array<any>,
  fn: (acc: unknown, item: unknown, index: number, array: unknown[]) => unknown,
  args: unknown[],
) {
  // 1. 读取响应式数组的浅原始值（shallowReadArray）：
  //    - 仅获取数组本身的原始引用，不递归解包元素；
  //    - 目的：基于原始数组执行归约方法，保证原生行为，同时避免读取时触发不必要的依赖收集；
  //    - 区别 toRaw：shallowReadArray 会触发 ARRAY_ITERATE 依赖收集，适配归约的迭代特性；
  const arr = shallowReadArray(self)
  // 2. 初始化包装后的回调函数（默认使用用户传入的原始 fn）
  let wrappedFn = fn

  // 3. 仅当 self 是响应式代理时（arr !== self），包装回调函数
  if (arr !== self) {
    // 3.1 深响应数组（!isShallow(self)）→ 包装回调的 item 为响应式值
    if (!isShallow(self)) {
      wrappedFn = function (this: unknown, acc, item, index) {
        // 核心逻辑：
        // - this 绑定为用户指定的上下文（保证回调 this 指向与原生一致）；
        // - item 经过 toWrapped 包装为响应式值（深响应场景）；
        // - array 参数绑定为响应式代理 self（而非原始数组 arr）；
        // - acc/index 保持原始值，符合归约方法的原生参数规则；
        return fn.call(this, acc, toWrapped(self, item), index, self)
      }
    }
    // 3.2 浅响应数组（isShallow(self)）且回调需要第四个参数（array）→ 修正 array 参数
    else if (fn.length > 3) {
      wrappedFn = function (this: unknown, acc, item, index) {
        // 核心逻辑：
        // - item 保持原始值（浅响应场景，元素不做响应式包装）；
        // - array 参数绑定为响应式代理 self（保证回调中访问 array 能触发依赖收集）；
        // - 仅当回调声明需要第四个参数（fn.length > 3）时才包装，避免无效操作；
        return fn.call(this, acc, item, index, self)
      }
    }
  }

  // 4. 执行归约方法并返回结果：
  //    - arr[method]：获取原始数组的归约方法（reduce/reduceRight）；
  //    - 调用参数：包装后的回调 wrappedFn + 用户传入的额外参数 args（如初始值）；
  return (arr[method] as any)(wrappedFn, ...args)
}

// instrument identity-sensitive methods to account for reactive proxies 仪器身份敏感的方法来解释反应性代理
/**
 * Vue3 响应式系统核心工具函数：数组查找类方法拦截器（searchProxy）
 *
 * 核心作用：
 *    1. 依赖收集：触发数组 ARRAY_ITERATE 依赖追踪，保证查找方法能响应数组变化；
 *    2. 双次查找兼容：
 *       - 第一次：用原始参数（可能是响应式值）执行查找；
 *       - 第二次：若第一次失败且参数是响应式代理 → 用原始值重新查找；
 *    3. 行为兼容：保证 includes/indexOf/lastIndexOf 的返回值与原生一致；
 *
 * 解决的核心问题：
 *    - 响应式数组中存储的是原始值，但用户传入查找的是响应式代理值 → 原生查找会失败（=== 不相等）；
 *    - 例：const arr = reactive([{a:1}]), arr.includes(reactive({a:1})) → 原生返回 false，该函数修正为 true；
 *
 * @param self 响应式数组实例（Proxy 代理对象）；
 * @param method 查找类方法名（includes/indexOf/lastIndexOf）；
 * @param args 查找方法的参数列表（如 [value, fromIndex]）；
 * @returns 查找结果（boolean/number）：
 *          - includes → boolean；
 *          - indexOf/lastIndexOf → 索引（-1 表示未找到）；
 */
function searchProxy(
  self: unknown[],
  method: keyof Array<any>,
  args: unknown[],
) {
  // 1. 提取响应式数组的原始值（toRaw 穿透 Proxy 代理，获取原始数组 target）
  //    后续查找操作基于原始数组执行，保证原生行为
  const arr = toRaw(self) as any

  // 2. 触发依赖收集：为数组添加 ARRAY_ITERATE 迭代依赖
  //    - track 参数：原始数组 arr + 操作类型 ITERATE + 迭代专用 key
  //    - 作用：当数组元素增删/修改时，依赖该查找方法的副作用会触发更新
  track(arr, TrackOpTypes.ITERATE, ARRAY_ITERATE_KEY)

  // we run the method using the original args first (which may be reactive) 我们首先使用原始参数运行该方法（这可能是反应性的）

  // 3. 第一次查找：使用用户传入的原始参数（可能是响应式值）执行原生查找方法
  const res = arr[method](...args)

  // if that didn't work, run it again using raw values. 如果这不起作用，请使用原始值再次运行它。
  // 4. 二次查找兼容逻辑：修复“响应式值查找原始数组”匹配失败的问题
  if (
    (res === -1 || // indexOf/lastIndexOf 未找到
      res === false) && // includes 未找到
    isProxy(args[0]) // 第一个参数（查找值）是响应式代理；
  ) {
    // 4.1 将查找参数转为原始值（穿透响应式代理）
    args[0] = toRaw(args[0])
    // 4.2 用原始值重新执行查找，返回修正后的结果
    return arr[method](...args)
  }

  // 5. 返回查找结果：
  return res
}

// instrument length-altering mutation methods to avoid length being tracked 仪器改变长度的突变方法以避免长度被跟踪
// which leads to infinite loops in some cases (#2137) 在某些情况下会导致无限循环 (#2137)

/**
 * Vue3 响应式系统核心工具函数：无追踪执行数组修改方法（noTracking）
 *
 * 核心作用：
 *    1. 禁用依赖收集：执行数组修改方法时暂停 track 逻辑，避免收集无效依赖；
 *    2. 批量更新：开启批量更新模式，修改完成后统一触发更新，减少更新次数；
 *    3. 原始值执行：基于响应式数组的原始 target 执行修改方法，保证原生行为；
 *    4. 恢复状态：执行完成后恢复依赖收集和批量更新状态，避免影响后续逻辑；
 *
 * 典型使用场景：
 *    - 数组 push/pop/shift/unshift/splice 等修改类方法的拦截实现（arrayInstrumentations 中）；
 *    - 需执行数组修改操作且无需收集依赖、希望批量触发更新的场景；
 *
 * @param self 响应式数组实例（Proxy 代理对象）；
 * @param method 要执行的数组修改方法名（如 'push'/'pop'/'splice'）；
 * @param args 方法参数列表（默认空数组，如 push 的参数、splice 的参数）；
 * @returns 数组方法执行结果（如 push 返回新长度、pop 返回被删除元素）；
 */
function noTracking(
  self: unknown[],
  method: keyof Array<any>,
  args: unknown[] = [],
) {
  // 1. 暂停依赖收集（pauseTracking）：
  //    - 禁用 track 函数，执行后续操作时不会收集任何新的依赖；
  //    - 原因：数组修改操作（如 push）是“写操作”，无需收集依赖，仅需触发更新；
  pauseTracking()

  // 2. 开启批量更新（startBatch）：
  //    - 进入批量更新模式，期间触发的 trigger 不会立即执行副作用，而是缓存起来；
  //    - 优化：避免修改数组时多次触发更新（如 splice 同时删除+添加元素，仅触发一次更新）；
  startBatch()

  // 3. 执行数组修改方法：
  //    3.1 toRaw(self)：提取响应式数组的原始 target（穿透 Proxy 代理）；
  //    3.2 [method]：获取原始数组的修改方法（如 push/splice）；
  //    3.3 apply(self, args)：绑定 this 为响应式数组 self，传入参数执行方法；
  //        - 为什么 this 绑定 self（代理）而非原始数组？
  //          → 保证方法执行时的 this 指向与用户调用时一致，兼容自定义 Array 子类场景；
  //    重要: **当调用 pop/push/..., length 会变化, 会自动触发 set 拦截器的, 从而响应变化**
  const res = (toRaw(self) as any)[method].apply(self, args)

  // 4. 结束批量更新（endBatch）：
  //    - 退出批量更新模式，执行所有缓存的 trigger 逻辑，统一触发副作用更新；
  endBatch()

  // 5. 恢复依赖收集（resetTracking）：
  //    - 恢复 track 函数的正常工作，保证后续操作能正常收集依赖；
  //    - 必须与 pauseTracking 配对，避免全局依赖收集状态异常
  resetTracking()

  // 6. 返回方法执行结果（与原生数组方法返回值一致）
  return res
}
