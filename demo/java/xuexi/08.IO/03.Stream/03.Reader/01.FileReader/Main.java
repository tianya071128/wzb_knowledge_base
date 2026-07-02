import java.io.FileReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

public class Main {
  public static void main(String[] args) throws Exception {
    /**
     * Reader 是字符输入流抽象父类，专门读取文本字符（char），解决 InputStream 字节流编码转换繁琐问题；
     * 底层本质：包装 InputStream + 指定字符集，自动完成 字节 → char 解码；
     * 
     * 实现类:
     * - FileReader: 读取文件, 继承 InputStreamReader，内部自动创建 FileInputStream。
     * - CharArrayReader: 读取内存中的字符数组
     * - InputStreamReader: 桥接转换流
     * - BufferedReader: 缓冲字符输入流，装饰器模式，包装任意 Reader，增加字符缓冲区。
     */

    /**
     * 创建 FileReader, 默认编码跟随系统不同
     * - 可指定编码
     */
    Reader reader = new FileReader("../../../02.文件/10.test/demo.txt", StandardCharsets.UTF_8);

    /**
     * 读取字符:
     * 
     * - int read(): 读取一个字符，返回 int，-1 表示已读完
     * 
     * - int read(char[] cbuf): 批量读取，返回实际读取的字符数
     * 
     * - int read(char[] cbuf, int off, int len): 批量读取，指定读取范围
     */
    int c;
    while ((c = reader.read()) != -1) {
      System.out.print((char) c);
    }

    /**
     * ready: 判断流是否可以读取
     */
    System.out.println(reader.ready());

    /**
     * close: 资源关闭 --> 一般使用 try-with-resources 自动调用，避免句柄泄漏。
     */
    reader.close();
  }
}
