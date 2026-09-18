# LocalDateTime：本地日期时间

`java.time.LocalDateTime` 表示不带时区的日期时间，包含年、月、日、时、分、秒和纳秒。

## 特点

- **不可变**：线程安全
- **不包含时区**：只表示日期和时间
- **精度**：纳秒级

## 创建 LocalDateTime

```java
// 当前日期时间
LocalDateTime now = LocalDateTime.now();

// 指定日期时间
LocalDateTime dt1 = LocalDateTime.of(2024, 1, 15, 14, 30);           // 2024-01-15T14:30
LocalDateTime dt2 = LocalDateTime.of(2024, 1, 15, 14, 30, 45);       // 2024-01-15T14:30:45
LocalDateTime dt3 = LocalDateTime.of(2024, 1, 15, 14, 30, 45, 123);  // 2024-01-15T14:30:45.000000123

// 从日期和时间组合
LocalDate date = LocalDate.of(2024, 1, 15);
LocalTime time = LocalTime.of(14, 30);
LocalDateTime dt4 = LocalDateTime.of(date, time);  // 2024-01-15T14:30

// 从字符串解析
LocalDateTime dt5 = LocalDateTime.parse("2024-01-15T14:30:45");
LocalDateTime dt6 = LocalDateTime.parse("2024-01-15 14:30:45",
    DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

// 从时间戳创建（需要时区）
LocalDateTime dt7 = LocalDateTime.ofInstant(Instant.now(), ZoneId.of("Asia/Shanghai"));
```

## 常用操作

### 获取

```java
LocalDateTime dt = LocalDateTime.of(2024, 1, 15, 14, 30, 45);

// 日期部分
dt.getYear();         // 2024
dt.getMonth();        // JANUARY
dt.getMonthValue();   // 1
dt.getDayOfMonth();   // 15
dt.getDayOfWeek();    // MONDAY

// 时间部分
dt.getHour();         // 14
dt.getMinute();       // 30
dt.getSecond();       // 45
dt.getNano();         // 0

// 转为 LocalDate 和 LocalTime
dt.toLocalDate();     // 2024-01-15
dt.toLocalTime();     // 14:30:45
```

### 修改

```java
LocalDateTime dt = LocalDateTime.of(2024, 1, 15, 14, 30);

// 设置日期
dt.withYear(2025);           // 2025-01-15T14:30
dt.withMonth(6);             // 2024-06-15T14:30
dt.withDayOfMonth(20);       // 2024-01-20T14:30

// 设置时间
dt.withHour(10);             // 2024-01-15T10:30
dt.withMinute(0);            // 2024-01-15T14:00
dt.withSecond(30);           // 2024-01-15T14:30:30

// 加减
dt.plusYears(1);             // 2025-01-15T14:30
dt.plusMonths(2);            // 2024-03-15T14:30
dt.plusDays(10);             // 2024-01-25T14:30
dt.plusHours(2);             // 2024-01-15T16:30
dt.plusMinutes(30);          // 2024-01-15T15:00
```

### 比较

```java
LocalDateTime dt1 = LocalDateTime.of(2024, 1, 15, 14, 30);
LocalDateTime dt2 = LocalDateTime.of(2024, 6, 20, 10, 0);

dt1.isBefore(dt2);   // true
dt1.isAfter(dt2);    // false
dt1.equals(dt2);     // false
```

### 格式化

```java
LocalDateTime dt = LocalDateTime.of(2024, 1, 15, 14, 30, 45);

dt.toString();                    // "2024-01-15T14:30:45"
dt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));  // "2024-01-15 14:30:45"
dt.format(DateTimeFormatter.ofPattern("yyyy年MM月dd日 HH时mm分"));  // "2024年01月15日 14时30分"
```

### 转换成其他类型

```java
LocalDateTime dt = LocalDateTime.of(2024, 1, 15, 14, 30, 45);

// 转为 LocalDate（只保留日期）
LocalDate date = dt.toLocalDate();           // 2024-01-15

// 转为 LocalTime（只保留时间）
LocalTime time = dt.toLocalTime();           // 14:30:45

// 转为 ZonedDateTime（指定时区）
ZonedDateTime zdt = dt.atZone(ZoneId.of("Asia/Shanghai"));
// 2024-01-15T14:30:45+08:00[Asia/Shanghai]

// 转为 Instant（指定时区偏移）
Instant instant = dt.toInstant(ZoneOffset.ofHours(8));
// 2024-01-15T06:30:45Z

// 转为 OffsetDateTime（指定时区偏移）
OffsetDateTime odt = dt.atOffset(ZoneOffset.ofHours(8));
// 2024-01-15T14:30:45+08:00

// 转为时间戳（毫秒，需要时区偏移）
long timestamp = dt.toInstant(ZoneOffset.ofHours(8)).toEpochMilli();
// 1705305045000

// 转为 Date（Java 8 之前的旧 API，需要时区）
Date legacyDate = Date.from(dt.toInstant(ZoneOffset.ofHours(8)));
```

### 与时区结合

```java
LocalDateTime dt = LocalDateTime.of(2024, 1, 15, 14, 30);

// 转为带时区的日期时间
ZonedDateTime zdt = dt.atZone(ZoneId.of("Asia/Shanghai"));
// 2024-01-15T14:30+08:00[Asia/Shanghai]

// 转为 Instant（需要时区）
Instant instant = dt.toInstant(ZoneOffset.ofHours(8));
```

---

## 参考

- [Java 官方文档 - LocalDateTime](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/LocalDateTime.html)
