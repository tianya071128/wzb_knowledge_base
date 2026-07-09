import java.time.Instant;
import java.time.ZoneId;

public class Main {
  public static void main(String[] args) {
    /**
     * Instant: 代表从 1970-01-01 00:00:00 UTC 开始的一个绝对时间点，不带时区、不带本地年月日概念，全球唯一。
     */

    /**
     * 创建:
     * - Instant.now(): 获取当前 UTC 时刻
     * - Instant.ofEpochMilli(long): 通过毫秒数创建
     * - Instant.ofEpochSecond(long): 通过秒数创建
     * - Instant.ofEpochSecond(long, long): 通过秒数创建
     * - Instant.parse(str): 解析标准 UTC 字符串（带 Z）
     */
    Instant instant1 = Instant.now();
    Instant instant2 = Instant.ofEpochMilli(1630000000000L);
    Instant instant3 = Instant.ofEpochSecond(1630000000L);
    Instant instant4 = Instant.ofEpochSecond(1630000000L, 100);
    Instant instant5 = Instant.parse("2021-09-08T08:00:00Z"); // 带 Z 的字符串

    /**
     * 加减时间
     */
    System.out.println(instant1.plusSeconds(1)); // 加秒
    System.out.println(instant1.plusMillis(1000)); // 加毫秒
    System.out.println(instant1.plusNanos(1000000)); // 加纳秒
    System.out.println(instant1.minusSeconds(1)); // 减秒
    System.out.println(instant1.minusMillis(1000)); // 减毫秒
    System.out.println(instant1.minusNanos(1000000)); // 减纳秒

    /**
     * 获取属性
     */
    System.out.println(instant1.getEpochSecond()); // 获取秒数
    System.out.println(instant1.getNano()); // 获取纳秒数
    System.out.println(instant1.toEpochMilli()); // 转13位毫秒时间戳

    /**
     * 比较
     */
    System.out.println(instant1.isAfter(instant2)); // 是否在 instant2 之后
    System.out.println(instant1.isBefore(instant2)); // 是否在 instant2 之前
    System.out.println(instant1.equals(instant1)); // 是否等于 instant2

    /**
     * 转换
     */
    System.out.println(instant1.atZone(ZoneId.of("Asia/Shanghai"))); // 转换成ZonedDateTime
  }
}
