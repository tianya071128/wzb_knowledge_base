import { extend, hasChanged } from '@vue/shared'
import type { ComputedRefImpl } from './computed'
import type { TrackOpTypes, TriggerOpTypes } from './constants'
import { type Link, globalVersion } from './dep'
import { activeEffectScope } from './effectScope'
import { warn } from './warning'

export type EffectScheduler = (...args: any[]) => any

export type DebuggerEvent = {
  effect: Subscriber
} & DebuggerEventExtraInfo

export type DebuggerEventExtraInfo = {
  target: object
  type: TrackOpTypes | TriggerOpTypes
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}

/**
 * 调试器选项接口，用于定义调试响应式系统时的回调函数
 * 包含跟踪和触发事件的处理方法，帮助开发者了解响应式系统的内部工作
 */
export interface DebuggerOptions {
  /**
   * 当一个响应式依赖被追踪时调用的回调函数
   * @param event - 调试事件对象，包含追踪的相关信息
   */
  onTrack?: (event: DebuggerEvent) => void
  /**
   * 当一个响应式依赖被触发更新时调用的回调函数
   * @param event - 调试事件对象，包含触发更新的相关信息
   */
  onTrigger?: (event: DebuggerEvent) => void
}

/**
 * 响应式副作用函数的选项配置接口
 * 扩展了调试器选项，允许配置副作用函数的执行行为
 */
export interface ReactiveEffectOptions extends DebuggerOptions {
  /**
   * 可选的调度器函数，用于控制副作用函数的执行时机和方式
   * 如果提供，将在依赖项变化时调用此调度器而不是直接执行副作用函数
   */
  scheduler?: EffectScheduler
  /**
   * 是否允许副作用函数递归执行，默认为 false
   * 设置为 true 时允许在副作用函数执行过程中再次触发自身
   */
  allowRecurse?: boolean
  /**
   * 当副作用函数停止追踪时调用的清理回调函数
   * 在副作用函数被停止或清理时执行，用于释放相关资源
   */
  onStop?: () => void
}

export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}
/**
 * 当前活跃的订阅者（副作用函数），用于追踪依赖关系
 * 在执行响应式副作用函数时，此变量会被设置为当前正在运行的副作用函数
 * 以便在访问响应式数据时能够正确地建立依赖关系
 */
export let activeSub: Subscriber | undefined

/**
 * 响应式效果标志枚举
 * 使用位掩码设计，每个标志占用一个二进制位，可以组合使用
 */
export enum EffectFlags {
  /**
   * ReactiveEffect only
   */
  /**
   * 响应式效果专用标志
   * 表示效果处于活动状态，可以被触发和执行
   */
  ACTIVE = 1 << 0,
  /**
   * 表示效果当前正在运行中
   */
  RUNNING = 1 << 1,
  /**
   * 表示效果正在进行依赖追踪
   */
  TRACKING = 1 << 2,
  /**
   * 表示效果已被通知需要重新运行
   */
  NOTIFIED = 1 << 3,
  /**
   * 表示效果的状态是脏的，需要重新计算
   */
  DIRTY = 1 << 4,
  /**
   * 允许效果递归调用自身
   */
  ALLOW_RECURSE = 1 << 5,
  /**
   * 表示效果当前被暂停，不会自动执行
   */
  PAUSED = 1 << 6,
  /**
   * 表示效果已经被评估过（至少执行过一次）
   */

  EVALUATED = 1 << 7,
}

/**
 * Subscriber is a type that tracks (or subscribes to) a list of deps. 订阅者是一种跟踪（或订阅）deps 列表的类型。
 */
/**
 * Vue3 响应式系统的订阅者统一接口（Subscriber）
 *
 * 核心作用：
 *    1. 抽象定义：统一规范“能订阅依赖（Dep）的对象”需具备的属性和方法；
 *    2. 依赖管理：通过双向链表头/尾指针（deps/depsTail）管理订阅的所有依赖；
 *    3. 状态控制：通过 flags（EffectFlags）标记订阅者的核心状态（如是否活跃、是否脏值）；
 *    4. 通知机制：通过 notify 方法定义依赖变化时的通知逻辑（计算属性需特殊处理）；
 *    5. 链表管理：通过 next 指针维护批量更新时的订阅者链表，便于批量处理；
 *
 * 接口定位：
 *  - 是 ReactiveEffect（普通副作用，如组件渲染、watch 回调）和 ComputedRefImpl（计算属性）的共同父接口；
 *  - 使响应式系统的依赖收集、触发更新逻辑可统一处理不同类型的订阅者，无需区分具体实现；
 */
export interface Subscriber extends DebuggerOptions {
  /**
   * Head of the doubly linked list representing the deps 代表部门的双向链表的头
   * @internal
   */
  /**
   * 依赖链表的头节点（双向链表）
   * @internal 内部属性，不对外暴露
   *
   * 核心作用：
   *  - 指向当前订阅者关联的第一个 Link 节点（Link 关联 Dep 和 Subscriber）；
   *  - 用于遍历订阅者的所有依赖（如副作用执行前重置 Link 版本号、执行后清理无效依赖）；
   *
   * 关联字段：depsTail 是链表尾节点，配合实现高效的链表增删操作；
   *
   * 在 dep 中依赖收集的时候会赋值, 或者添加到链表尾部
   */
  deps?: Link

  /**
   * Tail of the same list 同一列表的尾部
   * @internal
   */
  /**
   * 依赖链表的尾节点（双向链表）
   * @internal 内部属性，不对外暴露
   *
   * 核心作用：
   *  - 指向当前订阅者关联的最后一个 Link 节点；
   *  - 新增依赖时可直接在尾节点后追加，无需遍历整个链表，时间复杂度 O(1)；
   *
   * 设计优势：头/尾指针配合，实现双向链表的高效遍历和增删；
   */
  depsTail?: Link

  /**
   * @internal
   */
  /**
   * 订阅者状态标记（位掩码）
   * @internal 内部属性，不对外暴露
   *
   * 核心作用：
   *  - 通过 EffectFlags 枚举标记订阅者的核心状态，支持多状态组合/校验；
   *
   * 常见标记：
   *  - EffectFlags.ACTIVE：订阅者是否活跃（未销毁/未停止）；
   *  - EffectFlags.TRACKING：是否启用依赖追踪；
   *  - EffectFlags.DIRTY：计算属性是否为脏值（需要重新计算）；
   *  - EffectFlags.NOTIFIED：是否已被通知更新，避免重复处理；
   *
   * 操作方式：按位或（|）组合标记，按位与（&）校验标记；
   */
  flags: EffectFlags

