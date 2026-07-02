import java.io.FileWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;

public class Main {
  public static void main(String[] args) throws Exception {
    /**
     * Writer 是字符输出流抽象父类，操作单位 char，专门输出文本；
     * 底层依赖 OutputStream + 字符集编码，自动将字符转为字节；
     * 
     * 
     * 实现类:
     * - FileWriter: 输出文件, 继承 OutputStreamWriter，内部自动创建 FileOutputStream。
     * - BufferedWriter: 缓冲字符输出流, 默认内置 8192 字节缓冲区。
     */

    /**
     * 创建 Writer:
     * - 支持指定编码
     * - 支持追加模式
     */
    Writer writer = new FileWriter("../../../02.文件/10.test/output.txt", StandardCharsets.UTF_8, true);

    /**
     * 写入字符:
     * - void write(int c): 写入单个字符
     * - void write(char[] cbuf): 写入字符数组
     * - void write(String str): 写入字符串
     * - void write(String str, int off, int len): 写入字符串的指定部分
     */
    writer.write("你好😂哈!");

    /**
     * 链式追加: append
     */
    writer.append("Hello World!").append("\n");

    /**
     * 缓冲区刷新: flush
     * - 带缓冲的流（BufferedWriter）会先把数据存在内存缓冲区，不立刻写入目标
     */
    writer.flush();

    /**
     * 关闭: close --> 一般使用 try-with-resources 自动调用，避免句柄泄漏。
     */
    writer.close();
  }
}
