/**
 * Used during vnode props/slots normalization to check if the vnode props/slots 在vnode属性/插槽规范化过程中使用，以检查vnode属性/插槽
 * are the internal attrs / slots object of a component via 是通过组件的内部属性/插槽对象
 * `Object.getPrototypeOf`. This is more performant than defining a `Object.getPrototypeOf`。这比定义一个...（此处原文不完整，无法给出完整译文）更高效
 * non-enumerable property. (one of the optimizations done for ssr-benchmark) 不可枚举属性。（这是为ssr-benchmark所做的优化之一）
 */
const internalObjectProto = {}

export const createInternalObject = (): any =>
  Object.create(internalObjectProto)

export const isInternalObject = (obj: object): boolean =>
  Object.getPrototypeOf(obj) === internalObjectProto
