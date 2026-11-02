# Path 对象

## 什么是 Path

`java.nio.file.Path` 是 Java 7 引入的 NIO.2 中用于表示文件系统中路径的接口（位于 `java.nio.file` 包），用来取代传统的 `java.io.File`。`Path` 提供了更丰富、更现代化的路径操作 API，配合 `Files` 工具类可以完成文件的全部操作。

```java
import java.nio.file.Path;
import java.nio.file.Paths;

Path path = Paths.get("D:/test/data.txt"); // 通过 Paths.get 创建
Path path2 = Path.of("D:/test", "data.txt"); // Java 11+ 推荐写法
```

`Paths.get()` 支持单段路径或多段参数拼接两种用法：

```java
// 通过路径字符串创建
Path p1 = Paths.get("D:/test/data.txt");

// 通过父目录和子路径创建
Path p2 = Paths.get("D:/test", "data.txt");

// 多级子路径也可以一次性传入
Path p3 = Paths.get("D:", "test", "a", "b.txt");
```

## Paths 工具类

`java.nio.file.Paths` 是 `Path` 的配套工厂工具类（final 类），其唯一职责是通过静态方法 `get()` 创建 `Path` 实例。由于 `Path` 是接口不能直接实例化，创建操作统一收口在 `Paths` 中。

```java
public final class Paths {
    // 通过 URI 创建
    public static Path get(URI uri);

    // 通过路径字符串创建，支持多段参数自动拼接
    public static Path get(String first, String... more);
}
```

### get(String first, String... more)

方法签名：

```java
public static Path get(String first, String... more)
```

最常用的创建方式。第一个参数是路径的开头，剩余参数作为后续子路径自动用分隔符拼接，参数可以是绝对路径或相对路径。

```java
Path p1 = Paths.get("D:/test/data.txt");     // 绝对路径
Path p2 = Paths.get("src", "main", "java");  // 相对路径：src\main\java
Path p3 = Paths.get("D:/test", "a", "b.txt"); // 多段拼接：D:\test\a\b.txt
```

### get(URI uri)

方法签名：

```java
public static Path get(URI uri)
```

通过 `URI` 创建路径，主要用于读取 JAR 包等非文件系统资源：

```java
Path jar = Paths.get(URI.create("file:///D:/test/data.txt")); // D:\test\data.txt
```

### Paths 与 Path.of 的关系

Java 11 在 `Path` 接口上直接提供了静态工厂方法 `Path.of()`，其签名与 `Paths.get()` 完全一致，内部就是调用 `Paths.get()`。因此：

- **Java 11+**：推荐直接使用 `Path.of(...)`，不再需要 `Paths`；
- **Java 8 ~ 10**：只能使用 `Paths.get(...)`；
- 旧代码中出现的大量 `Paths.get()` 仍然有效，两者可以混用。

```java
// 以下两行完全等价（Java 11+）
Path a = Paths.get("D:/test/data.txt");
Path b = Path.of("D:/test/data.txt");
```

## 从 File 与 Path 的互转

```java
// File 转 Path
File file = new File("D:/test/data.txt");
Path path = file.toPath();

// Path 转 File
File file2 = path.toFile();
```

## 常用方法

### getFileName()

方法签名：

```java
Path getFileName()
```

返回路径中的文件名（或最后一级目录名），以 `Path` 对象表示。

```java
Path path = Paths.get("D:/test/data.txt");
System.out.println(path.getFileName()); // data.txt
```

### getParent()

方法签名：

```java
Path getParent()
```

返回父目录的 `Path` 对象，如果没有父目录返回 `null`。

```java
Path path = Paths.get("D:/test/data.txt");
System.out.println(path.getParent()); // D:\test
```

### getRoot()

方法签名：

```java
Path getRoot()
```

返回路径的根部分（如 `D:\`），相对路径返回 `null`。

```java
Path path = Paths.get("D:/test/data.txt");
System.out.println(path.getRoot()); // D:\
```

### isAbsolute()

方法签名：

```java
boolean isAbsolute()
```

判断路径是否为绝对路径。

```java
Paths.get("D:/test/data.txt").isAbsolute(); // true
Paths.get("data.txt").isAbsolute();         // false
```

### toAbsolutePath()

方法签名：

```java
Path toAbsolutePath()
```

将相对路径转换为绝对路径，基于当前工作目录解析。

```java
Path path = Paths.get("data.txt");
System.out.println(path.toAbsolutePath()); // D:/workspace/project/data.txt
```

### resolve()

方法签名：

```java
Path resolve(Path other)
Path resolve(String other) // 重载：内部先转换为 Path 再拼接
```

路径拼接：以当前路径为基准拼接子路径。如果参数是绝对路径则直接返回该参数。这是 `Path` 最常用的方法，用于取代字符串拼接路径。

```java
Path dir = Paths.get("D:/test");
Path file = dir.resolve("data.txt"); // D:\test\data.txt

