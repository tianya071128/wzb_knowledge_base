# 双工流（Duplex）和转换流（Transform）

## 双工流（Duplex）

双工流是同时实现 [`Readable`](https://nodejs.cn/api/stream.html#class-streamreadable) 和 [`Writable`](https://nodejs.cn/api/stream.html#class-streamwritable) 接口的流。它允许数据双向流动：既可以作为消费者读取数据，也可以作为生产者写入数据，且读写操作相互独立，**各自维护独立的内部缓冲区和状态**。

### 核心特性

1. **双向性**：同时具备 `read()`、`pipe()` 等可读流方法，和 `write()`、`end()` 等可写流方法。
2. **独立性**：读缓冲区与写缓冲区相互分离，读写操作的状态（如背压）互不干扰。
3. **继承关系**：`Duplex` 类继承自 `Readable`，并混合了 `Writable` 的接口，因此可同时使用两类流的方法和事件。

### 内置模块

`Duplex` 流的内置模块包括：

- [TCP 套接字](https://nodejs.cn/api/net.html#class-netsocket)
- [zlib 流](https://nodejs.cn/api/zlib.html)
- [加密流](https://nodejs.cn/api/crypto.html)

## 转换流（Transform）

**转换流（Transform Stream）** 是一种特殊的双工流（Duplex Stream），它的核心功能是对输入数据进行处理（转换、过滤、加工等）后再输出。转换流的输入和输出存在依赖关系，通常用于数据处理管道中实现数据的实时转换。

### 核心特性

1. **数据转换**：接收输入数据（可写端），经过处理后通过可读端输出，输入与输出存在逻辑关联。
2. **单缓冲区**：**内部共享一个缓冲区**（与双工流的独立缓冲区不同），简化了数据处理流程。
3. **继承关系**：`Transform` 类继承自 `Duplex`，因此同时具备可读流和可写流的特性，但无需分别实现 `_read()` 和 `_write()`，只需实现 `_transform()` 方法。

### 内置模块

`Transform` 流的内置模块包括：

- [zlib 流](https://nodejs.cn/api/zlib.html)
- [加密流](https://nodejs.cn/api/crypto.html)
- 等等

### 与双工流的区别

| 特性           | 转换流（Transform）            | 双工流（Duplex）                           |
| -------------- | ------------------------------ | ------------------------------------------ |
| 核心用途       | 数据转换（输入 → 处理 → 输出） | 双向独立通信（读写无依赖）                 |
| 缓冲区         | 共享缓冲区                     | 读写端独立缓冲区                           |
| 必须实现的方法 | `_transform()`（核心转换逻辑） | `_read()`（读逻辑）和 `_write()`（写逻辑） |
| 数据关联性     | 输出依赖输入（处理后的数据）   | 读写数据无关联                             |
| 典型实例       | `zlib` 压缩流、`crypto` 加密流 | `net.Socket`（TCP 套接字）                 |