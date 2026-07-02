import java.io.FileOutputStream;
import java.io.OutputStream;

public class Main {
  public static void main(String[] args) throws Exception {
    /**
     * OutputStream: 字节输出流抽象父类，所有写出二进制数据的流都继承它；
     * 
     * - 作用: 将内存字节写入磁盘、网络、内存数组、管道等目标；
     * 
     * - 实现类:
     * -- FileOutputStream: 文件字节输出流；
     * -- ByteArrayOutputStream: 字节数组输出流；
     * -- BufferedOutputStream: 缓冲字节输出流, 默认内置 8192 字节缓冲区。
     */

    /**
     * 创建字节输出流对象
     */
    OutputStream os = new FileOutputStream("../../02.文件/10.test/output.txt");
    OutputStream os2 = new FileOutputStream("../../02.文件/10.test/output.txt", true); // 可使用追加流模式

    /**
     * 写入: write
     * - void write(int b): 写入单个字节
     * 
     * - void write(byte[] b): 写入字节数组
     * 
     * - void write(byte[] b, int off, int len): 写入字节数组的指定部分
     */
    os.write('H');
    os.write('e');
    os.write('l');
    os.write('l');
    os.write('o');
    os.write(new byte[] { ' ', 'W', 'o', 'r', 'l', 'd' });

    /**
     * 缓冲区刷新: flush
     * - 带缓冲的流（BufferedOutputStream）会先把数据存在内存缓冲区，不立刻写入到目标
     * - flush() 强制把缓冲区剩余数据全部写入目标；
     * - close() 关闭流时，会自动调用 flush()
     */
    os.flush();

    /**
     * 关闭: close --> 一般使用 try-with-resources 自动调用，避免句柄泄漏。
     */
    os.close();
  }
}
