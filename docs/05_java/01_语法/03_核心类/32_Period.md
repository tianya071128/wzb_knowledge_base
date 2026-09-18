# Period：日期间隔

`java.time.Period` 表示以年、月、日为单位的时间间隔。

## 特点

- **不可变**：线程安全
- **基于日期**：适用于 LocalDate 之间的计算
- **单位**：年、月、日

## 创建 Period

```java
// 指定年月日
Period period1 = Period.of(2, 3, 15);  // 2年3月15天

// 只指定年
Period period2 = Period.ofYears(2);    // 2年

// 只指定月
Period period3 = Period.ofMonths(3);   // 3个月

// 只指定日
Period period4 = Period.ofDays(15);    // 15天

// 指定周（转为日）
Period period5 = Period.ofWeeks(2);    // 14天

// 从两个日期计算
LocalDate date1 = LocalDate.of(2024, 1, 15);
LocalDate date2 = LocalDate.of(2024, 6, 20);
Period period6 = Period.between(date1, date2);  // 5个月5天

// 从字符串解析
Period period7 = Period.parse("P2Y3M15D");  // 2年3月15天
Period period8 = Period.parse("P1Y");       // 1年
Period period9 = Period.parse("P15D");      // 15天
```

## 常用操作

### 获取

```java
Period period = Period.of(2, 3, 15);

period.getYears();   // 2
period.getMonths();  // 3
period.getDays();    // 15

period.isZero();     // false
period.isNegative(); // false
```

### 修改

```java
Period period = Period.of(2, 3, 15);

period.plusYears(1);     // 3年3月15天
period.plusMonths(2);    // 2年5月15天
period.plusDays(10);     // 2年3月25天
period.minusYears(1);    // 1年3月15天
period.minusMonths(1);   // 2年2月15天
period.minusDays(5);     // 2年3月10天

period.withYears(5);     // 5年3月15天
period.withMonths(6);    // 2年6月15天
period.withDays(20);     // 2年3月20天
```

### 使用

```java
LocalDate date = LocalDate.of(2024, 1, 15);
Period period = Period.of(2, 3, 15);

// 日期加上间隔
LocalDate result1 = date.plus(period);  // 2026-04-30

// 日期减去间隔
LocalDate result2 = date.minus(period); // 2021-10-00 → 2021-09-30
```

### 计算年龄

```java
LocalDate birthday = LocalDate.of(1990, 5, 15);
LocalDate today = LocalDate.now();

Period age = Period.between(birthday, today);
System.out.println("年龄: " + age.getYears() + " 岁 " + age.getMonths() + " 月 " + age.getDays() + " 天");
```

---

## 参考

- [Java 官方文档 - Period](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/Period.html)
