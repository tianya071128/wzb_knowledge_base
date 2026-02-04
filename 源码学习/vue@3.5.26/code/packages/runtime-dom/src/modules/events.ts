import { NOOP, hyphenate, isArray, isFunction } from '@vue/shared'
import {
  type ComponentInternalInstance,
  ErrorCodes,
  callWithAsyncErrorHandling,
  warn,
} from '@vue/runtime-core'

interface Invoker extends EventListener {
  value: EventValue
  attached: number
}

type EventValue = Function | Function[]

export function addEventListener(
  el: Element,
  event: string,
  handler: EventListener,
  options?: EventListenerOptions,
): void {
  el.addEventListener(event, handler, options)
}

export function removeEventListener(
  el: Element,
  event: string,
  handler: EventListener,
  options?: EventListenerOptions,
): void {
  el.removeEventListener(event, handler, options)
}

const veiKey: unique symbol = Symbol('_vei')

/**
 * Vue 底层 DOM 事件补丁函数，处理v-on/@事件的添加、更新、移除，实现事件监听复用
 *
 *
 * @param {Element & { [veiKey]?: Record<string, Invoker | undefined> }} el - 绑定事件的原生DOM元素
 *                                                                           扩展了veiKey属性，用于挂载事件执行器缓存
 * @param {string} rawName - Vue模板中的原始事件名（如onClick、onChange.stop.prevent、onScroll.passive）
 * @param {EventValue | null} prevValue - 上一次的事件处理值（旧值，如旧的点击函数/函数数组）
 * @param {EventValue | unknown} nextValue - 下一次的事件处理值（新值，如新的点击函数/undefined/null）
 * @param {ComponentInternalInstance | null} instance - 事件所属的组件内部实例（默认null）
 *                                                      用于事件处理函数的上下文绑定（this指向组件实例）、组件更新时的事件清理
 * @returns {void} 无返回值
 */
export function patchEvent(
  el: Element & { [veiKey]?: Record<string, Invoker | undefined> },
  rawName: string,
  prevValue: EventValue | null,
  nextValue: EventValue | unknown,
  instance: ComponentInternalInstance | null = null,
): void {
  // 步骤1：初始化/获取DOM元素独有的「Vue事件执行器缓存」
  // 逻辑：若元素已有veiKey缓存则直接使用，无则创建空对象并挂载到el[veiKey]
  // vei = vue event invokers
  const invokers = el[veiKey] || (el[veiKey] = {})

  // 步骤2：获取当前原始事件名对应的「已有事件执行器」
  const existingInvoker = invokers[rawName]

  // 分支1：有新的事件值 + 存在已有执行器 → 事件更新（核心优化：复用事件监听，仅更新执行器的value）
  // 无需解绑/重新绑定原生DOM事件，仅修改中间层Invoker的value，避免昂贵的DOM操作，提升性能
  if (nextValue && existingInvoker) {
    // 更新执行器的value为新的事件值 -- 注册事件时, 会从 existingInvoker.value 取事件处理器
    // 只要更新 existingInvoker.value 引用, 就会执行最新的事件
    // patch
    existingInvoker.value = __DEV__
      ? sanitizeEventValue(nextValue, rawName) // 开发环境：先清洗事件值（校验合法性，抛出警告），再赋值
      : (nextValue as EventValue) // 生产环境：直接赋值（跳过校验，提升性能）
  }
  // 分支2：无已有执行器 → 解析原始事件名，执行「事件添加」或「事件移除」
  else {
    // 解析原始事件名（如onClick.stop → ['click', { stop: true }]），得到原生事件名和监听选项
    const [name, options] = parseName(rawName)

    // 子分支2-1：有新的事件值 + 无已有执行器 → 事件添加
    if (nextValue) {
      // add
      // 1. 创建新的事件执行器（Invoker），并挂载到DOM元素的事件缓存中
      // 执行器作为「Vue事件值」和「原生DOM事件」的中间层，封装修饰符、上下文等逻辑
      const invoker = (invokers[rawName] = createInvoker(
        __DEV__
          ? sanitizeEventValue(nextValue, rawName)
          : (nextValue as EventValue),
        instance, // 传递组件实例，保证事件处理函数的this指向组件代理对象
      ))

      // 2. 给DOM元素添加**原生事件监听**，注意：监听的是「Invoker执行器」而非直接的Vue事件函数
      addEventListener(el, name, invoker, options)
    }
    // 子分支2-2：无新的事件值 + 存在已有执行器 → 事件移除
    else if (existingInvoker) {
      // remove
      // 从DOM元素移除原生事件监听
      removeEventListener(el, name, existingInvoker, options)
      // 2. 清空缓存中的执行器，避免内存泄漏和缓存污染
      invokers[rawName] = undefined
    }
  }
}

