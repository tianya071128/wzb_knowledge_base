// using literal strings instead of numbers so that it's easier to inspect
// debugger events

export enum TrackOpTypes {
  GET = 'get',
  HAS = 'has',
  ITERATE = 'iterate',
}

export enum TriggerOpTypes {
  SET = 'set',
  ADD = 'add',
  DELETE = 'delete',
  CLEAR = 'clear',
}

export enum ReactiveFlags {
  /**
   * 跳过响应式处理标记
   *
   * 作用：标记对象/属性无需被响应式系统处理（即 reactive/readonly 会忽略该对象）；
   *
   * 使用场景：
   *  1. Vue 内部对象（如组件实例、VNode）标记为 SKIP，避免被意外转为响应式；
   *  2. 用户自定义对象：Object.defineProperty(obj, ReactiveFlags.SKIP, { value: true })，则 reactive(obj) 直接返回原对象；
   *
   * 示例：
   *  const raw = { [ReactiveFlags.SKIP]: true }
   *  const proxy = reactive(raw)
   *  console.log(proxy === raw) // true（未创建代理，直接返回原对象）
   */
  SKIP = '__v_skip',
  /**
   * 响应式对象标记
   *
   * 作用：标记一个代理对象是由 reactive()/shallowReactive() 创建的响应式对象；
   *
   * 底层逻辑：
   *  - 创建 reactive 代理时，会在 proxy 上定义该属性，值为 true；
   *  - isReactive() 函数核心逻辑：return !!(obj && obj[ReactiveFlags.IS_REACTIVE])；
   *
   * 注意：readonly(reactive(obj)) 会同时拥有 IS_REACTIVE 和 IS_READONLY 标记；
   */
  IS_REACTIVE = '__v_isReactive',
  /**
   * 只读对象标记
   * 作用：标记一个代理对象是由 readonly()/shallowReadonly() 创建的只读对象；
   */
  IS_READONLY = '__v_isReadonly',
  /**
   * 浅层响应式标记
   *
   * 作用：标记一个代理对象是由 shallowReactive()/shallowReadonly() 创建的浅层响应式/只读对象；
   *
   * 底层逻辑：
   *  - 浅层代理仅监听对象第一层属性的变化，嵌套对象不会被转为响应式；
   *  - isShallow() 函数核心逻辑：return !!(obj && obj[ReactiveFlags.IS_SHALLOW])；
   *
   * 示例：
   *  const shallow = shallowReactive({ a: { b: 1 } })
   *  console.log(shallow[ReactiveFlags.IS_SHALLOW]) // true
   *  console.log(isReactive(shallow.a)) // false（嵌套对象未转为响应式）
   */
  IS_SHALLOW = '__v_isShallow',
  /**
   * 原始值访问标记
   * 作用：从响应式代理对象中获取原始的未代理对象（反向引用）；
   * 底层逻辑： - 创建响应式代理时，会在 proxy 上定义该属性，值为原始对象；
   * 注意：
   *  1. 仅代理对象有该属性，原始对象无；
   *  2. 修改原始对象不会触发响应式更新（需谨慎使用）；
   *
   * 示例：
   *  const raw = { a: 1 }
   *  const proxy = reactive(raw)
   *  console.log(proxy[ReactiveFlags.RAW] === raw) // true
   *  console.log(toRaw(proxy) === raw) // true
   */
  RAW = '__v_raw',
  /**
   * Ref 类型标记
   * 作用：标记一个对象是 Ref 实例（包括 ref()/computed()/shallowRef() 等）；
   *
   * 底层逻辑：
   * - 创建 Ref 时，会在 Ref 对象上定义该属性，值为 true；
   * - isRef() 函数核心逻辑：return !!(obj && obj[ReactiveFlags.IS_REF])；
   *
   * 特殊说明：
   * - Ref 对象的核心结构：{ value: 原始值, __v_isRef: true }；
   * - computed 也是特殊的 Ref，同样拥有该标记；
   *
   * 示例：
   *  const count = ref(0)
   *  console.log(count[ReactiveFlags.IS_REF]) // true
   *  console.log(isRef(count)) // true
   *  console.log(isRef(count.value)) // false（value 是原始值，非 Ref）
   */
  IS_REF = '__v_isRef',
}
