# Long 包装类

`java.lang.Long` 是基本类型 `long` 的包装类。

## 特点

- 占用 8 字节（64 位）
- 取值范围：-2^63 ~ 2^63-1
- 不可变（Immutable）

## 常用字段

```java
// 最大值
Long.MAX_VALUE;    // 9223372036854775807

// 最小值
Long.MIN_VALUE;    // -9223372036854775808

// 占用的位数
Long.SIZE;         // 64

// 占用的字节数
Long.BYTES;        // 8
```

## 创建 Long

```java
// 使用 valueOf（推荐）
Long l1 = Long.valueOf(100L);

// 使用 parseLong 解析字符串
long l2 = Long.parseLong("100");      // 返回 long
Long l3 = Long.valueOf("100");        // 返回 Long

// 指定进制
Long l4 = Long.valueOf("FF", 16);     // 255（十六进制）
```

## 常用方法

```java
Long num = Long.valueOf(100L);

// 转为基本类型
long val = num.longValue();
int i = num.intValue();
double d = num.doubleValue();

// 解析字符串
Long.parseLong("100");                 // 100L
Long.parseLong("1010", 2);             // 10L（二进制）
Long.parseLong("FF", 16);              // 255L（十六进制）

// 转为字符串
Long.toString(100L);                   // "100"
Long.toBinaryString(10L);              // "1010"
Long.toHexString(255L);                // "ff"
Long.toOctalString(8L);                // "10"

// 比较
Long l1 = Long.valueOf(10L);
Long l2 = Long.valueOf(20L);
l1.compareTo(l2);    // -1
Long.compare(10L, 20L);  // -1

// 数学运算
Long.max(10L, 20L);    // 20L
Long.min(10L, 20L);    // 10L
Long.sum(10L, 20L);    // 30L

// 位操作
Long.reverseBytes(0x123456789ABCDEF0L);  // 反转字节顺序
Long.bitCount(15L);                       // 4
```

## 缓存机制

Long 内部维护了缓存（-128 ~ 127）：

```java
Long l1 = Long.valueOf(100L);
Long l2 = Long.valueOf(100L);
System.out.println(l1 == l2);  // true（在缓存范围内）

Long l3 = Long.valueOf(200L);
Long l4 = Long.valueOf(200L);
System.out.println(l3 == l4);  // false（超出缓存范围）
```

---

## 参考

- [Java 官方文档 - Long](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Long.html)
