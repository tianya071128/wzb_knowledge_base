import { h, Teleport } from 'vue';

/**
 * 1. Teleport组件VNode 生成
 *      - 使用 Teleport 内部组件生成 VNode, 组件的定义存在 __isTeleport 标识为 Teleport 组件
 *      - 注意: 组件的子节点不是作为插槽函数,而是直接在父组件中生成 VNode, 所以 Teleport 中不会存在组件实例、监听响应式数据等等组件相关的操作
 */

/**
 * {
 *    // 组件的定义
 *    "type": {
 *       "__name": "Teleport",
 *     },
 *     // 插槽
 *     "children": [VNode...],
 *     // ...
 * }
 */
console.log(h(Teleport as any, [h('div', '子节点')]));

/**
 * 2. 渲染和更新 Teleport组件
 *      - Teleport 组件自定义了 process 方法, 独立处理渲染和更新操作
 *      - 在 packages/runtime-core/src/renderer.ts 的 patch 方法中, 对于 Teleport 组件而言, 会调用 Teleport 组件的 process 方法
 *      - 首次渲染:
 *          -- 占位节点: 开发环境下为注释节点, 其他环境下为空文本节点
 *              --- vnode.el: 在原组件容器中起始节点
 *              --- vnode.anchor: 在原组件容器中的锚点
 *              --- vnode.targetStart: Teleport 目标容器的起始节点，用于精准插入位置
 *              --- vnode.targetAnchor: Teleport 目标容器的锚点节点，用于精准插入位置
 *              --- vnode.target: Teleport 目标容器
 *          -- 通过这些占位节点, 以及来根据 disabled 和 to 来确定挂载容器
 *          -- 通过 mountChildren 方法挂载子节点
 *              --- 如果是禁用, 则挂载到原容器中 --> container: 使用传入的, anchor 使用 vnode.anchor
 *              --- 非禁用, 则挂载到目标容器中 --> container: 使用 to 属性表示的目标容器的, anchor 使用 vnode.targetAnchor
 *          -- Teleport 组件本身没有对应的节点, 只需要将子节点挂载到对应的容器中即可
 *      - 更新渲染
 *          -- 根据 disabled 和 to 的变化, 重新挂载占位节点和子节点
 *      - 注意: Teleport 组件着重处理 DOM 层的位置, 通过相关占位节点来确定挂载位置, 组件内部无需走组件渲染的那一套
 */

/**
 * 3. 卸载 Teleport组件
 *      - Teleport 组件自定义了 remove 方法, 独立处理卸载操作
 *      - 在 packages/runtime-core/src/renderer.ts 的 unmount 方法中, 对于 Teleport 组件而言, 会调用 Teleport 组件的 remove 方法
 *      1. 先清理锚点DOM，后卸载子节点
 *      2. 区分目标容器/原容器的锚点清理
 *      3. 调用 unmount 方法卸载子节点
 */