  /**
   * @internal
   */
  /**
   * 订阅者链表的下一个节点
   * @internal 内部属性，不对外暴露
   *
   * 核心作用：
   *  - 用于批量更新时（如 endBatch）维护订阅者链表（如 batchedComputed/batchedSub）；
   *  - 遍历批量收集的订阅者时，通过 next 指针依次访问所有节点；
   *
   * 生命周期：处理完成后会重置为 undefined，避免链表残留；
   */
  next?: Subscriber

  /**
   * returning `true` indicates it's a computed that needs to call notify 返回“true”表明它是一个需要调用notify的计算对象
   * on its dep too 也有其部门
   * @internal
   */
  /**
   * 依赖变化时的通知方法
   * @internal 内部方法，不对外暴露
   *
   * 返回值说明：
   *    - 返回 true：表示当前订阅者是计算属性，需要额外通知其自身的 Dep（触发依赖计算属性的副作用）；
   *    - 返回 void：表示普通副作用（如组件渲染），仅执行自身逻辑即可；
   *
   * 核心逻辑：
   *  - 普通副作用（ReactiveEffect）：执行副作用函数（如组件渲染、watch 回调）；
   *  - 计算属性（ComputedRefImpl）：标记为脏值，返回 true 通知其 Dep 触发订阅者更新；
   */
  notify(): true | void
}

/**
 * 用于存储已暂停但有待执行调度任务的响应式副作用函数集合
 * 当一个 ReactiveEffect 被暂停时，如果它被触发，会将其添加到此集合中
 * 在恢复执行时，会从该集合中删除并立即触发执行
 */
const pausedQueueEffects = new WeakSet<ReactiveEffect>()

/**
 * Vue3 响应式副作用核心实现类（ReactiveEffect）
 *
 * 核心作用：
 *    1. 副作用封装：将业务函数（如组件渲染、watch 回调）封装为响应式副作用，关联响应式依赖；
 *    2. 生命周期管理：提供 pause/resume/stop 方法，支持副作用的暂停、恢复、停止；
 *    3. 依赖管理：通过 deps/depsTail 维护依赖链表，实现依赖的收集、清理、更新；
 *    4. 执行控制：通过 flags 标记控制执行状态（活跃/暂停/运行中/允许递归等），避免重复执行/无限循环；
 *    5. 调度适配：支持自定义 scheduler，实现副作用的异步/批量/延迟执行；
 *    6. 调试能力：提供 onTrack/onTrigger 钩子，便于开发环境追踪依赖收集和更新触发；
 *
 *
 * 接口实现：
 *    - Subscriber：订阅者接口，统一依赖管理和通知逻辑；
 *    - ReactiveEffectOptions：副作用配置接口，包含 scheduler/onStop/onTrack/onTrigger 等配置；
 */
