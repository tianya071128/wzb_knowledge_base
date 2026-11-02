# Files 工具类

## 什么是 Files

`java.nio.file.Files` 是 Java 7 引入的 NIO.2 文件操作工具类（final 类），所有方法都是静态方法，配合 `Path` 对象完成文件和目录的存在判断、创建、复制、移动、删除、读写等操作，用来取代 `java.io.File` 的实例方法。

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

Path path = Paths.get("D:/test/data.txt");
Files.exists(path); // 判断文件是否存在
```

与 `java.io.File` 不同，`Files` 的方法失败时通常**抛出异常**（`IOException` 及其子类）而不是返回 `false` 或 `null`，错误信息更明确。

## 使用场景

`Files` 工具类覆盖了日常开发中绝大多数文件操作需求：

| 场景 | 推荐方法 |
| --- | --- |
| 判断文件/目录是否存在、是否有权限 | `exists()`、`isReadable()`、`isWritable()` |
| 初始化时创建配置文件或目录结构 | `createFile()`、`createDirectories()` |
| 清理临时文件、删除单个文件 | `delete()`、`deleteIfExists()` |
| 文件备份、复制资源到目标位置 | `copy()` |
| 文件移动、重命名 | `move()` |
| 读取小体积配置文件、模板文件 | `readAllBytes()`、`readAllLines()` |
| 写入日志、导出结果数据 | `write()`（配合 `APPEND` 追加） |
| 逐行处理日志等大文本文件 | `newBufferedReader()`、`lines()` |
| 扫描目录、递归查找特定文件 | `list()`、`walk()`、`find()` |

简单概括：**判断与元信息查询、文件/目录的增删复制移动、内容的读写、目录的遍历**四类操作都可以直接用 `Files` 的静态方法完成，通常无需再手动创建流对象。

## 判断类方法

### exists()

方法签名：

```java
static boolean exists(Path path, LinkOption... options)
```

判断文件或目录是否存在。`options` 可变参数用于控制是否跟随符号链接（默认跟随）。

```java
Files.exists(Paths.get("D:/test/data.txt")); // 存在返回 true
```

### isDirectory()

方法签名：

```java
static boolean isDirectory(Path path, LinkOption... options)
```

判断路径是否为目录。

```java
Files.isDirectory(Paths.get("D:/test")); // true
```

### isRegularFile()

方法签名：

```java
static boolean isRegularFile(Path path, LinkOption... options)
```

判断路径是否为普通文件（非目录、非符号链接等特殊文件）。

```java
Files.isRegularFile(Paths.get("D:/test/data.txt")); // true
```

### isReadable() / isWritable() / isExecutable()

方法签名：

```java
static boolean isReadable(Path path)
static boolean isWritable(Path path)
static boolean isExecutable(Path path)
```

判断程序对文件是否具有读取、写入或执行权限。

```java
Path path = Paths.get("D:/test/data.txt");
Files.isReadable(path); // true
Files.isWritable(path); // true
```

### size()

方法签名：

```java
static long size(Path path) throws IOException
```

返回文件大小（字节）。如果文件不存在或无法读取会抛出 `IOException`。

```java
long bytes = Files.size(Paths.get("D:/test/data.txt"));
```

## 创建与删除类方法

### createFile()

方法签名：

```java
static Path createFile(Path path) throws IOException
```

创建新的空文件。文件已存在时抛出 `FileAlreadyExistsException`。

```java
Files.createFile(Paths.get("D:/test/data.txt"));
```

### createDirectory() / createDirectories()

方法签名：

```java
static Path createDirectory(Path dir) throws IOException
static Path createDirectories(Path dir) throws IOException
```

- `createDirectory`：创建单级目录，父目录不存在时抛出异常；
- `createDirectories`：自动创建所有不存在的父目录（类似 `File.mkdirs`），推荐使用。

```java
Files.createDirectories(Paths.get("D:/test/a/b/c"));
```

### delete()

方法签名：

```java
static void delete(Path path) throws IOException
```

删除文件或**空目录**。文件不存在时抛出 `NoSuchFileException`，目录非空时抛出 `DirectoryNotEmptyException`。

```java
Files.delete(Paths.get("D:/test/data.txt"));
```

### deleteIfExists()

方法签名：

```java
static boolean deleteIfExists(Path path) throws IOException
```

文件存在时删除并返回 `true`，不存在时返回 `false`（不抛异常），删除前判断场景下更方便。

```java
Files.deleteIfExists(Paths.get("D:/test/data.txt"));
```

## 复制与移动类方法

### copy()

方法签名：

```java
static Path copy(Path source, Path target, CopyOption... options) throws IOException
```

复制文件或目录。默认情况下目标文件已存在会抛出 `FileAlreadyExistsException`，可通过 `options` 控制：

- `StandardCopyOption.REPLACE_EXISTING`：覆盖已存在的目标文件；
- `StandardCopyOption.COPY_ATTRIBUTES`：复制文件属性（修改时间等）。

```java
import java.nio.file.StandardCopyOption;

