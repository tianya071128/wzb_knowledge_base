import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {
  public static void main(String[] args) throws Exception {
    /**
     * InputStream: 是字节输入流抽象父类,所有读取字节的流都继承它；
     * - 作用: 从文件、网络、内存、管道等数据源读取二进制字节；
     * - 实现类:
     * -- FileInputStream: 从文件读取字节；
     * -- ByteArrayInputStream: 从字节数组中读取字节(无 IO，无需关闭)
     * -- BufferedInputStream: 缓冲字节输入流，继承 FileInputStream，提供缓冲功能；
     */

    /**
     * 创建输入流
     */
    InputStream inputStream = new FileInputStream("../../02.文件/10.test/demo.txt");

    /**
     * 读取字节: read
     * - int read(): 读取一个字节并返回，返回 -1 表示已读完
     * 
     * - int read(byte[] b): 批量读取字节填满数组, 末尾返回 -1
     * -- 返回实际读取字节数
     * -- 不会保证数组填满，剩余位置保留旧脏数据
     * 
     * - int read(byte[] b, int off, int len): 精准控制读取范围
     * -- off：数组起始写入下标
     * -- len：最多读取字节数
     */
    String str = "";
    byte[] chars = new byte[8];
    int len = 0;
    while ((len = inputStream.read(chars)) != -1) {
      str += new String(chars, 0, len);
    }
    System.out.println(str);

    /**
     * 批量流转输出流: transferTo
     * 把当前 InputStream 全部剩余字节直接写入 OutputStream，内置缓冲，无需手动循环读写
     */
    try (
        InputStream in = Files.newInputStream(Path.of(
            "../../02.文件/10.test/demo.txt"));
        OutputStream out = Files.newOutputStream(Path.of("../../02.文件/10.test/output.txt"))) {
      long copySize = in.transferTo(out);
      System.out.println("复制字节数：" + copySize);
    }

    /**
     * 释放资源: close --> 一般使用 try-with-resources 自动调用，避免句柄泄漏。
     */
    inputStream.close();
  }
}
