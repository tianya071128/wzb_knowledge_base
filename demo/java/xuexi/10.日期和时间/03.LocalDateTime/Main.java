import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class Main {
  public static void main(String[] args) {
    /**
     * LocalDateTime = LocalDate + LocalTime
     * - 不带时区、不带偏移量，只代表本地日历视图
     */

    /**
     * 创建:
     * - LocalDateTime.now() 获取当前时间
     * - LocalDateTime.of(...) 指定时间创建, 月份从 1 开始
     * - LocalDateTime.parse(...) 解析字符串创建
     * - LocalDateTime.parse(str, DateTimeFormatter) 根据指定日期时间格式解析字符串创建
     */
    LocalDateTime date1 = LocalDateTime.now(); // 本地时间
    LocalDateTime date2 = LocalDateTime.of(2020, 1, 1, 0, 0, 0); // 指定时间创建: 月份 1~12
    LocalDateTime date3 = LocalDateTime.parse("2026-07-01 06:20:20",
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

    /**
     * 读取日期时间
     */
    System.out.println(date1.getYear()); // 获取年
    System.out.println(date1.getMonth()); // 获取月枚举
    System.out.println(date1.getMonthValue()); // 获取月
    System.out.println(date1.getDayOfMonth()); // 当月几号
    System.out.println(date1.getDayOfYear()); // 当年的第几天
    System.out.println(date1.getDayOfWeek()); // 获取星期枚举
    System.out.println(date1.getHour()); // 获取小时, 24 小时制
    System.out.println(date1.getMinute()); // 获取分钟
    System.out.println(date1.getSecond()); // 获取秒
    System.out.println(date1.getNano()); // 获取纳秒

    /**
     * 时间增减: 不可变对象, 返回新对象
     */
    System.out.println(date1.plusYears(1)); // 加年
    System.out.println(date1.plusMonths(1)); // 加月
    System.out.println(date1.plusDays(1)); // 加日
    System.out.println(date1.plusHours(1)); // 加时
    System.out.println(date1.plusMinutes(1)); // 加分
    System.out.println(date1.plusSeconds(1)); // 加秒
    System.out.println(date1.plusNanos(1)); // 加纳秒
    System.out.println(date1.minusYears(1)); // 减年
    System.out.println(date1.minusMonths(1)); // 减月
    System.out.println(date1.minusDays(1)); // 减日
    System.out.println(date1.minusHours(1)); // 减时
    System.out.println(date1.minusMinutes(1)); // 减分
    System.out.println(date1.minusSeconds(1)); // 减秒
    System.out.println(date1.minusNanos(1)); // 减纳秒

    /**
     * 修改指定字段: with 前缀方法
     */
    System.out.println(date1.withYear(2020)); // 修改年
    System.out.println(date1.withMonth(1)); // 修改月, 1~12
    System.out.println(date1.withDayOfMonth(1)); // 修改日
    System.out.println(date1.withDayOfYear(1)); // 修改年的第几天
    System.out.println(date1.withHour(0)); // 修改时
    System.out.println(date1.withMinute(0)); // 修改分
    System.out.println(date1.withSecond(0)); // 修改秒
    System.out.println(date1.withNano(0)); // 修改纳秒

    /**
     * 比较大小
     */
    System.out.println(date1.isAfter(date2)); // 是否晚于
    System.out.println(date1.isBefore(date2)); // 是否早于
    System.out.println(date1.isEqual(date2)); // 是否等于

    /**
     * 转换
     */
    // 转 LocalDate
    LocalDate date = date1.toLocalDate();
    // 转 LocalTime
    LocalTime time = date1.toLocalTime();
    // 转 ZonedDateTime（必须绑定时区）
    ZonedDateTime zdt = date1.atZone(ZoneId.of("Asia/Shanghai"));
    // 转 Instant: LocalDateTime -> ZonedDateTime -> Instant
    Instant instant = date1.atZone(ZoneId.of("Asia/Shanghai")).toInstant();
    // 时间戳: LocalDateTime -> ZonedDateTime -> Instant -> 时间戳
    long timestamp = date1.atZone(ZoneId.of("Asia/Shanghai")).toInstant().toEpochMilli();

    /**
     * 格式化: 使用 DateTimeFormatter
     */
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    System.out.println(date1.format(formatter)); // 格式化
  }
}
