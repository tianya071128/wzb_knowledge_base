# FilterInputStream

## 什么是 FilterInputStream

`java.io.FilterInputStream` 是 `InputStream` 的一个子类，也是所有**处理流（包装流）**的抽象基类。它本身并不直接连接数据源，而是**包装另一个 InputStream**，在父类 `InputStream` 的基础上增加额外功能。

```java
import java.io.FilterInputStream;
import java.io.InputStream;

// FilterInputStream 是抽象类，通常不直接使用
public class UpperCaseInputStream extends FilterInputStream {
    public UpperCaseInputStream(InputStream in) {
        super(in);
    }
}
```

常见的 `FilterInputStream` 子类：

| 子类 | 功能 |
| --- | --- |
| `BufferedInputStream` | 内部维护缓冲区，减少系统调用次数 |
| `DataInputStream` | 读取基本类型数据（int、double、boolean 等） |
| `PushbackInputStream` | 支持把已读取的字节回退到流中 |
| `CheckedInputStream` | 读取时计算校验和（如 CRC32） |

## 核心设计：装饰器模式

`FilterInputStream` 是 Java IO 中**装饰器模式**（Decorator Pattern）的典型应用。它把功能增强拆分成一个个独立的类，每个类只负责一项增强，再通过组合的方式叠加。

```
FileInputStream              // 基础流，连接文件
  ↓
BufferedInputStream          // 装饰：增加缓冲
  ↓
DataInputStream              // 装饰：增加基本类型读取
```

```java
try (DataInputStream dis = new DataInputStream(
        new BufferedInputStream(
            new FileInputStream("D:/test/data.bin")))) {
    int age = dis.readInt();    // DataInputStream 提供的方法
    double score = dis.readDouble();
}
```

这样写的好处是：

- **单一职责**：每个流只负责一种功能；
- **自由组合**：可以根据需要叠加不同的功能；
- **对调用方透明**：外层 `DataInputStream` 仍然是一个 `InputStream`，可以传入任何接收 `InputStream` 的方法。

## 构造方法

方法签名：

```java
protected FilterInputStream(InputStream in)
```

构造方法由子类调用，传入被包装的底层输入流。构造后可以通过 `in` 字段访问底层流。

```java
public class MyFilter extends FilterInputStream {
    public MyFilter(InputStream in) {
        super(in); // 子类必须调用父类构造方法
    }
}
```

## 方法委托机制

`FilterInputStream` 内部维护了一个 `protected volatile InputStream in` 字段，它的大多数方法都直接委托给底层流：

```java
public int read() throws IOException {
    return in.read(); // 委托给被包装的流
}

public int read(byte[] b, int off, int len) throws IOException {
    return in.read(b, off, len);
}

public void close() throws IOException {
    in.close();
}
```

子类只需要重写自己关心的方法即可，不需要重新实现整个 `InputStream`。

## 自定义 FilterInputStream 示例

下面是一个把读取到的所有英文字母转换为大写的自定义过滤流：

```java
import java.io.FilterInputStream;
import java.io.IOException;
import java.io.InputStream;

public class UpperCaseInputStream extends FilterInputStream {

    protected UpperCaseInputStream(InputStream in) {
        super(in);
    }

    @Override
    public int read() throws IOException {
        int c = in.read();
        return (c == -1) ? -1 : Character.toUpperCase((char) c);
    }

    @Override
    public int read(byte[] b, int off, int len) throws IOException {
        int result = in.read(b, off, len);
        if (result != -1) {
            for (int i = off; i < off + result; i++) {
                b[i] = (byte) Character.toUpperCase((char) (b[i] & 0xFF));
            }
        }
        return result;
    }
}
```

使用方式：

```java
try (InputStream is = new UpperCaseInputStream(
        new FileInputStream("D:/test/hello.txt"))) {
    int b;
    while ((b = is.read()) != -1) {
        System.out.print((char) b); // 输出全是大写
    }
}
```

## FilterInputStream 与 InputStream 的关系

```
InputStream（抽象基类）
    ├── FileInputStream（节点流，连接文件）
    ├── ByteArrayInputStream（节点流，连接内存）
    └── FilterInputStream（处理流基类）
            ├── BufferedInputStream（缓冲）
            ├── DataInputStream（基本类型读取）
            └── PushbackInputStream（回退）
```

- **节点流**：直接连接数据源；
- **处理流**：包装其他流，增强功能；
- `FilterInputStream` 把所有处理流的共性（包装一个底层流并委托方法）抽象出来，子类只需专注自己的增强逻辑。

## 注意事项

1. `FilterInputStream` 是抽象类，一般**不直接使用**，而是继承它实现自定义处理流；
2. 子类重写方法时，通常只需要覆盖实际增强的方法，其他方法会自动委托给底层流；
3. `close()` 默认会调用底层流的 `close()`，因此关闭最外层流即可，无需逐层关闭；
4. 装饰时顺序很重要：例如 `DataInputStream` 必须包装在最外层才能使用 `readInt()` 等特有方法。
