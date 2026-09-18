# Double 包装类

`java.lang.Double` 是基本类型 `double` 的包装类。

## 特点

- 占用 8 字节（64 位）
- 遵循 IEEE 754 标准
- 不可变（Immutable）

## 常用字段

```java
// 最大值
Double.MAX_VALUE;     // 1.7976931348623157E308

// 最小值（最小正数）
Double.MIN_VALUE;     // 4.9E-324

// 正无穷大
Double.POSITIVE_INFINITY;  // Infinity

// 负无穷大
Double.NEGATIVE_INFINITY;  // -Infinity

// 非数字（Not a Number）
Double.NaN;           // NaN

// 占用的位数
Double.SIZE;          // 64

// 占用的字节数
Double.BYTES;         // 8
```

## 创建 Double

```java
// 使用 valueOf（推荐）
Double d1 = Double.valueOf(3.14);

// 使用 parseDouble 解析字符串
double d2 = Double.parseDouble("3.14");    // 返回 double
Double d3 = Double.valueOf("3.14");        // 返回 Double

// 科学计数法
Double d4 = Double.valueOf("1.5e10");      // 15000000000.0
```

## 常用方法

```java
Double num = Double.valueOf(3.14);

// 转为基本类型
double val = num.doubleValue();
float f = num.floatValue();
int i = num.intValue();     // 3（截断小数）
long l = num.longValue();

// 解析字符串
Double.parseDouble("3.14");              // 3.14
Double.parseDouble("1.5e2");             // 150.0

// 特殊值判断
Double.isNaN(Double.NaN);                // true
Double.isInfinite(Double.POSITIVE_INFINITY);  // true
Double.isFinite(3.14);                   // true（Java 8+）

// 比较
Double d1 = Double.valueOf(1.0);
Double d2 = Double.valueOf(2.0);
d1.compareTo(d2);    // -1
Double.compare(1.0, 2.0);  // -1

// 数学运算
Double.max(1.0, 2.0);    // 2.0
Double.min(1.0, 2.0);    // 1.0
Double.sum(1.0, 2.0);    // 3.0

// 位操作
Double.doubleToLongBits(3.14);    // 将 double 转为 long 位表示
Double.longBitsToDouble(4614253070214989087L);  // 将 long 位表示转为 double
```

## NaN 的特殊行为

```java
// NaN 不等于任何值，包括自身
System.out.println(Double.NaN == Double.NaN);  // false
System.out.println(Double.NaN.equals(Double.NaN));  // true

// 使用 isNaN() 判断
Double d = Double.valueOf(Double.NaN);
System.out.println(d.isNaN());  // true
```

## 精度问题

```java
// 浮点数精度问题
System.out.println(0.1 + 0.2);  // 0.30000000000000004
System.out.println(0.1 + 0.2 == 0.3);  // false

// 精确计算应使用 BigDecimal
```

---

## 参考

- [Java 官方文档 - Double](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Double.html)
