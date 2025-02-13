import{_ as s,c as i,o as a,aR as e,bI as n}from"./chunks/framework.DLAwTCsc.js";const u=JSON.parse('{"title":"DOM 事件","description":"","frontmatter":{},"headers":[],"relativePath":"js/event.md","filePath":"01_前端/03_js/13_DOM_事件.md","lastUpdated":1739447932000}'),l={name:"js/event.md"},t=e('<h1 id="dom-事件" tabindex="-1">DOM 事件 <a class="header-anchor" href="#dom-事件" aria-label="Permalink to &quot;DOM 事件&quot;">​</a></h1><p><strong>事件就是文档或浏览器窗口中发生的一些特定的交互瞬间</strong>。在传统软件工程领域，这个模型叫“观察者模式”，其能够做到页面行为（在 JavaScript 中定义）与页面展示（在 HTML 和 CSS 中定义）的分离。</p><p><strong>我们通过事件机制从而在页面的特定时机(图片加载完成、点击等等)执行一些逻辑，通过事件对象获取事件发生时的一些信息。</strong></p><div class="warning custom-block"><p class="custom-block-title">注意</p><p>事件不仅限于 DOM，但这里关注的就是 浏览器 中的事件</p></div><h2 id="dom-事件流" tabindex="-1">DOM 事件流 <a class="header-anchor" href="#dom-事件流" aria-label="Permalink to &quot;DOM 事件流&quot;">​</a></h2><p><img src="'+n+`" alt="image-20211213112144066" loading="lazy"></p><p>事件流描述了页面接收事件的顺序，DOM2 Events 规范规定事件流分为 3 个阶段：</p><ol><li><p>捕获阶段（Capturing phase）—— 事件（从 Window）向下走近元素。</p><p>在捕获阶段可以用来实现截获事件。</p></li><li><p>目标阶段（Target phase）—— 事件到达目标元素。</p><div class="tip custom-block"><p class="custom-block-title">提示</p><p>虽然规范上存在”目标阶段“，但是实际上浏览器都没有单独处理这一阶段，捕获阶段和冒泡阶段都会在这一阶段被触发</p></div></li><li><p>冒泡阶段（Bubbling phase）—— 事件从元素上开始冒泡。</p></li></ol><div class="warning custom-block"><p class="custom-block-title">事件的传播路径</p><p>一旦事件确定了<strong>传播路径</strong>，就会按照顺序执行上述阶段，如果不支持某个阶段，或者事件对象的传播已停止，则将跳过该阶段。</p><p><strong>例如某个元素的 bubbles 属性为 false，则将跳过冒泡阶段。如果调用了 stopPropagation 方法则跳过后续所有阶段</strong></p></div><h2 id="事件处理程序" tabindex="-1">事件处理程序 <a class="header-anchor" href="#事件处理程序" aria-label="Permalink to &quot;事件处理程序&quot;">​</a></h2><p>事件处理程序(事件监听器)就是用来响应事件的函数，用来注册事件处理程序主要有如下方法：</p><ul><li><p>HTML 事件处理程序：使用事件处理程序的名字以 HTML 属性的形式来指定。</p><div class="language-html vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">input</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;button&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> value</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Click Me&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onclick</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">console</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">(&#39;Clicked&#39;)&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div></li><li><p>DOM0 事件处理程序：把一个函数赋值给（DOM 元素的）一个事件处理程序属性。</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> btn </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getElementById</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;myBtn&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">btn.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">onclick</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;Clicked&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">btn.onclick </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 移除事件处理程序</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div></li><li><p>DOM2 事件处理程序：通过 <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener" target="_blank" rel="noreferrer">addEventListener()</a> 添加事件，<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/removeEventListener" target="_blank" rel="noreferrer">removeEventListener()</a> 移除事件</p></li></ul><div class="warning custom-block"><p class="custom-block-title">对于某些事件，只能通过 addEventListener 设置处理程序</p><p>有些事件无法通过 DOM 属性进行分配。只能使用 <code>addEventListener</code>。所以 <code>addEventListener</code> 更通用。虽然这样的事件是特例而不是规则。</p><p>例如，<code>DOMContentLoaded</code> 事件，该事件在文档加载完成并且 DOM 构建完成时触发。</p><div class="language-javascript vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 永远不会运行</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">onDOMContentLoaded</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  alert</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;DOM built&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 这种方式可以运行</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addEventListener</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;DOMContentLoaded&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> () {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  alert</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;DOM built&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div></div><h2 id="事件对象" tabindex="-1">事件对象 <a class="header-anchor" href="#事件对象" aria-label="Permalink to &quot;事件对象&quot;">​</a></h2><p>在 DOM 中发生事件时，所有相关信息都会被收集并存储在一个名为 event 的对象中并传递给事件处理程序</p><p>以下为常用的并且在所有事件中都支持的：都是只读属性，<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Event" target="_blank" rel="noreferrer">具体见 MDN</a></p><ul><li>currentTarget：当前事件处理程序所在的元素</li><li>target：事件目标</li><li>type：被触发的事件类型</li><li>bubbles：表示事件是否冒泡</li><li>stopPropagation()： 用于取消所有后续事件捕获或事件冒泡。只有 bubbles 为 true 才可以调用这个方法</li><li>stopImmediatePropagation()：用于取消所有后续事件捕获或事件冒泡，并阻止调用任何后续事件处理程序（DOM3 Events 中新增）</li><li>cancelable：表示是否可以取消事件的默认行为</li><li>defaultPrevented：true 表示已经调用 preventDefault()方法（DOM3Events 中新增）</li><li>preventDefault()：用于取消事件的默认行为。只有 cancelable 为 true 才可以调用这个方法</li><li>trusted：true 表示事件是由浏览器生成的。false 表示事件是开发者通过 JavaScript 创建的（DOM3 Events 中新增）</li></ul><h3 id="取消冒泡或捕获" tabindex="-1">取消冒泡或捕获 <a class="header-anchor" href="#取消冒泡或捕获" aria-label="Permalink to &quot;取消冒泡或捕获&quot;">​</a></h3><p>事件对象的 stopPropagation() 方法用于取消所有后续事件捕获或事件冒泡。只有 bubbles 为 true 才可以调用这个方法。<strong>具体是取消冒泡还是捕获要看注册事件的类型</strong></p><div class="warning custom-block"><p class="custom-block-title">注意</p><ol><li><p>几乎所有事件都会冒泡。事件对象为 false 则不会冒泡例如，<code>focus</code> 事件不会冒泡。但这仍然是例外，而不是规则，大多数事件的确都是冒泡的。<strong>但是还是在父元素上注册捕获的事件程序</strong></p></li><li><p>注册捕获的事件一般用来拦截子元素的事件，一般情况下不建议使用</p></li><li><p>event.stopImmediatePropagation()：如果一个元素在一个事件上有多个处理程序，即使其中一个停止冒泡，其他处理程序仍会执行。换句话说，<code>event.stopPropagation()</code> 停止向上移动，但是当前元素上的其他处理程序都会继续运行。有一个 <code>event.stopImmediatePropagation()</code> 方法，可以用于停止冒泡，并阻止当前元素上的处理程序运行。使用该方法之后，其他处理程序就不会被执行。</p></li></ol></div><h3 id="阻止浏览器默认行为" tabindex="-1">阻止浏览器默认行为 <a class="header-anchor" href="#阻止浏览器默认行为" aria-label="Permalink to &quot;阻止浏览器默认行为&quot;">​</a></h3><p>许多事件会自动触发浏览器的默认行为；</p><ul><li>点击一个链接 —— 触发导航（navigation）到该 URL。</li><li>点击表单的提交按钮 —— 触发提交到服务器的行为。</li><li>在文本上按下鼠标按钮并移动 —— 选中文本。</li></ul><p>有两种方式来阻止浏览器的默认行为：</p><ul><li>如果处理程序是使用 <code>on&lt;event&gt;</code>（而不是 <code>addEventListener</code>）分配的，那返回 <code>false</code> 也同样有效。</li><li>主流的方式是使用 <code>event</code> 对象。有一个 <code>event.preventDefault()</code> 方法。</li></ul><h4 id="不是所有的事件都可以阻止" tabindex="-1">不是所有的事件都可以阻止 <a class="header-anchor" href="#不是所有的事件都可以阻止" aria-label="Permalink to &quot;不是所有的事件都可以阻止&quot;">​</a></h4><p>事件对象的 <strong>cancelable</strong> 属性表示是否可以取消事件的默认行为</p><div class="tip custom-block"><p class="custom-block-title">测试</p><p>点击按钮为 window 添加滚动事件，滚动页面，页面是无法被阻止滚动的</p></div><h4 id="后续事件" tabindex="-1"><strong>后续事件</strong> <a class="header-anchor" href="#后续事件" aria-label="Permalink to &quot;**后续事件**&quot;">​</a></h4><p><strong>某些事件</strong>会相互转化。如果我们阻止了第一个事件，那就没有第二个事件了。</p><p>例如，在 <code>&lt;input&gt;</code> 字段上的 <code>mousedown</code> 会导致在其中获得焦点，以及 <code>focus</code> 事件。如果我们阻止 <code>mousedown</code> 事件，在这就没有焦点了。</p><div class="tip custom-block"><p class="custom-block-title">测试</p></div><div class="warning custom-block"><p class="custom-block-title">注意</p><p>只有一些事件会存在这种关系</p></div><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><ul><li><p>书籍 - JavaScript 高程</p></li><li><p><a href="https://www.w3.org/TR/uievents" target="_blank" rel="noreferrer">W3C-DOM 事件</a></p></li><li><p><a href="https://zh.javascript.info/events" target="_blank" rel="noreferrer">JS 教程-事件简介</a></p></li><li><p><a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Event" target="_blank" rel="noreferrer">MDN-Event 接口</a></p></li><li><p><a href="https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget" target="_blank" rel="noreferrer">MDN-EventTarget</a></p></li></ul>`,35),p=[t];function r(h,o,d,k,c,E){return a(),i("div",null,p)}const b=s(l,[["render",r]]);export{u as __pageData,b as default};
