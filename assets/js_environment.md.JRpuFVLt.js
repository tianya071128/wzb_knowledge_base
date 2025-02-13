import{_ as a,c as t,o as e,aR as r,bs as i,bt as o,bu as l,bv as s}from"./chunks/framework.DLAwTCsc.js";const V=JSON.parse('{"title":"运行时环境","description":"","frontmatter":{},"headers":[],"relativePath":"js/environment.md","filePath":"01_前端/03_js/06_V8编译-运行时环境.md","lastUpdated":1739447932000}'),n={name:"js/environment.md"},p=r('<h1 id="运行时环境" tabindex="-1">运行时环境 <a class="header-anchor" href="#运行时环境" aria-label="Permalink to &quot;运行时环境&quot;">​</a></h1><p>V8 执行一段代码过程大致如下：</p><p><img src="'+i+'" alt="img" loading="lazy"></p><p>在执行 JS 脚本之前，V8 引擎就准备好了代码的运行时环境，这个环境包括堆空间和栈空间、全局执行上下文、全局作用域、内置的内建函数、宿主环境提供的扩展函数和对象，还有消息循环系统。</p><p><img src="'+o+'" alt="img" loading="lazy"></p><h2 id="宿主环境" tabindex="-1">宿主环境 <a class="header-anchor" href="#宿主环境" aria-label="Permalink to &quot;宿主环境&quot;">​</a></h2><p>V8 引擎的核心是实现 ECMAScript 标准，V8 只提供了 ECMAScript 定义的一些对象和一些核心的函数，这包括了 Object、Function、String。除此之外，V8 还提供了垃圾回收器、协程等基础内容，不过这些功能依然需要宿主环境的配合才能完整执行。</p><p>浏览器为 V8 提供基础的消息循环系统、全局变量、Web API 等。</p><p>浏览器是 V8 引擎其中一个重要的宿主，但还有其他的宿主环境，如 Node。。。</p><p><img src="'+l+'" alt="img" loading="lazy"></p><h2 id="堆空间和栈空间" tabindex="-1">堆空间和栈空间 <a class="header-anchor" href="#堆空间和栈空间" aria-label="Permalink to &quot;堆空间和栈空间&quot;">​</a></h2><p><strong>由于 V8 是寄生在浏览器或者 Node.js 这些宿主中的，因此，V8 也是被这些宿主启动的。比如，在 Chrome 中，只要打开一个渲染进程，渲染进程便会初始化 V8，同时初始化堆空间和栈空间。</strong></p><ul><li>栈空间：最大的特点是空间连续，所以在栈中每个元素的地址都是固定的，因此栈空间的查找效率非常高。但是大小一般比较小。<strong>主要是用来管理 JS 函数调用的，是一个 “先进后出” 的栈结构，用来存放设计到上下文相关内容：大部分简单数据类型、引用对象地址、this 值、函数的执行状态等等</strong></li><li>堆空间：是一种树形的存储结构，用来存储对象类型的离散的数据</li></ul><h2 id="全局上下文和全局作用域" tabindex="-1">全局上下文和全局作用域 <a class="header-anchor" href="#全局上下文和全局作用域" aria-label="Permalink to &quot;全局上下文和全局作用域&quot;">​</a></h2><p>执行上下文：主要包含三部分，变量环境、词法环境和 this 关键字</p><ul><li><p>变量环境（变量对象）：全局上下文包括了 window 对象、还有一些 Web API 函数等等。函数的上下文会初始化实参、arguments 等初始变量</p></li><li><p>词法环境：就是一个能够表示标识符在源代码（词法）中的位置的环境, 包含了使用 let、const 等变量的内容</p><div class="warning custom-block"><p class="custom-block-title">词法环境</p><p>可以简单理解为在词法环境中存在一个栈结构，管理着 let、const 等声明的变量，当进入一个块级的时候，入栈，执行完一个块级的时候，出栈</p><p><a href="https://time.geekbang.org/column/article/126339" target="_blank" rel="noreferrer">极客-块级作用域：var 缺陷以及为什么要引入 let 和 const？</a></p></div></li><li><p>this 关键字：全局默认上下文默认指向 window 的 this 关键字（严格模式指向 undefined）。</p></li></ul><p><img src="'+s+'" alt="img" loading="lazy"></p><p>作用域：作用域是一套规则，这套规则用来管理引擎如何在当前作用域以及嵌套的子作用域中根据标识符名称进行变量查找。</p><div class="warning custom-block"><p class="custom-block-title">注意</p><p>全局执行上下文在 V8 的生存周期内是不会被销毁的，它会一直保存在堆中，这样当下次在需要使用函数或者全局变量时，就不需要重新创建了。</p></div><h2 id="事件循环系统" tabindex="-1">事件循环系统 <a class="header-anchor" href="#事件循环系统" aria-label="Permalink to &quot;事件循环系统&quot;">​</a></h2><p>V8 是寄生在宿主环境中的，它并没有自己的主线程，而是使用宿主所提供的主线程，V8 所执行的代码都是在宿主的主线程上执行的。</p><p>在启动 V8 之前，就会创建一个事件循环系统用于执行大量的任务，<strong>因为所有的任务都是运行在主线程的，在浏览器的页面中，V8 会和页面共用主线程，共用消息队列，所以如果 V8 执行一个函数过久，会影响到浏览器页面的交互性能。</strong></p><p>如果消息队列中没有了任务，就会将主线程挂起，一旦有新的任务到达了消息队列，那么系统会将这个挂起的线程激活，激活之后线程继续向下执行</p><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><p><a href="https://time.geekbang.org/column/article/219066" target="_blank" rel="noreferrer">极客-运行时环境：运行 JavaScript 代码的基石</a></p><p><a href="https://juejin.cn/post/6844903682283143181#heading-9" target="_blank" rel="noreferrer">掘金-[译] 理解 JavaScript 中的执行上下文和执行栈</a></p>',26),c=[p];function _(d,h,m,g,u,b){return e(),t("div",null,c)}const k=a(n,[["render",_]]);export{V as __pageData,k as default};
