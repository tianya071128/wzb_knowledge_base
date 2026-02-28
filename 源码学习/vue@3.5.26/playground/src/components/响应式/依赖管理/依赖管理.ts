import { reactive, ref, computed } from 'vue';
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
 *         -- reactive、readonly等：在 mutableHandlers 相关处理器的 get、has、ownKeys 拦截器中会调用 track 方法中
 *         -- ref 相关: 在 RefImpl 类中使用 dep 属性存放当前的 dep 管理器, 在 value 的 get 拦截器中触发收集 --> this.dep.track()
 *         -- computed: 在 ComputedRefImpl 类中定义了 dep 属性, 在 value 的 get 拦截器中触发收集 -> this.dep.track()
 *
 *     - **主要通过 dep 类来执行依赖管理**
 *         -- reactive、readonly等会根据 target(对象) 和属性在检索对应的 Dep 类
 *         -- ref 相关: 在 RefImpl 类中，自行维护 dep 属性来收集对 value 属性的依赖
 *               --- 因为 ref 可能是简单类型, 无法在全局中维护
 *               --- 对于复杂类型的 ref, 对于复杂类型属性的依赖收集, 会根据是否为深度响应来决定是否走 reactive、readonly 相关流程的逻辑
 *         -- computed: 在 ComputedRefImpl 类中，自行维护 dep 属性来收集对 value 属性的依赖
 *     - 具体逻辑见 packages/reactivity/src/dep 文件中的 Dep.track() 和 track()
 */

/**
 * 2.2 阶段 2：更新触发（Trigger）—— “我变了，通知用我的人”
 *      - 当响应式数据被修改时，触发数据的 set 拦截器，执行更新触发逻辑
 *          -- reactive、readonly等：在 mutableHandlers 相关处理器的 set、deleteProperty 拦截器中, 会调用 trigger 方法中
 *          -- ref 相关: 在 RefImpl 类中使用 dep 属性存放当前的 dep 管理器, 在 value 的 set 拦截器中触发更新 --> this.dep.trigger()
 *          -- computed: 计算属性并不是一个具体的值, 在 set 中, 会调用 setter 函数, 在这个函数由用户决定更新具体的值
 *               --- 只有当 compute 的 getter 函数中依赖值变化后, 在其他地方会通知 compute.dep.trigger() 触发更新
 *
 *      - 对于 reactive、readonly 而言, 通过调用 trigger() 方法来触发依赖变更
 *         -- 根据「响应式对象 + 修改类型 + 属性/索引」，从 targetMap 中找到关联的 Dep 实例；
 *         -- 重要: **根据操作类型的不同, 可能需要触发多个附带的 dep, 最终执行 dep.trigger() **
 *               --- e.g: 删除对象属性后, 需要触发 ITERATE_KEY(如 for...in 等遍历对象操作绑定的 Key）
 *               --- e.g: 删除数组项后, 需要触发 length 属性的 dep --> 因为 length 变化了
 *
 *      - 对于 ref 而言, 因为只需要维护 value 属性, 嵌套属性的维护由其他的响应式数据维护，所以直接调用 ref.dep.trigger() 方法
 *
 *      - 不管最终如何, 都是调用 dep.subs 订阅者链表来处理所有的订阅者, 之后调用 sub.trigger() 方法, 将控制权移交到订阅者手中
 *          -- 这一部分参考 ../监听器 部分
 *
 *      - 具体逻辑见 packages/reactivity/src/dep 文件中的 Dep.trigger() 和 trigger()
 */

/**
 * 3. 大致流程
 *
 *                                reactive、readonly、Ref 等等
 *                                             |
 *                                             | 每个属性都会绑定一个 Dep 类, 用于依赖管理 --> 惰性的, 不会在初始化中直接绑定
 *                                             |
 *                                           Dep 类
 *                                      /              \
 *       会触发响应式数据对应 get 拦截器 /                \ 当改变响应式数据时, 触发对应的 set(或 deleteProperty) 拦截器
 *       从而最终调用 dep.track() 方法 /                  \  从而最终调用 dep.trigger() 方法
 *                                  /                    \
 *                      访问响应式数据                      响应式数据变更
 *                                  \                     /
 *                                   \                   /
 *           Subscriber 其内部都有一个 \                  / dep 在通知 Subscriber.trigger() 方法
 *     fn 函数, 在该函数中访问响应式数据 \                /  最终会根据实际来重新运行 fn 函数
 *                                      \              /
 *                                        Subscriber 类:
 *                                            |
 *                                            | 实现都是基于 Subscriber 类, 用于订阅响应式数据
 *                                            |
 *                                       watch、watchEffect、组件渲染 等等
 */
