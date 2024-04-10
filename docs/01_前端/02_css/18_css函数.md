# css 函数

## [attr](https://developer.mozilla.org/zh-CN/docs/Web/CSS/attr)

`attr()` 用来获取选择到的元素的某一 HTML 属性值，并用于其样式。

### 语法

**attr(attribute-name)**

- `attribute-name`：引用的 HTML 属性名称

  ::: tip

  `attr()` 理论上能用于所有的 CSS 属性但目前支持的仅有伪元素的 content 属性，其他的属性和高级特性目前是实验性的

  所以还支持各种高级语法，但是兼容性非常差。

  :::

## [calc](https://developer.mozilla.org/zh-CN/docs/Web/CSS/calc)

`calc()` 函数允许在声明 CSS 属性值时执行一些计算。

支持如下操作符的组合：+、-、\*、/

::: tip

- \+ 和 - 运算符的两边必须要有空白字符。比如，calc(50% -8px) 会被解析成为一个无效的表达式，解析结果是：一个百分比 后跟一个负数长度值。而加有空白字符的、有效的表达式 calc(8px + -50%) 会被解析成为：一个长度 后跟一个加号 再跟一个负百分比。
- \* 和 / 这两个运算符前后不需要空白字符，但如果考虑到统一性，仍然推荐加上空白符。

:::

## [max](https://developer.mozilla.org/zh-CN/docs/Web/CSS/max)

`max()` 函数可以从一个逗号分隔的表达式列表中选择最大（正方向）的值作为属性的值

### 语法

max(表达式, [表达式...])，表达式可以是数学运算 (可在 calc() 了解更多信息), 直接数值，或者是其他表达式，例如 attr()，这将会计算成一个合法的参数类型（例如 [\<length\>](https://developer.mozilla.org/zh-CN/docs/Web/CSS/length)），也可以是嵌套的 min() 和 max() 函数。

## [min](https://developer.mozilla.org/zh-CN/docs/Web/CSS/min)

`min()` 允许从逗号分隔符表达式中选择一个最小值作为 CSS 的属性值。

### 语法

min(表达式, [表达式...])，与 `max` 类似，支持嵌套以及其他的函数嵌套

## [clamp](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clamp)

`clamp()` 函数的作用是把一个值限制在一个上限和下限之间，当这个值超过最小值和最大值的范围时，在最小值和最大值之间选择一个值使用。

`clamp(MIN, VAL, MAX)` 其实就是表示 `max(MIN, min(VAL, MAX))`

### 语法

clamp() 函数接收三个用逗号分隔的表达式作为参数，按最小值、首选值、最大值的顺序排列。

当首选值比最小值要小时，则使用最小值。

当首选值介于最小值和最大值之间时，用首选值。

当首选值比最大值要大时，则使用最大值。

## [var](https://developer.mozilla.org/zh-CN/docs/Web/CSS/var)

`var()` 函数可以插入一个自定义属性（有时也被称为“CSS 变量”）的值，用来代替非自定义属性中值的任何部分。

### 语法

var(变量名, 回退值?)，如果第一个参数引用的自定义属性无效，则该函数将使用第二个值。

::: tip

自定义属性的回退值允许使用逗号。例如，var(--foo, red, blue) 将 red, blue 同时指定为回退值；即是说任何在第一个逗号之后到函数结尾前的值都会被考虑为回退值。

:::