export class ReactiveEffect<T = any>
  implements Subscriber, ReactiveEffectOptions
{
  /**
   * @internal
   */
  /**
   * 依赖链表头节点（双向链表）
   * @internal 内部属性，不对外暴露
   *
   * 核心作用：指向当前副作用关联的第一个 Link 节点（Link 关联 Dep 和 ReactiveEffect），用于遍历所有依赖；
   */
  deps?: Link = undefined

  /**
   * @internal
   */
  /**
   * 依赖链表尾节点（双向链表）
   * @internal 内部属性，不对外暴露
   *
   * 核心作用：指向当前副作用关联的最后一个 Link 节点，新增依赖时可直接追加，提升效率；
   */
  depsTail?: Link = undefined

  /**
   * @internal
   */
  /**
   * 副作用状态标记（位掩码）
   * @internal 内部属性，不对外暴露
   *
   * 初始值：ACTIVE（活跃） + TRACKING（启用依赖追踪）
   *
   * 核心标记说明：
   *  - ACTIVE：副作用是否活跃（未停止）；
   *  - TRACKING：是否启用依赖收集；
   *  - PAUSED：是否暂停；
   *  - RUNNING：是否正在执行；
   *  - NOTIFIED：是否已被通知更新；
   *  - ALLOW_RECURSE：是否允许递归执行；
   */
  flags: EffectFlags = EffectFlags.ACTIVE | EffectFlags.TRACKING

  /**
   * @internal
   */
  /**
   * 订阅者链表下一个节点
   * @internal 内部属性，不对外暴露
   *
   * 核心作用：批量更新时维护副作用链表，便于遍历执行；
   */
  next?: Subscriber = undefined

  /**
   * @internal
   */
  /**
   * 清理函数
   * @internal 内部属性，不对外暴露
   *
   * 核心作用：副作用停止/重新执行前执行的清理逻辑
   *     -->  watchEffect 的 onCleanup 注册的函数不会走注册到这里, 但是大致也差不多的逻辑
   */
  cleanup?: () => void = undefined

  /** 自定义调度器：依赖变化时替代默认执行逻辑，实现异步/批量执行 */
  scheduler?: EffectScheduler = undefined
  /** 副作用停止时的回调（用户通过 stop 方法触发） */
  onStop?: () => void
  /** 依赖收集时的调试钩子（开发环境） */
  onTrack?: (event: DebuggerEvent) => void
  /** 依赖触发更新时的调试钩子（开发环境） */
  onTrigger?: (event: DebuggerEvent) => void

  /**
   * 构造函数：初始化副作用实例，关联业务函数，加入当前活跃的 effectScope
   * @param fn 业务函数（如组件渲染函数、watch 回调、watchEffect 函数）；
   */
  constructor(public fn: () => T) {
    // 若当前有活跃的 effectScope 且未停止 → 将副作用加入 effectScope 管理
    if (activeEffectScope && activeEffectScope.active) {
      activeEffectScope.effects.push(this)
    }
  }

  /**
   * 暂停副作用：标记为 PAUSED，暂停后依赖变化不会触发执行
   */
  pause(): void {
    this.flags |= EffectFlags.PAUSED
  }

  /**
   * 恢复副作用：移除 PAUSED 标记，若暂停期间有未执行的更新 → 立即触发执行
   */
  resume(): void {
    // 仅当副作用处于暂停状态时恢复
    if (this.flags & EffectFlags.PAUSED) {
      this.flags &= ~EffectFlags.PAUSED // 按位与非，移除 PAUSED 标记

      // 若暂停队列中包含当前副作用 → 移除并触发执行
      if (pausedQueueEffects.has(this)) {
        pausedQueueEffects.delete(this)
        this.trigger()
      }
    }
  }

  /**
   * @internal
   */
  /**
   * 依赖变化时的通知方法（实现 Subscriber 接口）
   * @internal 内部方法，不对外暴露
   *
   * 核心逻辑：
   *  1. 防止递归执行：运行中且不允许递归 → 跳过；
   *  2. 防止重复通知：未标记 NOTIFIED → 加入批量更新队列；
   *
   * 调用时机：
   *  - 响应式数据变化 → Dep.trigger() 遍历订阅者时调用；
   *  - 计算属性值更新后，通知其依赖的副作用时调用；
   */
  notify(): void {
    // 副作用正在执行 且 不允许递归 → 跳过，避免无限循环
    if (
      this.flags & EffectFlags.RUNNING &&
      !(this.flags & EffectFlags.ALLOW_RECURSE)
    ) {
      return
    }

    // 未被标记为“已通知” → 加入批量更新队列，标记 NOTIFIED
    if (!(this.flags & EffectFlags.NOTIFIED)) {
      batch(this)
    }
  }

  /**
   * 执行副作用函数，触发依赖收集和业务逻辑执行
   *
   *
   * @returns 业务函数的返回值；
   *
   * 调用时机：
   *    1. 首次执行：
   *       - 组件挂载时执行渲染副作用；
   *       - watch 和 watchEffect 初始化时执行
   *    2. 依赖变化后：
   *       - 批量更新结束后
   *          -- 立即执行: 调用 trigger() → runIfDirty() → run()；
   *          -- 异步执行: 调用 trigger() → this.scheduler() → 在调度器中在合适的时机执行
   *       - 手动调用副作用实例的 run 方法；
   */
  run(): T {
    // TODO cleanupEffect

    // 副作用已停止（非活跃）→ 直接执行业务函数，不触发依赖收集
    if (!(this.flags & EffectFlags.ACTIVE)) {
      // stopped during cleanup 清理期间停止
      return this.fn()
    }

    // 标记副作用为“运行中”，防止递归执行
    this.flags |= EffectFlags.RUNNING
    // 执行清理函数（如 watchEffect 的 onCleanup 注册的逻辑）
    cleanupEffect(this)
    // 准备依赖链表：重置所有 Link 的 version 为 -1，标记为“待校验”
    prepareDeps(this)

    // 保存当前上下文，切换为当前副作用
    const prevEffect = activeSub // 全局活跃副作用
    const prevShouldTrack = shouldTrack // 全局依赖收集开关
    activeSub = this // 设置当前副作用为全局活跃
    shouldTrack = true // 开启依赖收集

    try {
      // 执行业务函数，触发响应式数据访问 → 收集依赖
      return this.fn()
    } finally {
      // 开发环境校验：活跃副作用未正确恢复 → 警告（内部 bug）
      if (__DEV__ && activeSub !== this) {
        warn(
          'Active effect was not restored correctly - ' + // 主动效果未正确恢复
            'this is likely a Vue internal bug.', // 这可能是 Vue 内部错误
        )
      }
      // 清理无效依赖：移除 version = -1 的 Link（本次执行未使用的依赖）
      cleanupDeps(this)

      // 恢复全局上下文
      activeSub = prevEffect
      shouldTrack = prevShouldTrack
      // 移除“运行中”标记
      this.flags &= ~EffectFlags.RUNNING
    }
  }

  /**
   * 停止副作用：清理所有依赖，执行停止回调，标记为非活跃
   *
   * 调用时机：
   * 1. 手动调用：用户调用 watch/watchEffect 返回的 stop 方法；
   * 2. 自动调用：
   *    - 组件卸载时，停止组件渲染副作用；
   *    - effectScope 停止时，批量停止内部所有副作用；
   *    - watch 配置 once: true 时，执行一次回调后自动停止；
   */
  stop(): void {
    // 仅当副作用处于活跃状态时停止
    if (this.flags & EffectFlags.ACTIVE) {
      // 遍历依赖链表，移除当前副作用从所有 Dep 的订阅者链中
      for (let link = this.deps; link; link = link.nextDep) {
        removeSub(link)
      }
      // 清空依赖链表，释放内存
      this.deps = this.depsTail = undefined
      // 执行清理函数
      cleanupEffect(this)
      // 执行用户注册的 onStop 回调
      this.onStop && this.onStop()
      // 移除 ACTIVE 标记，标记为非活跃
      this.flags &= ~EffectFlags.ACTIVE
    }
  }

  /**
   * 触发副作用执行（核心调度入口）
   *
   * 核心逻辑：
   *    1. 暂停状态 → 加入暂停队列；
   *    2. 有自定义调度器 → 执行调度器；
   *    3. 无调度器 → 仅当脏值时执行（runIfDirty）；
   *
   * 调用时机：
   *    1. 批量更新结束后，遍历 batchedSub 链表时调用；
   *    2. 副作用 resume 时，若暂停队列中有该副作用则调用；
   *    3. 手动调用副作用实例的 trigger 方法；
   */
  trigger(): void {
    // 暂停状态 → 加入暂停队列，恢复时执行
    if (this.flags & EffectFlags.PAUSED) {
      pausedQueueEffects.add(this)
    }
    // 有自定义调度器 → 执行调度器（如 watch 的 pre/post 调度）
    else if (this.scheduler) {
      this.scheduler()
    }
    // 无调度器
    else {
      this.runIfDirty()
    }
  }

  /**
   * @internal
   */
  /**
   * 仅当副作用为“脏值”时执行
   * @internal 内部方法，不对外暴露
   *
   * 脏值判定：依赖变化后未执行，需要重新执行；
   *
   * 调用时机：
   *  - trigger() 方法中无自定义调度器时调用；
   *  - 渲染函数中
   */
  runIfDirty(): void {
    if (isDirty(this)) {
      this.run()
    }
  }

  /**
   * 只读属性：判断副作用是否为脏值
   *
   * 脏值 → 依赖变化后未执行，需要重新执行；
   *
   * 访问时机：
   * - 用户访问副作用实例的 dirty 属性（极少）；
   * - 内部 trigger() → runIfDirty() 时间接访问；
   */
  get dirty(): boolean {
    return isDirty(this)
  }
}

