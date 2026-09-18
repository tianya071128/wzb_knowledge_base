# Short 包装类

`java.lang.Short` 是基本类型 `short` 的包装类。

## 特点

- 占用 2 字节（16 位）
- 取值范围：-32768 ~ 32767
- 不可变（Immutable）

## 常用字段

```java
// 最大值
Short.MAX_VALUE;    // 32767

// 最小值
Short.MIN_VALUE;    // -32768

// 占用的位数
Short.SIZE;         // 16

// 占用的字节数
Short.BYTES;        // 2
```

## 创建 Short

```java
// 使用 valueOf（推荐）
Short s1 = Short.valueOf((short) 1000);

// 使用 parseShort 解析字符串
short s2 = Short.parseShort("1000");  // 返回 short
Short s3 = Short.valueOf("1000");     // 返回 Short

// 指定进制
Short s4 = Short.valueOf("FF", 16);   // 255（十六进制）
```

## 常用方法

```java
Short s = Short.valueOf((short) 1000);

// 转为基本类型
short val = s.shortValue();
int i = s.intValue();
long l = s.longValue();

// 解析字符串
Short.parseShort("1000");            // 1000（十进制）
Short.parseShort("1010", 2);         // 10（二进制）
Short.parseShort("FF", 16);          // 255（十六进制）

// 转为字符串
Short.toString((short) 1000);        // "1000"
Short.toString((short) 10, 2);       // "1010"（二进制表示）
Short.toString((short) 255, 16);     // "ff"（十六进制表示）

// 反转字节顺序
short original = (short) 0x1234;
short reversed = Short.reverseBytes(original);  // 0x3412
```

## 缓存机制

Short 内部维护了缓存（-128 ~ 127）：

```java
Short s1 = Short.valueOf((short) 100);
Short s2 = Short.valueOf((short) 100);
System.out.println(s1 == s2);  // true（在缓存范围内）

Short s3 = Short.valueOf((short) 1000);
Short s4 = Short.valueOf((short) 1000);
System.out.println(s3 == s4);  // false（超出缓存范围）
```

---

## 参考

- [Java 官方文档 - Short](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Short.html)
