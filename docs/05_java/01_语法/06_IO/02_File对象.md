# File 对象

## 什么是 File

`java.io.File` 是 Java 中用于表示文件系统对象（文件或目录）的类。注意 `File` 对象本身并不代表文件的实际内容，它只是文件系统中路径的一个抽象表示，读写内容仍需配合流来完成。

```java
import java.io.File;

File file = new File("D:/test/data.txt"); // 通过路径创建 File 对象
File dir = new File("D:/test");           // 目录同样用 File 表示
```

`File` 的构造方法有三种常用重载：

```java
// 通过路径字符串创建
File f1 = new File("D:/test/data.txt");

// 通过父目录路径和子路径创建
File f2 = new File("D:/test", "data.txt");

// 通过父 File 对象和子路径创建
File parent = new File("D:/test");
File f3 = new File(parent, "data.txt");
```

## 获取信息类方法

### getName()

返回文件或目录的名称，即路径中最后一部分，不包含父目录信息。

```java
File file = new File("D:/test/data.txt");
System.out.println(file.getName()); // data.txt
```

### getPath()

返回构造 `File` 对象时传入的路径。传入什么就返回什么，相对路径仍返回相对路径。

```java
File file = new File("data.txt"); // 相对路径
System.out.println(file.getPath()); // data.txt
```

### getAbsolutePath()

返回文件的绝对路径，无论构造时传入的是绝对路径还是相对路径。

```java
File file = new File("data.txt");
System.out.println(file.getAbsolutePath()); // D:/workspace/project/data.txt
```

### getParent()

返回父目录的路径字符串。如果 `File` 对象没有父目录（如只有文件名），返回 `null`。

```java
File file = new File("D:/test/data.txt");
System.out.println(file.getParent()); // D:/test

File file2 = new File("data.txt");
System.out.println(file2.getParent()); // null
```

### length()

返回文件的大小，单位为字节。如果文件不存在或表示目录，返回 `0`。

```java
File file = new File("D:/test/data.txt");
System.out.println(file.length()); // 例如：1024（字节）
```

### lastModified()

返回文件最后一次被修改的时间戳（毫秒），可与日期类配合转换成可读时间。

```java
File file = new File("D:/test/data.txt");
long time = file.lastModified();
System.out.println(new java.util.Date(time)); // Wed Oct 01 10:00:00 CST 2026
```

## 判断类方法

### exists()

判断 `File` 对象表示的文件或目录是否真实存在于磁盘上。

```java
File file = new File("D:/test/data.txt");
if (!file.exists()) {
    System.out.println("文件不存在");
}
```

### isFile()

判断是否为一个**标准文件**。只有当对象存在且是文件时才返回 `true`。

```java
File file = new File("D:/test/data.txt");
System.out.println(file.isFile()); // true
```

### isDirectory()

判断是否为一个**目录**。只有当对象存在且是目录时才返回 `true`。

```java
File dir = new File("D:/test");
System.out.println(dir.isDirectory()); // true
```

### canRead() / canWrite()

判断程序对文件是否具有读取 / 写入权限。

```java
File file = new File("D:/test/data.txt");
System.out.println(file.canRead());  // true
System.out.println(file.canWrite()); // true
```

### isHidden()

判断文件是否为隐藏文件。

```java
File file = new File("D:/test/hidden.txt");
System.out.println(file.isHidden()); // 隐藏文件返回 true
```

## 创建与删除类方法

### createNewFile()

当文件**不存在**时创建一个新的空文件，创建成功返回 `true`，文件已存在返回 `false`。该方法会抛出受检异常 `IOException`，必须处理。

```java
File file = new File("D:/test/data.txt");
boolean created = file.createNewFile(); // 需要处理 IOException
```

### mkdir()

创建单级目录。只有当**父目录已经存在**时才能创建成功，否则返回 `false`。

```java
File dir = new File("D:/test/a");
boolean created = dir.mkdir(); // D:/test 必须存在
```

### mkdirs()

创建多级目录。如果父目录不存在会自动一并创建，推荐优先使用。

```java
File dir = new File("D:/test/a/b/c");
boolean created = dir.mkdirs(); // a、b、c 都不存在也能创建成功
```

### delete()

删除文件或**空目录**，删除成功返回 `true`。注意：目录非空时删除失败；该操作不会进入回收站，直接从磁盘移除。

```java
File file = new File("D:/test/data.txt");
boolean deleted = file.delete();
```

## 遍历目录类方法

### list()

返回目录下所有文件和子目录的**名称**组成的字符串数组。如果对象不是目录或发生 IO 错误，返回 `null`。

```java
File dir = new File("D:/test");
String[] names = dir.list();
for (String name : names) {
    System.out.println(name);
}
```

### listFiles()

返回目录下所有文件和子目录的 `File` 对象数组，比 `list()` 更常用，因为可以直接对每个条目继续操作。

```java
File dir = new File("D:/test");
File[] files = dir.listFiles();
for (File file : files) {
    System.out.println(file.getName());
}
```

### listFiles(FilenameFilter)

带文件过滤器的重载，只返回满足条件的条目。第一个参数是当前目录，第二个参数是文件名。

```java
File dir = new File("D:/test");
// 只列出 .txt 文件
File[] txtFiles = dir.listFiles((f, name) -> name.endsWith(".txt"));
```

## 递归遍历目录

结合 `listFiles()` 和 `isDirectory()` 可以递归遍历多级目录：

```java
public static void printFiles(File dir, int depth) {
    File[] files = dir.listFiles();
    if (files == null) {
        return;
    }
    for (File file : files) {
        System.out.println("  ".repeat(depth) + file.getName());
        if (file.isDirectory()) {
            printFiles(file, depth + 1); // 递归进入子目录
        }
    }
}
```

## 路径的表示

- **绝对路径**：从盘符或根目录开始的完整路径，如 `D:/test/data.txt`。
- **相对路径**：相对于当前工作目录的路径，如 `data.txt`。Java 项目中相对路径的基准是项目根目录。

路径分隔符在不同操作系统上不同（Windows 是 `\`，Linux/macOS 是 `/`），推荐使用 `File.separator` 常量或直接使用 `/`：

```java
File file = new File("D:/test" + File.separator + "data.txt");
```

## 注意事项

1. `new File()` 不会在磁盘上创建文件，只有调用 `createNewFile()`、`mkdir()` 等方法才会真正操作文件系统；
2. `delete()` 只能删除文件或**空目录**，删除多级目录需要递归实现；
3. `list()` 和 `listFiles()` 在路径不存在或发生 IO 错误时返回 `null`，使用前需要判空。
