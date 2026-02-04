import {
  type ComponentInternalInstance,
  DeprecationTypes,
  type Directive,
  type LegacyConfig,
  compatUtils,
  getCurrentInstance,
} from '@vue/runtime-core'
import { hyphenate, isArray } from '@vue/shared'

const systemModifiers = ['ctrl', 'shift', 'alt', 'meta'] as const
type SystemModifiers = (typeof systemModifiers)[number]
type CompatModifiers = keyof typeof keyNames

export type VOnModifiers = SystemModifiers | ModifierGuards | CompatModifiers
type KeyedEvent = KeyboardEvent | MouseEvent | TouchEvent

type ModifierGuards =
  | 'shift'
  | 'ctrl'
  | 'alt'
  | 'meta'
  | 'left'
  | 'right'
  | 'stop'
  | 'prevent'
  | 'self'
  | 'middle'
  | 'exact'

/** 如果组件 emit 使用这些 修饰符, 因为没有 Event, 所以会直接报错 */
const modifierGuards: Record<
  ModifierGuards,
  | ((e: Event) => void | boolean)
  | ((e: Event, modifiers: string[]) => void | boolean)
> = {
  stop: (e: Event) => e.stopPropagation(),
  prevent: (e: Event) => e.preventDefault(),
  self: (e: Event) => e.target !== e.currentTarget,
  ctrl: (e: Event) => !(e as KeyedEvent).ctrlKey,
  shift: (e: Event) => !(e as KeyedEvent).shiftKey,
  alt: (e: Event) => !(e as KeyedEvent).altKey,
  meta: (e: Event) => !(e as KeyedEvent).metaKey,
  left: (e: Event) => 'button' in e && (e as MouseEvent).button !== 0,
  middle: (e: Event) => 'button' in e && (e as MouseEvent).button !== 1,
  right: (e: Event) => 'button' in e && (e as MouseEvent).button !== 2,
  exact: (e, modifiers) =>
    systemModifiers.some(m => (e as any)[`${m}Key`] && !modifiers.includes(m)),
}

/**
 * @private
 */
/**
 * 为事件处理函数绑定修饰符逻辑，返回包装后的函数，自带缓存避免重复创建
 *
 *
 * @template T - 原始事件处理函数的类型，约束为：接收Event为第一个参数，后续任意参数，返回任意值
 * @param {T & { _withMods?: { [key: string]: T } }} fn - 原始事件处理函数，扩展了可选的`_withMods`缓存属性
 *                                                        （缓存挂载到函数自身，关联函数与其修饰符包装版本）
 * @param {VOnModifiers[]} modifiers - 事件修饰符数组，如 ['stop', 'prevent']，按顺序执行守卫逻辑
 * @returns {T} 包装了修饰符守卫逻辑的事件处理函数，类型与原始函数完全一致（保证类型安全）
 */
export const withModifiers = <
  T extends (event: Event, ...args: unknown[]) => any,
>(
  fn: T & { _withMods?: { [key: string]: T } },
  modifiers: VOnModifiers[],
): T => {
  // 初始化缓存对象：优先使用函数自身已有的_withMods，无则创建空对象并挂载到fn上
  const cache = fn._withMods || (fn._withMods = {})
  // 生成缓存唯一键：将修饰符数组用`.`拼接（如 ['stop','prevent'] → 'stop.prevent'）
  const cacheKey = modifiers.join('.')

  return (
    cache[cacheKey] || // 缓存优先
    (cache[cacheKey] = ((event, ...args) => {
      // 遍历修饰符数组，按顺序执行每个修饰符对应的守卫函数
      for (let i = 0; i < modifiers.length; i++) {
        // 根据当前修饰符获取对应的守卫函数（如 'prevent' → 对应阻止默认行为的函数）
        const guard = modifierGuards[modifiers[i] as ModifierGuards]
        // 若守卫函数存在，且执行守卫后返回true → 终止后续逻辑，不执行原始事件函数
        // 守卫函数返回true代表「拦截原始函数执行」，返回void/false则代表「放行」
        if (guard && guard(event, modifiers)) return
      }

      // 所有修饰符守卫均通过（无拦截）→ 执行原始事件函数，并返回其执行结果
      return fn(event, ...args)
    }) as T)
  )
}

// Kept for 2.x compat.
// Note: IE11 compat for `spacebar` and `del` is removed for now.
const keyNames: Record<
  'esc' | 'space' | 'up' | 'left' | 'right' | 'down' | 'delete',
  string
> = {
  esc: 'escape',
  space: ' ',
  up: 'arrow-up',
  left: 'arrow-left',
  right: 'arrow-right',
  down: 'arrow-down',
  delete: 'backspace',
}

/**
 * @private
 */
/**
 * 为键盘事件处理函数添加按键修饰符功能，只允许特定按键触发处理函数
 *
 * @param fn 原始键盘事件处理函数
 * @param modifiers 修饰符数组，指定允许触发的按键名称（如 'enter', 'esc', 'arrow-up' 等）
 * @returns 经过包装的键盘事件处理函数，只有在按下指定按键时才会执行原始函数
 *
 * 该函数还支持兼容性模式，用于处理 Vue 2.x 的 keyCode 修饰符和全局配置的 keyCodes
 */
export const withKeys = <T extends (event: KeyboardEvent) => any>(
  fn: T & { _withKeys?: { [k: string]: T } },
  modifiers: string[],
): T => {
  let globalKeyCodes: LegacyConfig['keyCodes']
  let instance: ComponentInternalInstance | null = null
  if (__COMPAT__) {
    instance = getCurrentInstance()
    if (
      compatUtils.isCompatEnabled(DeprecationTypes.CONFIG_KEY_CODES, instance)
    ) {
      if (instance) {
        globalKeyCodes = (instance.appContext.config as LegacyConfig).keyCodes
      }
    }
    if (__DEV__ && modifiers.some(m => /^\d+$/.test(m))) {
      compatUtils.warnDeprecation(
        DeprecationTypes.V_ON_KEYCODE_MODIFIER,
        instance,
      )
    }
  }

  const cache: { [k: string]: T } = fn._withKeys || (fn._withKeys = {})
  const cacheKey = modifiers.join('.')

  return (
    cache[cacheKey] ||
    (cache[cacheKey] = (event => {
      if (!('key' in event)) {
        return
      }

      const eventKey = hyphenate(event.key)
      if (
        modifiers.some(
          k =>
            k === eventKey ||
            keyNames[k as unknown as CompatModifiers] === eventKey,
        )
      ) {
        return fn(event)
      }

      if (__COMPAT__) {
        const keyCode = String(event.keyCode)
        if (
          compatUtils.isCompatEnabled(
            DeprecationTypes.V_ON_KEYCODE_MODIFIER,
            instance,
          ) &&
          modifiers.some(mod => mod == keyCode)
        ) {
          return fn(event)
        }
        if (globalKeyCodes) {
          for (const mod of modifiers) {
            const codes = globalKeyCodes[mod]
            if (codes) {
              const matches = isArray(codes)
                ? codes.some(code => String(code) === keyCode)
                : String(codes) === keyCode
              if (matches) {
                return fn(event)
              }
            }
          }
        }
      }
    }) as T)
  )
}

export type VOnDirective = Directive<any, any, VOnModifiers>
