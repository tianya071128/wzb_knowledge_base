# OutputStream

## 什么是 OutputStream

`java.io.OutputStream` 是 Java IO 中**字节输出流**的抽象基类，定义了向目标（文件、网络、内存等）写出字节的统一 API。它本身不能实例化，需要使用其子类连接具体的目标。

```java
import java.io.FileOutputStream;
import java.io.OutputStream;

OutputStream os = new FileOutputStream("D:/test/out.txt"); // 多态：父类引用指向子类对象
```

常见子类及对应目标：

| 子类 | 目标 |
| --- | --- |
| `FileOutputStream` | 文件 |
| `ByteArrayOutputStream` | 内存中的字节数组 |
| `BufferedOutputStream` | 包装其他流，提供缓冲 |
| `DataOutputStream` | 包装其他流，写出基本类型数据 |
| `ObjectOutputStream` | 包装其他流，写出序列化对象 |

## 核心方法

### write()

方法签名：

```java
public abstract void write(int b) throws IOException
void write(byte[] b) throws IOException
void write(byte[] b, int off, int len) throws IOException
```

写出字节的核心方法，有三种重载：

- `write(int b)`：写出一个字节（只使用低 8 位）；
- `write(byte[] b)`：写出数组中的全部字节；
- `write(byte[] b, int off, int len)`：写出数组中从 `off` 开始的 `len` 个字节。

```java
try (OutputStream os = new FileOutputStream("D:/test/out.txt")) {
    os.write(65);                          // 写出单个字节 'A'
    os.write("Hello".getBytes());          // 写出全部字节
    os.write("World".getBytes(), 0, 3);    // 只写出前 3 个字节 "Wor"
}
```

### close()

方法签名：

```java
public void close() throws IOException
```

关闭流并释放底层资源。输出流还必须**先 flush 再 close**：`close()` 内部通常会先刷新缓冲区，推荐直接使用 try-with-resources 自动关闭。

```java
try (OutputStream os = new FileOutputStream("D:/test/out.txt")) {
    os.write("Hello".getBytes());
    // try 块结束后自动 flush + close
}
```

### flush()

方法签名：

```java
public void flush() throws IOException
```

刷新缓冲区，把流中缓冲的数据立即写出到目标。

#### 为什么需要 flush

写出操作通常是**分层的**，数据并不会立即到达目标：

```
write() → [缓冲流缓冲区] → [FileOutputStream] → 磁盘/网络
```

1. 普通流（如 `FileOutputStream`）：`write()` 基本直接落盘，flush 影响不大；
2. 缓冲流（`BufferedOutputStream`）：数据先写入内存缓冲区（默认 8KB），攒满后才批量写出。缓冲区**未满时数据一直停留在内存里**；
3. 网络流：数据可能滞留在系统内核缓冲区，需要 flush 才会立即发出。

如果程序在缓冲区未满时崩溃、或忘记关闭流，缓冲区中的数据就会**丢失**——这就是「写了数据但文件是空的/少了最后一段」的常见原因。

#### 什么时候调用

- **缓冲流、网络流**：每次写完一批重要数据后主动调用 `flush()`；
- **连续大量写出**：可以每隔一段时间 flush 一次，降低单次丢失的数据量；
- **只写少量数据就关闭流**：直接依赖 `close()` 即可，`close()` 内部会先 flush 再释放资源，但**异常场景下 close 可能不被执行**，所以关键数据仍建议显式 flush。

```java
os.write(data);
os.flush(); // 确保数据已经真正写出，而不是停留在缓冲区
```

#### flush 与 close 的关系

| 对比项 | `flush()` | `close()` |
| --- | --- | --- |
| 作用 | 刷新缓冲区，数据写出 | 先 flush，再释放底层资源 |
| 流是否可用 | 刷新后**可以继续写** | 关闭后不可再写，再写抛 `IOException` |
| 调用次数 | 可以多次调用 | 只能调用一次 |

记忆口诀：**「flush 保数据，close 收资源」**——flush 负责把数据送出去，close 负责收尾；`close()` 等价于 `flush()` + 关闭。

## FileOutputStream：文件输出流

`FileOutputStream` 用于向文件写出字节，构造时有两种模式：

```java
// 覆盖模式：文件已存在则清空重写
OutputStream os1 = new FileOutputStream("D:/test/out.txt");

// 追加模式：第二个参数为 true，在文件末尾追加
OutputStream os2 = new FileOutputStream("D:/test/out.txt", true);
```

### 追加模式说明

`FileOutputStream(String name, boolean append)` 的第二个参数 `append` 决定写出的起始位置：

- `append = false`（默认）：从文件开头写，**已存在内容会被清空**；
- `append = true`：从文件末尾追加写，**已存在内容保留**。

追加模式常用于日志写入等需要保留历史记录的场景。注意：追加模式只影响写起始位置，不会自动添加换行符，如需每条日志占一行，仍需手动写出 `\n` 或 `\r\n`（字符流中建议使用 `BufferedWriter.newLine()`）。

```java
// 日志追加示例
try (OutputStream os = new FileOutputStream("D:/test/app.log", true)) {
    os.write(("[" + LocalDateTime.now() + "] 启动\n").getBytes(StandardCharsets.UTF_8));
}
```

## BufferedOutputStream：缓冲流

与 `BufferedInputStream` 对应，`BufferedOutputStream` 在内部维护缓冲区（默认 8KB），写出的数据先进入缓冲区，攒满后再一次性写出到目标，减少磁盘访问次数。

```java
try (OutputStream os = new BufferedOutputStream(new FileOutputStream("D:/test/out.txt"))) {
    os.write("Hello".getBytes()); // 先写入缓冲区
} // try 结束时自动 flush 并 close，数据真正落盘
```

注意：缓冲流关闭前必须 flush（close 默认会做），否则缓冲区中未满的数据会丢失。

## 基本使用模式

字节输出流的写出套路固定为三步：

```java
try (OutputStream os = new FileOutputStream("D:/test/out.txt")) {
    // 1. 创建流（try-with-resources 自动关闭）
    os.write("Hello IO".getBytes());
    // 2. 写出数据
    os.flush();
    // 3. 刷新缓冲区（close 前确保数据写出）
}
```

## 文件复制示例

结合 `InputStream` 与 `OutputStream` 可以实现文件复制：

```java
try (InputStream is = new FileInputStream("D:/test/src.jpg");
     OutputStream os = new FileOutputStream("D:/test/dst.jpg")) {
    byte[] buffer = new byte[1024];
    int len;
    while ((len = is.read(buffer)) != -1) {
        os.write(buffer, 0, len); // 只写出实际读取的字节数
    }
}
```

更简洁的写法是使用 Java 9 的 `transferTo()`：

```java
try (InputStream is = new FileInputStream("D:/test/src.jpg");
     OutputStream os = new FileOutputStream("D:/test/dst.jpg")) {
    is.transferTo(os);
}
```

## OutputStream 与 Writer 的选择

与输入侧同理：

- 目标数据是**二进制**（图片、音视频、压缩包等）：使用 `OutputStream` 体系；
- 目标数据是**文本**：使用 `Writer` 体系，避免手动处理编码问题。

## 注意事项

1. `OutputStream` 是抽象类，必须通过子类使用；
2. 覆盖模式会**清空已有文件**，追加需求要显式传入 `append = true`；
3. 使用缓冲流后忘记 flush/close 会导致**数据丢失**；
4. 写文本内容优先使用 `Writer` 体系；
5. 流必须关闭，try-with-resources 是标准写法。
