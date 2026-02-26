import { extend, isArray, isIntegerKey, isMap, isSymbol } from '@vue/shared'
import type { ComputedRefImpl } from './computed'
import { type TrackOpTypes, TriggerOpTypes } from './constants'
import {
  type DebuggerEventExtraInfo,
  EffectFlags,
  type Subscriber,
  activeSub,
  endBatch,
  shouldTrack,
  startBatch,
} from './effect'

/**
 * Incremented every time a reactive change happens 每次发生响应式变化时都会递增
 * This is used to give computed a fast path to avoid re-compute when nothing 这用于为计算提供一条快速路径，以避免在无操作时进行重新计算
 * has changed. 已经改变了
 */
export let globalVersion = 0

/**
 * Represents a link between a source (Dep) and a subscriber (Effect or Computed). 表示源（Dep）与订阅者（Effect或Computed）之间的链接
 * Deps and subs have a many-to-many relationship - each link between a 依赖项（Deps）和子项（subs）之间存在多对多的关系——每个依赖项和子项之间的链接
 * dep and a sub is represented by a Link instance. 依赖（dep）和子项（sub）由一个Link实例表示
 *
 * A Link is also a node in two doubly-linked lists - one for the associated 一个链接同时也是两个双向链表中的一个节点——一个用于关联
 * sub to track all its deps, and one for the associated dep to track all its 一个用于跟踪所有依赖项，另一个用于跟踪相关依赖项的所有依赖项
 * subs. 订阅
 *
 * @internal
 */
export class Link {
  /**
   * - Before each effect run, all previous dep links' version are reset to -1 在每次效果运行之前，所有之前的依赖链接的版本都会重置为-1
   * - During the run, a link's version is synced with the source dep on access 在运行过程中，链接的版本会在访问时与源依赖项同步
   * - After the run, links with version -1 (that were never used) are cleaned 运行后，将清除版本为-1（从未使用过）的链接
   *   up
   */
  version: number

  /**
   * Pointers for doubly-linked lists 双向链表的指针
   */
  nextDep?: Link
  prevDep?: Link
  nextSub?: Link
  prevSub?: Link
  prevActiveLink?: Link

  constructor(
    public sub: Subscriber,
    public dep: Dep,
  ) {
    this.version = dep.version
    this.nextDep =
      this.prevDep =
      this.nextSub =
      this.prevSub =
      this.prevActiveLink =
        undefined
  }
}

/**
 * @internal
 */
/**
 * Vue3 响应式系统的核心依赖管理器（Dep 类）
 *
 * 核心作用：
 *  1. 依赖收集（track）：将当前活跃的副作用（activeSub）通过双向链表 Link 关联到 Dep，建立「数据→副作用」的映射；
 *  2. 更新触发（trigger）：递增版本号并触发 notify，通知所有订阅的副作用执行更新；
 *  3. 批量通知（notify）：通过批量更新机制（startBatch/endBatch）执行订阅者的 notify 方法，保证执行效率；
 *  4. 调试支持：开发环境触发 onTrigger 钩子，按原始顺序执行调试逻辑；
 *  5. 计算属性适配：识别 ComputedRefImpl 订阅者，递归触发其 dep 的 notify，保证计算属性更新链路完整；
 *
 * 核心数据结构：
 * - Link：双向链表节点，关联 Dep 和 Subscriber（副作用），存储版本号、前后节点等信息；
 * - Subscriber：订阅者接口（如 Effect/ComputedRefImpl），需实现 notify 方法；
 *
 * 核心枚举/类型：
 * - EffectFlags：副作用标记，NOTIFIED 表示已通知更新，避免重复处理；
 * - DebuggerEventExtraInfo：调试事件扩展信息，包含 target/type/key 等上下文；
 * - KeyToDepMap：类型别名，Map<unknown, Dep>，对应 targetMap 中单个对象的「属性→Dep」映射；
 */
export class Dep {
  /**
   * Dep 版本号：每次 trigger 时递增，用于快速判断依赖是否需要更新（如 computed 对比版本号避免重复计算）
   */
  version = 0

