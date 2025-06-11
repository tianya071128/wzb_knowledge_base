# Blob 类和 File 类

从 **Node.js 18.x** 版本开始，Node.js 引入了 `Blob` 类、`File` 类的实现，以增强与浏览器环境的兼容性。

## Blob 类

[`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 封装了**不可变**的原始数据，可以在多个工作线程之间安全地共享。

### 原型链

**注意: Blob 的原型链并不继承 Buffer**

```plaintext
┌─────────────────────────────────────────────────────────────────┐
│                           null                                  │
│                         (原型链终点)                             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Object.prototype                            │
│  (所有对象的基类，包含 toString(), hasOwnProperty() 等方法)       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Blob.prototype                               │
│  (Blob 类的原型，包含 slice(), stream(), text(), arrayBuffer() 等)│
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     实例: new Blob(...)                          │
│  (包含 size, type 属性，以及从原型继承的所有方法)                 │
└─────────────────────────────────────────────────────────────────┘
```

### 基本概念

- **不可变性**：`Blob` 一旦创建就不可修改，任何操作都会返回新的 `Blob`。
- **二进制数据**：可以包含文本或二进制数据。
- **类型**：通过 `type` 属性指定 MIME 类型（如 `image/png`、`application/json`）。

### 创建 Blob

在 Node.js 中，`new buffer.Blob()` 是用于创建二进制大对象（Blob）的构造函数。

- **语法**: `new Blob([sources[, options]])`

  - **作用**: 用于创建二进制大对象（Blob）
  - **参数**：
    - **`sources`**（可选）：一个数组，包含要合并到 Blob 中的数据。可以是：
      - 字符串
      - `Buffer` 或 `Uint8Array` 等二进制数据
      - 其他 `Blob` 对象
    - **`options`**（可选）：一个对象，包含以下属性：
      - **`type`**（字符串）：指定 Blob 的 MIME 类型（如 `'text/plain'`），默认值为空字符串。
      - **`endings`**: `'transparent'` 或 `'native'` 之一。设置为 `'native'` 时，字符串源部分中的行结束将转换为 `require('node:os').EOL` 指定的平台原生行结束。

- **注意事项**:

  - **字符编码**：如果传入的是字符串, 那么总是编码为 `UTF-8` 字节序列并复制到 Blob 中。
  - **内存管理**：Blob 内容存储在内存中，处理大文件时建议使用流或分块处理。
  - **MIME 类型**：`type` 参数仅为标识，不会验证实际内容类型。

- **示例**：

  ```js
  const buffer = Buffer.from('hello world');
  // 从多个数据源创建 Blob
  const combinedBlob = new Blob(
    [
      'Header\n', // 字符串
      buffer, // Buffer
      new Uint8Array([1, 2, 3]), // Uint8Array
    ],
    { type: 'text/mixed' }
  );
  console.log(combinedBlob); // Blob { size: 21, type: 'text/mixed' }
  ```

### 实例方法

#### Blob.slice(): 截取 Blob

- **语法**: `blob.slice([start[, end[, type]]])`

  - **作用**: 用于创建一个新的 `Blob` 对象，该对象包含原 `Blob` 的部分内容。
  - **参数**：
    - **`start`**（可选）：开始位置（字节索引），默认值为 `0`。负值表示从末尾倒数（如 `-10` 表示倒数第 10 个字节）。
    - **`end`**（可选）：结束位置（字节索引，不包含该位置），默认值为 `blob.size`。负值同理。
    - **`contentType`**（可选）：新 `Blob` 的 MIME 类型，默认继承原 `Blob` 的类型。
  - **返回值**: 返回包含此 `Blob` 对象数据子集的新 `Blob`。

- **核心特性**

  - **非破坏性操作**：`slice()` 不会修改原 `Blob`，而是返回一个新的 `Blob`。

- **字节级精确截取**：按字节索引进行截取，适用于二进制数据（如图片、视频）。

  - **支持负索引**：负值表示从末尾开始计算位置。

- **示例**:

  ```js
  const originalBlob = new Blob(['abcdef']);
  const slicedBlob = originalBlob.slice(1, 4); // 截取索引 1-3（"bcd"）

  console.log(slicedBlob.size); // 输出: 3
  slicedBlob.text().then((text) => console.log(text)); // 输出: "bcd"
  ```

#### blob.text(): 转换为字符串

- **语法**: `blob.text()`

  - **作用**: **异步将 `Blob` 内容转换为字符串**
  - **参数**: 无
  - **返回值**: 返回一个 `Promise`，解析为 `Blob` 内容的字符串表示。

- **核心特性**:

  - **异步操作**：内部可能涉及文件读取或网络请求，因此返回 `Promise`。
  - **自动解码**：直接将二进制数据转换为字符串，无需手动处理编码。**默认使用 UTF-8 编码，不支持其他编码（如 GBK、ISO-8859-1）。**
  - **不可变操作**：不会修改原 `Blob`，仅返回解码后的字符串。

- **示例**

  ```js
  const blob = new Blob(['Hello, Node.js!']);
  blob.text().then((text) => {
    console.log(text); // 输出: "Hello, Node.js!"
  });
  ```

### 实例属性

#### blob.size: 总大小

* **blob.size**: `Blob` 的总大小（以字节为单位）。

#### blob.type: 内容类型

* **blob.type**: `Blob` 的内容类型。



## File 类

在 Node.js 中，**`File` 类是[浏览器 `File API` ](https://developer.mozilla.org/zh-CN/docs/Web/API/File)的服务器端实现**，用于表示文件对象。它继承自 `Blob`，并添加了与文件系统相关的元数据（如文件名、修改时间）。

### 核心作用

1. **继承了 Blob 的方法**: 支持流式处理、切片等操作，适合大文件处理
2. **模拟浏览器文件对象**：使 Node.js 能够处理与浏览器一致的文件 API，便于编写跨平台代码。
3. **文件元数据管理**：提供文件名、大小、修改时间等属性，无需直接访问文件系统。

### 创建 File

在 Node.js 中，`new buffer.File()` 用于创建 `File` 的构造函数。

* **语法**: `new buffer.File(sources, fileName[, options])`

  * **作用**: 创建 File 对象
  * **参数**: 
    * **sources（必需）**: 一个数组，文件内容的数据源，会按顺序合并为文件内容。包含字符串、`Buffer`、`Uint8Array` 或其他 `Blob` 对象
    * **fileName（必需）**：文件的名称（包含扩展名），用于元数据。
    * **`options`（可选）**：
      * **type**：文件的 MIME 类型（小写），默认值为空字符串。
      * **lastModified**：文件的最后修改时间，默认值为当前时间。

  







