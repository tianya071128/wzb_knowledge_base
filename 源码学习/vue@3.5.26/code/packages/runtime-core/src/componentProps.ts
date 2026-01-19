import {
  TriggerOpTypes,
  shallowReactive,
  shallowReadonly,
  toRaw,
  trigger,
} from '@vue/reactivity'
import {
  EMPTY_ARR,
  EMPTY_OBJ,
  type IfAny,
  PatchFlags,
  camelize,
  capitalize,
  extend,
  hasOwn,
  hyphenate,
  isArray,
  isFunction,
  isObject,
  isOn,
  isReservedProp,
  isString,
  makeMap,
  toRawType,
} from '@vue/shared'
import { warn } from './warning'
import {
  type ComponentInternalInstance,
  type ComponentOptions,
  type ConcreteComponent,
  type Data,
  setCurrentInstance,
} from './component'
import { isEmitListener } from './componentEmits'
import type { AppContext } from './apiCreateApp'
import { createPropsDefaultThis } from './compat/props'
import { isCompatEnabled, softAssertCompatEnabled } from './compat/compatConfig'
import { DeprecationTypes } from './compat/compatConfig'
import { shouldSkipAttr } from './compat/attrsFallthrough'
import { createInternalObject } from './internalObject'

export type ComponentPropsOptions<P = Data> =
  | ComponentObjectPropsOptions<P>
  | string[]

export type ComponentObjectPropsOptions<P = Data> = {
  [K in keyof P]: Prop<P[K]> | null
}

export type Prop<T, D = T> = PropOptions<T, D> | PropType<T>

type DefaultFactory<T> = (props: Data) => T | null | undefined

export interface PropOptions<T = any, D = T> {
  type?: PropType<T> | true | null
  required?: boolean
  default?: D | DefaultFactory<D> | null | undefined | object
  validator?(value: unknown, props: Data): boolean
  /**
   * @internal
   */
  skipCheck?: boolean
  /**
   * @internal
   */
  skipFactory?: boolean
}

export type PropType<T> = PropConstructor<T> | (PropConstructor<T> | null)[]

type PropConstructor<T = any> =
  | { new (...args: any[]): T & {} }
  | { (): T }
  | PropMethod<T>

type PropMethod<T, TConstructor = any> = [T] extends [
  ((...args: any) => any) | undefined,
] // if is function with args, allowing non-required functions
  ? { new (): TConstructor; (): T; readonly prototype: TConstructor } // Create Function like constructor
  : never

type RequiredKeys<T> = {
  [K in keyof T]: T[K] extends
    | { required: true }
    | { default: any }
    // don't mark Boolean props as undefined
    | BooleanConstructor
    | { type: BooleanConstructor }
    ? T[K] extends { default: undefined | (() => undefined) }
      ? never
      : K
    : never
}[keyof T]

type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>

type DefaultKeys<T> = {
  [K in keyof T]: T[K] extends
    | { default: any }
    // Boolean implicitly defaults to false
    | BooleanConstructor
    | { type: BooleanConstructor }
    ? T[K] extends { type: BooleanConstructor; required: true } // not default if Boolean is marked as required
      ? never
      : K
    : never
}[keyof T]

type InferPropType<T, NullAsAny = true> = [T] extends [null]
  ? NullAsAny extends true
    ? any
    : null
  : [T] extends [{ type: null | true }]
    ? any // As TS issue https://github.com/Microsoft/TypeScript/issues/14829 // somehow `ObjectConstructor` when inferred from { (): T } becomes `any` // `BooleanConstructor` when inferred from PropConstructor(with PropMethod) becomes `Boolean`
    : [T] extends [ObjectConstructor | { type: ObjectConstructor }]
      ? Record<string, any>
      : [T] extends [BooleanConstructor | { type: BooleanConstructor }]
        ? boolean
        : [T] extends [DateConstructor | { type: DateConstructor }]
          ? Date
          : [T] extends [(infer U)[] | { type: (infer U)[] }]
            ? U extends DateConstructor
              ? Date | InferPropType<U, false>
              : InferPropType<U, false>
            : [T] extends [Prop<infer V, infer D>]
              ? unknown extends V
                ? keyof V extends never
                  ? IfAny<V, V, D>
                  : V
                : V
              : T

