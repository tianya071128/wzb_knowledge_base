import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class Main {
  public static void main(String[] args) {
    /**
     * LocalTime 只表示时间，不包含日期和时区。
     * - 适合表示时间点，如上班时间、闹钟时间等。
     */

    /**
     * 创建:
     * - LocalTime.now() 获取当前时间
     * - LocalTime.of(...) 指定时间创建
     * - LocalTime.parse(...) 解析字符串创建
     * - LocalTime.parse(str, DateTimeFormatter) 按指定格式解析
     */
    LocalTime time1 = LocalTime.now();
    LocalTime time2 = LocalTime.of(12, 30, 45);
    LocalTime time3 = LocalTime.parse("23:59:59");
    LocalTime time4 = LocalTime.parse("23:59", DateTimeFormatter.ofPattern("HH:mm"));

    /**
     * 读取时间信息
     */
    System.out.println(time1.getHour()); // 时
    System.out.println(time1.getMinute()); // 分
    System.out.println(time1.getSecond()); // 秒
    System.out.println(time1.getNano()); // 纳秒

    /**
     * 时间增减：不可变对象，返回新对象
     */
    System.out.println(time1.plusHours(1)); // 加时
    System.out.println(time1.plusMinutes(1)); // 加分
    System.out.println(time1.plusSeconds(1)); // 加秒
    System.out.println(time1.plusNanos(1)); // 加纳秒
    System.out.println(time1.minusHours(1)); // 减时
    System.out.println(time1.minusMinutes(1)); // 减分
    System.out.println(time1.minusSeconds(1)); // 减秒
    System.out.println(time1.minusNanos(1)); // 减纳秒

    /**
     * 修改指定字段：with 前缀方法
     */
    System.out.println(time1.withHour(0)); // 修改时
    System.out.println(time1.withMinute(0)); // 修改分
    System.out.println(time1.withSecond(0)); // 修改秒
    System.out.println(time1.withNano(0)); // 修改纳秒

    /**
     * 比较大小
     */
    System.out.println(time1.isAfter(time2)); // 是否晚于
    System.out.println(time1.isBefore(time2)); // 是否早于
    System.out.println(time1.equals(time2)); // 是否等于

    /**
     * 转换: 因为没有日期, 所以必须拼接其他日期才能转换成 LocalDateTime
     */
    LocalDateTime dateTime = LocalDateTime.of(LocalDate.now(), time1);

    /**
     * 格式化
     */
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss"); // 自定义格式
    System.out.println(time1.format(formatter)); // 格式化
    System.out.println(time1.toString());
  }
}
