/**
 * Vue3 VNode 形状标记枚举（ShapeFlags）
 * 核心作用：用位运算标记 VNode 的类型/特征，支持多标记组合与快速判断，是渲染器处理 VNode 的核心依据
 * 设计原理：所有枚举值均为 2 的幂次（1 << n），通过按位或（|）组合多个标记，按位与（&）判断是否包含某个标记
 * 位运算优势：1. 运算效率极高（底层二进制操作）；2. 一个数字可表示多个特征，节省内存；3. 判断逻辑简洁
 */
export enum ShapeFlags {
  /**
   * 普通 DOM 元素 VNode（如 <div>/<button> 等原生标签）
   * 数值：1（2^0），基础标记，渲染器会直接创建对应 DOM 元素
   */
  ELEMENT = 1,
  /**
   * 函数式组件 VNode（无状态、无实例、无生命周期的轻量组件）
   * 数值：1 << 1 = 2（2^1），渲染器会执行函数并返回 VNode，无组件实例创建逻辑
   */
  FUNCTIONAL_COMPONENT = 1 << 1,
  /**
   * 有状态组件 VNode（普通组件，有 setup/生命周期/响应式数据/组件实例）
   * 数值：1 << 2 = 4（2^2），渲染器会创建组件实例、执行生命周期、挂载 DOM 等完整逻辑
   * KeepAlive 仅缓存此类组件（STATEFUL_COMPONENT）
   */
  STATEFUL_COMPONENT = 1 << 2,
  /**
   * VNode 的子节点为纯文本（如 <div>hello</div> 中的 "hello"）
   * 数值：1 << 3 = 8（2^3），渲染器会直接设置 DOM 的 textContent，无需遍历子节点
   */
  TEXT_CHILDREN = 1 << 3,
  /**
   * VNode 的子节点为 VNode 数组（如 <div><span>1</span><span>2</span></div>）
   * 数值：1 << 4 = 16（2^4），渲染器会遍历数组逐个处理子 VNode
   * Teleport/KeepAlive 等组件的子节点均为此类型
   */
  ARRAY_CHILDREN = 1 << 4,
  /**
   * VNode 的子节点为插槽（如组件的 <slot/> 内容）
   * 数值：1 << 5 = 32（2^5），渲染器会解析插槽内容并替换为对应 VNode
   * 仅组件 VNode 会包含此标记
   */
  SLOTS_CHILDREN = 1 << 5,
  /**
   * Teleport 组件 VNode（<Teleport> 内置组件）
   * 数值：1 << 6 = 64（2^6），渲染器会执行跨容器渲染逻辑（移动 DOM 到目标容器）
   */
  TELEPORT = 1 << 6,
  /**
   * Suspense 组件 VNode（<Suspense> 内置组件）
   * 数值：1 << 7 = 128（2^7），渲染器会处理异步组件的加载/兜底逻辑
   */
  SUSPENSE = 1 << 7,
  /**
   * 组件需要被 KeepAlive 缓存（卸载时不销毁，执行 deactivate 失活逻辑）
   * 数值：1 << 8 = 256（2^8），KeepAlive 渲染函数会为符合规则的组件添加此标记
   * 渲染器检测到该标记时，会调用 KeepAlive 的 deactivate 方法而非直接卸载
   */
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  /**
   * 组件已被 KeepAlive 缓存（激活时复用实例/DOM，执行 activate 激活逻辑）
   * 数值：1 << 9 = 512（2^9），缓存命中时 KeepAlive 会为组件添加此标记
   * 渲染器检测到该标记时，会调用 KeepAlive 的 activate 方法而非重新创建组件
   */
  COMPONENT_KEPT_ALIVE = 1 << 9,
  /**
   * 通用组件标记（组合有状态组件 + 函数式组件）
   * 数值：4 | 2 = 6，用于快速判断 VNode 是否为「任意类型的组件」（无需区分有状态/函数式）
   * 场景：渲染器顶层判断 "是否是组件 VNode" 时使用，简化逻辑（如 if (shapeFlag & ShapeFlags.COMPONENT)）
   */
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
}