/**
 * Extract prop types from a runtime props options object.
 * The extracted types are **internal** - i.e. the resolved props received by
 * the component.
 * - Boolean props are always present
 * - Props with default values are always present
 *
 * To extract accepted props from the parent, use {@link ExtractPublicPropTypes}.
 */
export type ExtractPropTypes<O> = {
  // use `keyof Pick<O, RequiredKeys<O>>` instead of `RequiredKeys<O>` to
  // support IDE features
  [K in keyof Pick<O, RequiredKeys<O>>]: O[K] extends { default: any }
    ? Exclude<InferPropType<O[K]>, undefined>
    : InferPropType<O[K]>
} & {
  // use `keyof Pick<O, OptionalKeys<O>>` instead of `OptionalKeys<O>` to
  // support IDE features
  [K in keyof Pick<O, OptionalKeys<O>>]?: InferPropType<O[K]>
}

type PublicRequiredKeys<T> = {
  [K in keyof T]: T[K] extends { required: true } ? K : never
}[keyof T]

type PublicOptionalKeys<T> = Exclude<keyof T, PublicRequiredKeys<T>>

/**
 * Extract prop types from a runtime props options object.
 * The extracted types are **public** - i.e. the expected props that can be
 * passed to component.
 */
export type ExtractPublicPropTypes<O> = {
  [K in keyof Pick<O, PublicRequiredKeys<O>>]: InferPropType<O[K]>
} & {
  [K in keyof Pick<O, PublicOptionalKeys<O>>]?: InferPropType<O[K]>
}

enum BooleanFlags {
  shouldCast,
  shouldCastTrue,
}

// extract props which defined with default from prop options
export type ExtractDefaultPropTypes<O> = O extends object
  ? // use `keyof Pick<O, DefaultKeys<O>>` instead of `DefaultKeys<O>` to support IDE features
    { [K in keyof Pick<O, DefaultKeys<O>>]: InferPropType<O[K]> }
  : {}

type NormalizedProp = PropOptions & {
  [BooleanFlags.shouldCast]?: boolean
  [BooleanFlags.shouldCastTrue]?: boolean
}

// normalized value is a tuple of the actual normalized options 标准化值是实际标准化选项的元组
// and an array of prop keys that need value casting (booleans and defaults) 以及需要值转换的 prop 键数组（布尔值和默认值）
export type NormalizedProps = Record<string, NormalizedProp>
// [标准化 props options, 需要值转换的 prop 键数组]
export type NormalizedPropsOptions = [NormalizedProps, string[]] | []

/**
 * Vue3 核心初始化函数 - 组件Props/Attrs的【唯一底层处理入口】，setupComponent的核心依赖函数
 * 核心使命：处理父组件传入的原始属性，完成6大核心工作：初始化Props/Attrs容器、分离Props与Attrs、填充Props默认值、补全缺失Props为undefined、开发环境校验Props合法性、响应式处理并挂载到实例
 * 核心特性：严格区分声明式Props和透传Attrs、区分有状态/无状态组件差异化处理、兼容SSR、开发环境校验、遵循单向数据流、纯初始化无副作用
 * 核心价值：业务中setup(props)/this.props/ctx.attrs的底层数据来源，所有属性相关的规则都在此实现
 *  - 初始化 Props 和 Attrs 的存储容器, 最终赋值给组件实例
 *  - 调用 setFullProps 完成 Props 和 Attrs 的赋值
 *  - 差异化挂载处理后的 Props 对象到实例
 *      -- 有状态组件
 *          --- SSR 场景：直接挂载原始props对象 → 服务端渲染是「一次性渲染」，无数据更新、无响应式依赖，不需要创建响应式对象，节省性能；
 *          --- 浏览器场景：挂载 shallowReactive(props) 浅层响应式对象
 *      -- 无状态组件 (函数式组件): 不需要创建任何响应式对象
 *  - 统一挂载 Attrs 对象到实例
 *
 * @param {ComponentInternalInstance} instance 组件内部实例，最终处理后的props/attrs会挂载到该实例上
 * @param {Data | null} rawProps 父组件传入的「原始未处理属性对象」，属性处理的数据源，可为null（无属性传入）
 * @param {number} isStateful 位运算标识的数字结果，非0=有状态组件，0=无状态组件，性能优化设计
 * @param {boolean} isSSR 是否为服务端渲染模式，默认false，true时跳过响应式处理（服务端无需响应式）
 * @returns {void} 无返回值，所有处理结果直接挂载到组件实例上
 */
