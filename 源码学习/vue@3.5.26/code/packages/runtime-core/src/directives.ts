/**
Runtime helper for applying directives to a vnode. Example usage: 用于将指令应用到 vnode 的运行时助手。用法示例

const comp = resolveComponent('comp')
const foo = resolveDirective('foo')
const bar = resolveDirective('bar')

return withDirectives(h(comp), [
  [foo, this.x],
  [bar, this.y]
])
*/

import type { VNode } from './vnode'
import { EMPTY_OBJ, isBuiltInDirective, isFunction } from '@vue/shared'
import { warn } from './warning'
import {
  type ComponentInternalInstance,
  type Data,
  getComponentPublicInstance,
} from './component'
import { currentRenderingInstance } from './componentRenderContext'
import { ErrorCodes, callWithAsyncErrorHandling } from './errorHandling'
import type { ComponentPublicInstance } from './componentPublicInstance'
import { mapCompatDirectiveHook } from './compat/customDirective'
import { pauseTracking, resetTracking, traverse } from '@vue/reactivity'

export interface DirectiveBinding<
  Value = any,
  Modifiers extends string = string,
  Arg = any,
> {
  instance: ComponentPublicInstance | Record<string, any> | null
  value: Value
  oldValue: Value | null
  arg?: Arg
  modifiers: DirectiveModifiers<Modifiers>
  dir: ObjectDirective<any, Value, Modifiers, Arg>
}

export type DirectiveHook<
  HostElement = any,
  Prev = VNode<any, HostElement> | null,
  Value = any,
  Modifiers extends string = string,
  Arg = any,
> = (
  el: HostElement,
  binding: DirectiveBinding<Value, Modifiers, Arg>,
  vnode: VNode<any, HostElement>,
  prevVNode: Prev,
) => void

export type SSRDirectiveHook<
  Value = any,
  Modifiers extends string = string,
  Arg = any,
> = (
  binding: DirectiveBinding<Value, Modifiers, Arg>,
  vnode: VNode,
) => Data | undefined

export interface ObjectDirective<
  HostElement = any,
  Value = any,
  Modifiers extends string = string,
  Arg = any,
> {
  /**
   * @internal without this, ts-expect-error in directives.test-d.ts somehow 如果没有这个，directives.test-d.ts 中的 ts-expect-error 会以某种方式出现
   * fails when running tsc, but passes in IDE and when testing against built 运行 tsc 时失败，但在 IDE 中以及针对构建进行测试时通过
   * dts. Could be a TS bug. dts。可能是TS的bug
   */
  __mod?: Modifiers
  created?: DirectiveHook<HostElement, null, Value, Modifiers, Arg>
  beforeMount?: DirectiveHook<HostElement, null, Value, Modifiers, Arg>
  mounted?: DirectiveHook<HostElement, null, Value, Modifiers, Arg>
  beforeUpdate?: DirectiveHook<
    HostElement,
    VNode<any, HostElement>,
    Value,
    Modifiers,
    Arg
  >
  updated?: DirectiveHook<
    HostElement,
    VNode<any, HostElement>,
    Value,
    Modifiers,
    Arg
  >
  beforeUnmount?: DirectiveHook<HostElement, null, Value, Modifiers, Arg>
  unmounted?: DirectiveHook<HostElement, null, Value, Modifiers, Arg>
  getSSRProps?: SSRDirectiveHook<Value, Modifiers, Arg>
  deep?: boolean
}

export type FunctionDirective<
  HostElement = any,
  V = any,
  Modifiers extends string = string,
  Arg = any,
> = DirectiveHook<HostElement, any, V, Modifiers, Arg>

export type Directive<
  HostElement = any,
  Value = any,
  Modifiers extends string = string,
  Arg = any,
> =
  | ObjectDirective<HostElement, Value, Modifiers, Arg>
  | FunctionDirective<HostElement, Value, Modifiers, Arg>

export type DirectiveModifiers<K extends string = string> = Partial<
  Record<K, boolean>
>

/**
 * 验证指令名称是否有效
 * 检查给定的指令名称是否不是内置指令ID，如果是则发出警告
 *
 * @param name - 要验证的指令名称
 */
