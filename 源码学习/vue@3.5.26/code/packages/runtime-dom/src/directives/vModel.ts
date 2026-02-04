import {
  type DirectiveBinding,
  type DirectiveHook,
  type ObjectDirective,
  type VNode,
  nextTick,
  warn,
} from '@vue/runtime-core'
import { addEventListener } from '../modules/events'
import {
  invokeArrayFns,
  isArray,
  isSet,
  looseEqual,
  looseIndexOf,
  looseToNumber,
} from '@vue/shared'

type AssignerFn = (value: any) => void

/**
 * 获取vnode上定义的model值更新分配器
 * 该函数用于获取用于更新model值的回调函数，优先获取onUpdate:modelValue，其次在兼容模式下获取onModelCompat:input
 *
 * @param vnode - 虚拟节点，从中获取model值更新相关的事件处理器
 * @returns 返回一个AssignerFn类型的函数，用于更新model值
 */
const getModelAssigner = (vnode: VNode): AssignerFn => {
  const fn =
    vnode.props!['onUpdate:modelValue'] ||
    (__COMPAT__ && vnode.props!['onModelCompat:input'])
  return isArray(fn) ? value => invokeArrayFns(fn, value) : fn
}

function onCompositionStart(e: Event) {
  ;(e.target as any).composing = true
}

function onCompositionEnd(e: Event) {
  const target = e.target as any
  if (target.composing) {
    target.composing = false
    target.dispatchEvent(new Event('input'))
  }
}

const assignKey: unique symbol = Symbol('_assign')

type ModelDirective<T, Modifiers extends string = string> = ObjectDirective<
  T & { [assignKey]: AssignerFn; _assigning?: boolean },
  any,
  Modifiers
>

/**
 * 将字符串值根据指定选项进行转换
 *
 * @param value - 需要转换的原始字符串值
 * @param trim - 是否移除字符串两端的空白字符，默认为false
 * @param number - 是否将字符串转换为数字类型，如果为true则尝试转换，如果为false或null则保持字符串类型，默认为false或null
 * @returns 返回经过处理后的值，可能是字符串或数字类型
 */
function castValue(value: string, trim?: boolean, number?: boolean | null) {
  if (trim) value = value.trim()
  if (number) value = looseToNumber(value)
  return value
}

// We are exporting the v-model runtime directly as vnode hooks so that it can 我们将v-model运行时直接作为vnode挂钩导出，以便其能够
// be tree-shaken in case v-model is never used. 以防v-model从未被使用过，请进行树形抖动
/**
 * Vue 内置 vModelText 指令：v-model 在 <input>(text/number)、<textarea> 上的核心实现
 *
 * 核心作用：实现文本/数字输入的双向数据绑定，支持 trim/number/lazy 三个修饰符，
 *          处理组合输入、浏览器兼容性、数字格式校验等边界问题
 *
 * 绑定元素：仅支持 HTMLInputElement（type="text"/"number"）、HTMLTextAreaElement
 *
 * 支持修饰符：trim（修剪首尾空格）、number（转换为数字类型）、lazy（change时同步，而非实时）
 */
export const vModelText: ModelDirective<
  HTMLInputElement | HTMLTextAreaElement,
  'trim' | 'number' | 'lazy'
