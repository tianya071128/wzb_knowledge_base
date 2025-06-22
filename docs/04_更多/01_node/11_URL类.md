# URL 类

`URL` 类是 WHATWG URL API 的核心组件，用于解析、构建和操作 URL。

## 创建 URL 实例

### new URL(input[, base])

- **方法**: `new URL(input[, base])`

  - **作用**: 使用 `URL` 类（基于 WHATWG URL 标准）创建和操作 URL 对象
  - **参数**：
    - `input`（必需）：URL 字符串或相对路径。
    - `base`（可选）：基础 URL，当 `input` 为相对路径时使用。

- **特性**

  - 网址构造函数可作为全局对象的属性访问。也可以从内置的 url 模块中导入：

    ```js
    console.log(URL === require('node:url').URL); // true
    ```

  - **创建相对 URL**: 当 `input` 是相对路径时，必须提供 `base` 参数

  - **编码与特殊字符**: `URL` 类会自动处理特殊字符的编码

    ```js
    const url = new URL('https://example.com');
    url.pathname = '/path with spaces';

    console.log(url.href); // https://example.com/path%20with%20spaces
    ```

  - **如果 `input` 或 `base` 不是有效的网址，则将抛出 `TypeError`**

    ```js
    try {
      // 缺少协议
      const url = new URL('example.com'); // 抛出 TypeError
    } catch (error) {
      console.error('无效的 URL:', error.message);
    }
    ```

## 操作 URL 组件

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

### url.href: 序列化的网址

- **属性**: `url.href`

  - **作用**：获取或设置完整的 URL 字符串。
  - **类型**：字符串。

