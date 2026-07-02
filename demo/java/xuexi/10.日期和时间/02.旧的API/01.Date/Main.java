import java.time.Instant;
import java.util.Date;

public class Main {
  public static void main(String[] args) {
    /**
     * Date: JDK1.0 古老日期时间类, 内部只存一个 long 毫秒值, 不推荐使用
     */

    /**
     * 构造:
     * - Date(): 当前系统时间
     * - Date(long millis): 毫秒值
     * - 其余方式已被废弃
     */
    Date date = new Date();
    Date date2 = new Date(System.currentTimeMillis()); // 根据时间戳创建

    /**
     * 获取/设置时间戳
     */
    System.out.println(date.getTime()); // 获取时间戳
    date.setTime(System.currentTimeMillis()); // 设置时间戳

    /**
     * 转换其他类型
     */
    Instant instant = date.toInstant(); // 转换成 Instant
    String str = date.toString(); // 转换成字符串

    /**
     * 其他方法大都被废弃
     */
  }
}