> = {
  /**
   * 指令生命周期：在绑定元素的 attribute 前或事件监听器应用前调用
   * 核心职责：初始化双向绑定基础逻辑，挂载赋值器，监听输入/组合输入事件，处理修饰符初始逻辑
   */
  created(el, { modifiers: { lazy, trim, number } }, vnode) {
    // 步骤1：挂载v-model模型赋值器到元素上，用于后续将元素值同步到组件响应式数据
    // 赋值器是元素→组件数据同步的核心，调用el[assignKey](newValue)即可更新组件v-model绑定的值
    el[assignKey] = getModelAssigner(vnode)

    // 步骤2：判断是否需要将值转换为数字→核心规则：
    // 1. 有number修饰符 → 强制转数字；2. 元素type为number（无number修饰符也转）→ 贴合原生input数字类型行为
    const castToNumber =
      number || (vnode.props && vnode.props.type === 'number')

    // 步骤3：监听输入事件，实现元素→组件的数据同步（核心双向绑定逻辑）
    // 事件类型：lazy修饰符→监听change（失焦/回车触发）；无lazy→监听input（实时触发）
    addEventListener(el, lazy ? 'change' : 'input', e => {
      // 关键兼容：组合输入过程中（如中文拼音输入），不执行数据同步→避免拼音过程中实时更新组件数据
      // composing由onCompositionStart/onCompositionEnd维护，标记是否处于组合输入阶段
      if ((e.target as any).composing) return

      // 执行值处理（修剪/转数字），并调用赋值器同步到组件
      el[assignKey](castValue(el.value, trim, castToNumber))
    })

    // 步骤4：若开启trim/转数字，监听change事件→同步处理后的值到元素自身
    // 作用：解决「用户手动输入的原始值未被处理，元素显示与组件数据不一致」的问题
    // 例：trim开启时，用户输入"  123  "，input事件同步"123"到组件，change事件将元素值改为"123"，保证显示一致
    if (trim || castToNumber) {
      addEventListener(el, 'change', () => {
        el.value = castValue(el.value, trim, castToNumber)
      })
    }

    // 步骤5：非lazy模式下，监听组合输入事件→处理中文/日文等组合输入的兼容性
    // lazy模式下无需处理：因为lazy监听change，组合输入完成后才会触发change
    if (!lazy) {
      // 组合输入开始→标记composing=true，阻止input事件的同步逻辑
      addEventListener(el, 'compositionstart', onCompositionStart)
      // 组合输入结束→标记composing=false，恢复input事件的同步逻辑
      addEventListener(el, 'compositionend', onCompositionEnd)
      // Safari < 10.2 & UIWebView doesn't fire compositionend when Safari < 10.2 & UIWebView 在以下情况下不会触发合成结束
      // switching focus before confirming composition choice 在确认构图选择之前切换焦点
      // this also fixes the issue where some browsers e.g. iOS Chrome 这也解决了某些浏览器（例如）的问题iOS 浏览器
      // fires "change" instead of "input" on autocomplete. 自动完成时触发“更改”而不是“输入”。
      addEventListener(el, 'change', onCompositionEnd)
    }
  },
  // set value on mounted so it's after min/max for type="range" 设置已安装的值，使其位于 type="range" 的最小/最大之后
  /**
   * 指令生命周期：元素挂载到DOM后执行（mounted）
   *
   * 核心职责：设置元素初始值，保证初始值与组件v-model绑定值一致
   *
   * 执行时机：挂载后执行→确保晚于元素的min/max等属性初始化（适配type="range"，虽vModelText不支持range，但底层兼容）
   */
  mounted(el, { value }) {
    // 初始值处理：组件值为null/undefined时，元素值设为空字符串（避免元素显示null/undefined），否则设为组件值
    el.value = value == null ? '' : value
  },
  /**
   * 指令生命周期：组件更新前执行（beforeUpdate）
   * 核心职责：实现组件→元素的数据同步（双向绑定的另一方向），避免覆盖用户正在输入的内容，
   *          处理各种边界情况，保证数据一致性
   */
  beforeUpdate(
    el,
    { value, oldValue, modifiers: { lazy, trim, number } },
    vnode,
  ) {
    // 步骤1：重新挂载模型赋值器→组件更新后，虚拟节点可能重建，赋值器需要重新获取，保证同步有效
    el[assignKey] = getModelAssigner(vnode)

    // avoid clearing unresolved text. #2302 避免清除未解决的文本
    // 步骤2：边界保护1→组合输入过程中，不同步组件数据到元素→避免覆盖用户正在输入的组合内容（#2302）
    if ((el as any).composing) return

    // 步骤3：解析元素当前值→针对数字类型做特殊处理，保证值的格式正确
    const elValue =
      // 条件：开启数字转换（number修饰符/type="number"）+ 元素值非前导0数字（如"0123"不转，避免数字格式错误）
      (number || el.type === 'number') && !/^0\d/.test(el.value)
        ? looseToNumber(el.value) // 宽松转数字→有效数字转数字类型，非数字保持字符串
        : el.value // 非数字类型，直接取元素原始值

    // 步骤4：处理组件新值→null/undefined转为空字符串，保证元素显示正常
    const newValue = value == null ? '' : value

    // 步骤5：边界保护2→元素值与组件新值一致，直接返回→避免无效的元素值赋值，提升性能
    if (elValue === newValue) {
      return
    }

    // 步骤6：边界保护3→元素处于聚焦状态（用户正在编辑）且非range类型→避免覆盖用户正在输入的内容
    if (document.activeElement === el && el.type !== 'range') {
      // 子保护1：lazy模式下，组件新值与旧值一致→返回（#8546）→避免change事件未触发时的重复赋值
      // #8546
      if (lazy && value === oldValue) {
        return
      }
      // 子保护2：trim模式下，元素值修剪后与组件新值一致→返回→避免强制赋值覆盖用户输入的空格（如用户输入" 123 "，修剪后是"123"，与组件值一致则不修改）
      if (trim && el.value.trim() === newValue) {
        return
      }
    }

    // 步骤7：所有边界保护通过→将组件新值同步到元素，实现组件→元素的数据更新
    el.value = newValue
  },
}