export function initProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  isStateful: number, // result of bitwise flag comparison 按位标志比较的结果
  isSSR = false,
): void {
  // 1. 初始化两个核心容器：用于存储最终处理后的【声明式Props】和【透传Attrs】
  const props: Data = {} // 存储组件声明过的、合法的Props属性，最终挂载到instance.props
  const attrs: Data = createInternalObject() // 存储组件未声明的、透传的Attrs属性，专用内部空对象，避免污染全局常量

  // 2. 初始化Props默认值缓存容器：挂载到实例上，存储声明式Props的默认值，后续复用，避免重复解析
  instance.propsDefaults = Object.create(null)

  // 3. ✅【核心核心】执行属性分离与处理的核心逻辑，该函数是本方法的灵魂
  // 作用：解析rawProps原始属性，对照instance.propsOptions声明的规则，完成3件事：
  //    a. 把「声明过的属性」筛选出来，赋值默认值后存入 props 对象
  //    b. 把「未声明的属性」筛选出来，存入 attrs 对象
  //    c. 处理props的默认值、必填项、类型匹配等核心规则
  setFullProps(instance, rawProps, props, attrs)

  // ensure all declared prop keys are present 确保所有声明的 prop 键都存在
  // 4. 兜底补全：确保【所有声明过的Props键名】都存在于props对象中，无遗漏
  // 场景：父组件未传入某个声明的props，此时该key不会出现在props中，手动补全为undefined
  // 目的：保证组件内部访问任何声明过的props时，不会出现「key不存在」的情况，统一返回undefined，避免报错
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = undefined
    }
  }

  // validation 验证
  // 5. 开发环境专属：Props合法性校验，生产环境会被tree-shaking剔除，无性能损耗
  // 校验规则：属性类型是否匹配、必填项是否传入、自定义校验函数是否通过等，校验失败会在控制台抛出友好警告
  if (__DEV__) {
    validateProps(rawProps || {}, props, instance)
  }

  // 6. ✅ 核心分支：根据【组件类型】+【是否SSR】，差异化处理并挂载最终的props对象到实例
  // 情况1：当前是【有状态组件】
  if (isStateful) {
    // stateful
    // SSR模式：直接挂载原始props对象（服务端无需响应式，无数据更新场景）
    // 浏览器模式：挂载【浅层响应式】的props对象 → Vue3核心设计！props是shallowReactive，而非深层reactive
    instance.props = isSSR ? props : shallowReactive(props)
  }
  // 情况2：当前是【无状态组件(函数式组件)】，无实例无响应式，轻量处理
  else {
    if (!instance.type.props) {
      // 子情况2.1：无状态组件 【未声明任何props】 → 所有传入的属性都视为attrs，props和attrs指向同一个对象
      // functional w/ optional props, props === attrs 具有可选 props 的功能，props === attrs
      instance.props = attrs
    } else {
      // 子情况2.2：无状态组件 【声明过props】 → 正常挂载处理后的props对象
      // functional w/ declared props
      instance.props = props
    }
  }
  // 7. 最终兜底：把处理后的attrs对象，统一挂载到组件实例上，所有组件共享该逻辑，无分支
  // 业务中setupContext.attrs / this.$attrs 访问到的就是这个对象
  instance.attrs = attrs
}

