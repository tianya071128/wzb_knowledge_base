import { DeprecationTypes, compatUtils, warn } from '@vue/runtime-core'
import { includeBooleanAttr } from '@vue/shared'
import { unsafeToTrustedHTML } from '../nodeOps'

// functions. The user is responsible for using them with only trusted content. functions。用户有责任仅将其用于可信内容

/**
 * Vue3 核心执行函数 - DOM原生属性(DOM Prop)的赋值/更新/移除处理，patchProp的核心分支实现
 * 核心职责：对判定为「DOM原生属性」的属性，执行【直接赋值给DOM对象】的操作（el[key] = value），并处理所有边界兼容/异常容错；
 * 核心逻辑：直接操作DOM元素的JS原生属性，而非调用setAttribute，这是性能最高的属性绑定方式，也是浏览器原生推荐方式；
 * 处理能力：覆盖所有DOM Prop场景 → 1. 特殊innerHTML/textContent 2. 表单核心value属性 3. 布尔/数字/字符串属性值 4. null/undefined空值 5. 异常赋值容错
 * 入参说明：承接patchProp的入参，是DOM Prop处理的统一入参规范
 *
 *
 * @param {any} el 当前操作的「真实DOM元素对象」(任意DOM元素，如input/div/option/img)，直接对该对象进行属性赋值
 * @param {string} key 要处理的「DOM原生属性名」(如'innerHTML'/'value'/'disabled'/'checked')
 * @param {any} value 该属性的「目标新值」，支持任意类型：字符串/布尔/数字/null/undefined/对象等
 * @param {any} parentComponent 父组件内部实例，用于兼容模式的配置读取、警告信息的上下文绑定
 * @param {string} [attrName] 可选参数，属性对应的HTML属性名，用于属性移除时的兜底（如Prop名与Attr名不一致时）
 * @returns {void} 无返回值，所有操作均为对DOM对象的直接赋值副作用
 */
