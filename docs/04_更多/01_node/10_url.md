# Url 网址

用于处理和操作 URL 地址，提供了一系列方法来解析、格式化、编码和解码 URL。

## WHATWG URL API

**WHATWG URL API** 是一组基于浏览器标准的 URL 处理接口，提供了比传统 `url` 模块更现代、更符合 Web 标准的 URL 解析和操作方式。

### 与传统 url 模块的对比

| 特性         | WHATWG URL API                       | 传统 `url` 模块                     |
| ------------ | ------------------------------------ | ----------------------------------- |
| 标准兼容性   | 完全遵循浏览器 `URL` 接口规范        | 自定义格式，与浏览器略有差异        |
| 查询参数处理 | 通过 `searchParams` 对象提供丰富方法 | 需手动解析或使用 `querystring` 模块 |
| 编码处理     | 自动编码 / 解码特殊字符              | 需手动调用 `encodeURIComponent`     |
| 对象结构     | 直观的属性访问（如 `url.hostname`）  | 键值对结构（如 `parsed.hostname`）  |
| 相对路径解析 | 需显式提供 `base` 参数               | 内置 `url.resolve()` 方法           |
| 支持的协议   | 仅支持标准协议（如 `http`, `https`） | 支持任意协议                        |

## URL 类

`URL` 类是 WHATWG URL API 的核心组件，用于解析、构建和操作 URL。

### 创建 URL 对象

#### new URL(input[, base])

* **方法**: `new URL(input[, base])`

  * **作用**: 使用 `URL` 类（基于 WHATWG URL 标准）创建和操作 URL 对象
  * **参数**：
    - `input`（必需）：URL 字符串或相对路径。
    - `base`（可选）：基础 URL，当 `input` 为相对路径时使用。

* **特性**

  * 网址构造函数可作为全局对象的属性访问。也可以从内置的 url 模块中导入：

    ```js
    console.log(URL === require('node:url').URL); // true
    ```

  * **创建相对 URL**: 当 `input` 是相对路径时，必须提供 `base` 参数

  * **编码与特殊字符**: `URL` 类会自动处理特殊字符的编码

    ```js
    const url = new URL('https://example.com');
    url.pathname = '/path with spaces';
    
    console.log(url.href);// https://example.com/path%20with%20spaces
    ```

  * **如果 `input` 或 `base` 不是有效的网址，则将抛出 `TypeError`**

    ```js
    try {
      // 缺少协议
      const url = new URL('example.com'); // 抛出 TypeError
    } catch (error) {
      console.error('无效的 URL:', error.message);
    }
    ```

### 操作 URL 组件

创建 URL 对象后，可以对其组件属性读写

```tex
# 旧版 URL
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
# WHATWG URL
```



#### url.href: 序列化的网址

* **属性**: `url.href`

  * **作用**：获取或设置完整的 URL 字符串。
  * **类型**：字符串。

* **特性**

  * **支持读写**

    ```js
    const url = new URL('https://user:pass@example.com:8080/api');
    
    console.log(url.href);
    // 输出: https://user:pass@example.com:8080/api
    ```

  * 将此属性的值设置为新值相当于使用 [`new URL(value)`](https://nodejs.cn/api/v22/url.html#new-urlinput-base) 创建新的 `URL` 对象。**`URL` 对象的每个属性都将被修改**。

    ```js
    const url = new URL('https://example.com');
    
    // 修改 href
    url.href = 'http://api.example.com:8080/path?query=1#hash';
    
    console.log(url.protocol); // 输出: http:
    console.log(url.hostname); // 输出: api.example.com
    console.log(url.port); // 输出: 8080
    ```

  * 如果分配给 `href` 属性的值不是有效的网址，则将抛出 `TypeError`。

#### url.origin

#### url.protocol

#### url.username

#### url.password

#### url.host

#### url.pathname

#### url.search

#### url.hash




















