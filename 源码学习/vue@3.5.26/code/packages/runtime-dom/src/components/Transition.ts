import {
  BaseTransition,
  type BaseTransitionProps,
  BaseTransitionPropsValidators,
  DeprecationTypes,
  type FunctionalComponent,
  assertNumber,
  compatUtils,
  h,
} from '@vue/runtime-core'
import { extend, isArray, isObject, toNumber } from '@vue/shared'

const TRANSITION = 'transition'
const ANIMATION = 'animation'

type AnimationTypes = typeof TRANSITION | typeof ANIMATION

export interface TransitionProps extends BaseTransitionProps<Element> {
  name?: string
  type?: AnimationTypes
  css?: boolean
  duration?: number | { enter: number; leave: number }
  // custom transition classes
  enterFromClass?: string
  enterActiveClass?: string
  enterToClass?: string
  appearFromClass?: string
  appearActiveClass?: string
  appearToClass?: string
  leaveFromClass?: string
  leaveActiveClass?: string
  leaveToClass?: string
}

export const vtcKey: unique symbol = Symbol('_vtc')

export interface ElementWithTransition extends HTMLElement {
  // _vtc = Vue Transition Classes.
  // Store the temporarily-added transition classes on the element
  // so that we can avoid overwriting them if the element's class is patched
  // during the transition.
  [vtcKey]?: Set<string>
}

const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true,
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String,
}

export const TransitionPropsValidators: any = /*@__PURE__*/ extend(
  {},
  BaseTransitionPropsValidators as any,
  DOMTransitionPropsValidators,
)

/**
 * Wrap logic that attaches extra properties to Transition in a function
 * so that it can be annotated as pure
 */
const decorate = (t: typeof Transition) => {
  t.displayName = 'Transition'
  t.props = TransitionPropsValidators
  if (__COMPAT__) {
    t.__isBuiltIn = true
  }
  return t
}

/**
 * DOM Transition is a higher-order-component based on the platform-agnostic
 * base Transition component, with DOM-specific logic.
 */
export const Transition: FunctionalComponent<TransitionProps> =
  /*@__PURE__*/ decorate((props, { slots }) =>
    h(BaseTransition, resolveTransitionProps(props), slots),
  )

/**
 * #3227 Incoming hooks may be merged into arrays when wrapping Transition 包装 Transition 时传入的 hooks 可能会合并到数组中
 * with custom HOCs. 使用自定义 HOC
 */
/**
 * 调用传入的钩子函数或钩子函数数组
 * #3227 当使用自定义高阶组件(HOCs)包装Transition时，传入的钩子可能会被合并成数组形式。
 *
 * @param hook - 钩子函数或钩子函数数组，可能为undefined
 * @param args - 传递给钩子函数的参数数组，默认为空数组
 */
const callHook = (
  hook: Function | Function[] | undefined,
  args: any[] = [],
) => {
  if (isArray(hook)) {
    // 如果钩子是数组，则遍历并调用每一个函数
    hook.forEach(h => h(...args))
  } else if (hook) {
    // 如果钩子是单个函数，则直接调用
    hook(...args)
  }
}

/**
 * Check if a hook expects a callback (2nd arg), which means the user 检查钩子是否需要回调（第二个参数），这意味着用户
 * intends to explicitly control the end of the transition. 旨在明确控制转换的结束
 */
/**
 * 检查钩子函数是否期望接收回调函数作为第二个参数，这意味着用户想要显式地控制过渡动画的结束
 *
 * @param hook - 钩子函数，可以是单个函数、函数数组或未定义
 * @returns 如果钩子函数期望接收回调函数则返回true，否则返回false
 */
const hasExplicitCallback = (
  hook: Function | Function[] | undefined,
): boolean => {
  return hook
    ? isArray(hook)
      ? hook.some(h => h.length > 1) // 如果是数组, 则检测每一个 hook 的入参长度
      : hook.length > 1
    : false
}

