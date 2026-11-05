# Zip 操作

## 什么是 Zip

Java 通过 `java.util.zip` 包提供了对 ZIP 压缩文件的读写能力，主要类有：

| 类 | 作用 |
| --- | --- |
| `ZipInputStream` | 以流的方式**读取** zip 条目 |
| `ZipOutputStream` | 以流的方式**写出** zip 条目 |
| `ZipFile` | 按随机访问方式**读取** zip 文件 |
| `ZipEntry` | 表示 zip 中的一个条目（文件或目录） |

Java 7 还引入了 **Zip FileSystem Provider**（`java.nio.file`），可以把 zip 当作文件系统直接读写。

## 创建 Zip 文件

使用 `ZipOutputStream` 将多个文件压缩到一个 zip 包中：

```java
import java.io.*;
import java.util.zip.*;

public static void zip(File[] files, String zipPath) throws IOException {
    try (ZipOutputStream zos = new ZipOutputStream(
            new FileOutputStream(zipPath))) {
        for (File file : files) {
            // 为每个文件创建 ZipEntry
            zos.putNextEntry(new ZipEntry(file.getName()));
            try (FileInputStream fis = new FileInputStream(file)) {
                fis.transferTo(zos); // 复制文件内容到 zip
            }
            zos.closeEntry();
        }
    }
}
```

## 读取 Zip 文件

使用 `ZipInputStream` 遍历 zip 中的所有条目：

```java
public static void unzip(String zipPath, String destDir) throws IOException {
    try (ZipInputStream zis = new ZipInputStream(
            new FileInputStream(zipPath))) {
        ZipEntry entry;
        while ((entry = zis.getNextEntry()) != null) {
            File outFile = new File(destDir, entry.getName());
            if (entry.isDirectory()) {
                outFile.mkdirs(); // 创建目录
            } else {
                outFile.getParentFile().mkdirs();
                try (FileOutputStream fos = new FileOutputStream(outFile)) {
                    zis.transferTo(fos); // 写出到磁盘
                }
            }
            zis.closeEntry();
        }
    }
}
```

## ZipOutputStream 核心方法

### putNextEntry()

方法签名：

```java
public void putNextEntry(ZipEntry e) throws IOException
```

开始写入一个新的 zip 条目。参数 `ZipEntry` 定义了条目的名称、压缩方式、时间戳等元信息。

```java
ZipEntry entry = new ZipEntry("dir/file.txt");
entry.setTime(System.currentTimeMillis());
zos.putNextEntry(entry);
```

### write()

方法签名：

```java
public void write(byte[] b, int off, int len) throws IOException
```

向当前 zip 条目写入数据，直到 `closeEntry()` 被调用前都属于同一个条目。

```java
zos.write("hello".getBytes(StandardCharsets.UTF_8));
```

### closeEntry()

方法签名：

```java
public void closeEntry() throws IOException
```

关闭当前 zip 条目，准备写入下一个条目。必须与 `putNextEntry()` 成对使用。

### setMethod()

方法签名：

```java
public void setMethod(int method)
```

设置压缩方式，可选值：

- `ZipOutputStream.DEFLATED`（默认）：使用 deflate 压缩算法；
- `ZipOutputStream.STORED`：不压缩，仅存储。

### setLevel()

方法签名：

```java
public void setLevel(int level)
```

设置压缩级别，`0 ~ 9`：

- `ZipOutputStream.NO_COMPRESSION`（0）：不压缩；
- `ZipOutputStream.BEST_SPEED`（1）：速度最快；
- `ZipOutputStream.BEST_COMPRESSION`（9）：压缩率最高；
- `ZipOutputStream.DEFAULT_COMPRESSION`（-1）：默认级别。

### setComment()

方法签名：

```java
public void setComment(String comment)
```

为整个 zip 文件设置注释信息，读取时可以通过 `ZipFile.getComment()` 获取。

## ZipInputStream 核心方法

### getNextEntry()

方法签名：

```java
public ZipEntry getNextEntry() throws IOException
```

读取下一个 zip 条目，返回 `ZipEntry`；到达 zip 末尾时返回 `null`。

```java
ZipEntry entry;
while ((entry = zis.getNextEntry()) != null) {
    System.out.println(entry.getName());
}
```

### read()

方法签名：

```java
public int read(byte[] b, int off, int len) throws IOException
```

读取当前 zip 条目的解压数据。返回实际读取的字节数，到达条目末尾时返回 `-1`。

### closeEntry()

方法签名：

```java
public void closeEntry() throws IOException
```

关闭当前 zip 条目，继续读取下一个条目。

## ZipEntry 常用方法

### getName() / getSize() / getCompressedSize()

```java
entry.getName();             // 条目名称（含路径）
entry.getSize();             // 原始大小（字节）
entry.getCompressedSize();   // 压缩后大小（字节）
```

### isDirectory()

判断条目是否是一个目录。zip 中目录条目通常以 `/` 结尾。

```java
if (entry.isDirectory()) {
    // 创建目录
}
```

### getTime() / getLastModifiedTime()

获取条目的时间信息。`getTime()` 返回毫秒时间戳；`getLastModifiedTime()` 返回 `FileTime`。

```java
entry.getTime();
entry.getLastModifiedTime();
```

## ZipFile：随机访问读取

如果只需要读取 zip 中某个文件，`ZipFile` 比 `ZipInputStream` 更高效，它不需要遍历前面的条目：

```java
try (ZipFile zipFile = new ZipFile("D:/test/data.zip")) {
    ZipEntry entry = zipFile.getEntry("dir/file.txt");
    if (entry != null) {
        try (InputStream is = zipFile.getInputStream(entry)) {
            // 读取该条目内容
        }
    }
}
```

## Zip FileSystem：NIO 方式读写

Java 7 引入的 Zip FileSystem Provider 可以把 zip 文件挂载为一个文件系统，像操作普通文件一样操作 zip 内部文件：

```java
import java.net.URI;
import java.nio.file.*;

// 打开 zip 文件系统
Path zipPath = Paths.get("D:/test/data.zip");
try (FileSystem fs = FileSystems.newFileSystem(zipPath, (ClassLoader) null)) {
    Path inner = fs.getPath("/dir/file.txt");

    // 读取
    List<String> lines = Files.readAllLines(inner);

    // 写入（需要先以可写模式打开 zip 文件系统）
    Files.write(inner, "new content".getBytes(StandardCharsets.UTF_8));
}
```

## 压缩中文文件名乱码问题

`ZipInputStream` / `ZipOutputStream` 默认使用 **UTF-8** 编码文件名。如果 zip 包由 Windows 的「发送到压缩文件夹」生成，可能使用 GBK 编码文件名，读取时会乱码。

解决方案：在构造流时指定正确的字符编码：

```java
try (ZipInputStream zis = new ZipInputStream(
        new FileInputStream("D:/test/data.zip"), Charset.forName("GBK"))) {
    // 按 GBK 读取文件名
}
```

## 注意事项

1. zip 内部文件名使用 `/` 作为分隔符，跨平台解压时要注意路径安全；
2. **Zip Slip 漏洞**：恶意 zip 中的条目名称可能包含 `../`，解压时会写到目标目录之外。解压前必须校验 `entry.getName()` 解析后的路径是否在目标目录内；
3. `ZipFile` 支持随机访问，`ZipInputStream` 只能顺序读取；
4. `ZipOutputStream` 的 `putNextEntry` 和 `closeEntry` 必须配对使用；
5. 一个 zip 包中可以包含多个压缩方式不同的条目。
