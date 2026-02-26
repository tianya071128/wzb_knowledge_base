import { ErrorCodes, callWithErrorHandling, handleError } from './errorHandling'
import { NOOP, isArray } from '@vue/shared'
import { type ComponentInternalInstance, getComponentName } from './component'

/**
 * Vue3 调度器作业状态标记枚举（SchedulerJobFlags）
 * 核心作用：
 *    1. 状态标记：通过位掩码（bitmask）标记调度器作业（Job/副作用）的核心状态；
 *    2. 逻辑控制：调度器根据这些标记决定作业的执行策略（如是否入队、是否允许递归、是否跳过已销毁作业）；
 *    3. 位运算优化：使用按位左移定义标记，支持多状态组合/校验，内存占用少且操作高效；
 *
 * 位运算说明：
 *    - 1 << n：将数字 1 左移 n 位，生成唯一的位掩码（如 1<<0=1，1<<1=2，1<<2=4，1<<3=8）；
 *    - 组合标记：job.flags = QUEUED | ALLOW_RECURSE（表示作业已入队且允许递归）；
 *    - 校验标记：if (job.flags & QUEUED)（判断作业是否已入队）；
 */
export enum SchedulerJobFlags {
  /**
   * 作业已入队标记（QUEUED = 1 << 0 = 1）
   * 核心作用：
   * - 防止作业重复入队：调度器添加作业时，先校验该标记，若已标记则跳过，避免同一作业多次入队；
   * - 典型场景：同步修改多个响应式数据时，同一组件渲染作业仅入队一次；
   */
  QUEUED = 1 << 0,

  /**
   * 预执行作业标记（PRE = 1 << 1 = 2）
   * 核心作用：
   * - 标记作业的执行时机为“组件更新前（pre）”；
   * - 典型场景：watch 配置 flush: "pre" 时，其回调作业会被标记为 PRE，在组件渲染前执行；
   */
  PRE = 1 << 1,

  /**
   * Indicates whether the effect is allowed to recursively trigger itself 表示该效果是否允许递归触发自身
   * when managed by the scheduler. 当由调度器管理时
   *
   * By default, a job cannot trigger itself because some built-in method calls, 默认情况下，作业无法自行触发，因为某些内置方法调用
   * e.g. Array.prototype.push actually performs reads as well (#1740) which 例如，Array.prototype.push 实际上也会执行读取操作 (#1740)
   * can lead to confusing infinite loops. 可能会导致令人困惑的无限循环
   * The allowed cases are component update functions and watch callbacks. 允许的情况是组件更新函数和watch回调函数
   * Component update functions may update child component props, which in turn 组件更新函数可能会更新子组件的 prop，而这些 prop 反过来又会
   * trigger flush: "pre" watch callbacks that mutates state that the parent 触发刷新：“pre”观察回调，该回调会改变父组件的状态
   * relies on (#1801). Watch callbacks doesn't track its dependencies so if it 依赖于 (#1801)。Watch callbacks 不会追踪其依赖项，因此如果它
   * triggers itself again, it's likely intentional and it is the user's 如果它再次触发，那么很可能是故意的，是用户的行为
   * responsibility to perform recursive state mutation that eventually 负责执行递归状态变更，最终
   * stabilizes (#1727). 稳定 (#1727)
   */
  /**
   * 允许递归触发标记（ALLOW_RECURSE = 1 << 2 = 4）
   * 核心作用：
   * - 标记作业是否允许递归触发自身（默认禁止）；
   * - 设计背景：
   *   1. 默认禁止递归：部分内置方法（如 Array.prototype.push）会同时触发“读+写”操作，易导致无限循环；
   *   2. 允许的场景：
   *      - 组件更新函数：父组件更新可能修改子组件 props，触发子组件 pre 阶段的 watch 回调，进而修改父组件依赖的状态；
   *      - watch 回调：watch 不追踪自身依赖，若递归触发通常是开发者有意为之（需开发者保证最终状态稳定）；
   */
  ALLOW_RECURSE = 1 << 2,