export function resolveTransitionProps(
  rawProps: TransitionProps,
): BaseTransitionProps<Element> {
  const baseProps: BaseTransitionProps<Element> = {}
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      ;(baseProps as any)[key] = (rawProps as any)[key]
    }
  }

  if (rawProps.css === false) {
    return baseProps
  }

  const {
    name = 'v',
    type,
    duration,
    enterFromClass = `${name}-enter-from`,
    enterActiveClass = `${name}-enter-active`,
    enterToClass = `${name}-enter-to`,
    appearFromClass = enterFromClass,
    appearActiveClass = enterActiveClass,
    appearToClass = enterToClass,
    leaveFromClass = `${name}-leave-from`,
    leaveActiveClass = `${name}-leave-active`,
    leaveToClass = `${name}-leave-to`,
  } = rawProps

  // legacy transition class compat
  const legacyClassEnabled =
    __COMPAT__ &&
    compatUtils.isCompatEnabled(DeprecationTypes.TRANSITION_CLASSES, null)
  let legacyEnterFromClass: string
  let legacyAppearFromClass: string
  let legacyLeaveFromClass: string
  if (__COMPAT__ && legacyClassEnabled) {
    const toLegacyClass = (cls: string) => cls.replace(/-from$/, '')
    if (!rawProps.enterFromClass) {
      legacyEnterFromClass = toLegacyClass(enterFromClass)
    }
    if (!rawProps.appearFromClass) {
      legacyAppearFromClass = toLegacyClass(appearFromClass)
    }
    if (!rawProps.leaveFromClass) {
      legacyLeaveFromClass = toLegacyClass(leaveFromClass)
    }
  }

  const durations = normalizeDuration(duration)
  const enterDuration = durations && durations[0]
  const leaveDuration = durations && durations[1]
  const {
    onBeforeEnter,
    onEnter,
    onEnterCancelled,
    onLeave,
    onLeaveCancelled,
    onBeforeAppear = onBeforeEnter,
    onAppear = onEnter,
    onAppearCancelled = onEnterCancelled,
  } = baseProps

  /**
   * 完成进入过渡动画的处理函数
   * 移除相关的CSS过渡类，并标记元素是否被取消进入状态
   *
   *
   * @param el - 需要处理的DOM元素，扩展了_enterCancelled属性
   * @param isAppear - 是否为初次出现过渡（true）还是普通进入过渡（false）
   * @param done - 可选的回调函数，在完成时调用
   * @param isCancelled - 指示过渡是否被取消，默认为false
   */
  const finishEnter = (
    el: Element & { _enterCancelled?: boolean },
    isAppear: boolean,
    done?: () => void,
    isCancelled?: boolean,
  ) => {
    el._enterCancelled = isCancelled // 是否取消标记
    // 移除相关 css
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass)
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass)

    // 触发 done 回调
    done && done()
  }

  const finishLeave = (
    el: Element & { _isLeaving?: boolean },
    done?: () => void,
  ) => {
    el._isLeaving = false
    removeTransitionClass(el, leaveFromClass)
    removeTransitionClass(el, leaveToClass)
    removeTransitionClass(el, leaveActiveClass)
    done && done()
  }

  /**
   * 9. 生成 enter/appear 钩子的通用函数（复用逻辑，区分 isAppear）
   *    - 执行用户自定义钩子
   *    - 在下一帧(requestAnimationFrame API)中移除 `${name}-enter-from` 类名
   *    - 添加 `${name}-enter-to` 类名
   *    - 监听动画结束
   *        -- 若用户自定义钩子中, 使用了 done 回调(检测用户自定义钩子的入参个数), 那么由用户自定义结束时机
   *        -- 否则自定义监听动画结束
   *            --- 优先使用用户显式指定的时长（explicitTimeout），替代自动事件监听 --> 直接定时器监听
   *            --- 否则从目标元素 getComputedStyle 中提取 transition/animation 相关的样式、时间等信息
   *        -- 动画结束后, 移除 `${name}-enter-to` 和 `${name}-enter-active` 类
   */
  const makeEnterHook = (isAppear: boolean) => {
    return (el: Element, done: () => void) => {
      // 区分 enter/appear 钩子（isAppear=true 用 onAppear，否则用 onEnter）
      const hook = isAppear ? onAppear : onEnter
      // 定义 resolve 回调：执行收尾逻辑 + done 回调
      const resolve = () => finishEnter(el, isAppear, done)
      // 执行用户自定义的 enter/appear 钩子（传入 el 和 resolve 回调）
      callHook(hook, [el, resolve])

      // 下一帧执行类名切换（保证 from 类名已生效，避免动画无效果）
      nextFrame(() => {
        // 移除 `${name}-enter-from` 类名（进入 to 阶段）
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass)

        // 兼容旧版类名：移除无 -from 后缀的旧版类名
        if (__COMPAT__ && legacyClassEnabled) {
          const legacyClass = isAppear
            ? legacyAppearFromClass
            : legacyEnterFromClass
          if (legacyClass) {
            removeTransitionClass(el, legacyClass)
          }
        }

        // 添加 `${name}-enter-to` 类名（触发 from → to 的过渡）
        addTransitionClass(el, isAppear ? appearToClass : enterToClass)

        // 若用户未显式声明 done 回调（钩子参数长度 ≤1），自动监听过渡结束事件
        if (!hasExplicitCallback(hook)) {
          // 则自定义监听动画结束, 结束后触发
          whenTransitionEnds(el, type, enterDuration, resolve)
        }
      })
    }
  }

  return extend(baseProps, {
    /**
     * 10.1 入场前钩子：beforeEnter（DOM 插入前）
     *  - 执行用户自定义钩子
     *  - 添加 `${name}-enter-from` 和 `${name}-enter-active` 类
     */
    onBeforeEnter(el) {
      // 执行用户自定义的 beforeEnter 钩子
      callHook(onBeforeEnter, [el])
      // 添加 from/active 类名（初始化入场动画状态）
      addTransitionClass(el, enterFromClass)
      // 兼容旧版类名：添加无 -from 后缀的旧版类名
      if (__COMPAT__ && legacyClassEnabled && legacyEnterFromClass) {
        addTransitionClass(el, legacyEnterFromClass)
      }

      addTransitionClass(el, enterActiveClass)
    },
    /**
     * 10.2 首次入场前钩子：beforeAppear（DOM 插入前）
     *   - 执行用户自定义钩子
     *   - 添加 `${name}-enter-from` 和 `${name}-enter-active` 类
     */
    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el])
      addTransitionClass(el, appearFromClass)
      if (__COMPAT__ && legacyClassEnabled && legacyAppearFromClass) {
        addTransitionClass(el, legacyAppearFromClass)
      }
      addTransitionClass(el, appearActiveClass)
    },
    /**
     * 10.3 元素插入后钩子：Enter（DOM 插入后）
     *   - 执行用户自定义钩子
     *   - 在下一帧(requestAnimationFrame API)中移除 `${name}-enter-from` 类名
     *   - 添加 `${name}-enter-to` 类名
     *   - 监听动画结束
     *       -- 若用户自定义钩子中, 使用了 done 回调(检测用户自定义钩子的入参个数), 那么由用户自定义结束时机
     *       -- 否则自定义监听动画结束
     *           --- 优先使用用户显式指定的时长（explicitTimeout），替代自动事件监听 --> 直接定时器监听
     *           --- 否则从目标元素 getComputedStyle 中提取 transition/animation 相关的样式、时间等信息
     *       -- 动画结束后, 移除 `${name}-enter-to` 和 `${name}-enter-active` 类
     */
    onEnter: makeEnterHook(false),
    // 10.4 元素首次插入后钩子, 与 onEnter 类似
    onAppear: makeEnterHook(true),
    onLeave(
      el: Element & { _isLeaving?: boolean; _enterCancelled?: boolean },
      done,
    ) {
      el._isLeaving = true
      const resolve = () => finishLeave(el, done)
      addTransitionClass(el, leaveFromClass)
      if (__COMPAT__ && legacyClassEnabled && legacyLeaveFromClass) {
        addTransitionClass(el, legacyLeaveFromClass)
      }
      // add *-leave-active class before reflow so in the case of a cancelled enter transition
      // the css will not get the final state (#10677)
      if (!el._enterCancelled) {
        // force reflow so *-leave-from classes immediately take effect (#2593)
        forceReflow(el)
        addTransitionClass(el, leaveActiveClass)
      } else {
        addTransitionClass(el, leaveActiveClass)
        forceReflow(el)
      }
      nextFrame(() => {
        if (!el._isLeaving) {
          // cancelled
          return
        }
        removeTransitionClass(el, leaveFromClass)
        if (__COMPAT__ && legacyClassEnabled && legacyLeaveFromClass) {
          removeTransitionClass(el, legacyLeaveFromClass)
        }
        addTransitionClass(el, leaveToClass)
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve)
        }
      })
      callHook(onLeave, [el, resolve])
    },
    onEnterCancelled(el) {
      finishEnter(el, false, undefined, true)
      callHook(onEnterCancelled, [el])
    },
    onAppearCancelled(el) {
      finishEnter(el, true, undefined, true)
      callHook(onAppearCancelled, [el])
    },
    onLeaveCancelled(el) {
      finishLeave(el)
      callHook(onLeaveCancelled, [el])
    },
  } as BaseTransitionProps<Element>)
}