/**
 * For debugging
 */
// function printDeps(sub: Subscriber) {
//   let d = sub.deps
//   let ds = []
//   while (d) {
//     ds.push(d)
//     d = d.nextDep
//   }
//   return ds.map(d => ({
//     id: d.id,
//     prev: d.prevDep?.id,
//     next: d.nextDep?.id,
//   }))
// }

/**
 * - batchDepth：全局数字变量，批量更新深度计数器，初始值为 0；
 *    -- batchDepth > 0：处于批量更新模式，副作用延迟执行；
 *    -- batchDepth = 0：批量更新模式处理完成，副作用启动执行；
 */
let batchDepth = 0
let batchedSub: Subscriber | undefined // 普通批处理链表头部
let batchedComputed: Subscriber | undefined // 计算属性批处理链表头部

/**
 * 批量处理订阅者函数
 * 将给定的订阅者加入到批处理队列中，用于实现批量更新优化
 *
 * @param sub - 需要进行批处理的订阅者对象
 * @param isComputed - 可选参数，标识是否为计算属性，默认为false
 *                     当为true时，订阅者会被添加到计算属性批处理队列中
 *                     当为false时，订阅者会被添加到普通订阅者批处理队列中
 */
export function batch(sub: Subscriber, isComputed = false): void {
  sub.flags |= EffectFlags.NOTIFIED
  if (isComputed) {
    // 将当前订阅者添加到计算属性批处理链表头部
    sub.next = batchedComputed
    batchedComputed = sub
    return
  }
  // 将当前订阅者添加到普通批处理链表头部
  sub.next = batchedSub
  batchedSub = sub
}

/**
 * @internal
 */
/**
 * Vue3 响应式系统的批量更新开启函数（startBatch）
 *
 * 核心作用：
 *    1. 标记批量更新状态：递增全局批量更新深度计数器（batchDepth），表示进入“批量更新模式”；
 *    2. 延迟副作用执行：在批量更新模式下，响应式数据修改触发的副作用（如组件渲染、watch 回调）
 *       不会立即执行，而是被缓存到队列中，直到 endBatch 调用时统一执行；
 *    3. 嵌套兼容：支持嵌套调用（如组件渲染中修改数据触发另一个 startBatch），仅当 batchDepth 归 0 时才执行队列；
 *
 * 核心依赖说明：
 * - batchDepth：全局数字变量，批量更新深度计数器，初始值为 0；
 *   - batchDepth > 0：处于批量更新模式，副作用延迟执行；
 *   - batchDepth = 0：批量更新模式处理完成，副作用启动执行；
 */
export function startBatch(): void {
  // 递增全局批量更新深度计数器
  // 嵌套调用示例：
  // startBatch() → batchDepth = 1
  //   startBatch() → batchDepth = 2
  //   endBatch() → batchDepth = 1
  // endBatch() → batchDepth = 0 → 执行副作用队列
  batchDepth++
}

/**
 * Run batched effects when all batches have ended 当所有批次结束时运行批次效果
 * @internal
 */
/**
 * Vue3 响应式系统的批量更新结束函数（endBatch）
 *
 * 核心作用：
 *    1. 深度校验：递减 batchDepth，仅当归 0 时才执行批量更新（支持嵌套批量更新）；
 *    2. 计算属性处理：遍历 batchedComputed 链表，清理标记并完成计算属性的更新链路；
 *    3. 副作用执行：遍历 batchedSub 链表，执行活跃副作用的 trigger 方法，完成视图/回调更新；
 *    4. 状态清理：清除 NOTIFIED 标记，重置 next 指针，避免影响后续更新；
 *    5. 错误处理：捕获执行过程中的错误，批量执行完成后统一抛出，保证错误可追踪；
 *
 * 核心依赖说明：
 *    - batchDepth：全局批量更新深度计数器，startBatch 递增、endBatch 递减；
 *    - batchedComputed：批量收集的计算属性订阅者链表（Subscriber 类型），存储需要更新的 ComputedRefImpl 实例；
 *    - batchedSub：批量收集的普通副作用订阅者链表（Subscriber 类型），存储需要更新的 ReactiveEffect（如组件渲染、watch 回调）；
 *    - EffectFlags：副作用标记枚举：
 *      - NOTIFIED：标记订阅者已被通知更新，避免重复处理；
 *      - ACTIVE：标记副作用处于活跃状态（未销毁），仅执行活跃副作用；
 *    - ReactiveEffect：副作用实现类，trigger 方法执行原始副作用函数（如组件渲染）；
 */
export function endBatch(): void {
  // 1. 递减批量更新深度计数器，若仍大于 0 → 嵌套批量更新未结束，直接返回
  // （如组件渲染中修改数据触发的批量更新，需等外层批量更新结束才执行）
  if (--batchDepth > 0) {
    return
  }

  // 2. 处理批量收集的计算属性订阅者（batchedComputed）
  if (batchedComputed) {
    // 2.1 暂存计算属性链表头节点，重置 batchedComputed 为空（避免重复处理）
    let e: Subscriber | undefined = batchedComputed
    batchedComputed = undefined

    // 2.2 遍历计算属性链表，清理状态并重置标记
    while (e) {
      // 暂存下一个计算属性订阅者（避免清理 next 后丢失链表）
      const next: Subscriber | undefined = e.next
      // 重置 next 指针，断开链表（避免内存泄漏）
      e.next = undefined
      // 清除 NOTIFIED 标记（表示该计算属性已处理完成，可接收下一次通知）
      e.flags &= ~EffectFlags.NOTIFIED
      // 移动到下一个节点
      e = next
    }
  }

  // 3. 初始化错误变量，捕获副作用执行过程中的错误
  let error: unknown

  // 4. 处理批量收集的普通副作用订阅者（batchedSub）
  while (batchedSub) {
    // 4.1 暂存副作用链表头节点，重置 batchedSub 为空
    let e: Subscriber | undefined = batchedSub
    batchedSub = undefined

    // 4.2 遍历副作用链表，执行活跃副作用的更新逻辑
    while (e) {
      // 暂存下一个副作用订阅者
      const next: Subscriber | undefined = e.next
      // 重置 next 指针，断开链表
      e.next = undefined
      // 清除 NOTIFIED 标记（允许后续接收新的通知）
      e.flags &= ~EffectFlags.NOTIFIED

      // 4.3 仅执行“活跃状态”的副作用（未销毁、未停止）
      if (e.flags & EffectFlags.ACTIVE) {
        try {
          // ACTIVE flag is effect-only ACTIVE 标志仅有效
          // ACTIVE 标记仅作用于 ReactiveEffect（普通副作用），强制类型转换后调用 trigger 方法
          // trigger 方法会执行原始副作用函数（如组件渲染、watch 回调）
          ;(e as ReactiveEffect).trigger()
        } catch (err) {
          // 捕获错误，仅记录第一个错误（避免覆盖）
          if (!error) error = err
        }
      }

      // 移动到下一个节点
      e = next
    }
  }

  // 5. 若执行过程中有错误 → 统一抛出，保证错误可被捕获和处理
  if (error) throw error
}

