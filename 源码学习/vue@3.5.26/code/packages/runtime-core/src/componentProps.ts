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

/**
 * 定义 Vue 组件 prop 的选项配置接口
 * 包含了类型检查、默认值、验证器等配置项
 *
 * @template T - prop 的类型
 * @template D - 默认值的类型
 */
export interface PropOptions<T = any, D = T> {
  /**
   * 指定 prop 的类型，可以是原生构造函数（如 String、Number）、自定义类型或 null
   * 设置为 true 可跳过类型检查
   */
  type?: PropType<T> | true | null
  /**
   * 标识该 prop 是否为必需的，如果设置为 true，在父组件未传递该 prop 时会抛出警告
   */
  required?: boolean
  /**
   * prop 的默认值，可以是基本类型的值、返回默认值的工厂函数、null、undefined 或对象
   */
  default?: D | DefaultFactory<D> | null | undefined | object
  /**
   * 自定义验证函数，接收 prop 值和所有 props 对象作为参数，返回布尔值表示验证是否通过
   * @param value - prop 的当前值
   * @param props - 组件的所有 props 对象
   * @returns 验证结果，true 表示验证通过
   */
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
  /** 是否需要布尔类型转换 */
  [BooleanFlags.shouldCast]?: boolean
  /** 是否需要将字符串类型转换为 Boolean */
  [BooleanFlags.shouldCastTrue]?: boolean
}

// normalized value is a tuple of the actual normalized options 标准化值是实际标准化选项的元组
// and an array of prop keys that need value casting (booleans and defaults) 以及需要值转换的 prop 键数组（布尔值和默认值）
export type NormalizedProps = Record<string, NormalizedProp>
// [标准化 props options, 需要值转换的 prop 键数组 -> 存在 Boolean 类型或者配置了 default 值的 prop 键]
export type NormalizedPropsOptions = [NormalizedProps, string[]] | []

/**
 * Vue3 核心初始化函数 - 组件Props/Attrs的【唯一底层处理入口】，setupComponent的核心依赖函数
 * 核心使命：处理父组件传入的原始属性，完成6大核心工作：初始化Props/Attrs容器、分离Props与Attrs、填充Props默认值、补全缺失Props为undefined、开发环境校验Props合法性、响应式处理并挂载到实例
 * 核心特性：严格区分声明式Props和透传Attrs、区分有状态/无状态组件差异化处理、兼容SSR、开发环境校验、遵循单向数据流、纯初始化无副作用
 * 核心价值：业务中setup(props)/this.props/ctx.attrs的底层数据来源，所有属性相关的规则都在此实现
 *  - 初始化 Props 和 Attrs 的存储容器, 最终赋值给组件实例
 *      -- instance.props 和 instance.attrs
 *  - 调用 setFullProps 完成 Props 和 Attrs 的赋值
 *      - 处理 props 和 attrs, 通过引用关系, 直接修改入参
 *      - props 处理:
 *         -- 通过之前解析的 propsOptions 获取声明的props配置对象(驼峰key)，包含类型/默认值/校验规则
 *         -- 从 vnode.props 中提取父组件传入的值
 *             --- 如果需要转换值: 可能需要将其转换成布尔值或者其它相关值, 最后跟其他设置了默认值的统一处理
 *             --- 不需要转换值: 直接添加到 props 容器中
 *         -- 最后处理存在转换值或默认值的, 通过 resolvePropValue 方法进行处理
 *      - attrs 处理:
 *          -- 从 vnode.props 中提取父组件传入的值
 *          -- 不属于 props 或者 emits 的, 则统一添加到 attrs 容器中
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

/**
 * Vue3 内部核心函数 - 组件Props/Attrs的【精准更新函数】
 * 核心使命：对比新旧原始Props，更新组件实例的`props`（声明式Props）和`attrs`（非Props属性），
 *          区分「编译优化模式」和「全量更新模式」，处理Props/Attrs分离、Emit监听过滤、Vue2兼容等边界场景，
 *          最终触发$attrs的响应式更新（保证插槽中使用$attrs时能实时刷新）
 *
 * - 更新 props 和 attrs, 直接更新 instance.props 和 instance.attrs
 *    -- 疑问? - 为什么 attrs 变化后, 需要触发响应式更新...
 *    -- 因为 attrs 是非响应式对象, 不同于 props
 *
 * @param {ComponentInternalInstance} instance 待更新的组件内部实例
 * @param {Data | null} rawProps 新的原始Props（未处理的父组件传入属性）
 * @param {Data | null} rawPrevProps 旧的原始Props（上一轮的父组件传入属性）
 * @param {boolean} optimized 是否开启编译优化（决定更新策略：精准更新/全量更新）
 * @returns {void} 无返回值，直接修改instance的props/attrs
 */
