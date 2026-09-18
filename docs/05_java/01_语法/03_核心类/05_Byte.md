# Byte 包装类

`java.lang.Byte` 是基本类型 `byte` 的包装类。

## 特点

- 占用 1 字节（8 位）
- 取值范围：-128 ~ 127
- 不可变（Immutable）

## 常用字段

```java
// 最大值
Byte.MAX_VALUE;    // 127

// 最小值
Byte.MIN_VALUE;    // -128

// 占用的位数
Byte.SIZE;         // 8

// 占用的字节数
Byte.BYTES;        // 1

// 对应的 Class 对象
Byte.TYPE;         // byte.class
```

## 创建 Byte

```java
// 使用构造器（已废弃，推荐使用 valueOf）
Byte b1 = new Byte((byte) 100);  // @Deprecated

// 使用 valueOf（推荐）
Byte b2 = Byte.valueOf((byte) 100);

// 使用 parseByte 解析字符串
Byte b3 = Byte.parseByte("100");  // 返回 byte
Byte b4 = Byte.valueOf("100");    // 返回 Byte
```

## 常用方法

```java
Byte b = Byte.valueOf((byte) 100);

// 转为基本类型
byte val = b.byteValue();

// 转为其他类型
int i = b.intValue();
long l = b.longValue();
float f = b.floatValue();
double d = b.doubleValue();
String s = b.toString();  // "100"

// 解析字符串
Byte.parseByte("100");           // 100（十进制）
Byte.parseByte("1010", 2);       // 10（二进制）
Byte.parseByte("FF", 16);        // -1（十六进制，超出范围会异常）

// 转为字符串
Byte.toString((byte) 100);       // "100"
Byte.toString((byte) 10, 2);     // "1010"（二进制表示）
Byte.toString((byte) 255, 16);   // "ff"（十六进制表示）

// 比较
Byte b1 = Byte.valueOf((byte) 10);
Byte b2 = Byte.valueOf((byte) 20);
b1.compareTo(b2);  // -10（负数表示 b1 < b2）
b1.equals(b2);     // false

// hashCode
b.hashCode();      // 100（Byte 的 hashCode 就是其值本身）
```

## 缓存机制

Byte 内部维护了一个缓存，缓存了所有可能的 Byte 实例（-128 ~ 127）：

```java
Byte b1 = Byte.valueOf((byte) 100);
Byte b2 = Byte.valueOf((byte) 100);
System.out.println(b1 == b2);  // true（使用缓存）
```

> **注意**：Byte 的缓存范围覆盖了所有可能的值（-128 ~ 127），因此 `valueOf()` 总是返回相同的对象。

---

## 参考

- [Java 官方文档 - Byte](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Byte.html)
