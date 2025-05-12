# css 属性

在这里只记录一些特定的属性

## [object-fit](https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit)

`object-fit` 属性指定[可替换元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Replaced_element)的内容应该如何适应到其使用高度和宽度确定的框

属性值: 由下列的值中的单独一个关键字来指定

- fill: 初始值，被替换的内容正好填充元素的内容框。整个对象将完全填充此框。如果对象的宽高比与内容框不相匹配，那么该对象将被拉伸以适应内容框。

- contain：被替换的内容将被缩放，以在填充元素的内容框时保持其宽高比。整个对象在填充盒子的同时保留其长宽比，因此如果宽高比与框的宽高比不匹配，该对象将被添加“黑边”。

- cover：被替换的内容在保持其宽高比的同时填充元素的整个内容框。如果对象的宽高比与内容框不相匹配，该对象将被剪裁以适应内容框。

* none：被替换的内容将保持其原有的尺寸。
* scale-down：内容的尺寸与 none 或 contain 中的一个相同，取决于它们两个之间谁得到的对象尺寸会更小一些。

## clip-path: 裁剪

**`clip-path`** 属性使用裁剪方式创建元素的可显示区域。区域内的部分显示，区域外的隐藏。

属性值:

* none: 默认值, 不做裁剪

* `<clip-source>`:  用 `<url>` 引用 SVG 的 `<clipPath>` 元素

  ```css
  clip-path: url(#cross);
  ```

* `<basic-shape>`: 定义一种形状

  ```css
  // 定义一个 inset 矩形。
  clip-path: inset(100px 50px);
  // 定义一个圆形（使用一个半径和一个圆心位置）。
  clip-path: circle(50px at 0 100px);
  // 定义一个椭圆（使用两个半径和一个圆心位置）。
  clip-path: ellipse(50px 60px at 10% 20%);
  // 定义一个多边形（使用一个 SVG 填充规则和一组顶点）。
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  // 定义一个任意形状（使用一个可选的 SVG 填充规则和一个 SVG 路径定义）。
  clip-path: path(
    "M0.5,1 C0.5,1,0,0.7,0,0.3 A0.25,0.25,1,1,1,0.5,0.3 A0.25,0.25,1,1,1,1,0.3 C1,0.7,0.5,1,0.5,1 Z"
  );
  ```

* `<geometry-box>`: 如果同 `<basic-shape>` 一起声明，它将为基本形状提供相应的参考框盒。

参考: [MDN: clip-path](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path)