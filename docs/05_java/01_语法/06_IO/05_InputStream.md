# InputStream

## 什么是 InputStream

`java.io.InputStream` 是 Java IO 中**字节输入流**的抽象基类，定义了从数据源读取字节的统一 API。它本身不能实例化，需要使用其子类（如 `FileInputStream`、`BufferedInputStream`）来连接具体的数据源（文件、网络、内存等）。

```java
import java.io.FileInputStream;
import java.io.InputStream;

InputStream is = new FileInputStream("D:/test/data.txt"); // 多态：父类引用指向子类对象
```

常见子类及对应数据源：

| 子类 | 数据源 |
| --- | --- |
| `FileInputStream` | 文件 |
| `ByteArrayInputStream` | 内存中的字节数组 |
| `BufferedInputStream` | 包装其他流，提供缓冲 |
| `DataInputStream` | 包装其他流，读取基本类型数据 |
| `ObjectInputStream` | 包装其他流，读取序列化对象 |

## 创建流时如何指定编码

`InputStream` 是**字节流**，它本身没有字符编码的概念，读取到的是原始字节。如果你读取的是文本文件，需要在把字节转换成字符串时指定编码：

```java
try (InputStream is = new FileInputStream("D:/test/data.txt")) {
    byte[] bytes = is.readAllBytes();
    // 按 UTF-8 解码为字符串
    String text = new String(bytes, StandardCharsets.UTF_8);
}
```

更推荐的做法是：如果你要处理的是文本，直接使用**字符流** `Reader`（例如 `InputStreamReader`），在创建 `Reader` 时指定编码：

```java
try (Reader reader = new InputStreamReader(
        new FileInputStream("D:/test/data.txt"), StandardCharsets.UTF_8)) {
    // 按 UTF-8 读取文本
}
```

不指定编码时，`FileInputStream` 读取的是原始字节，而 `new String(bytes)` 会使用平台默认编码，跨平台运行容易出现乱码。

## 核心方法

### read()

方法签名：

```java
public abstract int read() throws IOException
int read(byte[] b) throws IOException
int read(byte[] b, int off, int len) throws IOException
```

读取字节的核心方法，有三种重载：

- `read()`：读取单个字节，返回 `0 ~ 255` 的值；到达流末尾返回 `-1`；
- `read(byte[] b)`：读取最多 `b.length` 个字节到数组中，返回**实际读取的字节数**；由于最后一次读取往往填不满数组，数组中 `len` 之后的部分是**上一次残留的脏数据**，处理时只能使用 `[0, len)` 区间；
- `read(byte[] b, int off, int len)`：读取最多 `len` 个字节写入数组从 `off` 开始的位置，同样返回实际读取的字节数。

```java
// 逐字节读取
try (InputStream is = new FileInputStream("D:/test/data.txt")) {
    int b;
    while ((b = is.read()) != -1) {
        System.out.print((char) b);
    }
}

// 按块读取（推荐，效率更高）
try (InputStream is = new FileInputStream("D:/test/data.txt")) {
    byte[] buffer = new byte[1024];
    int len;
    while ((len = is.read(buffer)) != -1) {
        // 只处理 [0, len) 区间，len 之后是脏数据
        String text = new String(buffer, 0, len);
        System.out.println("本次读取 " + len + " 字节");
    }
}
```

### close()

方法签名：

```java
public void close() throws IOException
```

关闭流并释放底层资源（文件句柄、网络连接等）。流使用完毕必须关闭，推荐使用 try-with-resources 自动关闭。

```java
try (InputStream is = new FileInputStream("D:/test/data.txt")) {
    // 使用流，try 块结束后自动调用 close()
}
```

### available()

方法签名：

```java
public int available() throws IOException
```

返回当前可以不受阻塞地读取的估算字节数，常用于一次性分配缓冲区。

```java
try (InputStream is = new FileInputStream("D:/test/data.txt")) {
    byte[] buffer = new byte[is.available()]; // 注意：大文件不要这样做
    is.read(buffer);
}
```

### skip()

方法签名：

```java
public long skip(long n) throws IOException
```

跳过并丢弃 `n` 个字节数据，返回实际跳过的字节数。

```java
is.skip(100); // 跳过前 100 个字节
```

### readAllBytes() / readNBytes()

方法签名：

```java
public byte[] readAllBytes() throws IOException // Java 9+
public byte[] readNBytes(int len) throws IOException // Java 9+
```

Java 9 新增的便捷方法：`readAllBytes()` 读取流中剩余全部字节，`readNBytes(len)` 最多读取 `len` 个字节。

```java
byte[] all = is.readAllBytes(); // 一次性读完剩余内容
```

### transferTo()

方法签名：

```java
public long transferTo(OutputStream out) throws IOException // Java 9+
```

将流中剩余字节全部写入输出流，常用于文件复制，取代手写的缓冲循环。

```java
try (InputStream is = new FileInputStream("src.txt");
     OutputStream os = new FileOutputStream("dst.txt")) {
    is.transferTo(os); // 一行完成复制
}
```

## BufferedInputStream：缓冲流

`FileInputStream` 每次调用 `read()` 都会触发一次磁盘访问，效率低。`BufferedInputStream` 在内部维护一个缓冲区（默认 8KB），一次读取一大块数据，后续读取直接从内存缓冲区取值。

```java
try (InputStream is = new BufferedInputStream(new FileInputStream("D:/test/data.txt"))) {
    int b;
    while ((b = is.read()) != -1) { // 实际读的是缓冲区
        System.out.print((char) b);
    }
}
```

这种「包装其他流」的模式称为**处理流**，缓冲流不直接连接数据源，只负责提升性能。

## 基本使用模式

字节输入流的读取套路固定为三步：

```java
try (InputStream is = new FileInputStream("D:/test/data.txt")) {
    // 1. 创建流（try-with-resources 自动关闭）
    byte[] buffer = new byte[1024];
    int len;
    // 2. 循环读取，read 返回 -1 表示结束
    while ((len = is.read(buffer)) != -1) {
        // 处理 buffer[0, len) 区间的数据
    }
    // 3. 流在 try 结束时自动关闭
}
```

## InputStream 与 Reader 的选择

- 数据是**二进制**（图片、音视频、序列化对象等）：使用 `InputStream` 体系；
- 数据是**文本**：使用 `Reader` 体系，避免手动处理编码问题。

用字节流读取文本时，一个中文（UTF-8 占 3 字节）可能被拆散在两次读取中出现乱码，因此文本内容应优先使用字符流。

## 注意事项

1. `InputStream` 是抽象类，必须通过子类使用；
2. `read(byte[])` 返回的是**实际读取的字节数**，数据处理只能使用 `[0, len)` 区间，`len` 之后是脏数据；
3. 流关闭后再次读取会抛出 `IOException`；
4. 流必须关闭，try-with-resources 是标准写法；
5. `available()` 返回的是估算值，不要用它一次性读取大文件。
