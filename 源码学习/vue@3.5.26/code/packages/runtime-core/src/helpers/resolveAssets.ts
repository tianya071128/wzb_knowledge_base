import {
  type ComponentOptions,
  type ConcreteComponent,
  currentInstance,
  getComponentName,
} from '../component'
import { currentRenderingInstance } from '../componentRenderContext'
import type { Directive } from '../directives'
import { camelize, capitalize, isString } from '@vue/shared'
import { warn } from '../warning'
import type { VNodeTypes } from '../vnode'

export const COMPONENTS = 'components'
export const DIRECTIVES = 'directives'
export const FILTERS = 'filters'

export type AssetTypes = typeof COMPONENTS | typeof DIRECTIVES | typeof FILTERS

/**
 * @private
 */
export function resolveComponent(
  name: string,
  maybeSelfReference?: boolean,
): ConcreteComponent | string {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name
}

export const NULL_DYNAMIC_COMPONENT: unique symbol = Symbol.for('v-ndc')

/**
 * @private
 */
/**
 * Vue3 动态组件解析核心函数（<component :is="xxx"> 的底层实现）
 * 核心作用：
 *    1. 标准化动态组件的入参：处理字符串/非字符串类型的组件参数，返回合法的 VNodeTypes；
 *    2. 字符串参数解析：优先从当前组件的组件注册表（COMPONENTS）中查找全局/局部注册的组件；
 *    3. 容错处理：非字符串/非法类型参数返回兜底值，交由后续 createVNode 处理并抛出警告；
 *
 * @param component 动态组件参数（用户传入的 :is 绑定值），类型未知（unknown）：
 *   - 字符串：如 "MyComponent"（注册的组件名）、"div"（原生标签）；
 *   - 组件对象：如 defineComponent 定义的组件、异步组件；
 *   - 非法值：undefined/null/数字等；
 *
 * @returns VNodeTypes 合法的 VNode 类型（组件/原生标签/兜底空组件），保证后续 createVNode 能处理；
 */
export function resolveDynamicComponent(component: unknown): VNodeTypes {
  // 场景1：传入的是字符串类型（最常见，如 :is="'MyComponent'" 或 :is="'div'"）
  if (isString(component)) {
    // 如果是组件字符串, 尝试从组件注册表中解析组件
    // 否则就会返回本身(如 'div' 等本机元素)
    return resolveAsset(COMPONENTS, component, false) || component
  }
  // 场景2：非字符串类型（组件对象/undefined/null/数字等）
  else {
    // invalid types will fallthrough to createVNode and raise warning 无效类型将转而创建VNode并引发警告
    // 在这里不处理警告, 有创建VNode的方法进行警告
    return (component || NULL_DYNAMIC_COMPONENT) as any
  }
}

/**
 * @private
 */
export function resolveDirective(name: string): Directive | undefined {
  return resolveAsset(DIRECTIVES, name)
}

/**
 * v2 compat only
 * @internal
 */
export function resolveFilter(name: string): Function | undefined {
  return resolveAsset(FILTERS, name)
}

/**
 * @private
 * overload 1: components 过载1：组件
 */
function resolveAsset(
  type: typeof COMPONENTS,
  name: string,
  warnMissing?: boolean,
  maybeSelfReference?: boolean,
): ConcreteComponent | undefined
// overload 2: directives 重载 2：指令
function resolveAsset(
  type: typeof DIRECTIVES,
  name: string,
): Directive | undefined
// implementation
// overload 3: filters (compat only) 过载 3：过滤器（仅限兼容）
function resolveAsset(type: typeof FILTERS, name: string): Function | undefined
// implementation
/**
 * Vue3 资产解析核心函数（组件/指令等注册资源的查找逻辑）
 * 核心作用：
 *    1. 按优先级解析资产：组件自引用 → 局部注册 → 全局注册 → 自引用兜底；
 *    2. 名称兼容：支持短横线（kebab-case）、驼峰（camelCase）、首字母大写（PascalCase）的名称匹配；
 *    3. 开发环境友好：未找到资产时输出精准警告，组件类型还会提示自定义元素排除方案；
 *    4. 上下文校验：仅允许在 render/setup 中调用，避免非法上下文使用；
 *
 * @param type 资产类型（AssetTypes）：如 COMPONENTS（组件）、DIRECTIVES（指令）；
 * @param name 要解析的资产名称（字符串）：如 "my-component"、"MyComponent"、"v-model"；
 * @param warnMissing 是否在未找到时抛出警告（默认 true）；
 * @param maybeSelfReference 是否允许兜底到组件自引用（默认 false）；
 *
 * @returns 解析到的资产（组件/指令对象）| undefined（未找到）；
 */
