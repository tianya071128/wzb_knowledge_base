# Reader

## 什么是 Reader

`java.io.Reader` 是 Java IO 中**字符输入流**的抽象基类，用于以字符为单位读取文本数据。与 `InputStream` 不同，它可以根据指定的字符编码将字节解码为字符，避免手动处理多字节字符的拆分问题。

```java
import java.io.FileReader;
import java.io.Reader;

Reader reader = new FileReader("D:/test/data.txt"); // 默认使用平台编码
```

常见子类及对应数据源：

| 子类 | 数据源 |
| --- | --- |
| `FileReader` | 文件 |
| `StringReader` | 内存中的字符串 |
| `BufferedReader` | 包装其他字符流，提供缓冲与按行读取 |
| `InputStreamReader` | 把字节流 `InputStream` 桥接为字符流 |

## 核心方法

### read()

方法签名：

```java
public int read() throws IOException
int read(char[] cbuf) throws IOException
int read(char[] cbuf, int off, int len) throws IOException
```

读取字符的核心方法，有三种重载：

- `read()`：读取单个字符，返回 `0 ~ 65535` 的值；到达流末尾返回 `-1`；
- `read(char[] cbuf)`：读取最多 `cbuf.length` 个字符到数组中，返回实际读取的字符数；
- `read(char[] cbuf, int off, int len)`：读取最多 `len` 个字符写入数组从 `off` 开始的位置。

```java
// 逐字符读取
try (Reader reader = new FileReader("D:/test/data.txt")) {
    int c;
    while ((c = reader.read()) != -1) {
        System.out.print((char) c);
    }
}

// 按块读取
try (Reader reader = new FileReader("D:/test/data.txt")) {
    char[] buffer = new char[1024];
    int len;
    while ((len = reader.read(buffer)) != -1) {
        System.out.println("本次读取 " + len + " 个字符");
    }
}
```

### close()

方法签名：

```java
public abstract void close() throws IOException
```

关闭流并释放底层资源。推荐使用 try-with-resources 自动关闭。

```java
try (Reader reader = new FileReader("D:/test/data.txt")) {
    // 使用字符流，try 块结束后自动 close
}
```

### ready()

方法签名：

```java
public boolean ready() throws IOException
```

判断流是否准备好被读取（即下一次 `read()` 不会阻塞）。该方法不保证返回准确结果，主要用于交互式输入场景。

```java
if (reader.ready()) {
    int c = reader.read();
}
```

### skip()

方法签名：

```java
public long skip(long n) throws IOException
```

跳过并丢弃 `n` 个字符，返回实际跳过的字符数。

```java
reader.skip(10); // 跳过前 10 个字符
```

## 创建流时如何指定编码

字符流 `Reader` 的核心优势就是能在创建时指定字符编码。Java 提供了两种常见方式：

### 方式一：使用 InputStreamReader（Java 7 起通用）

```java
try (Reader reader = new InputStreamReader(
        new FileInputStream("D:/test/data.txt"), StandardCharsets.UTF_8)) {
    // 按 UTF-8 解码读取
}
```

这是跨版本最稳妥的写法，`InputStreamReader` 的第二个参数就是字符集。

### 方式二：使用 FileReader（Java 11+）

Java 11 为 `FileReader` 新增了带 `Charset` 的构造方法：

```java
try (Reader reader = new FileReader("D:/test/data.txt", StandardCharsets.UTF_8)) {
    // 按 UTF-8 读取
}
```

### 不推荐：默认编码

以下写法没有显式指定编码，会使用平台默认编码，跨平台时可能乱码：

```java
// 不推荐：依赖平台默认编码
Reader reader = new FileReader("D:/test/data.txt");
```

## InputStreamReader：字节流转字符流的桥梁

`InputStreamReader` 是字节流与字符流之间的**适配器**，它包装一个 `InputStream`，读取字节后按指定字符编码解码为字符。

```java
// 显式指定 UTF-8 编码读取文件
try (Reader reader = new InputStreamReader(
        new FileInputStream("D:/test/data.txt"), StandardCharsets.UTF_8)) {
    int c;
    while ((c = reader.read()) != -1) {
        System.out.print((char) c);
    }
}
```

如果不指定编码，`InputStreamReader` 使用平台默认编码，跨平台时可能产生乱码，因此**显式指定编码是更安全的做法**。

## BufferedReader：缓冲字符流

`BufferedReader` 在内部维护字符缓冲区，并提供 `readLine()` 方法，可以一次读取一行文本，是文本文件读取的首选。

```java
try (BufferedReader reader = new BufferedReader(
        new InputStreamReader(
            new FileInputStream("D:/test/data.txt"), StandardCharsets.UTF_8))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}
```

`readLine()` 读取到换行符时返回该行内容（不包含换行符），到达文件末尾返回 `null`。

## 基本使用模式

字符输入流的读取套路固定为三步：

```java
try (Reader reader = new FileReader("D:/test/data.txt")) {
    // 1. 创建流（try-with-resources 自动关闭）
    char[] buffer = new char[1024];
    int len;
    // 2. 循环读取，read 返回 -1 表示结束
    while ((len = reader.read(buffer)) != -1) {
        // 处理 buffer[0, len) 区间的数据
    }
    // 3. 流在 try 结束时自动关闭
}
```

## Reader 与 InputStream 的选择

| 场景 | 推荐 |
| --- | --- |
| 文本数据（需要按字符处理、按行读取、处理编码） | `Reader` 体系 |
| 二进制数据（图片、音视频、序列化对象等） | `InputStream` 体系 |

用 `InputStream` 读取中文文本时，一个中文字符可能被拆散在两次读取中，导致乱码。`Reader` 会按照字符编码正确拼接，因此文本优先使用字符流。

## 注意事项

1. `Reader` 是抽象类，必须通过子类使用；
2. `read(char[])` 返回的是**实际读取的字符数**，数据处理只能使用 `[0, len)` 区间；
3. 读取文本时**必须关注编码**，推荐显式指定 `UTF-8`；
4. 流必须关闭，try-with-resources 是标准写法；
5. `BufferedReader` 的 `readLine()` 不会把换行符包含在结果中。
