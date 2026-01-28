import {
  EMPTY_OBJ,
  type OverloadParameters,
  type UnionToIntersection,
  camelize,
  extend,
  hasOwn,
  hyphenate,
  isArray,
  isFunction,
  isObject,
  isOn,
  isString,
  looseToNumber,
  toHandlerKey,
} from '@vue/shared'
import {
  type ComponentInternalInstance,
  type ComponentOptions,
  type ConcreteComponent,
  formatComponentName,
} from './component'
import { ErrorCodes, callWithAsyncErrorHandling } from './errorHandling'
import { warn } from './warning'
import { devtoolsComponentEmit } from './devtools'
import type { AppContext } from './apiCreateApp'
import { emit as compatInstanceEmit } from './compat/instanceEventEmitter'
import {
  compatModelEmit,
  compatModelEventPrefix,
} from './compat/componentVModel'
import type { ComponentTypeEmits } from './apiSetupHelpers'
import { getModelModifiers } from './helpers/useModel'
import type { ComponentPublicInstance } from './componentPublicInstance'

export type ObjectEmitsOptions = Record<
  string,
  // emit 只支持验证函数, null 时不验证
  ((...args: any[]) => any) | null
>

export type EmitsOptions = ObjectEmitsOptions | string[]

export type EmitsToProps<T extends EmitsOptions | ComponentTypeEmits> =
  T extends string[]
    ? {
        [K in `on${Capitalize<T[number]>}`]?: (...args: any[]) => any
      }
    : T extends ObjectEmitsOptions
      ? {
          [K in string & keyof T as `on${Capitalize<K>}`]?: (
            ...args: T[K] extends (...args: infer P) => any
              ? P
              : T[K] extends null
                ? any[]
                : never
          ) => any
        }
      : {}

export type TypeEmitsToOptions<T extends ComponentTypeEmits> = {
  [K in keyof T & string]: T[K] extends [...args: infer Args]
    ? (...args: Args) => any
    : () => any
} & (T extends (...args: any[]) => any
  ? ParametersToFns<OverloadParameters<T>>
  : {})

type ParametersToFns<T extends any[]> = {
  [K in T[0]]: IsStringLiteral<K> extends true
    ? (
        ...args: T extends [e: infer E, ...args: infer P]
          ? K extends E
            ? P
            : never
          : never
      ) => any
    : never
}

type IsStringLiteral<T> = T extends string
  ? string extends T
    ? false
    : true
  : false

export type ShortEmitsToObject<E> =
  E extends Record<string, any[]>
    ? {
        [K in keyof E]: (...args: E[K]) => any
      }
    : E

export type EmitFn<
  Options = ObjectEmitsOptions,
  Event extends keyof Options = keyof Options,
> =
  Options extends Array<infer V>
    ? (event: V, ...args: any[]) => void
    : {} extends Options // if the emit is empty object (usually the default value for emit) should be converted to function
      ? (event: string, ...args: any[]) => void
      : UnionToIntersection<
          {
            [key in Event]: Options[key] extends (...args: infer Args) => any
              ? (event: key, ...args: Args) => void
              : Options[key] extends any[]
                ? (event: key, ...args: Options[key]) => void
                : (event: key, ...args: any[]) => void
          }[Event]
        >

/**
 * Vue3 内部核心函数 - 组件自定义事件的【触发总入口】
 * 核心使命：
 *   1. 安全校验：实例已卸载则终止，避免无效操作；
 *   2. 开发环境校验：
 *      - 检查事件是否在emits选项声明（未声明且非props处理器则抛警告）；
 *      - 执行事件自定义校验函数，参数不合法则抛警告；
 *      - 检测事件名大小写问题（DOM模板大小写不敏感）并警告；
 *   3. v-model修饰符处理：自动应用trim/number等修饰符到事件参数；
 *   4. 事件处理器查找：支持原事件名、驼峰、连字符（v-model专属）；
 *   5. 处理器执行：调用普通/once处理器，带异步错误捕获；
 *   6. 兼容处理：Vue2的model事件、实例emit兼容；
 *   7. 开发工具集成：上报事件触发信息到Vue Devtools；
 * 核心关联：组件内调用`this.$emit`/`<script setup>`的`emit`函数最终都会调用该方法。
 *
 *
 * @param {ComponentInternalInstance} instance 组件内部实例（事件所属的组件上下文）
 * @param {string} event 要触发的事件名（如'click'/'update:modelValue'）
 * @param {any[]} rawArgs 事件传递的原始参数（如$emit('change', 1, 2)中的[1,2]）
 * @returns {ComponentPublicInstance | null | undefined} 兼容模式下返回组件公共实例，否则无返回
 */