function resolveAsset(
  type: AssetTypes,
  name: string,
  warnMissing = true,
  maybeSelfReference = false,
) {
  // 1. 获取当前组件实例（渲染/setup 上下文）
  // currentRenderingInstance：渲染阶段的组件实例；currentInstance：setup 阶段的组件实例；
  // 无实例则后续直接抛警告（仅允许在 render/setup 中调用）
  const instance = currentRenderingInstance || currentInstance
  if (instance) {
    const Component = instance.type // 当前组件的类型（选项式/组合式组件对象）

    // 2. 优先级1：组件显式自引用（仅资产类型为 COMPONENTS 时生效）
    // 场景：组件内部引用自身（如递归组件 <MyComponent><MyComponent/></MyComponent>）
    // explicit self name has highest priority 明确的自我名称具有最高优先级
    if (type === COMPONENTS) {
      // 获取组件的显式名称
      const selfName = getComponentName(
        Component,
        false /* do not include inferred name to avoid breaking existing code 不包含推断的名称以避免破坏现有代码 */,
      )
      if (
        selfName && // 完全匹配（如 "MyComponent" === "MyComponent"）
        (selfName === name ||
          selfName === camelize(name) || // 驼峰匹配（如 "MyComponent" === camelize("my-component")）
          selfName === capitalize(camelize(name))) // 首字母大写匹配（如 "MyComponent" === capitalize(camelize("my-component"))）
      ) {
        return Component
      }
    }

    // 3. 优先级2：局部注册 → 优先级3：全局注册
    const res =
      // local registration 本地注册
      // check instance[type] first which is resolved for options API 首先检查 instance[type]，该实例已针对选项API进行解析
      resolve(instance[type] || (Component as ComponentOptions)[type], name) ||
      // global registration 全局注册
      resolve(instance.appContext[type], name)

    // 4. 优先级4：隐式自引用兜底（仅未找到资产且允许自引用时生效）
    if (!res && maybeSelfReference) {
      // fallback to implicit self-reference 回退到隐式自引用
      return Component
    }

    // 5. 开发环境警告：未找到资产且开启 warnMissing
    if (__DEV__ && warnMissing && !res) {
      const extra =
        type === COMPONENTS
          ? `\nIf this is a native custom element, make sure to exclude it from ` + // n如果这是本机自定义元素，请确保将其排除在外
            `component resolution via compilerOptions.isCustomElement.` // 通过compilerOptions.isCustomElement进行组件解析
          : ``
      warn(`Failed to resolve ${type.slice(0, -1)}: ${name}${extra}`) // 未能解决
    }

    return res
  } else if (__DEV__) {
    warn(
      `resolve${capitalize(type.slice(0, -1))} ` +
        `can only be used in render() or setup().`, // 只能在 render() 或 setup() 中使用
    )
  }
}

/**
 * 在注册表中根据名称查找资产（组件、指令等）
 * 尝试按以下顺序查找：原始名称 -> 驼峰格式 -> 首字母大写格式
 *
 * @param registry - 资产注册表，键值对形式存储已注册的资产
 * @param name - 要查找的资产名称
 * @returns 找到的资产对象，如果未找到则返回 undefined
 */
function resolve(registry: Record<string, any> | undefined, name: string) {
  return (
    registry &&
    (registry[name] ||
      registry[camelize(name)] ||
      registry[capitalize(camelize(name))])
  )
}
