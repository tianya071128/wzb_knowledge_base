# BigInteger：超大整数

`java.math.BigInteger` 用于表示任意精度的整数，可以处理超出 `long` 范围的整数运算。

## 特点

- **任意大小**：可以表示任意大小的整数
- **不可变（Immutable）**：每次运算都返回新对象
- **线程安全**：由于不可变性，天然线程安全
- **性能较低**：比基本类型运算慢，仅在需要时使用

## 创建 BigInteger

```java
// 从字符串创建
BigInteger a = new BigInteger("123456789012345678901234567890");

// 从字符串创建（推荐，可捕获异常）
BigInteger b = BigInteger.valueOf(123456789L);

// 从字节数组创建（二进制补码表示）
byte[] bytes = {1, 0, 0, 0, 0, 0, 0, 0};
BigInteger c = new BigInteger(bytes);

// 指定进制
BigInteger d = new BigInteger("FF", 16);  // 255（十六进制）
BigInteger e = new BigInteger("1010", 2); // 10（二进制）

// 指定进制和随机数
BigInteger f = new BigInteger(128, new java.util.Random());  // 128 位随机数
```

## 常用常量

```java
BigInteger.ZERO;      // 0
BigInteger.ONE;       // 1
BigInteger.TEN;       // 10
BigInteger.TWO;       // 2（Java 9+）
```

## 常用操作

### 算术运算

```java
BigInteger a = new BigInteger("100");
BigInteger b = new BigInteger("30");

// 加法
a.add(b);              // 130

// 减法
a.subtract(b);         // 70

// 乘法
a.multiply(b);         // 3000

// 除法
a.divide(b);           // 3（整数除法）

// 取余
a.remainder(b);        // 10

// 同时返回商和余数
BigInteger[] result = a.divideAndRemainder(b);
// result[0] = 3（商）, result[1] = 10（余数）

// 幂运算
a.pow(3);              // 1000000（100 的 3 次方）

// 取绝对值
new BigInteger("-100").abs();  // 100

// 取反
a.negate();            // -100
```

### 比较

```java
BigInteger a = new BigInteger("100");
BigInteger b = new BigInteger("200");

// 比较大小
a.compareTo(b);        // -1（负数表示 a < b）
a.compareTo(a);        // 0（相等）

// 判断是否相等
a.equals(b);           // false
a.equals(new BigInteger("100"));  // true

// 最大值、最小值
a.max(b);              // 200
a.min(b);              // 100
```

### 判断

```java
BigInteger num = new BigInteger("100");

// 判断符号
num.signum();          // 1（正数返回 1，负数返回 -1，零返回 0）

// 判断奇偶
num.testBit(0);        // false（最低位为 0，是偶数）
new BigInteger("7").testBit(0);  // true（奇数）
```

### 位运算

```java
BigInteger a = new BigInteger("12");  // 1100
BigInteger b = new BigInteger("10");  // 1010

// 与
a.and(b);              // 8（1000）

// 或
a.or(b);               // 14（1110）

// 异或
a.xor(b);              // 6（0110）

// 取反
a.not();               // -13

// 左移
a.shiftLeft(2);        // 48（12 << 2）

// 右移
a.shiftRight(2);       // 3（12 >> 2）

// 清除指定位
a.clearBit(2);         // 8（清除第 2 位）

// 设置指定位
a.setBit(0);           // 13（设置第 0 位）

// 翻转指定位
a.flipBit(0);          // 13（翻转第 0 位）

// 测试指定位
a.testBit(2);          // true（第 2 位是 1）
```

### 转换

```java
BigInteger num = new BigInteger("12345");

// 转为基本类型
num.intValue();        // 12345（可能溢出）
num.longValue();       // 12345L
num.floatValue();      // 12345.0f（可能丢失精度）
num.doubleValue();     // 12345.0（可能丢失精度）

// 转为字符串
num.toString();        // "12345"
num.toString(16);      // "3039"（十六进制）
num.toString(2);       // "11000000111001"（二进制）

// 转为字节数组
byte[] bytes = num.toByteArray();
```

### 数学运算

```java
BigInteger a = new BigInteger("12");
BigInteger b = new BigInteger("8");

// 最大公约数
a.gcd(b);              // 4

// 模运算
a.mod(b);              // 4（等价于 remainder，但结果始终非负）

// 模幂运算：(a^b) mod m
BigInteger base = new BigInteger("2");
BigInteger exp = new BigInteger("10");
BigInteger mod = new BigInteger("1000");
base.modPow(exp, mod); // 24（2^10 mod 1000 = 1024 mod 1000）

// 模逆元：a^(-1) mod m
BigInteger m = new BigInteger("7");
BigInteger p = new BigInteger("11");
m.modInverse(p);       // 8（因为 7 * 8 = 56 ≡ 1 (mod 11)）

// 判断是否为素数
new BigInteger("17").isProbablePrime(100);  // true（100 是确定性级别）
new BigInteger("15").isProbablePrime(100);  // false

// 生成下一个素数
new BigInteger("14").nextProbablePrime();   // 17
```

## 实际应用示例

```java
// 计算阶乘
public static BigInteger factorial(int n) {
    BigInteger result = BigInteger.ONE;
    for (int i = 2; i <= n; i++) {
        result = result.multiply(BigInteger.valueOf(i));
    }
    return result;
}

factorial(100);  // 100! 的结果（158 位数字）

// 斐波那契数列
public static BigInteger fibonacci(int n) {
    if (n <= 1) return BigInteger.valueOf(n);
    BigInteger a = BigInteger.ZERO;
    BigInteger b = BigInteger.ONE;
    for (int i = 2; i <= n; i++) {
        BigInteger temp = a.add(b);
        a = b;
        b = temp;
    }
    return b;
}

fibonacci(1000);  // 第 1000 个斐波那契数（209 位数字）
```

## BigInteger vs Long

| 特性     | BigInteger         | long           |
| -------- | ------------------ | -------------- |
| 范围     | 任意精度           | -2^63 ~ 2^63-1 |
| 性能     | 慢                 | 快             |
| 内存     | 动态分配           | 固定 8 字节    |
| 运算符   | 方法调用           | + - \* / %     |
| 适用场景 | 超大整数、精确计算 | 一般整数运算   |

> **建议**：只有在 `long` 无法满足需求时才使用 `BigInteger`。

---

## 参考

- [Java 官方文档 - BigInteger](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigInteger.html)
