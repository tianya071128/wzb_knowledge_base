import{_ as e,c as l,o,aR as r,aZ as a,a_ as t,a$ as i,b0 as n,b1 as c,b2 as s,b3 as d,b4 as f}from"./chunks/framework.DLAwTCsc.js";const v=JSON.parse('{"title":"弹性布局","description":"","frontmatter":{"title":"弹性布局","date":"2021-10-21T15:00:00.000Z","permalink":"/css/flexBox","categories":"-- css -- 弹性布局","tags":[null]},"headers":[],"relativePath":"css/flexBox.md","filePath":"01_前端/02_css/14_弹性布局.md","lastUpdated":1739447932000}'),x={name:"css/flexBox.md"},p=r('<h1 id="弹性布局" tabindex="-1">弹性布局 <a class="header-anchor" href="#弹性布局" aria-label="Permalink to &quot;弹性布局&quot;">​</a></h1><p>Flexible Box 模型，通常被称为 flexbox，是一种一维的布局模型。</p><p>flexbox 是一种一维的布局，是因为一个 flexbox <strong>一次只能处理一个维度上的元素布局，一行或者一列</strong>。作为对比的是网格(Grid)布局，是一种二维布局，可以同时处理行和列上的布局。</p><p>flexbox 在 CSS 模块中是一个单独模块，<a href="https://drafts.csswg.org/css-flexbox-1/" target="_blank" rel="noreferrer">CSS Flexible Box Layout Module Level 1</a>，但是 Flexbox 的对齐属性(<code>justify-content</code>、<code>align-items</code>、<code>align-self</code>、<code>align-content</code>)已经纳入 <a href="https://www.w3.org/TR/css-align-3/" target="_blank" rel="noreferrer">CSS Box Alignment Level 3</a>标准里了。</p><h2 id="一维布局介绍" tabindex="-1">一维布局介绍 <a class="header-anchor" href="#一维布局介绍" aria-label="Permalink to &quot;一维布局介绍&quot;">​</a></h2><p><strong>弹性盒子中并没有方法告诉一行里的物件和上一行里的物件对齐——每个弹性行表现得就像一个新的弹性容器</strong>。它在主要坐标轴上处理空间分布。如果只有一个物件，并且这个物件允许伸展，他就会填充坐标轴，就好像你有一个单物件的弹性容器。</p><p><strong>在一维的方式里就像弹性盒子，我们仅仅控制行或者列。</strong></p><div class="warning custom-block"><p class="custom-block-title">注意</p><p>每个弹性行表现得就像一个新的弹性容器，这句很重要。当有多行时，每行就像一个单独的弹性容器，所以对齐属性(<code>justify-content</code>、<code>align-items</code>、<code>align-self</code>、<code>align-content</code>)都是在每一行进行对齐，但是无法对单独一行进行独立的对齐处理</p></div><h2 id="基本概念" tabindex="-1">基本概念 <a class="header-anchor" href="#基本概念" aria-label="Permalink to &quot;基本概念&quot;">​</a></h2><h3 id="主轴和交叉轴" tabindex="-1">主轴和交叉轴 <a class="header-anchor" href="#主轴和交叉轴" aria-label="Permalink to &quot;主轴和交叉轴&quot;">​</a></h3><p>容器默认存在两根轴：主轴由 <code>flex-direction</code> 定义，另一根交叉轴垂直于它</p><h3 id="起始线和终止线" tabindex="-1">起始线和终止线 <a class="header-anchor" href="#起始线和终止线" aria-label="Permalink to &quot;起始线和终止线&quot;">​</a></h3><p>flexbox 不会对文档的书写模式提供假设，同样由 <code>flex-direction</code> 定义主轴的起始线和终止线(交叉轴始终垂直于它)</p><p>如果 <code>flex-direction</code> 是 <code>row</code>，那么主轴的起始线是左边，终止线是右边。</p><h3 id="flex-容器和-flex-项目" tabindex="-1">Flex 容器和 Flex 项目 <a class="header-anchor" href="#flex-容器和-flex-项目" aria-label="Permalink to &quot;Flex 容器和 Flex 项目&quot;">​</a></h3><p>采用 Flex 布局的元素，称为 Flex 容器（flex container）</p><p>所有子元素自动成为容器成员，称为 Flex 项目（flex item）</p><h2 id="创建-flex-容器" tabindex="-1">创建 Flex 容器 <a class="header-anchor" href="#创建-flex-容器" aria-label="Permalink to &quot;创建 Flex 容器&quot;">​</a></h2><p>创建 flex 容器， 我们把一个容器的 <code>display</code> 属性值改为 <code>flex</code> 或者 <code>inline-flex</code>。</p><ul><li>flex：生成块级的 Flex 容器</li><li>inline-flex：生成内联级的 Flex 容器</li></ul><p>创建了一个 Flex 容器，就会建立一个新的 <strong>Flex 格式化上下文</strong>，这与建立块格式化上下文类似，只是使用 flex 布局而不是块布局。<strong>所以浮动不会侵入 Flex 容器，并且 Flex 容器的外边距不会发生折叠</strong></p><p>Flex 容器不是块容器，因此在设计时假设块布局的某些属性不适用于 flex 布局的上下文。尤其：</p><ul><li><code>float</code>和 <code>clear</code>：不会创建 Flex 项目的浮动或清除，并且不会使其脱离流动。也就是这两个属性将对 Flex 项目不会有有效</li><li><code>vertical-align</code>：对 Flex 项目没有作用</li><li><code>::first-line</code> 和 <code>::first-letter</code> 伪元素不适用于 flex 容器</li></ul><h2 id="flex-容器的属性" tabindex="-1">Flex 容器的属性 <a class="header-anchor" href="#flex-容器的属性" aria-label="Permalink to &quot;Flex 容器的属性&quot;">​</a></h2><p>以下 6 个属性设置在容器上。</p><ul><li>flex-direction：设置主轴</li><li>flex-wrap：设置是否换行</li><li>flex-flow：<code>flex-direction</code>属性和<code>flex-wrap</code>属性的简写形式</li><li>justify-content：项目在主轴对齐方式</li><li>align-items：项目在交叉轴对齐方式</li><li>align-content：“多条主轴”在交叉轴的对齐方式</li></ul><h3 id="flex-direction-设置主轴方向" tabindex="-1">flex-direction 设置主轴方向 <a class="header-anchor" href="#flex-direction-设置主轴方向" aria-label="Permalink to &quot;flex-direction 设置主轴方向&quot;">​</a></h3><p><strong>语法</strong>：<code>flex-direction：row | row-reverse | column | column-reverse</code></p><p><strong>取值</strong>：</p><ul><li><code>row</code>（默认值）：主轴为水平方向，起点在左端。</li><li><code>row-reverse</code>：主轴为水平方向，起点在右端。</li><li><code>column</code>：主轴为垂直方向，起点在上沿。</li><li><code>column-reverse</code>：主轴为垂直方向，起点在下沿。</li></ul><p><img src="'+a+'" alt="flex-direction" loading="lazy"></p><div class="warning custom-block"><p class="custom-block-title">注意</p><p>值 <code>row</code> 和 <code>row-reverse</code> 受 flex 容器的方向性的影响。 如果它的 dir 属性是 ltr，row 表示从左到右定向的水平轴，而 row-reverse 表示从右到左; 如果 dir 属性是 rtl，row 表示从右到左定向的轴，而 row-reverse 表示从左到右。</p></div><h3 id="flex-wrap-设置是否换行" tabindex="-1">flex-wrap 设置是否换行 <a class="header-anchor" href="#flex-wrap-设置是否换行" aria-label="Permalink to &quot;flex-wrap 设置是否换行&quot;">​</a></h3><p><strong>语法</strong>：<code>flex-wrap: nowrap | wrap | wrap-reverse</code></p><p><strong>取值</strong>：</p><ul><li><code>nowrap</code>（默认）：不换行。</li><li><code>wrap</code>：换行，第一行在上方。</li><li><code>wrap-reverse</code>：换行，第一行在下方。</li></ul><p><img src="'+t+'" alt="flex-wrap" loading="lazy"></p><h3 id="flex-flow-属性简写" tabindex="-1">flex-flow 属性简写 <a class="header-anchor" href="#flex-flow-属性简写" aria-label="Permalink to &quot;flex-flow 属性简写&quot;">​</a></h3><p><code>flex-flow</code>属性是<code>flex-direction</code>属性和<code>flex-wrap</code>属性的简写形式，默认值为<code>row nowrap</code>。</p><p><strong>语法</strong>：<code>flex-flow: &lt;flex-direction&gt; || &lt;flex-wrap&gt;</code></p><h3 id="justify-content-项目在主轴对齐方式" tabindex="-1">justify-content 项目在主轴对齐方式 <a class="header-anchor" href="#justify-content-项目在主轴对齐方式" aria-label="Permalink to &quot;justify-content 项目在主轴对齐方式&quot;">​</a></h3><p><strong>语法</strong>：<code>justify-content: flex-start | flex-end | center | space-between | space-around | ...</code></p><p><strong>取值</strong>：假设主轴为从左到右。</p><ul><li><code>flex-start</code>（默认值）：左对齐</li><li><code>flex-end</code>：右对齐</li><li><code>center</code>： 居中</li><li><code>space-between</code>：两端对齐，项目之间的间隔都相等。</li><li><code>space-around</code>：每个项目两侧的间隔相等。<strong>所以 Flex 项目之间的间隔比项目与边框的间隔大一倍</strong>。</li><li>在 <a href="https://www.w3.org/TR/css-align-3/" target="_blank" rel="noreferrer">CSS Box Alignment Level 3</a> 中新增的对齐特性(兼容性不佳)，，有些在 flexbox 中没有实现，可参考网格布局对齐属性行为《<a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Grid_Layout/Box_Alignment_in_CSS_Grid_Layout" target="_blank" rel="noreferrer">Box Alignment in Grid Layout</a>》</li></ul><p><img src="'+i+'" alt="justify-content" loading="lazy"></p><h3 id="align-items-项目在交叉轴对齐方式" tabindex="-1">align-items 项目在交叉轴对齐方式 <a class="header-anchor" href="#align-items-项目在交叉轴对齐方式" aria-label="Permalink to &quot;align-items 项目在交叉轴对齐方式&quot;">​</a></h3><p><strong>语法</strong>：<code>align-items: flex-start | flex-end | center | baseline | stretch</code></p><p><strong>取值</strong>：假设交叉轴从上到下。</p><ul><li><code>stretch</code>（默认值）：如果项目未设置高度或设为 auto，将占满整个容器的高度。</li><li><code>flex-start</code>（默认值）：交叉轴的起点对齐。</li><li><code>flex-end</code>：交叉轴的终点对齐。</li><li><code>center</code>： 交叉轴的中点对齐。</li><li><code>baseline</code>: 项目的第一行文字的基线对齐。</li><li>在 <a href="https://www.w3.org/TR/css-align-3/" target="_blank" rel="noreferrer">CSS Box Alignment Level 3</a> 中新增的对齐特性(兼容性不佳)，有些在 flexbox 中没有实现</li></ul><p><strong>注意</strong>：</p><ul><li><code>align-items</code> 是设置交叉轴上所有 Flex 项目的对齐方式，可通过 <code>align-self</code> 设置单个 Flex 项目的对齐</li><li>如果有多行(允许换行)，那么每行的对齐方式都受 <code>align-items</code> 控制</li></ul><p><img src="'+n+'" alt="justify-content" loading="lazy"></p><h3 id="align-content-多条主轴-在交叉轴的对齐方式" tabindex="-1">align-content “多条主轴”在交叉轴的对齐方式 <a class="header-anchor" href="#align-content-多条主轴-在交叉轴的对齐方式" aria-label="Permalink to &quot;align-content “多条主轴”在交叉轴的对齐方式&quot;">​</a></h3><p>定义了控制“多条主轴”的 flex 项目在交叉轴的对齐。<strong>如果项目只有一根轴线，该属性不起作用</strong>。</p><p><strong>语法</strong>：<code>align-items: flex-start | flex-end | center | baseline | stretch</code></p><p><strong>取值</strong>：</p><ul><li><code>stretch</code>（默认值）：轴线占满整个交叉轴。</li><li><code>flex-start</code>：与交叉轴的起点对齐。</li><li><code>flex-end</code>：与交叉轴的终点对齐。</li><li><code>center</code>：与交叉轴的中点对齐。</li><li><code>space-between</code>：与交叉轴两端对齐，轴线之间的间隔平均分布。</li><li><code>space-around</code>：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。</li><li>在 <a href="https://www.w3.org/TR/css-align-3/" target="_blank" rel="noreferrer">CSS Box Alignment Level 3</a> 中新增的对齐特性(兼容性不佳)，有些在 flexbox 中没有实现</li></ul><p><img src="'+c+'" alt="justify-content" loading="lazy"></p><h2 id="flex-项目的属性" tabindex="-1">Flex 项目的属性 <a class="header-anchor" href="#flex-项目的属性" aria-label="Permalink to &quot;Flex 项目的属性&quot;">​</a></h2><p>以下 6 个属性设置在容器上。</p><ul><li>flex-basic 项目的初始大小，根据这个属性，计算主轴是否有多余空间</li><li>flex-grow：项目的放大比例</li></ul><h3 id="flex-basic-项目的初始大小" tabindex="-1">flex-basic 项目的初始大小 <a class="header-anchor" href="#flex-basic-项目的初始大小" aria-label="Permalink to &quot;flex-basic 项目的初始大小&quot;">​</a></h3><p><strong>作用</strong>：指定 Flex 项目的初始大小，根据这个属性，计算主轴是否有多余空间</p><p><strong>取值</strong>：</p><ul><li>auto(默认值)：<strong>先检查 flex 子元素的主尺寸是否设置了绝对值再计算出 flex 子元素的初始值</strong>. 比如说你已经给你的 flex 子元素设置了 200px 的宽，则 200px 就是这个 flex 子元素的 <code>flex-basis</code>.</li><li><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/length" target="_blank" rel="noreferrer"><code>&lt;length&gt;</code></a>：与 <code>width</code> 属性设置值相同 <ul><li><code>0</code>：完全忽略 flex 子元素的尺寸，告诉 flexbox 所有空间都可以抢占，并按比例分享</li></ul></li><li>百分数：主轴尺寸的百分数</li><li>content：基于 flex 的元素的内容自动调整大小。兼容性很差</li></ul><div class="warning custom-block"><p class="custom-block-title">剩余空间的概念</p><p><strong>剩余空间是 flex 容器的大小减去所有 flex 项目的大小加起来的大小。所有就存在正负的区分：</strong></p><ul><li>正剩余空间(positive free space)：当 flex 子元素在主轴上的尺寸（大小）之和小于 flex 容器 的尺寸时， flex 容器中就会有多余的空间没有被填充， 这些空间就被叫做 <strong>positive free space</strong></li><li>负剩余空间(negative free space)当 flex 子元素在主轴上的尺寸之和大于 flex 容器的尺寸时， flex 容器的空间就不够用，此时 flex 子元素的尺寸之和减去 flex 容器的尺寸（flex 子元素溢出的尺寸）就是<strong>negative free space</strong></li></ul><p><code>flex-basic</code>：决定剩余空间是正剩余空间(positive free space)还是负剩余空间(negative free space)</p><p><code>flex-grow</code>：决定如何分配正剩余空间(positive free space)</p><p><code>flex-shrink</code>：决定如何分配负剩余空间(negative free space)</p></div><h3 id="flex-grow-项目的放大比例" tabindex="-1">flex-grow 项目的放大比例 <a class="header-anchor" href="#flex-grow-项目的放大比例" aria-label="Permalink to &quot;flex-grow 项目的放大比例&quot;">​</a></h3><p><strong>作用</strong>：指定 Flex 项目分配剩余空间的相对比例，前提是存在<strong>剩余空间</strong></p><p><strong>取值</strong>：</p><ul><li><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/number" target="_blank" rel="noreferrer"><code>number</code></a>：默认为 0。负值无效</li></ul><p><img src="'+s+'" alt="flex-grow" loading="lazy"></p><h3 id="flex-shrink-项目的缩小比例" tabindex="-1">flex-shrink 项目的缩小比例 <a class="header-anchor" href="#flex-shrink-项目的缩小比例" aria-label="Permalink to &quot;flex-shrink 项目的缩小比例&quot;">​</a></h3><p><strong>作用</strong>：Flex 项目的收缩规则。Flex 项目仅在默认宽度之和大于容器的时候才会发生收缩，其收缩的大小是依据 <code>flex-shrink</code> 的值。</p><p><strong>取值</strong>：</p><ul><li><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/number" target="_blank" rel="noreferrer"><code>number</code></a>：默认为 1。负值无效</li></ul><p>如果所有项目的<code>flex-shrink</code>属性都为 1，当空间不足时，都将等比例缩小。如果一个项目的<code>flex-shrink</code>属性为 0，其他项目都为 1，则空间不足时，前者不缩小。</p><p><img src="'+d+'" alt="flex-shrink" loading="lazy"></p><h3 id="flex-属性简写" tabindex="-1">flex 属性简写 <a class="header-anchor" href="#flex-属性简写" aria-label="Permalink to &quot;flex 属性简写&quot;">​</a></h3><p><strong>作用</strong>：<code>flex</code>属性是<code>flex-grow(放大比例)</code>, <code>flex-shrink(缩小比例)</code> 和 <code>flex-basis(初始大小)</code>的简写，默认值为<code>0 1 auto</code>。后两个属性可选。</p><p><strong>语法</strong>：<code>flex: auto | none | [ &lt;&#39;flex-grow&#39;&gt; &lt;&#39;flex-shrink&#39;&gt;? || &lt;&#39;flex-basis&#39;&gt; ]</code></p><p><strong>取值</strong>：</p><ul><li>auto：对应 <code>1 1 auto</code></li><li>none：对应 <code>0 0 auto</code></li><li><code>[ &lt;&#39;flex-grow&#39;&gt; &lt;&#39;flex-shrink&#39;&gt;? || &lt;&#39;flex-basis&#39;&gt; ]</code>：各个属性的取值</li></ul><h3 id="align-self-单个项目在交叉轴的对齐方式" tabindex="-1">align-self 单个项目在交叉轴的对齐方式 <a class="header-anchor" href="#align-self-单个项目在交叉轴的对齐方式" aria-label="Permalink to &quot;align-self 单个项目在交叉轴的对齐方式&quot;">​</a></h3><p><strong>作用</strong>：定义单个项目在交叉轴的对齐方式，会覆盖 <code>align-items</code> 的值</p><p><strong>取值</strong>：</p><ul><li>auto：设置为父元素的 <code>align-items</code> 值。</li><li>其他与 <a href="/wzb_knowledge_base/css/flexBox.html#align-items-项目在交叉轴对齐方式">align-items</a> 一致</li></ul><h3 id="order-项目的排列顺序" tabindex="-1">order 项目的排列顺序 <a class="header-anchor" href="#order-项目的排列顺序" aria-label="Permalink to &quot;order 项目的排列顺序&quot;">​</a></h3><p><strong>作用</strong>：定义项目的排列顺序。数值越小，排列越靠前，默认为 0。拥有相同 <code>order</code> 属性值的元素按照它们在源代码中出现的顺序进行布局。</p><p><strong>取值</strong>：</p><ul><li><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/integer" target="_blank" rel="noreferrer">&lt;integer&gt;</a>：整数，默认为 0</li></ul><p><strong>注意</strong>：<code>order</code> 仅仅对元素的视觉顺序 (<strong>visual order</strong>) 产生作用，并不会影响元素的逻辑或 tab 顺序。</p><p><img src="'+f+'" alt="order" loading="lazy"></p><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><ul><li><p><a href="https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html" target="_blank" rel="noreferrer">阮一峰-Flex 布局教程：语法篇</a></p></li><li><p><a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox" target="_blank" rel="noreferrer">MDN-flexbox 指南</a></p></li><li><p><a href="https://drafts.csswg.org/css-flexbox-1/" target="_blank" rel="noreferrer">CSS Flexible Box Layout Module Level 1</a></p></li></ul>',94),g=[p];function h(u,b,m,_,w,k){return o(),l("div",null,g)}const F=e(x,[["render",h]]);export{v as __pageData,F as default};
