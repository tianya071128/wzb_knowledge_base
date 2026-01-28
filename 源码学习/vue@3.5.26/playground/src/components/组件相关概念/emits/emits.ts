import { createComponentInstance } from '../../../../../code/packages/runtime-core/src/component';
import { emit } from '../../../../../code/packages/runtime-core/src/componentEmits';

/**
 * 1. 组件VNode 生成时, 会将父组件传入的 props 赋值到 vnode.props
 *      - 其中就包含 emits 相关事件的处理器
 */

/**
 * 2. 处理组件 EmitsOptions 声明 --> 也就是组件的 Emits 声明: https://cn.vuejs.org/guide/components/events.html#declaring-emitted-events
 *      - 在创建组件的实例时, 会调用统一规范化方法 normalizeEmitsOptions 规范为统一类型: ObjectEmitsOptions
 *         -- 具体处理参考: packages/runtime-core/src/componentEmits 的相关方法和类型定义
 *      - 处理完成后挂载到 instance.emitsOptions 中
 *        {
 *            // emits 支持函数验证参数, 如果为 null, 表示不验证
 *            "test": null,
 *            "submit": Function,
 *        }
 */

/**
 * 3. emits 的初始化
 *     - emits 无需初始化, 直接从 instance.vnode.props 获取到父组件传入的 props 查找对应的处理器
 *     - 因为 emits 本质是调用一个函数, 所以无需预先处理
 */

/**
 * 4. emits 的使用 --> 统一调用的是 instance.emit 方法
 *     - 在 steup 和 render 中, 通过 emit(eventName, ...args) 调用时, 本质上会调用 instance.emit 方法
 *     - instance.emit 方法在创建组件实例 createComponentInstance 方法中会绑定 emit 方法
 *     - 最终执行的是: packages/runtime-core/src/componentEmits 的 emit 方法
 *        -- 开发环境下, 执行验证
 *        -- 在 instance.vnode.props 找到对应的处理器
 *        -- 执行处理器, 捕获错误
 */

/**
 * 5. emits 的更新
 *     - 当父组件更新时, 会重新生成组件的VNode, vnode.props 就是最新的
 *     - 当父组件只有传入组件的 emit 更新时, 无需触发组件的更新, 因为组件调用 emit 是直接从 vnode.props 提取处理器的
 *     - 此时无需额外操作, 触发处理器时, 是实时从 vnode.props 获取的, 只要 vnode.props 是最新的
 */

/**
 * 6. emits 的销毁
 *     -- 无需额外处理, 随着组件的销毁, 会被内存回收掉
 */