/**
 * Vue3 响应式系统核心工具函数：副作用执行前准备依赖链表（prepareDeps）
 *
 * 核心作用：
 *    1. 版本号标记：将订阅者所有依赖 Link 的 version 置为 -1，标记为“待校验未使用”状态；
 *    2. 活跃链接绑定：暂存 Dep 原有活跃 Link，将当前 Link 设为 Dep 的 activeLink，
 *       保证依赖收集时能关联到正确的 Link 实例；
 *    3. 为后续清理做准备：通过 version = -1 标记，在 cleanupDeps 阶段可识别“本次执行未使用的依赖”，
 *       实现无效依赖的自动清理，避免内存泄漏；
 *
 * 执行时机：
 * - 订阅者（如 ReactiveEffect）执行 run() 方法时，在 cleanupEffect 之后、执行业务函数之前调用；
 * - 是“依赖收集 → 依赖校验 → 无效依赖清理”链路的第一步；
 *
 * @param sub 订阅者实例（实现 Subscriber 接口，如 ReactiveEffect、ComputedRefImpl）；
 */
function prepareDeps(sub: Subscriber) {
  // Prepare deps for tracking, starting from the head 准备 deps 进行跟踪，从头部开始
  // 1. 遍历订阅者的所有依赖链接（Link）：从 deps 头节点开始，直到链表末尾
  for (let link = sub.deps; link; link = link.nextDep) {
    // set all previous deps' (if any) version to -1 so that we can track 将所有先前的依赖项（如果有的话）的版本设置为-1，以便我们进行跟踪
    // which ones are unused after the run 哪些在运行后未被使用

    // 2. 核心步骤1：将 Link 的 version 置为 -1
    // 作用：标记该 Link 对应的依赖为“待校验未使用”状态
    // 后续逻辑：
    // - 若本次副作用执行时访问了该依赖 → Link.version 会被更新为 Dep 的最新版本号；
    // - 若未访问 → Link.version 仍为 -1，cleanupDeps 阶段会判定为“无效依赖”并清理；
    link.version = -1

    // store previous active sub if link was being used in another context 如果链接在另一个上下文中被使用，则存储之前的活跃子项
    // 3. 核心步骤2：暂存 Dep 原有活跃 Link
    // 作用：Link 可能在其他上下文被使用，暂存原有 activeLink 避免覆盖，执行完后可恢复
    // 场景：多副作用共享同一个 Dep 时，保证每个副作用的 Link 能正确关联
    link.prevActiveLink = link.dep.activeLink

    // 4. 核心步骤3：将当前 Link 设为 Dep 的 activeLink
    // 作用：依赖收集阶段（track）时，Dep 会通过 activeLink 关联到当前订阅者的 Link，
    // 保证本次访问的响应式数据能正确更新当前 Link 的 version 号
    link.dep.activeLink = link
  }
}

/**
 * Vue3 响应式系统核心工具函数：清理订阅者未使用的依赖（cleanupDeps）
 *
 * 核心作用：
 *    1. 无效依赖识别：遍历订阅者的依赖链表，通过 Link.version === -1 判定“本次执行未使用的依赖”；
 *    2. 双向清理：
 *       - 从 Dep 的订阅者链表中移除无效 Link（removeSub），避免 Dep 触发更新时通知无效订阅者；
 *       - 从订阅者的依赖链表中移除无效 Link（removeDep），释放内存；
 *    3. 上下文恢复：恢复 Dep 的 activeLink 为执行前的状态，避免多副作用共享 Dep 时的上下文污染；
 *    4. 链表重置：更新订阅者的 deps（头节点）和 depsTail（尾节点），保证依赖链表的正确性；
 *
 * 执行时机：
 *    - 订阅者（如 ReactiveEffect）执行 run() 方法时，在执行业务函数之后、恢复全局上下文之前调用；
 *    - 是“prepareDeps 标记 → 业务函数执行 → cleanupDeps 清理”依赖管理闭环的最后一步；
 *
 * @param sub 订阅者实例（实现 Subscriber 接口，如 ReactiveEffect、ComputedRefImpl）；
 */