export function updateProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  rawPrevProps: Data | null,
  optimized: boolean,
): void {
  // ========== 第一步：解构组件实例的核心属性 ==========
  const {
    props, // 组件实例的声明式Props
    attrs, // 组件实例的非Props属性（$attrs，响应式对象）
    vnode: { patchFlag }, // 组件VNode的补丁标记（编译阶段生成，标记动态Props类型）
  } = instance
  // 解响应式：获取props的原始对象（避免响应式代理干扰属性对比）
  const rawCurrentProps = toRaw(props)
  // 组件声明的Props选项（仅取第一个元素，）
  const [options] = instance.propsOptions
  // 标记：attrs是否发生变化（用于后续触发$attrs的响应式更新）
  let hasAttrsChanged = false

  // ========== 分支1：编译优化模式 - 精准更新（性能优先） ==========
  if (
    // always force full diff in dev 始终在开发中强制执行完整差异
    // - #1942 if hmr is enabled with sfc component 如果使用 sfc 组件启用 hmr
    // - vite#872 non-sfc component used by sfc component SFC 组件使用的非 SFC 组件
    !(__DEV__ && isInHmrContext(instance)) && // 非开发环境HMR场景（开发环境HMR强制全量更新，避免漏更）；
    (optimized || patchFlag > 0) && // 开启编译优化 或 patchFlag>0（有编译标记）
    !(patchFlag & PatchFlags.FULL_PROPS) // 非FULL_PROPS标记（无需全量更新）
  ) {
    // 子分支1.1：patchFlag包含PROPS（仅更新动态Props列表）
    if (patchFlag & PatchFlags.PROPS) {
      // Compiler-generated props & no keys change, just set the updated 编译器生成的 props & 没有键改变，只需设置更新的
      // the props. 道具
      // 编译阶段标记的动态Props列表（仅包含可能变化的Props）
      const propsToUpdate = instance.vnode.dynamicProps!
      // 遍历所有动态Props，逐一更新
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i]
        // skip if the prop key is a declared emit event listener 如果 prop 键是已声明的发射事件侦听器，则跳过
        // 跳过：当前key是组件声明的Emit监听事件（如onUpdate:modelValue）
        // Emit监听不属于业务Props，无需更新到props/attrs
        if (isEmitListener(instance.emitsOptions, key)) {
          continue
        }

        // PROPS flag guarantees rawProps to be non-null PROPS 标志保证 rawProps 不为空
        const value = rawProps![key]
        // 场景A：组件声明了Props选项（options存在）
        if (options) {
          // attr / props separation was done on init and will be consistent 在初始化阶段已经完成了属性/道具的分离，并将保持一致性
          // in this code path, so just check if attrs have it. 在这个代码路径中，只需检查属性（attrs）是否包含它

          // 核心逻辑：Props/Attrs分离（初始化时已区分，此处保持一致）
          // 如果key存在于attrs中 → 属于非声明式Props，更新到attrs
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value // 更新attrs值
              hasAttrsChanged = true // 标记attrs变化
            }
          }
          // key不存在于attrs中 → 属于声明式Props，更新到props
          else {
            // 驼峰化key（兼容kebab-case转camelCase，如user-name → userName）
            const camelizedKey = camelize(key)

            // 解析Prop值（处理默认值、类型转换、校验等），更新到props
            props[camelizedKey] = resolvePropValue(
              options, // 组件声明的Props选项
              rawCurrentProps, // 当前Props的原始对象
              camelizedKey, // 驼峰化的Prop名
              value, // 新值
              instance, // 组件实例
              false /* isAbsent */, // 标记：Prop不是缺失状态（有新值）
            )
          }
        }
        // 场景B：组件未声明Props选项（options不存在）
        else {
          // Vue2兼容逻辑：处理Native后缀事件、跳过特殊Attr
          if (__COMPAT__) {
            if (isOn(key) && key.endsWith('Native')) {
              key = key.slice(0, -6) // remove Native postfix
            } else if (shouldSkipAttr(key, instance)) {
              continue
            }
          }

          // 未声明Props时，所有属性都归入attrs，对比并更新
          if (value !== attrs[key]) {
            attrs[key] = value
            hasAttrsChanged = true
          }
        }
      }
    }
  }
  // ========== 分支2：全量更新模式 - 兜底更新（功能优先） ==========
  else {
    // full props update. 完整道具更新

    // 子分支2.1：全量更新Props/Attrs（返回是否修改了attrs）
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true
    }

    // in case of dynamic props, check if we need to delete keys from 如果是动态道具，请检查我们是否需要从中删除键
    // the props object 道具对象

    // 子分支2.2：清理Props中已移除的Key（处理动态Props删除场景）
    let kebabKey: string // 存储kebab-case的Key（如userName → user-name）
    // 遍历当前Props的所有Key，检查是否在新rawProps中存在
    for (const key in rawCurrentProps) {
      if (
        !rawProps || // 新rawProps为空 → 清空所有Props
        // for camelCase
        // 新rawProps中无当前camelCase Key，且无对应的kebabCase Key（兼容命名格式）
        (!hasOwn(rawProps, key) &&
          // it's possible the original props was passed in as kebab-case 原始的props可能以“驼峰式大小写”的形式传入
          // and converted to camelCase (#955) 原始的props可能以“驼峰式大小写”的形式传入
          ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey)))
      ) {
        // 场景A：组件声明了Props选项 → 解析缺失状态的Prop值（如重置默认值）
        if (options) {
          // 旧Props中存在该Key → 需要重置（避免残留）
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
        }
        // 场景B：组件未声明Props选项 → 直接删除Props中的Key
        else {
          delete props[key]
        }
      }
    }

    // in the case of functional component w/o props declaration, props and 如果功能组件没有 props 声明，props 和
    // attrs point to the same object so it should already have been updated. attrs 指向同一个对象，因此它应该已经被更新。

    // 子分支2.3：清理Attrs中已移除的Key（Props和Attrs指向不同对象时）
    // 函数式组件未声明Props时，props和attrs指向同一对象，已在setFullProps中处理
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        // 新rawProps中无当前Key，且无对应的Native后缀Key（Vue2兼容）
        if (
          !rawProps ||
          (!hasOwn(rawProps, key) &&
            (!__COMPAT__ || !hasOwn(rawProps, key + 'Native')))
        ) {
          delete attrs[key] // 删除Attrs中已移除的Key
          hasAttrsChanged = true // 标记attrs变化
        }
      }
    }
  }

  // ========== 最终步骤1：触发$attrs的响应式更新 ==========
  // 如果attrs发生变化，触发响应式更新（保证插槽/模板中使用$attrs时能实时刷新）
  // trigger updates for $attrs in case it's used in component slots 如果 $attrs 在组件槽中使用，则触发更新
  if (hasAttrsChanged) {
    trigger(instance.attrs, TriggerOpTypes.SET, '')
  }

  // ========== 最终步骤2：开发环境Props校验 ==========
  // 校验新rawProps是否符合组件声明的Props规则（类型/必填等）
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
 *  - 处理 props 和 attrs, 通过引用关系, 直接修改入参
 *  - props 处理:
 *     -- 通过之前解析的 propsOptions 获取声明的props配置对象(驼峰key)，包含类型/默认值/校验规则
 *     -- 从 vnode.props 中提取父组件传入的值
 *         --- 如果需要转换值: 可能需要将其转换成布尔值或者其它相关值, 最后跟其他设置了默认值的统一处理
 *         --- 不需要转换值: 直接添加到 props 容器中
 *     -- 最后处理存在转换值或默认值的, 通过 resolvePropValue 方法进行处理
 *  - attrs 处理:
 *      -- 从 vnode.props 中提取父组件传入的值
 *      -- 不属于 props 或者 emits 的, 则统一添加到 attrs 容器中
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

