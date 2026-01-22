/**
 * 组件的渲染
 */

import { h, createRenderer, type ComponentInternalInstance } from 'vue';
import ComponentDemo from './ComponentDemo.vue';

/**
 * 1. 生成 组件VNode
 *     - 内部会调用 _createVNode 生成一个 组件VNode, 生成格式如下, 具体定义点击跳转
 *     - 注意: 生成组件VNode时, 不会调用组件的 render 方法生成其组件模板的 子树VNode
 */
let vnode = h(ComponentDemo);
/**
 * {
 *    // 组件的定义
 *    "type": {
 *       "__name": "ComponentDemo",
 *       "props": {
 *           "msg": {
 *               "required": true
 *           }
 *       },
 *       "render": Function,
 *       "__hmrId": "567b3dfd",
 *       "__scopeId": "data-v-567b3dfd",
 *       "__file": "D:/学习/wzb_knowledge_base/源码学习/vue@3.5.26/playground/src/components/组件的渲染/ComponentDemo.vue"
 *     },
 *     // 组件传入的 props: 包含 props、attrs、emits
 *     "props": null,
 *     // 插槽
 *     "children": null,
 *     // ...
 * }
 */
console.log('组件VNode：', vnode);

/**
 * 2. 初始创建: 逻辑在 packages/runtime-core/src/renderer.ts, 点击 createRenderer 方法查看具体逻辑
 *      - 生成VNode后, 内部会调用 baseCreateRenderer 方法内部生成的 patch 方法比对新旧VNode
 *      - 当碰到组件VNode 时, 会调用 processComponent 方法
 *      - 当只有新的组件VNode时, 调用 mountComponent 方法创建组件
 *         -- 1. 创建实例: createComponentInstance 方法创建实例, 初始化一些字段, 不做更多处理
 *         -- 2. 执行 setup 方法(同时适配处理选项式 API): setupComponent 方法大致会处理 props、slots, 最主要执行 setup 方法
 *                --- props 会调用 shallowReactive 方法生成浅层响应式数据, 在 setup 中实现监听
 *         -- 3. 调用 setupRenderEffect 方法
 *                --- 大致为将生成 子树VNode 的函数包装为响应式副作用，实现「状态变更 → 自动更新 DOM」
 *                --- 调用组件的 render 函数生成 子树VNode
 *                --- 根据生成的 子树VNode, 调用 patch 方法渲染 子树VNode
 *                --- 在生成 子树VNode 的过程中, 会类似于 watch 方法, 监听其中的依赖值, 实现依赖变更后, 自动更新
 *      - 创建的组件实例定义可查看: ComponentInternalInstance 定义, 并且会挂载到 VNode.component 上, instance.vnode 也会存储对应的 Vnode, 双向都会存在
 */

/**
 * 3. 更新阶段: 分为两种情况
 *     - 自更新: 组件依赖的响应式数据(在 setup 定义的响应式或外部引用, 例如 pinia 等)变更, 触发 setupRenderEffect 方法中封装的函数执行
 *        -- 调用组件的 render 函数新的生成VNode
 *        -- 调用 patch 方法渲染VNode
 *     - 父组件触发更新或其他方式调用组件的 $forceUpdate 方法
 *        -- 当父组件更新时, 会进入到 patch 方法进行新旧VNode的比对, 进入到 processComponent 方法
 *        -- 通过 shouldUpdateComponent 方法判断是否需要更新组件
 *            --- 开发环境下, 热更新状态: 需要更新
 *            --- 新VNode有指令/过渡 - 强制更新
 *            --- 对比新旧 VNode.props(包含了组件的 props、attrs、emits),以及 VNode.slots 插槽, 存在变化项则需要更新
 *        -- 当需要更新时, 调用组件实例(VNode.component 属性引用)的 update() 方法触发更新, 也就会触发 setupRenderEffect 方法中封装的函数执行
 *        -- 此时父组件传入的 props 和 slots 可能会发生变化, 所以会调用 updateComponentPreRender 方法更新父组件传入的信息
 *            --- 修正 instance 引用最新的 组件VNode
 *            --- 更新 props、attrs、slots
 */

/**
 * 4. 销毁阶段
 *    - 父组件在更新过程, 最后通过 patch 比对新旧的或者卸载其他元素时(例如组件是在某一个 div 元素之下的), 递归卸载时
 *    - 最终会调用 unmountComponent 方法执行卸载组件的功能
 *        - 执行相关钩子
 *        - 执行 instance.scope.stop() 方法, 清理相关副作用
 *        - 调用 unmount() 方法递归卸载组件的 子树VNode
 */