function cleanupDeps(sub: Subscriber) {
  // Cleanup unused deps 清理未使用的 deps
  // 1. 初始化变量：
  let head // 清理后依赖链表的新头节点（最后一个未被移除的 Link）
  let tail = sub.depsTail // 清理后依赖链表的新尾节点（初始为原尾节点，遍历中动态更新）
  let link = tail // 遍历指针，从原尾节点开始反向遍历（双向链表反向遍历更高效）

  // 2. 反向遍历依赖链表（从尾节点到首节点）
  while (link) {
    // 暂存当前 Link 的前驱节点（双向链表反向遍历的关键）
    const prev = link.prevDep

    // 3. 核心判定：Link.version === -1 → 本次执行未使用该依赖 → 清理
    if (link.version === -1) {
      // 3.1 更新尾节点：若当前 Link 是原尾节点 → 尾节点前移为前驱节点
      if (link === tail) tail = prev

      // unused - remove it from the dep's subscribing effect list 未使用 - 将其从 dep 的订阅效果列表中删除
      // 3.2 第一步清理：从 Dep 的订阅者链表中移除该 Link
      // 作用：Dep 触发更新时，不再通知该订阅者（避免无效更新）
      removeSub(link)

      // also remove it from this effect's dep list 也将其从该效果的 dep 列表中删除
      // 3.3 第二步清理：从订阅者的依赖链表中移除该 Link
      // 作用：释放内存，订阅者不再持有该无效依赖的引用
      removeDep(link)
    } else {
      // The new head is the last node seen which wasn't removed  新头是最后一个可见且未被移除的节点
      // from the doubly-linked list 从双向链表中

      // 4. Link.version ≠ -1 → 本次执行使用了该依赖 → 保留
      // 记录最后一个未被移除的 Link 作为新的头节点（反向遍历，最后一个保留的 Link 即为头节点）
      head = link
    }

    // restore previous active link if any 恢复以前的活动链接（如果有）
    // 5. 上下文恢复：
    // 5.1 将 Dep 的 activeLink 恢复为执行 prepareDeps 前的状态（link.prevActiveLink）
    // 作用：避免多副作用共享同一个 Dep 时，activeLink 被当前副作用污染
    link.dep.activeLink = link.prevActiveLink
    // 5.2 清空 Link 的 prevActiveLink，释放内存，避免残留
    link.prevActiveLink = undefined

    // 6. 反向遍历：指针前移到前驱节点
    link = prev
  }

  // set the new head & tail 设置新的头部和尾部
  // 7. 重置订阅者的依赖链表头尾指针 → 完成清理
  //      - sub.deps：新的头节点（仅保留本次执行使用的依赖）
  //      - sub.depsTail：新的尾节点
  sub.deps = head
  sub.depsTail = tail
}

/**
 * Vue3 响应式系统核心工具函数：判断订阅者是否为“脏值”（isDirty）
 *
 * 核心作用：
 *    1. 版本号对比：遍历订阅者的所有依赖链接（Link），对比 Link 版本号与关联 Dep 版本号；
 *    2. 计算属性校验：若依赖为计算属性，先刷新计算属性值，再重新校验版本号；
 *    3. 兼容处理：支持第三方库（如 Pinia 测试模块）手动设置的 _dirty 标记，保证向后兼容；
 *    4. 脏值判定：只要有任一依赖版本不匹配/计算属性需更新/手动标记脏值 → 返回 true（需要重新执行）；
 *
 * 脏值定义：
 *    - 订阅者（如组件渲染副作用、watch 回调）的依赖数据已变化，但订阅者尚未执行更新 → 视为“脏值”；
 *    - 脏值订阅者需要执行 run() 方法重新执行，以同步最新的依赖数据；
 *
 * @param sub 订阅者实例（实现 Subscriber 接口，如 ReactiveEffect、ComputedRefImpl）；
 * @returns boolean：true → 脏值（需要重新执行）；false → 非脏值（无需执行）；
 */
function isDirty(sub: Subscriber): boolean {
  // 1. 遍历订阅者的所有依赖链接（Link）：从 deps 头节点开始，直到链表结束
  for (let link = sub.deps; link; link = link.nextDep) {
    // 2. 核心判定条件：满足任一条件 → 订阅者为脏值
    if (
      // 2.1 基础判定：Link 版本号 ≠ 关联 Dep 版本号 → 依赖已变化
      link.dep.version !== link.version ||
      (link.dep.computed && // 2.2 计算属性专属判定：当前依赖是计算属性 Dep
        (refreshComputed(link.dep.computed) || // 2.2.1 刷新计算属性值（若计算属性自身为脏值，会重新计算并更新版本号）
          link.dep.version !== link.version)) // 2.2.2 刷新后再次校验：Dep 版本号 ≠ Link 版本号 → 计算属性值已变化
    ) {
      return true // 任一依赖满足条件 → 订阅者为脏值，立即返回 true
    }
  }
  // @ts-expect-error only for backwards compatibility where libs manually set 仅用于手动设置库的向后兼容性
  // this flag - e.g. Pinia's testing module 这个标志 - 例如Pinia的测试模块
  if (sub._dirty) {
    return true
  }

  // 4. 所有依赖版本匹配、无计算属性更新、无手动脏值标记 → 非脏值，返回 false
  return false
}

/**
 * Returning false indicates the refresh failed 返回 false 表示刷新失败
 * @internal
 */
export function refreshComputed(computed: ComputedRefImpl): undefined {
  if (
    computed.flags & EffectFlags.TRACKING &&
    !(computed.flags & EffectFlags.DIRTY)
  ) {
    return
  }
  computed.flags &= ~EffectFlags.DIRTY

  // Global version fast path when no reactive changes has happened since
  // last refresh.
  if (computed.globalVersion === globalVersion) {
    return
  }
  computed.globalVersion = globalVersion

  // In SSR there will be no render effect, so the computed has no subscriber
  // and therefore tracks no deps, thus we cannot rely on the dirty check.
  // Instead, computed always re-evaluate and relies on the globalVersion
  // fast path above for caching.
  // #12337 if computed has no deps (does not rely on any reactive data) and evaluated,
  // there is no need to re-evaluate.
  if (
    !computed.isSSR &&
    computed.flags & EffectFlags.EVALUATED &&
    ((!computed.deps && !(computed as any)._dirty) || !isDirty(computed))
  ) {
    return
  }
  computed.flags |= EffectFlags.RUNNING

  const dep = computed.dep
  const prevSub = activeSub
  const prevShouldTrack = shouldTrack
  activeSub = computed
  shouldTrack = true

  try {
    prepareDeps(computed)
    const value = computed.fn(computed._value)
    if (dep.version === 0 || hasChanged(value, computed._value)) {
      computed.flags |= EffectFlags.EVALUATED
      computed._value = value
      dep.version++
    }
  } catch (err) {
    dep.version++
    throw err
  } finally {
    activeSub = prevSub
    shouldTrack = prevShouldTrack
    cleanupDeps(computed)
    computed.flags &= ~EffectFlags.RUNNING
  }
}