export function emit(
  instance: ComponentInternalInstance,
  event: string,
  ...rawArgs: any[]
): ComponentPublicInstance | null | undefined {
  // ========== 步骤1：安全校验 → 实例已卸载则直接返回（避免无效操作） ==========
  if (instance.isUnmounted) return

  // ========== 步骤2：获取组件VNode的props（事件处理器存储在props中，如onClick） ==========
  const props = instance.vnode.props || EMPTY_OBJ

  // ========== 步骤3：开发环境 - 事件合法性校验 ==========
  if (__DEV__) {
    // 解构组件实例中的emits配置和props配置
    const {
      emitsOptions, // 标准化后的emits配置（来自normalizeEmitsOptions）
      propsOptions: [propsOptions], // 标准化后的props配置（[0]是props对象）
    } = instance

    // 仅当组件声明了emitsOptions时才执行校验
    if (emitsOptions) {
      // 子步骤3.1：检查事件是否在emitsOptions中声明（排除Vue2兼容的特殊事件）
      if (
        !(event in emitsOptions) &&
        !(
          __COMPAT__ && // Vue2兼容模式
          // 生命周期钩子事件
          (event.startsWith('hook:') ||
            // Vue2 model事件前缀（如'onUpdate:modelValue'）
            event.startsWith(compatModelEventPrefix))
        )
      ) {
        // 事件未声明，且props中也无对应的处理器（如onClick）→ 抛警告
        if (!propsOptions || !(toHandlerKey(camelize(event)) in propsOptions)) {
          warn(
            `Component emitted event "${event}" but it is neither declared in ` + // 组件发出了事件“${event}”，但它没有在
              `the emits option nor as an "${toHandlerKey(camelize(event))}" prop.`, // 发出选项也不是作为“${toHandlerKey(camelize(event))}”道具
          )
        }
      }
      // 子步骤3.2：事件已声明 → 执行自定义校验函数
      else {
        const validator = emitsOptions[event] // 获取事件的自定义校验函数
        // 存在自定义校验函数
        if (isFunction(validator)) {
          const isValid = validator(...rawArgs) // 执行校验（传入事件参数）
          if (!isValid) {
            warn(
              `Invalid event arguments: event validation failed for event "${event}".`, // 事件参数无效：事件的事件验证失败
            )
          }
        }
      }
    }
  }

  // ========== 步骤4：处理v-model修饰符 → 调整事件参数 ==========
  let args = rawArgs // 最终传递给处理器的参数（初始为原始参数）

  // 子步骤4.1：判断是否是Vue2兼容的model事件监听器
  const isCompatModelListener =
    __COMPAT__ && compatModelEventPrefix + event in props

  // 子步骤4.2：判断是否是v-model的update:xxx事件（Vue3标准/model兼容）
  const isModelListener = isCompatModelListener || event.startsWith('update:')

  // 子步骤4.3：获取v-model修饰符（如.trim/.number）
  const modifiers = isCompatModelListener
    ? props.modelModifiers // Vue2兼容模式的修饰符
    : isModelListener && getModelModifiers(props, event.slice(7)) // Vue3模式：截取update:后的字段（如modelValue）

  // 子步骤4.4：应用v-model修饰符到事件参数
  // for v-model update:xxx events, apply modifiers on args 对于 v-model update:xxx 事件，在参数上应用修饰符
  if (modifiers) {
    // 修饰符.trim：所有字符串参数自动去空格
    if (modifiers.trim) {
      args = rawArgs.map(a => (isString(a) ? a.trim() : a))
    }
    // 修饰符.number：所有参数尝试转为数字（兼容非数字值）
    if (modifiers.number) {
      args = rawArgs.map(looseToNumber)
    }
  }

  // ========== 步骤5：开发工具集成 → 上报事件触发信息到Vue Devtools ==========
  if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
    devtoolsComponentEmit(instance, event, args)
  }

  // ========== 步骤6：开发环境 - 事件名大小写问题警告（DOM模板大小写不敏感） ==========
  if (__DEV__) {
    const lowerCaseEvent = event.toLowerCase() // 转为小写事件名
    // 事件名包含大写，且props中存在小写的处理器（如事件名'update:modelValue'，处理器'onupdate:modelvalue'）
    if (lowerCaseEvent !== event && props[toHandlerKey(lowerCaseEvent)]) {
      warn(
        `Event "${lowerCaseEvent}" is emitted in component ` + // 组件中触发了“${lowerCaseEvent}”事件
          `${formatComponentName(
            instance,
            instance.type,
          )} but the handler is registered for "${event}". ` + // 但是处理程序已为“${event}”注册。
          `Note that HTML attributes are case-insensitive and you cannot use ` + // 请注意，HTML属性不区分大小写，且您不能使用
          `v-on to listen to camelCase events when using in-DOM templates. ` + // `v-on` 用于在使用 DOM 内模板时监听 camelCase 格式的事件
          `You should probably use "${hyphenate(
            // 你可能应该使用
            event,
          )}" instead of "${event}".`, // 代替"${event}"
      )
    }
  }

  // ========== 步骤7：查找事件处理器（优先级：原事件名 → 驼峰 → 连字符（v-model专属）） ==========
  let handlerName // 处理器名称（如onClick/onUpdate:modelValue）
  let handler =
    // 优先级1：原事件名转处理器名（如'click'→'onClick'）
    props[(handlerName = toHandlerKey(event))] ||
    // also try camelCase event handler (#2249) 还可以尝试驼峰命名法事件处理程序
    // 优先级2：驼峰化事件名转处理器名（兼容kebab-case事件名，如'update:model-value'→'update:modelValue'）
    props[(handlerName = toHandlerKey(camelize(event)))]

  // for v-model update:xxx events, also trigger kebab-case equivalent 对于 v-model update:xxx 事件，也会触发 kebab-case 等效项
  // for props passed via kebab-case 通过 kebab-case 传递的道具
  // 优先级3：v-model事件额外查找连字符形式（如update:modelValue→update:model-value）
  // 适配props通过kebab-case传递的场景
  if (!handler && isModelListener) {
    handler = props[(handlerName = toHandlerKey(hyphenate(event)))]
  }

  // ========== 步骤8：执行普通事件处理器（带异步错误捕获） ==========
  if (handler) {
    callWithAsyncErrorHandling(
      handler, // 事件处理器函数
      instance, // 组件实例（错误上下文）
      ErrorCodes.COMPONENT_EVENT_HANDLER, // 错误码（标识事件处理器错误）
      args, // 处理后的事件参数
    )
  }

  // ========== 步骤9：执行once事件处理器（仅执行一次） ==========
  const onceHandler = props[handlerName + `Once`]
  if (onceHandler) {
    // 初始化emitted对象（存储已执行的once事件）
    if (!instance.emitted) {
      instance.emitted = {}
    }
    // 该once事件已执行过 → 直接返回（避免重复执行）
    else if (instance.emitted[handlerName]) {
      return
    }
    // 标记该once事件已执行
    instance.emitted[handlerName] = true
    // 执行once处理器（带异步错误捕获）
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      ErrorCodes.COMPONENT_EVENT_HANDLER,
      args,
    )
  }

  // ========== 步骤10：Vue2兼容处理 → 兼容model事件和实例emit ==========
  if (__COMPAT__) {
    compatModelEmit(instance, event, args)
    return compatInstanceEmit(instance, event, args)
  }
}

