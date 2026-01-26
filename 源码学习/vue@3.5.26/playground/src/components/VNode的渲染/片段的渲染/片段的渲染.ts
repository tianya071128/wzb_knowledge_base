import { createElementBlock, Fragment, h } from 'vue';

/**
 * 1. 片段 VNode 的生成
 *     - 生成时机:
 *        -- 1. 当组件为多根时;
 *        -- 2. 使用 v-for 渲染时, 会将 v-for 渲染的元素使用片段 VNode 包裹
 *        -- 3. 在组件模板中使用 <template> 包裹的元素
 *        -- 等等
 *     - 当使用 Fragment 包裹如上的元素时, 当 patch 比对时, 就可以在 Fragment 层次中集中比对, 这样的话, 就不会与其他 VNode 混淆
 */

const vnode = h(Fragment, null, [h('div', '片段节点1'), h('div', '片段节点2')]);

/**
 * {
 *  // 片段节点, 使用 Symbol 标识
 *  type: Symbol(v-fgt),
 *  // 片段节点的片段子VNode
 *  children: [VNode, VNode, ...]
 * }
 */
console.log('片段vnode：', vnode);

/**
 * 2. 片段 VNode 的挂载: 逻辑在 packages/runtime-core/src/renderer.ts, 查看 patch 方法查看具体逻辑
 *      - 在 patch 中, 识别到片段节点时, 会调用 processFragment 方法执行具体挂载
 *         -- 片段 VNode 的挂载主要依赖创建两个空白的文本节点作为锚点, 并将这两个锚点挂载在 vnode.el 和 vnode.anchor 中
 *         -- 建立两个锚点文本节点，作为 Fragment 的锚点, Fragment 的所有子节点插入到「起始锚点」和「结束锚点」之间
 *         -- 借用 mountChildren 方法直接渲染子节点, 并使用 fragmentEndAnchor 作为锚点
 *             --- 直接遍历子节点并调用 patch 方法处理
 */

/**
 **
 * 3. 片段 VNode 的更新: 逻辑在 packages/runtime-core/src/renderer.ts, 查看 patch 方法查看具体逻辑
 *      - 在 patch 中, 识别到片段节点时, 会调用 processFragment 方法执行具体更新
 *         -- 根据不同的情况, 执行不同的逻辑:
 *             --- 1. 如果片段的子节点是一个稳定的区块, 那么就直接通过 patchBlockChildren 比对动态的节点 --> https://cn.vuejs.org/guide/extras/rendering-mechanism.html#tree-flattening
 *             --- 2. 也可能是不稳定的子节点(例如 v-for), 此时通过 patchChildren 方法进入 全量diff 阶段
 *
 *      - 片段 VNode 的更新主要依赖两个锚点文本节点, 分别是 fragmentStartAnchor 和 fragmentEndAnchor
 *         当进行比对时, 也是通过这两个锚点来定位起始
 */

/**
 * 4. 片段 VNode 的卸载: 逻辑在 packages/runtime-core/src/renderer.ts, 查看 unmount 方法查看具体逻辑
 *      - 销毁时机: 组件销毁时或者v-if或其他方式
 *      - 销毁阶段会调用 unmount 方法
 *         -- unmount 中, 最终通过 unmountChildren 方法卸载子节点
 *         -- 之后执行 remove 方法, 最终会调用 removeFragment 方法移除 DOM 节点
 *         -- 会根据片段节点的锚点, 删除片段节点下的所有子节点
 */
