import java.nio.file.Path;

public class Main {
  public static void main(String[] args) {
    /**
     * Path 用于处理文件路径
     */

    // 创建, 不会规范化路径
    Path path = Path.of("../xuexi/../Main.java");
    Path workPath = Path.of(System.getProperty("user.dir")); // 程序启动目录
    System.out.println(workPath); // D:\学习\wzb_knowledge_base\demo\java\xuexi\08.IO\01.Path

    // 获取文件名或目录名 --> 返回路径最后一部分（文件或目录名）
    System.out.println(path.getFileName()); // Main.java

    // 获取父路径 --> 返回路径的上一级路径
    System.out.println(path.getParent()); // ..\xuexi\..

    // 获取绝对路径 --> 返回路径的绝对路径
    System.out.println(path.toAbsolutePath()); // D:\学习\wzb_knowledge_base\demo\java\xuexi\08.IO\01.Path\..\xuexi\..\Main.java

    // 获取路径的根路径 --> 获取路径的根路径
    System.out.println(path.getRoot()); // null

    // 规范化 --> 消除 ../ . 冗余符号
    System.out.println(path.normalize()); // ..\Main.java
    System.out.println(Path.of("../../Main.java").toAbsolutePath().normalize()); // D:\学习\wzb_knowledge_base\demo\java\xuexi\Main.java

    // 拼接路径
    System.out.println(path.resolve("../xuexi")); // ..\xuexi\..\Main.java\..\xuexi

    // 比较（区分大小写取决于文件系统）
    System.out.println(path.equals(Path.of("../xuexi/../Main.java"))); // true
  }
}
