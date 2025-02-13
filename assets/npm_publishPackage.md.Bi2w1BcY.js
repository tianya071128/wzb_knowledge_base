import{_ as a,c as s,o as i,aR as e,cq as t,cr as n,cs as l,ct as p,cu as d}from"./chunks/framework.DLAwTCsc.js";const y=JSON.parse('{"title":"发布包","description":"","frontmatter":{},"headers":[],"relativePath":"npm/publishPackage.md","filePath":"02_工程化/06_npm/03_发布包.md","lastUpdated":1739447932000}'),o={name:"npm/publishPackage.md"},h=e(`<h1 id="发布包" tabindex="-1">发布包 <a class="header-anchor" href="#发布包" aria-label="Permalink to &quot;发布包&quot;">​</a></h1><h2 id="包和模块" tabindex="-1">包和模块 <a class="header-anchor" href="#包和模块" aria-label="Permalink to &quot;包和模块&quot;">​</a></h2><p>npm 注册表包含包，其中许多也是 Node 模块，或者包含 Node 模块。</p><h3 id="关于模块" tabindex="-1">关于模块 <a class="header-anchor" href="#关于模块" aria-label="Permalink to &quot;关于模块&quot;">​</a></h3><p>模块是 <code>node_modules</code> 目录中可以由 Node.js 的 <code>require()</code> 函数加载的任何文件或目录。模块必须是以下之一：</p><ul><li>包含 <code>package.json</code> 文件的文件夹，其中包含<code>“main”</code>字段。</li><li>一个 JavaScript 文件。</li></ul><div class="warning custom-block"><p class="custom-block-title">注意</p><p>由于模块不需要有 <code>package.json</code> 文件，因此并非所有模块都是包。只有具有 <code>package.json</code> 文件的模块也是包。</p></div><h3 id="关于包" tabindex="-1">关于包 <a class="header-anchor" href="#关于包" aria-label="Permalink to &quot;关于包&quot;">​</a></h3><p>包是由 <code>package.json</code> 文件描述的文件或目录。<strong>包必须包含 <code>package.json</code> 文件才能发布到 npm 注册表</strong>。</p><p>包是以下任何一种：</p><ul><li>a) 包含由 package.json 文件描述的程序的文件夹。</li><li>b) 包含 (a) 的压缩包</li><li>c) 解析为 (b) 的 URL。</li><li>d) 使用 (c) 在注册表上发布的 <code>&lt;name&gt;@&lt;version&gt;</code>。</li><li>e) 指向 (d) 的 <code>&lt;name&gt;@&lt;tag&gt;</code>。</li><li>g) 一个 <code>git url</code>，在克隆时会导致 (a)。</li></ul><h3 id="关于范围包-作用域包" tabindex="-1">关于范围包(作用域包) <a class="header-anchor" href="#关于范围包-作用域包" aria-label="Permalink to &quot;关于范围包(作用域包)&quot;">​</a></h3><p>当注册了 npm 账户或创建组织时，将获得用户名或组织名称匹配的范围，可以将此范围用作相关<strong>包的命名空间</strong>。</p><h4 id="范围包的作用" tabindex="-1">范围包的作用 <a class="header-anchor" href="#范围包的作用" aria-label="Permalink to &quot;范围包的作用&quot;">​</a></h4><ul><li>范围允许创建与其他用户或组织创建的包同名的包，而不会发生冲突。</li><li>范围可以将包分为多个不同功能的包进行管理</li></ul><h4 id="范围包的表示" tabindex="-1">范围包的表示 <a class="header-anchor" href="#范围包的表示" aria-label="Permalink to &quot;范围包的表示&quot;">​</a></h4><p>范围名称是 @ 和斜杠之间的所有内容(范围名称是用户名或组织名称)，包名称是斜杠后面的名称：</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>@用户名/包名</span></span>
<span class="line"><span></span></span>
<span class="line"><span>@组织名/包名</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>常见的范围包例如：<code>@babel/</code>、<code>@vue/</code> 等</p><h3 id="包的可见性" tabindex="-1">包的可见性 <a class="header-anchor" href="#包的可见性" aria-label="Permalink to &quot;包的可见性&quot;">​</a></h3><p>npm 包的可见性取决于包所在的范围（命名空间），以及为包设置的访问级别（私有或公共）：</p><table><thead><tr><th>范围</th><th>访问权限</th><th>查看和下载</th><th>写(publish)</th></tr></thead><tbody><tr><td>组织</td><td>私人的(Private)</td><td>组织中对包具有读取权限的团队成员</td><td>组织中对包具有读写权限的团队成员</td></tr><tr><td>组织</td><td>公共的(Public)</td><td>每个人</td><td>组织中对包具有读写权限的团队成员</td></tr><tr><td>用户</td><td>私人的(Private)</td><td>包所有者和已被授予对包的读取权限的用户</td><td>包所有者和被授予对包的读写权限的用户</td></tr><tr><td>用户</td><td>公共的(Public)</td><td>每个人</td><td>包所有者和被授予对包的读写权限的用户</td></tr><tr><td>无范围</td><td>公共的(Public)</td><td>每个人</td><td>包所有者和被授予对包的读写权限的用户</td></tr></tbody></table><div class="warning custom-block"><p class="custom-block-title">注意</p><ul><li>只有用户帐户可以创建和管理无范围的包。组织只能管理范围包。</li><li>要创建组织范围的包，您必须首先创建一个组织。</li></ul></div><h2 id="发布无范围的公共包" tabindex="-1">发布无范围的公共包 <a class="header-anchor" href="#发布无范围的公共包" aria-label="Permalink to &quot;发布无范围的公共包&quot;">​</a></h2><p>以下示例以无范围的公共包为例，其他包类型可<a href="https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry" target="_blank" rel="noreferrer">参考</a></p><h3 id="创建-package-json-文件" tabindex="-1">创建 package.json 文件 <a class="header-anchor" href="#创建-package-json-文件" aria-label="Permalink to &quot;创建 package.json 文件&quot;">​</a></h3><p>发布到 npm 注册表的包必须包含 package.json 文件，所以需要将 package.json 文件添加到您的包中，以方便其他人管理和安装。</p><p><a href="/wzb_knowledge_base/npm/packageFile.html">package.json 文件详解参考</a>，但一个包的 <code>package.json</code> 文件必须包含 <code>name</code> 和 <code>version</code> 字段：</p><ul><li><code>name</code>：包含您的包的名称，必须是小写字母和一个单词，并且可以包含连字符和下划线。</li><li><code>version</code>：必须采用 x.x.x 格式并遵循<a href="https://docs.npmjs.com/about-semantic-versioning/" target="_blank" rel="noreferrer">语义版本控制指南</a>。</li></ul><div class="language-json vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;my-awesome-package&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  &quot;version&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;1.0.0&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h4 id="使用-cli-创建文件" tabindex="-1">使用 CLI 创建文件 <a class="header-anchor" href="#使用-cli-创建文件" aria-label="Permalink to &quot;使用 CLI 创建文件&quot;">​</a></h4><p>使用如下步骤创建 <code>package.json</code> 文件：</p><ol><li><p>在终端中导航到包的根目录</p></li><li><p>运行如下命令：</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> init</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div></li><li><p>回答命令行问卷中的问题。</p></li></ol><p><img src="`+t+`" alt="image-20220627170439977" loading="lazy"></p><h4 id="使用-cli-创建默认的-package-json-文件" tabindex="-1">使用 CLI 创建默认的 package.json 文件 <a class="header-anchor" href="#使用-cli-创建默认的-package-json-文件" aria-label="Permalink to &quot;使用 CLI 创建默认的 package.json 文件&quot;">​</a></h4><p>可以使用从当前目录中提取的信息创建默认的 <code>package.json</code> 文件，使用带有 <code>--yes</code> 或 <code>-y</code> 标志的 <code>npm init</code> 命令。</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> init</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --yes</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>会从当前目录中提取的默认值：</p><ul><li><code>name</code>: 当前目录名</li><li><code>version</code>: 始终为 <code>1.0.0</code></li><li><code>description</code>: <code>README</code> 文件中的信息，或空字符串 <code>&quot;&quot;</code></li><li><code>scripts</code>: 默认创建一个空的 <code>test</code> 脚本</li><li><code>keywords</code>: 空</li><li><code>author</code>: v</li><li><code>license</code>: <a href="https://opensource.org/licenses/ISC" target="_blank" rel="noreferrer"><code>ISC</code></a></li><li><code>bugs</code>: 来自当前目录的信息，如果存在的话</li><li><code>homepage</code>: 来自当前目录的信息，如果存在的话</li></ul><h4 id="为-init-命令设置配置选项" tabindex="-1">为 init 命令设置配置选项 <a class="header-anchor" href="#为-init-命令设置配置选项" aria-label="Permalink to &quot;为 init 命令设置配置选项&quot;">​</a></h4><p>可以为 init 命令设置默认配置选项。例如，要设置默认作者电子邮件、作者姓名和许可证，可运行以下命令：</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> npm set init.author.email </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;example-user@example.com&quot;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> npm set init.author.name </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;example_user&quot;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> npm set init.license </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;MIT&quot;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p><strong>注意</strong>：这个命令是 <code>npm config set key=value [key=value...]</code> 的简写</p><h3 id="编写包的应用代码" tabindex="-1">编写包的应用代码 <a class="header-anchor" href="#编写包的应用代码" aria-label="Permalink to &quot;编写包的应用代码&quot;">​</a></h3><p>其中 <code>README.md</code> 自述文件用于项目说明，需要位于包的根目录中。</p><p>在发布之前，检查代码内容，在将包发布到注册表之前删除敏感信息，例如私钥、密码、个人身份信息 (PII) 和信用卡数据。</p><p><strong>对于不太敏感的信息，例如测试数据，使用 <code>.npmignore</code> 或 <code>.gitignore</code> 文件来防止发布到注册表</strong></p><h3 id="本地测试下载包" tabindex="-1">本地测试下载包 <a class="header-anchor" href="#本地测试下载包" aria-label="Permalink to &quot;本地测试下载包&quot;">​</a></h3><p>为了减少发布错误的机会，在将包发布到 npm 注册表之前对其进行测试，可以本地 <code>npm install</code> 一下：</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 包的路径</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p><img src="`+n+'" alt="image-20220628101241744" loading="lazy"></p><h3 id="发布包-1" tabindex="-1">发布包 <a class="header-anchor" href="#发布包-1" aria-label="Permalink to &quot;发布包&quot;">​</a></h3><p><strong>注意</strong>：发布包时需要在 <code>npm CLI</code> 中进行<a href="/wzb_knowledge_base/npm/npm-login.html">账号登录</a></p><ol><li><p>在终端中，导航到包的根目录</p></li><li><p>运行命令：</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> publish</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div></li><li><p>在 npm 网站上查看包</p></li></ol><h2 id="更新包" tabindex="-1">更新包 <a class="header-anchor" href="#更新包" aria-label="Permalink to &quot;更新包&quot;">​</a></h2><h3 id="更新包版本" tabindex="-1">更新包版本 <a class="header-anchor" href="#更新包版本" aria-label="Permalink to &quot;更新包版本&quot;">​</a></h3><p>当对包进行更改时，更新包之前需要按照<a href="https://docs.npmjs.com/about-semantic-versioning" target="_blank" rel="noreferrer">语义版本控制</a>更新版本，可通过以下方式更新版本：</p><ol><li><p>通过 CLI 命令行形式，输入以下命令：</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> version</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 新的版本号</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">或者</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> patch,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> major,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> minor</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 等关键字</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div></li><li><p>直接修改 <code>package.json</code> 文件的 <code>version</code> 字段。不推荐这样做</p></li></ol><p><img src="'+l+'" alt="image-20220628112008461" loading="lazy"></p><h3 id="更新包-1" tabindex="-1">更新包 <a class="header-anchor" href="#更新包-1" aria-label="Permalink to &quot;更新包&quot;">​</a></h3><p>与发布包的命令相同：</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> publish</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><h2 id="分发包标签-dist-tags" tabindex="-1">分发包标签(dist-tags) <a class="header-anchor" href="#分发包标签-dist-tags" aria-label="Permalink to &quot;分发包标签(dist-tags)&quot;">​</a></h2><p>分发标签 (dist-tags) 是人类可读的标签，您可以使用它来组织和标记您发布的不同版本的包。 dist-tags 补充语义版本控制。除了比语义版本编号更易于人类阅读之外，标签还允许发布者更有效地分发他们的包。</p><p>有如下方式创建标签：</p><ol><li><p>发布(或更新)包时同时发布标签，默认情况下，运行 <code>npm publish</code> 将使用最新的 <code>dist-tag</code> 标记您的包。要使用另一个 <code>dist-tag</code>，请在发布时使用 <code>--tag</code> 标志。</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> publish</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --tag</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 标签名</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>如下图：</p><p><img src="'+p+'" alt="image-20220628152633564" loading="lazy"></p></li><li><p>将 <code>dist-tag</code> 添加到包的特定版本，在包的根目录下运行如下命令：</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dist-tag</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">package-nam</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">e</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">@</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">versio</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">n</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [&lt;tag&gt;]</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>如下图：</p><p><img src="'+d+'" alt="image-20220628152800975" loading="lazy"></p></li></ol><div class="warning custom-block"><p class="custom-block-title">注意</p><ol><li>由于 dist-tags 与语义版本共享一个命名空间，请避免与现有版本号冲突的 dist-tags。我们建议避免使用以数字或字母“v”开头的 dist-tags。</li><li>发布(或更新)包分发标签时，同时会发布新版本。而使用 <code>npm dist-tag</code> 时则只会在特定版本上新增一个标签。</li><li>同一个版本可以发布多个标签。</li></ol></div>',67),r=[h];function c(k,g,u,b,m,F){return i(),s("div",null,r)}const E=a(o,[["render",c]]);export{y as __pageData,E as default};
