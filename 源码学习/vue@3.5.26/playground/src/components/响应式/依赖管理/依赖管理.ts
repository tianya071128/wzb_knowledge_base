import { reactive } from 'vue';
import { mutableHandlers } from '../../../../../code/packages/reactivity/src/baseHandlers';
import { Dep } from '../../../../../code/packages/reactivity/src/dep';

/**
 * 1. 核心角色
 *
 *            角色	            核心定义	                                     典型例子
 *
 *         响应式数据          被监听的数据（ref/reactive/computed           ref(1)、reactive({ a: 1 })
 *                            等），数据变化时会通知依赖它的副作用
 *
 *    副作用函数（Effect）     依赖响应式数据的函数，数据变化时需要重新执行    组件渲染函数、watch 回调、computed getter
 * 也可称为订阅者(Subscriber)
 *
 *    依赖管理器（Dep）        连接 “响应式数据” 和 “副作用函数” 的           RefImpl.dep、ComputedRefImpl.dep
 *                            桥梁，负责收集 / 触发副作用
 *
 *
 *  简单来说：响应式数据 → Dep 收集副作用 → 数据变化 → Dep 触发副作用重新执行
 */

/**
 * 2. 核心流程: Vue3 依赖管理分为依赖收集（Track） 和更新触发（Trigger） 两个核心阶段
 */

/**
 * 2.1 依赖收集（Track）—— “记录谁在用我”
 *     - 当副作用函数执行时，访问到响应式数据，此时会触发数据的 get 拦截器，执行依赖收集逻辑
 *         -- reactive、readonly等：在 mutableHandlers 相关处理器的 get、has、ownKeys 拦截器中的 track 方法中
 *         -- ref 相关: 在 RefImpl 类中使用 dep 属性存放当前的 dep 管理器, 在 value 的 get 拦截器中触发收集 --> this.dep.track()
 *         -- computed: 在 ComputedRefImpl 类中定义了 dep 属性, 在 value 的 get 拦截器中触发收集 -> this.dep.track()
 *
 *     - **主要通过 dep 类来执行依赖管理**
 *         -- reactive、readonly等会根据 target(对象) 和对象中在检索对应的 Dep 类
 */

/**
 * 2.2 阶段 2：更新触发（Trigger）—— “我变了，通知用我的人”
 *      - 当响应式数据被修改时，触发数据的 set 拦截器，执行更新触发逻辑
 */
