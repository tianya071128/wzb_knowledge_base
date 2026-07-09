import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

public class Main {
  public static void main(String[] args) {
    /**
     * ZonedDateTime: 带完整时区的日期时间，自带完整时区数据库规则，自动处理夏令时 DST
     */

    /**
     * 创建:
     * - ZonedDateTime.now() 服务器默认时区（Asia/Shanghai）
     * - ZonedDateTime.now(ZoneId) 指定时区获取当前时刻
     * - ZonedDateTime.of(年,月,日,时,分,秒,纳秒,时区) 指定完整时间 + 时区
     * - ZonedDateTime.of(LocalDateTime, ZoneId) LocalDateTime + ZoneId 拼接
     * - ZonedDateTime.of(LocalDate,LocalTime, ZoneId) LocalDate + LocalTime +
     * ZoneId
     * - ZonedDateTime.parse("2026-07-01T16:00:00+08:00[Asia/Shanghai]") 解析带时区的字符串
     */
    ZonedDateTime zdt1 = ZonedDateTime.now(); // 默认时区
    ZonedDateTime zdt2 = ZonedDateTime.now(ZoneId.of("America/New_York")); // 指定时区
    ZonedDateTime zdt3 = ZonedDateTime.of(2020, 1, 1, 0, 0, 0, 0, ZoneId.of("Asia/Shanghai")); // 完整时间 + 时区
    ZonedDateTime zdt4 = ZonedDateTime.of(LocalDateTime.of(2020, 1, 1, 0, 0), ZoneId.of("Asia/Shanghai"));
    ZonedDateTime zdt5 = ZonedDateTime.of(LocalDate.of(2020, 1, 1), LocalTime.of(0, 0), ZoneId.of("Asia/Shanghai"));

    /**
     * 时间加减
     */
    System.out.println(zdt1.plusDays(1)); // 加天
    System.out.println(zdt1.plusWeeks(1)); // 加周
    System.out.println(zdt1.plusMonths(1)); // 加月
    System.out.println(zdt1.plusYears(1)); // 加年
    System.out.println(zdt1.plusHours(1)); // 加小时
    System.out.println(zdt1.plusMinutes(1)); // 加分钟
    System.out.println(zdt1.plusSeconds(1)); // 加秒
    System.out.println(zdt1.plusNanos(1)); // 加纳秒
    System.out.println(zdt1.minusDays(1)); // 减天
    System.out.println(zdt1.minusWeeks(1)); // 减周
    System.out.println(zdt1.minusMonths(1)); // 减月
    System.out.println(zdt1.minusYears(1)); // 减年
    System.out.println(zdt1.minusHours(1)); // 减小时
    System.out.println(zdt1.minusMinutes(1)); // 减分钟
    System.out.println(zdt1.minusSeconds(1)); // 减秒
    System.out.println(zdt1.minusNanos(1)); // 减纳秒

    /**
     * 修改: 前缀 with
     */
    System.out.println(zdt1.withYear(2020)); // 修改年
    System.out.println(zdt1.withMonth(1)); // 修改月
    System.out.println(zdt1.withDayOfMonth(1)); // 修改月的日
    System.out.println(zdt1.withDayOfYear(1)); // 修改年的第几天
    System.out.println(zdt1.withHour(0)); // 修改时
    System.out.println(zdt1.withMinute(0)); // 修改分
    System.out.println(zdt1.withSecond(0)); // 修改秒
    System.out.println(zdt1.withNano(0)); // 修改纳秒
    System.out.println(zdt1.withZoneSameInstant(ZoneId.of("America/New_York"))); // 修改时区, 绝对时刻不变
    System.out.println(zdt1.withZoneSameLocal(ZoneId.of("America/New_York"))); // 修改时区, 直接换时区, UTC 会偏移

    /**
     * 比较
     */
    System.out.println(zdt1.isAfter(zdt2)); // 是否晚于
    System.out.println(zdt1.isBefore(zdt2)); // 是否早于
    System.out.println(zdt1.isEqual(zdt2)); // 是否等于

    /**
     * 转换
     */
    LocalDate date = zdt1.toLocalDate(); // 本地日期
    LocalTime time = zdt1.toLocalTime(); // 本地时间
    LocalDateTime dateTime = zdt1.toLocalDateTime(); // 本地日期时间
    Instant instant = zdt1.toInstant(); // 转UTC绝对时间
    ZoneId zone = zdt1.getZone(); // 时区
    ZoneOffset offset = zdt1.getOffset(); // 当前UTC偏移（夏令时自动变化）

  }
}
