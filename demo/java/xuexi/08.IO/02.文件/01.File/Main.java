import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public class Main {
  public static void main(String[] args) throws IOException {
    /**
     * File: 可表示文件、文件夹；
     * - 适用于操作小文件
     * - 更推荐使用 Path + Files 操作
     */

    // 创建
    File file = new File(Path.of("../../../").toString());

    // 1. 获取路径信息
    System.out.println(file.getPath()); // 传入的原始路径 --> ..\..\..
    System.out.println(file.getAbsolutePath()); // 绝对路径 -->
                                                // D:\学习\wzb_knowledge_base\demo\java\xuexi\08.IO\02.文件\01.File对象\..\..\..
    System.out.println(file.getCanonicalPath()); // 规范路径 --> D:\学习\wzb_knowledge_base\demo\java\xuexi
    System.out.println(file.getName()); // 获取文件名 --> ..
    System.out.println(file.getParent()); // 获取父路径 --> ..\..

    // 2. 判断文件 / 文件夹状态
    System.out.println(file.exists()); // 判断文件(或文件夹)是否存在 --> true
    System.out.println(file.isFile()); // 判断是否是普通文件 --> false
    System.out.println(file.isDirectory()); // 判断是否是文件夹 --> true
    System.out.println(file.isAbsolute()); // 判断是否是绝对路径 --> true
    System.out.println(file.canRead()); // 判断文件(或文件夹)是否可读 --> true
    System.out.println(file.canWrite()); // 判断文件(或文件夹)是否可写 --> true
    System.out.println(file.canExecute()); // 判断文件(或文件夹)是否可执行 --> true
    System.out.println(file.isHidden()); // 判断文件(或文件夹)是否隐藏 --> false

    // 3. 创建 & 删除
    // 创建文件, 返回 boolean --> 父目录不存在会抛IO异常
    // System.out.println(new File("./test.ts").createNewFile());
    // 创建文件夹, 返回 boolean --> 仅创建最后一级，上级不存在则失败
    // System.out.println(new File("./test").mkdir());
    // 创建多级文件夹, 返回 boolean --> 不存在的父目录全部自动创建
    // System.out.println(new File("./test/test2/test3").mkdirs());
    // 删除文件, 返回 boolean --> 文件夹非空时直接返回false，删不掉
    // System.out.println(new File("./test/test2/test3").delete());

    // 4. 文件信息
    System.out.println(file.length()); // 获取文件大小, 单位字节, 文件夹结果是不确定的 --> 0
    System.out.println(file.lastModified()); // 获取文件最后修改时间, 单位毫秒
    System.out.println(file.setLastModified(System.currentTimeMillis())); // 修改时间戳

    // 5. 获取文件夹列表信息
    String[] names = file.list(); // 获取文件夹下的所有文件(和文件夹)名
    System.out.println(List.of(names)); // [01.基础, 02.流程控制, 03.引用类型, ...]
    File[] files = file.listFiles(); // 获取文件夹下的所有文件(和文件夹)对象
    System.out.println(file.listFiles((dir, name) -> name.endsWith(".java"))); // 文件过滤

    // 6. 与 Path 互转
    System.out.println(file.toPath()); // File 转 Path
    System.out.println(file.toPath().toFile()); // Path 转 File
  }
}
