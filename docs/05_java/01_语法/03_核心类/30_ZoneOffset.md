# ZoneOffset：时区偏移

`java.time.ZoneOffset` 表示与 UTC 的固定偏移量。

## 特点

- **不可变**：线程安全
- **固定偏移**：不包含夏令时等历史变化
- **格式**：`+HH:mm` 或 `-HH:mm`

## 创建 ZoneOffset

```java
// UTC
ZoneOffset utc = ZoneOffset.UTC;           // +00:00
ZoneOffset utc2 = ZoneOffset.of("Z");      // +00:00

// 指定偏移
ZoneOffset offset1 = ZoneOffset.ofHours(8);         // +08:00
ZoneOffset offset2 = ZoneOffset.ofHours(-5);        // -05:00
ZoneOffset offset3 = ZoneOffset.ofHoursMinutes(5, 30);  // +05:30（印度）
ZoneOffset offset4 = ZoneOffset.ofHoursMinutesSeconds(5, 30, 0);  // +05:30

// 从字符串解析
ZoneOffset offset5 = ZoneOffset.of("+08:00");
ZoneOffset offset6 = ZoneOffset.of("-05:00");

// 从总秒数创建
ZoneOffset offset7 = ZoneOffset.ofTotalSeconds(8 * 3600);  // +08:00
```

## 常用操作

### 获取

```java
ZoneOffset offset = ZoneOffset.ofHours(8);

offset.getId();           // "+08:00"
offset.getTotalSeconds(); // 28800（8 * 3600）
offset.getHours();        // 8
offset.getMinutes();      // 0
offset.getSeconds();      // 0
```

### 使用

```java
ZoneOffset offset = ZoneOffset.ofHours(8);

// 与 LocalDateTime 结合创建 OffsetDateTime
LocalDateTime dt = LocalDateTime.of(2024, 1, 15, 14, 30);
OffsetDateTime odt = dt.atOffset(offset);
// 2024-01-15T14:30+08:00

// 与 LocalDateTime 结合创建 Instant
Instant instant = dt.toInstant(offset);

// 与 Instant 结合创建 OffsetDateTime
Instant now = Instant.now();
OffsetDateTime odt2 = now.atOffset(offset);
```

## ZoneOffset vs ZoneId

| 特性     | ZoneOffset | ZoneId          |
| -------- | ---------- | --------------- |
| 类型     | 固定偏移   | 时区规则        |
| 夏令时   | 不支持     | 支持            |
| 历史变化 | 不支持     | 支持            |
| 格式     | `+08:00`   | `Asia/Shanghai` |
| 适用场景 | 简单偏移   | 完整时区处理    |

```java
// ZoneOffset：固定偏移，不考虑夏令时
ZoneOffset offset = ZoneOffset.ofHours(8);

// ZoneId：完整时区规则，考虑夏令时
ZoneId zone = ZoneId.of("Asia/Shanghai");

// 对于中国（没有夏令时），两者效果相同
// 对于美国等有夏令时的地区，必须使用 ZoneId
```

---

## 参考

- [Java 官方文档 - ZoneOffset](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/ZoneOffset.html)
