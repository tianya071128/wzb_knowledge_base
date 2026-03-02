import { warn } from '@vue/runtime-core'
import type { RendererOptions } from '@vue/runtime-core'
import type {
  TrustedHTML,
  TrustedTypePolicy,
  TrustedTypesWindow,
} from 'trusted-types/lib'

let policy: Pick<TrustedTypePolicy, 'name' | 'createHTML'> | undefined =
  undefined

const tt =
  typeof window !== 'undefined' &&
  (window as unknown as TrustedTypesWindow).trustedTypes

if (tt) {
  try {
    policy = /*@__PURE__*/ tt.createPolicy('vue', {
      createHTML: val => val,
    })
  } catch (e: unknown) {
    // `createPolicy` throws a TypeError if the name is a duplicate
    // and the CSP trusted-types directive is not using `allow-duplicates`.
    // So we have to catch that error.
    __DEV__ && warn(`Error creating trusted types policy: ${e}`)
  }
}

// __UNSAFE__ __不安全__
// Reason: potentially setting innerHTML. 原因：可能正在设置 innerHTML。
// This function merely perform a type-level trusted type conversion 此函数仅执行类型级别的可信类型转换
// for use in `innerHTML` assignment, etc. 用于`innerHTML`赋值等操作
// Be careful of whatever value passed to this function. 请谨慎对待传递给此函数的任何值
export const unsafeToTrustedHTML: (value: string) => TrustedHTML | string =
  policy ? val => policy.createHTML(val) : val => val

export const svgNS = 'http://www.w3.org/2000/svg'
export const mathmlNS = 'http://www.w3.org/1998/Math/MathML'

const doc = (typeof document !== 'undefined' ? document : null) as Document

const templateContainer = doc && /*@__PURE__*/ doc.createElement('template')

export const nodeOps: Omit<RendererOptions<Node, Element>, 'patchProp'> = {
  /**
   * 将一个真实节点插入到指定的父容器中，是所有「挂载/插入」操作的底层实现
   * Vue 内部的 hostInsert 就是调用此方法，也是最常用的宿主操作之一
   * @param el 要被插入的「真实宿主节点」(元素/文本/注释都可以)
   * @param parent 父容器「真实宿主元素节点」，只能是元素节点（能容纳子节点）
   * @param anchor 可选，锚点「真实宿主节点」；插入规则：将 el 插入到 parent 中 anchor 节点的【前面】
   *               传 null 则表示插入到 parent 的子节点列表的「最后面」
   */
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null)
  },

  /**
   * 从宿主环境中移除指定的真实节点，清理节点相关的所有资源，无返回值
   * 会自动处理节点的父级关联、事件解绑等，避免内存泄漏
   * @param el 要被移除的「真实宿主节点」(元素/文本/注释都可以)
   */
  remove: child => {
    const parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  },

  createElement: (tag, namespace, is, props): Element => {
    const el =
      namespace === 'svg'
        ? doc.createElementNS(svgNS, tag)
        : namespace === 'mathml'
          ? doc.createElementNS(mathmlNS, tag)
          : is
            ? doc.createElement(tag, { is })
            : doc.createElement(tag)

    if (tag === 'select' && props && props.multiple != null) {
      ;(el as HTMLSelectElement).setAttribute('multiple', props.multiple)
    }

    return el
  },
  /** 创建文本节点 */
  createText: text => doc.createTextNode(text),
  /** 创建注释节点 */
  createComment: text => doc.createComment(text),

  setText: (node, text) => {
    node.nodeValue = text
  },
  /** 设置元素文本 */
  setElementText: (el, text) => {
    el.textContent = text
  },

  parentNode: node => node.parentNode as Element | null,

  nextSibling: node => node.nextSibling,

  querySelector: selector => doc.querySelector(selector),

  /** 为元素节点设置 SFC 样式隔离的「作用域ID」 */
  setScopeId(el, id) {
    el.setAttribute(id, '')
  },

  // __UNSAFE__
  // Reason: innerHTML. 合理：innerHTML。
  // Static content here can only come from compiled templates. 此处的静态内容只能来自已编译的模板。
  // As long as the user only uses trusted templates, this is safe. 只要用户只使用受信任的模板，这样做就是安全的。
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    // <parent> before | first ... last | anchor </parent>
    const before = anchor ? anchor.previousSibling : parent.lastChild
    // #5308 can only take cached path if:
    // - has a single root node
    // - nextSibling info is still available
    if (start && (start === end || start.nextSibling)) {
      // cached
      while (true) {
        parent.insertBefore(start!.cloneNode(true), anchor)
        if (start === end || !(start = start!.nextSibling)) break
      }
    } else {
      // fresh insert
      templateContainer.innerHTML = unsafeToTrustedHTML(
        namespace === 'svg'
          ? `<svg>${content}</svg>`
          : namespace === 'mathml'
            ? `<math>${content}</math>`
            : content,
      ) as string

      const template = templateContainer.content
      if (namespace === 'svg' || namespace === 'mathml') {
        // remove outer svg/math wrapper
        const wrapper = template.firstChild!
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild)
        }
        template.removeChild(wrapper)
      }
      parent.insertBefore(template, anchor)
    }
    return [
      // first
      before ? before.nextSibling! : parent.firstChild!,
      // last
      anchor ? anchor.previousSibling! : parent.lastChild!,
    ]
  },
}
