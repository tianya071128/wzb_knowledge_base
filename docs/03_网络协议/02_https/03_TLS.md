# TLS 的连接过程

HTTPS 也就是 HTTP + SSL/TLS + 数字证书，HTTPS 的连接过程也同样要先经过 TCP 层的三次握手建立 TCP 连接，**然后在通过 TLS 建立安全通道，之后就可以通过这个安全通道进行 HTTP 通信了。**

**这个“握手”过程与 TCP 有些类似，是 HTTPS 和 TLS 协议里最重要、最核心的部分，懂了它，就“掌握了 HTTPS”。**

## TLS 协议的组成

TLS 包含几个子协议，你也可以理解为它是由几个不同职责的模块组成，比较常用的有记录协议、警报协议、握手协议、变更密码规范协议等。

- **记录协议**（Record Protocol）规定了 TLS 收发数据的基本单位：记录（record）。它有点像是 TCP 里的 segment，所有的其他子协议都需要通过记录协议发出。**但多个记录数据可以在一个 TCP 包里一次性发出，也并不需要像 TCP 那样返回 ACK。**
- **警报协议**（Alert Protocol）的职责是向对方发出警报信息，有点像是 HTTP 协议里的状态码。比如，protocol_version 就是不支持旧版本，bad_certificate 就是证书有问题，收到警报后另一方可以选择继续，也可以立即终止连接。
- **握手协议**（Handshake Protocol）是 TLS 里最复杂的子协议，要比 TCP 的 SYN/ACK 复杂的多，浏览器和服务器会在握手过程中协商 TLS 版本号、随机数、密码套件等信息，然后交换证书和密钥参数，最终双方协商得到会话密钥，用于后续的混合加密系统。
- **变更密码规范协议**（Change Cipher Spec Protocol），它非常简单，就是一个“通知”，告诉对方，后续的数据都将使用加密保护。那么反过来，在它之前，数据都是明文的。

## TLS/1.3 的握手过程

TLS/1.2 在 2008 年发布，随着时代的发展，在 2018 年推出了 TLS/1.3 协议。

![img](/img/313.jpg)

具体见 [极客 - TLS1.3 特性解析](https://time.geekbang.org/column/article/110718)

## 参考

- [极客-TLS1.2 连接过程解析](https://time.geekbang.org/column/article/110354)
- [极客 - TLS1.3 特性解析](https://time.geekbang.org/column/article/110718)