  /**
   *
   * Link between this dep and the current active effect 该 dep 与当前活动效果之间的链接
   *
   * 当前 Dep 与「当前活跃副作用」的关联链表节点
   * 作用：缓存当前 Dep 与 activeSub 的 Link 实例，避免重复创建，提升 track 性能
   *
   *  - 在副作用重新执行的时候, 会将该 dep.activeLink 置为与 sub 关联的 dep, 无需重复创建 Link
   */
  activeLink?: Link = undefined

  /**
   * Doubly linked list representing the subscribing effects (tail) 表示订阅效果的双向链表（尾部）
   *
   * 订阅当前 Dep 的副作用链表（尾节点）
   * 双向链表的尾指针，遍历订阅者时从尾向前遍历（配合批量更新保证执行顺序）
   *
   */
  subs?: Link = undefined

  /**
   * Doubly linked list representing the subscribing effects (head) 表示订阅效果的双向链表（头）
   * DEV only, for invoking onTrigger hooks in correct order 仅限 DEV，用于以正确的顺序调用 onTrigger 挂钩
   */
  /**
   * 订阅当前 Dep 的副作用链表（头节点）【仅开发环境】
   * 作用：保证 onTrigger 钩子按「订阅顺序」执行（与 subs 尾遍历互补）
   */
  subsHead?: Link

  /**
   * For object property deps cleanup 用于对象属性 deps 清理
   */
  /**
   * 关联到所属的「属性→Dep」映射表（KeyToDepMap）
   * 用于对象属性 Dep 的清理逻辑（如响应式对象销毁时，通过 map 快速定位并清理 Dep）
   */
  map?: KeyToDepMap = undefined

  /**
   * 当前 Dep 对应的响应式对象属性名/索引（如 'name'、0）
   * 用于调试和清理时标识 Dep 所属的属性
   */
  key?: unknown = undefined

  /**
   * Subscriber counter 订阅者计数器
   */
  /**
   * 订阅者计数器（Subscriber Counter）
   * 统计当前 Dep 的订阅者数量，用于性能监控/调试（非核心逻辑）
   */
  sc: number = 0

  /**
   * @internal 跳过响应式转换（ReactiveFlags.SKIP 别名）
   *  标记 Dep 实例本身不是响应式对象，避免被 reactive/ref 误处理
   */
  readonly __v_skip = true
  // TODO isolatedDeclarations ReactiveFlags.SKIP TODO 隔离声明 ReactiveFlags.SKIP

  /**
   * 构造函数：初始化 Dep 实例，关联计算属性（可选）
   * @param computed 可选，当前 Dep 关联的 ComputedRefImpl 实例（仅计算属性场景使用）
   */
  constructor(public computed?: ComputedRefImpl | undefined) {
    // 开发环境初始化头节点为 undefined（生产环境无 subsHead，节省内存）
    if (__DEV__) {
      this.subsHead = undefined
    }
  }

