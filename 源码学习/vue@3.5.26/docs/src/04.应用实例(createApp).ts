import { App } from 'vue'; // 具体的 ts 类型

/**
 * 调用 createApp() 方法会生成一个应用实例, 也可以理解为根(不是组件), 拥有如下定义: https://cn.vuejs.org/api/application.html#createapp
 */

/**
 * mount(): 将应用实例挂载在一个容器元素中
 *  - 调用 createVNode 方法生成 VNode --> 参考: 02.VNode.ts
 *  - 调用 render 方法渲染 vnode, 并挂载到指定为止 --> 参考: 03.渲染(render).ts
 */