  /**
   * 作业已销毁标记（DISPOSED = 1 << 3 = 8）
   * 核心作用：
   * - 标记作业已被销毁/停止，调度器执行前校验该标记，若已销毁则跳过执行；
   * - 典型场景：
   *   - 组件卸载后，其渲染作业被标记为 DISPOSED，避免无效执行；
   *   - watch 调用 stop() 后，其回调作业被标记为 DISPOSED；
   */
  DISPOSED = 1 << 3,
}

export interface SchedulerJob extends Function {
  id?: number
  /**
   * flags can technically be undefined, but it can still be used in bitwise
   * operations just like 0.
   */
  flags?: SchedulerJobFlags
  /**
   * Attached by renderer.ts when setting up a component's render effect
   * Used to obtain component information when reporting max recursive updates.
   */
  i?: ComponentInternalInstance
}

export type SchedulerJobs = SchedulerJob | SchedulerJob[]

const queue: SchedulerJob[] = []
let flushIndex = -1

const pendingPostFlushCbs: SchedulerJob[] = []
let activePostFlushCbs: SchedulerJob[] | null = null
let postFlushIndex = 0

const resolvedPromise = /*@__PURE__*/ Promise.resolve() as Promise<any>
let currentFlushPromise: Promise<void> | null = null

const RECURSION_LIMIT = 100
type CountMap = Map<SchedulerJob, number>

export function nextTick(): Promise<void>
export function nextTick<T, R>(
  this: T,
  fn: (this: T) => R | Promise<R>,
): Promise<R>
export function nextTick<T, R>(
  this: T,
  fn?: (this: T) => R | Promise<R>,
): Promise<void | R> {
  const p = currentFlushPromise || resolvedPromise
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}

// Use binary-search to find a suitable position in the queue. The queue needs
// to be sorted in increasing order of the job ids. This ensures that:
// 1. Components are updated from parent to child. As the parent is always
//    created before the child it will always have a smaller id.
// 2. If a component is unmounted during a parent component's update, its update
//    can be skipped.
// A pre watcher will have the same id as its component's update job. The
// watcher should be inserted immediately before the update job. This allows
// watchers to be skipped if the component is unmounted by the parent update.
function findInsertionIndex(id: number) {
  let start = flushIndex + 1
  let end = queue.length

  while (start < end) {
    const middle = (start + end) >>> 1
    const middleJob = queue[middle]
    const middleJobId = getId(middleJob)
    if (
      middleJobId < id ||
      (middleJobId === id && middleJob.flags! & SchedulerJobFlags.PRE)
    ) {
      start = middle + 1
    } else {
      end = middle
    }
  }

  return start
}

export function queueJob(job: SchedulerJob): void {
  if (!(job.flags! & SchedulerJobFlags.QUEUED)) {
    const jobId = getId(job)
    const lastJob = queue[queue.length - 1]
    if (
      !lastJob ||
      // fast path when the job id is larger than the tail
      (!(job.flags! & SchedulerJobFlags.PRE) && jobId >= getId(lastJob))
    ) {
      queue.push(job)
    } else {
      queue.splice(findInsertionIndex(jobId), 0, job)
    }

    job.flags! |= SchedulerJobFlags.QUEUED

    queueFlush()
  }
}

