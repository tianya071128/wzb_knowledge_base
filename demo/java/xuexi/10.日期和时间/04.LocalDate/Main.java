import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class Main {
  public static void main(String[] args) {
    /**
     * LocalDate 只表示日期，不包含时间和时区。
     * - 适合表示生日、纪念日、截止日期等。
     */

    /**
     * 创建:
     * - LocalDate.now() 获取当前日期
     * - LocalDate.of(...) 指定日期创建
     * - LocalDate.parse(...) 解析字符串创建
     * - LocalDate.parse(str, DateTimeFormatter) 按指定格式解析
     */
    LocalDate date1 = LocalDate.now();
    LocalDate date2 = LocalDate.of(2020, 1, 1);
    LocalDate date3 = LocalDate.parse("2026-07-01");
    LocalDate date4 = LocalDate.parse("2026/07/01", DateTimeFormatter.ofPattern("yyyy/MM/dd"));

    /**
     * 读取日期信息
     */
    System.out.println(date1.getYear()); // 获取年
    System.out.println(date1.getMonth()); // 获取月枚举
    System.out.println(date1.getMonthValue()); // 获取月 1-12
    System.out.println(date1.getDayOfMonth()); // 当月几号
    System.out.println(date1.getDayOfYear()); // 当年的第几天
    System.out.println(date1.getDayOfWeek()); // 获取星期枚举
    System.out.println(date1.lengthOfMonth()); // 获取当月天数
    System.out.println(date1.lengthOfYear()); // 获取当前年天数
    System.out.println(date1.isLeapYear()); // 是否闰年

    /**
     * 日期增减：不可变对象，返回新对象
     */
    System.out.println(date1.plusDays(1)); // 加天
    System.out.println(date1.plusWeeks(1)); // 加周
    System.out.println(date1.plusMonths(1)); // 加月
    System.out.println(date1.plusYears(1)); // 加年
    System.out.println(date1.minusDays(1)); // 减天
    System.out.println(date1.minusWeeks(1)); // 减周
    System.out.println(date1.minusMonths(1)); // 减月
    System.out.println(date1.minusYears(1)); // 减年

    /**
     * 修改指定字段：with 前缀方法
     */
    System.out.println(date1.withYear(2020)); // 修改年
    System.out.println(date1.withMonth(1)); // 修改月, 1~12
    System.out.println(date1.withDayOfMonth(1)); // 修改日
    System.out.println(date1.withDayOfYear(1)); // 修改年的第几天

    /**
     * 比较大小
     */
    System.out.println(date1.isAfter(date2)); // 是否晚于
    System.out.println(date1.isBefore(date2)); // 是否早于
    System.out.println(date1.isEqual(date2)); // 是否等于

    /**
     * 转换
     */
    // 转为 LocalDateTime, 以当天0点
    LocalDateTime startOfDay = date1.atStartOfDay();
    // 转为 LocalDateTime, 以指定时间
    LocalDateTime specificTime = date1.atTime(10, 30, 0);
    // 转为 ZonedDateTime, 以指定时区
    ZonedDateTime zdt = date1.atStartOfDay(ZoneId.of("Asia/Shanghai"));
    // 转为 Instant: 先转为 ZonedDateTime 再转为 Instant
    Instant instant = zdt.toInstant();
    // 时间戳: LocalDateTime -> ZonedDateTime -> Instant -> 时间戳
    long timestamp = zdt.toInstant().toEpochMilli();

    /**
     * 格式化：使用 DateTimeFormatter
     */
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    System.out.println(date1.format(formatter));
    System.out.println(date1.toString());
  }
}
