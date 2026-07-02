import java.io.FileReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

public class Main {
  public static void main(String[] args) throws Exception {
    /**
     * StandardCharsets: 提供标准字符集常量，替代硬编码字符串 "UTF-8"、"GBK"；
     * - 无 GBK / GB2312 常量：这两个属于中文扩展编码，不在国际标准常量里，需要 Charset.forName("GBK") 获取。
     */
    Reader reader = new FileReader("../../02.文件/10.test/demo.txt", StandardCharsets.UTF_8);
  }
}
