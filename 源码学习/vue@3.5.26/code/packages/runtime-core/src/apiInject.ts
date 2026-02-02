import { isFunction } from '@vue/shared'
import { currentInstance, getCurrentInstance } from './component'
import { currentApp } from './apiCreateApp'
import { warn } from './warning'

interface InjectionConstraint<T> {}

export type InjectionKey<T> = symbol & InjectionConstraint<T>

/**
 * Vue3 核心公共API - 依赖注入体系的**提供端**，用于在组件中提供可向下跨层级传递的依赖值，供子孙组件通过`inject`获取
 *
 * 核心关联：与`inject`配对使用，构成Vue3跨层级组件通信的核心方案，替代传统的`props`逐层透传/事件总线，
 *            依赖于Vue内部的组件实例（`currentInstance`），是组件实例化阶段的核心API。
 *
 * 核心设计：原型链继承的 provides 机制（依赖传递的底层原理）
 *            -- 通过 Object.create(parentProvides) 创建以父provides为原型的新对象，并将新对象赋值给当前组件的provides
 *            -- 依赖查找高效：子孙组件inject时，仅需查找自身provides，若不存在则通过原型链自动向上查找（父→祖父→曾祖父...），无需 Vue 手动遍历组件树，性能最优；
 *            -- 依赖隔离：子组件修改自身provides（添加 / 修改依赖），只会影响自身和子孙组件，不会修改父组件的 provides，避免跨组件的依赖污染
 *            -- 依赖重写：子组件可通过相同的key提供新值，覆盖父组件的依赖，实现局部依赖重写，不影响上层组件；
 *
 *
 * @template T 提供的依赖值的基础类型，若未使用`InjectionKey`，则直接使用该类型做类型约束
 * @template K 注入键的类型，支持Vue内置`InjectionKey`（带类型的符号）、字符串、数字，是依赖的唯一标识
 * @param {K} key 依赖注入的唯一键，用于子孙组件`inject`时精准匹配对应的值，支持类型化的`InjectionKey`
 * @param {K extends InjectionKey<infer V> ? V : T} value 要提供的依赖值，具备**智能类型推导**：
 *                                                          1. 若key是`InjectionKey`，则值的类型强制为其泛型推断的V；
 *                                                          2. 若key是普通字符串/数字，则值的类型为泛型T；
 * @returns {void} 无返回值，仅完成依赖的注册和提供对象的初始化
 */
export function provide<T, K = InjectionKey<T> | string | number>(
  key: K,
  value: K extends InjectionKey<infer V> ? V : T,
): void {
  // 开发环境专属校验：限制provide仅能在组件setup()阶段调用
  if (__DEV__) {
    // 触发警告条件：1. 无当前组件实例（如全局环境、非组件作用域调用）；2. 组件已挂载（isMounted=true）
    if (!currentInstance || currentInstance.isMounted) {
      warn(`provide() can only be used inside setup().`) // Provide() 只能在 setup() 内部使用。
    }
  }

  // 仅当存在当前组件实例时执行核心逻辑，避免非组件环境调用报错
  if (currentInstance) {
    // 获取当前组件实例的依赖提供对象，初始时指向父组件的provides（原型链继承）
    let provides = currentInstance.provides
    // by default an instance inherits its parent's provides object 默认情况下，实例继承其父级的提供对象
    // but when it needs to provide values of its own, it creates its 但当它需要提供自己的价值时，它就会创造自己的价值
    // own provides object using parent provides object as prototype.自己提供的对象使用父提供的对象作为原型。
    // this way in `inject` we can simply look up injections from direct 这样在“inject”中我们可以简单地从直接查找注入
    // parent and let the prototype chain do the work. 父级并让原型链完成工作。
    const parentProvides =
      currentInstance.parent && currentInstance.parent.provides
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides)
    }
    // TS doesn't allow symbol as index type TS 不允许符号作为索引类型
    provides[key as string] = value
  }
}

export function inject<T>(key: InjectionKey<T> | string): T | undefined
export function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T,
  treatDefaultAsFactory?: false,
): T
export function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T | (() => T),
  treatDefaultAsFactory: true,
): T