- **特性**

  - **支持读写**

    ```js
    const url = new URL('https://user:pass@example.com:8080/api');

    console.log(url.href);
    // 输出: https://user:pass@example.com:8080/api
    ```

  - 将此属性的值设置为新值相当于使用 [`new URL(value)`](https://nodejs.cn/api/v22/url.html#new-urlinput-base) 创建新的 `URL` 对象。**`URL` 对象的每个属性都将被修改**。

    ```js
    const url = new URL('https://example.com');

    // 修改 href
    url.href = 'http://api.example.com:8080/path?query=1#hash';

    console.log(url.protocol); // 输出: http:
    console.log(url.hostname); // 输出: api.example.com
    console.log(url.port); // 输出: 8080
    ```

  - 如果分配给 `href` 属性的值不是有效的网址，则将抛出 `TypeError`。

### url.origin: 源

- **属性**: `url.origin`
  - **作用**：获取网址的源的只读的序列化。
  - **源由以下组件组合而成**：
    1. **协议（protocol）**：如 `http:`、`https:`、`file:` 等。
    2. **主机名（hostname）**：如 `example.com`、`localhost`。
    3. **端口（port）**：非标准端口（如 `8080`）会显示，标准端口（如 `http` 的 `80`、`https` 的 `443`）会省略。
- **特性**
  - **只读性**：无法直接修改 `origin`，需通过修改其他组件（如 `protocol`、`hostname`）间接更新。

### url.protocol: 协议

- **属性**: `url.protocol`
  - **作用**: 获取或设置 URL 的**协议部分**，包括末尾的冒号（如 http:、https:）。
  - **格式**：`protocol:`（冒号为协议的一部分）。
    - **协议名称**：如 `http`、`https`、`file`、`ftp` 等。
    - **冒号后缀**：所有协议后必须跟随一个冒号（`:`）。
- **特性**:
  - 分配给 `protocol` 属性的无效的网址协议值将被忽略。
  - **设置协议时可以不包含冒号**

### url.username: 用户名

- **属性**: `url.username`

- **作用**: 获取或设置 URL 中**用户名**部分。

- **格式**: 在 `protocol://` 之后、`@hostname` 之前。

  ```plaintext
  protocol://username:password@hostname:port/path
  ```

- **编码**：特殊字符会被自动编码（如空格转换为 `%20`）。

```js
const url = new URL('https://example.com');

// 设置用户名
url.username = 'john.doe';
console.log(url.href); // 输出: https://john.doe@example.com

// 设置带密码的用户名
url.password = 'secure123';
console.log(url.href); // 输出: https://john.doe:secure123@example.com
```

### url.password: 密码

- **属性**: `url.password`
- **作用**: 获取或设置 URL 中**密码**部分
- **格式**: 在 `username:` 之后、`@hostname` 之前
- **编码**：特殊字符会被自动编码（如空格转换为 `%20`，`@` 转换为 `%40`）。

### url.host:主机

- **属性**: `url.host`
- **作用**: 获取或设置 URL 的**主机部分**，包括主机名（hostname）和端口号（port）。
- **格式**：在协议（`protocol://`）之后、路径（`/path`）之前。
- **与 `hostname` 的区别**：
  - `host`：包含主机名和端口（如 `example.com:8080`）。
  - `hostname`：仅包含主机名（如 `example.com`），不包括端口。

### url.hostname: 主机名

- **属性**: `url.hostname`

  - **作用**： 获取或设置 URL 中的**主机名（hostname）**部分。主机名是域名（如 `example.com`）或 IP 地址（如 `127.0.0.1`），用于标识网络上的服务器。
  - **位置**：在协议（`protocol://`）和端口（如果有）之间。

- **特性**

  - **IPv6 地址处理**: IPv6 地址必须用方括号 [] 包裹

    ```js
    const url = new URL('http://[2001:db8::1]:8080');

    console.log(url.hostname); // 输出: [2001:db8::1]
    console.log(url.host); // 输出: [2001:db8::1]:8080
    ```

### url.port: 端口

- **属性**: `url.port`

  - **作用**: 获取或设置 URL 中的**端口号**。端口号指定了服务器上的特定服务，默认情况下不同协议使用不同的标准端口（如 HTTP 的 80、HTTPS 的 443）
  - **位置**：在主机名之后、路径之前，格式为 `hostname:port`。
  - **标准端口**：HTTP（80）、HTTPS（443）、FTP（21）等标准端口在 URL 中通常省略，但 `port` 属性返回空字符串 `''`。

- **特性**:

  - **端口范围限制**: 有效端口范围为 0-65535，但 0-1023 通常为系统保留端口

  - 如果该字符串无效但以数字开头，则将前导数字分配给 `port`。如果数字在上述范围之外，则将其忽略。

  - **包含小数点的数字，小数点前的前导数字将被设置为网址的端口**

    ```js
    const url = new URL('https://example.com');

    url.port = '4.14';
    console.log(url.port); // 4
    ```

  - **将值设置为给定 `protocol` 的 `URL` 对象的默认端口将导致 `port` 值成为空字符串 (`''`)**。

    ```js
    const url = new URL('https://example.com:8080');

    url.port = '443'; // https 默认端口
    console.log(url.port); // ''
    ```

### url.pathname: 路径

- **属性**: `url.pathname`

  - **作用**: 获取或设置 URL 中的**路径部分**。

  - **位置**：在 `host` 之后、`search` 之前。

  - **格式**：必须以 `/` 开头（根路径），多个路径段用 `/` 分隔（如 `/users/123/profile`）。

    ```plaintext
    protocol://host[:port]/pathname[?search][#hash]
    ```

- **特性**

  - **特殊字符编码**: 路径中的特殊字符会被自动编码

  - **路径规范化**: pathname 会自动处理路径中的 .（当前目录）和 ..（上级目录）：

    ```js
    const url = new URL('https://example.com');
    url.pathname = '/a/b/../c/./d';

    console.log(url.pathname); // 输出: /a/c/d（自动规范化）
    ```

### url.search: 查询字符串

- **属性**: `url.search`
  - **作用**: 获取或设置 URL 中的**查询字符串（query string）**部分。查询字符串是 URL 中用于传递参数的部分，通常以问号 `?` 开头，多个参数以 `&` 分隔。
  - **位置**：在路径（`pathname`）之后、哈希（`hash`）之前。
  - **格式**：`?key1=value1&key2=value2`。
- **特性**：
  - **特殊字符编码**：查询参数中的特殊字符会被自动编码
  - **与 searchParams 的关系**: `url.searchParams` 是一个 `URLSearchParams` 对象，提供更便捷的查询参数操作

### url.searchParams: 查询字符串实例

- **属性**: `url.searchParams`
  - **作用**: 获取表示网址查询参数的 [`URLSearchParams`](https://nodejs.cn/api/v22/url.html#class-urlsearchparams) 对象。该属性是只读的，但它提供的 `URLSearchParams` 对象可用于改变 URL 实例

### url.hash:哈希

- **属性**: `url.hash`

  - **作用**: 获取或设置 URL 中的**哈希（hash）部分**，也称为**片段标识符（fragment identifier）**。哈希通常用于标识网页内的特定位置（如锚点），或在客户端存储状态信息（如单页应用的路由）。
  - **位置**：在 URL 的最后部分，位于路径（`pathname`）和查询参数（`search`）之后。
  - **特点**：哈希部分不会被发送到服务器，仅由客户端处理。

- **特性**:

  - **哈希必须以 # 开头**: 设置 `hash` 时，若省略开头的 `#`，会自动添加

  - **哈希不影响服务器请求**: 哈希部分不会发送到服务器，仅客户端可见

    ```js
    // 客户端 URL: https://example.com/page#fragment
    // 服务器收到的请求: https://example.com/page
    ```

- **特殊字符编码**: 哈希中的特殊字符会被自动编码

## URL 类 静态方法

待续...