/**
 * Vue3 响应式系统核心工具函数：从 Dep 订阅者链表中移除 Link 节点（removeSub）
 *
 * 核心作用：
 *    1. 链表维护：修改 Link 前驱/后继节点的指针，从 Dep 的订阅者双向链表中移除当前 Link；
 *    2. 头尾指针修正：若移除的是链表头/尾节点，更新 Dep 的 subsHead/subs （尾节点）指针；
 *    3. 计算属性清理：若 Dep 关联计算属性且无订阅者，递归“软清理”计算属性的所有依赖；
 *    4. 引用计数管理：通过 dep.sc（sub count）计数，无订阅者时从 Dep 映射表删除 Dep，释放内存；
 *    5. 软清理兼容：支持 soft 模式（仅移除链表关联，不修改引用计数/映射），适配计算属性场景；
 *
 * 执行时机：
 *    - cleanupDeps 清理无效依赖时调用（soft = false）；
 *    - 计算属性无订阅者时，递归清理其依赖 Link 时调用（soft = true）；
 *    - 副作用 stop 时，遍历依赖链表移除订阅时调用（soft = false）；
 *
 * @param link 待移除的 Link 节点（关联 Dep 和 Subscriber 的双向链表节点）；
 * @param soft 软清理标记（默认 false）：
 *             - false：完整清理（修改链表+引用计数+映射表）；
 *             - true：仅清理链表关联，不修改 sc 计数和映射表（适配计算属性）；
 */
function removeSub(link: Link, soft = false) {
  // 1. 解构 Link 关联的核心属性：
  const {
    dep, // - dep：当前 Link 绑定的 Dep 实例；
    prevSub, // - prevSub：Link 在 Dep 订阅链表中的前驱节点；
    nextSub, // - nextSub：Link 在 Dep 订阅链表中的后继节点；
  } = link

  // 2. 第一步：维护双向链表结构 → 移除当前 Link
  // 2.1 若有前驱节点 → 前驱节点的后继指针指向当前 Link 的后继节点，清空当前 Link 的前驱指针
  if (prevSub) {
    prevSub.nextSub = nextSub
    link.prevSub = undefined // 清空指针，避免内存泄漏
  }

  // 2.2 若有后继节点 → 后继节点的前驱指针指向当前 Link 的前驱节点，清空当前 Link 的后继指针
  if (nextSub) {
    nextSub.prevSub = prevSub
    link.nextSub = undefined // 清空指针，避免内存泄漏
  }

  // 3. 第二步：修正 Dep 的订阅链表头节点（开发环境校验）
  if (__DEV__ && dep.subsHead === link) {
    // was previous head, point new head to next 是前一个头，将新头指向下一个
    dep.subsHead = nextSub
  }

  // 4. 第三步：修正 Dep 的订阅链表尾节点（subs 是 Dep 的尾节点指针）
  if (dep.subs === link) {
    // was previous tail, point new tail to prev 是前一个尾部，将新尾部指向前一个尾部
    // 4.1 若当前 Link 是尾节点 → 新尾节点指向前驱节点
    dep.subs = prevSub

    // 4.2 特殊场景：无前驱节点（Dep 无订阅者）且 Dep 关联计算属性 → 清理计算属性依赖
    if (!prevSub && dep.computed) {
      // if computed, unsubscribe it from all its deps so this computed and its 如果进行了计算，则取消其所有依赖项的订阅，以便此计算及其
      // value can be GCed 该值可以被垃圾回收（GC）

      // 4.2.1 关闭计算属性的依赖追踪标记 → 停止收集新依赖
      dep.computed.flags &= ~EffectFlags.TRACKING

      // 4.2.2 递归遍历计算属性的所有依赖 Link，执行“软清理”
      for (let l = dep.computed.deps; l; l = l.nextDep) {
        // here we are only "soft" unsubscribing because the computed still keeps 这里我们只是“软”取消订阅，因为计算仍在继续
        // referencing the deps and the dep should not decrease its sub count 引用依赖项和依赖项本身不应减少其子项计数
        // 此处仅执行“软清理”：计算属性仍保留依赖引用，Dep 无需减少订阅计数（sc）
        removeSub(l, true)
      }
    }
  }

  // 5. 第四步：非软清理 + Dep 订阅计数归 0 + Dep 有映射表 → 从映射表删除 Dep
  if (!soft && !--dep.sc && dep.map) {
    // #11979
    // property dep no longer has effect subscribers, delete it 属性dep不再有有效的订阅者，请删除它
    // this mostly is for the case where an object is kept in memory but only a 这主要是针对一个对象被保存在内存中，但只保留其一部分的情况
    // subset of its properties is tracked at one time 一次只跟踪其部分属性

    // 从 Dep 的映射表（map）中删除当前 Dep（key 为属性名）
    dep.map.delete(dep.key)
  }
}

/**
 * Vue3 响应式系统核心工具函数：从订阅者的依赖链表中移除 Link 节点（removeDep）
 *
 * 核心作用：
 *    1. 链表维护：修改 Link 节点的前驱（prevDep）/后继（nextDep）指针，将目标 Link 从订阅者的依赖双向链表中移除；
 *    2. 内存安全：清空 Link 自身的 prevDep/nextDep 指针，避免悬空引用，防止内存泄漏；
 *    3. 职责单一：仅处理“订阅者 → Link”侧的链表结构，不涉及 Dep 侧的订阅链表（Dep 侧清理由 removeSub 负责）；
 *
 * 执行时机：
 * - cleanupDeps 函数中判定 Link 为无效依赖（version === -1）时调用；
 * - 与 removeSub 配合使用：removeSub 清理 Dep 侧订阅链表，removeDep 清理订阅者侧依赖链表；
 *
 * @param link 待移除的 Link 节点（关联 Dep 和 Subscriber 的双向链表节点）；
 */
function removeDep(link: Link) {
  // 1. 解构 Link 节点在“订阅者依赖链表”中的前驱和后继指针：
  // - prevDep：当前 Link 在订阅者依赖链表中的上一个节点；
  // - nextDep：当前 Link 在订阅者依赖链表中的下一个节点；
  const { prevDep, nextDep } = link

  // 2. 第一步：处理前驱节点，维护链表连续性
  if (prevDep) {
    // 2.1 前驱节点的后继指针 → 指向当前 Link 的后继节点（跳过当前 Link）
    prevDep.nextDep = nextDep
    // 2.2 清空当前 Link 的前驱指针 → 解除引用，避免内存泄漏
    link.prevDep = undefined
  }

  // 3. 第二步：处理后继节点，维护链表连续性
  if (nextDep) {
    // 3.1 后继节点的前驱指针 → 指向当前 Link 的前驱节点（跳过当前 Link）
    nextDep.prevDep = prevDep
    // 3.2 清空当前 Link 的后继指针 → 解除引用，避免内存泄漏
    link.nextDep = undefined
  }

  // 注：该函数仅修改链表指针，不负责更新订阅者的 deps/depsTail 头尾指针
  // 订阅者头尾指针的更新由调用方（cleanupDeps）在遍历完成后统一处理
}

