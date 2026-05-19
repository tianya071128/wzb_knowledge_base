# 第三次握手

在 TCP 三次握手中，**第三次握手**是**客户端**收到服务端的 **SYN+ACK** 报文后，向服务端发送一个 **ACK** 报文。这一步完成后，连接正式进入 `ESTABLISHED` 状态，双方可以开始传输数据。

## 报文: 客户端 -> 服务端

![第三个报文 —— ACK 报文](/img/363.png)

## 触发时机

1. 客户端处于 `SYN_SENT` 状态。
2. 客户端收到服务端发来的 **SYN+ACK** 报文（第二次握手）。
3. 客户端验证确认号（ack）是否为之前自己发送的 `seq+1`，确认无误后，发送第三次握手 **ACK** 报文。

## 作用

1. **确认收到服务端的 SYN 同步请求**: 告诉服务端：我已经收到你的初始序列号，**同意建立反向连接**。

2. **彻底确认双向通信都正常**

3. **解决旧延迟报文问题，防止失效连接建立**:

   最关键作用：**防止已过期、滞留网络的旧 SYN 报文，错误建立无效连接**。

## 第三次握手可以携带数据

**第三次握手是可以携带数据的，前两次握手是不可以携带数据的**

TCP 允许在第三次握手的 ACK 报文中携带应用层数据（如 HTTP 请求）。这样能减少一次 RTT，优化短连接性能（称为“TCP Fast Open”的衍生或早期数据发送）。

但传统的三次握手中，第三次握手通常是一个纯 ACK，不携带数据。

## 报文

![image-20260519163827555](/img/364.png)

### 源 / 目的端口

```plaintext
Source Port: 54059
Destination Port: 3000
```

- 源端口 `54059`：客户端临时端口，和第一次握手的源端口一致
- 目的端口 `3000`：服务端监听端口，和前两次握手的目的端口一致
- 流向：客户端 → 服务端，是对第二次握手 SYN+ACK 报文的响应

### 序列号（Sequence Number）

```plaintext
Sequence Number: 1 (relative)
Sequence Number (raw): 789798037
Next Sequence Number: 1 (relative)
```

- `raw: 789798037`：客户端的当前发送序列号
  - 第一次握手客户端 SYN 报文的 ISN 是 `789798036`，由于 SYN 报文消耗了 1 个序列号，所以第三次握手的 SEQ 是 `789798036 + 1 = 789798037`
- `Next Sequence Number: 1`：因为这是纯 ACK 报文，不携带数据，也不消耗序列号，所以下一个报文的序列号仍为 `789798037`

### 确认号（Acknowledgment Number）

```plaintext
Acknowledgment Number: 1 (relative)
Acknowledgment number (raw): 193440196
```

- `raw: 193440196`：服务端的 ISN + 1
  
  - 第二次握手服务端 SYN+ACK 报文的 ISN 是 `193440195`，由于 SYN 报文消耗了 1 个序列号，所以客户端的确认号是 `193440195 + 1 = 193440196`
  
  含义：客户端告诉服务端 “我已经收到了你的 SYN，下一个期望收到的字节是 `193440196`”

### 头部长度（Header Length）

```plaintext
0101 .... = Header Length: 20 bytes (5)
```

- 数据偏移值为 `5`（二进制 `0101`），单位为 4 字节，因此头部总长度为 `5 × 4 = 20` 字节
- 说明：第三次握手的 ACK 报文不需要携带 TCP 选项（选项已在前两次 SYN 报文中协商完成），所以头部是标准的 20 字节固定长度

### 标志位（Flags: 0x002 (SYN)）

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

- `0x010` 对应二进制 `00010000`，表示仅设置了 `ACK=1`，这是第三次握手报文的唯一特征
- 没有 SYN 标志位，因为客户端已经同步了自己的序列号，不需要再发起新的连接请求
- `Reserved: Not set`: 保留位(3位)

### 窗口大小（Window）

```plaintext
Window: 255
Calculated window size: 65280
Window size scaling factor: 256
```

- 窗口大小字段值为 `255`
- `Window size scaling factor: 256`：客户端在第一次 SYN 报文中协商的窗口缩放因子为 8（`2^8=256`），因此实际窗口大小为 `255 × 256 = 65280` 字节
- 含义：客户端告诉服务端 “我现在的接收窗口大小是 65280 字节，你可以连续发送这么多数据而无需等待确认”

### 校验和（Checksum）

```plaintext
Checksum: 0x8efc [unverified]
Checksum Status: Unverified
```

- `unverified` 是因为网卡开启了 **TCP 校验和卸载（Checksum Offload）**，抓包时看到的校验和是硬件计算前的占位值，不是真正的错误。

### 紧急指针（Urgent Pointer）

```plaintext
Urgent Pointer: 0
```

- 因为 `URG=0`，紧急指针字段无效，值为 0。

## 状态变化

![TCP 三次握手](/img/358.png)

第三次握手完成后，**客户端和服务端会同时进入 `ESTABLISHED`（已建立）状态**

客户端: 从 `SYN_SENT` 状态切换为 **`ESTABLISHED` 状态**

服务端: 

* 收到第三次握手 ACK 报文后: 从 `SYN_RCVD` 状态切换为 **`ESTABLISHED` 状态**
* 第三次握手 ACK 丢失: 仍处于 `SYN_RCVD` 状态，会超时重传 SYN+ACK 报文
  * 如果客户端后续发送数据，服务端收到数据后会自动进入 `ESTABLISHED` 状态
  * 如果客户端不发送数据，服务端重传几次后会超时释放半连接资源