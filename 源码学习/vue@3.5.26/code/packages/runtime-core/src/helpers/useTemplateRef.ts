import { type ShallowRef, readonly, shallowRef } from '@vue/reactivity'
import { getCurrentInstance } from '../component'
import { warn } from '../warning'
import { EMPTY_OBJ } from '@vue/shared'

export const knownTemplateRefs: WeakSet<ShallowRef> = new WeakSet()

export type TemplateRef<T = unknown> = Readonly<ShallowRef<T | null>>

/**
 * Vue3 程序化创建模板 Ref 的核心函数
 * 核心作用：
 *    1. 创建与模板 ref 名称关联的浅层响应式引用（shallowRef），绑定到组件实例的 `refs` 对象；
 *    2. 实现模板 ref 的程序化管理：模板中 <div ref="key"> 会自动同步到该函数返回的 Ref；
 *    3. 开发环境校验：防止重复定义同一名称的 ref、无组件实例时的调用警告；
 *    4. 响应式优化：使用 shallowRef（模板 ref 指向 DOM/组件实例，无需深响应）；
 *    5. 开发环境保护：返回只读 Ref，避免手动修改导致与模板状态不一致；
 *
 * @param key 模板 ref 的名称（如 "inputRef"，对应模板中 <input ref="inputRef">）；
 *
 * @returns TemplateRef<T> 与模板 ref 关联的响应式引用：
 *   - 生产环境：浅层响应式 ref（shallowRef）；
 *   - 开发环境：只读的浅层响应式 ref（readonly(shallowRef)）；
 */
export function useTemplateRef<T = unknown, Keys extends string = string>(
  key: Keys,
): TemplateRef<T> {
  // 1. 获取当前活跃的组件实例（setup/render 上下文）
  const i = getCurrentInstance()
  // 2. 创建浅层响应式 ref：初始值为 null，shallowRef 避免深响应（模板 ref 是DOM/组件实例，无需深监听）
  const r = shallowRef(null)
  if (i) {
    // 初始化实例的 refs 对象：若 refs 是空对象（EMPTY_OBJ），则赋值为新空对象，否则复用现有 refs
    const refs = i.refs === EMPTY_OBJ ? (i.refs = {}) : i.refs
    let desc: PropertyDescriptor | undefined // 存储 ref 名称对应的属性描述符

    // 开发环境校验：检查该 ref 名称是否已存在且不可配置（避免重复定义导致覆盖）
    if (
      __DEV__ &&
      (desc = Object.getOwnPropertyDescriptor(refs, key)) && // 获取现有属性描述符
      !desc.configurable // 不可配置 → 无法重定义，抛警告
    ) {
      warn(`useTemplateRef('${key}') already exists.`) // useTemplateRef('${key}') 已存在
    } else {
      // 核心逻辑：给实例的 refs 对象定义 ref 名称的属性，关联到浅层响应式 ref
      Object.defineProperty(refs, key, {
        enumerable: true, // 可枚举：保证 refs[key] 能被遍历到（符合 Vue refs 规范）
        get: () => r.value, // 读取 refs[key] 时，返回浅层 ref 的值
        set: val => (r.value = val), // 模板更新 refs[key] 时，同步到浅层 ref 的值
      })
    }
  } else if (__DEV__) {
    warn(
      `useTemplateRef() is called when there is no active component ` + // useTemplateRef() 在没有活动组件时调用
        `instance to be associated with.`, // 要关联的实例
    )
  }

  // 5. 开发环境返回只读 ref（防止手动修改导致与模板状态不一致），生产环境返回原 ref
  const ret = __DEV__ ? readonly(r) : r

  // 6. 开发环境：将该 ref 加入已知模板 ref 集合（用于 Vue 内部校验/提示）
  if (__DEV__) {
    knownTemplateRefs.add(ret)
  }

  // 7. 返回与模板 ref 关联的响应式引用
  return ret
}