function queueFlush() {
  if (!currentFlushPromise) {
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}

export function queuePostFlushCb(cb: SchedulerJobs): void {
  if (!isArray(cb)) {
    if (activePostFlushCbs && cb.id === -1) {
      activePostFlushCbs.splice(postFlushIndex + 1, 0, cb)
    } else if (!(cb.flags! & SchedulerJobFlags.QUEUED)) {
      pendingPostFlushCbs.push(cb)
      cb.flags! |= SchedulerJobFlags.QUEUED
    }
  } else {
    // if cb is an array, it is a component lifecycle hook which can only be
    // triggered by a job, which is already deduped in the main queue, so
    // we can skip duplicate check here to improve perf
    pendingPostFlushCbs.push(...cb)
  }
  queueFlush()
}

export function flushPreFlushCbs(
  instance?: ComponentInternalInstance,
  seen?: CountMap,
  // skip the current job
  i: number = flushIndex + 1,
): void {
  if (__DEV__) {
    seen = seen || new Map()
  }
  for (; i < queue.length; i++) {
    const cb = queue[i]
    if (cb && cb.flags! & SchedulerJobFlags.PRE) {
      if (instance && cb.id !== instance.uid) {
        continue
      }
      if (__DEV__ && checkRecursiveUpdates(seen!, cb)) {
        continue
      }
      queue.splice(i, 1)
      i--
      if (cb.flags! & SchedulerJobFlags.ALLOW_RECURSE) {
        cb.flags! &= ~SchedulerJobFlags.QUEUED
      }
      cb()
      if (!(cb.flags! & SchedulerJobFlags.ALLOW_RECURSE)) {
        cb.flags! &= ~SchedulerJobFlags.QUEUED
      }
    }
  }
}

export function flushPostFlushCbs(seen?: CountMap): void {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b),
    )
    pendingPostFlushCbs.length = 0

    // #1947 already has active queue, nested flushPostFlushCbs call
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped)
      return
    }

    activePostFlushCbs = deduped
    if (__DEV__) {
      seen = seen || new Map()
    }

    for (
      postFlushIndex = 0;
      postFlushIndex < activePostFlushCbs.length;
      postFlushIndex++
    ) {
      const cb = activePostFlushCbs[postFlushIndex]
      if (__DEV__ && checkRecursiveUpdates(seen!, cb)) {
        continue
      }
      if (cb.flags! & SchedulerJobFlags.ALLOW_RECURSE) {
        cb.flags! &= ~SchedulerJobFlags.QUEUED
      }
      if (!(cb.flags! & SchedulerJobFlags.DISPOSED)) cb()
      cb.flags! &= ~SchedulerJobFlags.QUEUED
    }
    activePostFlushCbs = null
    postFlushIndex = 0
  }
}

const getId = (job: SchedulerJob): number =>
  job.id == null ? (job.flags! & SchedulerJobFlags.PRE ? -1 : Infinity) : job.id

function flushJobs(seen?: CountMap) {
  if (__DEV__) {
    seen = seen || new Map()
  }

  // conditional usage of checkRecursiveUpdate must be determined out of
  // try ... catch block since Rollup by default de-optimizes treeshaking
  // inside try-catch. This can leave all warning code unshaked. Although
  // they would get eventually shaken by a minifier like terser, some minifiers
  // would fail to do that (e.g. https://github.com/evanw/esbuild/issues/1610)
  const check = __DEV__
    ? (job: SchedulerJob) => checkRecursiveUpdates(seen!, job)
    : NOOP

  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex]
      if (job && !(job.flags! & SchedulerJobFlags.DISPOSED)) {
        if (__DEV__ && check(job)) {
          continue
        }
        if (job.flags! & SchedulerJobFlags.ALLOW_RECURSE) {
          job.flags! &= ~SchedulerJobFlags.QUEUED
        }
        callWithErrorHandling(
          job,
          job.i,
          job.i ? ErrorCodes.COMPONENT_UPDATE : ErrorCodes.SCHEDULER,
        )
        if (!(job.flags! & SchedulerJobFlags.ALLOW_RECURSE)) {
          job.flags! &= ~SchedulerJobFlags.QUEUED
        }
      }
    }
  } finally {
    // If there was an error we still need to clear the QUEUED flags
    for (; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex]
      if (job) {
        job.flags! &= ~SchedulerJobFlags.QUEUED
      }
    }

    flushIndex = -1
    queue.length = 0

    flushPostFlushCbs(seen)

    currentFlushPromise = null
    // If new jobs have been added to either queue, keep flushing
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs(seen)
    }
  }
}

function checkRecursiveUpdates(seen: CountMap, fn: SchedulerJob) {
  const count = seen.get(fn) || 0
  if (count > RECURSION_LIMIT) {
    const instance = fn.i
    const componentName = instance && getComponentName(instance.type)
    handleError(
      `Maximum recursive updates exceeded${
        componentName ? ` in component <${componentName}>` : ``
      }. ` +
        `This means you have a reactive effect that is mutating its own ` +
        `dependencies and thus recursively triggering itself. Possible sources ` +
        `include component template, render function, updated hook or ` +
        `watcher source function.`,
      null,
      ErrorCodes.APP_ERROR_HANDLER,
    )
    return true
  }
  seen.set(fn, count + 1)
  return false
}