function isInHmrContext(instance: ComponentInternalInstance | null) {
  while (instance) {
    if (instance.type.__hmrId) return true
    instance = instance.parent
  }
}

export function updateProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  rawPrevProps: Data | null,
  optimized: boolean,
): void {
  const {
    props,
    attrs,
    vnode: { patchFlag },
  } = instance
  const rawCurrentProps = toRaw(props)
  const [options] = instance.propsOptions
  let hasAttrsChanged = false

  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !(__DEV__ && isInHmrContext(instance)) &&
    (optimized || patchFlag > 0) &&
    !(patchFlag & PatchFlags.FULL_PROPS)
  ) {
    if (patchFlag & PatchFlags.PROPS) {
      // Compiler-generated props & no keys change, just set the updated
      // the props.
      const propsToUpdate = instance.vnode.dynamicProps!
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i]
        // skip if the prop key is a declared emit event listener
        if (isEmitListener(instance.emitsOptions, key)) {
          continue
        }
        // PROPS flag guarantees rawProps to be non-null
        const value = rawProps![key]
        if (options) {
          // attr / props separation was done on init and will be consistent
          // in this code path, so just check if attrs have it.
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value
              hasAttrsChanged = true
            }
          } else {
            const camelizedKey = camelize(key)
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false /* isAbsent */,
            )
          }
        } else {
          if (__COMPAT__) {
            if (isOn(key) && key.endsWith('Native')) {
              key = key.slice(0, -6) // remove Native postfix
            } else if (shouldSkipAttr(key, instance)) {
              continue
            }
          }
          if (value !== attrs[key]) {
            attrs[key] = value
            hasAttrsChanged = true
          }
        }
      }
    }
  } else {
    // full props update.
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true
    }
    // in case of dynamic props, check if we need to delete keys from
    // the props object
    let kebabKey: string
    for (const key in rawCurrentProps) {
      if (
        !rawProps ||
        // for camelCase
        (!hasOwn(rawProps, key) &&
          // it's possible the original props was passed in as kebab-case
          // and converted to camelCase (#955)
          ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey)))
      ) {
        if (options) {
          if (
            rawPrevProps &&
            // for camelCase
            (rawPrevProps[key] !== undefined ||
              // for kebab-case
              rawPrevProps[kebabKey!] !== undefined)
          ) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              undefined,
              instance,
              true /* isAbsent */,
            )
          }
        } else {
          delete props[key]
        }
      }
    }
    // in the case of functional component w/o props declaration, props and
    // attrs point to the same object so it should already have been updated.
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (
          !rawProps ||
          (!hasOwn(rawProps, key) &&
            (!__COMPAT__ || !hasOwn(rawProps, key + 'Native')))
        ) {
          delete attrs[key]
          hasAttrsChanged = true
        }
      }
    }
  }

  // trigger updates for $attrs in case it's used in component slots
  if (hasAttrsChanged) {
    trigger(instance.attrs, TriggerOpTypes.SET, '')
  }

  if (__DEV__) {
    validateProps(rawProps || {}, props, instance)
  }
}

