import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class Main {
  public static void main(String[] args) throws Exception {
    /**
     * try-with-resources 语法: 自动实现资源关闭，不用手动写
     * finally + close()，杜绝忘记关闭流、文件句柄、连接导致的资源泄漏。
     * 
     * 前提条件: 资源类必须实现 AutoCloseable 接口 --> 一般的 IO 流、Files 流、Socket 等内置实现的
     * 
     * 原理: 编译时会自动生成 try-with-resources 的 finally 块，finally 块中会自动调用 close() 方法。
     */

    // 多个资源：关闭顺序：bw.close() → br.close()
    try (
        BufferedReader br = Files.newBufferedReader(Paths.get("a.txt"));
        BufferedWriter bw = Files.newBufferedWriter(Paths.get("b.txt"))) {
      String text = br.readLine();
      bw.write(text);
    } catch (IOException e) {
      e.printStackTrace();
    }

    // 引用外部变量
    BufferedReader br = Files.newBufferedReader(Paths.get("a.txt"));
    try (br) {
      br.readLine();
    } catch (IOException e) {
    }

  }
}