/**
 * Vue3 内部核心函数 - 解析组件Prop的【最终运行时值】的专用函数
 * 核心使命：
 *    1. 处理Prop默认值：支持静态默认值、函数式默认值（绑定正确的this/上下文）；
 *    2. 处理布尔类型Prop的自动转换：适配模板中`<Comp checked>`/`<Comp checked="">`等写法；
 *    3. 反射默认值到自定义元素（CE）：保证自定义元素Props默认值生效；
 *    4. 缓存函数式默认值的执行结果：避免重复执行，提升性能；
 * 核心关联：组件Props初始化/更新阶段调用，是Prop最终值的“计算引擎”，决定模板中使用的Prop实际值。
 *
 *
 * @param {NormalizedProps} options 标准化后的Props配置（来自normalizePropsOptions）
 * @param {Data} props 组件当前的Props对象（原始传入值）
 * @param {string} key 当前处理的Prop名称（驼峰命名）
 * @param {unknown} value 原始传入的Prop值（可能为undefined/空字符串等）
 * @param {ComponentInternalInstance} instance 组件内部实例（上下文）
 * @param {boolean} isAbsent 该Prop是否完全未传入（true=未传，false=传了但值为undefined/其他）
 * @returns {unknown} 解析后的Prop最终值
 */
function resolvePropValue(
  options: NormalizedProps,
  props: Data,
  key: string,
  value: unknown,
  instance: ComponentInternalInstance,
  isAbsent: boolean,
) {
  // ========== 步骤1：获取当前Prop的标准化配置 ==========
  const opt = options[key]
  // 该Prop有标准化配置（需处理默认值/布尔转换）
  if (opt != null) {
    // ========== 步骤2：判断是否有默认值配置 ==========
    const hasDefault = hasOwn(opt, 'default')

    // ========== 分支1：处理Prop默认值（传入值为undefined时） ==========
    // default values 默认值
    if (hasDefault && value === undefined) {
      // 获取Prop的默认值配置
      const defaultValue = opt.default

      // 子分支1.1：函数式默认值（非Function类型Prop + 未跳过工厂函数 + 默认值是函数）
      if (
        opt.type !== Function && // Prop类型不是Function（避免把Function类型Prop的默认值当函数执行）
        !opt.skipFactory && // 未标记跳过工厂函数（内部标记，用于特殊场景）
        isFunction(defaultValue) // 默认值是函数（如default: () => ({ a: 1 })）
      ) {
        const { propsDefaults } = instance // 组件实例的Props默认值缓存（避免函数默认值重复执行）
        // 缓存命中：直接使用已执行的默认值结果
        if (key in propsDefaults) {
          value = propsDefaults[key]
        }
        // 缓存未命中：执行函数式默认值并缓存结果
        else {
          // 设置当前组件实例上下文（保证函数内能访问getCurrentInstance()）
          const reset = setCurrentInstance(instance)
          // 执行默认值函数，计算最终默认值并缓存
          value = propsDefaults[key] = defaultValue.call(
            // 函数this绑定：
            // - Vue2兼容模式：绑定到模拟的this（包含props/key等）
            // - 非兼容模式：绑定到null（符合Vue3设计，默认值函数无this）
            __COMPAT__ &&
              isCompatEnabled(DeprecationTypes.PROPS_DEFAULT_THIS, instance)
              ? createPropsDefaultThis(instance, props, key)
              : null,
            props, // 函数第一个参数：传入组件当前Props对象（便于默认值依赖其他Props）
          )
          reset() // 重置当前组件实例上下文（避免污染）
        }
      }
      // 子分支1.2：静态默认值（非函数类型）
      else {
        value = defaultValue // 直接使用静态默认值（如default: 1 / default: []）
      }

      // ========== 特殊处理：自定义元素（CE）反射默认值 ==========
      // #9006 reflect default value on custom element 反映自定义元素的默认值
      if (instance.ce) {
        instance.ce._setProp(key, value)
      }
    }

    // ========== 分支2：处理布尔类型Prop的自动转换 ==========
    // 该Prop需要布尔类型转换
    // boolean casting
    if (opt[BooleanFlags.shouldCast]) {
      // 子分支2.1：Prop完全未传入 且 无默认值 → 转换为false
      if (isAbsent && !hasDefault) {
        value = false
      }
      // 子分支2.2：需要将空字符串/匹配key的字符串转为true（如checked="" → true）
      else if (
        opt[BooleanFlags.shouldCastTrue] && // 开启“空字符串转true”规则
        (value === '' || value === hyphenate(key)) // 匹配空字符串 或 连字符形式的key（如checked="checked"）
      ) {
        value = true
      }
    }
  }
  return value
}

