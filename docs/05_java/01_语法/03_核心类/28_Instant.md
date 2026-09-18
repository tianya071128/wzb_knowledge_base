# Instant：时间戳

`java.time.Instant` 表示时间线上的一个点，即 UTC 时间戳。

## 特点

- **不可变**：线程安全
- **基于 UTC**：与时区无关
- **精度**：纳秒级
- **用途**：记录事件发生的精确时刻

## 创建 Instant

```java
// 当前时刻
Instant now = Instant.now();

// 从时间戳创建
Instant instant1 = Instant.ofEpochSecond(1705305045);      // 秒级
Instant instant2 = Instant.ofEpochMilli(1705305045000L);   // 毫秒级
Instant instant3 = Instant.ofEpochSecond(1705305045, 123456789);  // 秒 + 纳秒

// 从时间戳字符串解析
Instant instant4 = Instant.parse("2024-01-15T06:30:45Z");

// 从 LocalDateTime 创建（需要时区偏移）
LocalDateTime dt = LocalDateTime.of(2024, 1, 15, 14, 30);
Instant instant5 = dt.toInstant(ZoneOffset.ofHours(8));
```

## 常用操作

### 获取

```java
Instant instant = Instant.now();

instant.getEpochSecond();  // 秒级时间戳
instant.toEpochMilli();    // 毫秒级时间戳
instant.getNano();         // 纳秒部分（0-999999999）
```

### 修改

```java
Instant instant = Instant.now();

instant.plusSeconds(60);     // 加 60 秒
instant.plusMillis(1000);    // 加 1000 毫秒
instant.plusNanos(1000000);  // 加 1000000 纳秒
instant.minusSeconds(60);    // 减 60 秒
```

### 比较

```java
Instant instant1 = Instant.now();
Instant instant2 = instant1.plusSeconds(60);

instant1.isBefore(instant2);   // true
instant1.isAfter(instant2);    // false
instant1.equals(instant2);     // false
```

### 计算间隔

```java
Instant instant1 = Instant.now();
Instant instant2 = instant1.plusSeconds(3600);  // 1 小时后

// 使用 Duration
Duration duration = Duration.between(instant1, instant2);
duration.getSeconds();  // 3600
duration.toMinutes();   // 60
duration.toHours();     // 1

// 使用 ChronoUnit
long seconds = ChronoUnit.SECONDS.between(instant1, instant2);  // 3600
```

### 时区转换

```java
Instant instant = Instant.now();

// 转为 ZonedDateTime
ZonedDateTime zdt = instant.atZone(ZoneId.of("Asia/Shanghai"));
// 2024-01-15T14:30:45+08:00[Asia/Shanghai]

// 转为 OffsetDateTime
OffsetDateTime odt = instant.atOffset(ZoneOffset.ofHours(8));
// 2024-01-15T14:30:45+08:00

// 转为 LocalDateTime（需要时区偏移）
LocalDateTime dt = LocalDateTime.ofInstant(instant, ZoneId.of("Asia/Shanghai"));
```

### 转换成其他类型

```java
Instant instant = Instant.now();

// 转为 ZonedDateTime（指定时区）
ZonedDateTime zdt = instant.atZone(ZoneId.of("Asia/Shanghai"));
// 2024-01-15T14:30:45+08:00[Asia/Shanghai]

// 转为 OffsetDateTime（指定时区偏移）
OffsetDateTime odt = instant.atOffset(ZoneOffset.ofHours(8));
// 2024-01-15T14:30:45+08:00

// 转为 LocalDateTime（指定时区）
LocalDateTime dt = LocalDateTime.ofInstant(instant, ZoneId.of("Asia/Shanghai"));
// 2024-01-15T14:30:45

// 转为 LocalDate（指定时区）
LocalDate date = LocalDate.ofInstant(instant, ZoneId.of("Asia/Shanghai"));
// 2024-01-15

// 转为 LocalTime（指定时区）
LocalTime time = LocalTime.ofInstant(instant, ZoneId.of("Asia/Shanghai"));
// 14:30:45

// 转为时间戳（秒）
long seconds = instant.getEpochSecond();

// 转为时间戳（毫秒）
long millis = instant.toEpochMilli();

// 转为 Date（Java 8 之前的旧 API）
Date legacyDate = Date.from(instant);
```

---

## 参考

- [Java 官方文档 - Instant](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/Instant.html)
