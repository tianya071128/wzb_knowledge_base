# 可写流（Writable）

可写流是数据写入目标的抽象。

[`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 流的示例包括：

- [客户端上的 HTTP 请求](https://nodejs.cn/api/http.html#class-httpclientrequest)
- [在服务器上的 HTTP 响应](https://nodejs.cn/api/http.html#class-httpserverresponse)
- [文件系统写入流](https://nodejs.cn/api/fs.html#class-fswritestream)
- [zlib 流](https://nodejs.cn/api/zlib.html)
- [加密流](https://nodejs.cn/api/crypto.html)
- [TCP 套接字](https://nodejs.cn/api/net.html#class-netsocket)
- [子进程标准输入](https://nodejs.cn/api/child_process.html#subprocessstdin)
- [`process.stdout`](https://nodejs.cn/api/process.html#processstdout), [`process.stderr`](https://nodejs.cn/api/process.html#processstderr)

其中一些示例实际上是实现 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 接口的 [`Duplex`](https://nodejs.cn/api/stream.html#class-streamduplex) 流。

所有的 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 流都实现了 `stream.Writable` 类定义的接口。

## 工作原理

- 数据通过 `write()` 方法写入可写流的内部缓冲区。
- 缓冲区数据满时，流会暂停接收新数据（通过 `write()` 返回 `false` 标识）。
- 缓冲区数据处理完毕后，触发 `drain` 事件，通知数据源可继续发送数据（背压机制）。

## 可写流的生命周期阶段

可写流的生命周期可分为 **6 个核心阶段**，每个阶段对应特定的状态和事件：

* **初始化阶段（Created）**
  * **状态**：流被创建但未开始写入数据。
* **写入阶段（Writing）**: 缓冲区数据被处理完毕后触发 `drain` 事件
  * **状态**：通过 `write()` 方法向流中写入数据，数据暂存于内部缓冲区。
  * **关键事件**：
    - `drain`：缓冲区数据被处理完毕后触发，通知可继续写入。
* **结束写入阶段（Finishing）**: 
  * **状态**：调用 `end()` 方法后，流停止接收新数据，开始处理剩余缓冲数据。
  * **特点**：
    - 调用 `end()` 后不能再调用 `write()`，否则会报错。
    - 流会将缓冲区中剩余数据写入底层系统（如文件、网络）。
* **完成阶段（Finished）**:
  * **状态**：所有缓冲数据已被成功写入底层系统，写入流程正常完成。
  * **关键事件**：
    - `finish`：标识数据写入完成，是业务逻辑的重要节点。
* **关闭阶段（Closing）**:
  * **状态**：流开始释放底层资源（如文件描述符、网络连接）。
  * **触发时机**：`finish` 事件后，或调用 `destroy()` 后。
* **关闭完成阶段（Closed）**:
  * **状态**：底层资源已完全释放，流彻底终止，无法再使用。
  * **关键事件**：
    - `close`：标识资源释放完成，流生命周期结束。

## 创建可写流

### 使用内置模块

Node.js 内置模块提供了多种可写流实现：

```js
const fs = require('fs');
// 文件可写流
const writeStream = fs.createWriteStream('output.txt', {
  encoding: 'utf8',         // 字符编码（默认 null，二进制）
  highWaterMark: 16 * 1024, // 缓冲区大小（默认 16KB）
  flags: 'w'                // 文件打开模式（默认 'w'）
});
```

### 自定义可写流

通过继承 `stream.Writable` 类实现自定义逻辑：...

## 事件

### 状态事件

#### 事件: finish

* **事件**: `writable.on('finish', listener)`
  
  * **作用**: `finish` 事件在调用 `end()` 方法后，且可写流内部缓冲区中的所有数据都已被**成功写入底层系统**（如文件系统、网络连接）时触发。
  * **触发时机**: 
      1. 必须先调用 `writable.end()` 方法（显式结束写入）。
      2. 流内部缓冲区中的所有数据已被完全处理（写入底层）。
  * **函数处理器的接收参数**: 无
  
* **特性**

  * 与其他类似事件的差异：

    | 事件     | 触发时机                           | 核心含义                         | 典型用途                         |
    | -------- | ---------------------------------- | -------------------------------- | -------------------------------- |
    | `finish` | 调用 `end()` 且所有数据写入底层后  | 数据处理**正常完成**，无残留数据 | 确认写入完成，执行后续操作       |
    | `close`  | 流的底层资源（如文件描述符）释放后 | 资源**彻底释放**，流无法再使用   | 清理外部资源（如关闭数据库连接） |
    | `drain`  | 缓冲区从满状态变为空状态时         | 缓冲区排空，可继续写入数据       | 背压处理，恢复数据写入           |
  * **异常流程或手动销毁流不会触发该事件**

#### 事件: close

* **事件**: `writable.on('close', listener)`
* **作用**: `close` 事件在可写流的**底层资源（如文件描述符、网络连接、管道等）被完全关闭和释放**后触发。
  
* **触发时机**: 
  
  * 正常流程：`finish` 事件触发后，底层资源释放完成。
  
  * 异常流程：调用 `destroy()` 后，或发生错误后，资源强制释放完成。
  
* **函数处理器的接收参数**: 无
* **特性**
  * 该事件表明将不再触发更多事件，并且不会发生进一步的计算。
  * **触发场景与流程**:
    * 正常流程（无错误）: `write()` 写入数据 → `end()` 结束写入 → `finish` 事件 → `close` 事件。
    * 异常流程（发生错误）: 写入错误 → `error` 事件 → `close` 事件（不触发 `finish`）。
    * 手动销毁流（destroy()）:  调用 `destroy()` →（可选 `error` 事件）→ `close` 事件（不触发 `finish`）。
  * 无论流是正常结束、发生错误还是被手动销毁，`close` 事件**最终一定会触发**（除非进程崩溃）。这使其成为资源清理的可靠节点。

#### 事件: pipe

* **事件**: `writable.on('pipe', listener)`
  * **作用**: `pipe` 事件在可读流调用 `pipe(destination)` 方法并成功与当前可写流（`destination`）建立管道连接时触发。
  * **触发时机**: `readable.pipe(writable)` 方法调用后，管道连接建立的瞬间（早于数据开始传输）。
  * **函数处理器的接收参数**: 
    * `src` [\<stream.Readable> ](https://nodejs.cn/api/stream.html#class-streamreadable) 通过管道传输到此可写的源流，即数据的来源流。
* **特性**
  * `pipe` 事件在管道建立后、数据开始传输前触发，因此可安全地在事件回调中执行初始化操作（如设置编码、初始化状态），不会错过任何数据

#### 事件: unpipe

* **事件**: `writable.on('unpipe', listener)`
  * **作用**:  `unpipe` 事件在可读流调用 `unpipe(destination)` 方法，且与当前可写流（`destination`）的管道连接被成功解除时触发。
  * **触发时机**: `readable.unpipe(writable)` 方法调用后，管道连接实际断开的瞬间（可能仍有残留数据在缓冲区）
  * **函数处理器的接收参数**: 
    * `src` [\<stream.Readable> ](https://nodejs.cn/api/stream.html#class-streamreadable) 通过管道传输到此可写的源流，即数据的来源流。
* **特性**
  * `unpipe` 与 `pipe` 事件共同监控**管道的完整生命周期**

### 数据事件（处理状态）

#### 事件: drain

* **事件**: `writable.on('drain', listener)`

  * **作用**:  当可写流的内部缓冲区从 “满状态” 变为 “空状态”（所有缓冲数据已被写入底层系统）时，`drain` 事件会被触发。
  * **触发时机**: 
    1. 调用 `write()` 方法返回 `false`（表示缓冲区已满）。
    2. 缓冲区中的所有数据被彻底写入到底层系统（如文件系统、网络）。
  * **函数处理器的接收参数**: 无

* **特性**

  * 与 `write()` 方法的关联

    ```plaintext
    数据源 → write() → 缓冲区未满 → 继续写入（write 返回 true）
             ↓
    缓冲区已满 → write 返回 false → 暂停写入
             ↓
    缓冲区数据被处理 → 触发 drain 事件 → 恢复写入
    ```

  * **只有当 `write()` 返回 `false` 后，`drain` 事件才可能触发**。若 `write()` 始终返回 `true`（缓冲区未满），则永远不会触发 `drain`。

* **示例**: 在 HTTP 响应中，通过 `drain` 事件控制向客户端发送数据的速度

  ```js
  const http = require('http');
  const fs = require('fs');
  
  http.createServer((req, res) => {
    const readStream = fs.createReadStream('large-download.zip');
    
    readStream.on('data', (chunk) => {
      // 向客户端发送数据
      const canSend = res.write(chunk);
      if (!canSend) {
        readStream.pause(); // 客户端接收慢，暂停读取
      }
    });
    
    // 客户端缓冲区排空后继续发送
    res.on('drain', () => {
      readStream.resume();
    });
    
    readStream.on('end', () => {
      res.end(); // 发送完成
    });
  }).listen(3000);
  ```

#### 事件: error

* **事件**: `writable.on('error', listener)`
  * **作用**:  `error` 事件在可写流执行过程中发生异常（如权限不足、磁盘空间不足、无效连接等）时触发。
  * **触发场景**: 
    * 调用 `write()` 或 `end()` 时发生数据处理错误（如无效数据格式）。
    * 底层资源访问失败（如文件权限不足、磁盘满、网络断开）。
    * 流状态异常（如对已关闭的流调用 `write()`）。
  * **函数处理器的接收参数**: 
    * `err`（错误对象，包含错误信息）
* **特性**
  * 最好监听 `error` 事件, 否则未处理的错误一般会导致进程崩溃。
  * 在 `'error'` 之后，除 `'close'` 之外不应再触发其他事件（包括 `'error'` 事件）。

## 方法

### 数据写入类方法

这类方法用于向可写流写入数据，是可写流最核心的功能接口。

#### 写入数据: writable.write()

- **方法**: `writable.write(chunk[, encoding][, callback])`
  - **作用**: 向可写流的内部缓冲区写入数据块，数据会异步地被传输到底层系统（如文件、网络连接、控制台等）。
  - **参数**：
    - **`chunk`**（必填）：`Buffer`、`string` 或**对象模式下的任意 JavaScript 对象**。要写入的数据块，是流处理的基本单位。
    - **`encoding`**（可选）：当 `chunk` 为字符串时，指定字符编码（如 `'utf8'`、`'base64'`、`'hex'` 等）。默认值：`'utf8'`
    - **`callback`**（可选）：`function(err)`。数据块**成功进入内部缓冲区**后触发的回调函数（非数据写入底层系统的回调）。若数据块进入缓冲区失败，会传入错误对象（通常为同步错误）。
  - **返回值**:
    - **`true`**：内部缓冲区未满（未达到 `highWaterMark` 阈值），可以继续调用 `write()` 写入新数据。
    - **`false`**：内部缓冲区已满，应停止写入并等待 `drain` 事件触发后再继续（背压控制）。

* **特性**
  * 当流没有排空时，对 `write()` 的调用将缓冲 `chunk`，并返回 false。一旦所有当前缓冲的块都被排空（操作系统接受交付），则将触发 `'drain'` 事件。一旦 `write()` 返回 false，则在 `'drain'` 事件触发之前不要写入更多块。
  * **虽然允许在未排空的流上调用 `write()`，但 Node.js 将缓冲所有写入的块**，直到出现最大内存使用量，此时它将无条件中止。
  * `write()` 方法的执行流程可分为以下步骤：
    1. 将 `chunk` 转换为适合底层处理的格式（如字符串转 `Buffer`）。
    2. 将数据块添加到可写流的内部缓冲区。
    3. 底层系统（如文件系统、网络层）异步地从缓冲区读取数据并处理。
    4. 返回 `true` 或 `false` 告知调用者当前缓冲区状态。

#### 结束写入数据: writable.end()

- **方法**: `writable.end([chunk][, encoding][, callback])`
  - **作用**: 通知可写流 “后续没有更多数据需要写入”，并将缓冲区中剩余数据写入底层系统，最终触发 `finish` 事件。
  - **参数**：
    - **`chunk`**（可选）：`Buffer`、`string` 或**对象模式下的任意 JavaScript 对象**。要写入的数据块，是流处理的基本单位。
    - **`encoding`**（可选）：当 `chunk` 为字符串时，指定字符编码（如 `'utf8'`、`'base64'`、`'hex'` 等）。默认值：`'utf8'`
    - **`callback`**（可选）：`function(err)`。数据块**成功进入内部缓冲区**后触发的回调函数（非数据写入底层系统的回调）。若数据块进入缓冲区失败，会传入错误对象（通常为同步错误）。
  - **返回值**:
    - **`true`**：内部缓冲区未满（未达到 `highWaterMark` 阈值），可以继续调用 `write()` 写入新数据。
    - **`false`**：内部缓冲区已满，应停止写入并等待 `drain` 事件触发后再继续（背压控制）。

* **特性**
  * `end()` 方法的执行流程如下：
    1. 若提供 `chunk`，先将其写入内部缓冲区（类似 `write()` 方法）。
    2. 标记流为 “结束状态”（`writable._writableState.finished = true`），禁止后续 `write()` 调用。
    3. 异步处理缓冲区中所有剩余数据，将其写入底层系统。
    4. 所有数据处理完成后，触发 `finish` 事件，并执行 `callback`（若提供）。
    5. 最终释放底层资源，触发 `close` 事件。
  * 在调用 [`stream.end()`](https://nodejs.cn/api/stream.html#writableendchunk-encoding-callback) 之后调用 [`stream.write()`](https://nodejs.cn/api/stream.html#writablewritechunk-encoding-callback) 方法将引发错误。

### 流控制类方法

这类方法用于控制流的状态（如暂停、恢复）和缓冲区行为。

#### 缓冲模式: writable.cork()

- **方法**: `writable.cork()`
  - **作用**: 暂停数据向底层系统的输出，将后续通过 write() 写入的数据暂时缓冲在内存中，直到调用 writable.uncork() 或 end() 时，再将所有缓冲数据一次性一次性写入底层。
  - **参数**：无
  - **返回值**: 无

* **特性**

  * `cork()` 的工作机制可分为三个阶段：

    1. **开启缓冲**：调用 `cork()` 后，可写流进入 “缓冲模式”，后续调用 `write()` 的数据不会立即写入底层，而是暂存于内部缓冲区。
    2. **累积数据**：所有通过 `write()` 写入的数据会被合并到一个缓冲队列中，直到调用 `uncork()` 或 `end()`。
    3. **批量输出**：调用 `uncork()`或 `end()` 后，缓冲队列中的所有数据会被一次性写入底层系统，触发一次底层 I/O 操作。

    > **注意**：`cork()` 可嵌套调用（多次调用），此时需调用相同次数的 `uncork()` 才能触发数据输出（如调用 2 次 `cork()`，需调用 2 次 `uncork()`）。或者调用一次 `end()` 时也会触发数据输出

  * 调用 `end()` 会自动触发缓冲数据输出，无需手动 `uncork()`

  * `cork()` 会将数据缓存在内存中，若长时间不调用 `uncork()` 或 `end()`，可能导致内存占用过高（尤其高频写入场景）

  * 在 `cork()` 模式下，`write()` 始终返回 `true`（无论缓冲区是否已满），因为数据不会被立即处理。

  * `writable.cork()` 是优化小数据块高频写入的关键方法，其核心价值在于通过合并写入操作减少底层 I/O 开销

* **示例**

  ```js
  const writeStream = fs.createWriteStream('nested.txt');
  
  writeStream.cork(); // 第一次 cork
  writeStream.write('第一部分数据');
  
  writeStream.cork(); // 第二次 cork
  writeStream.write('第二部分数据');
  
  // 第一次 uncork：缓冲不输出（需匹配 cork 次数）
  writeStream.uncork();
  
  // 第二次 uncork：缓冲数据一次性输出
  writeStream.uncork();
  ```

#### 结束缓冲模式: writable.uncork()

- **方法**: `writable.uncork()`
  - **作用**: 解除 `cork()` 开启的缓冲模式，将 `cork()` 后通过 `write()` 写入的所有缓冲数据一次性写入底层系统（如文件、网络），并恢复正常的流写入行为。
  - **参数**：无
  - **返回值**: 无

* **特性**
  * `uncork()` 的执行流程如下：
    1. **检查缓冲状态**：验证流是否处于 `cork()` 开启的缓冲模式（通过内部计数器 `_writableState.corked` 判断）。
    2. **递减缓冲计数器**：每次调用 `uncork()` 会将缓冲计数器减 1（`cork()` 调用会递增计数器）。
    3. **触发数据输出**：当缓冲计数器减至 0 时，将所有缓冲数据按顺序合并，一次性写入底层系统。
    4. **恢复正常写入**：缓冲数据输出后，流退出缓冲模式，后续 `write()` 调用会按正常逻辑处理（受 `highWaterMark` 阈值控制）。
  * `uncork()` 触发的数据输出是异步的，即调用 `uncork()` 后数据不会立即写入底层，而是在当前事件循环的末尾执行。

#### 设置默认字符编码: writable.setDefaultEncoding()

- **方法**: `writable.setDefaultEncoding(encoding)`
  - **作用**: 为可写流设置默认字符编码，当调用 write()` 方法写入字符串数据且未指定编码时，将使用此默认编码进行转换（通常转为 Buffer 供底层处理）。
  - **参数**：
    - **`encoding`**（必填）：指定默认字符编码
  - **返回值**: 无

* **特性**

  * 默认编码仅影响字符串类型的 `chunk`，对 `Buffer` 或对象模式下的对象无作用

    ```js
    const stream = fs.createWriteStream('demo.txt');
    stream.setDefaultEncoding('base64');
    
    // 写入 Buffer（编码参数被忽略）
    stream.write(Buffer.from('hello')); // 直接写入 Buffer 内容，不涉及编码转换
    ```

### 生命周期管理类方法

这类方法用于终止流、销毁资源或查询流状态。

#### 销毁流: writable.destroy()

- **方法**: `writable.destroy([error])`
  - **作用**: 立即终止可写流的所有操作，释放底层资源（如文件描述符、网络连接等），并触发流的销毁流程。
  - **参数**：
    - **`error`**（可选）：`Error` 对象。若提供，流会触发 `error` 事件，将此错误对象传递给监听器。
  - **返回值**: 流实例本身

* **特性**
  * `destroy()` 方法的执行流程如下：
    1. **标记销毁状态**：将流的内部状态 `_writableState.destroyed` 设为 `true`，禁止后续的 `write()`、`end()` 等操作。
    2. **处理错误（可选）**：若传入 `error` 对象，触发流的 `error` 事件。
    3. **释放资源**：调用内部的 `_destroy()` 方法（自定义流可重写此方法实现资源清理）。
    4. **触发关闭事件**：资源释放完成后，触发 `close` 事件，标识流生命周期结束。
  * **关键区别**：与 `end()` 不同，`destroy()` 不会等待缓冲区中的数据处理完成，可能导致数据丢失（这是强制终止的代价）。

## 属性

### 状态属性

#### 是否可写入数据: writable.writable

- **只读属性**: `writable.writable`
  
  - **作用**：用于指示可写流是否处于可以接收数据的状态。
  - **类型**：布尔值（`true`/`false`）。
  
- **特性**

  - 状态转换时机:

    - **初始化为 `true`**
    - **调用 `end()` 后变为 `false`**: 调用 `end()` 方法后，流进入 “结束阶段”，即使缓冲区仍有数据未处理，`writable` 也会立即变为 `false`，禁止后续写入
    - **调用 `destroy()` 后变为 `false`**

  - **与相关状态的区别**

    | 属性                        | 核心含义                      | 状态转换时机                               | 典型场景                           |
    | --------------------------- | ----------------------------- | ------------------------------------------ | ---------------------------------- |
    | `writable.closed`           | 流是否完全关闭并释放资源      | 流触发 `close` 事件后变为 `true`           | 确认资源已释放（如文件句柄关闭）。 |
    | `writable.writable`         | 流是否可接收数据              | 调用 `end()` 或 `destroy()` 后变为 `false` | 判断是否可调用 `write()` 方法。    |
    | `writable.destroyed`        | 流是否被 `destroy()` 强制终止 | 调用 `destroy()` 后立即变为 `true`         | 判断流是否因异常被强制终止。       |
    | `writable.writableFinished` | 流是否正常完成所有写入操作    | 在触发 `finish` 事件变为 `true`            | 确认数据完整写入                   |

#### 是否关闭: writable.closed

- **只读属性**: `writable.closed`
  - **作用**：用于指示可写流是否已完成所有操作并释放了所有关联的底层资源（如文件描述符、网络连接等）。
  - **类型**：布尔值（`true`/`false`）。
- **特性**
  - **转换的不可逆性**：`closed` 一旦变为 `true`，将永久保持 `true`（流的最终状态不可逆转）。

#### 是否销毁: writable.destroyed

- **只读属性**: `writable.destroyed`
  - **作用**：用于指示可写流是否已通过 `writable.destroy()` 方法被强制终止。
  - **类型**：布尔值（`true`/`false`）。
- **特性**
  - 一旦调用 `destroy()` 方法，`destroyed` 会**同步变为 `true`**，无论资源是否释放完成。这意味着该属性反映的是 “销毁操作已触发”，而非 “资源已释放”

#### 是否正常结束: writable.writableFinished

- **只读属性**: `writable.writableFinished`
  - **作用**：用于指示可写流是否已通过 `writable.end()` 方法正常结束，且所有缓冲数据已成功写入底层系统。
  - **类型**：布尔值（`true`/`false`）。
- **特性**
  - **状态转换时机**
    - **初始化为 `false`**
    - **在触发 [`'finish'`](https://nodejs.cn/api/stream.html#event-finish) 事件之前立即设置为 `true`**

#### 错误信息: writable.errored

- **只读属性**: `writable.errored`
  - **作用**：用于存储错误对象的属性，当可写流发生错误（且未被销毁）时，该属性会被设置为对应的 `Error` 对象；若流未发生错误或已被销毁，则为 `null`。
  - **类型**：[\<Error> ](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 或者 `null`
- **特性**
  - **状态变化时机**:
    - **初始化为 `null`**
    - **流发生错误时被设置为 `Error` 对象**
    - **流被销毁后重置为 `null`**：调用 `destroy()` 方法（无论是否传入错误）后，`errored` 会被重置为 `null`，因为销毁操作会终结流的错误状态。

### 其他属性

#### 是否可读取数据: writable.writableHighWaterMark

- **只读属性**: `writable.writableHighWaterMark`
  - **作用**：`writable.writableHighWaterMark` 是一个数字属性，表示可写流内部缓冲区的阈值大小（以字节或对象数量为单位）。当缓冲数据量超过此阈值时，流会通过 `write()` 方法返回 `false` 来提示调用者暂停写入，从而避免缓冲区无限制增长导致的内存问题。
  - **类型**：数字
- **特性**
  - 返回创建此 `Writable` 时传入的 `highWaterMark` 的值。

#### 是否可读取数据: writable.writableLength

- **只读属性**: `writable.writableLength`
  - **作用**：`writable.writableLength` 是一个数字属性，**表示当前可写流内部缓冲区中等待写入到底层系统的数据总量**（以字节或对象数量为单位）。
  - **类型**：数字
- **特性**
  - 实时反映缓冲数据的积压情况，帮助判断流的负载状态。
















