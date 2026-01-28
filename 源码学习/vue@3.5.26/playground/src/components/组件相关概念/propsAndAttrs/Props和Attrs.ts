import { h } from 'vue';
import {
  type NormalizedPropsOptions,
  normalizePropsOptions,
  initProps,
  updateProps,
} from '../../../../../code/packages/runtime-core/src/componentProps';
import PropsAndAttrsSonDemo from './PropsAndAttrsSonDemo.vue';

/**
 * 1. 组件VNode 生成时, 会将父组件传入的props赋值到 vnode.props --> 如下图所示
 *     - 在使用组件时(e.g <HelloWord msg="xxx" @click="xxx" ... / >), 这些统一会被编译器编译为传入的对象, 都放在一起
 *        -- 当为 onXxx 形式并且在组件的 emits 声明中的会被当为组件的 emits
 *        -- 当是组件定义的 props 时会被当为组件的 props
 *        -- 其他的归为 attrs
 */

/**
 * {
 *  // 组件的定义
 *  type: Object,
 *  // 传入的 props
 *  props: {
 *    msg: 'hello world',
 *    onClick: () => {...},
 *  }
 * }
 */
console.log(
  '传给vnode的props相关: ',
  h(PropsAndAttrsSonDemo, {
    msg: 'hello world',
    onClick: () => {
      console.log('click');
    },
  })
);

/**
 * 2. 处理组件 PropsOptions --> 也就是组件的 Props 声明: https://cn.vuejs.org/guide/components/props.html#props-declaration
 *     - 在创建组件的实例时, 会调用统一规范化方法 normalizePropsOptions 规范为统一类型: NormalizedPropsOptions
 *        -- 具体处理参考: packages/runtime-core/src/componentProps 的相关方法和类型定义
 *     - 处理完成后挂载到 instance.propsOptions 中
 *        [
 *            {
 *                // prop 声明
 *                "msg": {
 *                    // 布尔值相关转换的标记
 *                    "0": false,
 *                    "1": true,
 *                    // 是否必填
 *                    "required": true,
 *                    // 允许的类型
 *                    type: String
 *                },
 *                "test": {
 *                    "0": false,
 *                    "1": true,
 *                    "required": false,
 *                    默认值
 *                    "default": 10
 *                }
 *            },
 *            // 需要值转换的 prop 键数组 -> 存在 Boolean 类型或者配置了 default 值的 prop 声明
 *            [
 *                "test"
 *            ]
 *        ]
 */

/**
 * 3. 初始化 Props 和 Attrs
 *     - 在初始化组件实例之后, 会调用 initProps 方法初始化 Props 和 Attrs
 *     - 初始化 Props 和 Attrs 的存储容器, 最终赋值给组件实例
 *         -- instance.props 和 instance.attrs
 *     - 调用 setFullProps 完成 Props 和 Attrs 的赋值
 *         - 处理 props 和 attrs, 通过引用关系, 直接修改入参
 *         - props 处理:
 *            -- 通过之前解析的 propsOptions 获取声明的props配置对象(驼峰key)，包含类型/默认值/校验规则
 *            -- 从 vnode.props 中提取父组件传入的值
 *                --- 如果需要转换值: 可能需要将其转换成布尔值或者其它相关值, 最后跟其他设置了默认值的统一处理
 *                --- 不需要转换值: 直接添加到 props 容器中
 *            -- 最后处理存在转换值或默认值的, 通过 resolvePropValue 方法进行处理
 *         - attrs 处理:
 *             -- 从 vnode.props 中提取父组件传入的值
 *             -- 不属于 props 或者 emits 的, 则统一添加到 attrs 容器中
 *     - 差异化挂载处理后的 Props 对象到实例
 *         -- 有状态组件
 *             --- SSR 场景：直接挂载原始props对象 → 服务端渲染是「一次性渲染」，无数据更新、无响应式依赖，不需要创建响应式对象，节省性能；
 *             --- 浏览器场景：挂载 shallowReactive(props) 浅层响应式对象
 *         -- 无状态组件 (函数式组件): 不需要创建任何响应式对象
 *     - 统一挂载 Attrs 对象到实例
 */

/**
 * 4.1 props 的使用, 挂载在 instance.props 中
 *      -- 在 steup 的使用
 *          --- 组件渲染时, 会通过 setupStatefulComponent 方法调用组件的 steup, 传入 instance.props 参数 --> /packages/runtime-core/src/component.ts 文件中
 *      -- 在 render 函数的使用
 *          --- 同理, 调用时会传入 instance.props 参数
 *      -- 响应式
 *          ---- 在初始化 props 时, 会调用 shallowReactive(props) 创建浅层响应式对象
 *      -- 只读
 *          --- 如果是在开发环境下, 在传入参数会通过 shallowReadonly 浅层只读继续封装一层, 写入时抛出警告
 *          --- 子组件无法更改 props 绑定，但仍然可以更改对象或数组内部的值。这是因为 JavaScript 的对象和数组是按引用传递 --> https://cn.vuejs.org/guide/components/props.html#mutating-object-array-props
 *
 * 4.2 attrs 的使用, 挂载在 instance.attrs 中
 *      -- 与 props 类似, 会作为参数传入到 steup 和 render 中使用
 *      -- 响应式: 响应式的实现待研究
 */

/**
 * 5. props 和 attrs 的更新
 *     -- 在父组件状态变更, 触发重渲染时, 就会执行父组件的 patch, 最终会执行组件的更新方法: componentUpdateFn
 *     -- 最终调用方法 updateProps 执行 props以及 attrs 的更新
 *     -- 比较前后的 vnode.props, 直接更新 instance.props 和 instance.attrs
 *         --- 值发生变化的, 更新值
 *         --- 以及处理新增和删除
 */

/**
 * 6. props 和 attrs 的销毁
 *     -- 无需额外处理, 随着组件的销毁, 会被内存回收掉
 */