function normalizeDuration(
  duration: TransitionProps['duration'],
): [number, number] | null {
  if (duration == null) {
    return null
  } else if (isObject(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)]
  } else {
    const n = NumberOf(duration)
    return [n, n]
  }
}

function NumberOf(val: unknown): number {
  const res = toNumber(val)
  if (__DEV__) {
    assertNumber(res, '<transition> explicit duration')
  }
  return res
}

/**
 * 为元素添加过渡类名
 * 此函数会将传入的类名字符串按空格分割，并逐个添加到元素的classList中
 * 同时将类名记录在元素的过渡类名集合中，用于后续过渡效果管理
 *
 * @param el - 需要添加过渡类的DOM元素
 * @param cls - 要添加的类名字符串（可包含多个由空格分隔的类名）
 * @returns 无返回值
 */
export function addTransitionClass(el: Element, cls: string): void {
  // 添加对应的 class
  cls.split(/\s+/).forEach(c => c && el.classList.add(c))

  // 添加到标记中, 在 patchClass 时会使用到
  ;(
    (el as ElementWithTransition)[vtcKey] ||
    ((el as ElementWithTransition)[vtcKey] = new Set())
  ).add(cls)
}

/**
 * 从元素中移除过渡类
 * 此函数会从元素的 classList 中删除指定的类，并更新元素上存储的过渡类集合
 *
 * @param el - 需要移除过渡类的DOM元素
 * @param cls - 要移除的类名（可包含多个由空格分隔的类）
 * @returns 无返回值
 */
