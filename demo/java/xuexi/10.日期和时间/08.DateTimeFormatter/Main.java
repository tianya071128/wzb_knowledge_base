import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;
import java.util.Locale;

public class Main {
  public static void main(String[] args) {
    /**
     * DateTimeFormatter 用于格式化和解析日期 / 时间。
     */

    /**
     * 内置格式化器: 静态成员
     */
    System.out.println(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)); // ISO 本地日期时间
    System.out.println(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE)); // ISO 本地日期
    System.out.println(LocalTime.now().format(DateTimeFormatter.ISO_LOCAL_TIME)); // ISO 本地时间
    System.out.println(ZonedDateTime.now().format(DateTimeFormatter.ISO_ZONED_DATE_TIME)); // ISO 带时区的日期时间

    /**
     * 自定义模板: 使用 ofPattern 创建
     * 
     * - yyyy 4位年
     * - MM 两位月份
     * - dd 两位日期
     * - HH 24小时制
     * - hh 12 小时制
     * - mm 分钟
     * - ss 秒
     */
    System.out.println(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

    /**
     * 格式化: format
     */
    System.out.println(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").format(LocalDateTime.now()));
  }
}
