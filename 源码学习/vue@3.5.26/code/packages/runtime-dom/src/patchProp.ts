import { patchClass } from './modules/class'
import { patchStyle } from './modules/style'
import { patchAttr } from './modules/attrs'
import { patchDOMProp } from './modules/props'
import { patchEvent } from './modules/events'
import {
  camelize,
  isFunction,
  isModelListener,
  isOn,
  isString,
} from '@vue/shared'
import type { RendererOptions } from '@vue/runtime-core'
import type { VueElement } from './apiCustomElement'

const isNativeOn = (key: string) =>
  key.charCodeAt(0) === 111 /* o */ &&
  key.charCodeAt(1) === 110 /* n */ &&
  // lowercase letter
  key.charCodeAt(2) > 96 &&
  key.charCodeAt(2) < 123

type DOMRendererOptions = RendererOptions<Node, Element>

/**
 * 元素【属性/样式/事件】的增量更新终极实现 (hostPatchProp的底层真身)
 * 核心职责：统一处理DOM元素的所有属性类型，根据属性名/属性类型做精准分类，差异化执行绑定/更新逻辑；
 * 支持处理：class类名、style行内样式、原生事件(onXXX)、DOM原生属性(Prop)、HTML自定义属性(Attr)、
 *          Vue自定义元素(CE)属性、v-model专属的true-value/false-value标识等；
 * 核心原则：1. 增量更新：仅处理prevValue→nextValue的变化，无变化则跳过 2. 优先级：优先绑定为DOM Prop，无法绑定则兜底为HTML Attr
 * 核心场景：✅ 首次挂载：prevValue=null，仅执行属性的「新增绑定」 ✅ 更新阶段：prevValue有值，执行属性的「增量更新/移除」
 * 入参说明：完全承接hostPatchProp的入参，是属性处理的统一入参规范
 *
 *
 * @param {RendererElement} el 当前操作的「真实DOM元素节点」，属性最终绑定到该节点上
 * @param {string} key 要处理的「属性名/事件名」(如'class'/'style'/'onClick'/'value'/'id')
 * @param {any} prevValue 该属性的「旧值」，首次挂载为null，更新阶段为上一次渲染的属性值
 * @param {any} nextValue 该属性的「新值」，本次要渲染的目标属性值，为null/undefined则表示移除该属性
 * @param {ElementNamespace} namespace DOM命名空间，区分普通HTML/svg/mathml，处理属性的命名空间兼容
 * @param {ComponentInternalInstance | null} parentComponent 父组件内部实例，用于事件绑定的上下文/依赖收集/指令处理
 * @returns {void} 无返回值，所有操作均为对真实DOM的副作用处理
 */
