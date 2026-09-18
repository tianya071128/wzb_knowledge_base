# ZonedDateTime：带时区的日期时间

`java.time.ZonedDateTime` 表示带时区的日期时间。

## 特点

- **不可变**：线程安全
- **包含时区**：可以处理时区转换
- **处理夏令时**：自动处理夏令时变化

## 创建 ZonedDateTime

```java
// 当前时间（系统默认时区）
ZonedDateTime now = ZonedDateTime.now();

// 指定时区
ZonedDateTime zdt1 = ZonedDateTime.now(ZoneId.of("America/New_York"));
ZonedDateTime zdt2 = ZonedDateTime.now(ZoneId.of("Asia/Tokyo"));

// 从 LocalDateTime 和时区创建
LocalDateTime dt = LocalDateTime.of(2024, 1, 15, 14, 30);
ZonedDateTime zdt3 = dt.atZone(ZoneId.of("Asia/Shanghai"));
// 2024-01-15T14:30+08:00[Asia/Shanghai]

// 指定完整信息
ZonedDateTime zdt4 = ZonedDateTime.of(2024, 1, 15, 14, 30, 45, 0, ZoneId.of("Asia/Shanghai"));

// 从 Instant 创建
ZonedDateTime zdt5 = Instant.now().atZone(ZoneId.of("Asia/Shanghai"));

// 从字符串解析
ZonedDateTime zdt6 = ZonedDateTime.parse("2024-01-15T14:30:45+08:00[Asia/Shanghai]");
```

## 常用操作

### 获取

```java
ZonedDateTime zdt = ZonedDateTime.of(2024, 1, 15, 14, 30, 45, 0, ZoneId.of("Asia/Shanghai"));

// 日期时间部分
zdt.getYear();         // 2024
zdt.getMonth();        // JANUARY
zdt.getDayOfMonth();   // 15
zdt.getHour();         // 14
zdt.getMinute();       // 30

// 时区信息
zdt.getZone();         // Asia/Shanghai
zdt.getOffset();       // +08:00

// 转为其他类型
zdt.toLocalDate();     // 2024-01-15
zdt.toLocalTime();     // 14:30:45
zdt.toLocalDateTime(); // 2024-01-15T14:30:45
zdt.toInstant();       // 2024-01-15T06:30:45Z
```

### 时区转换

```java
ZonedDateTime shanghai = ZonedDateTime.of(2024, 1, 15, 14, 30, 0, 0, ZoneId.of("Asia/Shanghai"));

// 转换为纽约时间
ZonedDateTime newYork = shanghai.withZoneSameInstant(ZoneId.of("America/New_York"));
// 2024-01-15T01:30-05:00[America/New_York]

// 转换为东京时间
ZonedDateTime tokyo = shanghai.withZoneSameInstant(ZoneId.of("Asia/Tokyo"));
// 2024-01-15T15:30+09:00[Asia/Tokyo]

// 保持本地时间，改变时区
ZonedDateTime sameLocal = shanghai.withZoneSameLocal(ZoneId.of("America/New_York"));
// 2024-01-15T14:30-05:00[America/New_York]
```

### 修改

```java
ZonedDateTime zdt = ZonedDateTime.of(2024, 1, 15, 14, 30, 0, 0, ZoneId.of("Asia/Shanghai"));

zdt.withYear(2025);           // 2025-01-15T14:30+08:00
zdt.withHour(10);             // 2024-01-15T10:30+08:00
zdt.plusDays(10);             // 2024-01-25T14:30+08:00
zdt.plusHours(2);             // 2024-01-15T16:30+08:00
```

### 格式化

```java
ZonedDateTime zdt = ZonedDateTime.of(2024, 1, 15, 14, 30, 45, 0, ZoneId.of("Asia/Shanghai"));

zdt.toString();  // "2024-01-15T14:30:45+08:00[Asia/Shanghai]"

zdt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z"));
// "2024-01-15 14:30:45 CST"

zdt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss VV"));
// "2024-01-15 14:30:45 Asia/Shanghai"
```

### 转换成其他类型

```java
ZonedDateTime zdt = ZonedDateTime.of(2024, 1, 15, 14, 30, 45, 0, ZoneId.of("Asia/Shanghai"));

// 转为 LocalDate（只保留日期）
LocalDate date = zdt.toLocalDate();           // 2024-01-15

// 转为 LocalTime（只保留时间）
LocalTime time = zdt.toLocalTime();           // 14:30:45

// 转为 LocalDateTime（去掉时区）
LocalDateTime dt = zdt.toLocalDateTime();     // 2024-01-15T14:30:45

// 转为 Instant（UTC 时间戳）
Instant instant = zdt.toInstant();            // 2024-01-15T06:30:45Z

// 转为 OffsetDateTime（保留偏移量）
OffsetDateTime odt = zdt.toOffsetDateTime();  // 2024-01-15T14:30:45+08:00

// 转为时间戳（毫秒）
long timestamp = zdt.toInstant().toEpochMilli();  // 1705305045000

// 转为 Date（Java 8 之前的旧 API）
Date legacyDate = Date.from(zdt.toInstant());
```

---

## 参考

- [Java 官方文档 - ZonedDateTime](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/ZonedDateTime.html)
