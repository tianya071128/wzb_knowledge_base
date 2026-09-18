# BigDecimal：高精度浮点数

`java.math.BigDecimal` 用于表示任意精度的有符号十进制数，适用于需要精确计算的金融、货币等场景。

## 特点

- **任意精度**：可以表示任意大小和精度的小数
- **不可变（Immutable）**：每次运算都返回新对象
- **线程安全**：由于不可变性，天然线程安全
- **精确计算**：避免了浮点数精度丢失问题
- **性能较低**：比 `double` 运算慢，仅在需要时使用

## 创建 BigDecimal

```java
// 从字符串创建（推荐，精确表示）
BigDecimal a = new BigDecimal("3.14159265358979323846");

// 从 long 创建
BigDecimal b = BigDecimal.valueOf(12345L);

// 从 double 创建（不推荐，可能有精度问题）
BigDecimal c = new BigDecimal(3.14);  // 3.140000000000000124344978758017532527446746826171875
BigDecimal d = BigDecimal.valueOf(3.14);  // 3.14（推荐）

// 从 BigInteger 创建
BigInteger bigInt = new BigInteger("123456789");
BigDecimal e = new BigDecimal(bigInt);

// 从字符数组创建
BigDecimal f = new BigDecimal("123.456".toCharArray());

// 常用常量
BigDecimal.ZERO;      // 0
BigDecimal.ONE;       // 1
BigDecimal.TEN;       // 10
```

> **重要**：创建 BigDecimal 时优先使用字符串构造器或 `valueOf()` 方法，避免使用 `double` 构造器。

## 常用操作

### 算术运算

```java
BigDecimal a = new BigDecimal("10.5");
BigDecimal b = new BigDecimal("3.2");

// 加法
a.add(b);              // 13.7

// 减法
a.subtract(b);         // 7.3

// 乘法
a.multiply(b);         // 33.60

// 除法（必须指定精度和舍入模式）
a.divide(b, 2, RoundingMode.HALF_UP);  // 3.28

// 或者使用 MathContext
a.divide(b, MathContext.DECIMAL128);   // 精确除法

// 幂运算
a.pow(2);              // 110.25

// 取绝对值
new BigDecimal("-10.5").abs();  // 10.5

// 取反
a.negate();            // -10.5

// 最大值、最小值
a.max(b);              // 10.5
a.min(b);              // 3.2
```

### 舍入模式（RoundingMode）

```java
BigDecimal num = new BigDecimal("2.5");

// HALF_UP：四舍五入（常用）
num.setScale(0, RoundingMode.HALF_UP);    // 3

// HALF_DOWN：五舍六入
num.setScale(0, RoundingMode.HALF_DOWN);  // 2

// HALF_EVEN：银行家舍入（四舍六入，五看奇偶）
new BigDecimal("2.5").setScale(0, RoundingMode.HALF_EVEN);   // 2
new BigDecimal("3.5").setScale(0, RoundingMode.HALF_EVEN);   // 4

// UP：向上取整（远离零）
num.setScale(0, RoundingMode.UP);         // 3

// DOWN：向下取整（靠近零）
num.setScale(0, RoundingMode.DOWN);       // 2

// CEILING：向正无穷取整
new BigDecimal("-2.5").setScale(0, RoundingMode.CEILING);  // -2

// FLOOR：向负无穷取整
new BigDecimal("-2.5").setScale(0, RoundingMode.FLOOR);    // -3

// UNNECESSARY：不需要舍入，否则抛出异常
```

### 比较

```java
BigDecimal a = new BigDecimal("10.50");
BigDecimal b = new BigDecimal("10.5");

// compareTo：比较数值大小（忽略精度）
a.compareTo(b);        // 0（相等）

// equals：比较数值和精度
a.equals(b);           // false（精度不同：10.50 vs 10.5）
a.compareTo(b) == 0;   // true（推荐用 compareTo）

// 与常量比较
a.compareTo(BigDecimal.ZERO) > 0;  // 判断是否大于 0
```