const mixinEmitsCache = new WeakMap<ConcreteComponent, ObjectEmitsOptions>()
/**
 * Vue3 内部核心函数 - 组件Emits选项的【标准化处理总入口】
 * 核心使命：
 *    1. 处理Emits的缓存逻辑（避免重复标准化，提升组件初始化性能）；
 *    2. 合并mixins/extends/全局mixins中的Emits（继承链上的Emits合并）；
 *    3. 将原始Emits（数组/对象形式）转换为统一的ObjectEmitsOptions格式；
 *    4. 无Emits配置时返回null，保证内部处理逻辑的一致性；
 * 核心关联：组件初始化阶段（createComponentInstance）调用，为事件校验、透传控制提供标准化的Emits配置。
 *
 *
 * @param {ConcreteComponent} comp 目标组件（选项式/函数式组件，支持mixins/extends）
 * @param {AppContext} appContext 应用上下文（存储全局mixins、Emits缓存等）
 * @param {boolean} [asMixin=false] 是否作为Mixin处理（决定使用哪个缓存容器）
 * @returns {ObjectEmitsOptions | null} 标准化后的Emits配置：
 *          - 有Emits配置：返回ObjectEmitsOptions（key=事件名，value=校验函数/null）；
 *          - 无Emits配置：返回null；
 */