export const patchProp: DOMRendererOptions['patchProp'] = (
  el,
  key,
  prevValue,
  nextValue,
  namespace,
  parentComponent,
) => {
  // 第一步：判断当前是否为SVG命名空间，用于后续SVG属性的特殊兼容处理
  const isSVG = namespace === 'svg'

  // 处理【class 类名属性】
  if (key === 'class') {
    patchClass(el, nextValue, isSVG)
  }
  // 处理【style 行内样式属性】
  else if (key === 'style') {
    patchStyle(el, prevValue, nextValue)
  }
  // 处理【原生事件属性 (on开头的属性，如onClick/onInput)】
  else if (isOn(key)) {
    // ignore v-model listeners 忽略 v-model 的监听事件
    // 过滤：忽略v-model指令内部生成的监听事件（v-model的事件由指令单独处理，避免重复绑定）
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent)
    }
  }
  // 处理【DOM原生属性 (DOM Prop)】
  // 三元表达式核心逻辑：判断「是否应该将当前属性绑定为DOM原生属性(Prop)」，有三种判定规则，满足其一即走该分支
  else if (
    // 规则1：属性名以【.】开头 → 强制绑定为DOM Prop，移除前缀后使用真实属性名 (Vue的语法糖)
    key[0] === '.'
      ? ((key = key.slice(1)), true)
      : // 规则2：属性名以【^】开头 → 强制跳过Prop绑定，走后续Attr分支，移除前缀后使用真实属性名 (Vue的语法糖)
        key[0] === '^'
        ? ((key = key.slice(1)), false)
        : // 规则3：默认规则 → 调用shouldSetAsProp，自动判断当前属性是否是该DOM元素的「原生内置Prop」
          shouldSetAsProp(el, key, nextValue, isSVG)
  ) {
    // 执行DOM Prop的绑定/更新逻辑 (核心：操作DOM元素的对象属性，如 el.value = xxx，而非setAttribute)
    patchDOMProp(el, key, nextValue, parentComponent)

    // #6007 also set form state as attributes so they work with 还将表单状态设置为属性，以便它们能够协同工作
    // <input type="reset"> or libs / extensions that expect attributes <input type="reset"> 或者需要属性的库/扩展
    // #11163 custom elements may use value as an prop and set it as object 自定义元素可能将value作为属性使用，并将其设置为对象

    // 特殊兜底处理 - 表单元素的value/checked/selected属性
    // 原因1：解决<input type="reset">重置按钮失效问题，这类按钮读取的是HTML属性而非DOM Prop
    // 原因2：兼容第三方库/浏览器扩展，它们会读取元素的HTML属性而非DOM Prop
    // 原因3：排除自定义元素，自定义元素的value属性由自身处理
    if (
      !el.tagName.includes('-') &&
      (key === 'value' || key === 'checked' || key === 'selected')
    ) {
      // 同时将这些属性绑定为HTML Attribute，保证功能完整性，key!=='value'是value的特殊兼容
      patchAttr(el, key, nextValue, isSVG, parentComponent, key !== 'value')
    }
  }
  // 处理【Vue自定义元素(VueCE)的属性】 → 专属兼容分支
  else if (
    // #11081 force set props for possible async custom element 为可能的异步自定义元素设置强制属性
    // 判断当前元素是否是Vue自定义元素(带_isVueCE标识) + 属性名含大写字母 或 属性值非字符串
    (el as VueElement)._isVueCE &&
    (/[A-Z]/.test(key) || !isString(nextValue))
  ) {
    // 自定义元素的属性需要驼峰化(camelize)后绑定为DOM Prop，适配自定义元素的属性规范
    patchDOMProp(el, camelize(key), nextValue, parentComponent, key)
  } else {
    // special case for <input v-model type="checkbox"> with 带有<input v-model type="checkbox">的特殊情况
    // :true-value & :false-value
    // store value as dom properties since non-string values will be 将值作为DOM属性存储，因为非字符串值将会
    // stringified. 字符串化

    // v-model复选框的特殊场景 - 处理:true-value 和 :false-value 绑定
    // 原因：这类属性的值可以是非字符串类型(如布尔/对象)，如果绑定为HTML Attr会被强制序列化，导致失效
    // 解决方案：将值挂载为DOM元素的「私有属性」(_trueValue/_falseValue)，由v-model指令内部读取使用
    if (key === 'true-value') {
      ;(el as any)._trueValue = nextValue
    } else if (key === 'false-value') {
      ;(el as any)._falseValue = nextValue
    }
    // 执行HTML Attribute的绑定/更新逻辑 (核心：调用setAttribute/removeAttribute，操作元素的HTML标签属性)
    patchAttr(el, key, nextValue, isSVG, parentComponent)
  }
}