const optionsModifierRE = /(?:Once|Passive|Capture)$/

function parseName(name: string): [string, EventListenerOptions | undefined] {
  let options: EventListenerOptions | undefined
  if (optionsModifierRE.test(name)) {
    options = {}
    let m
    while ((m = name.match(optionsModifierRE))) {
      name = name.slice(0, name.length - m[0].length)
      ;(options as any)[m[0].toLowerCase()] = true
    }
  }
  const event = name[2] === ':' ? name.slice(3) : hyphenate(name.slice(2))
  return [event, options]
}

// To avoid the overhead of repeatedly calling Date.now(), we cache 为了避免重复调用 Date.now() 的开销，我们缓存
// and use the same timestamp for all event listeners attached in the same tick. 并对同一tick中附加的所有事件侦听器使用相同的时间戳
let cachedNow: number = 0
const p = /*@__PURE__*/ Promise.resolve()
const getNow = () =>
  cachedNow || (p.then(() => (cachedNow = 0)), (cachedNow = Date.now()))
/**
 * 创建Vue事件执行器（Invoker），作为原生DOM事件与Vue事件处理的中间层
 * 核心能力：时间戳防重触发、挂载事件处理值、整合异步错误处理、绑定附加时间
 *
 *
 * @param {EventValue} initialValue - 初始的Vue事件处理值（函数/函数数组，已通过withModifiers处理修饰符）
 * @param {ComponentInternalInstance | null} instance - 事件所属的组件内部实例
 *                                                      用于错误捕获、组件上下文绑定
 * @returns {Invoker} 可直接绑定到原生DOM的事件执行器，包含value/attached属性和执行逻辑
 */