export function normalizeEmitsOptions(
  comp: ConcreteComponent,
  appContext: AppContext,
  asMixin = false,
): ObjectEmitsOptions | null {
  // ========== 步骤1：初始化缓存 & 检查缓存命中 ==========
  // 选择缓存容器：
  // - Options API开启且作为Mixin → 使用mixinEmitsCache（Mixin专用缓存）
  // - 其他场景 → 使用应用上下文的emitsCache（组件专用缓存）
  const cache =
    __FEATURE_OPTIONS_API__ && asMixin ? mixinEmitsCache : appContext.emitsCache
  const cached = cache.get(comp) // 从缓存获取已标准化的Emits配置
  // 缓存命中（包括null，区分“未处理”和“处理后无配置”）
  if (cached !== undefined) {
    return cached
  }

  // ========== 步骤2：初始化核心变量 ==========
  const raw = comp.emits // 组件原始Emits选项（数组/对象/undefined）
  let normalized: ObjectEmitsOptions = {} // 标准化后的Emits对象（最终返回的核心结构）

  // ========== 步骤3：合并mixins/extends中的Emits（仅Options API场景） ==========
  // apply mixin/extends props 应用 mixin/extends 属性
  let hasExtends = false // 标记是否有继承的Emits（来自mixins/extends）

  if (__FEATURE_OPTIONS_API__ && !isFunction(comp)) {
    const extendEmits = (raw: ComponentOptions) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw, appContext, true)
      if (normalizedFromExtend) {
        hasExtends = true
        extend(normalized, normalizedFromExtend)
      }
    }
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits)
    }
    if (comp.extends) {
      extendEmits(comp.extends)
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits)
    }
  }

  // ========== 步骤4：无原始Emits且无继承Emits → 返回null ==========
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null)
    }
    return null
  }

  // ========== 步骤5：标准化原始Emits配置 ==========
  if (isArray(raw)) {
    // 原始Emits是数组形式（如emits: ['click', 'change']）：
    // 遍历数组，每个事件名作为key，值设为null（表示无自定义校验函数）
    raw.forEach(key => (normalized[key] = null))
  } else {
    // 原始Emits是对象形式（如emits: { click: (val) => val > 0 }）：
    // 浅合并到normalized（保留自定义校验函数，避免修改原始配置）
    extend(normalized, raw)
  }

  // ========== 步骤6：存入缓存 & 返回标准化结果 ==========
  // 组件是对象类型（非函数组件）→ 存入缓存
  if (isObject(comp)) {
    cache.set(comp, normalized)
  }
  return normalized
}

// Check if an incoming prop key is a declared emit event listener. 检查传入的 prop 键是否为已声明的发射事件监听器
// e.g. With `emits: { click: null }`, props named `onClick` and `onclick` are 例如，在`emits: { click: null }`的情况下，名为`onClick`和`onclick`的属性是
// both considered matched listeners. 两者都被视为匹配的listeners
export function isEmitListener(
  options: ObjectEmitsOptions | null,
  key: string,
): boolean {
  if (!options || !isOn(key)) {
    return false
  }

  if (__COMPAT__ && key.startsWith(compatModelEventPrefix)) {
    return true
  }

  key = key.slice(2).replace(/Once$/, '')
  return (
    hasOwn(options, key[0].toLowerCase() + key.slice(1)) ||
    hasOwn(options, hyphenate(key)) ||
    hasOwn(options, key)
  )
}