/**
 * Vue3 核心纯工具函数 - 属性绑定的「决策中枢」，patchProp的核心依赖
 * 核心职责：判断「指定属性」是否应该被绑定为【DOM原生属性(Prop)】，返回布尔值；
 * 返回值规则：true → 该属性适合绑定为DOM Prop（如 el.value = xxx），交给patchDOMProp处理；
 *            false → 该属性适合绑定为HTML Attr（如 el.setAttribute('value', xxx)），交给patchAttr处理；
 * 判断维度：综合4个核心维度 → 1.是否为SVG元素 2.属性名(key) 3.属性值(value)的类型 4.当前DOM元素的标签类型
 * 核心原则：延续Vue的设计思想「优先绑定DOM Prop，特殊场景强制降级为HTML Attr」，所有判断规则均为「特殊场景兜底」；
 *
 *
 * @param {Element} el 当前操作的「真实DOM元素节点」(如div/input/svg/img)，属性最终要绑定到该节点
 * @param {string} key 待判断的「属性名」(如'value'/'checked'/'spellcheck'/'width'/'onClick')
 * @param {unknown} value 该属性的「新值」，属性值的类型是重要判断依据(如函数/字符串/布尔值)
 * @param {boolean} isSVG 是否为SVG命名空间的元素，SVG元素的属性绑定规则与HTML完全不同，需单独处理
 * @returns {boolean} 布尔值，判定结果
 */
