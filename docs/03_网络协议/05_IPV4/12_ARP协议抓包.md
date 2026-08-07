# ARP 协议抓包

1. 打开 Wireshark，选中网卡，过滤 `arp`。
2. 以管理员权限运行 `arp -d` 清空 ARP 缓存。
3. ping 你局域网内的一个已知 IP（比如网关）。

## ARP 请求报文

标准广播 ARP‑Request（ARP 请求）

![image-20260807104151174](/img/397.png)

### Ethernet II 以太网头部

1. **源 MAC：`e0:73:e7:b5:16:94`** 本机网卡 MAC（192.168.7.102），IG=0 单播地址，出厂全局唯一 MAC。
2. **目的 MAC：`ff:ff:ff:ff:ff:ff` Broadcast 二层广播地址⭐**
3. Type：`0x0806` → 上层是 ARP 协议。

### ARP 协议载荷部分

**ARP 不经过 IP 协议等, 直接以太网帧封装数据**

```text
Address Resolution Protocol (request)
    Hardware type: Ethernet (1)
    Protocol type: IPv4 (0x0800)
    Hardware size: 6
    Protocol size: 4
    Opcode: request (1)                  ← 1=请求，2=应答
    Sender MAC address: e0:73:e7:b5:16:94
    Sender IP address: 192.168.7.102
    Target MAC address: 00:00:00_00:00:00 (00:00:00:00:00:00)
    Target IP address: 192.168.7.45
```

**字段含义**：

* **Opcode: request (1)**: ARP 请求报文

- **Sender MAC / IP**：这是**本机信息**
- **Target IP**：`192.168.7.45`，要找的目标 IP。
- **Target MAC**：**全零 `00:00:00:00:00:00`**。这是 ARP 请求的**标准占位符**，表示“我不知道你的 MAC，请你自己填上”。

## ARP 应答报文

![image-20260807105030039](/img/398.png)

### Ethernet II 以太网头部

- **源 MAC：`64:4e:d7:70:6f:0d`** → 192.168.7.45 这台主机的网卡 MAC
- **目的 MAC：`e0:73:e7:b5:16:94`** → 本机 192.168.7.102 的 MAC

> ⭐ARP 应答**使用单播发送**，不使用广播，直接回复请求者。

- Type：`0x0806` 代表 ARP 协议
- Padding：一堆 0 字节填充

> 以太网帧最小长度 64 字节，ARP 报文本身载荷短，所以尾部补 0 填充达到最小帧长。

### ARP 协议载荷部分

```text
Address Resolution Protocol (reply)
    Hardware type: Ethernet (1)
    Protocol type: IPv4 (0x0800)
    Hardware size: 6
    Protocol size: 4
    Opcode: reply (2)
    Sender MAC address: HP_70:6f:0d (64:4e:d7:70:6f:0d)
    Sender IP address: 192.168.7.45
    Target MAC address: HP_b5:16:94 (e0:73:e7:b5:16:94)
    Target IP address: 192.168.7.102
```

**字段含义**：

* **Opcode: request (2)**: ARP 应答报文

- **Sender MAC / IP**：应答方的 MAC 和 IP
- **Target IP**：接收方，请求者本机 IP
- **Target MAC**：接收方，就是请求者本机 MAC

## 缓存检测: 单播ARP

![image-20260807103602022](/img/396.png)