const mixinPropsCache = new WeakMap<ConcreteComponent, NormalizedPropsOptions>()

/**
 * Vue3 内部核心函数 - 组件Props选项的【标准化处理总入口】
 * 核心使命：
 *   1. 处理Props的缓存逻辑（避免重复标准化，提升性能）；
 *   2. 合并mixins/extends中的Props（继承链上的Props合并）；
 *   3. 将原始Props（数组/对象形式）转换为统一的标准化格式；
 *   4. 识别需要布尔类型转换的Props，标记cast规则并收集对应key；
 *   5. 开发环境校验Props格式合法性（如数组Props必须是字符串）；
 * 核心关联：组件初始化阶段（createComponentInstance）调用，为Props校验、赋值、类型转换提供标准化数据。
 *
 *  --> 最终统一Props配置对象，用于后续处理Props校验、赋值、类型转换
 *
 *
 * @param {ConcreteComponent} comp 目标组件（选项式/函数式组件）
 * @param {AppContext} appContext 应用上下文（存储全局mixins、Props缓存等）
 * @param {boolean} [asMixin=false] 是否作为Mixin处理（决定使用哪个缓存）
 * @returns {NormalizedPropsOptions} 标准化后的Props配置：
 *          - [0]: 标准化Props对象（key=驼峰命名，value=标准化Prop配置）；
 *          - [1]: 需要类型转换的Props key数组（布尔类型/有默认值的Props）。
 */
