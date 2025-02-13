import{_ as e,c as o,o as a,aR as t}from"./chunks/framework.DLAwTCsc.js";const g=JSON.parse('{"title":"浮动和定位布局","description":"","frontmatter":{},"headers":[],"relativePath":"css/flatandposition.md","filePath":"01_前端/02_css/13_浮动和定位布局.md","lastUpdated":1739447932000}'),r={name:"css/flatandposition.md"},l=t('<h1 id="浮动和定位布局" tabindex="-1">浮动和定位布局 <a class="header-anchor" href="#浮动和定位布局" aria-label="Permalink to &quot;浮动和定位布局&quot;">​</a></h1><h2 id="浮动" tabindex="-1">浮动 <a class="header-anchor" href="#浮动" aria-label="Permalink to &quot;浮动&quot;">​</a></h2><p>最初，引入 <code>float</code> 属性是为了能让 web 开发人员实现简单的布局，包括在一列文本中浮动的图像，<strong>文字环绕在它的左边或右边</strong>。但 Web 开发人员很快意识到，任何东西都可以浮动，而不仅仅是图像，所以浮动的使用范围扩大了。</p><p>对于文字环绕在浮动元素左边或右边，这一功能现在还会有用武之地，但是用来浮动布局确是问题颇多，对于浮动布局这一传统的布局方式不需要过多理解</p><p>参考：<a href="https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Floats" target="_blank" rel="noreferrer">MDN-浮动</a></p><h2 id="定位" tabindex="-1">定位 <a class="header-anchor" href="#定位" aria-label="Permalink to &quot;定位&quot;">​</a></h2><p>定位(positioning)能够让我们<strong>把一个元素从它原本在正常布局流(normal flow)中应该在的位置移动到另一个位置</strong>。定位(positioning)并不是一种用来给你做主要页面布局的方式，它更像是让你去<strong>管理和微调页面中的一个特殊项的位置</strong>。</p><h3 id="定位类型" tabindex="-1">定位类型 <a class="header-anchor" href="#定位类型" aria-label="Permalink to &quot;定位类型&quot;">​</a></h3><p>截止目前存在五种定位类型：</p><h4 id="静态定位-static" tabindex="-1">静态定位(static) <a class="header-anchor" href="#静态定位-static" aria-label="Permalink to &quot;静态定位(static)&quot;">​</a></h4><p>默认属性，即元素在文档常规流中当前的布局位置。此时 <code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code> 和 <code>z-index </code>属性无效。</p><h4 id="相对定位-relative" tabindex="-1">相对定位(relative) <a class="header-anchor" href="#相对定位-relative" aria-label="Permalink to &quot;相对定位(relative)&quot;">​</a></h4><p>与静态定位非常相似，把一个正常布局流(normal flow)中的元素从它的默认位置按坐标进行相对移动，但是还是<strong>占据在正常的文档流</strong>中</p><p>此时相对定位元素首先按照由包含块的格式化上下文(可能是正常布局流、弹性布局、网格布局等)进行布局，然后再相对于其原始位置进行相对移动</p><h4 id="绝对定位-absolute" tabindex="-1">绝对定位(absolute) <a class="header-anchor" href="#绝对定位-absolute" aria-label="Permalink to &quot;绝对定位(absolute)&quot;">​</a></h4><p><strong>绝对定位元素会被移出正常文档流，并不为元素预留空间</strong>，通过指定元素相对于最近的非 static 定位祖先元素的偏移，来确定元素位置。</p><h4 id="固定定位-fixed" tabindex="-1">固定定位(fixed) <a class="header-anchor" href="#固定定位-fixed" aria-label="Permalink to &quot;固定定位(fixed)&quot;">​</a></h4><p><strong>固定定位元素会被移出正常文档流，并不为元素预留空间</strong>，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置。元素的位置在屏幕滚动时不会改变。</p><h4 id="粘性定位-sticky" tabindex="-1">粘性定位(sticky) <a class="header-anchor" href="#粘性定位-sticky" aria-label="Permalink to &quot;粘性定位(sticky)&quot;">​</a></h4><p>粘性定位基本上是相对定位和固定定位的混合体，它允许被定位的元素表现得像相对定位一样，<strong>直到它滚动到某个阈值点</strong>（例如，从视口顶部起 10 像素）为止，此后它就变得固定了，<strong>但是会“固定”在离它最近的一个拥有“滚动机制”的祖先上</strong>（当该祖先的<code>overflow</code> 是 <code>hidden</code>, <code>scroll</code>, <code>auto</code>, 或 <code>overlay</code>时），即便这个祖先不是最近的真实可滚动祖先。</p><p><strong>注意：粘性定位在 IE 中不支持</strong></p><h3 id="定位上下文-定位相对于哪个元素进行定位" tabindex="-1">定位上下文 - 定位相对于哪个元素进行定位？ <a class="header-anchor" href="#定位上下文-定位相对于哪个元素进行定位" aria-label="Permalink to &quot;定位上下文 - 定位相对于哪个元素进行定位？&quot;">​</a></h3><p><strong>注意：定位上下文是决定定位元素的定位坐标，而层叠上下文是决定元素在 Z 轴的排序顺序，注意这两个上下文的区别。</strong></p><ul><li><p>相对定位(relative)：就是相对于未添加定位时的位置进行定位</p></li><li><p>绝对定位(absolute)：相对于最近的非 static 定位祖先元素。</p><div class="warning custom-block"><p class="custom-block-title">注意</p><p>如果所有祖先元素都是 static，绝对定位元素会被包含在<strong>初始块容器</strong>中。这个初始块容器有着和浏览器视口一样的尺寸，并且<code>&lt;html&gt;</code>元素也被包含在这个容器里面。简单来说，绝对定位元素会被放在<code>&lt;html&gt;</code>元素的外面，并且根据浏览器视口来定位。</p><p>也就是说，此时不会相对与 <code>&lt;html&gt;</code>或 <code>&lt;body&gt;</code> 来定位，而是相对于<strong>初始块容器</strong></p></div></li><li><p>固定定位(fixed)：对于屏幕视口（viewport）的位置</p><div class="warning custom-block"><p class="custom-block-title">注意</p><p>一般情况下，固定定位是相对于屏幕视口，但是当元素祖先的 <code>transform</code>, <code>perspective</code> 或 <code>filter</code> 属性非 <code>none</code> 时，此时就会变成相对于这个祖先元素定位</p><p>在 <a href="/wzb_knowledge_base/html/15.html" target="blank">单独页面</a> 看这个例子。</p></div></li><li><p>粘性定位(sticky)：当没有达到设置阈值时，元素根据正常文档流进行定位，当达到设置阈值时，就会相对于在离它最近的一个拥有“滚动机制”的祖先上（当该祖先的<code>overflow</code> 是 <code>hidden</code>, <code>scroll</code>, <code>auto</code>, 或 <code>overlay</code>时），即便这个祖先不是最近的真实可滚动祖先。</p></li></ul><h3 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h3><ul><li><a href="https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Positioning" target="_blank" rel="noreferrer">MDN-定位</a></li><li><a href="https://www.w3.org/TR/css-position-3/" target="_blank" rel="noreferrer">CSS Positioned Layout Module Level 3</a></li></ul>',26),i=[l];function s(c,d,n,h,p,u){return a(),o("div",null,i)}const b=e(r,[["render",s]]);export{g as __pageData,b as default};
