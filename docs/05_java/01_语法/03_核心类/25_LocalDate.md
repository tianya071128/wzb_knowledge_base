# LocalDate：本地日期

`java.time.LocalDate` 表示不带时区的日期，包含年、月、日。

## 特点

- **不可变**：线程安全
- **不包含时间和时区**：只表示日期
- **精度**：天

## 创建 LocalDate

```java
// 当前日期
LocalDate today = LocalDate.now();

// 指定日期
LocalDate date1 = LocalDate.of(2024, 1, 15);       // 2024-01-15
LocalDate date2 = LocalDate.of(2024, Month.JANUARY, 15);  // 2024-01-15

// 从字符串解析
LocalDate date3 = LocalDate.parse("2024-01-15");           // 2024-01-15
LocalDate date4 = LocalDate.parse("20240115", DateTimeFormatter.BASIC_ISO_DATE);

// 从时间戳创建（需要时区）
LocalDate date5 = LocalDate.ofInstant(Instant.now(), ZoneId.of("Asia/Shanghai"));

// 从年份和一年中的第几天创建
LocalDate date6 = LocalDate.ofYearDay(2024, 100);  // 2024-04-09

// 从年份和月份的第几天创建
LocalDate date7 = LocalDate.of(2024, 1, 15);  // 2024-01-15
```

## 常用操作

### 获取

```java
LocalDate date = LocalDate.of(2024, 1, 15);

date.getYear();         // 2024
date.getMonth();        // JANUARY
date.getMonthValue();   // 1
date.getDayOfMonth();   // 15
date.getDayOfYear();    // 15（一年中的第 15 天）
date.getDayOfWeek();    // MONDAY
date.lengthOfMonth();   // 31（当月天数）
date.lengthOfYear();    // 366（是否闰年）
date.isLeapYear();      // true（是否闰年）
```

### 修改

```java
LocalDate date = LocalDate.of(2024, 1, 15);

date.withYear(2025);           // 2025-01-15
date.withMonth(6);             // 2024-06-15
date.withDayOfMonth(20);       // 2024-01-20
date.withDayOfYear(100);       // 2024-04-09

// 加减
date.plusYears(1);             // 2025-01-15
date.plusMonths(2);            // 2024-03-15
date.plusWeeks(1);             // 2024-01-22
date.plusDays(10);             // 2024-01-25
date.minusYears(1);            // 2023-01-15
```

### 比较

```java
LocalDate date1 = LocalDate.of(2024, 1, 15);
LocalDate date2 = LocalDate.of(2024, 6, 20);

date1.isBefore(date2);   // true
date1.isAfter(date2);    // false
date1.equals(date2);     // false
date1.compareTo(date2);  // 负数
```

### 计算间隔

```java
LocalDate date1 = LocalDate.of(2024, 1, 15);
LocalDate date2 = LocalDate.of(2024, 6, 20);

// 使用 Period
Period period = Period.between(date1, date2);
period.getYears();    // 0
period.getMonths();   // 5
period.getDays();     // 5

// 使用 ChronoUnit
long days = ChronoUnit.DAYS.between(date1, date2);  // 157
long months = ChronoUnit.MONTHS.between(date1, date2);  // 5
```

### 格式化

```java
LocalDate date = LocalDate.of(2024, 1, 15);

date.toString();                    // "2024-01-15"
date.format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));   // "2024/01/15"
date.format(DateTimeFormatter.ofPattern("yyyy年MM月dd日")); // "2024年01月15日"
date.format(DateTimeFormatter.ISO_LOCAL_DATE);            // "2024-01-15"
```

---

## 参考

- [Java 官方文档 - LocalDate](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/LocalDate.html)
