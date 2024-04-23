# Img

嵌入图片

::: tip 提示

`<img>` 有时被成为替换元素, 因为这样的元素的内容和尺寸由外部资源所定义, 而不是元素本身

:::

## 属性

支持全局属性

### src: 图像 url

图片的 url 地址

### alt: 替换文本

定义了图像的备用文本描述. 当浏览器因为某些原因没有显示图像时起作用.

::: tip 提示

浏览器并非总会显示图像(也不是说 url 错误才会不显示), 比如:

- 非可视化浏览器（Non-visual browsers）（比如有视力障碍的人使用的音频浏览器）
- 用户选择不显示图像（比如为了节省带宽，或出于隐私等考虑不加载包括图片在内的第三方资源文件）
- 图像文件无效，或是使用了[不支持的格式](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#supported_image_formats)

:::

### width, height: 设定宽高

图片没有加载完成的时候, 默认是只有一点点宽高的, 但是设定了宽高后, 浏览器就会预留指定的空间.

**属性值为数字, 设定单位为像素, 注意设定图片宽高要根据原始宽高比来设定, 推荐使用 CSS 来设定**

### crossorigin: 跨域支持

这个枚举属性表明是否必须使用 CORS 完成相关图像的抓取。启用 CORS 的图像 可以在 `<canvas>` 元素中重复使用，而不会被污染（tainted）。允许的值有：

- anonymous
  执行一个跨域请求（比如，有 Origin HTTP header）。但是没有发送证书（比如，没有 cookie，没有 X.509 证书，没有 HTTP 基本授权认证）。如果服务器没有把证书给到源站（没有设置 Access-Control-Allow-Origin HTTP 头），图像会被污染，而且它的使用会被限制。

- use-credentials
  一个有证书的跨域请求（比如，有 Origin HTTP header）被发送 （比如，cookie, 一份证书，或者 HTTP 基本验证信息）。如果服务器没有给源站发送证书（通过 Access-Control-Allow-Credentials HTTP header），图像将会被污染，且它的使用会受限制。

  当用户并未显式使用本属性时，默认不使用 CORS 发起请求（例如，不会向服务器发送原有的 HTTP 头部信息），可防止其在 `<canvas>` 中的使用。如果无效，默认当做 anonymous 关键字生效。更多信息，请查看 CORS 属性设置 。

  **默认不使用 CORS 发起请求：如果没有设置 crossorigin 属性的话，那么就会默认使用浏览器自带跨域功能去加载。但如果设置了 crossorigin 属性，就会使用 CORS 请求资源（类似于 xhr 请求），此时需要服务器配置 CORS**

## 监听图像 error, load 事件

如果在加载或渲染图像时发生错误, 那么可以监听图像错误的事件来处理图像错误后的处理

```js
imgDOM.addEventListener('error', function (e) {
  console.log(e); // 在这里可以监听到图像加载失败
});
imgDOM.addEventListener('load', function (e) {
  console.log(e); // 在这里可以监听到图像加载成功
});
```

## 下载图片

- 同源图片下载

  利用 a 元素的 `download` 属性下载

  **注意: 如果不是同源图片, 不是执行下载操作**

- 跨域图片

  **图片是有版权的, 如果没有授权的话, 还是要尊重原创的**

  - 可以利用服务器去请求这张图片, 将图片的二进制信息传回给前端, 前端进行二进制数据下载

  ```js
  const data = await axios.get('/html/getImg', {
    responseType: 'arraybuffer',
  });
  const myBolb = new Blob([data.data], {
    type: data.headers['content-type'],
  });
  const imageUrl = (window.URL || window.webkitURL).createObjectURL(myBolb);
  const aTag = document.createElement('a');
  aTag.href = imageUrl;
  aTag.download = '下载图片.png';
  aTag.click();
  ```

  - 图片启动 `CORS` 跨域支持

    图片设置了 `crossorigin` 属性后, 就可以在画布中使用而不会污染画布(**如果画布使用了跨域图片, 就会污染画布, 有些 API 就使用不了**)

    ```js
    let imageURL = `${this.BASE_URL}/public/01.jpg`;
    let downloadedImg = new Image();
    ``;
    downloadedImg.crossOrigin = 'Anonymous';
    // 在图片加载完成后, 通过 canvas 下载图片
    downloadedImg.addEventListener('load', imageReceived, false);
    downloadedImg.src = imageURL;

    function imageReceived() {
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');

      canvas.width = downloadedImg.width;
      canvas.height = downloadedImg.height;

      context.drawImage(downloadedImg, 0, 0);

      try {
        // 下载图片
        const aTag = document.createElement('a');
        aTag.href = canvas.toDataURL('image/png');
        aTag.download = '下载图片.png';
        aTag.click();
      } catch (err) {
        console.log('Error: ' + err);
      }
    }
    ```

## 图片懒加载

见另外章节, 待完成

## 响应式图片

[MDN-响应式图片](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

## 跨域图片 cookie

图片默认不会发送 cookie

::: tip 测试

<img
  src="https://developer.mozilla.org/static/media/twitter.cc5b37fe.svg"
  width="100"
  alt="图片显示失败" />

<div>这张图片来自于 MDN， 默认不会发送 cookie</div>

:::

设置 crossorigin 属性为 anonymous，使用 CORS 方式请求资源（类似于 xhr 请求，需服务端配置），但不会发送 cookie 凭证

::: tip 测试

<img data-v-0003f6e8="" src="https://developer.mozilla.org/static/media/twitter.cc5b37fe.svg" width="100" alt="图片显示失败" style="cursor: zoom-in;" crossOrigin>

这张图片设置了 crossorigin 属性，服务端没有配置 CORS，所以显示失败，控制台报错

:::

设置 crossorigin 属性为 use-credentials 时，会发送 cookie

::: tip 测试
<img
  src="https://developer.mozilla.org/static/media/twitter.cc5b37fe.svg"
  width="100"
  alt="图片显示失败"
  crossorigin="use-credentials" />

<div>
这张图片来自于 MDN， crossorigin 属性设置为 use-credentials，但是 MDN
服务器没有配置跨域，所以获取图片失败了
</div>
:::

::: tip 提示
cookie 是否发送还取决于 cookie 的 SameSite 属性
:::
