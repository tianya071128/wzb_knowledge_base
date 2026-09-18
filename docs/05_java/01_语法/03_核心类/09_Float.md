# Float 包装类

`java.lang.Float` 是基本类型 `float` 的包装类。

## 特点

- 占用 4 字节（32 位）
- 遵循 IEEE 754 标准
- 不可变（Immutable）

## 常用字段

```java
// 最大值
Float.MAX_VALUE;     // 3.4028235E38

// 最小值（最小正数）
Float.MIN_VALUE;     // 1.4E-45

// 正无穷大
Float.POSITIVE_INFINITY;  // Infinity

// 负无穷大
Float.NEGATIVE_INFINITY;  // -Infinity

// 非数字（Not a Number）
Float.NaN;           // NaN

// 占用的位数
Float.SIZE;          // 32

// 占用的字节数
Float.BYTES;         // 4
```

## 创建 Float

```java
// 使用 valueOf（推荐）
Float f1 = Float.valueOf(3.14f);

// 使用 parseFloat 解析字符串
float f2 = Float.parseFloat("3.14");    // 返回 float
Float f3 = Float.valueOf("3.14");       // 返回 Float

// 科学计数法
Float f4 = Float.valueOf("1.5e2");      // 150.0
```

## 常用方法

```java
Float num = Float.valueOf(3.14f);

// 转为基本类型
float val = num.floatValue();
double d = num.doubleValue();
int i = num.intValue();     // 3（截断小数）

// 解析字符串
Float.parseFloat("3.14");              // 3.14f
Float.parseFloat("1.5e2");             // 150.0f

// 特殊值判断
Float.isNaN(Float.NaN);                // true
Float.isInfinite(Float.POSITIVE_INFINITY);  // true
Float.isFinite(3.14f);                 // true（Java 8+）

// 比较
Float f1 = Float.valueOf(1.0f);
Float f2 = Float.valueOf(2.0f);
f1.compareTo(f2);    // -1
Float.compare(1.0f, 2.0f);  // -1

// 数学运算
Float.max(1.0f, 2.0f);   // 2.0f
Float.min(1.0f, 2.0f);   // 1.0f
Float.sum(1.0f, 2.0f);   // 3.0f

// 位操作
Float.floatToIntBits(3.14f);    // 将 float 转为 int 位表示
Float.intBitsToFloat(1076754473);  // 将 int 位表示转为 float
```

## NaN 的特殊行为

```java
// NaN 不等于任何值，包括自身
System.out.println(Float.NaN == Float.NaN);  // false
System.out.println(Float.NaN.equals(Float.NaN));  // true

// 使用 isNaN() 判断
Float f = Float.valueOf(Float.NaN);
System.out.println(f.isNaN());  // true
```

---

## 参考

- [Java 官方文档 - Float](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Float.html)
