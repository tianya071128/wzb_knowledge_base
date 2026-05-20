# TCP 数据收发阶段

TCP 数据收发阶段是三次握手完成后，双方都进入 `ESTABLISHED` 状态后的核心阶段。这个阶段的所有机制，都是为了实现**可靠、有序、无重复、无丢失**的字节流传输。

## 核心: 序列号与确认号机制

这是 TCP 可靠传输的基石，所有其他机制都建立在它之上。

发送数据时, 发送方发送**序列号（SEQ）**。

接收数据时, 接收方发送确定好**确认号（ACK）**。

- **序列号（SEQ）**：表示本报文数据部分第一个字节的编号

- **确认号（ACK）**：表示期望收到对方下一个字节的编号，同时确认了之前所有字节都已收到
- **核心公式**：`下一个报文的 SEQ = 当前报文的 SEQ + 当前报文的 Len`

## 双向数据传输

TCP 支持全双工通信，双方可以同时发送数据。为了提高效率，TCP 支持把 ACK 确认和数据放在同一个报文中发送，这就是**捎带确认**。

```plaintext
客户端                          服务端
  |                              |
  |  SEQ=789798037, ACK=193440196, Len=100
  |----------------------------->|
  |                              |
  |                              |  收到数据，同时准备发送自己的数据
  |                              |
  |  SEQ=193440196, ACK=789798137, Len=200
  |  捎带确认 + 200 字节数据
  |<-----------------------------|
  |                              |
  |  收到数据，确认服务端的 200 字节
  |
  |  SEQ=789798137, ACK=193440396, Len=0
  |  纯 ACK 确认
  |----------------------------->|
  |                              |
```

## 报文

### 发送数据

![image-20260520164833820](/img/368.png)

#### 源 / 目的端口

```plaintext
Source Port: 54059
Destination Port: 3000
[Stream index: 83]
[Stream Packet Number: 4]
```

- 源端口`54059`、目的端口`3000`和三次握手完全一致，确认是同一个连接
- `Stream Packet Number: 4`：这是这个 TCP 流的第 4 个报文（前 3 个是三次握手）

#### 序列号（Sequence Number）

```plaintext
Sequence Number: 1 (relative)
Sequence Number (raw): 789798037
Next Sequence Number: 1150 (relative)
```

- 第三次握手客户端发送的是**纯 ACK 报文**，纯 ACK 不消耗序列号
- 所以第一个数据报文的序列号，和第三次握手的序列号完全相同
- `Next Sequence Number: 1150 = 1 + 1149`：因为这个报文携带了 1149 字节数据，消耗了 1149 个序列号，下一个数据报文的序列号将从 1150 开始

#### 确认号（Acknowledgment Number）

```plaintext
Acknowledgment Number: 1 (relative)
Acknowledgment number (raw): 193440196
```

- 这个确认号和**第三次握手的确认号完全相同**
- 含义：客户端还没有收到服务端发送的任何业务数据，所以仍然在等待服务端的第 1 个字节（服务端 SYN 的下一个字节）
- 当服务端发送数据后，这个确认号才会递增

#### 头部长度（Header Length）

```plaintext
0101 .... = Header Length: 20 bytes (5)
```

- 标准的 20 字节 TCP 头部，没有任何选项
- 原因：所有 TCP 选项（MSS、窗口缩放、SACK 等）已经在三次握手的 SYN 报文中协商完成，数据报文不需要再携带选项

#### 标志位（Flags）

```plaintext
Flags: 0x018 (PSH, ACK)
    000. .... .... = Reserved: Not set
    ...0 .... .... = Accurate ECN: Not set
    .... 0... .... = Congestion Window Reduced: Not set
    .... .0.. .... = ECN-Echo: Not set
    .... ..0. .... = Urgent: Not set
    .... ...1 .... = Acknowledgment: Set
    .... .... 1... = Push: Set
    .... .... .0.. = Reset: Not set
    .... .... ..0. = Syn: Not set
    .... .... ...0 = Fin: Not set
    [TCP Flags: ·······AP···]
```

- `ACK=1`：所有非 SYN 报文的 ACK 标志位都必须为 1，表示这是一个确认报文
- PSH=1（Push 标志）：这是这个报文最特殊的地方
  - 作用：告诉接收方内核**不要把数据放在接收缓冲区里攒着，立即交给应用层处理**
  - 使用场景：适合实时性要求高的业务（如 HTTP 请求、SSH 命令），避免数据在内核缓冲区中延迟
  - 对比：如果没有 PSH 标志，内核会等缓冲区攒到一定大小再交给应用层，以提高效率

#### 窗口大小（Window）

```plaintext
Window: 255
Calculated window size: 65280
Window size scaling factor: 256
```

