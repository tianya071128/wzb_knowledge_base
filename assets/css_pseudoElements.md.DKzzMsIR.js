import{_ as e,c as o,o as r,aR as t}from"./chunks/framework.DLAwTCsc.js";const b=JSON.parse('{"title":"CSS 伪元素","description":"","frontmatter":{},"headers":[],"relativePath":"css/pseudoElements.md","filePath":"01_前端/02_css/03_伪元素.md","lastUpdated":1739447932000}'),l={name:"css/pseudoElements.md"},a=t('<h1 id="css-伪元素" tabindex="-1">CSS 伪元素 <a class="header-anchor" href="#css-伪元素" aria-label="Permalink to &quot;CSS 伪元素&quot;">​</a></h1><p>CSS 伪元素在最新的属于 <a href="https://www.w3.org/TR/css-pseudo-4/" target="_blank" rel="noreferrer">CSS Pseudo-Elements Module Level 4</a>，以前好像是没有将伪元素单独抽离出单独模块，可以在 <a href="https://drafts.csswg.org/selectors-3/#pseudo-elements" target="_blank" rel="noreferrer">Selectors Level 3: Pseudo-elements</a>中查看规范</p><p>每个伪元素都与一个原始元素相关联，<strong>是一个附加至选择器末的关键词。</strong></p><div class="warning custom-block"><p class="custom-block-title">注意</p><ol><li>一个选择器中只能使用一个伪元素。伪元素必须紧跟在语句中的简单选择器/基础选择器之后。如果伪元素前面不写选择器的话，默认是通用选择器(*)</li><li>按照规范，应该使用双冒号（<code>::</code>）而不是单个冒号（<code>:</code>），以便区分伪类和伪元素。但是，由于旧版本的 W3C 规范并未对此进行特别区分，因此目前绝大多数的浏览器都同时支持使用这两种方式来表示伪元素。</li></ol></div><h2 id="伪元素和伪类的区别" tabindex="-1">伪元素和伪类的区别 <a class="header-anchor" href="#伪元素和伪类的区别" aria-label="Permalink to &quot;伪元素和伪类的区别&quot;">​</a></h2><p>伪元素的作用：</p><ol><li>创建超出文档语言指定的文档树的抽象：例如文档语言不提供访问元素内容的第一个字母或第一行的机制。伪元素允许作者引用这些无法访问的信息</li><li>引用源文档中不存在的内容：例如伪元素<a href="https://drafts.csswg.org/selectors-3/#sel-before" target="_blank" rel="noreferrer"><code>::before</code></a>和<a href="https://drafts.csswg.org/selectors-3/#sel-after" target="_blank" rel="noreferrer"><code>::after</code></a>伪元素提供对生成内容的访问</li></ol><p>伪类的作用：</p><ol><li>允许基于位于文档树之外的信息(元素的特殊状态)选择元素</li><li>扩展选择器，允许基于位于文档树中但不能由其他简单选择器或组合器表示的额外信息进行选择。</li></ol><p>区别：</p><ul><li><strong>伪元素相当于&quot;创建&quot;一个文档外的元素</strong></li><li><strong>伪类是对已有元素的选择，更贴近于选择器范畴，并且在 CSS 中也是没有单独的模块</strong></li></ul><h2 id="常驻伪元素" tabindex="-1">常驻伪元素 <a class="header-anchor" href="#常驻伪元素" aria-label="Permalink to &quot;常驻伪元素&quot;">​</a></h2><p>常驻伪元素总是适合盒子树。它们从它们的原始元素继承任何可继承的属性；不可继承的属性像往常一样采用它们的初始值</p><h3 id="生成内容伪元素-before-和-after" tabindex="-1">生成内容伪元素：::before 和 ::after <a class="header-anchor" href="#生成内容伪元素-before-和-after" aria-label="Permalink to &quot;生成内容伪元素：::before 和 ::after&quot;">​</a></h3><p>当它们的 <code>content</code> 内容值不是<a href="https://www.w3.org/TR/css-content-3/#valdef-content-none" target="_blank" rel="noreferrer">none</a>时，这两个伪元素生成盒子，就好像它们是原始元素的直接子元素一样，内容由 <code>content</code> 决定。这些伪元素的样式可以与文档树中任何正常的文档来源元素完全一样；</p><p><strong>作用</strong>：当它们的 <code>content</code> 内容值不是<a href="https://www.w3.org/TR/css-content-3/#valdef-content-none" target="_blank" rel="noreferrer">none</a>时，这两个伪元素生成盒子，就好像它们是原始元素的直接子元素一样，内容由 <code>content</code> 决定。这些伪元素的样式可以与文档树中任何正常的文档来源元素完全一样；</p><ul><li>::before：在原始元素的实际内容之前表示一个可样式化的子伪元素。</li><li>:: after：在原始元素的实际内容之后表示一个可样式化的子伪元素。</li></ul><p><strong>语法</strong>：<code>element::after(::before) { 样式声明 } /* CSS3 语法 */</code></p><p><strong>例子</strong>：使用 <code>::after</code> 和 <code>attr()</code> 等创建一个纯 CSS, 词汇表提示工具。在 <a href="/wzb_knowledge_base/html/11.html" target="blank">单独页面</a> 看这个例子。</p><h3 id="表单元素占位文本-placeholder" tabindex="-1">表单元素占位文本：::placeholder <a class="header-anchor" href="#表单元素占位文本-placeholder" aria-label="Permalink to &quot;表单元素占位文本：::placeholder&quot;">​</a></h3><p><strong>作用</strong>：可以选择一个表单元素的<strong>占位文本</strong>，允许自定义占位文本的样式</p><p><strong>语法：</strong><code>element::placeholder {样式声明}</code></p><p><strong>注意</strong>：</p><blockquote><ol><li>仅有小一部分 CSS 属性可以使用，这个集合可以参考<a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-line" target="_blank" rel="noreferrer"><code>::first-line</code></a>伪元素。</li><li><strong>这是一个实验中的功能</strong>，具体使用需要结合几个浏览器私有选择器使用。 <ul><li>::-webkit-input-placeholder</li><li>::-moz-placeholder</li><li>:-ms-input-placeholder</li></ul></li></ol></blockquote><p><strong>例子</strong>：在 <a href="/wzb_knowledge_base/html/12.html" target="blank">单独页面</a> 看这个例子。</p><h3 id="列表标记-marker" tabindex="-1">列表标记：::marker <a class="header-anchor" href="#列表标记-marker" aria-label="Permalink to &quot;列表标记：::marker&quot;">​</a></h3><p><strong>作用</strong>：选中一个列表项目的标记框，它作用在任何设置了<code>display: list-item</code>的元素或伪元素上，例如<code>&lt;li&gt;</code>和<code>&lt;summary&gt;</code>。</p><p><strong>语法：</strong><code>element::marker {样式声明}</code></p><p><strong>注意</strong>：这是一个实验中功能，并且没有找到浏览器私有选择器供使用，所以在项目慎用。并且仅有一部分属性可以使用，<a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/::marker#%E5%85%81%E8%AE%B8%E7%9A%84%E5%B1%9E%E6%80%A7%E5%80%BC" target="_blank" rel="noreferrer">参考</a></p><p><strong>例子</strong>：在 <a href="/wzb_knowledge_base/html/13.html" target="blank">单独页面</a> 看这个例子。</p><h2 id="排版伪元素" tabindex="-1">排版伪元素 <a class="header-anchor" href="#排版伪元素" aria-label="Permalink to &quot;排版伪元素&quot;">​</a></h2><p>这些伪元素会影响内容排版</p><h3 id="首字母-first-letter" tabindex="-1">首字母：::first-letter <a class="header-anchor" href="#首字母-first-letter" aria-label="Permalink to &quot;首字母：::first-letter&quot;">​</a></h3><p><strong>作用</strong>：选中某块级元素第一行的第一个字母，并且文字所处的行之前没有其他内容（如图片和内联的表格） 。</p><p><strong>语法</strong>：<code>element::first-letter {样式声明}</code></p><p><strong>注意</strong>：</p><blockquote><ol><li>元素首字符并不总是很容易识别，具体规则见 <a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-letter" target="_blank" rel="noreferrer">MDN</a></li><li>仅允许一部分属性值，具体规则见 <a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-letter#%E5%85%81%E8%AE%B8%E7%9A%84%E5%B1%9E%E6%80%A7%E5%80%BC" target="_blank" rel="noreferrer">MDN-允许的属性值</a></li><li>只能在块容器中，所以只能在一个 display 值为<code>block</code>, <code>inline-block</code>, <code>table-cell</code> 或者 <code>table-caption</code>中有用.。在其他的类型中，<code>::first-line</code> 是不起作用的.</li></ol></blockquote><h3 id="首行-first-line" tabindex="-1">首行：::first-line <a class="header-anchor" href="#首行-first-line" aria-label="Permalink to &quot;首行：::first-line&quot;">​</a></h3><p><strong>作用</strong>：选中某块级元素的第一行应用样式。第一行的长度取决于很多因素，包括元素宽度，文档宽度和文本的文字大小。</p><p><strong>语法</strong>：<code>element::first-line {样式声明}</code></p><p><strong>注意</strong>：</p><blockquote><ol><li>元素第一行是不固定的，随着原始元素宽度不同，此时首行内容就会随之变化</li><li>仅允许一部分属性值，具体规则见 <a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/::first-line#%E5%85%81%E8%AE%B8%E7%9A%84%E5%B1%9E%E6%80%A7%E5%80%BC" target="_blank" rel="noreferrer">MDN-允许的属性值</a></li><li>只能在块容器中，所以只能在一个 display 值为<code>block</code>, <code>inline-block</code>, <code>table-cell</code> 或者 <code>table-caption</code>中有用.。在其他的类型中，<code>::first-line</code> 是不起作用的.</li></ol></blockquote><p><strong>例子</strong>：在 <a href="/wzb_knowledge_base/html/14.html" target="blank">单独页面</a> 看这个例子。</p><h2 id="突出伪元素" tabindex="-1">突出伪元素 <a class="header-anchor" href="#突出伪元素" aria-label="Permalink to &quot;突出伪元素&quot;">​</a></h2><p>这些伪元素会突出显示某些内容</p><h3 id="用户选中高亮-selection" tabindex="-1">用户选中高亮：::selection <a class="header-anchor" href="#用户选中高亮-selection" aria-label="Permalink to &quot;用户选中高亮：::selection&quot;">​</a></h3><p><strong>作用</strong>：文档中被用户高亮的部分（比如使用鼠标或其他选择设备选中的部分）</p><p><strong>语法</strong>：<code>element::selection {样式声明}</code></p><p><strong>注意</strong>：还需搭配 <code>::-moz-selection</code> 私有前缀</p><h2 id="其他伪元素" tabindex="-1">其他伪元素 <a class="header-anchor" href="#其他伪元素" aria-label="Permalink to &quot;其他伪元素&quot;">​</a></h2><p>其他伪元素都是实验性的功能，兼容性很差，具体见 <a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-elements#%E6%A0%87%E5%87%86%E4%BC%AA%E5%85%83%E7%B4%A0%E7%B4%A2%E5%BC%95" target="_blank" rel="noreferrer">MDN-伪元素</a></p>',51),s=[a];function n(c,i,d,h,p,g){return r(),o("div",null,s)}const m=e(l,[["render",n]]);export{b as __pageData,m as default};
