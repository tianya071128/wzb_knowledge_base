import java.security.MessageDigest;
import java.util.HexFormat;

public class Main {
  public static void main(String[] args) throws Exception {
    /**
     * 哈希算法: 又称摘要算法, 对任意一组输入数据进行计算，得到一个固定长度的输出摘要。
     * 
     * 算法 ........ 输出长度（位） ..... 输出长度（字节）
     * MD5 ......... 128 bits ........... 16 bytes
     * SHA-1 ....... 160 bits ........... 20 bytes
     * RipeMD-160 .. 160 bits ........... 20 bytes
     * SHA-256 ..... 256 bits ........... 32 bytes
     * SHA-512 ..... 512 bits ........... 64 bytes
     * 
     * 
     * 加盐: 额外添加随机数, 防止彩虹表攻击
     * 
     * MessageDigest: 获取哈希算法实例
     */

    /**
     * 1. 获取哈希算法实例, 根据不同哈希算法名获取对应实例
     */
    MessageDigest md = MessageDigest.getInstance("SHA-256");

    /**
     * 2. 追加加密二进制数据
     */
    md.update("hello".getBytes());
    md.update("World".getBytes());

    /**
     * 3. 生成摘要
     */
    byte[] digest = md.digest("end".getBytes()); // 还可在生成摘要时同时写入数据
    System.out.println(HexFormat.of().formatHex(digest));
  }
}
