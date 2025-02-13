import{_ as s,c as i,o as a,aR as n}from"./chunks/framework.DLAwTCsc.js";const y=JSON.parse('{"title":"获取表单元素数据","description":"","frontmatter":{},"headers":[],"relativePath":"html/form_data.md","filePath":"01_前端/01_html/08_form_data.md","lastUpdated":1739447932000}'),l={name:"html/form_data.md"},p=n(`<h1 id="获取表单元素数据" tabindex="-1">获取表单元素数据 <a class="header-anchor" href="#获取表单元素数据" aria-label="Permalink to &quot;获取表单元素数据&quot;">​</a></h1><h2 id="表单控件获取值" tabindex="-1">表单控件获取值 <a class="header-anchor" href="#表单控件获取值" aria-label="Permalink to &quot;表单控件获取值&quot;">​</a></h2><p>每个表单都有一个 <code>elements</code> 属性，是该表单下所有表单元素的集合。 =&gt; 包含按钮表单元素，但不包括 <code>option</code> 元素</p><p>通过 <code>elements[name]</code> 可以访问表单字段，如果多个表单元素使用同一 <code>name</code>，那么 <code>elements[name]</code> 返回一个 <code>NodeList</code>，可以通过这种方式获取到表单元素。</p><h3 id="共有的表单字段" tabindex="-1">共有的表单字段 <a class="header-anchor" href="#共有的表单字段" aria-label="Permalink to &quot;共有的表单字段&quot;">​</a></h3><p>可以动态修改下列属性，来修改表单元素的行为。</p><ul><li><p>disabled：表示当前表单元素是否禁用。</p></li><li><p>form：指向当前表单元素所属的表单。</p></li><li><p>name：当前表单元素的名称。</p></li><li><p>readOnly：是否只读。</p></li><li><p>tabIndex：切换(tab)序号。</p></li><li><p>type：当前字段的类型。</p><p>这个属性可以用来判断字段的类型，主要有如下类型</p><ul><li><p>select-one：<code>&lt;select&gt;...&lt;/select&gt;</code> 单选下拉框</p></li><li><p>select-multiple：<code>&lt;select multiple&gt;...&lt;/select&gt;</code> 多选下拉框</p></li><li><p>submit：提交按钮</p><p>。。。</p></li></ul></li><li><p>value：当前字段提交的值。在文件控件中，该字段是只读的，包含着文件在计算机中的路径。</p></li></ul><h3 id="表单元素获取值" tabindex="-1">表单元素获取值 <a class="header-anchor" href="#表单元素获取值" aria-label="Permalink to &quot;表单元素获取值&quot;">​</a></h3><ul><li><p>下拉选择框：select</p><p>遍历 select 选择框的选项，<code>selectDOM.options</code> options 属性引用了所有选项。</p><p>通过 <code>optionDOM.selected</code> 判断是否选中了值。</p><p>如果 <code>optionDOM</code> 没有定义 <code>value</code> 属性的话，使用 option 元素之间的内容作为 <code>value</code></p><p>最后根据 <code>selectDOM.type</code> 属性区分单选或多选</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> field</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;表单元素&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 选择框，需要遍历每个选项 =&gt; 表单元素.options 引用着所有的选项</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> option</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> of</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> field.options) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 根据 option.selected 属性判断是否选中项</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (option.selected) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> optValue </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (option.hasAttribute) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      optValue </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> option.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">hasAttribute</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;value&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> option.value </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> option.text;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">else</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      optValue </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> option.attributes[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;value&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">].specified</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> option.value</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        :</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> option.text;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (field.type </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">===</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;select-one&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // 单选框</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">else</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // 多选框</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div></li><li><p>单选框：radio</p><p>单选框表单元素共用一个 <code>name</code>，所以通过 <code>formDOM.elements[name]</code> 返回的是一个 <code>NodeList</code></p><p>遍历 <code>NodeList</code>，就可以获取到单选框元素。</p><p>或者通过其他方法(例如：直接 DOM 操作)</p><p>获取到单选框元素后，判断 <code>checked</code> 属性是否为 true 来判断是否选中</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> field</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;表单元素&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 判断是否选中</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (field.checked) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(field.value); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 获取到表单元素值</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div></li><li><p>复选框：checkbox</p><p>与单选框类似，唯一区分是可以多选。所以要遍历全部，而单选框只要获取到一个选中的值，那么的单选框就不需要处理了。</p></li><li><p>文件控件：file</p><p>获取到文件控件元素后，其文件控件的 <code>files</code> 属性中存放着文件对象集合。</p><p>具体见 =&gt; 待完成</p></li><li><p>按钮：button、input:submit...</p><p>按钮是不需要获取值的，可以直接省略</p></li><li><p>其他控件</p><p>其他大部分控件，都是直接读取 <code>value</code> 值获取表单元素值即可。</p></li></ul><h2 id="点击按钮发送表单数据" tabindex="-1">点击按钮发送表单数据 <a class="header-anchor" href="#点击按钮发送表单数据" aria-label="Permalink to &quot;点击按钮发送表单数据&quot;">​</a></h2><p>通过设置 <code>form</code> 元素的 <code>action</code> 和 <code>method</code> 等属性，在点击提交按钮(input:submit、button:submit 等)时，自动发送 HTTP 到指定 URL。</p><div class="tip custom-block"><p class="custom-block-title">测试</p><p>点击提交按钮后，浏览器会自动根据表单控件的 name 组装参数发送请求。</p><p>并且只能发送 GET、POST 请求，编码方式主要是以下方式：</p><ul><li>application/x-www-form-urlencoded（默认值）</li><li>multipart/form-data（上传文件时需设置）</li><li>text/plain</li></ul><p><strong>综上，一般不采用此种方式，而是通过脚本来获取操作</strong></p></div><p>具体参考：<a href="https://developer.mozilla.org/zh-CN/docs/Learn/Forms/Sending_and_retrieving_form_data" target="_blank" rel="noreferrer">MDN</a></p><h2 id="通过-form-元素获取表单的数据" tabindex="-1">通过 form 元素获取表单的数据 <a class="header-anchor" href="#通过-form-元素获取表单的数据" aria-label="Permalink to &quot;通过 form 元素获取表单的数据&quot;">​</a></h2><p>注意：</p><ul><li>下列代码中没有使用 encodeURIComponent 对其进行 URI 编码 =&gt; 目前一般的库都是会对其进行编码的</li><li>拿到表单数据后就可以对其进行验证这类的工作</li></ul><p>代码如下</p><div class="language-js vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> formDOM</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> e.target;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 1. 借助 formData - 参考 stackoverflow：https://stackoverflow.com/questions/11661187/form-serialize-javascript-no-framework</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> formData</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> FormData</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(formDOM);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> data</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {};</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// URLSearchParams 兼容性问题</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> URLSearchParams</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(formData).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">toString</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// name=1111&amp;hobby=1&amp;hobby=2&amp;sex=1&amp;select=2&amp;selectMultiple=1&amp;selectMultiple=2</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 或者循环 formData 自己组装，将多选内容组装成数组</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">key</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">value</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">of</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> formData.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">entries</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (data[key]) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    data[key] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Array.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">isArray</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(data[key])</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      ?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> data[key].</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">concat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(value)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      :</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [data[key], value];</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">else</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    data[key] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> value;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(data); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// {name: &#39;1111&#39;, hobby: Array(2), sex: &#39;1&#39;, select: &#39;2&#39;, selectMultiple: Array(2)}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 2. 遍历表单的表单控件 - 具体可参考 js 高程第 14 章 14.4</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> data2</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {};</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> field</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> of</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> formDOM.elements) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  // 根据每个表单元素的 type 来区分。</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  switch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (field.type) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    case</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;select-one&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    case</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;select-multiple&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // 选择框，需要遍历每个选项 =&gt; 表单元素.options 引用着所有的选项</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> option</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> of</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> field.options) {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        // 根据 option.selected 属性判断是否选中项</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (option.selected) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">          let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> optValue </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">          if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (option.hasAttribute) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            optValue </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> option.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">hasAttribute</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;value&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">              ?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> option.value</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">              :</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> option.text;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">else</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            optValue </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> option.attributes[</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;value&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">].specified</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">              ?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> option.value</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">              :</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> option.text;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">          if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (field.type </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">===</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;select-one&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            data2[field.name] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> optValue;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">else</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            data2[field.name] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (data2[field.name] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">||</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> []).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">concat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(optValue);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      break</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    case</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> undefined</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 字段集</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    case</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;file&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 文件输入</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    case</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;submit&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 提交按钮</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    case</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;reset&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 重置按钮</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    case</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;button&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//自定义按钮</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // 这些表单元素不理会</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      break</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    case</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;radio&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 单选框</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // 根据 checked 属性判断是否选中</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (field.checked) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        data2[field.name] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> field.value;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      break</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    case</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;checkbox&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 多选按钮</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (field.checked) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        data2[field.name] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (data2[field.name] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">||</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> []).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">concat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(field.value);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      break</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // 其他表单元素，不包含没有 name 的表单元素</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (field.name.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">length</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        data2[field.name] </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> field.value;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      }</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">      break</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(data2); </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// {name: &#39;1111&#39;, hobby: Array(1), sex: &#39;1&#39;, select: &#39;2&#39;, selectMultiple: Array(2)}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br></div></div><h2 id="表单数据验证" tabindex="-1">表单数据验证 <a class="header-anchor" href="#表单数据验证" aria-label="Permalink to &quot;表单数据验证&quot;">​</a></h2><p><strong>虽然可以通过浏览器自动校验，但是在实践中作用不大，具体参考 <a href="https://developer.mozilla.org/zh-CN/docs/Learn/Forms/Form_validation" target="_blank" rel="noreferrer">MDN-表单数据校验</a></strong></p>`,20),e=[p];function h(k,t,r,E,d,c){return a(),i("div",null,e)}const o=s(l,[["render",h]]);export{y as __pageData,o as default};
