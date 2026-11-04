# Writer

## 什么是 Writer

`java.io.Writer` 是 Java IO 中**字符输出流**的抽象基类，用于以字符为单位写出文本数据。与 `OutputStream` 不同，它会根据指定的字符编码将字符编码为字节，避免手动处理编码问题。

```java
import java.io.FileWriter;
import java.io.Writer;

Writer writer = new FileWriter("D:/test/out.txt"); // 默认使用平台编码
```

常见子类及对应目标：

| 子类 | 目标 |
| --- | --- |
| `FileWriter` | 文件 |
| `StringWriter` | 内存中的字符串 |
| `BufferedWriter` | 包装其他字符流，提供缓冲与按行写出 |
| `OutputStreamWriter` | 把字符流 `Writer` 桥接为字节流 `OutputStream` |

## 核心方法

### write()

方法签名：

```java
public void write(int c) throws IOException
void write(char[] cbuf) throws IOException
void write(char[] cbuf, int off, int len) throws IOException
void write(String str) throws IOException
void write(String str, int off, int len) throws IOException
```

写出字符的核心方法，支持多种来源：

- `write(int c)`：写出一个字符（只使用低 16 位）；
- `write(char[] cbuf)`：写出字符数组中的全部字符；
- `write(char[] cbuf, int off, int len)`：写出数组中从 `off` 开始的 `len` 个字符；
- `write(String str)`：写出字符串的全部字符；
- `write(String str, int off, int len)`：写出字符串中从 `off` 开始的 `len` 个字符。

```java
try (Writer writer = new FileWriter("D:/test/out.txt")) {
    writer.write('A');                       // 单个字符
    writer.write("Hello".toCharArray());     // 字符数组
    writer.write("World");                   // 字符串
    writer.write("Java", 0, 2);              // 只写出 "Ja"
}
```

### close()

方法签名：

```java
public abstract void close() throws IOException
```

关闭流并释放底层资源。`close()` 内部会先调用 `flush()`，确保缓冲区中的字符全部写出。

```java
try (Writer writer = new FileWriter("D:/test/out.txt")) {
    writer.write("Hello");
    // try 块结束后自动 flush + close
}
```

### flush()

方法签名：

```java
public void flush() throws IOException
```

刷新缓冲区，把字符立即写出到目标。`Writer` 同样可能使用内部缓冲，重要数据写出后应主动调用 `flush()`。

```java
writer.write("重要日志");
writer.flush(); // 确保立即落盘或发送
```

## 创建流时如何指定编码

字符流 `Writer` 在创建时同样可以指定字符编码。Java 提供了两种常见方式：

### 方式一：使用 OutputStreamWriter（Java 7 起通用）

```java
try (Writer writer = new OutputStreamWriter(
        new FileOutputStream("D:/test/out.txt"), StandardCharsets.UTF_8)) {
    writer.write("你好，Java IO");
}
```

`OutputStreamWriter` 的第二个参数就是字符集，字符会按 UTF-8 编码为字节后写出。

### 方式二：使用 FileWriter（Java 11+）

Java 11 为 `FileWriter` 新增了带 `Charset` 的构造方法，并支持追加模式：

```java
// 覆盖模式，指定 UTF-8
try (Writer writer = new FileWriter("D:/test/out.txt", StandardCharsets.UTF_8)) {
    writer.write("你好");
}

// 追加模式，指定 UTF-8
try (Writer writer = new FileWriter("D:/test/out.txt", StandardCharsets.UTF_8, true)) {
    writer.write("追加内容");
}
```

### 不推荐：默认编码

以下写法没有显式指定编码，会使用平台默认编码，跨平台时可能乱码：

```java
// 不推荐：依赖平台默认编码
Writer writer = new FileWriter("D:/test/out.txt");
```

## FileWriter 的追加模式

`FileWriter` 同样支持覆盖和追加两种模式：

```java
// 覆盖模式（默认）：文件已存在则清空重写
try (Writer writer = new FileWriter("D:/test/out.txt")) {
    writer.write("新内容");
}

// 追加模式：第二个参数为 true，在文件末尾追加
try (Writer writer = new FileWriter("D:/test/out.txt", true)) {
    writer.write("追加内容");
}
```

### 追加模式说明

- 默认构造或 `append = false`：从文件开头写，**已存在内容会被清空**；
- `append = true`：从文件末尾追加写，**已存在内容保留**。

追加模式常用于日志、历史记录等需要保留已有数据的场景。字符流推荐使用 `BufferedWriter.newLine()` 写入换行符，保证跨平台换行一致。

```java
try (BufferedWriter writer = new BufferedWriter(
        new FileWriter("D:/test/app.log", true))) {
    writer.write("[" + LocalDateTime.now() + "] 启动");
    writer.newLine();
}
```

## OutputStreamWriter：字符流转字节流的桥梁

`OutputStreamWriter` 是字符流与字节流之间的**适配器**，它包装一个 `OutputStream`，按指定字符编码将字符编码为字节后写出。

```java
// 显式指定 UTF-8 编码写出文件
try (Writer writer = new OutputStreamWriter(
        new FileOutputStream("D:/test/out.txt"), StandardCharsets.UTF_8)) {
    writer.write("你好，Java IO");
}
```

与 `InputStreamReader` 一样，**显式指定编码是更安全的做法**。

## BufferedWriter：缓冲字符流

`BufferedWriter` 在内部维护字符缓冲区，并提供 `newLine()` 方法写出平台无关的换行符。

```java
try (BufferedWriter writer = new BufferedWriter(
        new OutputStreamWriter(
            new FileOutputStream("D:/test/out.txt"), StandardCharsets.UTF_8))) {
    writer.write("第一行");
    writer.newLine(); // 自动使用当前系统的换行符
    writer.write("第二行");
}
```

使用 `newLine()` 而不是硬编码 `\n` 或 `\r\n`，可以让生成的文本在不同操作系统下保持一致的换行行为。

## 基本使用模式

字符输出流的写出套路固定为三步：

```java
try (Writer writer = new FileWriter("D:/test/out.txt")) {
    // 1. 创建流（try-with-resources 自动关闭）
    writer.write("Hello IO");
    // 2. 写出数据
    writer.flush();
    // 3. 刷新缓冲区（close 前确保数据写出）
}
```

## Writer 与 OutputStream 的选择

| 场景 | 推荐 |
| --- | --- |
| 文本数据（需要按字符处理、处理编码、写出字符串） | `Writer` 体系 |
| 二进制数据（图片、音视频、压缩包等） | `OutputStream` 体系 |

写出文本时使用 `Writer`，可以避免手动调用 `String.getBytes()` 和处理编码转换。

## 注意事项

1. `Writer` 是抽象类，必须通过子类使用；
2. 覆盖模式会**清空已有文件**，追加需求要显式传入 `append = true`；
3. 写出文本时**必须关注编码**，推荐显式指定 `UTF-8`；
4. 使用缓冲流后忘记 flush/close 会导致数据丢失；
5. 流必须关闭，try-with-resources 是标准写法。
