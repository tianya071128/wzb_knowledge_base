import { provide, inject } from 'vue';

/**
 * 1. Provide (提供)
 *     - 来源:
 *        -- 应用级注入: app.provide()
 *        -- 在 steup 中, 使用 provide(key, value) 方法提供
 *        -- 在 options 中, 使用 provide: { key: value } 提供
 *     - 最终会将其注入挂载到 instance.provides 中
 *     - 核心设计：原型链继承的 provides 机制（依赖传递的底层原理）
 *          -- 通过 Object.create(parentProvides) 创建以父provides为原型的新对象，并将新对象赋值给当前组件的provides
 *          -- 依赖查找高效：子孙组件inject时，仅需查找自身provides，若不存在则通过原型链自动向上查找（父→祖父→曾祖父...），无需 Vue 手动遍历组件树，性能最优；
 *          -- 依赖隔离：子组件修改自身provides（添加 / 修改依赖），只会影响自身和子孙组件，不会修改父组件的 provides，避免跨组件的依赖污染
 *          -- 依赖重写：子组件可通过相同的key提供新值，覆盖父组件的依赖，实现局部依赖重写，不影响上层组件；
 */

/**
 * 2. Inject (注入)
 *     - 来源:
 *        -- 在 steup 中, 使用 inject(key, defaultValue) 方法注入
 *        -- 在 options 中, 使用 inject: { key: value } 注入
 *     - 根据多场景确定来源
 *        -- 存在 currentApp（如app.runWithContext()包裹）→ 直接使用应用级provides
 *        -- 不存在父组件 ->  → 从VNode的应用上下文获取provides
 *        -- 存在父组件 ->  → 从父组件的provides获取: instance.parent.provides
 *     - 提取注入值, 根据 Provide 的原型链机制, 会依次往上查找
 *     - 没有注入值时, 使用提供的默认值
 */

/**
 * 3. 注意:
 *      - 3.1 依赖注入必须在初始化时确定, 使用 steup, 需要在 steup 中同步使用
 *      - 3.2 响应式问题:
 *              -- 本来不会对依赖注入的值进行响应式处理, 但可以提供响应式的数据, 这样注入的组件使用时, 也就会响应式更新
 */
