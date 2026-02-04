import { hyphenate, isArray, isObject, isString } from './general'

export type NormalizedStyle = Record<string, string | number>

/**
 * 标准化Style值，处理任意合法样式类型，实现数组样式深度合并，输出浏览器可识别的样式格式
 *
 *
 * @param {unknown} value - 待标准化的样式值，支持合法类型：字符串/纯对象/样式数组（含嵌套）
 * @returns {NormalizedStyle | string | undefined} 标准化结果：
 *          - 数组入参返回「合并后的标准化样式对象」
 *          - 字符串/纯对象入参直接返回原值（浏览器原生支持）
 *          - 无效类型入参返回undefined
 */
export function normalizeStyle(
  value: unknown,
): NormalizedStyle | string | undefined {
  // 分支1：入参为数组 → 深度遍历合并，最终返回标准化样式对象（核心处理逻辑）
  // 支持数组内混存字符串/对象/嵌套数组，是Vue :style="[style1, style2]" 绑定的底层实现
  if (isArray(value)) {
    // 初始化合并结果对象，存储最终的标准化样式键值对
    const res: NormalizedStyle = {}

    for (let i = 0; i < value.length; i++) {
      const item = value[i]
      // 标准化当前样式项：区分字符串/非字符串，递归处理嵌套结构
      const normalized = isString(item)
        ? parseStringStyle(item) // 字符串项：解析为标准化样式对象
        : (normalizeStyle(item) as NormalizedStyle) // 非字符串项：递归调用自身，处理对象/嵌套数组

      if (normalized) {
        // 遍历标准化后的样式键值对，合并到结果对象中
        for (const key in normalized) {
          res[key] = normalized[key] // 合并规则：后项的同名样式属性 直接覆盖 前项（与CSS层叠规则一致）
        }
      }
    }
    // 数组处理完成，返回合并后的标准化样式对象
    return res
  }
  // 分支2：入参为字符串 或 纯对象 → 直接返回原值（浏览器原生支持，无需额外处理）
  // 字符串：原生行内样式格式（如 "color: red; font-size: 14px"），可直接赋值给DOM的style属性
  // 纯对象：标准化样式对象（如 { color: 'red', fontSize: 14 }），Vue底层会自动解析为行内样式
  else if (isString(value) || isObject(value)) {
    return value
  }
}

const listDelimiterRE = /;(?![^(]*\))/g
const propertyDelimiterRE = /:([^]+)/
const styleCommentRE = /\/\*[^]*?\*\//g

/**
 * 解析字符串类型的CSS样式，将其转换为标准化的键值对对象
 *
 * 此函数用于将CSS文本（如 "color: red; font-size: 14px;"）解析为JavaScript对象
 * 同时会移除CSS注释并正确分割各个样式属性
 *
 * @param {string} cssText - 包含CSS样式的字符串，例如 "color: red; font-size: 14px;"
 * @returns {NormalizedStyle} 解析后的样式对象，键为CSS属性名，值为对应的属性值
 */
export function parseStringStyle(cssText: string): NormalizedStyle {
  const ret: NormalizedStyle = {}
  // 移除CSS注释后按分隔符拆分样式声明，并遍历每一项进行处理
  cssText
    .replace(styleCommentRE, '')
    .split(listDelimiterRE)
    .forEach(item => {
      if (item) {
        // 将每条样式声明按属性分隔符拆分为属性名和属性值
        const tmp = item.split(propertyDelimiterRE)
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim())
      }
    })
  return ret
}

export function stringifyStyle(
  styles: NormalizedStyle | string | undefined,
): string {
  if (!styles) return ''
  if (isString(styles)) return styles

  let ret = ''
  for (const key in styles) {
    const value = styles[key]
    if (isString(value) || typeof value === 'number') {
      const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key)
      // only render valid values
      ret += `${normalizedKey}:${value};`
    }
  }
  return ret
}

/**
 * 将不同类型的class值规范化为字符串格式
 * 支持字符串、数组和对象三种类型输入，并将其转换为标准的class字符串
 *
 * @param value - 待规范化的class值，可以是字符串、数组或对象
 * @returns 规范化后的class字符串，多个class名之间用空格分隔
 */
export function normalizeClass(value: unknown): string {
  let res = '' // 初始化结果字符串，用于拼接最终的Class

  // 分支1：入参为字符串 → 直接使用（字符串是原生合法的Class格式）
  if (isString(value)) {
    res = value
  }
  // 分支2：入参为数组 → 遍历+递归标准化（支持数组嵌套、数组内混存任意Class类型）
  else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      // 递归调用自身，标准化数组中的单个元素（处理嵌套数组/对象/字符串等）
      const normalized = normalizeClass(value[i])

      if (normalized) {
        res += normalized + ' ' // 多个Class之间用空格分隔
      }
    }
  }
  // 分支3：入参为纯对象（非null/数组，数组已被isArray优先判断）→ 按「键值真值」拼接Class
  else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + ' ' // 多个Class之间用空格分隔
      }
    }
  }
  // 去除首尾的空格并返回（拼接时每个Class后加了空格，会产生尾空格，trim后更规范）
  return res.trim()
}

export function normalizeProps(
  props: Record<string, any> | null,
): Record<string, any> | null {
  if (!props) return null
  let { class: klass, style } = props
  if (klass && !isString(klass)) {
    props.class = normalizeClass(klass)
  }
  if (style) {
    props.style = normalizeStyle(style)
  }
  return props
}
