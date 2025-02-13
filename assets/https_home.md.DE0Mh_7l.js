import{_ as t,c as a,o as e,aR as s,d9 as T}from"./chunks/framework.DLAwTCsc.js";const _=JSON.parse('{"title":"HTTPS","description":"","frontmatter":{},"headers":[],"relativePath":"https/home.md","filePath":"03_网络协议/02_https/01_https.md","lastUpdated":1739447932000}'),r={name:"https/home.md"},o=s('<h1 id="https" tabindex="-1">HTTPS <a class="header-anchor" href="#https" aria-label="Permalink to &quot;HTTPS&quot;">​</a></h1><p>HTTP 是一个“明文”协议，整个传输过程完全透明，任何人都能够在链路中截获、修改或伪造请求/响应报文，数据不具有可信度。</p><p>HTTPS 就是用来解决 HTTP 的安全性问题。</p><h2 id="什么是安全" tabindex="-1">什么是安全？ <a class="header-anchor" href="#什么是安全" aria-label="Permalink to &quot;什么是安全？&quot;">​</a></h2><p>通常来讲，如果通信过程具备了四个特性，就可以认为是“安全”的：</p><ul><li>机密性：对数据的“保密”，只能由可信的人访问，对其他人是不可见的“秘密”。</li><li>完整性：指数据在传输过程中没有被篡改，不多也不少，“完完整整”地保持着原状。</li><li>身份认证：指确认对方的真实身份，也就是“证明你真的是你”，保证消息只能发送给可信的人。</li><li>不可否认：是不能否认已经发生过的行为，不能“说话不算数”“耍赖皮”。</li></ul><h2 id="什么是-https" tabindex="-1">什么是 HTTPS？ <a class="header-anchor" href="#什么是-https" aria-label="Permalink to &quot;什么是 HTTPS？&quot;">​</a></h2><p>HTTPS 通过为 HTTP 增加安全的四大特性来保证 HTTP 的安全。</p><p>HTTPS 基于 HTTP 协议，只是用 https 协议名，默认端口为 443，其他的语法、语义（请求方法、状态码、头部字段等）都沿用 HTTP，没有增加其他语法、语义。</p><p><strong>HTTPS 只是在 HTTP 协议的基础上增加了 SSL/TLS 协议，让 HTTP 运行在 SSL/TLS 协议上，收发报文不再使用 Socket API，而是调用专门的安全接口。</strong></p><p><strong>HTTP 是直接调用 TCP 接口传输数据，HTTPS 是 HTTP 调用 SSL/TLS 接口实现加密在通过 TCP 传输数据</strong></p><p><img src="'+T+'" alt="img" loading="lazy"></p><p><strong>只要掌握了 SSL/TLS 协议，就明白了 HTTPS</strong></p><h2 id="ssl-tls" tabindex="-1">SSL/TLS？ <a class="header-anchor" href="#ssl-tls" aria-label="Permalink to &quot;SSL/TLS？&quot;">​</a></h2><p>SSL 即安全套接层，由网景公司于 1994 年发明，有 v2 和 v3 两个版本，而 v1 因为有严重的缺陷从未公开过。</p><p>在 SSL 发展到 v3 版本后，互联网工程组 IETF 在 1999 年把它改名为 TLS（传输层安全，Transport Layer Security），正式标准化，版本号从 1.0 重新算起</p><div class="warning custom-block"><p class="custom-block-title">注意</p><p>TLS1.0 其实就是 SSLv3.1</p></div><p>TLS 已经发展了三个版本，分别是 2006 年的 1.1、2008 年的 1.2 和去年（2018）的 1.3。</p><p><strong>目前应用的最广泛的 TLS 是 1.2，而之前的协议（TLS1.1/1.0、SSLv3/v2）都已经被认为是不安全的</strong></p><div class="tip custom-block"><p class="custom-block-title">提示</p><p>SSL/TLS 不止可以承载 HTTP，还可以与承载其他协议。例如：FTP =&gt; FTPS、LDAP =&gt; LDAPS 等</p></div><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><p><a href="https://time.geekbang.org/column/article/108643" target="_blank" rel="noreferrer">极客-HTTP</a></p>',22),p=[o];function l(i,S,n,c,h,P){return e(),a("div",null,p)}const L=t(r,[["render",l]]);export{_ as __pageData,L as default};
