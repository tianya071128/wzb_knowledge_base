# ZoneId：时区 ID

`java.time.ZoneId` 表示时区 ID，如 `Asia/Shanghai`、`America/New_York`。

## 特点

- **不可变**：线程安全
- **包含时区规则**：包括夏令时等历史变化
- **格式**：`区域/城市`，如 `Asia/Shanghai`

## 创建 ZoneId

```java
// 系统默认时区
ZoneId systemZone = ZoneId.systemDefault();

// 指定时区
ZoneId shanghai = ZoneId.of("Asia/Shanghai");
ZoneId newYork = ZoneId.of("America/New_York");
ZoneId london = ZoneId.of("Europe/London");
ZoneId tokyo = ZoneId.of("Asia/Tokyo");

// 从 ZoneOffset 创建
ZoneId zoneId = ZoneId.ofOffset("UTC", ZoneOffset.ofHours(8));  // UTC+08:00

// 获取所有可用时区
Set<String> zones = ZoneId.getAvailableZoneIds();
// 例如：[Asia/Shanghai, America/New_York, Europe/London, ...]

// 过滤特定时区的城市
ZoneId.getAvailableZoneIds().stream()
    .filter(zone -> zone.contains("Asia"))
    .sorted()
    .forEach(System.out::println);
```

## 常用操作

### 获取信息

```java
ZoneId zone = ZoneId.of("Asia/Shanghai");

zone.getId();           // "Asia/Shanghai"
zone.getRules();        // ZoneRules（时区规则）
zone.normalized();      // 如果是固定偏移，返回 ZoneOffset
```

### 使用

```java
ZoneId zone = ZoneId.of("Asia/Shanghai");

// 与 LocalDateTime 结合
LocalDateTime dt = LocalDateTime.of(2024, 1, 15, 14, 30);
ZonedDateTime zdt = dt.atZone(zone);
// 2024-01-15T14:30+08:00[Asia/Shanghai]

// 与 Instant 结合
Instant instant = Instant.now();
ZonedDateTime zdt2 = instant.atZone(zone);
```

### 时区转换

```java
ZoneId shanghai = ZoneId.of("Asia/Shanghai");
ZoneId newYork = ZoneId.of("America/New_York");

ZonedDateTime shanghaiTime = ZonedDateTime.now(shanghai);
ZonedDateTime newYorkTime = shanghaiTime.withZoneSameInstant(newYork);

System.out.println("上海时间: " + shanghaiTime);
System.out.println("纽约时间: " + newYorkTime);
```

## 常用时区

| 时区 ID               | 说明           | UTC 偏移      |
| --------------------- | -------------- | ------------- |
| `Asia/Shanghai`       | 中国标准时间   | +08:00        |
| `Asia/Tokyo`          | 日本标准时间   | +09:00        |
| `Asia/Kolkata`        | 印度标准时间   | +05:30        |
| `Europe/London`       | 英国时间       | +00:00/+01:00 |
| `Europe/Paris`        | 中欧时间       | +01:00/+02:00 |
| `America/New_York`    | 美国东部时间   | -05:00/-04:00 |
| `America/Los_Angeles` | 美国太平洋时间 | -08:00/-07:00 |
| `UTC`                 | 协调世界时     | +00:00        |

---

## 参考

- [Java 官方文档 - ZoneId](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/ZoneId.html)