export function normalizePropsOptions(
  comp: ConcreteComponent,
  appContext: AppContext,
  asMixin = false,
): NormalizedPropsOptions {
  // ========== 步骤1：初始化缓存 & 检查缓存命中 ==========
  // 选择缓存：Options API开启时，Mixin用mixinPropsCache，否则用应用上下文的propsCache
  const cache =
    __FEATURE_OPTIONS_API__ && asMixin ? mixinPropsCache : appContext.propsCache
  const cached = cache.get(comp) // 从缓存获取已标准化的Props
  // 缓存命中，直接返回（避免重复处理）
  if (cached) {
    return cached
  }

  // ========== 步骤2：初始化核心变量 ==========
  const raw = comp.props // 组件原始Props选项（数组/对象/undefined）
  const normalized: NormalizedPropsOptions[0] = {} // 标准化后的Props对象
  const needCastKeys: NormalizedPropsOptions[1] = [] // 需要类型转换的Props key数组

  // ========== 步骤3：合并mixins/extends中的Props（Options API场景） ==========
  // apply mixin/extends props
  let hasExtends = false // 标记是否有继承的Props（mixins/extends）
  if (__FEATURE_OPTIONS_API__ && !isFunction(comp)) {
    // 定义递归合并Props的函数（处理mixins/extends）
    const extendProps = (raw: ComponentOptions) => {
      // Vue2兼容：如果raw是函数（Vue2构造函数），取其options
      if (__COMPAT__ && isFunction(raw)) {
        raw = raw.options
      }
      hasExtends = true // 标记有继承的Props
      // 递归标准化子级（mixins/extends）的Props
      const [props, keys] = normalizePropsOptions(raw, appContext, true)
      extend(normalized, props) // 合并子级Props到当前normalized
      if (keys) needCastKeys.push(...keys) // 合并需要转换的key
    }

    // 3.1 合并应用上下文的全局mixins Props（非Mixin场景）
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps)
    }
    // 3.2 合并组件extends的Props
    if (comp.extends) {
      extendProps(comp.extends)
    }
    // 3.3 合并组件mixins的Props
    if (comp.mixins) {
      comp.mixins.forEach(extendProps)
    }
  }

  // ========== 步骤4：无原始Props且无继承Props → 返回空数组 ==========
  if (!raw && !hasExtends) {
    // 组件是对象类型 → 存入缓存（避免下次重复处理）
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR as any)
    }
    return EMPTY_ARR as any
  }

  // ========== 分支1：原始Props是数组形式（如props: ['foo', 'bar']） ==========
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      // 开发环境校验：数组Props必须是字符串（否则警告）
      if (__DEV__ && !isString(raw[i])) {
        warn(`props must be strings when using array syntax.`, raw[i]) // 使用数组语法时 props 必须是字符串
      }

      // 转换为驼峰命名（兼容kebab-case，如'foo-bar'→'fooBar'）
      const normalizedKey = camelize(raw[i])
      // 校验Prop名称合法性（不能是保留字、非法字符等）
      if (validatePropName(normalizedKey)) {
        // 数组形式Props无配置，标准化为空对象
        normalized[normalizedKey] = EMPTY_OBJ
      }
    }
  }
  // ========== 分支2：原始Props是对象形式（如props: { foo: { type: String } }） ==========
  else if (raw) {
    // 开发环境校验：Props必须是对象（否则警告）
    if (__DEV__ && !isObject(raw)) {
      warn(`invalid props options`, raw) // 无效的道具选项
    }

    // 遍历原始Props的每个key
    for (const key in raw) {
      // 转换为驼峰命名（兼容kebab-case）
      const normalizedKey = camelize(key)
      // 校验Prop名称合法性
      if (validatePropName(normalizedKey)) {
        const opt = raw[key] // 原始Prop配置
        // 标准化Prop配置：
        // - 数组/函数类型（如type: [String, Number] / type: String）→ 包装为{ type: opt }
        // - 其他对象类型 → 浅拷贝（避免修改原始配置）
        const prop: NormalizedProp = (normalized[normalizedKey] =
          isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt))
        const propType = prop.type // Prop的类型配置（type字段）
        let shouldCast = false // 是否需要布尔类型转换
        let shouldCastTrue = true // 布尔转换规则：是否将空字符串/匹配字符串转为true

        // ========== 子分支：处理数组类型的Prop.type（如[type: [String, Boolean]]） ==========
        if (isArray(propType)) {
          for (let index = 0; index < propType.length; ++index) {
            const type = propType[index]
            const typeName = isFunction(type) && type.name // 获取类型名称（如'Boolean'/'String'）

            // 包含Boolean类型 → 标记需要布尔转换
            if (typeName === 'Boolean') {
              shouldCast = true
              break
            }
            // 先遇到String类型（如[String, Boolean]）→ 调整转换规则
            else if (typeName === 'String') {
              // If we find `String` before `Boolean`, e.g. `[String, Boolean]`, 如果我们在`Boolean`之前找到`String`，例如`[String, Boolean]`，
              // we need to handle the casting slightly differently. Props 我们需要以稍微不同的方式来处理选角问题。属性
              // passed as `<Comp checked="">` or `<Comp checked="checked">` 以 `<Comp checked="">` 或 `<Comp checked="checked">` 的形式传递
              // will either be treated as strings or converted to a boolean 要么被视为字符串，要么被转换为布尔值
              // `true`, depending on the order of the types. 根据类型的顺序，结果为`true`
              shouldCastTrue = false
            }
          }
        }
        // ========== 子分支：处理单个函数类型的Prop.type（如type: Boolean） ==========
        else {
          // 类型是Boolean → 标记需要布尔转换
          shouldCast = isFunction(propType) && propType.name === 'Boolean'
        }

        // ========== 标记布尔转换规则到标准化Prop配置 ==========
        prop[BooleanFlags.shouldCast] = shouldCast
        prop[BooleanFlags.shouldCastTrue] = shouldCastTrue

        // ========== 收集需要类型转换的Prop key ==========
        // 条件：需要布尔转换 或 有默认值 → 加入needCastKeys
        // if the prop needs boolean casting or default value 如果 prop 需要布尔转换或默认值
        if (shouldCast || hasOwn(prop, 'default')) {
          needCastKeys.push(normalizedKey)
        }
      }
    }
  }

  // ========== 步骤5：组装结果 & 存入缓存 ==========
  const res: NormalizedPropsOptions = [normalized, needCastKeys]
  // 组件是对象类型 → 存入缓存（下次直接复用）
  if (isObject(comp)) {
    cache.set(comp, res)
  }
  return res
}

