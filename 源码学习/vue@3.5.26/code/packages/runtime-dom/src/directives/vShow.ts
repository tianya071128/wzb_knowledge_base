import type { ObjectDirective } from '@vue/runtime-core'

export const vShowOriginalDisplay: unique symbol = Symbol('_vod')
export const vShowHidden: unique symbol = Symbol('_vsh')

export interface VShowElement extends HTMLElement {
  // _vod = vue original display
  [vShowOriginalDisplay]: string
  [vShowHidden]: boolean
}

/**
 * Vue 内置 v-show 指令核心实现
 * 核心逻辑：通过动态修改DOM元素的display CSS属性实现显隐，保留元素原始display样式，深度集成过渡动画
 */
export const vShow: ObjectDirective<VShowElement> & { name: 'show' } = {
  // used for prop mismatch check during hydration 用于水合过程中道具不匹配检查
  name: 'show',

  /**
   * 指令生命周期：元素挂载到DOM前执行（beforeMount）
   */
  beforeMount(el, { value }, { transition }) {
    // 核心：存储元素**原始的display样式值**，为后续显隐切换恢复布局做准备
    el[vShowOriginalDisplay] =
      el.style.display === 'none' ? '' : el.style.display

    // 判断是否需要执行过渡动画，分两种情况处理
    if (transition && value) {
      // 情况1：有过渡动画 + 绑定值为true（初始显示）→ 执行进入过渡前的钩子
      transition.beforeEnter(el)
    } else {
      // 情况2：无过渡动画 或 绑定值为false（初始隐藏）→ 直接设置display样式，无过渡
      setDisplay(el, value)
    }
  },

  /**
   * 指令生命周期：元素挂载到DOM后执行（mounted）
   */
  mounted(el, { value }, { transition }) {
    // 仅当「有过渡动画 + 绑定值为true」时，执行进入过渡的核心钩子
    // 时机：元素已挂载到DOM，beforeEnter执行完毕后，执行实际的进入过渡动画
    if (transition && value) {
      transition.enter(el)
    }
  },

  /**
   * 指令生命周期：元素所属组件更新时执行（updated）
   * 核心：处理v-show绑定值的变化，实现显隐切换，支持过渡动画
   */
  updated(el, { value, oldValue }, { transition }) {
    // 性能优化：判断新旧值是否为「同显/同隐」，若是则直接返回，避免无效操作
    if (!value === !oldValue) return

    // 分情况处理：是否有过渡动画
    if (transition) {
      // 情况1：有过渡动画 → 执行对应的进入/离开过渡
      if (value) {
        // 子情况1-1：新值为true（显示）→ 执行进入过渡
        transition.beforeEnter(el) // 进入过渡前的准备（如设置元素初始样式）
        setDisplay(el, true) // 先设置display为原始值，让元素显示（过渡动画的基础）
        transition.enter(el) // 执行进入过渡动画
      } else {
        // 子情况1-2：新值为false（隐藏）→ 执行离开过渡
        // 注意：leave钩子接收done回调，必须在过渡完成后执行setDisplay，否则过渡动画会被中断
        transition.leave(el, () => {
          setDisplay(el, false)
        })
      }
    }
    // 情况2：无过渡动画 → 直接修改display样式，快速显隐切换
    else {
      setDisplay(el, value)
    }
  },
  /**
   * 指令生命周期：元素从DOM卸载前执行（beforeUnmount）
   */
  beforeUnmount(el, { value }) {
    // 卸载前恢复元素的display样式为当前绑定值对应的状态
    // 作用：避免元素卸载前处于异常的display状态，影响父元素布局或其他逻辑
    setDisplay(el, value)
  },
}

/**
 * 设置元素的显示状态
 * 该函数根据传入的值来决定是否显示元素，通过设置display样式属性控制元素可见性
 * 同时记录元素的隐藏状态到特殊符号属性中
 *
 * @param el - 需要设置显示状态的DOM元素，类型为VShowElement
 * @param value - 显示状态的值，真值表示显示元素，假值表示隐藏元素
 */
function setDisplay(el: VShowElement, value: unknown): void {
  el.style.display = value ? el[vShowOriginalDisplay] : 'none'
  el[vShowHidden] = !value
}

// SSR vnode transforms, only used when user includes client-oriented render SSR vnode 转换，仅在用户包含面向客户端的渲染时使用
// function in SSR SSR 中的函数
export function initVShowForSSR(): void {
  vShow.getSSRProps = ({ value }) => {
    if (!value) {
      return { style: { display: 'none' } }
    }
  }
}
