import{_ as e,c as a,o as s,aR as i}from"./chunks/framework.DLAwTCsc.js";const m=JSON.parse('{"title":"search 搜索远程包","description":"","frontmatter":{},"headers":[],"relativePath":"npm/npm-search.md","filePath":"02_工程化/06_npm/17_命令_search_搜索远程包.md","lastUpdated":1739447932000}'),l={name:"npm/npm-search.md"},n=i('<h1 id="search-搜索远程包" tabindex="-1">search 搜索远程包 <a class="header-anchor" href="#search-搜索远程包" aria-label="Permalink to &quot;search 搜索远程包&quot;">​</a></h1><p><a href="https://docs.npmjs.com/cli/v10/commands/npm-search" target="_blank" rel="noreferrer"><code>npm search</code></a> 在注册表中搜索与搜索词匹配的包。类似于在 <code>npmjs</code> 进行搜索包</p><div class="language-shell vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> search</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [search </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">terms</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ...]</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">aliases:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> find,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> s,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> se</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h2 id="描述" tabindex="-1">描述 <a class="header-anchor" href="#描述" aria-label="Permalink to &quot;描述&quot;">​</a></h2><ul><li>在注册表中搜索与搜索词匹配的包。 npm search 通过包元数据对注册表中的所有文件执行线性、增量、词法排序的搜索。如果您的终端支持颜色，它将进一步突出显示结果中的匹配项。这可以通过配置项颜色禁用</li><li><strong>命令会在配置注册表中搜索, 如果配置了其他注册表(如淘宝镜像)，可能会执行失败</strong></li></ul><h2 id="配置" tabindex="-1">配置 <a class="header-anchor" href="#配置" aria-label="Permalink to &quot;配置&quot;">​</a></h2><h3 id="long-l-显示更多扩展信息" tabindex="-1"><code>--long, -l</code> 显示更多扩展信息 <a class="header-anchor" href="#long-l-显示更多扩展信息" aria-label="Permalink to &quot;`--long, -l` 显示更多扩展信息&quot;">​</a></h3><ul><li>默认值: <code>false</code></li><li>类型：<code>boolean</code><ul><li><code>true</code> 将显示更多扩展信息, 但是似乎作用不大</li></ul></li></ul><h3 id="json-输出-json-数据" tabindex="-1"><code>--json</code> 输出 JSON 数据 <a class="header-anchor" href="#json-输出-json-数据" aria-label="Permalink to &quot;`--json` 输出 JSON 数据&quot;">​</a></h3><ul><li>默认值：<code>false</code></li><li>类型：<code>boolean</code><ul><li><code>true</code>输出 JSON 数据，而不是正常输出。</li></ul></li></ul><h3 id="registry-搜索的注册表" tabindex="-1"><code>--registry</code> 搜索的<strong>注册表</strong> <a class="header-anchor" href="#registry-搜索的注册表" aria-label="Permalink to &quot;`--registry` 搜索的**注册表**&quot;">​</a></h3><ul><li>默认值：npm 配置中的 <code>registry</code>, 默认为 <a href="https://registry.npmjs.org/" target="_blank" rel="noreferrer">https://registry.npmjs.org/</a></li><li>类型：<code>URL</code></li></ul><p>注册表的基本 URL。</p>',13),r=[n];function t(o,h,c,d,p,_){return s(),a("div",null,r)}const k=e(l,[["render",t]]);export{m as __pageData,k as default};
