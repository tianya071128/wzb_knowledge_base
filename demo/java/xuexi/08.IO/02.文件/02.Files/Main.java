import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;
import java.util.List;
import java.util.stream.Stream;

public class Main {
  public static void main(String[] args) throws Exception {
    /**
     * 静态工具类，配合 Path 使用，封装所有文件 / 目录操作，替代老旧 File 的手动 IO 逻辑
     * 所有方法均为 static，大部分操作抛出 IOException，错误信息明确。
     */

    Path path = Path.of("../10.test");
    System.out.println(path);

    // 文件属性
    System.out.println(Files.exists(path)); // 判断文件(或目录)是否存在
    System.out.println(Files.notExists(path)); // 判断文件(或目录)是否不存在
    System.out.println(Files.isRegularFile(path)); // 判断是否是普通文件
    System.out.println(Files.isDirectory(path)); // 判断是否是文件夹
    System.out.println(Files.isSymbolicLink(path)); // 判断是否是符号链接
    System.out.println(Files.isReadable(path)); // 判断文件(或目录)是否可读
    System.out.println(Files.isWritable(path)); // 判断文件(或目录)是否可写
    System.out.println(Files.isExecutable(path)); // 判断文件(或目录)是否可执行
    System.out.println(Files.size(path.resolve("demo.txt"))); // 获取文件大小
    System.out.println(Files.getLastModifiedTime(path.resolve("demo.txt"))); // 获取文件最后修改时间

    // 创建文件、目录
    Files.createFile(path.resolve("demo_" + System.currentTimeMillis() + ".json")); // 创建文件
    Files.createDirectory(path.resolve("demo_" + System.currentTimeMillis())); // 创建单层目录, 父目录不存在则报错
    Files.createDirectories(path.resolve("demo_" + System.currentTimeMillis(), "demo2")); // 创建多级目录, 父目录不存在则创建

    /**
     * 文件(或目录)复制:
     * - 默认情况下, 目标文件存在时抛出异常
     * - 传递第三个参数: StandardCopyOption.REPLACE_EXISTING 可覆盖目标文件
     */
    Files.copy(path.resolve("demo.txt"), path.resolve("copy_demo.txt"), StandardCopyOption.REPLACE_EXISTING);

    /**
     * 文件(或目录)移动(或重命名):
     * - 默认情况下, 目标文件存在时抛出异常
     * - 传递第三个参数: StandardCopyOption.REPLACE_EXISTING 可覆盖目标文件
     */
    Files.move(path.resolve("copy_demo.txt"), path.resolve("move_demo.txt"), StandardCopyOption.REPLACE_EXISTING);

    /**
     * 删除文件(或目录):
     * - 删除目录时, 目录必须为空
     * - 删除文件时, 文件必须存在
     */
    Files.delete(path.resolve("move_demo.txt"));
    Files.deleteIfExists(path.resolve("move_demo.txt")); // 删除文件时, 文件不存在则返回 false

    /**
     * 读取文件:
     * - readString: 读取字符串 --> 默认编码: UTF-8, 也可指定编码
     * - readAllBytes: 读取所有字节
     */
    System.out.println(Files.readString(path.resolve("demo.txt"), StandardCharsets.UTF_8));
    System.out.println(Files.readAllBytes(path.resolve("demo.txt"))); // 读取所有字节
    System.out.println(Files.readAllLines(path.resolve("demo.txt"))); // 读取所有行, 以字符串形式读取

    /**
     * 写入文件:
     * - writeString: 写入字符串 --> 可通过 StandardOpenOption 指定覆盖还是追加
     * - write: 写入字节或字符串集合（每行一个字符串）
     */
    Files.writeString(path.resolve("demo.txt"), "Hello World", StandardOpenOption.APPEND);
    Files.write(path.resolve("demo.txt"), List.of("Hello World"), StandardOpenOption.APPEND);

    /**
     * 遍历目录: 重要：Stream 流必须用 try-with-resources 关闭，否则文件句柄泄漏。 *
     * - list: 单层遍历
     * - walk: 递归遍历 --> 默认递归全部层级, 可指定最大层级
     * - find: 自定义查找
     */
    Stream<Path> stream1 = Files.list(path);
    Stream<Path> stream2 = Files.walk(path);
    Stream<Path> find = Files.find(
        path, Integer.MAX_VALUE,
        (path2, attr) -> path2.toString().endsWith(".txt"));

    /**
     * 流操作:
     * - 输入流: newInputStream, 读取文件
     * - 输出流: newOutputStream, 写入文件
     */
    try (InputStream inputStream = Files.newInputStream(path.resolve("demo.txt"));
        OutputStream outputStream = Files
            .newOutputStream(path.resolve("stream_" + System.currentTimeMillis() + ".txt"))) {
      byte[] bytes = new byte[1024];
      int len;
      while ((len = inputStream.read(bytes)) != -1) {
        outputStream.write(bytes, 0, len);
      }
    }

    /** 收尾工作 */
    /** 收尾工作 */
    /** 收尾工作 */
    /** 收尾工作 */
    /** 收尾工作 */
    /** 收尾工作 */
    Thread.sleep(2000);
    try (var stream = Files.walk(path)) {
      stream.sorted((a, b) -> b.compareTo(a))
          .filter(p -> !p.equals(path) && !p.equals(path.resolve("demo.txt")))
          .forEach(p -> {
            try {
              Files.deleteIfExists(p);
            } catch (IOException e) {
              throw new RuntimeException(e);
            }
          });
    }

  }
}