/**
 * Vue3 核心内部函数 - initProps的【唯一核心实现/灵魂函数】，无export私有函数
 * 核心使命：Props与Attrs的底层精准分离，完成原始属性的遍历、过滤、转换、分类，处理需要类型转换的Props，是属性系统最核心的底层逻辑
 * 核心能力：过滤保留属性、连字符→驼峰自动转换、区分声明Props/事件监听/透传Attrs、批量处理Props类型转换与默认值、返回Attrs变化状态
 * 核心特性：纯数据处理无副作用、兼容连字符/驼峰props写法、严格区分属性边界、兼容Vue2迁移模式、极致性能优化(单次遍历)
 *
 *
 * @param {ComponentInternalInstance} instance 组件内部实例，获取声明的props/emits配置
 * @param {Data | null} rawProps 父组件传入的原始未处理属性对象，可为null（无属性传入）
 * @param {Data} props 空容器，最终存入【组件声明过的标准化Props】，由initProps创建
 * @param {Data} attrs 空容器，最终存入【非声明/非事件的透传Attrs】，由initProps创建
 * @returns {boolean} hasAttrsChanged - attrs是否有新增/修改，供上层判断是否需要更新attrs相关渲染
 */
function setFullProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  props: Data,
  attrs: Data,
) {
  // 1. 解构组件标准化后的Props配置：固定长度为2的数组
  // options: 组件声明的props配置对象(驼峰key)，包含类型/默认值/校验规则
  // needCastKeys: 需要做类型转换/值解析的props名称数组，如带type/default/validator的props
  const [options, needCastKeys] = instance.propsOptions
  // 2. 初始化attrs变化状态标识：默认无变化，后续赋值/修改时置为true
  let hasAttrsChanged = false
  // 3. 初始化需要类型转换的原始属性缓存容器：暂存需要resolvePropValue处理的props原始值
  let rawCastValues: Data | undefined

  // 4. 核心逻辑：父组件传入了原始属性，才执行遍历处理；无属性传入则直接跳过所有逻辑
  if (rawProps) {
    // 遍历父组件传入的每一个原始属性的【键名+值】
    for (let key in rawProps) {
      // key, ref are reserved and never passed down key、ref 被保留并且永远不会被传递
      // 4.1 过滤：如果是Vue的保留属性(key/ref/slot等)，直接跳过，永远不传入组件的props/attrs
      if (isReservedProp(key)) {
        continue
      }

      // 4.2 Vue2兼容模式专属逻辑：处理Vue2的特殊属性，生产环境关闭兼容则无此逻辑
      if (__COMPAT__) {
        // 兼容Vue2的实例事件钩子 onHook:xxx，给出废弃警告
        if (key.startsWith('onHook:')) {
          softAssertCompatEnabled(
            DeprecationTypes.INSTANCE_EVENT_HOOKS,
            instance,
            key.slice(2).toLowerCase(),
          )
        }
        // 兼容Vue2的inline-template属性，直接跳过，Vue3已废弃该属性
        if (key === 'inline-template') {
          continue
        }
      }

      // 4.3 获取当前原始属性的对应值
      const value = rawProps[key]
      // prop option names are camelized during normalization, so to support  在规范化过程中，prop 选项名称会被驼峰化，以便支持
      // kebab -> camel conversion here we need to camelize the key. 在这里，我们需要将“kebab”转换为“camel”格式，即需要将键进行驼峰化处理。

      // 4.4 声明式Props的核心匹配逻辑：先处理属性名的【连字符→驼峰】自动转换
      // 原因：propsOptions中的key是标准化的驼峰格式，父组件可传kebab-case(连字符)或camelCase(驼峰)，需要统一匹配
      let camelKey
      // 判断：组件是否声明了该属性(转换后的驼峰key存在于propsOptions中)
      if (options && hasOwn(options, (camelKey = camelize(key)))) {
        // ✅ 命中：当前属性是【组件显式声明的Props】

        // 子情况1：该props不需要类型转换 → 直接赋值原始值到props容器，无需额外处理
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value
        }
        // 子情况2：该props需要类型转换 → 暂存原始值到rawCastValues，后续统一批量解析
        else {
          ;(rawCastValues || (rawCastValues = {}))[camelKey] = value
        }
      }
      // 未命中Props -- 没有在 propsOptions 重定义
      // 当前属性【不是Props】且【不是声明的事件监听】→ 归类为【透传Attrs】
      else if (!isEmitListener(instance.emitsOptions, key)) {
        // Any non-declared (either as a prop or an emitted event) props are put 任何未声明的（作为道具或发出的事件）道具都会被放置
        // into a separate `attrs` object for spreading. Make sure to preserve 到一个单独的“attrs”对象中进行传播。请务必保存好
        // original key casing 原厂钥匙壳

        // Vue2兼容模式：处理Native后缀事件/需要跳过的特殊属性
        if (__COMPAT__) {
          if (isOn(key) && key.endsWith('Native')) {
            // 移除Native后缀，兼容Vue2的.native修饰符
            key = key.slice(0, -6) // remove Native postfix 删除本机后缀
          } else if (shouldSkipAttr(key, instance)) {
            continue
          }
        }

        // 关键：判断attrs中是否已有该属性，或值是否变化 → 避免无意义的重复赋值，优化性能
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value // 将透传属性存入attrs容器，【保留原始属性名的大小写/连字符格式】
          hasAttrsChanged = true // 标记attrs发生变化
        }
      }

      // 补充：如果属性是【声明的事件监听】→ 既不存入props也不存入attrs，直接跳过
    }
  }

  // 5. ✅ 核心处理：对需要类型转换/值解析的Props，执行统一的批量解析赋值
  // needCastKeys存在 → 有props需要做类型转换/默认值赋值/校验
  if (needCastKeys) {
    // 获取props容器的原始对象(解除响应式包装)，避免后续操作触发不必要的响应式更新
    const rawCurrentProps = toRaw(props)
    // 拿到暂存的需要转换的原始值，无则赋值空对象常量，节省内存
    const castValues = rawCastValues || EMPTY_OBJ
    // 遍历所有需要转换的props键名
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i]
      // 调用核心解析函数，处理当前props的【类型转换、默认值赋值、必填校验、自定义校验】
      props[key] = resolvePropValue(
        options!, // 组件声明的props配置
        rawCurrentProps, // 原始props对象
        key, // 当前处理的props键名
        castValues[key], // 该props的原始值
        instance, // 组件实例
        !hasOwn(castValues, key), // 是否父组件【未传入】该props → 用于判断是否需要赋值默认值
      )
    }
  }

  // 6. 返回attrs的变化状态，供上层initProps/组件更新逻辑判断是否需要处理attrs相关更新
  return hasAttrsChanged
}