  /**
   * 依赖收集核心方法：将当前活跃副作用（activeSub）关联到当前 Dep
   *
   * 核心逻辑：
   *  1. 前置条件校验，避免无效收集；
   *  2. 复用/创建 Link 节点，关联 Dep 与 activeSub；
   *  3. 维护 activeSub 的 dep 链表（按访问顺序调整节点位置）；
   *  4. 开发环境触发 onTrack 调试钩子；
   *
   * 注意: 通过维护 dep.subs 双向链表来确定该 dep 收集到的订阅者(副作用函数)
   *
   * @param debugInfo 可选，调试扩展信息（target/type/key 等）
   * @returns Link | undefined 关联当前 Dep 与 activeSub 的链表节点（无有效副作用时返回 undefined）
   */
  track(debugInfo?: DebuggerEventExtraInfo): Link | undefined {
    // 前置条件拦截：无活跃副作用/禁止收集/副作用是当前 Dep 关联的计算属性 → 跳过收集
    if (!activeSub || !shouldTrack || activeSub === this.computed) {
      return
    }

    // 1. 获取当前 Dep 与 activeSub 的关联节点（优先复用缓存的 activeLink）
    let link = this.activeLink
    // 无缓存节点 或 缓存节点的订阅者不是当前 activeSub → 创建新 Link 节点
    if (link === undefined || link.sub !== activeSub) {
      // 创建新 Link 节点，关联 activeSub 和当前 Dep
      link = this.activeLink = new Link(activeSub, this)

      // add the link to the activeEffect as a dep (as tail) 将链接添加到 activeEffect 作为 dep （作为 tail）
      // 2. 将新 Link 节点添加到 activeSub 的 dep 链表尾部（维护副作用的 dep 访问顺序）
      if (!activeSub.deps) {
        // 副作用无 dep 链表 → 初始化头/尾节点为当前 link
        activeSub.deps = activeSub.depsTail = link
      } else {
        // 副作用已有 dep 链表 → 将 link 追加到尾部
        link.prevDep = activeSub.depsTail
        activeSub.depsTail!.nextDep = link
        activeSub.depsTail = link
      }

      // 3. 将 link 加入当前 Dep 的订阅者链表（subs/subsHead）
      addSub(link)
    }
    // 缓存节点存在且订阅者匹配 → 同步版本号并调整链表位置（保证访问顺序）
    // 当副作用函数重新执行时, 会将 link.version 置为 -1, 表示重新依赖收集
    else if (link.version === -1) {
      // reused from last run - already a sub, just sync version 从上次运行中重复使用 - 已经是子版本，只是同步版本
      // 同步 link 版本号为当前 Dep 版本号（标记为已关联）
      link.version = this.version

      // If this dep has a next, it means it's not at the tail - move it to the 如果这个 dep 有下一个，则意味着它不在尾部 - 将其移至
      // tail. This ensures the effect's dep list is in the order they are 尾巴。这确保了效果的 dep 列表是按顺序排列的
      // accessed during evaluation. 在评估期间访问。
      // 若 link 不在副作用 dep 链表尾部 → 移动到尾部（保证 dep 链表按访问顺序排列）
      if (link.nextDep) {
        const next = link.nextDep
        // 移除当前 link 节点
        next.prevDep = link.prevDep
        if (link.prevDep) {
          link.prevDep.nextDep = next
        }

        // 将 link 追加到链表尾部
        link.prevDep = activeSub.depsTail
        link.nextDep = undefined
        activeSub.depsTail!.nextDep = link
        activeSub.depsTail = link

        // this was the head - point to the new head 这是头部 - 指向新头部
        // 若 link 原先是头节点 → 更新头节点为 next
        if (activeSub.deps === link) {
          activeSub.deps = next
        }
      }
    }

    // 开发环境：触发 activeSub 的 onTrack 调试钩子（传递调试信息）
    if (__DEV__ && activeSub.onTrack) {
      activeSub.onTrack(
        extend(
          {
            effect: activeSub, // 关联当前副作用
          },
          debugInfo, // 合并 target/type/key 等调试信息
        ),
      )
    }

    // 返回关联当前 Dep 与 activeSub 的 Link 节点
    return link
  }

  /**
   * 触发更新核心方法：递增版本号并通知所有订阅者
   * 核心逻辑：版本号递增（全局+当前 Dep）→ 调用 notify 执行批量更新
   * @param debugInfo 可选，调试扩展信息（传递给 notify）
   */
  trigger(debugInfo?: DebuggerEventExtraInfo): void {
    // 递增当前 Dep 版本号（用于计算属性等判断是否需要重新计算）
    this.version++
    // 递增全局版本号（全局标记响应式数据更新）
    globalVersion++
    // 通知所有订阅者执行更新
    this.notify(debugInfo)
  }