Files.copy(
    Paths.get("D:/test/a.txt"),
    Paths.get("D:/test/b.txt"),
    StandardCopyOption.REPLACE_EXISTING
);
```

### move()

方法签名：

```java
static Path move(Path source, Path target, CopyOption... options) throws IOException
```

移动或重命名文件、目录。常用选项：

- `StandardCopyOption.REPLACE_EXISTING`：覆盖已存在的目标；
- `StandardCopyOption.ATOMIC_MOVE`：原子移动，要么完全成功要么失败。

```java
Files.move(
    Paths.get("D:/test/a.txt"),
    Paths.get("D:/other/a.txt"),
    StandardCopyOption.REPLACE_EXISTING
);
```

## 读写类方法

### readAllBytes()

方法签名：

```java
static byte[] readAllBytes(Path path) throws IOException
```

一次性读取文件的全部字节，适合小文件。

```java
byte[] data = Files.readAllBytes(Paths.get("D:/test/data.txt"));
String content = new String(data);
```

### readAllLines()

方法签名：

```java
static List<String> readAllLines(Path path) throws IOException
static List<String> readAllLines(Path path, Charset cs) throws IOException
```

一次性读取文件的所有行到 `List<String>`，默认使用 UTF-8 编码。

```java
List<String> lines = Files.readAllLines(Paths.get("D:/test/data.txt"));
lines.forEach(System.out::println);
```

### write()

方法签名：

```java
static Path write(Path path, byte[] bytes, OpenOption... options) throws IOException
static Path write(Path path, Iterable<? extends CharSequence> lines,
                  OpenOption... options) throws IOException
```

将字节或字符串列表写入文件，默认覆盖已有内容。常用 `OpenOption`：

- `StandardOpenOption.APPEND`：追加写入；
- `StandardOpenOption.CREATE`：文件不存在时创建；
- `StandardOpenOption.TRUNCATE_EXISTING`：写入前清空文件。

```java
// 写入字符串（覆盖）
Files.write(Paths.get("D:/test/out.txt"), "Hello Files".getBytes());

// 追加多行
Files.write(
    Paths.get("D:/test/out.txt"),
    List.of("line1", "line2"),
    StandardOpenOption.APPEND,
    StandardOpenOption.CREATE
);
```

### newBufferedReader() / newBufferedWriter()

方法签名：

```java
static BufferedReader newBufferedReader(Path path) throws IOException
static BufferedWriter newBufferedWriter(Path path, OpenOption... options) throws IOException
```

打开带缓冲的字符流，适合逐行读写大文件，默认 UTF-8 编码。

```java
// 逐行读取大文件
try (BufferedReader reader = Files.newBufferedReader(Paths.get("D:/test/big.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}
```

### lines()

方法签名：

```java
static Stream<String> lines(Path path) throws IOException
```

以 `Stream<String>` 的形式惰性读取文件行，可结合 Stream API 进行过滤、映射等处理，适合大文件。

```java
try (Stream<String> stream = Files.lines(Paths.get("D:/test/big.txt"))) {
    stream.filter(line -> line.contains("error"))
          .forEach(System.out::println);
}
```

## 遍历类方法

### list()

方法签名：

```java
static Stream<Path> list(Path dir) throws IOException
```

列出目录下的直接子项（不递归），返回 `Stream<Path>`，必须用 try-with-resources 关闭。

```java
try (Stream<Path> entries = Files.list(Paths.get("D:/test"))) {
    entries.forEach(System.out::println);
}
```

### walk()

方法签名：

```java
static Stream<Path> walk(Path start, int maxDepth, FileVisitOption... options) throws IOException
static Stream<Path> walk(Path start, FileVisitOption... options) throws IOException
```

**递归**遍历目录树（含子目录），深度遍历，可限制最大层级。

```java
try (Stream<Path> paths = Files.walk(Paths.get("D:/test"))) {
    paths.filter(Files::isRegularFile)
         .forEach(System.out::println);
}
```

### find()

方法签名：

```java
static Stream<Path> find(Path start, int maxDepth,
                         BiPredicate<Path, BasicFileAttributes> matcher,
                         FileVisitOption... options) throws IOException
```

在遍历的同时按条件过滤，比 `walk()` + `filter` 更高效（可以在遍历中直接短路）。

```java
try (Stream<Path> paths = Files.find(Paths.get("D:/test"), 3,
        (path, attr) -> path.toString().endsWith(".txt"))) {
    paths.forEach(System.out::println);
}
```

## Files 与 File 的方法对照

| 操作 | `File`（java.io） | `Files`（java.nio） |
| --- | --- | --- |
| 是否存在 | `exists()` 返回布尔值 | `Files.exists(path)` |
| 创建文件 | `createNewFile()` | `Files.createFile(path)`（已存在抛异常） |
| 创建目录 | `mkdir()` / `mkdirs()` | `createDirectory()` / `createDirectories()` |
| 删除 | `delete()` 返回布尔值 | `delete()` / `deleteIfExists()` |
| 复制 | 无内置方法，需手动读写 | `copy()` |
| 移动 | `renameTo()` | `move()` |
| 读取全部内容 | 无 | `readAllBytes()` / `readAllLines()` |
| 遍历目录 | `listFiles()`（单级） | `list()`（单级）/ `walk()`（递归） |

## 注意事项

1. `Files` 是 final 工具类，构造方法私有，不能实例化；
2. `list()`、`walk()`、`find()`、`lines()` 返回的 Stream 底层持有文件句柄，**必须用 try-with-resources 关闭**，否则会泄露资源；
3. `delete()` 无法删除非空目录，递归删除需要配合 `walk()` 实现；
4. 读写大文件时避免使用 `readAllBytes()` / `readAllLines()`（全量载入内存），优先使用 `newBufferedReader()` 或 `lines()`。