export function validateDirectiveName(name: string): void {
  if (isBuiltInDirective(name)) {
    warn('Do not use built-in directive ids as custom directive id: ' + name) // 不要使用内置指令 id 作为自定义指令 id
  }
}

// Directive, value, argument, modifiers 指令、值、参数、修饰符
export type DirectiveArguments = Array<
  | [Directive | undefined]
  | [Directive | undefined, any]
  | [Directive | undefined, any, any]
  | [Directive | undefined, any, any, DirectiveModifiers]
>

/**
 * Adds directives to a VNode. 向 VNode 添加指令
 */
/**
 * Vue3 核心工具函数：为虚拟节点（VNode）绑定指令的便捷封装
 *
 * 核心作用：替代手动操作 vnode.dirs 数组，提供更简洁的指令绑定语法，专门用于渲染函数（h 函数/setup 渲染函数）中，
 *          自动处理「函数式指令转换、深度依赖收集、指令绑定对象构建」等底层逻辑，简化指令使用成本
 *
 * 核心特点：1. 兼容函数式/对象式两种指令写法 2. 自动处理深度监听的依赖收集 3. 容错处理空指令 4. 保持VNode类型不变
 *
 * @template T 泛型约束，保证入参和返回值为同一类型的 VNode，保持类型一致性
 * @param vnode 要绑定指令的目标虚拟节点（VNode），引用类型，修改其内部 dirs 属性完成指令绑定
 * @param directives 指令配置参数数组，类型为 DirectiveArguments（Vue 内部定义，二维数组结构）
 *                   每一项格式：[指令对象/函数, 指令值, 指令参数, 指令修饰符]，后三项可选
 * @returns T 原虚拟节点（引用类型，仅修改内部属性，无新对象创建）
 */
export function withDirectives<T extends VNode>(
  vnode: T,
  directives: DirectiveArguments,
): T {
  // 1. 校验使用环境：currentRenderingInstance是Vue内部当前正在渲染的组件实例
  //    为空说明不在渲染函数内部调用（如全局/普通函数中），开发环境触发警告，直接返回原VNode
  if (currentRenderingInstance === null) {
    __DEV__ && warn(`withDirectives can only be used inside render functions.`) // withDirectives 只能在渲染函数内部使用
    return vnode
  }

  // 2. 获取当前组件的**公共实例**（对外暴露的组件实例，而非内部ComponentInternalInstance）
  //    赋值给指令绑定对象，供指令钩子函数中访问组件实例使用
  const instance = getComponentPublicInstance(currentRenderingInstance)

  // 3. 初始化/获取VNode的指令绑定数组：
  //    - 若vnode已有dirs（已绑定其他指令），直接使用；
  //    - 若无则初始化空数组，并赋值给vnode.dirs（引用类型，修改原VNode对象）
  const bindings: DirectiveBinding[] = vnode.dirs || (vnode.dirs = [])

  // 4. 遍历所有传入的指令配置，逐个处理并构建指令绑定对象
  for (let i = 0; i < directives.length; i++) {
    // 解构单条指令的配置：[指令核心对象/函数, 指令值, 指令参数, 指令修饰符]
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i]

    // 容错处理：若指令为falsy值（null/undefined/false），直接跳过，不绑定无效指令
    if (dir) {
      // 5. 处理**函数式指令**：Vue支持两种指令写法，若传入的是纯函数，自动转换为对象式指令
      //    函数式指令的语义：单个函数同时作为 mounted 和 updated 钩子（挂载/更新时均执行）
      if (isFunction(dir)) {
        dir = {
          mounted: dir, // 挂载阶段执行该函数
          updated: dir, // 更新阶段执行该函数
        } as ObjectDirective
      }

      // 6. 处理指令的**深度监听**：若指令配置了deep: true（深度监听绑定值）
      //    调用traverse深度遍历value，触发响应式值的**全量依赖收集**
      //    目的：保证指令能监听到对象/数组等复杂响应式值的**深层变化**（如obj.a.b、arr[0].name）
      if (dir.deep) {
        traverse(value)
      }

      // 7. 构建完整的指令绑定对象（DirectiveBinding），推入VNode的指令绑定数组
      bindings.push({
        dir, // 标准对象式指令（含钩子函数/配置）
        instance, // 组件公共实例，供指令钩子使用
        value, // 指令当前绑定值
        oldValue: void 0, // 旧值初始化为undefined，首次挂载无旧值，后续更新由invokeDirectiveHook赋值
        arg, // 指令参数（如v-xxx:msg中的msg）
        modifiers, // 指令修饰符（如v-xxx.trim中的trim，对象形式{ trim: true }）
      })
    }
  }

  // 8. 返回原VNode（引用类型，已修改其dirs属性绑定所有指令）
  return vnode
}