function createInvoker(
  initialValue: EventValue,
  instance: ComponentInternalInstance | null,
) {
  // 定义核心的Invoker执行器函数，作为原生DOM事件的实际监听函数
  const invoker: Invoker = (e: Event & { _vts?: number }) => {
    // async edge case vuejs/vue#6566 Vue.js 的异步边界情况 #6566
    // inner click event triggers patch, event handler 内部点击事件触发补丁，事件处理程序
    // attached to outer element during patch, and triggered again. This 在打补丁时附加到外部元素上，并再次触发。这
    // happens because browsers fire microtask ticks between event propagation. 这是因为浏览器会在事件传播之间触发微任务刻度
    // this no longer happens for templates in Vue 3, but could still be 在Vue 3中，模板不再出现这种情况，但仍有可能
    // theoretically possible for hand-written render functions. 理论上，手写渲染函数是可行的。
    // the solution: we save the timestamp when a handler is attached, 解决方案：在附加处理程序时保存时间戳，
    // and also attach the timestamp to any event that was handled by vue 同时，将时间戳附加到Vue处理的任何事件上
    // for the first time (to avoid inconsistent event timestamp implementations 首次（以避免事件时间戳实现不一致）
    // or events fired from iframes, e.g. #2513) 或来自iframe的事件触发，例如#2513）
    // The handler would only fire if the event passed to it was fired 只有当传递给它的事件被触发时，处理程序才会触发
    // AFTER it was attached. 在它被附上之后

    // ******** 核心：时间戳防重触发逻辑（解决Vue异步边界事件重复触发Bug，对应vue#6566/#2513）********
    // 场景：事件传播过程中，浏览器微任务触发Vue组件patch，新的事件处理程序被附加到元素，
    // 导致同一个原生事件触发多次新的处理程序；或iframe中的事件时间戳不一致导致的重复执行。
    // 解决方案：通过「事件触发时间」和「执行器附加时间」的对比，保证处理程序仅执行一次。
    if (!e._vts) {
      // 情况1：事件对象首次被Vue处理 → 为其附加自定义时间戳_vts，值为当前时间（毫秒）
      // 避免浏览器原生事件时间戳实现不一致、iframe跨域事件时间戳异常等问题
      e._vts = Date.now()
    } else if (e._vts <= invoker.attached) {
      // 情况2：事件已被Vue处理，且**事件触发时间** ≤ **执行器附加时间** → 直接返回，不执行事件处理逻辑
      // 说明：该事件是执行器挂载到DOM之前触发的，属于「旧事件」，无需执行新的处理程序
      return
    }

    // 执行Vue事件处理逻辑
    callWithAsyncErrorHandling(
      // 第一步：处理stopImmediatePropagation修饰符，包装事件处理值
      // 保证`stop.immediate`这类修饰符的「立即停止事件传播」逻辑生效
      patchStopImmediatePropagation(e, invoker.value),
      instance, // 传递组件实例，用于错误追踪和上下文绑定
      ErrorCodes.NATIVE_EVENT_HANDLER,
      [e], // 传递给事件处理函数的参数：原生事件对象e
    )
  }

  // 1. 挂载初始事件处理值到执行器，后续事件更新时仅需修改该属性（patchEvent的核心优化点）
  invoker.value = initialValue
  // 2. 挂载执行器「被附加到DOM的时间戳」，用于和事件的_vts对比防重触发
  // 用getNow()而非Date.now()：Vue内置高性能时间戳获取
  invoker.attached = getNow()
  return invoker
}

/**
 * 清理并验证事件处理函数的值
 * 验证传入的事件处理函数是否为有效的函数或函数数组，如果不是则发出警告并返回空函数
 *
 * @param value - 待验证的事件处理函数值
 * @param propName - 属性名称，用于在警告信息中标识具体的事件处理器
 * @returns 返回经过验证的事件处理函数，如果验证失败则返回NOOP空函数
 */
function sanitizeEventValue(value: unknown, propName: string): EventValue {
  if (isFunction(value) || isArray(value)) {
    return value as EventValue
  }
  warn(
    `Wrong type passed as event handler to ${propName} - did you forget @ or : ` + // 作为事件处理程序传递给 ${propName} 的类型错误 - 您是否忘记了 @ 或：
      `in front of your prop?\nExpected function or array of functions, received type ${typeof value}.`, // 在你的 prop 前面？\n预期的函数或函数数组，收到的类型
  )
  return NOOP
}

/**
 * 修补事件的 stopImmediatePropagation 方法，用于处理事件处理器数组中的传播控制
 * 当事件处理器是数组时，会修改事件对象的 stopImmediatePropagation 方法，
 * 使其在调用原始方法后设置一个 _stopped 标志，防止后续处理器执行
 *
 * @param e - 需要处理的事件对象
 * @param value - 事件处理器，可以是单个函数或函数数组
 * @returns 返回处理后的事件处理器，如果是数组则返回经过包装的处理器数组，否则直接返回原值
 */
function patchStopImmediatePropagation(
  e: Event,
  value: EventValue,
): EventValue {
  // 如果事件处理器是数组
  if (isArray(value)) {
    // 保存原始的 stopImmediatePropagation 方法
    const originalStop = e.stopImmediatePropagation
    // 替换事件的 stopImmediatePropagation 方法
    e.stopImmediatePropagation = () => {
      originalStop.call(e)
      ;(e as any)._stopped = true
    }
    // 将每个事件处理器包装成检查 _stopped 标志的函数
    return (value as Function[]).map(
      fn => (e: Event) => !(e as any)._stopped && fn && fn(e),
    )
  } else {
    // 如果不是数组，直接返回原值
    return value
  }
}
