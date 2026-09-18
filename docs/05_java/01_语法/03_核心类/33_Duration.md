# Duration：时间间隔

`java.time.Duration` 表示以时、分、秒、纳秒为单位的时间间隔。

## 特点

- **不可变**：线程安全
- **基于时间**：适用于 Instant、LocalTime、LocalDateTime 之间的计算
- **单位**：秒、纳秒（内部存储）

## 创建 Duration

```java
// 指定秒和纳秒
Duration duration1 = Duration.ofSeconds(3600);           // 1小时
Duration duration2 = Duration.ofSeconds(3600, 500000000); // 1小时0.5秒

// 指定其他单位
Duration duration3 = Duration.ofMillis(1000);    // 1秒
Duration duration4 = Duration.ofNanos(1000000);  // 1毫秒
Duration duration5 = Duration.ofMinutes(30);     // 30分钟
Duration duration6 = Duration.ofHours(2);        // 2小时
Duration duration7 = Duration.ofDays(1);         // 24小时

// 从两个时间点计算
Instant instant1 = Instant.now();
Instant instant2 = instant1.plusSeconds(3600);
Duration duration8 = Duration.between(instant1, instant2);  // 1小时

LocalTime time1 = LocalTime.of(10, 0);
LocalTime time2 = LocalTime.of(14, 30);
Duration duration9 = Duration.between(time1, time2);  // 4小时30分钟

// 从字符串解析
Duration duration10 = Duration.parse("PT1H30M");    // 1小时30分钟
Duration duration11 = Duration.parse("PT15S");      // 15秒
Duration duration12 = Duration.parse("P1DT12H");    // 1天12小时
```

## 常用操作

### 获取

```java
Duration duration = Duration.ofSeconds(3661, 500000000);

duration.getSeconds();      // 3661
duration.getNano();         // 500000000

// 转为其他单位
duration.toDays();          // 0
duration.toHours();         // 1
duration.toMinutes();       // 61
duration.toMillis();        // 3661500
duration.toNanos();         // 3661500000000

// 获取各部分
duration.toDaysPart();      // 0（Java 9+）
duration.toHoursPart();     // 1
duration.toMinutesPart();   // 1
duration.toSecondsPart();   // 1
duration.toNanosPart();     // 500000000

duration.isZero();          // false
duration.isNegative();      // false
```

### 修改

```java
Duration duration = Duration.ofHours(1);

duration.plusHours(1);       // 2小时
duration.plusMinutes(30);    // 1小时30分钟
duration.plusSeconds(15);    // 1小时15秒
duration.plusMillis(500);    // 1小时0.5秒
duration.minusHours(1);      // 0
duration.minusMinutes(30);   // 30分钟

duration.multipliedBy(2);    // 2小时
duration.dividedBy(2);       // 30分钟

duration.withSeconds(120);   // 2分钟
duration.withNanos(1000);    // 1微秒
```

### 使用

```java
LocalTime time = LocalTime.of(10, 0);
Duration duration = Duration.ofHours(2);

// 时间加上间隔
LocalTime result1 = time.plus(duration);  // 12:00

// 时间减去间隔
LocalTime result2 = time.minus(duration); // 08:00

// Instant 使用
Instant instant = Instant.now();
Instant result3 = instant.plus(duration);
```

### 计算时间差

```java
LocalTime startTime = LocalTime.of(9, 0);
LocalTime endTime = LocalTime.of(17, 30);

Duration workDuration = Duration.between(startTime, endTime);
System.out.println("工作时间: " + workDuration.toHours() + " 小时 " + workDuration.toMinutesPart() + " 分钟");
// 工作时间: 8 小时 30 分钟
```

## Period vs Duration

| 特性     | Period        | Duration                          |
| -------- | ------------- | --------------------------------- |
| 单位     | 年、月、日    | 秒、纳秒                          |
| 适用类型 | LocalDate     | Instant、LocalTime、LocalDateTime |
| 夏令时   | 考虑          | 不考虑                            |
| 创建方式 | `Period.of()` | `Duration.of()`                   |

```java
// Period：基于日期
LocalDate date1 = LocalDate.of(2024, 1, 1);
LocalDate date2 = LocalDate.of(2024, 2, 1);
Period period = Period.between(date1, date2);  // 1个月

// Duration：基于时间
Instant instant1 = Instant.now();
Instant instant2 = instant1.plus(30, ChronoUnit.DAYS);
Duration duration = Duration.between(instant1, instant2);  // 约30天
```

---

## 参考

- [Java 官方文档 - Duration](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/Duration.html)