/**
 * Vue3 核心公共API - 依赖注入体系的**注入端**，与`provide`配对使用，用于跨层级查找上层组件/应用提供的依赖值
 *
 * 核心关联：与`provide`构成Vue3跨层级组件通信核心方案，依赖`currentInstance`/`currentApp`获取查找载体，
 *            支持`InjectionKey`类型化查找，兼容Vue3的组件实例体系和应用实例体系。
 *
 * 核心设计: 通过 provides 原型链查找
 *
 * @param {InjectionKey<any> | string} key 依赖注入的唯一键，与`provide`的key一一对应，支持类型化`InjectionKey`和普通字符串
 * @param {unknown} [defaultValue] 可选默认值，依赖未找到时返回该值；若开启`treatDefaultAsFactory`，可为工厂函数
 * @param {boolean} [treatDefaultAsFactory=false] 是否将默认值视为工厂函数，为`true`时若`defaultValue`是函数则执行并返回结果
 * @returns {unknown} 查找到的依赖值、默认值（或工厂函数执行结果）；未找到且无默认值时返回`undefined`（开发环境抛警告）
 */
export function inject(
  key: InjectionKey<any> | string,
  defaultValue?: unknown,
  treatDefaultAsFactory = false,
) {
  // fallback to `currentRenderingInstance` so that this can be called in 回退到“currentRenderingInstance”，以便可以在
  // a functional component 功能组件
  // 核心：获取当前组件实例，回退到`currentRenderingInstance`以支持**函数式组件**（函数式组件无常规实例）
  const instance = getCurrentInstance()

  // also support looking up from app-level provides w/ `app.runWithContext()` 还支持从应用程序级别查找提供 w/`app.runWithContext()`
  // 执行依赖查找的前提：存在组件实例 或 存在当前应用实例（支持app.runWithContext()的应用级依赖查找）
  if (instance || currentApp) {
    // #2400
    // to support `app.use` plugins, 为了支持 `app.use` 插件，
    // fallback to appContext's `provides` if the instance is at root 如果实例位于根目录，则回退到 appContext 的 `provides`
    // #11488, in a nested createApp, prioritize using the provides from currentApp #11488，在嵌套的createApp中，优先使用currentApp中的provides
    // #13212, for custom elements we must get injected values from its appContext #13212，对于自定义元素，我们必须从其appContext中获取注入的值
    // as it already inherits the provides object from the parent element 因为它已经从父元素继承了provides对象

    // 重点：根据运行场景动态确定依赖查找的根载体`provides`，适配多场景（嵌套createApp/根组件/自定义元素/普通组件）
    let provides =
      // 场景1：存在currentApp（如app.runWithContext()包裹）→ 使用应用级provides
      currentApp
        ? currentApp._context.provides
        : // 场景2：存在组件实例 → 区分根组件/自定义元素 vs 普通子组件
          instance
          ? // 子场景2-1：根组件（无父）/自定义元素模式 → 从VNode的应用上下文获取provides
            instance.parent == null || instance.ce
            ? instance.vnode.appContext && instance.vnode.appContext.provides
            : instance.parent.provides // 子场景2-2：普通子组件 → 从父组件的provides开始向上查找（依托原型链）
          : // 场景3：无实例无应用 → provides为undefined
            undefined

    // 核心查找逻辑：判断key是否存在于provides（含原型链，因provide的provides基于原型链创建）
    if (provides && (key as string | symbol) in provides) {
      // TS doesn't allow symbol as index type TS 不允许符号作为索引类型
      return provides[key as string]
    }
    // 依赖未找到 → 处理默认值：判断是否传递了默认值（通过参数长度，避免默认值为undefined的误判）
    else if (arguments.length > 1) {
      // 若开启工厂函数模式 且 默认值是函数 → 执行工厂函数并返回结果，执行上下文绑定到组件代理（保证this指向组件）
      // 否则 → 直接返回默认值
      return treatDefaultAsFactory && isFunction(defaultValue)
        ? defaultValue.call(instance && instance.proxy)
        : defaultValue
    } else if (__DEV__) {
      warn(`injection "${String(key)}" not found.`) // 未找到注入“${String(key)}”
    }
  } else if (__DEV__) {
    warn(`inject() can only be used inside setup() or functional components.`) // ject() 只能在 setup() 或功能组件内部使用
  }
}

/**
 * Returns true if `inject()` can be used without warning about being called in the wrong place (e.g. outside of 如果可以使用`inject()`而不警告在错误的地方调用（例如在外部），则返回 true
 * setup()). This is used by libraries that want to use `inject()` internally without triggering a warning to the end 设置（））。这是由想要在内部使用“inject()”而不最终触发警告的库使用的
 * user. One example is `useRoute()` in `vue-router`. 用户。一个例子是“vue-router”中的“useRoute()”。
 */
export function hasInjectionContext(): boolean {
  return !!(getCurrentInstance() || currentApp)
}