/**
 * 验证属性名称是否有效
 * 检查属性名不能以'$'开头且不能是保留属性
 * @param key 要验证的属性名称
 * @returns 如果属性名称有效则返回true，否则返回false
 */
function validatePropName(key: string) {
  if (key[0] !== '$' && !isReservedProp(key)) {
    return true
  } else if (__DEV__) {
    warn(`Invalid prop name: "${key}" is a reserved property.`) // 无效的属性名：“${key}”是保留属性
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
/**
 * Vue3 内部核心函数 - 组件Props合法性校验的【总入口】
 * 核心使命：
 *   1. 遍历组件所有标准化的Props配置，逐个调用`validateProp`执行精准校验；
 *   2. 预处理校验所需的核心参数（解响应式Props值、判断Prop是否未传入、开发环境只读包装）；
 *   3. 触发Props的类型、必填、自定义验证函数等所有校验规则，开发环境下抛出不合法警告；
 *
 * 核心关联：组件初始化/Props更新阶段调用，是Vue Props校验体系的“总调度器”，保证传入的Props符合声明的规则。
 * @param {Data} rawProps 父组件传入的原始Props对象（未标准化，可能是kebab-case命名）
 * @param {Data} props 组件内部已解析的Props响应式对象（最终生效的Props值）
 * @param {ComponentInternalInstance} instance 组件内部实例（包含Props配置、上下文等）
 * @returns {void} 无返回值，校验不通过时开发环境会触发警告
 */
function validateProps(
  rawProps: Data,
  props: Data,
  instance: ComponentInternalInstance,
) {
  // ========== 步骤1：解响应式 → 获取Props的原始值（避免校验时触发依赖收集） ==========
  // toRaw：剥离响应式包装，拿到纯对象（校验Props值无需响应式，提升性能）
  const resolvedValues = toRaw(props)

  // ========== 步骤2：获取标准化的Props配置（来自normalizePropsOptions的处理结果） ==========
  // instance.propsOptions[0]：标准化后的Props对象（key=驼峰命名，value=Prop校验规则）
  const options = instance.propsOptions[0]

  // ========== 步骤3：预处理原始Props的key → 转换为驼峰命名（用于判断Prop是否未传入） ==========
  // 遍历原始Props的所有key，转换为驼峰命名（如'foo-bar'→'fooBar'），存入数组
  // 作用：后续判断某个Prop是否“完全未传入”（父组件没写这个Prop）
  const camelizePropsKey = Object.keys(rawProps).map(key => camelize(key))

  // ========== 步骤4：遍历所有标准化Props配置 → 逐个执行校验 ==========
  for (const key in options) {
    // 获取当前Prop的标准化校验规则（如type、required、validator等）
    let opt = options[key]
    // 跳过无配置的Prop（理论上不会出现，兜底处理）
    if (opt == null) continue

    // ========== 核心：调用validateProp执行单个Prop的精准校验 ==========
    validateProp(
      key, // 当前校验的Prop名称（驼峰命名）
      resolvedValues[key], // 当前Prop的实际值（解响应式后的原始值）
      opt, // 当前Prop的标准化校验规则
      // 开发环境：包装为浅层只读对象（避免校验函数意外修改Props值）；生产环境：直接用原始值
      __DEV__ ? shallowReadonly(resolvedValues) : resolvedValues,
      // 标记该Prop是否“完全未传入”：原始Props的驼峰key数组中不包含当前key → 未传入
      !camelizePropsKey.includes(key),
    )
  }
}

/**
 * dev only
 */
/**
 * Vue3 内部核心函数 - 单个Prop的【精准校验执行者】
 * 核心使命：
 *    1. 校验Prop必填性：声明required=true但未传入时抛出警告；
 *    2. 跳过非必填且值为空的Prop：无需校验；
 *    3. 校验Prop类型：匹配声明的type（支持数组类型，如[type: [String, Number]]）；
 *    4. 执行自定义校验函数：validator返回false时抛出警告；
 *    5. 开发环境仅：抛出精准的校验失败警告，生产环境无开销；
 * 核心关联：被validateProps调用，是Vue Props校验体系的“最小执行单元”，决定单个Prop是否合法。
 *
 *
 * @param {string} name 当前校验的Prop名称（驼峰命名，如fooBar）
 * @param {unknown} value 当前Prop的实际值（解响应式后的原始值）
 * @param {PropOptions} prop 当前Prop的标准化校验规则（type/required/validator等）
 * @param {Data} props 组件完整的Props对象（供自定义validator使用）
 * @param {boolean} isAbsent 该Prop是否完全未传入（true=父组件没写这个Prop，false=传了但值可能为null/undefined）
 * @returns {void} 无返回值，校验失败时开发环境触发console警告
 */
function validateProp(
  name: string,
  value: unknown,
  prop: PropOptions,
  props: Data,
  isAbsent: boolean,
) {
  // ========== 步骤1：解构Prop的核心校验规则 ==========
  const { type, required, validator, skipCheck } = prop

  // ========== 分支1：校验必填性（required=true但完全未传入） ==========
  // required!
  if (required && isAbsent) {
    warn('Missing required prop: "' + name + '"') // 缺少必需的道具
    return
  }

  // ========== 分支2：非必填且值为空（null/undefined）→ 跳过校验 ==========
  // 场景：Prop声明非必填，且传入值为null/undefined（可能是默认值未触发，或父组件传了undefined）
  // missing but optional 缺失但可选
  if (value == null && !required) {
    return
  }

  // ========== 分支3：校验Prop类型（有type规则且未跳过校验） ==========
  // 条件：type存在 + type不是true（内部标记） + 未标记skipCheck（跳过校验）
  // type check
  if (type != null && type !== true && !skipCheck) {
    let isValid = false // 类型是否匹配的标记
    // 统一格式：将单个type转为数组（如type: String → [String]，兼容type: [String, Number]）
    const types = isArray(type) ? type : [type]
    const expectedTypes = [] // 收集期望的类型名称（用于警告信息）

    // 遍历所有声明的类型，只要匹配其中一个则类型校验通过
    // value is valid as long as one of the specified types match 只要指定类型之一匹配，值就有效
    for (let i = 0; i < types.length && !isValid; i++) {
      // 核心：调用assertType校验当前值是否匹配指定类型
      // 返回值：valid（是否匹配）、expectedType（期望的类型名称，如"Number"/"Array"）
      const { valid, expectedType } = assertType(value, types[i])
      expectedTypes.push(expectedType || '') // 收集期望类型（用于拼接警告信息）
      isValid = valid // 只要有一个类型匹配，isValid变为true，循环终止
    }

    // 类型校验失败 → 抛出精准的类型不匹配警告
    if (!isValid) {
      warn(getInvalidTypeMessage(name, value, expectedTypes))
      return
    }
  }

  // ========== 分支4：执行自定义校验函数（有validator且未跳过前面的校验） ==========
  // 条件：有自定义validator + validator执行返回false（校验失败）
  // custom validator
  if (validator && !validator(value, props)) {
    warn('Invalid prop: custom validator check failed for prop "' + name + '".') // 无效的道具：道具的自定义验证器检查失败
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
/**
 * 检查值是否符合指定的类型
 * 该函数用于开发环境中的类型验证，检查给定值是否与期望的 Prop 类型匹配
 *
 * @param value - 要检查类型的值，可以是任意类型
 * @param type - 用于验证的 Prop 构造函数或 null
 * @returns 返回一个对象，包含验证结果和期望的类型名称
 */
function assertType(
  value: unknown,
  type: PropConstructor | null,
): AssertionResult {
  let valid
  // 获取期望的类型名称
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