export const vModelCheckbox: ModelDirective<HTMLInputElement> = {
  // #4096 array checkboxes need to be deep traversed
  deep: true,
  created(el, _, vnode) {
    el[assignKey] = getModelAssigner(vnode)
    addEventListener(el, 'change', () => {
      const modelValue = (el as any)._modelValue
      const elementValue = getValue(el)
      const checked = el.checked
      const assign = el[assignKey]
      if (isArray(modelValue)) {
        const index = looseIndexOf(modelValue, elementValue)
        const found = index !== -1
        if (checked && !found) {
          assign(modelValue.concat(elementValue))
        } else if (!checked && found) {
          const filtered = [...modelValue]
          filtered.splice(index, 1)
          assign(filtered)
        }
      } else if (isSet(modelValue)) {
        const cloned = new Set(modelValue)
        if (checked) {
          cloned.add(elementValue)
        } else {
          cloned.delete(elementValue)
        }
        assign(cloned)
      } else {
        assign(getCheckboxValue(el, checked))
      }
    })
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: setChecked,
  beforeUpdate(el, binding, vnode) {
    el[assignKey] = getModelAssigner(vnode)
    setChecked(el, binding, vnode)
  },
}

function setChecked(
  el: HTMLInputElement,
  { value, oldValue }: DirectiveBinding,
  vnode: VNode,
) {
  // store the v-model value on the element so it can be accessed by the
  // change listener.
  ;(el as any)._modelValue = value
  let checked: boolean

  if (isArray(value)) {
    checked = looseIndexOf(value, vnode.props!.value) > -1
  } else if (isSet(value)) {
    checked = value.has(vnode.props!.value)
  } else {
    if (value === oldValue) return
    checked = looseEqual(value, getCheckboxValue(el, true))
  }

  // Only update if the checked state has changed
  if (el.checked !== checked) {
    el.checked = checked
  }
}

export const vModelRadio: ModelDirective<HTMLInputElement> = {
  created(el, { value }, vnode) {
    el.checked = looseEqual(value, vnode.props!.value)
    el[assignKey] = getModelAssigner(vnode)
    addEventListener(el, 'change', () => {
      el[assignKey](getValue(el))
    })
  },
  beforeUpdate(el, { value, oldValue }, vnode) {
    el[assignKey] = getModelAssigner(vnode)
    if (value !== oldValue) {
      el.checked = looseEqual(value, vnode.props!.value)
    }
  },
}

export const vModelSelect: ModelDirective<HTMLSelectElement, 'number'> = {
  // <select multiple> value need to be deep traversed <select multiple>值需要深度遍历
  deep: true,
  created(el, { value, modifiers: { number } }, vnode) {
    const isSetModel = isSet(value)
    addEventListener(el, 'change', () => {
      const selectedVal = Array.prototype.filter
        .call(el.options, (o: HTMLOptionElement) => o.selected)
        .map((o: HTMLOptionElement) =>
          number ? looseToNumber(getValue(o)) : getValue(o),
        )
      el[assignKey](
        el.multiple
          ? isSetModel
            ? new Set(selectedVal)
            : selectedVal
          : selectedVal[0],
      )
      el._assigning = true
      nextTick(() => {
        el._assigning = false
      })
    })
    el[assignKey] = getModelAssigner(vnode)
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(el, { value }) {
    setSelected(el, value)
  },
  beforeUpdate(el, _binding, vnode) {
    el[assignKey] = getModelAssigner(vnode)
  },
  updated(el, { value }) {
    if (!el._assigning) {
      setSelected(el, value)
    }
  },
}

function setSelected(el: HTMLSelectElement, value: any) {
  const isMultiple = el.multiple
  const isArrayValue = isArray(value)
  if (isMultiple && !isArrayValue && !isSet(value)) {
    __DEV__ &&
      warn(
        `<select multiple v-model> expects an Array or Set value for its binding, ` +
          `but got ${Object.prototype.toString.call(value).slice(8, -1)}.`,
      )
    return
  }

  for (let i = 0, l = el.options.length; i < l; i++) {
    const option = el.options[i]
    const optionValue = getValue(option)
    if (isMultiple) {
      if (isArrayValue) {
        const optionType = typeof optionValue
        // fast path for string / number values
        if (optionType === 'string' || optionType === 'number') {
          option.selected = value.some(v => String(v) === String(optionValue))
        } else {
          option.selected = looseIndexOf(value, optionValue) > -1
        }
      } else {
        option.selected = value.has(optionValue)
      }
    } else if (looseEqual(getValue(option), value)) {
      if (el.selectedIndex !== i) el.selectedIndex = i
      return
    }
  }
  if (!isMultiple && el.selectedIndex !== -1) {
    el.selectedIndex = -1
  }
}

// retrieve raw value set via :value bindings
function getValue(el: HTMLOptionElement | HTMLInputElement) {
  return '_value' in el ? (el as any)._value : el.value
}

// retrieve raw value for true-value and false-value set via :true-value or :false-value bindings
function getCheckboxValue(
  el: HTMLInputElement & { _trueValue?: any; _falseValue?: any },
  checked: boolean,
) {
  const key = checked ? '_trueValue' : '_falseValue'
  return key in el ? el[key] : checked
}

export const vModelDynamic: ObjectDirective<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
> = {
  created(el, binding, vnode) {
    callModelHook(el, binding, vnode, null, 'created')
  },
  mounted(el, binding, vnode) {
    callModelHook(el, binding, vnode, null, 'mounted')
  },
  beforeUpdate(el, binding, vnode, prevVNode) {
    callModelHook(el, binding, vnode, prevVNode, 'beforeUpdate')
  },
  updated(el, binding, vnode, prevVNode) {
    callModelHook(el, binding, vnode, prevVNode, 'updated')
  },
}

function resolveDynamicModel(tagName: string, type: string | undefined) {
  switch (tagName) {
    case 'SELECT':
      return vModelSelect
    case 'TEXTAREA':
      return vModelText
    default:
      switch (type) {
        case 'checkbox':
          return vModelCheckbox
        case 'radio':
          return vModelRadio
        default:
          return vModelText
      }
  }
}

function callModelHook(
  el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  binding: DirectiveBinding,
  vnode: VNode,
  prevVNode: VNode | null,
  hook: keyof ObjectDirective,
) {
  const modelToUse = resolveDynamicModel(
    el.tagName,
    vnode.props && vnode.props.type,
  )
  const fn = modelToUse[hook] as DirectiveHook
  fn && fn(el, binding, vnode, prevVNode)
}

// SSR vnode transforms, only used when user includes client-oriented render
// function in SSR
export function initVModelForSSR(): void {
  vModelText.getSSRProps = ({ value }) => ({ value })

  vModelRadio.getSSRProps = ({ value }, vnode) => {
    if (vnode.props && looseEqual(vnode.props.value, value)) {
      return { checked: true }
    }
  }

  vModelCheckbox.getSSRProps = ({ value }, vnode) => {
    if (isArray(value)) {
      if (vnode.props && looseIndexOf(value, vnode.props.value) > -1) {
        return { checked: true }
      }
    } else if (isSet(value)) {
      if (vnode.props && value.has(vnode.props.value)) {
        return { checked: true }
      }
    } else if (value) {
      return { checked: true }
    }
  }

  vModelDynamic.getSSRProps = (binding, vnode) => {
    if (typeof vnode.type !== 'string') {
      return
    }
    const modelToUse = resolveDynamicModel(
      // resolveDynamicModel expects an uppercase tag name, but vnode.type is lowercase
      vnode.type.toUpperCase(),
      vnode.props && vnode.props.type,
    )
    if (modelToUse.getSSRProps) {
      return modelToUse.getSSRProps(binding, vnode)
    }
  }
}

export type VModelDirective =
  | typeof vModelText
  | typeof vModelCheckbox
  | typeof vModelSelect
  | typeof vModelRadio
  | typeof vModelDynamic
