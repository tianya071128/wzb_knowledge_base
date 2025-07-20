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

### 事件: 













