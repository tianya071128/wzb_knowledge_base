/**
 * 原生元素的渲染
 */

import { h, patchProp } from 'vue';

/**
 * 1. 元素 VNode 的
 *     - 与其他类型类似, 都是需要先生成 VNode, 这是元素的抽象实现
 */

/**
 * {
 *    // 元素的类型
 *    "type": 'div',
 *     // 传入的属性, 包含类名、样式、事件、属性等
 *     "props": null,
 *     // 子元素:
 *     //  - 是 VNode 集合
 *     "children": [VNode, VNode],
 *     //  - 或者直接是文本字符串
 *     "children": "hello world",
 *     // ...
 * }
 */
let vnode = h(
  'div',
  {
    id: 'app',
  },
  [h('span', 'hello'), h('span', 'world')]
);
console.log('原生元素的VNode：', vnode);
console.log('子元素是文本的元素：', h('div', 'hello world'));

/**
 * 2. 初始创建阶段: 逻辑在 packages/runtime-core/src/renderer.ts, 点击 createRenderer 方法查看具体逻辑
 *     - 生成 VNode 后, 最终会调用 path 方法, path 方法会调用 processElement 方法
 *     - 当只有新的 VNode 时, 会调用 mountElement 方法执行初始创建阶段
 *        -- 1. 根据不同平台的创建方法创建元素并挂载到 vnode.el 上
 *        -- 2. 挂载子节点
 *              --- 2.1 当子节点是文本时, 直接调用平台的 hostSetElementText 方法挂载文本, 对应 浏览器环境对应 el.textContent = xxx
 *              --- 2.2 当子节点是 VNode 集合时, 直接调用 mountChildren 递归挂载子节点
 *        -- 3. 设置 ScopeId, 样式隔离
 *        -- 4. 遍历 vnode.props, 设置属性, DOM 环境下会执行 patchProp 方法处理元素的属性, 与平台解耦
 *        -- 5. 挂载到对应节点上
 */

/**
 * 3. 更新阶段: vue 的更新粒度是组件层级
 *     - 也就是当组件更新时, 会对 组件子树VNode 比对, 从而最终调用 processElement 方法新旧VNode更新
 *     - 进而调用 patchElement 方法比对元素
 *        -- DOM复用
 *        -- 钩子/指令前置执行
 *        -- 子节点增量更新
 *            --- patchBlockChildren 块更新：✅性能天花板 → 编译器只收集「动态子节点」，更新时只遍历动态子节点、完全跳过静态子节点
 *            --- patchChildren 全量 Diff：✅兜底兼容 → 无优化标记时，对所有子节点做「增 / 删 / 改 / 移」的全量对比，遵循 Vue3 的 Diff 算法规则
 *        -- 属性增量更新
 *            --- 精准标记的单个属性更新：有CLASS/STYLE/PROPS标记时，只更新对应的单个属性，比如只有 class 动态变化，就只调用hostPatchProp更新 class，其他属
 *            --- 全量属性更新：有FULL_PROPS标记时，调用 patchProps 全量对比新旧 props，适配动态属性名的场景
 *            --- 无标记兜底更新：无任何优化标记时，调用 patchProps 全量更新，保证正确性。
 *        -- 文本内容更新
 *        -- 钩子/指令后置异步执行
 */
