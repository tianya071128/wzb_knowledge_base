import {
  NOOP,
  includeBooleanAttr,
  isSpecialBooleanAttr,
  isSymbol,
  makeMap,
} from '@vue/shared'
import {
  type ComponentInternalInstance,
  DeprecationTypes,
  compatUtils,
} from '@vue/runtime-core'

export const xlinkNS = 'http://www.w3.org/1999/xlink'

/**
 * Vue3 核心执行函数 - HTML标签属性(HTML Attr)的新增/更新/移除处理，patchProp的兜底分支实现
 * 核心职责：对判定为「无法绑定为DOM Prop」的属性，执行【原生HTML属性操作】，调用setAttribute/removeAttribute完成绑定；
 * 核心遵循：严格遵守HTML官方规范 → HTML属性的取值永远是「字符串类型」，布尔属性有专属的存在性规则；
 * 处理能力：覆盖所有HTML属性场景 → 1. SVG的xlink命名空间属性 2. Vue2兼容模式属性 3. HTML布尔属性 4. 普通自定义/原生属性 5. null/空值移除逻辑
 *
 *
 * @param {Element} el 当前操作的「真实DOM元素节点」(任意HTML/SVG元素，如div/input/svg/img)，属性最终绑定到该标签上
 * @param {string} key 要处理的「HTML属性名」(如'data-id'/'fill'/'readonly'/'xlink:href')
 * @param {any} value 该属性的「目标新值」，支持任意类型：字符串/布尔/数字/null/undefined/Symbol等
 * @param {boolean} isSVG 是否为SVG命名空间的元素，SVG属性有专属的命名空间处理规则
 * @param {ComponentInternalInstance|null} [instance] 可选，父组件内部实例，用于Vue2兼容模式的配置读取、属性降级处理
 * @param {boolean} [isBoolean=false] 可选，是否为「HTML特殊布尔属性」，默认调用isSpecialBooleanAttr(key)自动判断
 *                                    特殊布尔属性：无对应DOM Prop的布尔属性，如readonly/required/allowfullscreen
 * @returns {void} 无返回值，所有操作均为对DOM标签的属性操作副作用
 */
export function patchAttr(
  el: Element,
  key: string,
  value: any,
  isSVG: boolean,
  instance?: ComponentInternalInstance | null,
  isBoolean: boolean = isSpecialBooleanAttr(key),
): void {
  // 处理【SVG专属的 xlink: 命名空间属性】
  // xlink: 是SVG的一个命名空间，用于处理SVG的超链接/资源引用属性（如xlink:href/xlink:title）
  if (isSVG && key.startsWith('xlink:')) {
    // 空值规则：属性值为null/undefined → 移除该命名空间属性
    if (value == null) {
      // 调用removeAttributeNS：移除带命名空间的属性，参数1=命名空间地址，参数2=属性名(截取xlink:后的部分)
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length))
    } else {
      // 有效值规则：调用setAttributeNS：添加带命名空间的属性，保证SVG属性正常生效
      el.setAttributeNS(xlinkNS, key, value)
    }
  }
  // 处理【普通HTML属性 + 非xlink的SVG属性】核心主分支
  else {
    // Vue2 兼容模式处理 → 属性值强制降级适配
    // 触发条件：开启了Vue3的兼容模式(__COMPAT__) + 调用compatCoerceAttr完成属性值降级
    // 作用：对Vue2中属性值的特殊处理规则做兼容（如false值转为空字符串），处理完成后直接返回，不走后续逻辑
    if (__COMPAT__ && compatCoerceAttr(el, key, value, instance)) {
      return
    }

    // note we are only checking boolean attributes that don't have a 注意，我们只检查没有特定值的布尔属性
    // corresponding dom prop of the same name here. 此处为同名对应的dom属性

    // 【核心移除逻辑】属性值为空 或 布尔属性的「假值」 → 移除当前HTML属性
    // 此处判断的布尔属性，是「没有对应DOM Prop的特殊布尔属性」(如readonly/required)
    // 触发条件二选一：
    //  1. value == null → 属性值为null/undefined，任何属性都需要移除
    //  2. isBoolean为true + !includeBooleanAttr(value) → 是布尔属性，且属性值是「假值」(如false/null/undefined/空字符串)
    if (value == null || (isBoolean && !includeBooleanAttr(value))) {
      el.removeAttribute(key) // 调用原生API移除属性
    }
    // 【核心新增/更新逻辑】属性有有效值 → 调用setAttribute绑定HTML属性
    else {
      // attribute value is a string https://html.spec.whatwg.org/multipage/dom.html#attributes
      // HTML官方规范强制要求：所有HTML属性的「值最终都必须是字符串类型」
      // 此处做统一的类型转换兜底，适配所有传入的value类型：
      el.setAttribute(
        key,
        isBoolean ? '' : isSymbol(value) ? String(value) : value,
      )
    }
  }
}

// 2.x compat
const isEnumeratedAttr = __COMPAT__
  ? /*@__PURE__*/ makeMap('contenteditable,draggable,spellcheck')
  : NOOP

export function compatCoerceAttr(
  el: Element,
  key: string,
  value: unknown,
  instance: ComponentInternalInstance | null = null,
): boolean {
  if (isEnumeratedAttr(key)) {
    const v2CoercedValue =
      value === undefined
        ? null
        : value === null || value === false || value === 'false'
          ? 'false'
          : 'true'
    if (
      v2CoercedValue &&
      compatUtils.softAssertCompatEnabled(
        DeprecationTypes.ATTR_ENUMERATED_COERCION,
        instance,
        key,
        value,
        v2CoercedValue,
      )
    ) {
      el.setAttribute(key, v2CoercedValue)
      return true
    }
  } else if (
    value === false &&
    !(el.tagName === 'INPUT' && key === 'value') &&
    !isSpecialBooleanAttr(key) &&
    compatUtils.isCompatEnabled(DeprecationTypes.ATTR_FALSE_VALUE, instance)
  ) {
    compatUtils.warnDeprecation(
      DeprecationTypes.ATTR_FALSE_VALUE,
      instance,
      key,
    )
    el.removeAttribute(key)
    return true
  }
  return false
}
