# 其他主题

## CORS 设置属性：crossorigin

在 HTML5 中，一些 HTML 元素提供了对 CORS 的支持。例如：`audio`、`img`、`link`、`script`和 `video` 均有一个跨域属性(crossorigin)，用于配置元素获取数据的 CORS 请求

这个属性是枚举的，并具有以下可能的值：

| 关键字            | 描述                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------- |
| `anonymous`       | 对此元素的 CORS 请求将不设置凭据标志。                                                |
| `use-credentials` | 对此元素的 CORS 请求将设置凭证标志；这意味着请求将提供凭据。                          |
| `""`              | 设置一个空的值，如 `crossorigin` 或 `crossorigin=""`，和设置 `anonymous` 的效果一样。 |

这些 HTML 元素默认是可以实现跨域资源请求的，并不会像 xhr 请求资源一样，需要服务端设置 CORS 跨域。

**但如果添加了 crossorigin 属性，就会通过 CORS 方式加载这些资源，此时就需要服务器进行 CORS 跨域设置**

**注意：通过 js 脚本设置 crossorigin 时，需要使用 crossOrigin 属性**

### 对于 img 图片

使用 `crossorigin` 可以实现下载跨域图片

见另外章节：[img 图片](/html/img#跨域图片-cookie)

### 对于 script 脚本

设置 `crossorigin` 属性可以更好获取到脚本的具体错误信息了，具体参考 [crossorigin 属性](https://blog.csdn.net/qq_40028324/article/details/107076751)

::: tip

- 不设置 crossorigin：正常请求脚本，服务器无需设置 CORS 也可以请求。但是在 onerror 全局事件中捕获的信息不全。
- 设置 crossorigin（anonymous）：使用 CORS 形式请求脚本，服务器需设置。捕获的错误信息比较全。
- 设置 crossorigin（use-credentials）：使用 CORS 形式请求脚本，并且会携带凭证，服务器也需要允许携带凭证

:::

## Preload/Prefetch：预加载内容

`<link rel=“prefetch”>`是一个指令，告诉浏览器**获取**下一次导航**可能需要的资源**。这主要意味着资源将以极低的优先级获取（因为浏览器*知道*当前页面中需要的所有内容都比我们*猜测*下一个页面中可能需要的资源更重要）。这意味着预取的主要用例是加速下一个导航而不是当前导航。

`<link rel="preload">` 用来指定页面加载后很快会被用到的资源，所以在页面加载的过程中，我们希望在浏览器开始主体渲染之前尽早 preload。

具体参考：

- [文章-预加载：它有什么用？](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/)
- [MDN-链接预取常见问题](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Link_prefetching_FAQ)
- [链接类型：preload](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Link_types/preload)

在 vue-cli 脚本架生成的 vue 项目中，这两个是内置的，但在不支持或支持度较差的浏览器中，可能会有副作用。具体见[vue-cli](https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload)

## iframe 历史污染

当页面中嵌入 `iframe`，并且 `iframe` 内部发生导航（例如 `location.hash` 变化、`location.href` 跳转、`history.pushState`）时，浏览器会为该 `iframe` 的导航产生历史记录。这种现象叫做“iframe 历史污染”。

### 为什么会发生

- `iframe` 有自己的浏览上下文和历史栈。
- 浏览器的后退/前进按钮会先遍历 `iframe` 内部的历史记录，再返回父页面的历史记录。
- 因此，`iframe` 内部的频繁跳转会“污染”当前页面的整体历史行为，导致用户按一次后退按钮并不离开当前页面，而是回到 `iframe` 里之前的状态。

### 常见影响

- 用户点击浏览器返回按钮时，先回到 `iframe` 内部的上一页，而不是父页面的上一页。
- 体验上感觉“后退按钮失效”或“回退到错误页面”。
- 做路由跳转、第三方嵌入内容或广告时尤其明显。

### 解决方案

1. `iframe` 内部使用 `location.replace()` 或 `history.replaceState()`
   - 如果 `iframe` 内部需要更改 URL 但不希望产生历史记录，优先使用 `replace`。

2. 跳转路由之前, 先销毁 `iframe`, 在执行跳转路由
   - 销毁 `iframe`, 会将 `iframe` 内的页面从历史记录中移除。