  /**
   * 批量通知订阅者执行更新
   * 核心逻辑：
   *  1. 遍历 subs 链表（从尾向前），执行订阅者的 notify 方法；
   *      - 在一个周期中, 将其推入到 batchedSub 链表中,
   *      - 在 endBatch 中, 通过 batchedSub 链表来执行订阅者 sub.trigger() 方法, 根据时机不同, 在适当的时机中执行
   *          -- 同步: sync --> 立即执行
   *          -- 其他: 推入到队列中, 在合适的时机中执行
   *              --- 通过 sub.flags 来判定是否推入到队列中, 防止重复推入
   *              --- 在执行 sub.run() 后会重置标记
   *  2. 识别计算属性订阅者，递归触发其 dep 的 notify；
   *
   *
   * @param debugInfo 可选，调试扩展信息（传递给 onTrigger）
   */
  notify(debugInfo?: DebuggerEventExtraInfo): void {
    // 开启批量更新：将副作用执行加入队列，避免同步执行导致的性能问题
    startBatch()
    try {
      // 开发环境逻辑：按 subsHead 顺序触发 onTrigger 钩子（保证调试顺序与订阅顺序一致）
      if (__DEV__) {
        // subs are notified and batched in reverse-order and then invoked in subs 被通知并以相反的顺序进行批处理，然后在
        // original order at the end of the batch, but onTrigger hooks should 批次结束时的原始顺序，但 onTrigger 挂钩应该
        // be invoked in original order here. 此处按原始顺序调用。

        // subsHead 是链表头，从头遍历 → 按订阅顺序执行 onTrigger
        for (let head = this.subsHead; head; head = head.nextSub) {
          // 订阅者有 onTrigger 钩子 且 未被标记为已通知 → 执行钩子
          if (head.sub.onTrigger && !(head.sub.flags & EffectFlags.NOTIFIED)) {
            head.sub.onTrigger(
              extend(
                {
                  effect: head.sub, // 关联当前订阅者
                },
                debugInfo, // 合并调试信息
              ),
            )
          }
        }
      }

      // 核心逻辑：遍历 subs 链表（从尾向前），执行订阅者的 notify 方法
      for (let link = this.subs; link; link = link.prevSub) {
        // 执行订阅者的 notify 方法 → 返回 true 表示是计算属性（ComputedRefImpl）
        if (link.sub.notify()) {
          // if notify() returns `true`, this is a computed. Also call notify 如果notify()返回`true`，则这是一个计算属性。同时调用notify
          // on its dep - it's called here instead of inside computed's notify 在其依赖项上 - 这里调用它，而不是在computed的notify内部调用
          // in order to reduce call stack depth. 为了减少调用栈深度

          /**
           * 计算属性场景：递归触发其 dep 的 notify（减少调用栈深度，提升性能）
           *  - 当计算属性依赖项发生变化时, 计算属性(继承至 Subscriber, 同时也是一个订阅者)会被通知
           *  - 同时也需要通知依赖了计算属性的订阅者
           */
          ;(link.sub as ComputedRefImpl).dep.notify()
        }
      }
    } finally {
      // 关闭批量更新：执行队列中所有待执行的副作用（如组件渲染、watch 回调）
      endBatch()
    }
  }
}

/**
 * Vue3 响应式系统的核心工具函数：将 Link 节点添加到 Dep 的订阅者链表
 *
 * 核心作用：
 *    1. 订阅计数：递增 Dep 的订阅者计数器（sc），统计当前 Dep 的订阅者数量；
 *    2. 计算属性适配：处理计算属性首次订阅场景，启用其依赖追踪并递归订阅所有依赖；
 *    3. 链表维护：将 Link 节点添加到 Dep 的订阅者双向链表尾部（subs），维护 prevSub/nextSub 关联；
 *    4. 调试适配：开发环境初始化 Dep 的 subsHead（订阅者链表头节点），保证调试顺序正确；
 *
 * 核心依赖说明：
 * - Link：双向链表节点，关联 Dep（dep）和 Subscriber（sub），包含 prevSub/nextSub（订阅者链表指针）、prevDep/nextDep（副作用 dep 链表指针）；
 * - EffectFlags：副作用标记枚举：
 *   - TRACKING：标记副作用/计算属性“启用依赖追踪”；
 *   - DIRTY：标记计算属性“脏值”（需要重新计算）；
 * - ComputedRefImpl：计算属性实现类，其 deps 链表存储计算属性依赖的所有响应式数据的 Link 节点；
 *
 * @param link 关联 Dep 和 Subscriber 的双向链表节点，需被添加到 Dep 的订阅者链表；
 */
