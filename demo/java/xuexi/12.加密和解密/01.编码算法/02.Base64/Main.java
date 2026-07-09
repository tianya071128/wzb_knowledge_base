import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class Main {
  public static void main(String[] args) throws Exception {
    /**
     * Base64 编码: 是编码算法, 而不是加密算法
     * 
     * Base64 是二进制转 ASCII 文本编码算法, 用于在只允许打印 ASCII 字符的文本通道传输二进制
     * 
     * 编码后体积膨胀：原 3 字节 → 4 字节，约增大 1/3；
     * 
     * = 是末尾填充符，补齐长度。
     */

    /**
     * 编码器: 首先需要获取对应的编码器
     * 
     * - Base64.getEncoder(): 标准编码器
     * 
     * - Base64.getUrlEncoder(): 针对 URL 传输的编码器
     * -- 标准的Base64编码会出现+、/和=，所以不适合把Base64编码后的字符串放到URL中。
     * -- 该编码器仅仅是把编码后 + 变成 - ，/ 变成 _：
     */
    Base64.Encoder encoder = Base64.getEncoder();
    Base64.Encoder encoder2 = Base64.getUrlEncoder();

    /**
     * 编码: 使用编码器进行编码
     */
    String raw = "测试中文123!/@#";
    byte[] bytes = raw.getBytes(StandardCharsets.UTF_8);
    String str = encoder.encodeToString(bytes);
    String str2 = encoder2.encodeToString(bytes);
    System.out.println(str); // 5rWL6K+V5Lit5paHMTIzIS9AIw==
    System.out.println(str2); // 5rWL6K-V5Lit5paHMTIzIS9AIw==

    /**
     * 解码器: 与编码器一一对应
     */
    Base64.Decoder decoder = Base64.getDecoder();
    Base64.Decoder decoder2 = Base64.getUrlDecoder();

    /**
     * 解码: 使用解码器进行解码
     */
    byte[] bytes2 = decoder.decode(str);
    byte[] bytes3 = decoder2.decode(str2);
  }
}
