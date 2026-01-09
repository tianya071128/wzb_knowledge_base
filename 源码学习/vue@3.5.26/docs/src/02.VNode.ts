import { VNode, h } from 'vue';

/**
 * VNode 就是一个 JavaScript 对象，这个对象是对「真实 DOM 节点」或「Vue 组件」的抽象描述
 *   - 用 JS 对象的属性，记录了节点的类型、属性、子节点、关联的真实 DOM 等所有核心信息。
 *   - 类型定义在 import { VNode } from 'vue' 查看
 */

/**
 * 创建方法主要由: _createVNode 方法创建, h 方法内部也是调用这个方法
 *  - 主要是根据 type 参数创建 VNode
 *  - 其次规范化一下 children、props 等参数，并返回 VNode]
 *
 *
 * 注意:
 *  - 创建 VNode 时, 碰到组件类型, 不会立即创建组件实例, 而是生成 VNode 对象, 待渲染时再创建组件实例, 并深度渲染
 */

/**
 * VNode 的 type 属性: 标记了当前 VNode 的类型, 会执行完全不同的渲染逻辑
 *  - string
 *      -- 原生HTML标签：'div'/'span'/'button' 等
 *      -- <div>Hello</div> → type: 'div' (string 类型，原生 DOM)
 *  - Component
 *      -- Vue组件：自定义组件、异步组件、全局组件等
 *      -- <MyComponent /> → type: MyComponent (Component 类型，自定义组件)
 *  - typeof Fragment
 *      -- 片段：无外层容器，解决多根节点问题
 *      -- 模板多根节点 → type: Fragment (Vue 自动包裹，无真实 DOM)
 *  - typeof Teleport
 *      -- 传送门：将子节点传送到指定 DOM 节点中
 *      --  <Teleport to="#app">...</Teleport> → type: Teleport (Vue 自动包裹，无真实 DOM)
 *  - typeof Suspense
 *      -- 异步组件：用于处理异步组件的加载状态
 *      -- <Suspense>...</Suspense> → type: Suspense (Vue 自动包裹，无真实 DOM)
 *  - typeof Comment
 *      -- 注释：用于添加注释，不会渲染到页面中
 *      -- <!-- 我是注释 --> → type: Comment (Vue 自动包裹，无真实 DOM)
 *  - typeof Text
 *      -- 文本：用于添加文本节点，不会渲染到页面中
 *      -- 'Hello' → type: Text (Vue 自动包裹，无真实 DOM)
 *  - typeof Static
 *      -- 静态节点：永远不变的节点，性能优化用
 *      -- <div>固定文本</div> → type: Static (静态节点，不参与 diff)
 */
