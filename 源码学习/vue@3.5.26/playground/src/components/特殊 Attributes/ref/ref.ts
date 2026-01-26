import { createElementVNode } from 'vue';
import { setRef } from '../../../../../code/packages/runtime-core/src/rendererTemplateRef';

/**
 * 1. ref 的 VNode 表现
 *    - 当需要使用 ref 时, 就会在生成 vnode 时处理 ref, 绑定到 vnode.ref 中
 *    - 查看 createElementVNode 方法定位到 ref 的生成, 会统一规划格式
 */

/**
 * {
 *  // 片段节点, 使用 Symbol 标识
 *  ref: {
 *   // 是否为 v-for 标记, 此时会生成数组存放
 *   f: false,
 *   // 对应的组件, 用于从实例中取到具体的绑定值
 *   i: ComponentInternalInstance
 *   // 实际的 ref 核心值（VNodeRef 是 ref 的原始类型）
 *        1. 字符串：如 ref="foo" → r = "foo"；
 *        2. 函数：如 ref={el => {}} → r = 该函数；
 *        3. 响应式 ref 对象：如 ref={fooRef}（setup 中声明的 const fooRef = ref()）→ r = fooRef；
 *      - 这是 ref 的 “核心值”，Vue 最终要把 DOM / 组件实例赋值给这个 r
 *   r: "myRef"
 *  },
 * }
 */
console.log('带有 ref 的VNode: ', createElementVNode('div', { ref: 'myRef' }));

/**
 * 2. ref 的绑定和解绑: 逻辑在 packages/runtime-core/src/rendererTemplateRef 文件的 setRef 方法中
 *     - 在 vnode 的渲染和销毁时, 会调用该方法, 传入新旧 ref 表示绑定和解绑
 *     - Ref 的具体值计算: 都绑定到了 vnode 中
 *        -- 组件类型取公共实例 --> vnode.component
 *             ---> 如果组件使用了 steup 调用 defineExpose() 或者使用了 expose 选项的话, 就只会暴露对应的属性
 *        -- 元素类型取真实DOM  --> vnode.el
 *     - 不同场景下的处理:
 *         -- 函数形式 --> :ref="Function"
 *             --- 初始化时, 直接调用函数, 将 Ref 的具体值作为参数即可
 *             --- 卸载时, 同时直接调用函数，将 null 作为参数即可
 *         -- 字符串形式 --> ref="foo"
 *             --- 初始化时, 追加到组件实例的 $refs 对象中, 以及 steup 中的 ref 变量中
 *             --- 卸载时, 同样从组件实例的 $refs 对象中和 setup 中的 ref 变量中删除
 *         -- 响应式对象形式 --> ref={fooRef}（setup 中声明的 const fooRef = ref()）
 *             --- 初始化时, 追加到组件实例的 $refs 对象中, 以及 Ref 的具体值响应式对象
 *             --- 卸载时, 删除对应值
 *         -- v-for 的 ref
 *             --- 在生成 vnode 时, 会自动标记为 v-for 生成, 即 rawRef.f = true
 *             --- 之后在碰到这个标记时, 会自动将 ref 具体值包装为数组或者追加到已经存在的数组中
 *
 * - 注意:
 *     -- ref 不关心更新, 因为 ref 绑定的是原生元素或者组件实例，都是通过对象引用的, 都是同一个对象
 *     -- ref 的处理都是在 vnode 的具体渲染之后执行, 也就是已经生成了 vnode 和 组件实例, 也就直接从 vnode 取到具体的值即可
 *     -- 但是 vnode 渲染了, 不代表真实 DOM 已经挂载到 DOM 树中(因为父元素还没有挂载), 所以在这里是延迟到渲染后执行（避免DOM未挂载完成）
 */
