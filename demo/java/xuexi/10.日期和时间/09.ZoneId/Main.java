import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

public class Main {
  public static void main(String[] args) {
    /**
     * ZoneId 表示时区 ID，例如 Asia/Shanghai、America/New_York。
     * - ZoneId 是时区数据库 ID，不包含偏移量变化历史。
     * - ZoneOffset 表示固定 UTC 偏移，例如 +08:00、-05:00。
     */

    // 获取服务器默认时区和指定时区
    ZoneId defaultZone = ZoneId.systemDefault(); // 默认时区
    System.out.println(defaultZone);

    ZoneId shanghai = ZoneId.of("Asia/Shanghai"); // 指定上海时区
    ZoneId newYork = ZoneId.of("America/New_York"); // 指定纽约时区
    System.out.println(shanghai);
    System.out.println(newYork);

    // 使用时区: 将本地时间绑定到时区
    LocalDateTime localDateTime = LocalDateTime.of(2026, 7, 2, 14, 30);
    ZonedDateTime zdtShanghai = localDateTime.atZone(shanghai);
    ZonedDateTime zdtNewYork = localDateTime.atZone(newYork);
    System.out.println(zdtShanghai);
    System.out.println(zdtNewYork);

    // 使用 ZoneId 生成 LocalDateTime
    LocalDate localDate = LocalDate.now();
    LocalTime localTime = LocalTime.of(9, 0);
    ZonedDateTime startOfDayInShanghai = ZonedDateTime.of(localDate, localTime, shanghai);
    System.out.println(startOfDayInShanghai);
  }
}