export function removeTransitionClass(el: Element, cls: string): void {
  // 将类字符串按空格分割并逐个从元素的classList中移除
  cls.split(/\s+/).forEach(c => c && el.classList.remove(c))

  // 获取元素上存储的过渡类集合
  const _vtc = (el as ElementWithTransition)[vtcKey]
  if (_vtc) {
    // 从过渡类集合中删除指定的类
    _vtc.delete(cls)
    if (!_vtc!.size) {
      ;(el as ElementWithTransition)[vtcKey] = undefined
    }
  }
}

/**
 * 在下一个动画帧执行回调函数
 * 此函数通过两次调用 requestAnimationFrame 来确保回调在下一帧渲染之后执行
 *
 * @param cb - 要在下一帧执行的回调函数
 */
function nextFrame(cb: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb)
  })
}

let endId = 0

/**
 * Vue3 Transition 组件的 CSS 过渡/动画结束监听函数
 *
 * 核心作用：
 *   1. 优先使用用户显式指定的时长（explicitTimeout），替代自动事件监听 --> 直接定时器监听
 *   2. 否则从目标元素 getComputedStyle 中提取 transition/animation 相关的样式、时间等信息
 *   3. 监听对应事件，所有过渡属性完成后执行 resolve 回调；
 *   4. 超时兜底：避免 transitionend/animationend 事件丢失导致回调永远不执行；
 *   5. 处理多属性过渡：确保所有参与过渡的 CSS 属性都触发结束事件后才完成动画。
 *
 * @param el 目标 DOM 元素（扩展 _endId 属性，标记当前监听的唯一 ID）
 * @param expectedType 用户指定的过渡类型（transition/animation），优先检测该类型
 * @param explicitTimeout 用户显式指定的过渡时长（ms），有值则直接用超时替代事件监听
 * @param resolve 过渡/动画完成后要执行的回调（即 Transition 钩子的 done 函数）
 * @returns number | void - 显式超时返回定时器 ID，否则无返回值
 */