- 和第三次握手的窗口大小完全一致
- `Window size scaling factor: 256`：使用三次握手协商的窗口缩放因子 8（`2^8=256`）
- 实际接收窗口大小：`255 × 256 = 65280`字节
- 含义：客户端告诉服务端，我现在还有 65280 字节的接收缓冲区空间，你可以发送这么多数据而无需等待确认

#### 校验和（Checksum）

```plaintext
Checksum: 0x8efc [unverified]
Checksum Status: Unverified
```

- `unverified` 是因为网卡开启了 **TCP 校验和卸载（Checksum Offload）**，抓包时看到的校验和是硬件计算前的占位值，不是真正的错误。

#### 紧急指针（Urgent Pointer）

```plaintext
Urgent Pointer: 0
```

- 因为 `URG=0`，紧急指针字段无效，值为 0。

#### 载荷（payload）

```plaintext
TCP payload (1149 bytes)
```

- 这就是应用层发送的实际数据

### 确定消息

这是**服务端对客户端业务数据的纯 ACK 确认报文**

![image-20260520170412083](/img/369.png)

#### 源 / 目的端口

```plaintext
Source Port: 3000
Destination Port: 54059
[Stream index: 83]
[Stream Packet Number: 5]
```

- 端口和流索引与之前所有报文完全一致，确认是同一个 TCP 连接
- `Stream Packet Number: 5`：到目前为止，这个连接的完整交互顺序是：
  1. 客户端 SYN（第 1 包，第一次握手）
  2. 服务端 SYN+ACK（第 2 包，第二次握手）
  3. 客户端 ACK（第 3 包，第三次握手）
  4. 客户端 1149 字节 PSH+ACK 数据（第 4 包，你上一张图的报文）
  5. 服务端 ACK 确认 1149 字节（本报文，第 5 包）

#### 序列号（Sequence Number）

```plaintext
Sequence Number: 1 (relative)
Sequence Number (raw): 193440196
Next Sequence Number: 1 (relative)
```

- 服务端的初始相对序列号是`1`（三次握手时服务端 SYN 消耗了 1 个序号，从 0 变成 1）
- 到目前为止，**服务端还没有发送任何业务数据**
- 这是一个纯 ACK 报文，**不携带数据，不消耗任何序列号**
- 所以`Next Sequence Number`和当前序列号完全相同，服务端下一个发送数据的序列号仍然是`1`

#### 确认号（Acknowledgment Number）

```plaintext
Acknowledgment Number: 1150 (relative)
Acknowledgment number (raw): 789799186
```

这个确认号直接对应客户端上一个数据报文的长度，是 TCP 可靠传输的核心体现：

- 客户端上一个数据报文的相对序列号是`1`，携带了`1149`字节数据
- 确认号的含义是：**我已经收到了所有序号小于 1150 的字节，下一个期望收到的字节是 1150**

#### 头部长度（Header Length）

```plaintext
0101 .... = Header Length: 20 bytes (5)
```

- 标准的 20 字节 TCP 头部，没有任何选项
- 原因：所有 TCP 选项（MSS、窗口缩放、SACK 等）已经在三次握手的 SYN 报文中协商完成，数据报文不需要再携带选项

#### 标志位（Flags）

```plaintext
Flags: 0x010 (ACK)
    000. .... .... = Reserved: Not set
    ...0 .... .... = Accurate ECN: Not set
    .... 0... .... = Congestion Window Reduced: Not set
    .... .0.. .... = ECN-Echo: Not set
    .... ..0. .... = Urgent: Not set
    .... ...1 .... = Acknowledgment: Set
    .... .... 0... = Push: Not set
    .... .... .0.. = Reset: Not set
    .... .... ..0. = Syn: Not set
    .... .... ...0 = Fin: Not set
    [TCP Flags: ·······A····]
```

- `ACK=1`：所有非 SYN 报文的 ACK 标志位都必须为 1，表示这是一个确认报文

#### 窗口大小（Window）

```plaintext
Window: 251
Calculated window size: 64256
Window size scaling factor: 256
```

- `Window size scaling factor: 256`：使用三次握手协商的窗口缩放因子 8（`2^8=256`）
- 服务端当前实际接收窗口大小：`251 × 256 = 64256`字节
- 含义：服务端告诉客户端，我现在还有 64256 字节的接收缓冲区空间，你可以继续发送这么多数据而无需等待确认
- 对比：客户端之前的窗口是 65280 字节，服务端的窗口稍小，说明服务端的接收缓冲区已经使用了一小部分，但仍然有充足的空间

#### 校验和（Checksum）

```plaintext
Checksum: 0x8a83 [unverified]
Checksum Status: Unverified
```

- `unverified` 是因为网卡开启了 **TCP 校验和卸载（Checksum Offload）**，抓包时看到的校验和是硬件计算前的占位值，不是真正的错误。

#### 紧急指针（Urgent Pointer）

```plaintext
Urgent Pointer: 0
```

- 因为 `URG=0`，紧急指针字段无效，值为 0。
