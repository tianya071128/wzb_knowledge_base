# LocalTime：本地时间

`java.time.LocalTime` 表示不带时区的时间，包含时、分、秒和纳秒。

## 特点

- **不可变**：线程安全
- **不包含日期和时区**：只表示一天中的时间
- **精度**：纳秒级

## 创建 LocalTime

```java
// 当前时间
LocalTime now = LocalTime.now();

// 指定时间
LocalTime time1 = LocalTime.of(14, 30);           // 14:30
LocalTime time2 = LocalTime.of(14, 30, 45);       // 14:30:45
LocalTime time3 = LocalTime.of(14, 30, 45, 123);  // 14:30:45.000000123

// 从字符串解析
LocalTime time4 = LocalTime.parse("14:30");           // 14:30
LocalTime time5 = LocalTime.parse("14:30:45");        // 14:30:45

// 从一天中的秒/纳秒创建
LocalTime time6 = LocalTime.ofSecondOfDay(3600);      // 01:00
LocalTime time7 = LocalTime.ofNanoOfDay(3600000000000L);  // 01:00

// 常量
LocalTime midnight = LocalTime.MIDNIGHT;  // 00:00
LocalTime noon = LocalTime.NOON;          // 12:00
```

## 常用操作

### 获取

```java
LocalTime time = LocalTime.of(14, 30, 45);

time.getHour();        // 14
time.getMinute();      // 30
time.getSecond();      // 45
time.getNano();        // 0

// 转为秒/纳秒
time.toSecondOfDay();  // 52245（一天中的秒数）
time.toNanoOfDay();    // 52245000000000（一天中的纳秒数）
```

### 修改

```java
LocalTime time = LocalTime.of(14, 30);

time.withHour(10);           // 10:30
time.withMinute(0);          // 14:00
time.withSecond(30);         // 14:30:30
time.withNano(123456789);    // 14:30:00.123456789

// 加减
time.plusHours(2);           // 16:30
time.plusMinutes(30);        // 15:00
time.minusHours(1);          // 13:30
```

### 比较

```java
LocalTime time1 = LocalTime.of(14, 30);
LocalTime time2 = LocalTime.of(15, 00);

time1.isBefore(time2);   // true
time1.isAfter(time2);    // false
time1.equals(time2);     // false
time1.compareTo(time2);  // 负数
```

### 格式化

```java
LocalTime time = LocalTime.of(14, 30, 45);

time.toString();                    // "14:30:45"
time.format(DateTimeFormatter.ofPattern("HH:mm"));      // "14:30"
time.format(DateTimeFormatter.ofPattern("hh:mm:ss a")); // "02:30:45 下午"
```

---

## 参考

- [Java 官方文档 - LocalTime](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/LocalTime.html)