/**
 * Vue3 内部核心方法：执行虚拟节点上所有指令的指定钩子函数
 * 作用：作为指令生命周期的调度入口，统一处理指令钩子的执行、旧值传递、兼容映射、错误捕获、响应式追踪控制
 *
 * @param vnode 当期激活的虚拟节点(VNode)，包含当前要执行的指令绑定信息
 * @param prevVNode 上一个/旧的虚拟节点，可为null（如首次挂载时），用于获取指令的旧值
 * @param instance 组件内部实例(ComponentInternalInstance)，可为null，作为指令执行的上下文，同时用于错误处理、兼容映射
 * @param name 要执行的指令钩子名称，为ObjectDirective的键类型（如mounted/updated/beforeUnmount等）
 * @returns void 无返回值
 */
export function invokeDirectiveHook(
  vnode: VNode,
  prevVNode: VNode | null,
  instance: ComponentInternalInstance | null,
  name: keyof ObjectDirective,
): void {
  // 1. 获取当前虚拟节点上的所有指令绑定数组，非空断言(!)：源码中调用此方法前已确保vnode.dirs存在，无需额外判空
  const bindings = vnode.dirs!
  // 2. 获取旧虚拟节点的指令绑定数组（若存在），旧节点可能为null（如首次挂载），需先判断
  const oldBindings = prevVNode && prevVNode.dirs!

  // 3. 遍历当前所有指令绑定，逐个执行对应钩子
  for (let i = 0; i < bindings.length; i++) {
    // 获取当前遍历到的单个指令绑定对象（包含指令配置、绑定值、参数、修饰符等）
    const binding = bindings[i]

    // 4. 传递旧值：若存在旧虚拟节点的指令绑定，将旧值赋值给当前binding的oldValue
    // 目的：让指令的钩子函数（如updated）能访问到 binding.oldValue，实现新旧值对比
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value
    }

    // 5. 获取当前指令配置中对应的钩子函数
    // 类型断言：hook可能是「单个指令钩子函数」或「钩子函数数组」，也可能为undefined（指令未实现该钩子）
    let hook = binding.dir[name] as DirectiveHook | DirectiveHook[] | undefined

    // 6. 兼容模式处理：__COMPAT__是Vue3的兼容开关（开启时支持Vue2指令语法）
    // 若当前指令未实现目标钩子，且开启了兼容模式，通过mapCompatDirectiveHook映射Vue2的指令钩子到Vue3
    if (__COMPAT__ && !hook) {
      hook = mapCompatDirectiveHook(name, binding.dir, instance)
    }

    // 7. 若钩子函数存在（原生实现/兼容映射后），执行钩子
    if (hook) {
      // disable tracking inside all lifecycle hooks 在所有生命周期钩子中禁用跟踪
      // since they can potentially be called inside effects. 因为它们可能被称为内部效应

      // 7.1 暂停响应式依赖追踪
      // 设计原因：指令钩子可能在响应式effect内部被调用，钩子执行过程中的操作无需触发依赖收集
      // 避免不必要的响应式依赖建立，防止性能损耗和响应式异常
      pauseTracking()

      // 7.2 带异步错误处理的钩子执行
      callWithAsyncErrorHandling(hook, instance, ErrorCodes.DIRECTIVE_HOOK, [
        vnode.el, // 指令绑定的真实DOM元素
        binding, // 指令绑定对象（包含value/oldValue/arg/modifiers等）
        vnode, // 当前虚拟节点
        prevVNode, // 旧虚拟节点（可为null）
      ])

      // 7.3 恢复响应式依赖追踪，保证后续代码的响应式正常工作
      resetTracking()
    }
  }
}