function addSub(link: Link) {
  // 1. 递增当前 Dep 的订阅者计数器（sc = Subscriber Counter）
  // 作用：统计该 Dep 有多少个订阅者
  link.dep.sc++

  // 2. 核心前置条件：仅当副作用标记为「启用依赖追踪（TRACKING）」时，才执行链表添加逻辑
  // TRACKING 标记保证：仅在副作用活跃（如组件未卸载、watch 未停止）时添加订阅
  if (link.sub.flags & EffectFlags.TRACKING) {
    // 2.1 提取当前 Dep 关联的计算属性（若有）
    const computed = link.dep.computed

    // computed getting its first subscriber 计算得到第一个订阅者
    // enable tracking + lazily subscribe to all its deps 启用跟踪+延迟订阅其所有依赖项
    if (computed && !link.dep.subs) {
      // 为计算属性启用依赖追踪 + 标记为脏值（需要重新计算）
      // TRACKING：启用计算属性的依赖收集；DIRTY：保证首次访问时重新计算
      computed.flags |= EffectFlags.TRACKING | EffectFlags.DIRTY

      // 递归订阅计算属性依赖的所有响应式数据的 Link 节点
      // computed.deps 是计算属性 getter 执行时收集的所有依赖的 Link 链表
      for (let l = computed.deps; l; l = l.nextDep) {
        addSub(l)
      }
    }

    // 2.3 维护 Dep 的订阅者双向链表（subs 是尾节点）
    // 获取当前 Dep 订阅者链表的尾节点
    const currentTail = link.dep.subs

    // 若当前尾节点不是待添加的 link → 说明 link 未在链表中，执行添加逻辑
    if (currentTail !== link) {
      // 将 link 的 prevSub 指向当前尾节点（双向链表前驱关联）
      link.prevSub = currentTail
      // 若当前尾节点存在 → 将其 nextSub 指向 link（双向链表后继关联）
      if (currentTail) currentTail.nextSub = link
    }

    // 2.4 开发环境：初始化 Dep 的 subsHead（订阅者链表头节点）
    // subsHead 仅用于开发环境 onTrigger 钩子按订阅顺序执行，生产环境无此逻辑
    if (__DEV__ && link.dep.subsHead === undefined) {
      link.dep.subsHead = link
    }

    // 2.5 将 link 设置为 Dep 订阅者链表的新尾节点
    link.dep.subs = link
  }
}

// The main WeakMap that stores {target -> key -> dep} connections. 存储{目标 -> 键 -> 依赖}连接的主 WeakMap。
// Conceptually, it's easier to think of a dependency as a Dep class 从概念上讲，将依赖项视为Dep类更容易理解
// which maintains a Set of subscribers, but we simply store them as 它维护了一个订阅者集合，但我们只是将它们存储为
// raw Maps to reduce memory overhead. 使用原始映射以减少内存开销
type KeyToDepMap = Map<any, Dep>

/**
 * 全局依赖映射表，用于存储响应式系统中的依赖关系
 * 存储结构为：{target -> key -> dep} 连接
 * 每个目标对象(target)通过WeakMap映射到一个KeyToDepMap，
 * 该KeyToDepMap将属性键(key)映射到对应的依赖收集器(Dep)
 */
export const targetMap: WeakMap<object, KeyToDepMap> = new WeakMap()

export const ITERATE_KEY: unique symbol = Symbol(
  __DEV__ ? 'Object iterate' : '',
)
export const MAP_KEY_ITERATE_KEY: unique symbol = Symbol(
  __DEV__ ? 'Map keys iterate' : '',
)
export const ARRAY_ITERATE_KEY: unique symbol = Symbol(
  __DEV__ ? 'Array iterate' : '',
)

/**
 * Vue3 响应式系统的依赖收集核心函数（track）
 *
 * Tracks access to a reactive property. 跟踪对响应式属性的访问
 *
 * This will check which effect is running at the moment and record it as dep 这将检查当前正在运行的效果，并将其记录为dep
 * which records all effects that depend on the reactive property. 它记录了所有依赖于反应性质的影响
 *
 * @param target - Object holding the reactive property. 持有响应式属性的对象
 * @param type - Defines the type of access to the reactive property. 定义对响应式属性的访问类型
 * @param key - Identifier of the reactive property to track. 要跟踪的反应性属性的标识符
 */
