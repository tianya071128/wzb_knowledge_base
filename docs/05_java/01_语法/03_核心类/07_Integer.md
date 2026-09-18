# Integer 包装类

`java.lang.Integer` 是基本类型 `int` 的包装类。

## 特点

- 占用 4 字节（32 位）
- 取值范围：-2^31 ~ 2^31-1（约 -21 亿 ~ 21 亿）
- 不可变（Immutable）

## 常用字段

```java
// 最大值
Integer.MAX_VALUE;    // 2147483647

// 最小值
Integer.MIN_VALUE;    // -2147483648

// 占用的位数
Integer.SIZE;         // 32

// 占用的字节数
Integer.BYTES;        // 4
```

## 创建 Integer

```java
// 使用 valueOf（推荐）
Integer i1 = Integer.valueOf(100);

// 使用 parseInt 解析字符串
int i2 = Integer.parseInt("100");       // 返回 int
Integer i3 = Integer.valueOf("100");    // 返回 Integer

// 指定进制
Integer i4 = Integer.valueOf("FF", 16);    // 255（十六进制）
Integer i5 = Integer.valueOf("1010", 2);   // 10（二进制）
```

## 常用方法

```java
Integer num = Integer.valueOf(100);

// 转为基本类型
int val = num.intValue();
long l = num.longValue();
double d = num.doubleValue();

// 解析字符串
Integer.parseInt("100");               // 100（十进制）
Integer.parseInt("1010", 2);           // 10（二进制）
Integer.parseInt("FF", 16);            // 255（十六进制）
Integer.parseInt("-100");              // -100

// 转为字符串
Integer.toString(100);                 // "100"
Integer.toString(10, 2);               // "1010"（二进制）
Integer.toString(255, 16);             // "ff"（十六进制）
Integer.toBinaryString(10);            // "1010"
Integer.toHexString(255);              // "ff"
Integer.toOctalString(8);              // "10"

// 进制转换
Integer.valueOf("1111", 2);            // 15（二进制转十进制）

// 比较
Integer i1 = Integer.valueOf(10);
Integer i2 = Integer.valueOf(20);
i1.compareTo(i2);  // -1（负数表示 i1 < i2）
Integer.compare(10, 20);  // -1（静态方法）
i1.equals(i2);     // false

// 数学运算
Integer.max(10, 20);   // 20
Integer.min(10, 20);   // 10
Integer.sum(10, 20);   // 30

// 位操作
Integer.reverseBytes(0x12345678);  // 反转字节顺序
Integer.bitCount(15);              // 4（二进制中 1 的个数）
```

## 缓存机制

Integer 内部维护了缓存（-128 ~ 127）：

```java
Integer i1 = Integer.valueOf(100);
Integer i2 = Integer.valueOf(100);
System.out.println(i1 == i2);  // true（在缓存范围内）

Integer i3 = Integer.valueOf(200);
Integer i4 = Integer.valueOf(200);
System.out.println(i3 == i4);  // false（超出缓存范围）
```

> **注意**：使用 `==` 比较 Integer 时，只有在 -128 ~ 127 范围内才可靠。比较值时应使用 `equals()`。

---

## 参考

- [Java 官方文档 - Integer](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Integer.html)