export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions,
): ReactiveEffectRunner<T> {
  if ((fn as ReactiveEffectRunner).effect instanceof ReactiveEffect) {
    fn = (fn as ReactiveEffectRunner).effect.fn
  }

  const e = new ReactiveEffect(fn)
  if (options) {
    extend(e, options)
  }
  try {
    e.run()
  } catch (err) {
    e.stop()
    throw err
  }
  const runner = e.run.bind(e) as ReactiveEffectRunner
  runner.effect = e
  return runner
}

/**
 * Stops the effect associated with the given runner.
 *
 * @param runner - Association with the effect to stop tracking.
 */
export function stop(runner: ReactiveEffectRunner): void {
  runner.effect.stop()
}

/**
 * @internal 标志当前是否应该进行依赖追踪，默认为 true
 * 当设置为 false 时，将会暂停响应式系统的依赖收集
 */
export let shouldTrack = true
const trackStack: boolean[] = []

/**
 * 暂时暂停跟踪。
 *
 * Temporarily pauses tracking. 暂时停止追踪
 */
export function pauseTracking(): void {
  // 将当前的 shouldTrack 状态压入 trackStack栈 中
  trackStack.push(shouldTrack)
  // 将 shouldTrack 设置为 false，从而暂停响应式系统的依赖收集。
  shouldTrack = false
}

/**
 * 启用依赖追踪功能
 *
 * Re-enables effect tracking (if it was paused). 重新启用效果跟踪（如果已暂停）。
 */
export function enableTracking(): void {
  // 将当前的追踪状态压入追踪栈中
  trackStack.push(shouldTrack)
  // 设置shouldTrack为true以开启新的追踪周期
  shouldTrack = true
}

/**
 * 重置之前的全局依赖跟踪状态
 *
 * Resets the previous global effect tracking state. 重置之前的全局效果跟踪状态
 */
export function resetTracking(): void {
  // 从跟踪栈中弹出最后一个跟踪状态，并将其设置为当前的shouldTrack值。
  const last = trackStack.pop()
  // 如果栈为空，则默认将shouldTrack设为true，表示开启跟踪。
  shouldTrack = last === undefined ? true : last
}

/**
 * Vue3 响应式系统公开工具函数：为当前活跃副作用注册清理函数（onEffectCleanup）
 *
 * Registers a cleanup function for the current active effect. 为当前活动效果注册一个清理函数
 * The cleanup function is called right before the next effect run, or when the 清理函数会在下一次效果运行之前，或者当
 * effect is stopped. 效果已停止
 *
 * Throws a warning if there is no current active effect. The warning can be 如果当前没有活动效果，则抛出一个警告。该警告可以是
 * suppressed by passing `true` to the second argument. 通过向第二个参数传入`true`来抑制
 *
 * @param fn - the cleanup function to be registered 要注册的清理函数 --> 清理函数（用户定义的逻辑，如取消定时器、事件监听、网络请求等）；
 * @param failSilently 静默失败标记（默认 false）：
 *                     - false：开发环境无活跃副作用时抛出警告；
 *                     - true：无活跃副作用时静默失败，不抛警告；
 */
export function onEffectCleanup(fn: () => void, failSilently = false): void {
  // 1. 核心逻辑：若当前存在活跃的 ReactiveEffect 实例 → 绑定清理函数
  if (activeSub instanceof ReactiveEffect) {
    // 将用户传入的清理函数赋值给活跃副作用的 cleanup 属性
    // 后续 cleanupEffect 执行时会调用该函数，并重置为 undefined
    activeSub.cleanup = fn
  }
  // 2. 开发环境校验：无活跃副作用且未开启静默模式 → 抛出警告
  else if (__DEV__ && !failSilently) {
    warn(
      `onEffectCleanup() was called when there was no active effect` + // onEffectCleanup() 在没有活动效果时被调用
        ` to associate with.`, // 与...联系
    )
  }
}

/**
 * Vue3 响应式系统核心工具函数：执行副作用的清理逻辑（cleanupEffect）
 *
 * 核心作用：
 *    1. 清理函数执行：安全调用 ReactiveEffect 实例注册的 cleanup 函数（如 watchEffect 的 onCleanup 逻辑）；
 *    2. 上下文隔离：执行清理函数时，将全局活跃副作用（activeSub）置为 undefined，避免清理逻辑意外收集依赖；
 *    3. 状态重置：执行后清空副作用实例的 cleanup 引用，避免重复执行；
 *    4. 异常安全：通过 try/finally 保证执行过程中即使出错，也能恢复全局活跃副作用上下文；
 *
 * 清理函数场景：
 *    - watchEffect 中通过 onCleanup 注册的清理逻辑（如取消定时器、取消事件监听、取消网络请求）；
 *    - 副作用停止（stop）或重新执行（run）前，需要执行上一轮的清理逻辑，避免内存泄漏；
 *
 * @param e ReactiveEffect 实例（普通副作用，如组件渲染、watch/watchEffect 回调）；
 */
function cleanupEffect(e: ReactiveEffect) {
  // 1. 解构并暂存当前副作用的清理函数，避免执行过程中被修改
  const { cleanup } = e
  // 2. 重置副作用实例的 cleanup 引用为 undefined，确保清理函数仅执行一次
  e.cleanup = undefined

  // 3. 若存在清理函数 → 安全执行
  if (cleanup) {
    // run cleanup without active effect 运行清理但没有主动效果

    // 核心逻辑：执行清理函数时，必须隔离全局活跃副作用上下文
    // 原因：清理函数（如取消定时器）不应触发新的依赖收集，否则会导致依赖追踪错误

    // 3.1 暂存当前全局活跃的副作用（activeSub），用于后续恢复
    const prevSub = activeSub
    // 3.2 将全局活跃副作用置为 undefined → 禁用依赖收集
    activeSub = undefined

    try {
      // 3.3 执行清理函数（如取消定时器、事件监听等）
      cleanup()
    } finally {
      // 3.4 无论清理函数是否抛出异常，都必须恢复全局活跃副作用上下文
      // 避免影响后续正常的依赖收集逻辑
      activeSub = prevSub
    }
  }
}