function whenTransitionEnds(
  el: Element & { _endId?: number },
  expectedType: TransitionProps['type'] | undefined,
  explicitTimeout: number | null,
  resolve: () => void,
) {
  // ********** 核心：生成唯一 ID，防止过期回调 **********
  // endId 是全局递增计数器（外部定义），每次调用生成唯一 ID
  // 将 ID 赋值给 el._endId，标记当前监听的回调唯一标识
  const id = (el._endId = ++endId)
  // 封装“非过期时执行 resolve”的逻辑：
  // 只有当前 ID 与 el._endId 一致（未被新的监听覆盖），才执行 resolve
  // 解决：快速切换动画时，旧的 transitionend 事件触发后，不执行无效的旧回调
  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve()
    }
  }

  // ********** 分支1：用户显式指定了过渡时长 → 直接使用超时，不监听事件 **********
  // 优先级：显式时长 > 自动事件监听（用户配置高于自动检测）
  if (explicitTimeout != null) {
    return setTimeout(resolveIfNotStale, explicitTimeout)
  }

  // ********** 分支2：自动检测元素的过渡/动画信息 **********
  // getTransitionInfo：Vue 内部核心函数，检测元素的 CSS 过渡/动画属性
  // 返回值说明：
  // - type: 实际过渡类型（'transition'/'animation'，无过渡则为 null）
  // - timeout: 所有过渡属性中最长的时长（含 delay，单位 ms）
  // - propCount: 参与过渡的 CSS 属性数量（如同时过渡 width+opacity，propCount=2）
  const { type, timeout, propCount } = getTransitionInfo(el, expectedType)
  // 无过渡/动画属性（type=null）：直接执行 resolve，无需监听事件
  if (!type) {
    return resolve()
  }

  // ********** 分支3：监听过渡/动画结束事件 **********
  // 拼接结束事件名：transition → transitionend，animation → animationend
  const endEvent = type + 'end'
  let ended = 0 // 计数器：记录已触发结束事件的属性数量

  // 封装“结束监听 + 执行 resolve”的逻辑：
  // 1. 移除事件监听，避免内存泄漏；
  // 2. 执行非过期 resolve 回调。
  const end = () => {
    el.removeEventListener(endEvent, onEnd) // 移除事件监听
    resolveIfNotStale() // 执行回调（过滤过期）
  }
  // 定义事件处理函数：监听单个属性的结束事件
  const onEnd = (e: Event) => {
    // 关键判断：
    // 1. e.target === el：确保事件是当前元素触发（排除子元素冒泡）；
    // 2. ++ended >= propCount：所有参与过渡的属性都触发了结束事件。
    if (e.target === el && ++ended >= propCount) {
      end() // 所有属性完成，执行结束逻辑
    }
  }

  // ********** 超时兜底：避免事件丢失导致回调永远不执行 **********
  // 超时时间 = 检测到的最长过渡时长 + 1ms（容错）
  // 若到时间仍有属性未触发结束事件，强制执行 end 逻辑
  setTimeout(() => {
    if (ended < propCount) {
      end()
    }
  }, timeout + 1)

  // ********** 绑定事件监听：开始监听过渡/动画结束事件 **********
  el.addEventListener(endEvent, onEnd)
}

