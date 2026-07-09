import java.net.URLDecoder;
import java.net.URLEncoder;

public class Main {
  public static void main(String[] args) throws Exception {
    /**
     * URL 编码: 是编码算法, 而不是加密算法
     * 
     * URL 只能传输 ASCII 字母、数字、少量符号，中文、空格、/ : ? & = # + 等特殊字符会破坏地址结构，必须转成 %XX 十六进制格式。
     */

    /**
     * 编码: URLEncoder.encode
     * 
     * 指定编码的字符集
     */
    System.out.println(URLEncoder.encode("中文", "UTF-8"));

    /**
     * 解码: URLDecoder.decode
     * 
     * 默认编码: UTF-8
     */
    System.out.println(URLDecoder.decode(URLEncoder.encode("中文", "UTF-8"), "UTF-8"));
  }
}
