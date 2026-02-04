import {
  createApp,
  h,
  nextTick,
  ref,
  withDirectives,
  type Directive,
} from 'vue';
import { renderComponentRoot } from '../../../../../code/packages/runtime-core/src/componentRenderUtils';

/**
 * 1. 指令的使用
 *     - 不管是使用 <template> 模板还是使用 render 函数编程式生成 VNode, 最终都是通过 withDirectives 函数处理
 *     - 最终会将指令处理统一格式后, 挂载到 vnode.dirs 数组中
 *        -- 如果指令定义为函数, 则会转换为对象式
 *        {
 *          type: "div",
 *          dirs: [
 *            {
 *               "arg": undefined, // 指令参数
 *               // 指令的定义对象
 *               "dir": {
 *                 created: Function,
 *                 beforeMount: Function,
 *                 ...,
 *               },
 *               "instance": ..., // 使用该指令的组件实例。
 *               "value": "yellow", // 传递给指令的值。
 *               "modifiers": {} // 一个包含修饰符的对象 (如果有的话)。
 *            }
 *          ]
 *        }
 */

/**
 * 2. 指令的作用对象: 指令的作用对象都是原生元素
 *     - 直接在元素上绑定指令，则指令作用对象为该元素
 *     - 在组件上绑定指令, 则会透传至组件的根节点上
 *        -- 当应用到一个多根组件时，指令将会被忽略且抛出一个警告。
 *        -- 在调用组件的 render 函数时, 会处理透传问题, 将组件的指令透传至组件的根节点VNode
 *        -- 在 packages/runtime-core/src/componentRenderUtils 文件的 renderComponentRoot 方法中统一处理
 */

/**
 * 3. 指令的定义以及执行时机
 */
const vHighlight: Directive = {
  /**
   * 在绑定元素的 attribute 前或事件监听器应用前调用
   *
   *  - 调用时机: packages/runtime-core/src/renderer.ts 的 mountElement 方法中
   *      在元素 VNode 已经生成对应的DOM, 并且已经批量挂载子节点之后调用
   *  - 此时 el 还没有挂载到父元素中， 并且还没有处理 el 的 props(即属性,样式,事件处理器等等)
   *      但是子孙元素已经挂载到了 el 元素上
   */
  created(el, binding, vnode) {
    console.log('指令初始化: ', el, binding, vnode);
  },
  /**
   * 在元素被插入到 DOM 前调用
   *
   *  - 调用时机: packages/runtime-core/src/renderer.ts 的 mountElement 方法中
   *      在元素处理完成属性,样式,事件处理器等等之后调用
   *  - 此时 el 还没有挂载到父元素中，即将挂载
   */
  beforeMount(el, binding, vnode) {
    console.log('挂载之前: ', el, binding, vnode);
  },
  /**
   * 在绑定元素的父组件及他自己的所有子节点都挂载完成后调用
   *
   *  - 调用时机: packages/runtime-core/src/renderer.ts 的 mountElement 方法中
   *      在元素挂载到父元素中, 并且会使用异步队列, 在组件渲染完成之后才调用, 保证已经挂载到 DOM 树
   */
  mounted(el, binding, vnode) {
    console.log('挂载之后: ', el, binding, vnode);

    el.style.backgroundColor = 'yellow';
  },
  /**
   * 绑定元素的父组件更新前调用
   *
   *  - 调用时机: packages/runtime-core/src/renderer.ts 的 patchElement 方法中
   *     在比对元素Vnode时, 此时没有更新元素的子节点, 也没有更新元素的 prop
   */
  beforeUpdate(el, binding, vnode, prevVnode) {
    console.log('更新之前: ', el, binding, vnode, prevVnode);
  },
  /**
   * 在绑定元素的父组件及他自己的所有子节点都更新后调用
   *
   * - 调用时机: packages/runtime-core/src/renderer.ts 的 patchElement 方法中
   *    已经处理好了元素的 prop, 子节点, 事件处理器等等
   *    并且使用异步队列保证 DOM 树已经更新
   */
  updated(el, binding, vnode, prevVnode) {
    console.log('更新之后: ', el, binding, vnode, prevVnode);
  },
  /**
   * 绑定元素的父组件卸载前调用
   *
   * - 调用时机: packages/runtime-core/src/renderer.ts 的 unmount 方法中
   *      在元素卸载之前调用
   */
  beforeUnmount(el, binding, vnode) {
    console.log('解绑之前: ', el, binding, vnode);
  },
  /**
   * 绑定元素的父组件卸载后调用
   *
   *  - 调用时机: packages/runtime-core/src/renderer.ts 的 unmount 方法中
   *      在元素卸载之后调用, 此时子节点已经处理卸载完毕
   *      并且使用异步队列保证 DOM 树已经更新, 也就是该元素已经从 DOM 树中卸载了
   */
  unmounted(el, binding, vnode) {
    console.log('解绑之后: ', el, binding, vnode);
  },
};

// #region ------------ 测试代码 ------------
const color = ref('yellow');
const container = document.createElement('div');
const app = createApp({
  render() {
    let vnode = withDirectives(h('div', 'hello world'), [
      [vHighlight, color.value],
    ]);
    console.log('存在自定义指令生成的 VNode：', vnode);

    return vnode;
  },
});

app.mount(container);
console.log(container);
nextTick(() => {
  color.value = 'red';
});

// #endregion

export default vHighlight;
