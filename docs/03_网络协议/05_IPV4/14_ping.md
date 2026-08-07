# ping

Ping 的名称来源于声纳探测。在网络里，它使用 **ICMP Echo Request（Type=8）** 和 **ICMP Echo Reply（Type=0）** 这一对报文，**测试目标主机是否可达**。

工作在 OSI 模型的第三层（网络层），**不依赖传输层端口**（ICMP 协议号=1，直接跑在 IP 之上）。因此 ping 不证明 TCP 或 UDP 服务可用，只证明 IP 层可达。

## 完整的通信过程

假设执行：`ping 8.8.8.8`

### DNS 解析（IP 时不需要）

如果目标是一个域名，系统会先查 DNS。用的是 IP，直接跳过。

### 查找路由，判定“怎么去”

系统查询路由表，发现 `8.8.8.8` 不在本地子网，必须发往**默认网关**。

### 构造 ICMP Echo Request 报文

- **Type** = 8
- **Code** = 0
- **校验和**：计算好填上。
- **标识符（Identifier）**：通常用进程号，系统用来匹配请求和应答。
- **序列号（Sequence Number）**：从 1 开始递增，用于检测丢包和乱序。
- **数据（Payload）**：通常是一个发送时间戳 + 填充字节（如 32 或 56 字节），用来计算往返时间。

### IP 层封装

- 协议号：`1`（ICMP）
- 源 IP：你电脑的 IP（如 `192.168.1.100`）
- 目标 IP：`8.8.8.8`
- TTL：操作系统默认值，比如 Windows 是 128。

### 数据链路层封装：需要网关的 MAC 地址

电脑发现下一跳是网关（比如 `192.168.1.1`），而帧头需要网关的 MAC。这时就会触发 **ARP 协议**：

- 如果 ARP 缓存里有，直接使用。
- 如果没有，先广播 ARP 请求解析网关 MAC，再发送 ICMP 报文。

帧最终从网卡发出，目标 MAC 是网关，目标 IP 是 `8.8.8.8`。

### 中间路由器逐跳转发

- 每个路由器读取 IP 头，查路由表，将 TTL 减 1，然后转发给下一跳。
- 如果某路由器找不到路由，会丢弃并回复 **ICMP Type=3**（目标不可达）。
- 如果 TTL 减到 0，也会丢弃并回复 **ICMP Type=11 Code=0**（TTL 超时）。

### 最终目标 `8.8.8.8` 收到请求

目标主机收到 Echo Request 后：

- 将 Type 从 8 改为 **0**（Echo Reply）
- 重新计算校验和
- 交换源/目的 IP
- 同样的封装流程，把 Echo Reply 沿原路送回。

### 主机收到 Echo Reply

- 匹配标识符和序列号。
- 用当前时间减去 Payload 里的时间戳，得到**往返时间（RTT）**。
- 在终端打印结果。

## ping 结果含义

1. 成功：`来自 x.x.x.x 的回复` ✅ 通，ICMP 请求应答正常。

2. 错误：

   | 错误提示                                                     | 对应 ICMP      | 含义与排查方向                                               |
   | :----------------------------------------------------------- | :------------- | :----------------------------------------------------------- |
   | 请求超时 (Request timed out)                                 | 无任何回应     | 目标不在线、防火墙丢包、路由环路、无路由。通常说明 IP 层及以下是通的，问题在上层。 |
   | 目标主机不可达 (Destination host unreachable)                | Type 3 Code 1  | 最后一跳路由器 ARP 解析不到，通常说明目标关机或不在网络。    |
   | 目标网络不可达 (Destination net unreachable)                 | Type 3 Code 0  | 某路由器路由表无匹配，需查路由配置。                         |
   | 需要分段但设置了 DF (Packet needs to be fragmented but DF set) | Type 3 Code 4  | PMTUD 失败，典型原因：中间链路 MTU 过小且防火墙拦截了 ICMP 差错报文。 |
   | TTL 传输中过期 (TTL expired in transit)                      | Type 11 Code 0 | 路径过长或存在路由环路。                                     |

## 抓包分析

### ping 请求

![image-20260807144323134](/img/399.png)

```text
Internet Control Message Protocol
    Type: Echo (ping) request (8)
    Code: 0
    Checksum: 0x3d6c [correct]
    [Checksum Status: Good]
    Identifier (BE): 256 (0x0100)
    Identifier (LE): 1 (0x0001)
    Sequence Number (BE): 3824 (0x0ef0)
    Sequence Number (LE): 61454 (0xf00e)
    [Response frame: 865] -> Wireshark 自动关联了应答包
    Data (32 bytes)
        Data: 6162636465666768696a6b6c6d6e6f7071727374757677616263646566676869
        [Length: 32]
```

#### Type: 8, Code: 0

类型为: ICMP 查询报文

#### Checksum

`0x3d6c`，显示 `[correct]`，说明包在网络传输中没有受损。

#### Identifier (标识符)

* 大端序 (BE) 和小端序 (LE) 两种解读
* 系统用这个 ID 来区分不同的 ping 进程。比如你同时开了两个命令行窗口 ping 不同地址，系统就是靠这个 ID 把回来的应答分给正确窗口的。

#### Sequence Number (序列号)

- BE `3824` / LE `61454`。
- 每发一个 ping 包，这个号就递增 1。用来判断有没有丢包、有没有乱序。
- 如果下一个 ping 包的 LE 序列号是 `61455` (0xf00f)，说明顺序正常。

#### Data (32 字节)

Windows 系统 ping 命令的默认填充内容，32 字节的字母表，用来凑够包长。

### ping 应答

![image-20260807144745839](/img/400.png)

#### Type: 0, Code: 0

类型为: ICMP 查询报文, 对应 ping 应答

#### Checksum

`0x456c`，显示 `[correct]`，说明包在网络传输中没有受损。

#### 身份匹配：证明是同一个“会话”

```text
Identifier (LE): 1 (0x0001)
Sequence Number (LE): 61454 (0xf00e)
```

- **标识符 (ID = 1)** 和 **序列号 (Seq = 61454)** 与刚才的请求包**完全一致**。
- **意义**：你的电脑正是靠这两个字段，在可能同时发出的众多 ping 包里，准确识别出 “这是对刚才那个第 61454 号探针的回复”。如果这两个字段对不上，系统可能会丢弃该包或报错

#### 数据负载：原样返回

Windows 系统 ping 命令的默认填充内容，32 字节的字母表，用来凑够包长。