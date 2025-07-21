# Stream 流

**Stream（流）** 是处理流式数据的抽象接口，用于高效地处理大量数据或连续数据流（如文件读写、网络通信等）。Stream 基于事件驱动，支持非阻塞操作，特别适合处理大文件或实时数据。

## 流的类型

Node.js 提供四种基本流类型：

- **可读流（Readable）**：用于读取数据（如 `fs.createReadStream`）。
- **可写流（Writable）**：用于写入数据（如 `fs.createWriteStream`）。
- **双向流（Duplex）**：可读可写（如网络套接字 `net.Socket`）。
- **转换流（Transform）**：在读写过程中转换数据（如 `zlib` 压缩流）。

