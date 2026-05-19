# 第二次握手

第二次握手是三次握手的**核心中间环节**，它不仅是服务端对客户端 SYN 的确认，更是服务端向客户端同步自身初始序列号、协商选项的关键一步

## 触发时机

1. 客户端发送 **SYN** 报文（seq=x）进入 `SYN_SENT` 状态。
2. 服务端收到该报文，如果同意连接，则准备回复。
3. 服务端发送 **SYN + ACK** 报文，**完成第二次握手**，自身进入 `SYN_RCVD` 状态。

## SYN + ACK 报文: 服务端 -> 客户端

![第二个报文 —— SYN + ACK 报文](/img/362.png)

## 核心定位

是**服务端对客户端 SYN 报文的响应**，同时也是服务端发起的反向连接请求。

标志位：`SYN=1` 且 `ACK=1`，因此也叫 **SYN+ACK 报文**

## 作用

1. **确认客户端的 SYN 报文已收到（ACK 部分）**
2. **向客户端同步服务端的初始序列号（SYN 部分）**
3. **回复服务端支持的所有 TCP 选项（MSS、窗口缩放、SACK 等）**
4. **验证客户端是否可达**

## 报文

![image-20260519153618477](/img/361.png)

### 源 / 目的端口

```plaintext
Source Port: 3000
Destination Port: 54059
```

- 源端口 `3000`：服务端的监听端口，和第一次握手中客户端的目的端口一致。
- 目的端口 `54059`：客户端的临时端口，和第一次握手中客户端的源端口一致。
- 流向：服务端 → 客户端，是对第一次 SYN 报文的响应。

### 序列号（Sequence Number）

```plaintext
Sequence Number: 0 (relative)
Sequence Number (raw): 193440195
Next Sequence Number: 1 (relative)
```

- `raw: 193440195`：服务端自己的**初始序列号（ISN）**，由内核随机生成，防止序列号预测攻击。

  `relative: 0`：Wireshark 显示的相对序列号，方便分析。

  `Next Sequence Number: 1`：因为 **SYN 报文即使无数据，也要消耗 1 个序列号**，所以服务端下一个报文的序列号会是 `193440195 + 1`。

### 确认号（Acknowledgment Number）

```plaintext
Acknowledgment Number: 1 (relative)
Acknowledgment number (raw): 789798037
```

- `raw: 789798037`：第一次握手客户端 SYN 报文的 ISN + 1。
  - 第一次握手客户端的 `raw ISN` 是 `789798036`，这里 `789798036 + 1 = 789798037`。
- 含义：服务端在说：“我已经收到了你发送的 SYN，下一个期望收到的字节是 `789798037`”。

### 头部长度（Header Length）

```plaintext
1000 .... = Header Length: 32 bytes (8)
```

- `Header Length: 32 bytes`：TCP 头部总长度为 32 字节。
- 计算：`数据偏移 = 8`（二进制 `1000`），单位是 4 字节 → `8 × 4 = 32` 字节。
- 结构：`20 字节固定头部 + 12 字节选项`。

### 标志位（Flags: 0x002 (SYN)）

```plaintext
Flags: 0x012 (SYN, ACK)
    000. .... .... = Reserved: Not set
    ...0 .... .... = Accurate ECN: Not set
    .... 0... .... = Congestion Window Reduced: Not set
    .... .0.. .... = ECN-Echo: Not set
    .... ..0. .... = Urgent: Not set
    .... ...1 .... = Acknowledgment: Set
    .... .... 0... = Push: Not set
    .... .... .0.. = Reset: Not set
    .... .... ..1. = Syn: Set
    .... .... ...0 = Fin: Not set
    [TCP Flags: ·······A··S·]
```

- `0x012` 对应二进制 `00010010`，表示同时设置了 **`SYN=1` 和 `ACK=1`**，这是第二次握手的唯一标识。
- `ACK=1`：确认客户端的 SYN 已收到。
- `SYN=1`：同步服务端自己的初始序列号，向客户端发起反向连接请求。
- `Reserved: Not set`: 保留位(3位)

### 窗口大小（Window）

```plaintext
Window: 65535
Calculated window size: 65535
```

- 窗口大小字段值：`65535`（16 位最大值）。
- `Calculated window size: 65535`：说明**双方尚未协商窗口缩放**（或缩放因子为 0），实际窗口大小就是 65535 字节。
- 含义：服务端告诉客户端：“我最多能接收 65535 字节的数据”。

### 校验和（Checksum）

```plaintext
Checksum: 0x5518 [unverified]
Checksum Status: Unverified
```

- `unverified` 是因为网卡开启了 **TCP 校验和卸载（Checksum Offload）**，抓包时看到的校验和是硬件计算前的占位值，不是真正的错误。

### 紧急指针（Urgent Pointer）

```plaintext
Urgent Pointer: 0
```

- 因为 `URG=0`，紧急指针字段无效，值为 0。

### TCP 选项（Options: 12 bytes）

和第一次握手的 SYN 报文一样，服务端也回复了 4 个关键选项，用于双向协商：

```plaintext
Options: (12 bytes), Maximum segment size, No-Operation (NOP), Window scale, No-Operation (NOP), No-Operation (NOP), SACK permitted
    TCP Option - Maximum segment size: 65475 bytes
    TCP Option - No-Operation (NOP)
    TCP Option - Window scale: 8 (multiply by 256)
    TCP Option - No-Operation (NOP)
    TCP Option - No-Operation (NOP)
    TCP Option - SACK permitted
```

| 选项               | 解析                                                                                                | 与第一次握手的关系                                         |
| ------------------ | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **MSS**            | `65475 bytes`：服务端通告自己能接收的最大数据载荷长度，和客户端的 MSS 一致。                        | 客户端发送数据时，必须遵守服务端的 MSS 限制。              |
| **NOP**            | 填充字节，用于将后续选项对齐到 4 字节边界。                                                         | 和客户端 SYN 报文中的 NOP 作用相同。                       |
| **Window scale**   | `8 (multiply by 256)`：服务端通告自己的窗口缩放因子为 8，后续报文的窗口大小字段值将乘以 `2^8=256`。 | 客户端发送数据时，会使用服务端的缩放因子计算实际窗口大小。 |
| **SACK permitted** | 服务端通告自己支持选择性确认（SACK）功能。                                                          | 双方都支持 SACK，后续丢包时可以只重传丢失的部分。          |

## 状态变更

![TCP 三次握手](/img/358.png)

**状态会从 `LISTEN` 切换到 `SYN_RCVD`，并开启半连接等待**:

1. 验证客户端 `SYN` 报文的合法性（端口、标志位、校验和）
2. 随机生成自己的初始序列号 `server_isn`
3. 回复 `SYN+ACK` 报文（确认号 = `client_isn + 1`，序列号 = `server_isn`）
4. 将这个连接加入**半连接队列**，分配内核资源（部分状态信息）
5. 启动半连接超时计时器（默认约 30 秒）

**后续状态变化**:

1. **正常收到第三次 `ACK` 报文**: 进入 `ESTABLISHED` 状态，连接正式建立
2. **超时未收到 `ACK` 报文（SYN 攻击 / 客户端离线）**:
   * 超时重传 `SYN+ACK` 报文（默认重传 5 次，指数退避）
   * 超时后，内核会释放半连接队列中的该连接资源
   * 状态回到 `LISTEN`，等待新的连接请求
   * 不会通知客户端（因为根本收不到客户端的响应）
3. **收到 `RST` 报文（客户端拒绝连接）:**
   * 服务端收到 `RST` 后，立即释放半连接资源
   * 状态直接回到 `LISTEN`

