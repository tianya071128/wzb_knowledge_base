import { h, renderSlot } from 'vue';
import SlotsSonDemo from './SlotsSonDemo.vue';
import {
  initSlots,
  type InternalSlots,
} from '../../../../../code/packages/runtime-core/src/componentSlots';
import { shouldUpdateComponent } from '../../../../../code/packages/runtime-core/src/componentRenderUtils';

/**
 * 1. 插槽的来源:
 *     - 在生成组件 VNode 时，会生成一个 children 数组，挂载到 vnode.children 上
 *     - 场景:
 *        -- 使用 render 渲染函数, 自行传入 slots
 *        -- 使用 vue 文件的 template, 会将插槽封装为对应的插槽函数, 做了更多的内部优化
 */
/**
 * {
 *  // 组件的定义
 *  type: Object,
 *  // 传入的 插槽
 *  children: {
 *    // 作用域插槽
 *    content: (content) => ...,
 *    // 直接传入 VNode, 在组件渲染过程中会被包装为函数, 并且抛出警告
 *    title: VNode,
 *  }
 * }
 */
console.log(
  '传给vnode的slots相关: ',
  h(
    SlotsSonDemo,
    {},
    {
      // 处理插槽时会抛出警告: 插槽“标题”遇到非函数值。优先选择函数槽以获得更好的性能
      title: h('div', `使用手写 render 函数的插槽: ${0}`),
      content: (content: string) => h('div', `内容${content}`),
    }
  )
);

/**
 * 2. 组件初始化插槽 --> 具体逻辑在: code/packages/runtime-core/src/componentSlots.ts
 *     - 在创建完组件实例后, 会调用 initSlots 方法初始化插槽
 *        --> 处理完成后挂载到 instance.slots 上
 *     - 不管传入的形式如此, 最终统一规范为函数形式: InternalSlots
 *        {
 *          [slotName]: (...args) => VNode[]
 *        }
 */

/**
 * 3. 组件使用插槽
 *      - 在组件渲染 VNode 过程, 直接通过 instance.slots[slotName] 获取插槽函数
 *      - 调用插槽函数就会返回 VNode
 *      - 对于使用 template 的, 编译器会借用内部方法 renderSlot 方法渲染插槽
 *          -- 会返回一个 Fragment 包裹的 VNode 数组, 这样在 diff 时, 就可以将这个插槽返回值作为一个整体比较
 */

/**
 * 4. 插槽中使用的响应式发生变更如何触发组件更新:
 *     - 1. 父组件主动触发子组件更新:
 *           -- 场景1: 使用 render 自行定义生成 VNode --> https://cn.vuejs.org/api/options-rendering.html#render
 *           -- 场景2: 父组件使用 v-if 或其他方式动态使用插槽
 *           -- 在父组件触发更新时, 对比组件VNode时, 因为缺少编译优化标识, 所以会简单比较前后插槽信息, 只有存在插槽, 就会触发子组件更新
 *           -- 见 shouldUpdateComponent 方法
 *     - 2. 插槽内响应式数据发生变更时, 会触发组件更新
 *           -- 因为插槽时函数, 所以在组件使用插槽函数时, 其中的响应式数据是在组件的渲染函数中使用的
 *              所以也就会被组件捕获到响应式变化
 */