interface CSSTransitionInfo {
  type: AnimationTypes | null
  propCount: number
  timeout: number
  hasTransform: boolean
}

type AnimationProperties = 'Delay' | 'Duration'
type StylePropertiesKey =
  | `${AnimationTypes}${AnimationProperties}`
  | `${typeof TRANSITION}Property`

/**
 * Vue3 Transition 组件的 CSS 过渡/动画信息解析函数
 *
 * 核心作用：
 *    1. 获取元素的计算样式（getComputedStyle），解析 transition/animation 相关属性；
 *    2. 计算 transition/animation 的总超时时间（延迟 + 动画时长），取所有属性中的最大值；
 *    3. 根据用户指定的 expectedType 或自动判断优先的过渡类型（transition/animation）；
 *    4. 统计参与过渡/动画的 CSS 属性数量（用于多属性过渡的结束判断）；
 *    5. 检测是否包含 transform 过渡属性（用于后续动画优化，如硬件加速判断）；
 *    6. 兼容 JSDOM 等环境下样式属性返回 undefined 的情况。
 *
 * 设计背景：
 *    - 元素的过渡/动画时长需结合 delay（延迟）和 duration（时长）计算总耗时；
 *    - 需区分用户指定的过渡类型和自动检测的类型，保证优先级；
 *    - 多属性过渡（如 width+opacity）需统计属性数量，确保所有属性完成后才触发结束；
 *    - transform 属性过渡可触发硬件加速，需单独检测用于后续优化。
 * @param el 目标 DOM 元素，需解析其 CSS 过渡/动画属性
 * @param expectedType 用户指定的过渡类型（transition/animation），可选，用于优先检测该类型
 * @returns CSSTransitionInfo 解析后的过渡信息对象，包含 type/timeout/propCount/hasTransform
 */