export function track(target: object, type: TrackOpTypes, key: unknown): void {
  // 核心前置条件：仅当「允许收集依赖」(shouldTrack)且「有活跃副作用」(activeSub)时，才执行收集逻辑
  if (shouldTrack && activeSub) {
    // 第一步：从 targetMap 中获取当前响应式对象对应的「属性→Dep」映射表（depsMap）
    let depsMap = targetMap.get(target)

    // 若映射表不存在 → 创建新的 Map 并存入 targetMap
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }

    // 第二步：从 depsMap 中获取当前属性对应的 Dep 实例
    let dep = depsMap.get(key)

    // 若 Dep 实例不存在 → 创建新 Dep 并初始化关联信息，存入 depsMap
    if (!dep) {
      depsMap.set(key, (dep = new Dep()))
      dep.map = depsMap // 关联 Dep 到所属的 depsMap（便于后续调试/清理）
      dep.key = key // 记录 Dep 对应的属性名（便于后续调试/触发）
    }

    // 第三步：执行 Dep 的 track 方法，将当前活跃副作用添加到 Dep 中
    if (__DEV__) {
      dep.track({
        target, // 依赖收集的目标对象
        type, // 收集操作类型（GET/HAS/ITERATE）
        key, // 收集的属性名/索引
      })
    } else {
      dep.track()
    }
  }

  // 前置条件不满足时（无活跃副作用/禁止收集），静默返回，无任何操作
}

/**
 * Finds all deps associated with the target (or a specific property) and  查找与目标（或特定属性）关联的所有依赖项，并
 * triggers the effects stored within. 触发内部存储的效果
 *
 * @param target - The reactive object. 反应对象
 * @param type - Defines the type of the operation that needs to trigger effects. 定义需要触发效果的操作类型
 * @param key - Can be used to target a specific reactive property in the target object. 可用于定位目标对象中的特定响应式属性
 */