> **注意**：比较 BigDecimal 时应使用 `compareTo()`，而不是 `equals()`。

### 精度控制

```java
BigDecimal num = new BigDecimal("3.14159265");

// 设置小数位数
num.setScale(2, RoundingMode.HALF_UP);   // 3.14

// 获取精度（有效数字位数）
num.precision();       // 8

// 获取标度（小数位数）
num.scale();           // 8

// 去除末尾零
new BigDecimal("10.500").stripTrailingZeros();  // 10.5

// 转为工程表示法
new BigDecimal("1234567.89").toEngineeringString();  // 1.23456789E+6
```

### 转换

```java
BigDecimal num = new BigDecimal("123.456");

// 转为基本类型
num.intValue();        // 123（截断小数）
num.longValue();       // 123L
num.floatValue();      // 123.456f（可能丢失精度）
num.doubleValue();     // 123.456（可能丢失精度）

// 转为 BigInteger
num.toBigInteger();    // 123（截断小数）
num.toBigIntegerExact();  // 如果有小数部分则抛出异常

// 转为字符串
num.toString();        // "123.456"
num.toPlainString();   // "123.456"（不使用科学计数法）
num.toEngineeringString();  // "123.456"（工程计数法）
```

### 余数和商

```java
BigDecimal a = new BigDecimal("10");
BigDecimal b = new BigDecimal("3");

// 取余
a.remainder(b);        // 1

// 除法取整
a.divideToIntegralValue(b);  // 3（只取商的整数部分）

// 同时返回商和余数
BigDecimal[] result = a.divideAndRemainder(b);
// result[0] = 3（商）, result[1] = 1（余数）
```

## 实际应用示例

### 金融计算

```java
// 金额计算（避免精度丢失）
BigDecimal price = new BigDecimal("19.99");
BigDecimal quantity = new BigDecimal("3");
BigDecimal total = price.multiply(quantity);  // 59.97

// 折扣计算
BigDecimal discount = new BigDecimal("0.85");  // 85 折
BigDecimal finalPrice = total.multiply(discount)
    .setScale(2, RoundingMode.HALF_UP);  // 50.97

// 税费计算
BigDecimal taxRate = new BigDecimal("0.13");  // 13% 税
BigDecimal tax = total.multiply(taxRate)
    .setScale(2, RoundingMode.HALF_UP);  // 7.80
```

### 除法运算工具方法

```java
// 安全除法（自动处理精度）
public static BigDecimal safeDivide(BigDecimal a, BigDecimal b, int scale) {
    if (b.compareTo(BigDecimal.ZERO) == 0) {
        throw new ArithmeticException("Division by zero");
    }
    return a.divide(b, scale, RoundingMode.HALF_UP);
}

safeDivide(new BigDecimal("10"), new BigDecimal("3"), 2);  // 3.33
```

## BigDecimal vs double

| 特性     | BigDecimal | double      |
| -------- | ---------- | ----------- |
| 精度     | 任意精度   | 约 15-17 位 |
| 范围     | 任意大小   | 约 ±1.7e308 |
| 性能     | 慢         | 快          |
| 内存     | 动态分配   | 固定 8 字节 |
| 运算符   | 方法调用   | + - \* /    |
| 精度丢失 | 无         | 有          |
| 适用场景 | 金融、货币 | 科学计算    |

```java
// double 精度问题
System.out.println(0.1 + 0.2);  // 0.30000000000000004
System.out.println(0.1 + 0.2 == 0.3);  // false

// BigDecimal 精确计算
BigDecimal a = new BigDecimal("0.1");
BigDecimal b = new BigDecimal("0.2");
System.out.println(a.add(b));  // 0.3
System.out.println(a.add(b).compareTo(new BigDecimal("0.3")) == 0);  // true
```

> **建议**：金融、货币等需要精确计算的场景必须使用 `BigDecimal`。

---

## 参考

- [Java 官方文档 - BigDecimal](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigDecimal.html)