function shouldSetAsProp(
  el: Element,
  key: string,
  value: unknown,
  isSVG: boolean,
) {
  // 处理 SVG 命名空间的元素 属性判定规则
  if (isSVG) {
    // most keys must be set as attribute on svg elements to work 大多数键必须设置为SVG元素的属性才能生效
    // ...except innerHTML & textContent ...除了innerHTML和textContent

    // SVG 核心规则：【绝大多数属性都必须绑定为 HTML Attr，而非DOM Prop】才能生效
    // 原因：SVG是XML规范的标签，其属性体系与HTML不同，大部分属性没有对应的DOM Prop，只能通过setAttribute生效

    // SVG 例外规则1：innerHTML / textContent → 强制绑定为DOM Prop (返回true)
    // 原因：这两个是所有DOM元素的通用原生属性，SVG元素也支持，绑定为Prop性能更高且无兼容问题
    if (key === 'innerHTML' || key === 'textContent') {
      return true
    }

    // or native onclick with function values 或者使用带有函数值的原生 onclick 事件
    // SVG 例外规则2：原生on开头的事件 + 属性值是【函数类型】 → 强制绑定为DOM Prop (返回true)
    // 条件拆解：1.key in el → 属性是SVG元素的原生事件属性 2.isNativeOn(key) → 是原生on事件(如onclick/onmouseover) 3.isFunction(value) → 事件值是回调函数
    // 原因：SVG的原生事件绑定为Prop(el.onclick = fn)比Attr(setAttribute('onclick', fn))更高效，且支持函数上下文绑定
    if (key in el && isNativeOn(key) && isFunction(value)) {
      return true
    }

    // SVG 兜底规则：除上述两个例外，所有属性都返回false → 绑定为HTML Attr
    return false
  }

  // these are enumerated attrs, however their corresponding DOM properties 这些是枚举属性，但它们对应的DOM属性
  // are actually booleans - this leads to setting it with a string "false" 实际上是布尔值 - 这导致用字符串“false”来设置它
  // value leading it to be coerced to `true`, so we need to always treat 由于值被强制转换为`true`，因此我们需要始终将其视为
  // them as attributes. 将它们视为属性。
  // Note that `contentEditable` doesn't have this problem: its DOM 请注意，`contentEditable`没有这个问题：它的DOM
  // property is also enumerated string values. 属性也是枚举的字符串值。

  // 处理 普通HTML元素 的属性判定规则
  // 以下所有判断均为：【强制返回false，绑定为HTML Attr】的特殊兜底场景
  // 核心逻辑：这些属性「虽然存在对应的DOM Prop」，但因为浏览器的原生特性，绑定为Prop会导致功能异常，必须降级为Attr

  // 兜底场景1：特殊枚举类布尔属性 → spellcheck/draggable/translate/autocorrect
  // 这些属性的DOM Prop是【布尔值类型】，但HTML Attr是【字符串枚举值】(如 spellcheck="true"/"false"/"inherit")
  // 问题核心：如果绑定为Prop，赋值字符串"false"会被浏览器强制转为布尔值true，导致功能完全相反；
  // 例外说明：contentEditable无此问题，因为它的DOM Prop和Attr都是字符串枚举值，无需兜底
  if (
    key === 'spellcheck' ||
    key === 'draggable' ||
    key === 'translate' ||
    key === 'autocorrect'
  ) {
    return false
  }

  // #13946 iframe.sandbox should always be set as attribute since setting  iframe.sandbox 应始终设置为属性，因为设置
  // the property to null results in 'null' string, and setting to empty string 将属性设置为null会得到“null”字符串，而设置为空字符串则不会
  // enables the most restrictive sandbox mode instead of no sandboxing. 启用最严格的沙盒模式，而非不启用沙盒。

  // 兜底场景2：iframe 标签的 sandbox 属性 → 强制绑定为Attr
  // sandbox属性是iframe的安全属性，有特殊的赋值规则：
  //  1. 绑定为Prop时，赋值null会得到字符串"null"，导致iframe被错误沙箱化；
  //  2. 赋值空字符串，Prop会启用「最严格沙箱模式」，而Attr赋值空字符串表示「关闭沙箱」，两者行为完全相反；
  if (key === 'sandbox' && el.tagName === 'IFRAME') {
    return false
  }

  // #1787, #2840 form property on form elements is readonly and must be set as 表单元素上的form属性是只读的，必须设置为
  // attribute. 属性

  // 兜底场景3：所有表单元素的 form 属性 → 强制绑定为Attr
  // 原因：form属性的DOM Prop是【只读属性】，无法通过 el.form = xxx 修改，只能通过 setAttribute('form', xxx) 生效；
  // 业务场景：表单元素关联外部form标签时，必须用Attr绑定
  if (key === 'form') {
    return false
  }

  // #1526 <input list> must be set as attribute <input list> 必须设置为属性

  // 兜底场景4：input 标签的 list 属性 → 强制绑定为Attr
  // 原因：list属性是input关联datalist的标识，该属性的DOM Prop无实际作用，只能通过Attr生效
  if (key === 'list' && el.tagName === 'INPUT') {
    return false
  }

  // #2766 <textarea type> must be set as attribute <textarea type> 必须设置为属性

  // 兜底场景5：textarea 标签的 type 属性 → 强制绑定为Attr
  // 原因：textarea的type属性是固定值"textarea"，其DOM Prop是只读的，无法修改，只能通过Attr兼容特殊场景
  if (key === 'type' && el.tagName === 'TEXTAREA') {
    return false
  }

  // #8780 the width or height of embedded tags must be set as attribute 嵌入式标签的宽度或高度必须设置为属性

  // 兜底场景6：媒体/画布标签的 width/height 属性 → img/video/canvas/source
  // 原因：这些标签的width/height DOM Prop是「数字类型」，而HTML Attr是「字符串类型」，且Attr支持百分比/单位，Prop不支持；
  // 核心问题：绑定为Prop会丢失单位信息(如 width="100%")，导致样式异常，必须用Attr绑定才能保证样式正确
  if (key === 'width' || key === 'height') {
    const tag = el.tagName
    if (
      tag === 'IMG' ||
      tag === 'VIDEO' ||
      tag === 'CANVAS' ||
      tag === 'SOURCE'
    ) {
      return false
    }
  }

  // native onclick with string value, must be set as attribute 带有字符串值的原生 onclick 事件，必须设置为属性

  // 兜底场景7：原生on事件 + 属性值是【字符串类型】 → 强制绑定为Attr
  // 条件：isNativeOn(key) → 是原生on事件(如onclick) + isString(value) → 事件值是字符串(如"alert(1)")
  // 原因：浏览器的原生行为中，字符串类型的事件处理函数(如 onclick="alert(1)") 只能通过Attr绑定生效，绑定为Prop(el.onclick = "alert(1)")会被当作普通字符串，无法执行
  if (isNativeOn(key) && isString(value)) {
    return false
  }

  // 所有上述特殊兜底场景之外的属性，执行最终判断：key in el
  // 含义：判断「当前属性名是否是该DOM元素的【原生内置属性(Prop)】」
  // 规则：存在 → 返回true(绑定为DOM Prop)，不存在 → 返回false(绑定为HTML Attr)
  return key in el
}