export function getTransitionInfo(
  el: Element,
  expectedType?: TransitionProps['type'],
): CSSTransitionInfo {
  // 1. 获取元素的计算样式（最终生效的 CSS 样式），仅选取需要的样式属性（StylePropertiesKey）
  // Pick<CSSStyleDeclaration, StylePropertiesKey>：类型收窄，只保留 transition/animation 相关属性
  const styles = window.getComputedStyle(el) as Pick<
    CSSStyleDeclaration,
    StylePropertiesKey
  >
  // JSDOM may return undefined for transition properties JSDOM 可能会返回未定义的转换属性
  // 2. 封装样式属性解析函数：兼容 JSDOM 等环境返回 undefined 的情况
  // 逻辑：获取指定样式属性值 → 无值则返回空字符串 → 按逗号分割为数组（多属性场景）
  // 示例：transitionDuration: "1s, 0.5s" → 分割为 ["1s", "0.5s"]
  const getStyleProperties = (key: StylePropertiesKey) =>
    (styles[key] || '').split(', ')

  // 3. 解析 Transition 相关属性
  const transitionDelays = getStyleProperties(`${TRANSITION}Delay`) // 过渡延迟（如 ["0s", "0.2s"]）
  const transitionDurations = getStyleProperties(`${TRANSITION}Duration`) // 过渡时长（如 ["1s", "0.5s"]）
  // 计算 Transition 的总超时时间：遍历所有属性，取（delay + duration）的最大值（单位：ms）
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations)

  // 4. 解析 Animation 相关属性（逻辑同 Transition）
  const animationDelays = getStyleProperties(`${ANIMATION}Delay`) // 动画延迟
  const animationDurations = getStyleProperties(`${ANIMATION}Duration`) // 动画时长
  const animationTimeout = getTimeout(animationDelays, animationDurations)

  // 5. 初始化返回值核心变量
  let type: CSSTransitionInfo['type'] = null // 最终的过渡类型（transition/animation/null）
  let timeout = 0 // 最长总超时时间（ms）
  let propCount = 0 // 参与过渡/动画的属性数量

  // 6. 根据 expectedType 优先级解析过渡类型
  // 分支1：用户指定优先检测 transition → 仅当 transition 超时 > 0 时生效
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION
      timeout = transitionTimeout
      propCount = transitionDurations.length // 统计 transition 属性数量
    }
  }
  // 分支2：用户指定优先检测 animation → 仅当 animation 超时 > 0 时生效
  else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION
      timeout = animationTimeout
      propCount = animationDurations.length // 统计 animation 属性数量
    }
  }
  // 分支3：未指定类型 → 自动判断（取超时时间更长的类型）
  else {
    timeout = Math.max(transitionTimeout, animationTimeout) // 取 transition/animation 中最长的超时时间
    type =
      timeout > 0
        ? transitionTimeout > animationTimeout // 超时更长的类型为最终类型
          ? TRANSITION
          : ANIMATION
        : null // 无有效超时时间 → 类型为 null

    // 统计属性数量：根据最终类型取对应属性数量
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0
  }

  // 7. 检测是否包含 transform 过渡属性（仅 transition 类型时检测）
  // 用途：transform 过渡可触发硬件加速，后续可针对该属性做动画优化
  const hasTransform =
    type === TRANSITION &&
    /\b(?:transform|all)(?:,|$)/.test(
      getStyleProperties(`${TRANSITION}Property`).toString(),
    )

  // 8. 返回解析后的完整过渡信息
  return {
    type, // 过渡类型（transition/animation/null）
    timeout, // 最长总超时时间（ms）
    propCount, // 参与过渡的属性数量
    hasTransform, // 是否包含 transform 过渡属性
  }
}

/**
 * 计算过渡动画的总超时时间
 * 通过将延迟时间和持续时间相加，找出最长的动画持续时间作为超时时间
 *
 * @param delays - 过渡动画的延迟时间数组（以字符串形式表示，如 '0.5s', '200ms'）
 * @param durations - 过渡动画的持续时间数组（以字符串形式表示，如 '0.5s', '200ms'）
 * @returns 返回计算出的最大超时时间（单位：毫秒）
 */
function getTimeout(delays: string[], durations: string[]): number {
  // 如果延迟数组长度小于持续时间数组长度，则扩展延迟数组
  while (delays.length < durations.length) {
    delays = delays.concat(delays)
  }

  // 计算每个持续时间与对应延迟时间之和的最大值（转换为毫秒）
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])))
}

// Old versions of Chromium (below 61.0.3163.100) formats floating pointer 旧版本的 Chromium（61.0.3163.100 以下）格式化浮点指针
// numbers in a locale-dependent way, using a comma instead of a dot. 以与区域设置相关的方式进行数字，使用逗号而不是点
// If comma is not replaced with a dot, the input will be rounded down 如果逗号未替换为点，则输入将向下舍入
// (i.e. acting as a floor function) causing unexpected behaviors （即充当底函数）导致意外行为
function toMs(s: string): number {
  // #8409 default value for CSS durations can be 'auto' CSS 持续时间的默认值可以是“auto”
  if (s === 'auto') return 0

  // 移除单位字符（s），并将可能存在的逗号替换为点号后转换为数字并乘以1000得到毫秒值
  return Number(s.slice(0, -1).replace(',', '.')) * 1000
}

// synchronously force layout to put elements into a certain state
export function forceReflow(el?: Node): number {
  const targetDocument = el ? el.ownerDocument! : document
  return targetDocument.body.offsetHeight
}