function resolvePropValue(
  options: NormalizedProps,
  props: Data,
  key: string,
  value: unknown,
  instance: ComponentInternalInstance,
  isAbsent: boolean,
) {
  const opt = options[key]
  if (opt != null) {
    const hasDefault = hasOwn(opt, 'default')
    // default values
    if (hasDefault && value === undefined) {
      const defaultValue = opt.default
      if (
        opt.type !== Function &&
        !opt.skipFactory &&
        isFunction(defaultValue)
      ) {
        const { propsDefaults } = instance
        if (key in propsDefaults) {
          value = propsDefaults[key]
        } else {
          const reset = setCurrentInstance(instance)
          value = propsDefaults[key] = defaultValue.call(
            __COMPAT__ &&
              isCompatEnabled(DeprecationTypes.PROPS_DEFAULT_THIS, instance)
              ? createPropsDefaultThis(instance, props, key)
              : null,
            props,
          )
          reset()
        }
      } else {
        value = defaultValue
      }
      // #9006 reflect default value on custom element
      if (instance.ce) {
        instance.ce._setProp(key, value)
      }
    }
    // boolean casting
    if (opt[BooleanFlags.shouldCast]) {
      if (isAbsent && !hasDefault) {
        value = false
      } else if (
        opt[BooleanFlags.shouldCastTrue] &&
        (value === '' || value === hyphenate(key))
      ) {
        value = true
      }
    }
  }
  return value
}

const mixinPropsCache = new WeakMap<ConcreteComponent, NormalizedPropsOptions>()