export function patchDOMProp(
  el: any,
  key: string,
  value: any,
  parentComponent: any,
  attrName?: string,
): void {
  // __UNSAFE__ __不安全__
  // Reason: potentially setting innerHTML. 原因：可能正在设置 innerHTML。
  // This can come from explicit usage of v-html or innerHTML as a prop in render 这可能是由于在渲染过程中明确使用了v-html或innerHTML作为prop
  // 处理【innerHTML / textContent 两个特殊DOM原生属性】
  // innerHTML存在XSS注入风险，该风险来自用户显式使用v-html或手动绑定innerHTML，Vue仅做透传处理
  // 说明：这两个属性是所有DOM元素的通用核心属性，优先级最高，单独处理
  if (key === 'innerHTML' || key === 'textContent') {
    // null value case is handled in renderer patchElement before patching 在打补丁之前，渲染器中的 patchElement 会处理 null 值的情况
    // children

    // null/undefined的空值情况，会在patchElement的子节点更新阶段提前处理，此处只需处理有效值
    if (value != null) {
      // // innerHTML需要做安全转换：unsafeToTrustedHTML 处理不可信HTML内容，避免XSS风险；textContent直接赋值即可
      el[key] = key === 'innerHTML' ? unsafeToTrustedHTML(value) : value
    }
    return
  }

  // 缓存当前DOM元素的标签名，后续用于特殊标签的属性规则判断（如OPTION/PROGRESS/自定义元素）
  const tag = el.tagName

  // 处理【表单核心属性 - value】最复杂的核心兼容分支
  // 触发条件：属性是value + 不是PROGRESS进度条标签 + 不是自定义元素(标签名不含-)
  // 排除PROGRESS：进度条的value属性有特殊取值范围(0~max)，由浏览器原生处理即可，无需手动兼容
  // 排除自定义元素：自定义元素可能内部用_value存储值，避免冲突
  if (
    key === 'value' &&
    tag !== 'PROGRESS' &&
    // custom elements may use _value internally 自定义元素可能在内部使用 _value
    !tag.includes('-')
  ) {
    // #4956: <option> value will fallback to its text content so we need to  <option>的值将回退为其文本内容，因此我们需要
    // compare against its attribute value instead. 而是与其属性值进行比较。
    const oldValue =
      tag === 'OPTION' ? el.getAttribute('value') || '' : el.value

    // 处理value的「空值/边界值」，统一赋值规则，核心兼容逻辑
    const newValue =
      value == null
        ? // #11647: value should be set as empty string for null and undefined,
          // but <input type="checkbox"> should be set as 'on'.
          el.type === 'checkbox'
          ? 'on'
          : ''
        : String(value)

    // 赋值判定：当「新旧值不同」 或 「元素无内部私有_value属性」时，才执行赋值操作
    // 避免无意义的重复赋值，提升性能；_value是Vue内部存储原始值的属性，下文会定义
    if (oldValue !== newValue || !('_value' in el)) {
      el.value = newValue
    }

    // 空值兜底：当value是null/undefined时，同步移除对应的HTML属性，保证DOM标签的纯净性
    if (value == null) {
      el.removeAttribute(key)
    }

    // store value as _value as well since 将值存储为_value，因为
    // non-string values will be stringified. 非字符串值将被字符串化。
    // 核心：将「原始未转字符串的value值」存储到el._value 私有属性中
    // DOM 的 value Prop 会强制序列化所有值为字符串，存储原始值用于后续对比/回显，避免类型丢失（如绑定数字/布尔值时）
    el._value = value
    return
  }

  // 处理【属性值的通用边界适配】- null/undefined/空字符串 统一处理
  let needRemove = false // 定义标记：是否需要在赋值后「移除对应的HTML属性」

  // 触发条件：属性值是空字符串 或 null/undefined
  if (value === '' || value == null) {
    // 获取当前DOM属性的原生类型，用于针对性适配
    const type = typeof el[key]
    // 适配场景1：DOM属性的原生类型是「布尔值」(如disabled/checked/multiple)
    // 例如：<select multiple> 编译后会传入空字符串，需要转为布尔值true
    if (type === 'boolean') {
      // e.g. <select multiple> compiles to { multiple: '' }
      value = includeBooleanAttr(value) // 空值转布尔值(true)的工具函数
    }
    // 适配场景2：DOM属性的原生类型是「字符串」+ value是null/undefined
    // 例如：<div :id="null"> ，需要将null转为空字符串，同时标记需要移除HTML属性
    else if (value == null && type === 'string') {
      // e.g. <div :id="null">
      value = ''
      needRemove = true
    }
    // 适配场景3：DOM属性的原生类型是「数字」(如width/height/cols/rows)
    // 例如：<img :width="null"> ，需要将null转为数字0，同时标记需要移除HTML属性
    else if (type === 'number') {
      // e.g. <img :width="null">
      value = 0
      needRemove = true
    }
  }
  // 处理【Vue2兼容模式】- false值的特殊降级适配
  else {
    // 仅在开启兼容模式，且当前value是false，且配置了ATTR_FALSE_VALUE兼容项时触发
    if (
      __COMPAT__ &&
      value === false &&
      compatUtils.isCompatEnabled(
        DeprecationTypes.ATTR_FALSE_VALUE,
        parentComponent,
      )
    ) {
      const type = typeof el[key]
      // 当DOM属性的原生类型是字符串/数字时，将false转为对应类型的空值（数字0/字符串''）
      if (type === 'string' || type === 'number') {
        __DEV__ &&
          compatUtils.warnDeprecation(
            DeprecationTypes.ATTR_FALSE_VALUE,
            parentComponent,
            key,
          )
        value = type === 'number' ? 0 : ''
        needRemove = true
      }
    }
  }

  // some properties perform value validation and throw, 某些属性会执行值验证并抛出异常
  // some properties has getter, no setter, will error in 'use strict' 某些属性有getter方法，没有setter方法，在'use strict'模式下会报错
  // eg. <select :type="null"></select> <select :willValidate="null"></select> 例如：<select :type="null"></select> <select :willValidate="null"></select>
  try {
    // 核心执行逻辑：直接给DOM元素对象的属性赋值 → 性能最高的DOM Prop绑定方式
    el[key] = value
  } catch (e: any) {
    // do not warn if value is auto-coerced from nullish values 如果值是从空值自动强制转换的，则不发出警告
    // 异常捕获后的兜底：仅在「开发环境」且「不需要移除属性」时，打印赋值失败的警告信息
    // 空值自动降级的情况不警告，因为是预期内的兼容处理
    if (__DEV__ && !needRemove) {
      warn(
        `Failed setting prop "${key}" on <${tag.toLowerCase()}>: ` + // 属性设置失败
          `value ${value} is invalid.`, // 值 ${value} 无效
        e,
      )
    }
  }

  // 最终兜底：移除对应的HTML属性
  // 当标记了needRemove为true时，同步移除该属性对应的HTML属性，保证DOM标签的纯净性
  // 例如：<img :width="null"> 赋值el.width=0后，移除width的HTML属性
  needRemove && el.removeAttribute(attrName || key)
}