/**
 * Vue3 响应式系统的更新触发核心函数（trigger）
 *
 * 核心作用：
 *    1. 根据「响应式对象 + 修改类型 + 属性/索引」，从 targetMap 中找到关联的 Dep 实例；
 *    2. 重要: **根据操作类型的不同, 可能需要触发多个附带的 dep, 最终执行 dep.trigger() **
 *
 * @param target 响应式对象（如 reactive 包裹的对象/数组、Map/Set 等），触发更新的目标对象；
 * @param type 触发操作类型（TriggerOpTypes 枚举）：
 *             - SET：修改已有属性/索引（如 obj.a = 1、arr[0] = 2）；
 *             - ADD：新增属性/索引（如 obj.b = 1、arr.push(2)）；
 *             - DELETE：删除属性（如 delete obj.a、map.delete('key')）；
 *             - CLEAR：清空集合（如 map.clear()、set.clear()）；
 * @param key 被修改的属性名/索引/Map 键（如 'name'、0、'key'），可选；
 * @param newValue 新值（如 obj.a = 2 中的 2），可选；
 * @param oldValue 旧值（如 obj.a 修改前的 1），可选；
 * @param oldTarget 清空集合时的原始集合（如 map.clear() 前的 Map 实例），可选；
 */
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>,
): void {
  // 1. 从 targetMap 中获取当前响应式对象对应的「属性→Dep」映射表（depsMap）
  const depsMap = targetMap.get(target)
  // 1.1 若 depsMap 不存在 → 该对象从未被追踪过（无依赖）
  if (!depsMap) {
    // 递增全局版本号（保证依赖版本对比的正确性）
    // never been tracked 从未被追踪过
    globalVersion++
    return
  }

  // 2. 定义通用执行函数：触发单个 Dep 的 trigger 方法
  const run = (dep: Dep | undefined) => {
    if (dep) {
      if (__DEV__) {
        // 开发环境：传递完整调试信息（target/type/key/newValue 等）
        dep.trigger({
          target,
          type,
          key,
          newValue,
          oldValue,
          oldTarget,
        })
      } else {
        dep.trigger()
      }
    }
  }

  // 3. 开启批量更新：将副作用执行加入队列，避免同步修改多个数据时重复执行
  startBatch()

  // 4. 按触发类型分支处理
  // 4.1 CLEAR 类型（清空集合：map.clear()/set.clear()）
  if (type === TriggerOpTypes.CLEAR) {
    // collection being cleared 正在清除集合
    // trigger all effects for target 触发目标的所有效果
    depsMap.forEach(run)
  } else {
    // 4.2 非 CLEAR 类型（SET/ADD/DELETE）
    // 先判断目标是否为数组，以及 key 是否为数组整数索引
    const targetIsArray = isArray(target)
    const isArrayIndex = targetIsArray && isIntegerKey(key)

    // 4.2.1 特殊场景：修改数组的 length 属性
    if (targetIsArray && key === 'length') {
      const newLength = Number(newValue)

      // 遍历数组的所有 Dep，触发以下场景的 Dep：
      // - length 自身的 Dep（访问 arr.length 触发的依赖）；
      // - ARRAY_ITERATE_KEY（遍历数组触发的依赖，如 for...of）；
      // - 索引 >= newLength 的 Dep（原数组中超出新长度的索引，如 arr[5]，修改 length 为 3 后该索引失效）；
      depsMap.forEach((dep, key) => {
        if (
          key === 'length' ||
          key === ARRAY_ITERATE_KEY ||
          (!isSymbol(key) && key >= newLength)
        ) {
          run(dep)
        }
      })
    }
    // 4.2.2 普通场景（对象属性修改/数组索引修改/Map/Set 操作）
    else {
      // schedule runs for SET | ADD | DELETE 时间表运行时间为

      // 第一步：触发当前 key 对应的 Dep（SET/ADD/DELETE 核心触发）
      // 若 key 存在 或 depsMap 包含 void 0（特殊 key）→ 执行 run
      if (key !== void 0 || depsMap.has(void 0)) {
        run(depsMap.get(key))
      }

      // 第二步：数组整数索引修改 → 触发数组遍历相关的 Dep（ARRAY_ITERATE_KEY）
      // 如 arr[0] = 2 → 触发 for...of 遍历数组的副作用
      // schedule ARRAY_ITERATE for any numeric key change (length is handled above) 为任何数字键更改安排 ARRAY_ITERATE（长度已在上面处理）
      if (isArrayIndex) {
        run(depsMap.get(ARRAY_ITERATE_KEY))
      }

      // also run for iteration key on ADD | DELETE | Map.SET
      // 第三步：根据操作类型，触发遍历相关的 Dep（保证遍历操作的响应式）
      switch (type) {
        // ADD 类型（新增属性/索引）：
        case TriggerOpTypes.ADD:
          if (!targetIsArray) {
            // 非数组 → 触发对象遍历 Dep（ITERATE_KEY，如 for...in 遍历对象）
            run(depsMap.get(ITERATE_KEY))
            // 若是 Map → 额外触发 Map 键遍历 Dep（MAP_KEY_ITERATE_KEY，如 map.keys()）
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY))
            }
          } else if (isArrayIndex) {
            // new index added to array -> length changes 新索引添加到数组 -> 长度更改
            // 数组新增索引（如 arr[3] = 4，原长度为 3）→ 触发 length 的 Dep（length 自动增加）
            run(depsMap.get('length'))
          }
          break
        // DELETE 类型（删除属性）：
        case TriggerOpTypes.DELETE:
          if (!targetIsArray) {
            // 非数组 → 触发对象遍历 Dep（ITERATE_KEY）
            run(depsMap.get(ITERATE_KEY))
            // 若是 Map → 额外触发 Map 键遍历 Dep
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY))
            }
          }
          break
        // SET 类型（修改已有属性）：
        case TriggerOpTypes.SET:
          // Map 修改已有键 → 触发 Map 遍历 Dep（ITERATE_KEY，如 for...of 遍历 Map）
          if (isMap(target)) {
            run(depsMap.get(ITERATE_KEY))
          }
          break
      }
    }
  }

  // 5. 关闭批量更新：执行队列中所有待执行的副作用（如组件渲染、watch 回调）
  endBatch()
}

export function getDepFromReactive(
  object: any,
  key: string | number | symbol,
): Dep | undefined {
  const depMap = targetMap.get(object)
  return depMap && depMap.get(key)
}
