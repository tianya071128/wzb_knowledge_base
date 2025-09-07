# 可读流（Readable）

可读流是对消费数据源的抽象。

`Readable` 流的示例包括：

- [客户端上的 HTTP 响应](https://nodejs.cn/api/v22/http.html#class-httpincomingmessage)
- [服务器上的 HTTP 请求](https://nodejs.cn/api/v22/http.html#class-httpincomingmessage)
- [文件系统读取流](https://nodejs.cn/api/v22/fs.html#class-fsreadstream)
- [zlib 流](https://nodejs.cn/api/v22/zlib.html)
- [加密流](https://nodejs.cn/api/v22/crypto.html)
- [TCP 套接字](https://nodejs.cn/api/v22/net.html#class-netsocket)
- [子进程标准输出和标准错误](https://nodejs.cn/api/v22/child_process.html#subprocessstdout)
- [`process.stdin`](https://nodejs.cn/api/v22/process.html#processstdin)

所有的 [`Readable`](https://nodejs.cn/api/v22/stream.html#class-streamreadable) 流都实现了 `stream.Readable` 类定义的接口。

## 两种读取模式

`Readable` 流以两种模式之一有效运行：流动和暂停

* 在流动模式下，数据会自动从底层系统读取，并通过 [`EventEmitter`](https://nodejs.cn/api/v22/events.html#class-eventemitter) 接口使用事件尽快提供给应用。
* 在暂停模式下，必须显式调用 [`stream.read()`](https://nodejs.cn/api/v22/stream.html#readablereadsize) 方法以从流中读取数据块。

**所有的 [`Readable`](https://nodejs.cn/api/v22/stream.html#class-streamreadable) 流都以暂停模式开始，但可以通过以下方式之一切换到流动模式**：

- 添加 [`'data'`](https://nodejs.cn/api/v22/stream.html#event-data) 事件句柄。
- 调用 [`stream.resume()`](https://nodejs.cn/api/v22/stream.html#readableresume) 方法。
- 调用 [`stream.pipe()`](https://nodejs.cn/api/v22/stream.html#readablepipedestination-options) 方法将数据发送到 [`Writable`](https://nodejs.cn/api/v22/stream.html#class-streamwritable)。

**`Readable` 可以使用以下方法之一切换回暂停模式**：

- 如果没有管道目标，则通过调用 [`stream.pause()`](https://nodejs.cn/api/v22/stream.html#readablepause) 方法。
- 如果有管道目标，则删除所有管道目标。可以通过调用 [`stream.unpipe()`](https://nodejs.cn/api/v22/stream.html#readableunpipedestination) 方法删除多个管道目标。

### 重要概念

1. 在提供消费或忽略该数据的机制之前，`Readable` 不会产生数据。如果消费机制被禁用或取消，`Readable` 将尝试停止生成数据。
2. 出于向后兼容性的原因，删除 [`'data'`](https://nodejs.cn/api/v22/stream.html#event-data) 事件处理程序不会自动暂停流。
3. **如果 [`Readable`](https://nodejs.cn/api/v22/stream.html#class-streamreadable) 切换到流动模式并且没有消费者可用于处理数据，则数据将被丢失**。例如，当调用 `readable.resume()` 方法而没有绑定到 `'data'` 事件的监听器时，或者当从流中删除 `'data'` 事件句柄时，就会发生这种情况。
4. 添加 [`'readable'`](https://nodejs.cn/api/v22/stream.html#event-readable) 事件句柄会自动使流停止流动，并且必须通过 [`readable.read()`](https://nodejs.cn/api/v22/stream.html#readablereadsize) 来消费数据。如果删除了 [`'readable'`](https://nodejs.cn/api/v22/stream.html#event-readable) 事件句柄，则如果有 [`'data'`](https://nodejs.cn/api/v22/stream.html#event-data) 事件句柄，流将再次开始流动

## 三种状态

`Readable` 流的 "两种模式" 操作是对 `Readable` 流实现中发生的更复杂的内部状态管理的简化抽象。

具体来说，在任何给定的时间点，每个 `Readable` 都处于三种可能的状态之一：

- `readable.readableFlowing === null`
- `readable.readableFlowing === false`
- `readable.readableFlowing === true`

当 `readable.readableFlowing` 为 `null` 时，则不提供消费流数据的机制。因此，流不会生成数据。在此状态下，为 `'data'` 事件绑定监听器、调用 `readable.pipe()` 方法、或调用 `readable.resume()` 方法会将 `readable.readableFlowing` 切换到 `true`，从而使 `Readable` 在生成数据时开始主动触发事件。

调用 `readable.pause()`、`readable.unpipe()` 或接收背压将导致 `readable.readableFlowing` 设置为 `false`，暂时停止事件的流动但不会停止数据的生成。在此状态下，为 `'data'` 事件绑定监听器不会将 `readable.readableFlowing` 切换到 `true`。

| 初始状态 | 操作                          | 新状态  | 说明                       |
| -------- | ----------------------------- | ------- | -------------------------- |
| `null`   | 监听 `data` 事件              | `true`  | 进入流动模式，数据自动推送 |
| `null`   | 调用 `resume()`               | `true`  | 进入流动模式               |
| `null`   | 监听 `readable` 事件          | `false` | 进入暂停模式，需手动读取   |
| `true`   | 调用 `pause()`                | `false` | 从流动模式切换到暂停模式   |
| `true`   | 移除所有 `data` 事件监听器    | `null`  | 回到初始状态，数据不再流动 |
| `false`  | 调用 `resume()` 或监听 `data` | `true`  | 从暂停模式切换到流动模式   |
| `false`  | 移除所有 `readable` 监听器    | `null`  | 回到初始状态               |

```js
import { PassThrough, Writable } from 'node:stream';
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);// 调用 unpipe 方法将 readableFlowing 改变为 false

// 即使添加了 data 事件, 但不会被触发
pass.on('data', (chunk) => { console.log(chunk.toString()); });
pass.write('ok');  // 不会发出 data 事件

// readableFlowing 改变为 true.
pass.resume();     // 必须调用以使流触发 “data” 事件。 --> 触发一次 data 事件, 将 ok 数据发送
```

## 创建流

创建可读流（Readable Stream）有两种主要方式：**使用内置模块**和**自定义实现**。

### 使用内置模式

许多 Node.js 模块提供了预构建的可读流，例如文件读取：

```js
import { createReadStream } from 'node:fs';

// 创建文件可读流
const readStream = createReadStream('./01_path.ts', {
  encoding: 'utf8', // 字符编码（可选）
  highWaterMark: 0.5 * 1024, // 缓冲区大小（64KB，默认 16KB）
  start: 0, // 开始读取的字节位置
  end: 10000, // 结束读取的字节位置（包含）
});

readStream.on('data', (chunk) => {
  // 读取到: 461 字节
  // 读取到: 415 字节
  // 读取到: 470 字节
  console.log(`读取到: ${chunk.length} 字节`);
});
```

### 自定义实现

通过继承 [`stream.Readable`](https://nodejs.cn/api/v22/stream.html#%E5%AE%9E%E7%8E%B0%E5%8F%AF%E8%AF%BB%E6%B5%81) 类或使用构造函数创建。

待续...

## 事件

### 事件: data 

* **事件**: `readable.on('data', listener)`
  * **触发时机**: 当流有新数据可读时触发
  * **函数处理器的接收参数**:
    - `chunk`:  [Buffer](https://nodejs.cn/api/v22/buffer.html#class-buffer) | [string](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Data_structures#String_type) | [any](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Data_structures#Data_types) 数据块。对于不在对象模式下操作的流，块将是字符串或 `Buffer`。对于处于对象模式的流，块可以是除 `null` 之外的任何 JavaScript 值。
* **特性**
  * 每当流将数据块的所有权移交给消费者时，则会触发 `'data'` 事件。每当流将数据块的所有权移交给消费者时，则会触发 `'data'` 事件。
  * 每当流将数据块的所有权移交给消费者时，则会触发 `'data'` 事件。
  * 将 `'data'` 事件监听器绑定到尚未显式暂停的流，则会将流切换到流动模式。数据将在可用时立即传入。
  * 如果使用 `readable.setEncoding()` 方法为流指定了默认编码，则监听器回调将把数据块作为字符串传递；否则数据将作为 `Buffer` 传递。

### 事件: readable

* **事件**: `readable.on('end', listener)`

  * **触发时机**: 
    * 流有新数据可读时。
    * 流的内部缓冲区为空且已到达数据末尾时。
  * **函数处理器的接收参数**: 无

* **特性**:

  * 在**暂停模式**下手动控制数据读取。

  * 如果已经到达流的末尾，则调用 [`stream.read()`](https://nodejs.cn/api/v22/stream.html#readablereadsize) 将返回 `null` 并触发 `'end'` 事件。

    ```js
    import { createReadStream } from 'node:fs';
    
    // 创建文件可读流
    const readStream = createReadStream('./01_path.ts', {
      encoding: 'utf8', // 字符编码（可选）
    });
    
    readStream.on('readable', () => {
      // readStream.read() 手动读取数据, 返回的是文件内容
      // 当 readStream.read() 返回 null, 之后, 会触发 end 事件
      console.log(`readable: ${readStream.read()}`);
    });
    
    readStream.on('end', () => {
      console.log('end'); // 当
    });
    ```

  * 如果同时使用 `'readable'` 和 [`'data'`](https://nodejs.cn/api/v22/stream.html#event-data)，则 `'readable'` 优先控制流，即只有在调用 [`stream.read()`](https://nodejs.cn/api/v22/stream.html#readablereadsize) 时才会触发 `'data'`。[`readableFlowing`](#三种状态) 属性将变为 `false`。如果在删除 `'readable'` 时有 `'data'` 监听器，流将开始流动，即 `'data'` 事件将在不调用 `.resume()` 的情况下触发。

### 事件: end

* **事件**: `readable.on('end', listener)`
  * **触发时机**: 当流中没有更多数据可供消费时触发
  * **函数处理器的接收参数**: 无
* **特性**: **除非数据完全消耗，否则不会触发 `'end'` 事件**。这可以通过将流切换到流动模式来实现，或者通过重复调用 [`stream.read()`](https://nodejs.cn/api/v22/stream.html#readablereadsize) 直到所有数据都被消费完。

```js
import { createReadStream } from 'node:fs';

// 创建文件可读流
const readStream = createReadStream('./01_path.ts', {
  encoding: 'utf8', // 字符编码（可选）
});

// 切换到流动模式
readStream.on('data', (chunk) => {});

readStream.on('end', () => {
  console.log('数据读取完毕');
});
```

### 事件: close

* **事件**: `readable.on('close', listener)`
  * **触发时机**: 当流及其任何底层资源（例如文件描述符）已关闭时，则会触发 `'close'` 事件。该事件表明将不再触发更多事件，并且不会发生进一步的计算
  * **函数处理器的接收参数**: 无
* **特性**:
  * 如果 [`Readable`](https://nodejs.cn/api/stream.html#class-streamreadable) 流是使用 `emitClose` 选项创建的，则始终会触发 `'close'` 事件

### 事件: error

* **事件**: `readable.on('error', listener)`
  * **触发时机**: 流操作过程中发生错误时触发。通常，如果底层流由于底层内部故障而无法生成数据，或者当流实现尝试推送无效数据块时，可能会发生这种情况。
  * **函数处理器的接收参数**: `err`（错误对象，包含错误信息）
* **特性**
  * 最好监听此事件，否则错误会导致进程崩溃。

### 事件: pause

* **事件**: `readable.on('pause', listener)`
  * **触发时机**: 当调用 [`stream.pause()`](https://nodejs.cn/api/stream.html#readablepause) 暂停流并且 `readableFlowing` 不是 `false` 时触发
  * **函数处理器的接收参数**: 无

### 事件: resume

* **事件**: `readable.on('resume', listener)`
  * **触发时机**: 当调用  [`stream.resume()`](https://nodejs.cn/api/stream.html#readableresume)  恢复流并且 `readableFlowing` 不是 `true` 时触发
  * **函数处理器的接收参数**: 无

## 方法

### 数据读取方法

#### 读取数据: readable.read()

- **方法**: `readable.read([size])`

  - **作用**: 从流中读取数据（暂停模式下使用）

  - **参数**：

    - `size`（可选）- 期望读取的字节数（对象模式下为对象数量）。

  - **返回值**
 - 数据块（`Buffer` 或字符串，取决于 `encoding` 配置）。
      - 或者`null`：无更多数据或需等待新数据。

- **特性**
     - `readable.read()` 方法应该只在暂停模式下操作的 `Readable` 流上调用。在流动模式下，会自动调用 `readable.read()`，直到内部缓冲区完全排空。
       - 读取大文件时，`.read()` 可能会暂时返回 `null`，表示它已使用完所有缓冲内容，**但可能还有更多数据需要缓冲**。在这种情况下，一旦缓冲区中有更多数据，就会触发新的 `'readable'` 事件，而 `'end'` 事件表示数据传输结束。
       - 因此，要从 `readable` 读取文件的全部内容，必须跨越多个 `'readable'` 事件来收集块

```js
const fs = require('fs');
const readStream = fs.createReadStream('data.txt', { encoding: 'utf8' });

readStream.on('readable', () => {
  let chunk;
  // 循环读取所有可用数据
  while (null !== (chunk = readStream.read(1024))) { 
    console.log(`读取到 ${chunk.length} 字符: ${chunk}`);
  }
});
```

### 流状态控制方法

#### 暂停流: readable.pause()

- **方法**: `readable.pause()`
  - **作用**: 暂停流的数据流动（切换到暂停模式）。
  - **参数**：无
  - **返回值**: [\<this>](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Reference/Operators/this)

* **特性**
  * 将导致处于流动模式的流停止触发 [`'data'`](https://nodejs.cn/api/stream.html#event-data) 事件，切换出流动模式。任何可用的数据都将保留在内部缓冲区中。
  * **如果有 `'readable'` 事件监听器，则 `readable.pause()` 方法不起作用**。
  * 会触发`pause` 事件。

```js
readStream.on('data', (chunk) => {
  console.log('读取到数据，暂停流');
  readStream.pause(); // 暂停后不再触发 data 事件
  
  // 500ms 后恢复
  setTimeout(() => readStream.resume(), 500);
});
```

#### 恢复流: readable.resume()

- **方法**: `readable.pause()`
  - **作用**: 恢复流的数据流动（切换到流动模式）。
  - **参数**：无
  - **返回值**: [\<this>](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Reference/Operators/this)

* **特性**
  * 导致显式暂停的 `Readable` 流恢复触发 [`'data'`](https://nodejs.cn/api/stream.html#event-data) 事件，将流切换到流动模式。
  * **如果有 `'readable'` 事件监听器，则 `readable.resume()` 方法不起作用**。
  * 会触发`resume` 事件。

#### 销毁流: readable.destroy()

- **方法**: `readable.destroy([error])`
  - **作用**: 立即销毁流，释放底层资源（如文件描述符）。
  - **参数**：
    - `error`(可选): [ \<Error> ](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 将作为 `'error'` 事件中的有效负载传递的错误
  - **返回值**: [\<this>](https://web.nodejs.cn/en-US/docs/Web/JavaScript/Reference/Operators/this)

* **特性**
  * 异常场景下强制终止流，避免资源泄漏。
  * 如果传入了 `error` 参数, 则会触发 `'error'` 事件，并且触发 `'close'` 事件（除非 `emitClose` 设置为 `false`）。

### 管道操作方法

#### 管道: readable.pipe()

- **方法**: `readable.pipe(destination[, options])`
  - **作用**: 将可读流的数据导向可写流，**自动处理背压**。
  - **参数**：
    - `destination`：目标可写流（如 `fs.WriteStream`），也可以是双向流（Duplex）或转换流（Transform）。
    - `options`（可选）：
      - `end`（布尔值）：数据读取完毕后是否自动结束目标流（调用 `destination.end()`）。默认 true。
  - **返回值**: **目标流**（可链式调用）。

* **特性**

  * `readable.pipe()` 方法将 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 流绑定到 `readable`，使其自动切换到流动模式并将其所有数据推送到绑定的 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable)。数据流将被自动管理，以便目标 `Writable` 流不会被更快的 `Readable` 流漫过。

  * 当 `options.end = false` 时，必须手动调用 `destination.end()`，否则目标流会一直处于等待状态。

  * 默认情况下，当源 `Readable` 流触发 [`'end'`](https://nodejs.cn/api/stream.html#event-end) 时，则在目标 `Writable` 流上调用 [`stream.end()`](https://nodejs.cn/api/stream.html#writableendchunk-encoding-callback)，因此目标不再可写。要禁用此默认行为，可以将 `end` 选项作为 `false` 传入，从而使目标流保持打开状态：

    ```js
    const reader = createReadStream('file.ts');
    const writer = createWriteStream('file2.txt');
    reader.pipe(writer, {
      end: false,
    });
    
    // 设置 end 为 false, 还可以在数据读取结束后继续向可写流中写入数据
    reader.on('end', () => {
      writer.end('Goodbye\n');
    });
    ```

#### 解除管道： readable.unpipe()

* **方法**: `readable.pipe(destination)`
  * **作用**: 断开可读流与一个或多个可写流之间的管道连接，阻止后续数据继续流向目标流。
  * **参数**：
    * `destination`（可选）：
      * 若指定，仅解除与该可写流的管道连接。
      * 若省略，解除可读流与所有已连接可写流的管道连接。
  * **返回值**: 可读流本身（`this`），支持链式调用。

* **特性**
* 调用 `unpipe()` 后，可读流处于暂停状态。
  
* **与 `destroy()` 的区别**
  
  - `unpipe()` 仅解除管道连接，流本身仍可复用。
    - `destroy()` 会彻底销毁流，释放底层资源（无法复用）。

### 其他实用方法

#### 检查流是否暂停: readable.isPaused()

* **方法**: `readable.isPaused()`
  * **作用**: 检查当前流是否处于暂停模式。
  * **参数**：无
  * **返回值**: 布尔值（`true` 表示暂停，`false` 表示流动）。
* **工作原理**: 可读流内部维护一个状态标识（`_readableState.paused`），`isPaused()` 方法本质是返回该标识的值：
  - 初始状态：流创建后默认处于暂停模式（`paused: true`）。
  - 模式切换：
    - 调用 `resume()` 或监听 `data` 事件 → 切换为流动模式（`paused: false`）。
    - 调用 `pause()` → 切换为暂停模式（`paused: true`）。
  - 状态独立性：`isPaused()` 仅反映可读流自身的状态，与可写流或管道操作无关。

#### 设置字符编码: readable.setEncoding()

* **方法**: `readable.setEncoding()`
  * **作用**: **为流设置的数据字节数据指定特定的字符编码**，设置编码会导致流数据作为指定编码的字符串而不是 `Buffer` 对象返回。
  * **参数**：
    * **`encoding`**（字符串，必选）：指定字符编码
  * **返回值**: 
    * 可读流本身（`this`），支持链式调用。
* **工作原理**
  * **底层转换**：设置编码后，流会自动将内部缓冲区的 `Buffer` 数据转换为指定编码的字符串。
  * **多字节字符处理**：对于 `'utf8'` 等多字节编码，流会确保字符边界完整性（避免截断多字节字符）。
  * **性能影响**：编码转换会产生轻微性能开销（尤其是大文件），二进制数据建议保持 `Buffer` 模式。
* **特性**：
  * 创建可读流时，可通过 `encoding` 选项直接指定编码，效果与 `setEncoding()` 一致

## 属性

### 是否可读取数据: readable.readable

- **只读属性**: `readable.readable`
  - **作用**：表示流是否处于可读状态（即是否可以从中读取数据）。
  - **类型**：布尔值（`true`/`false`）。
- **特性**
  
  - 流创建后默认初始为 `true`，直到流结束（`end` 事件触发）或被销毁（`destroy()` 调用）后变为 `false`。
  
  - 当为 `true`，这意味着流尚未被销毁或触发 `'error'` 或 `'end'`。
  
  - 与 `destroyed` 和 `closed` 的区别:
  
    | 属性        | 含义                                   | 状态时机                                      |
    | ----------- | -------------------------------------- | --------------------------------------------- |
    | `readable`  | 流是否处于可读状态                     | 流创建后默认 `true`，`end` 事件后变为 `false` |
    | `destroyed` | 流是否已被销毁（主动调用 `destroy()`） | 调用 `destroy()` 后立即变为 `true`            |
    | `closed`    | 流的底层资源是否已完全关闭             | 资源释放完成后变为 `true`（晚于 `destroyed`） |

### 是否被关闭: readable.closed

- **只读属性**: `readable.closed`
  - **作用**：用于标识可读流的底层资源（如文件描述符、网络连接等）是否已关闭并释放。
  - **类型**：布尔值（`true`/`false`）。

- **特性**

  - **触发时机**: 从 `false` 变为 `true` 的时机是
    - 流的所有数据处理完成，且底层资源（如文件描述符）已释放（触发 `close` 事件时）。
    - 调用 `destroy()` 方法后，底层资源释放完成（无论是否正常结束）。
  - **注意**：`closed` 状态的变化晚于 `destroyed`（`destroyed` 在调用 `destroy()` 时立即变为 `true`，而 `closed` 需等待资源实际释放后才变为 `true`）。

### 是否被销毁: readable.destroyed

- **只读属性**: `readable.destroyed`
  - **作用**：表示流是否已被销毁（通过 `destroy()` 方法）。
  - **类型**：布尔值（`true`/`false`）。

- **特性**

  - 流被销毁后无法再读取数据，且会触发 `close` 事件。

### 内部缓冲区的阈值大小: readable.readableHighWaterMark

- **只读属性**: `readable.readableHighWaterMark`

  - **作用**：流的内部缓冲区的阈值大小（`highWaterMark`），超过此值会触发背压机制。
  - **类型**：数字（字节数或对象数）。

- **特性**

  - 可在创建流时通过选项配置（如 `fs.createReadStream(path, { highWaterMark: 65536 })`）。

### 待读取的数据量: readable.readableLength

- **只读属性**: `readable.readableHighWaterMark`

  - **作用**：当前流的内部缓冲区中待读取的数据量。
  - **类型**：数字（字节数或对象数）。

- **特性**

  - 可用于监控缓冲区使用情况，辅助背压处理。

### 字符编码: readable.readableEncoding

- **只读属性**: `readable.readableEncoding`
  - **作用**：获取当前流的字符编码格式
  - **类型**：字符串或 `null`。

- **特性**

  - 动态获取流的编码配置，判断数据的格式

### 流的当前状态: readable.readableFlowing

- **只读属性**: `readable.readableFlowing`
  - **作用**：如 [三种状态](#三种状态) 部分所述，此属性反映 `Readable` 流的当前状态。
  - **类型**：
      - `true`：流处于**流动模式**（数据自动通过 `data` 事件推送）。
      - `false`：流处于**暂停模式**（需手动调用 `read()` 读取数据）。
      - `null`：流处于**初始状态**（未被任何消费方式激活，既不流动也不暂停）。

- **特性**

  - 与 [`isPaused()`](#检查流是否暂停-readable-ispaused) 方法的区别
  
    | <span style="display:inline-block;width:80px;">特性</span> | `readableFlowing`                                            | `isPaused()`                             |
    | ---------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
    | 取值范围                                                   | `true`/`false`/`null`                                        | `true`/`false`                           |
    | 初始状态                                                   | `null`                                                       | `true`（暂停模式）                       |
    | 核心含义                                                   | 数据是否自动流动（流动模式）                                 | 流是否处于暂停模式                       |
    | 对应关系                                                   | `true` → 流动模式（`isPaused()` 返回 `false`） `false` → 暂停模式（`isPaused()` 返回 `true`） `null` → 初始状态（`isPaused()` 返回 `true`） | 仅反映是否暂停，不区分初始状态与暂停模式 |













