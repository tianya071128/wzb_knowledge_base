# 第一次握手

**建立连接是通过三次握手来进行的**。三次握手的过程如下图：

![TCP 三次握手](/img/358.png)

## 前置条件

一开始，客户端和服务端都处于 `CLOSE` 状态。

服务端主动监听某个端口，处于 `LISTEN` 状态

## SYN 报文: 客户端 -> 服务端

**SYN 报文是 TCP 连接的 "敲门砖"**，它是三次握手的第一个报文，也是整个 TCP 协议中最特殊、最重要的报文之一

![第一个报文 —— SYN 报文](/img/359.png)

## 特性

- **只能在连接建立阶段出现**：SYN 标志位只能在三次握手的前两个报文中被置为 1，连接建立后的所有报文都不能再设置 SYN 标志位
- **是唯一 ACK 标志位可以为 0 的 TCP 报文**：除了第一个 SYN 报文，所有其他 TCP 报文的 ACK 标志位都必须为 1
- 所有需要双方同意的选项（MSS、窗口缩放、SACK 等）都必须在 `SYN` 或 `SYN+ACK` 报文中发送

## 作用

1. **发起连接请求**
2. **同步初始序列号（ISN）**
3. **协商 TCP 扩展选项**
4. **验证服务端的存在和可达性**: SYN 报文可以验证服务端是否在线、端口是否开放

## 报文

![image-20260519142309852](/img/360.png)

### 源 / 目的端口

```plaintext
Source Port: 54059
Destination Port: 3000
```

- `54059`：客户端随机临时端口（`1024~65535`），由操作系统分配，标识发起连接的进程。
- `3000`：服务端监听端口，标识目标服务（比如本地运行的 Node/Java 服务）。

### 序列号（Sequence Number）

```plaintext
Sequence Number: 0 (relative sequence number)
Sequence Number (raw): 789798036
Next Sequence Number: 1 (relative sequence number)
```

- `raw: 789798036`：客户端真实的初始序列号（ISN），由内核随机生成，防止序列号预测攻击。
- `relative: 0`：Wireshark 为了方便分析，自动显示的相对序列号（把真实 ISN 减去了初始值）。
- `Next Sequence Number: 1`：因为 **SYN 报文即使没有数据，也要消耗 1 个序列号**，所以下一个报文的序列号会是 `ISN + 1`。

### 确认号（Acknowledgment Number）

```plaintext
Acknowledgment Number: 0 (relative)
Acknowledgment number (raw): 0
```

- 确认号为 `0`，是因为这是三次握手的第一个报文，**`ACK=0`**，确认号字段无效。

### 头部长度（Header Length）

```plaintext
1000 .... = Header Length: 32 bytes (8)
```

- `Header Length: 32 bytes`：TCP 头部总长度为 32 字节。
- 计算：`数据偏移 = 8`（二进制 `1000`），单位是 4 字节 → `8 × 4 = 32` 字节。
- 结构：`20 字节固定头部 + 12 字节选项`。

### 标志位（Flags: 0x002 (SYN)）

```plaintext
Flags: 0x002 (SYN)
    000. .... .... = Reserved: Not set
    ...0 .... .... = Accurate ECN: Not set
    .... 0... .... = Congestion Window Reduced: Not set
    .... .0.. .... = ECN-Echo: Not set
    .... ..0. .... = Urgent: Not set
    .... ...0 .... = Acknowledgment: Not set
    .... .... 0... = Push: Not set
    .... .... .0.. = Reset: Not set
    .... .... ..1. = Syn: Set
    .... .... ...0 = Fin: Not set
    [TCP Flags: ··········S·]
```

- `0x002` 对应二进制 `00000010`，表示只有 **`SYN=1`**，其他标志位全为 0。
- `Reserved: Not set`: 保留位(3位)
- 关键：这是唯一 `ACK=0` 的 TCP 报文，是三次握手的起点。

### 窗口大小（Window）

```plaintext
Window: 65535
Calculated window size: 65535
```

- 窗口大小字段值：`65535`（16 位最大值）。
- `Calculated window size: 65535`：说明**双方尚未协商窗口缩放**（或缩放因子为 0），实际窗口大小就是 65535 字节。
- 含义：客户端告诉服务端：“我最多能接收 65535 字节的数据”。

### 校验和（Checksum）

```plaintext
Checksum: 0x0a74 [unverified]
Checksum Status: Unverified
```

- `unverified` 是因为网卡开启了 **TCP 校验和卸载（Checksum Offload）**，抓包时看到的校验和是硬件计算前的占位值，不是真正的错误。

### 紧急指针（Urgent Pointer）

```plaintext
Urgent Pointer: 0
```

- 因为 `URG=0`，紧急指针字段无效，值为 0。

### TCP 选项（Options: 12 bytes）

这是 SYN 报文的核心部分，协商了关键扩展选项：

```plaintext
Options: (12 bytes), Maximum segment size, No-Operation (NOP), Window scale, No-Operation (NOP), No-Operation (NOP), SACK permitted
    TCP Option - Maximum segment size: 65475 bytes
    TCP Option - No-Operation (NOP)
    TCP Option - Window scale: 8 (multiply by 256)
    TCP Option - No-Operation (NOP)
    TCP Option - No-Operation (NOP)
    TCP Option - SACK permitted
```

* `Maximum segment size: 65475 bytes`:  客户端通告自己能接收的最大数据载荷长度。IPv6 头部固定 40 字节，TCP 头部最小 20 字节，本地回环 MTU 为 65535 → `65535 - 40 - 20 = 65475`，是本地回环的典型 MSS 值。
* `No-Operation (NOP)`: 单字节填充，用于将后续选项对齐到 4 字节边界。
* `Window scale: 8 (multiply by 256)`: 客户端通告窗口缩放因子为 8，后续报文的窗口大小字段值将乘以 `2^8=256`
* `SACK permitted`: 客户端通告自己支持选择性确认（SACK）功能，丢包后可以只重传丢失的部分，提升重传效率

## 客户端状态变化

**发送 SYN 后：进入 `SYN_SENT` 状态**

**收到服务端不同响应时的状态分支**:

1. 收到 SYN+ACK 报文（正常情况）: 进入 **`ESTABLISHED` 状态**
2. 收到 `RST` 报文（端口未开放 / 拒绝连接）: 立即退出 `SYN_SENT`，回到 `CLOSED` 状态
3. 超时未收到任何响应（网络问题 / 防火墙拦截）: 
   * 客户端会按指数退避规则重传 SYN 报文
   * 超时后，客户端从 `SYN_SENT` 回到 `CLOSED` 状态