export function normalizePropsOptions(
  comp: ConcreteComponent,
  appContext: AppContext,
  asMixin = false,
): NormalizedPropsOptions {
  const cache =
    __FEATURE_OPTIONS_API__ && asMixin ? mixinPropsCache : appContext.propsCache
  const cached = cache.get(comp)
  if (cached) {
    return cached
  }

  const raw = comp.props
  const normalized: NormalizedPropsOptions[0] = {}
  const needCastKeys: NormalizedPropsOptions[1] = []

  // apply mixin/extends props
  let hasExtends = false
  if (__FEATURE_OPTIONS_API__ && !isFunction(comp)) {
    const extendProps = (raw: ComponentOptions) => {
      if (__COMPAT__ && isFunction(raw)) {
        raw = raw.options
      }
      hasExtends = true
      const [props, keys] = normalizePropsOptions(raw, appContext, true)
      extend(normalized, props)
      if (keys) needCastKeys.push(...keys)
    }
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps)
    }
    if (comp.extends) {
      extendProps(comp.extends)
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps)
    }
  }

  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR as any)
    }
    return EMPTY_ARR as any
  }

  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      if (__DEV__ && !isString(raw[i])) {
        warn(`props must be strings when using array syntax.`, raw[i])
      }
      const normalizedKey = camelize(raw[i])
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ
      }
    }
  } else if (raw) {
    if (__DEV__ && !isObject(raw)) {
      warn(`invalid props options`, raw)
    }
    for (const key in raw) {
      const normalizedKey = camelize(key)
      if (validatePropName(normalizedKey)) {
        const opt = raw[key]
        const prop: NormalizedProp = (normalized[normalizedKey] =
          isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt))
        const propType = prop.type
        let shouldCast = false
        let shouldCastTrue = true

        if (isArray(propType)) {
          for (let index = 0; index < propType.length; ++index) {
            const type = propType[index]
            const typeName = isFunction(type) && type.name

            if (typeName === 'Boolean') {
              shouldCast = true
              break
            } else if (typeName === 'String') {
              // If we find `String` before `Boolean`, e.g. `[String, Boolean]`,
              // we need to handle the casting slightly differently. Props
              // passed as `<Comp checked="">` or `<Comp checked="checked">`
              // will either be treated as strings or converted to a boolean
              // `true`, depending on the order of the types.
              shouldCastTrue = false
            }
          }
        } else {
          shouldCast = isFunction(propType) && propType.name === 'Boolean'
        }

        prop[BooleanFlags.shouldCast] = shouldCast
        prop[BooleanFlags.shouldCastTrue] = shouldCastTrue
        // if the prop needs boolean casting or default value
        if (shouldCast || hasOwn(prop, 'default')) {
          needCastKeys.push(normalizedKey)
        }
      }
    }
  }

  const res: NormalizedPropsOptions = [normalized, needCastKeys]
  if (isObject(comp)) {
    cache.set(comp, res)
  }
  return res
}

function validatePropName(key: string) {
  if (key[0] !== '$' && !isReservedProp(key)) {
    return true
  } else if (__DEV__) {
    warn(`Invalid prop name: "${key}" is a reserved property.`)
  }
  return false
}

// dev only
// use function string name to check type constructors
// so that it works across vms / iframes.
function getType(ctor: Prop<any> | null): string {
  // Early return for null to avoid unnecessary computations
  if (ctor === null) {
    return 'null'
  }

  // Avoid using regex for common cases by checking the type directly
  if (typeof ctor === 'function') {
    // Using name property to avoid converting function to string
    return ctor.name || ''
  } else if (typeof ctor === 'object') {
    // Attempting to directly access constructor name if possible
    const name = ctor.constructor && ctor.constructor.name
    return name || ''
  }

  // Fallback for other types (though they're less likely to have meaningful names here)
  return ''
}

/**
 * dev only
 */
