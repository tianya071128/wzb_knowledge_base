import{_ as s,c as i,o as a,aR as n,bw as l,bx as e}from"./chunks/framework.DLAwTCsc.js";const u=JSON.parse('{"title":"JS 执行机制-执行上下文","description":"","frontmatter":{},"headers":[],"relativePath":"js/executionContext.md","filePath":"01_前端/03_js/07_JS执行机制-执行上下文.md","lastUpdated":1739447932000}'),t={name:"js/executionContext.md"},p=n('<h1 id="js-执行机制-执行上下文" tabindex="-1">JS 执行机制-执行上下文 <a class="header-anchor" href="#js-执行机制-执行上下文" aria-label="Permalink to &quot;JS 执行机制-执行上下文&quot;">​</a></h1><p>执行上下文是 JS 执行一段代码时的运行环境，也可称为“执行环境”。</p><p>当一段代码被执行时，JS 引擎先会对其进行编译，并创建执行上下文推入到调用栈的栈顶。</p><h2 id="执行上下文的类型" tabindex="-1">执行上下文的类型 <a class="header-anchor" href="#执行上下文的类型" aria-label="Permalink to &quot;执行上下文的类型&quot;">​</a></h2><p>一般来说，以下三种情况会创建执行上下文：</p><ul><li>全局执行上下文：JS 引擎在执行全局代码时，会先编译全局代码并创建全局执行上下文，而且在整个页面生命周期，只会存在一份并且一直在调用栈的栈底。</li><li>函数执行上下文：在函数定义时，不会进行代码的编译，但是<strong>在函数调用时，就会对函数体代码进行编译并创建函数的执行上下文</strong>，推入到调用栈的栈顶，当函数执行结束时，函数上下文从栈顶弹出，<a href="/wzb_knowledge_base/js/recovery.html#栈空间-调用栈-的垃圾回收">然后会被销毁</a>。</li><li>eval 函数执行上下文：当使用 eval 函数的时候，eval 的代码也会被编译，并创建执行上下文。</li></ul><h2 id="执行上下文的内容" tabindex="-1">执行上下文的内容 <a class="header-anchor" href="#执行上下文的内容" aria-label="Permalink to &quot;执行上下文的内容&quot;">​</a></h2><p>执行上下文在 ES3 和 ES5 中有一些区别</p><h3 id="es3-执行上下文" tabindex="-1">ES3 执行上下文 <a class="header-anchor" href="#es3-执行上下文" aria-label="Permalink to &quot;ES3 执行上下文&quot;">​</a></h3><p>在 ES3 中，执行上下文的内容：</p><ul><li><p>变量对象（variable object 简称 VO）</p><p>JS 引擎会用当前函数的<strong>参数列表</strong>（<code>arguments</code>）初始化一个 “变量对象”，函数代码块中声明的 <strong>变量</strong> 和 <strong>函数</strong> 将作为属性添加到这个变量对象上。</p><div class="warning custom-block"><p class="custom-block-title">注意</p><ol><li><strong>全局上下文中的变量对象就是全局对象</strong>，以浏览器环境来说，就是 <code>window</code> 对象。</li><li><strong>函数执行上下文中的变量对象内部定义的属性</strong>，是不能被直接访问的，只有当函数被调用时，变量对象（<code>VO</code>）被激活为活动对象（<code>AO</code>）时，我们才能访问到其中的属性和方法。</li></ol><p><img src="'+l+`" alt="变量对象的创建细节" loading="lazy"></p></div></li><li><p>活动对象（activation object 简称 AO）</p><p>函数进入执行阶段时，原本不能访问的变量对象被激活成为一个活动对象，自此，我们可以访问到其中的各种属性。</p><div class="warning custom-block"><p class="custom-block-title">注意</p><p>其实变量对象和活动对象是一个东西，只不过处于不同的状态和阶段而已。</p></div></li><li><p>作用域链（scope chain）</p><p>规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。<strong>函数在创建时，函数对象上就会生成一个 <code>[[Scopes]]</code> 内部属性，当函数执行时，会创建一个执行环境，然后通过复制函数的 <code>[[scope]]</code> 属性中的对象构建起执行环境的作用域链，然后，变量对象 <code>VO</code> 被激活生成 <code>AO</code> 并添加到作用域链的前端，完整作用域链创建完成</strong></p></li><li><p>this</p></li></ul><p>ES3 的执行上下文用代码表示类似于如下：</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">executionContext：{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    [variable object </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> activation object]：{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        arguments</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        variables</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">],</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        funcions</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: [</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    scope </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">chain</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: variable object </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> all parents scopes</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    thisValue</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: context object</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h3 id="es5-执行上下文" tabindex="-1">ES5 执行上下文 <a class="header-anchor" href="#es5-执行上下文" aria-label="Permalink to &quot;ES5 执行上下文&quot;">​</a></h3><p>ES5 的执行上下文做了部分调整，最主要的是去除了变量对象和活动对象，以 <strong>词法环境组件（</strong> <strong><code>LexicalEnvironment component</code>）</strong> 和 <strong>变量环境组件（</strong> <strong><code>VariableEnvironment component</code>）</strong> 替代。</p><p>以代码模拟如下：</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ExecutionContext </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  ThisBinding </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">this</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> value</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;, // this</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  LexicalEnvironment = { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }, // 词法环境 - 包含着作用域组件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  VariableEnvironment = { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }, // 变量环境</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><ul><li><p><strong>词法环境组件（</strong> <strong><code>LexicalEnvironment component</code>）</strong></p><p><a href="https://link.juejin.cn/?target=http%3A%2F%2Fecma-international.org%2Fecma-262%2F6.0%2F" target="_blank" rel="noreferrer">ES6 官方</a> 中的词法环境定义：</p><blockquote><p>词法环境是一种规范类型，基于 ECMAScript 代码的词法嵌套结构来定义标识符和具体变量和函数的关联。一个词法环境由环境记录器和一个可能的引用外部词法环境的空值组成。</p></blockquote><p>可以简单理解为 ES3 中的变量对象和作用域链的</p></li><li><p>变量环境</p><p><strong>变量环境</strong> 也是一个 <strong>词法环境</strong>，与词法环境不同的是前者是被用来存储函数声明和变量（<code>let</code> 和 <code>const</code>）绑定，而后者只用来存储 <code>var</code> 变量绑定。</p></li></ul><p>上面详细可见：<a href="https://juejin.cn/post/6844903682283143181#heading-7" target="_blank" rel="noreferrer">掘金-文章</a></p><h2 id="执行上下文的生命周期" tabindex="-1">执行上下文的生命周期 <a class="header-anchor" href="#执行上下文的生命周期" aria-label="Permalink to &quot;执行上下文的生命周期&quot;">​</a></h2><p>主要经历三个阶段：创建阶段、执行阶段、销毁阶段。</p><p>对于 <code>ES5</code> 中的执行上下文（ES3 类似），我们可以用下面这个列表来概括程序执行的整个过程：</p><ol><li>程序启动，全局上下文被创建 <ol><li>创建全局上下文的 <strong>词法环境</strong><ol><li>创建 <strong>对象环境记录器</strong> ，它用来定义出现在 <strong>全局上下文</strong> 中的变量和函数的关系（负责处理 <code>let</code> 和 <code>const</code> 定义的变量）</li><li>创建 <strong>外部环境引用</strong>，值为 <strong><code>null</code></strong></li></ol></li><li>创建全局上下文的 <strong>变量环境</strong><ol><li>创建 <strong>对象环境记录器</strong>，它持有 <strong>变量声明语句</strong> 在执行上下文中创建的绑定关系（负责处理 <code>var</code> 定义的变量，初始值为 <code>undefined</code> 造成声明提升）</li><li>创建 <strong>外部环境引用</strong>，值为 <strong><code>null</code></strong></li></ol></li><li>确定 <code>this</code> 值为全局对象（以浏览器为例，就是 <code>window</code> ）</li></ol></li><li>函数被调用，函数上下文被创建 <ol><li>创建函数上下文的 <strong>词法环境</strong><ol><li>创建 <strong>声明式环境记录器</strong> ，存储变量、函数和参数，它包含了一个传递给函数的 <strong><code>arguments</code></strong> 对象（此对象存储索引和参数的映射）和传递给函数的参数的 <strong>length</strong>。（负责处理 <code>let</code> 和 <code>const</code> 定义的变量）</li><li>创建 <strong>外部环境引用</strong>，值为全局对象，或者为父级词法环境（作用域）</li></ol></li><li>创建函数上下文的 <strong>变量环境</strong><ol><li>创建 <strong>声明式环境记录器</strong> ，存储变量、函数和参数，它包含了一个传递给函数的 <strong><code>arguments</code></strong> 对象（此对象存储索引和参数的映射）和传递给函数的参数的 <strong>length</strong>。（负责处理 <code>var</code> 定义的变量，初始值为 <code>undefined</code> 造成声明提升）</li><li>创建 <strong>外部环境引用</strong>，值为全局对象，或者为父级词法环境（作用域）</li></ol></li><li>确定 <code>this</code> 值</li></ol></li><li>进入函数执行上下文的执行阶段： <ol><li>将执行上下文推入调用栈中</li><li>在上下文中运行/解释函数代码，并在代码逐行执行时分配变量值。</li><li>如果内部有函数调用就创建一个新的执行上下文压入执行栈并把控制权交出……</li></ol></li><li>函数执行完成，<a href="/wzb_knowledge_base/js/recovery.html#栈空间-调用栈-的垃圾回收">会被弹出执行上下文栈并且销毁</a>，控制权被重新交给执行栈上一层的执行上下文。</li></ol><h2 id="调用栈-执行上下文栈" tabindex="-1">调用栈（执行上下文栈） <a class="header-anchor" href="#调用栈-执行上下文栈" aria-label="Permalink to &quot;调用栈（执行上下文栈）&quot;">​</a></h2><p>在存在嵌套函数调用时，就会存在多个执行上下文，JS 引擎<strong>通过栈的数据结构来管理的</strong>。</p><p>在执行上下文创建好后，JS 引擎会将执行上下文压入栈中，这种用来管理执行上下文的栈称为<strong>执行上下文栈</strong>，又称<strong>调用栈</strong>。</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> a </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> add</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">b</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">c</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> b </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> c;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> addAll</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">b</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">c</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  var</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> d </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 10</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  result </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> add</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(b, c);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> a </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> result </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">+</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> d;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">addAll</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">6</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>第一步：创建全局上下文，并压入栈底（如果已经存在，则不会重复创建），接着顺序执行代码。</p><p>第二步：遇到函数 addAll 调用。<strong>当遇到函数调用时，JS 引擎会编译该函数，并为其创建一个执行上下文，将其压入调用栈栈顶</strong>，接着顺序执行代码</p><p>第三步：当执行到 add 函数调用语句时，同样会为其创建执行上下文，并将其压入调用栈。当 add 函数执行完毕，就会将该函数的执行上下文从栈顶弹出，如下图所示：</p><p><img src="`+e+'" alt="image-20211125092346199" loading="lazy"></p><p>第四步：addAll 函数执行完成后，也将 addAll 的执行上下文从栈顶弹出，此时调用栈中只剩下全局上下文了。</p><div class="warning custom-block"><p class="custom-block-title">注意</p><p><strong>调用栈是 JS 引擎追踪函数执行的一个机制，通过调用栈就能够追踪到哪个函数正在被执行以及各函数之间的调用关系。</strong></p><p>调用栈只是函数调用之间的关系，<strong>而不是作用域链</strong>，不要将其混为一谈</p></div><h3 id="浏览器中查看调用栈" tabindex="-1">浏览器中查看调用栈 <a class="header-anchor" href="#浏览器中查看调用栈" aria-label="Permalink to &quot;浏览器中查看调用栈&quot;">​</a></h3><ul><li>可以通过断点形式查看函数的调用栈</li><li>通过 <code>console.trace()</code> 输出当前函数的调用栈</li></ul><h3 id="栈溢出" tabindex="-1">栈溢出 <a class="header-anchor" href="#栈溢出" aria-label="Permalink to &quot;栈溢出&quot;">​</a></h3><p>调用栈是有大小的，当入栈的执行上下文超过一定数目，JavaScript 引擎就会报错，我们把这种错误叫做栈溢出。</p><h3 id="尾递归优化" tabindex="-1">尾递归优化 <a class="header-anchor" href="#尾递归优化" aria-label="Permalink to &quot;尾递归优化&quot;">​</a></h3><p>尾调用之所以与其他调用不同，就在于它的特殊的调用位置。尾调用由于是函数的最后一步操作，所以不需要保留外层函数的相关信息，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用记录，取代外层函数的调用记录就可以了，这样一来，运行尾递归函数时，执行栈永远只会新增一个上下文。</p><p>但是目前没有浏览器实现，<a href="https://juejin.cn/post/6844904158957404167#heading-19" target="_blank" rel="noreferrer">具体查看</a></p><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><ul><li><a href="https://juejin.cn/post/6844904158957404167" target="_blank" rel="noreferrer">掘金-面试官：说说执行上下文吧</a></li><li><a href="https://juejin.cn/post/6844903682283143181" target="_blank" rel="noreferrer">掘金-[译] 理解 JavaScript 中的执行上下文和执行栈</a></li><li><a href="https://time.geekbang.org/column/article/120257" target="_blank" rel="noreferrer">极客-调用栈</a></li></ul>',42),r=[p];function h(o,k,d,c,g,E){return a(),i("div",null,r)}const y=s(t,[["render",h]]);export{u as __pageData,y as default};
