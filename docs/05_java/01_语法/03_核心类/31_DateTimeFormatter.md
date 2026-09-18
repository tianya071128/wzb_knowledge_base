# DateTimeFormatter：日期时间格式化器

`java.time.DateTimeFormatter` 用于格式化和解析日期时间。

## 特点

- **不可变**：线程安全
- **功能强大**：支持多种预定义格式和自定义模式
- **替代 SimpleDateFormat**：线程安全，无需担心并发问题

## 预定义格式化器

```java
LocalDateTime dt = LocalDateTime.of(2024, 1, 15, 14, 30, 45);

// ISO 标准格式
dt.format(DateTimeFormatter.ISO_LOCAL_DATE);       // "2024-01-15"
dt.format(DateTimeFormatter.ISO_LOCAL_TIME);       // "14:30:45"
dt.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);  // "2024-01-15T14:30:45"

// 带时区的 ISO 格式
ZonedDateTime zdt = dt.atZone(ZoneId.of("Asia/Shanghai"));
zdt.format(DateTimeFormatter.ISO_ZONED_DATE_TIME);
// "2024-01-15T14:30:45+08:00[Asia/Shanghai]"

// 其他预定义格式
dt.format(DateTimeFormatter.BASIC_ISO_DATE);       // "20240115"
dt.format(DateTimeFormatter.RFC_1123_DATE_TIME);   // "Mon, 15 Jan 2024 14:30:45 GMT"
```

## 自定义格式

```java
LocalDateTime dt = LocalDateTime.of(2024, 1, 15, 14, 30, 45);

// 创建自定义格式化器
DateTimeFormatter formatter1 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
DateTimeFormatter formatter2 = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
DateTimeFormatter formatter3 = DateTimeFormatter.ofPattern("yyyy年MM月dd日 HH时mm分ss秒");
DateTimeFormatter formatter4 = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss a");

dt.format(formatter1);  // "2024-01-15"
dt.format(formatter2);  // "2024/01/15 14:30:45"
dt.format(formatter3);  // "2024年01月15日 14时30分45秒"
dt.format(formatter4);  // "2024-01-15 14:30:45 下午"
```

## 常用模式字母

| 字母 | 含义             | 示例                                  |
| ---- | ---------------- | ------------------------------------- |
| `y`  | 年               | `yyyy` → 2024                         |
| `M`  | 月               | `MM` → 01, `MMM` → 1月, `MMMM` → 一月 |
| `d`  | 日               | `dd` → 15                             |
| `H`  | 小时（24小时制） | `HH` → 14                             |
| `h`  | 小时（12小时制） | `hh` → 02                             |
| `m`  | 分钟             | `mm` → 30                             |
| `s`  | 秒               | `ss` → 45                             |
| `S`  | 纳秒             | `SSS` → 毫秒                          |
| `a`  | AM/PM            | `a` → 下午                            |
| `E`  | 星期             | `E` → 周一, `EEEE` → 星期一           |
| `z`  | 时区名称         | `z` → CST                             |
| `Z`  | 时区偏移         | `Z` → +0800                           |
| `V`  | 时区 ID          | `VV` → Asia/Shanghai                  |

## 解析字符串

```java
// 解析日期
LocalDate date = LocalDate.parse("2024-01-15");
LocalDate date2 = LocalDate.parse("2024/01/15", DateTimeFormatter.ofPattern("yyyy/MM/dd"));

// 解析时间
LocalTime time = LocalTime.parse("14:30:45");
LocalTime time2 = LocalTime.parse("14时30分", DateTimeFormatter.ofPattern("HH时mm分"));

// 解析日期时间
LocalDateTime dt = LocalDateTime.parse("2024-01-15T14:30:45");
LocalDateTime dt2 = LocalDateTime.parse("2024-01-15 14:30:45",
    DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

// 解析带时区的日期时间
ZonedDateTime zdt = ZonedDateTime.parse("2024-01-15T14:30:45+08:00[Asia/Shanghai]");
```

## 本地化

```java
LocalDateTime dt = LocalDateTime.of(2024, 1, 15, 14, 30, 45);

// 使用不同语言环境
DateTimeFormatter chineseFormatter = DateTimeFormatter.ofPattern("yyyy年MM月dd日 EEEE", Locale.CHINESE);
DateTimeFormatter englishFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd EEEE", Locale.ENGLISH);
DateTimeFormatter frenchFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd EEEE", Locale.FRENCH);

dt.format(chineseFormatter);   // "2024年01月15日 星期一"
dt.format(englishFormatter);   // "2024-01-15 Monday"
dt.format(frenchFormatter);    // "2024-01-15 lundi"
```

---

## 参考

- [Java 官方文档 - DateTimeFormatter](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/format/DateTimeFormatter.html)