Path abs = dir.resolve("D:/other/a.txt"); // D:\other\a.txt（绝对路径直接返回）
```

### resolveSibling()

方法签名：

```java
Path resolveSibling(Path other)
Path resolveSibling(String other) // 重载：内部先转换为 Path 再拼接
```

以当前路径的**父目录**为基准拼接子路径，常用于生成同目录下的兄弟文件。

```java
Path path = Paths.get("D:/test/data.txt");
Path sibling = path.resolveSibling("data.bak"); // D:\test\data.bak
```

### relativize()

方法签名：

```java
Path relativize(Path other)
```

计算两个路径之间的相对路径，即从当前路径到达参数路径需要经过的相对路径。

```java
Path p1 = Paths.get("D:/test/a");
Path p2 = Paths.get("D:/test/b/c");
System.out.println(p1.relativize(p2)); // ..\b\c
```

### normalize()

方法签名：

```java
Path normalize()
```

去除路径中的冗余部分（`.` 和 `..`），返回规范化后的路径。

```java
Path path = Paths.get("D:/test/a/../b/./c");
System.out.println(path.normalize()); // D:\test\b\c
```

### iterator() / getName(int)

方法签名：

```java
Iterator<Path> iterator()  // 迭代器，使 Path 可用于增强 for 循环
Path getName(int index)    // 按索引获取名称元素，从 0 开始
```

`Path` 由多个名称元素组成，可以按索引访问或迭代遍历。

```java
Path path = Paths.get("D:/test/data.txt");

path.getName(0); // test
path.getName(1); // data.txt

for (Path part : path) {
    System.out.println(part); // 依次输出 test、data.txt（不含根）
}
```

### startsWith() / endsWith()

方法签名：

```java
boolean startsWith(String other)
boolean startsWith(Path other)
boolean endsWith(String other)
boolean endsWith(Path other)
```

判断路径是否以指定的路径片段开头或结尾，各有 `String` 和 `Path` 两个重载。

```java
Path path = Paths.get("D:/test/data.txt");
path.startsWith("D:/test"); // true
path.endsWith("data.txt");  // true
```

## Path 与 Files 配合使用

`Path` 通常与 `Files` 工具类配合，完成文件的存在判断、创建、复制、删除等操作：

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;

Path path = Paths.get("D:/test/data.txt");

Files.exists(path);                       // 判断是否存在
Files.createFile(path);                   // 创建文件（已存在会抛异常）
Files.createDirectories(Paths.get("D:/test/a/b")); // 创建多级目录
Files.copy(path, Paths.get("D:/test/bak.txt"));     // 复制
Files.delete(path);                       // 删除（不存在会抛异常）
Files.readAllLines(path);                 // 一次读取所有行
```

与 `java.io.File` 不同，`Files` 的方法失败时通常**抛出异常**而不是返回 `false` 或 `null`，错误信息更明确。

## Path 与 File 的对比

| 对比项 | `File`（java.io） | `Path` + `Files`（java.nio） |
| --- | --- | --- |
| 类型 | 类 | 接口（通过 `Path.of` / `Paths.get` 创建） |
| 引入版本 | Java 1.0 | Java 7 |
| 错误处理 | 返回布尔值，失败原因不明 | 抛出异常，附带详细信息 |
| 符号链接 | 不支持 | 默认支持 |
| 高级操作 | 无 | 递归遍历（walk）、文件监听（WatchService）等 |
| 推荐度 | 旧代码维护 | 新代码推荐使用 |

## 注意事项

1. `Path` 是接口，不能直接 `new`，需通过 `Path.of()` 或 `Paths.get()` 创建；
2. `resolve()` 拼接时如果参数为空字符串，返回的路径末尾会带分隔符；
3. 新代码优先使用 `Path` + `Files`，仅在与旧 API 交互时通过 `toPath()` / `toFile()` 转换。
