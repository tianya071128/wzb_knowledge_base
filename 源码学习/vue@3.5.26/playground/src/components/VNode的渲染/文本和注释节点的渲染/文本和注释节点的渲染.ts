import { createCommentVNode, createTextVNode } from 'vue';

/**
 * 1. 文本节点和注释节点VNode 的生成
 *  - 与其他类型类似, 都是需要先生成 VNode, 这是元素的抽象实现
 */

/**
 * {
 *  // 文本节点, 使用 Symbol 标识
 *  type: Symbol(v-txt),
 *  // 文本节点的文本内容
 *  children: '这是一个文本节点'
 * }
 */
console.log('文本vnode:', createTextVNode('这是一个文本节点'));

/**
 * {
 *  // 注释节点, 使用 Symbol 标识
 *  type: Symbol(v-cmt),
 *  // 注释节点的注释内容
 *  children: '这是一个注释节点'
 * }
 */
console.log('注释vnode:', createCommentVNode('这是一个注释节点'));

/**
 * 2.1 文本节点的挂载: 逻辑在 packages/runtime-core/src/renderer.ts, 点击 createRenderer 方法查看具体逻辑
 *     - 在 patch 中, 碰到文本节点时, 会调用 processText 方法
 *        -- 1. 创建真实的文本DOM节点：hostCreateText是平台无关的DOM操作API，入参就是文本内容
 *        -- 2. 将真实文本节点插入到指定容器的锚点位置，完成文本节点的首次挂载
 *
 * 2.2 注释节点的创建:
 *      - 在 patch 中, 碰到注释节点时, 会调用 processCommentNode 方法
 *         -- 1. 创建真实的注释DOM节点：hostCreateCommentText是平台无关的DOM操作API，入参就是注释内容
 *         -- 2. 将真实注释节点插入到指定容器的锚点位置，完成注释节点的首次挂载
 */

/**
 * 3.1 文本节点的更新
 *      - 在 patch 中, 碰到文本节点时, 会调用 processText 方法
 *          -- 如果新旧文本不一致, 那么直接修改已有文本DOM节点的内容，无需创建/删除节点
 *
 * 3.2 注释节点的更新
 *      - 在 patch 中, 碰到注释节点时, 会调用 processCommentNode 方法
 *           -- 没有对动态注释的支持, 也就是说, 注释从创建后就不会改变
 */

/**
 * 4. 卸载文本节点和注释节点
 *     - 销毁阶段会调用 unmount 方法
 *         -- 一般而言, 因为文本和注释没有额外操作, 既没有动画效果或者指令等等, 默认情况下无需额外处理
 */