function validateProps(
  rawProps: Data,
  props: Data,
  instance: ComponentInternalInstance,
) {
  const resolvedValues = toRaw(props)
  const options = instance.propsOptions[0]
  const camelizePropsKey = Object.keys(rawProps).map(key => camelize(key))
  for (const key in options) {
    let opt = options[key]
    if (opt == null) continue
    validateProp(
      key,
      resolvedValues[key],
      opt,
      __DEV__ ? shallowReadonly(resolvedValues) : resolvedValues,
      !camelizePropsKey.includes(key),
    )
  }
}

/**
 * dev only
 */
function validateProp(
  name: string,
  value: unknown,
  prop: PropOptions,
  props: Data,
  isAbsent: boolean,
) {
  const { type, required, validator, skipCheck } = prop
  // required!
  if (required && isAbsent) {
    warn('Missing required prop: "' + name + '"')
    return
  }
  // missing but optional
  if (value == null && !required) {
    return
  }
  // type check
  if (type != null && type !== true && !skipCheck) {
    let isValid = false
    const types = isArray(type) ? type : [type]
    const expectedTypes = []
    // value is valid as long as one of the specified types match
    for (let i = 0; i < types.length && !isValid; i++) {
      const { valid, expectedType } = assertType(value, types[i])
      expectedTypes.push(expectedType || '')
      isValid = valid
    }
    if (!isValid) {
      warn(getInvalidTypeMessage(name, value, expectedTypes))
      return
    }
  }
  // custom validator
  if (validator && !validator(value, props)) {
    warn('Invalid prop: custom validator check failed for prop "' + name + '".')
  }
}

const isSimpleType = /*@__PURE__*/ makeMap(
  'String,Number,Boolean,Function,Symbol,BigInt',
)

type AssertionResult = {
  valid: boolean
  expectedType: string
}

/**
 * dev only
 */
function assertType(
  value: unknown,
  type: PropConstructor | null,
): AssertionResult {
  let valid
  const expectedType = getType(type)
  if (expectedType === 'null') {
    valid = value === null
  } else if (isSimpleType(expectedType)) {
    const t = typeof value
    valid = t === expectedType.toLowerCase()
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof (type as PropConstructor)
    }
  } else if (expectedType === 'Object') {
    valid = isObject(value)
  } else if (expectedType === 'Array') {
    valid = isArray(value)
  } else {
    valid = value instanceof (type as PropConstructor)
  }
  return {
    valid,
    expectedType,
  }
}

/**
 * dev only
 */
function getInvalidTypeMessage(
  name: string,
  value: unknown,
  expectedTypes: string[],
): string {
  if (expectedTypes.length === 0) {
    return (
      `Prop type [] for prop "${name}" won't match anything.` +
      ` Did you mean to use type Array instead?`
    )
  }
  let message =
    `Invalid prop: type check failed for prop "${name}".` +
    ` Expected ${expectedTypes.map(capitalize).join(' | ')}`
  const expectedType = expectedTypes[0]
  const receivedType = toRawType(value)
  const expectedValue = styleValue(value, expectedType)
  const receivedValue = styleValue(value, receivedType)
  // check if we need to specify expected value
  if (
    expectedTypes.length === 1 &&
    isExplicable(expectedType) &&
    !isBoolean(expectedType, receivedType)
  ) {
    message += ` with value ${expectedValue}`
  }
  message += `, got ${receivedType} `
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += `with value ${receivedValue}.`
  }
  return message
}

/**
 * dev only
 */
function styleValue(value: unknown, type: string): string {
  if (type === 'String') {
    return `"${value}"`
  } else if (type === 'Number') {
    return `${Number(value)}`
  } else {
    return `${value}`
  }
}

/**
 * dev only
 */
function isExplicable(type: string): boolean {
  const explicitTypes = ['string', 'number', 'boolean']
  return explicitTypes.some(elem => type.toLowerCase() === elem)
}

/**
 * dev only
 */
function isBoolean(...args: string[]): boolean {
  return args.some(elem => elem.toLowerCase() === 'boolean')
}
