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

## `url` 模块方法

以下方法是 `url` 模块导出的, 不是全局方法

### url.fileURLToPath(url[, options])

* **方法**: `url.fileURLToPath(url[, options])`

  * **作用**: 将 `file://` 开头的 URL 转换为本地文件系统路径，自动处理不同操作系统的路径格式差异
  * **参数**：
    - `url`（URL 对象或字符串）- 要转换的 `file://` URL。
    - `options`（可选对象）：
      - `windows`（布尔值）- 如果 `path` 应作为 Windows 文件路径返回，则为 `true`；对于 posix，则返回 `false`；对于系统默认值，则返回 `undefined`。默认值：`undefined`。
  * **返回值**：转换后的文件系统路径（字符串）。

* **查询参数和哈希值会被忽略**

  ```js
  import { fileURLToPath } from 'node:url';
  
  const fileUrl = new URL('file://home/user/docs/index.html?lang=en#section');
  const filePath = fileURLToPath(fileUrl);
  
  console.log(filePath); // 输出: \\home\user\docs\index.html 查询参数和哈希值被忽略
  ```

* **将 `import.meta.url` 转换为文件路径**: 在 `ESM` 模块中, 不支持 `__dirname` 全局变量，此时可转换 `import.meta.url` 获取当前文件的路径

  ```js
  import { fileURLToPath } from 'node:url';
  
  const __dirname = fileURLToPath(import.meta.url);
  
  console.log(__dirname); // 输出: D:\demo\node\src\test.ts
  ```

### url.pathToFileURL(path[, options])

* **方法**: `url.pathToFileURL(path[, options])`

  * **作用**: 将本地文件系统路径转换为标准的 `file://` URL，自动处理不同操作系统的路径格式差异
  * **参数**：
    - `path`（字符串）- 要转换的文件系统路径。
    - `options`（可选对象）：
      - `windows`（布尔值）- 如果 path 应该被视为 Windows 文件路径，则为 true；对于 posix，则为 false；对于系统默认值，则为 undefined。默认值：undefined。
  * **返回值**：转换后的 `file://` URL 对象。

* **相对路径**: 会自动根据当前目录规范为绝对路径

  ```js
  import { pathToFileURL } from 'node:url';
  
  const fileUrl = pathToFileURL('docs/README.md');
  
  console.log(fileUrl.href); // file:///D:/wzb_knowledge_base/demo/node/docs/README.md
  ```

* **自动编码**: 特殊字符会被自动编码

* **路径规范化**: 路径会自动规范化

  ```js
  import { pathToFileURL } from 'node:url';
  
  const filePath = '/home/user/../docs/file.txt';
  const fileUrl = pathToFileURL(filePath);
  
  console.log(fileUrl.href); // 输出: file:///D:/home/docs/file.txt（已规范化）
  ```

### url.domainToASCII(domain)

* **方法**: `url.domainToASCII(domain)`
  * **作用**: 将包含非 ASCII 字符的域名转换为 Punycode 编码的 ASCII 字符串（即 "xn--" 格式），确保域名能被互联网基础设施正确处理
  * **参数**：
    - `domain`（字符串）- 要转换的国际化域名（如 `example.中国`）。
  * **返回值**：转换后的 Punycode 编码字符串（如 `example.xn--fiqs8s`）。
  * **依赖**：内部使用 `punycode` 模块（Node.js 内置）进行转换。

```js
import { domainToASCII } from 'node:url';

const asciiDomain = domainToASCII('example.中国');
console.log(asciiDomain); // 输出: example.xn--fiqs8s
```

### url.domainToUnicode(domain)

* **方法**: `url.domainToUnicode(domain)`
  * **作用**: 将**Punycode 编码的 ASCII 域名（如 "xn--" 格式）转换为人类可读的 Unicode 形式**。
  * **参数**：
    - `domain`（字符串）- 要转换的 Punycode 编码域名（如 `xn--fiqs8s.com`）。
  * **返回值**：转换后的 Unicode 域名（如 `中文.com`）。
  * **依赖**：内部使用 `punycode` 模块（Node.js 内置）进行转换。

## 旧版 URL API

已过时, 改用 `WHATWG URL API`。