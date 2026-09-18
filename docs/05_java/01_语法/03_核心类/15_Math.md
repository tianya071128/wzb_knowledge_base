# Math：数学运算

`java.lang.Math` 是一个工具类，提供了常用的数学运算方法，所有方法都是静态方法。

## 特点

- **工具类**：所有方法都是静态方法，直接通过类名调用
- **final 类**：不能被继承
- **私有构造器**：不能创建实例
- **覆盖多种运算**：三角函数、指数、对数、平方根、取整等

## 常用常量

```java
// 圆周率 π
Math.PI;       // 3.141592653589793

// 自然对数底数 e
Math.E;        // 2.718281828459045
```

## 常用方法

### 取整

```java
// 向上取整（天花板）
Math.ceil(3.2);    // 4.0
Math.ceil(3.8);    // 4.0
Math.ceil(-3.2);   // -3.0

// 向下取整（地板）
Math.floor(3.2);   // 3.0
Math.floor(3.8);   // 3.0
Math.floor(-3.2);  // -4.0

// 四舍五入
Math.round(3.4);   // 3（返回 long）
Math.round(3.5);   // 4
Math.round(3.6);   // 4
Math.round(-3.4);  // -3

// 四舍五入（返回 int）
Math.round(3.5f);  // 4（参数为 float 时返回 int）

// 取整数部分（截断小数）
// Java 没有直接方法，可用 (int) 强制转换
(int) 3.8;         // 3
(int) -3.8;        // -3
```

### 绝对值

```java
Math.abs(-10);     // 10
Math.abs(10);      // 10
Math.abs(-3.14);   // 3.14
Math.abs(-10L);    // 10L（支持 long）
```

### 最大值、最小值

```java
Math.max(10, 20);      // 20
Math.max(3.14, 2.71);  // 3.14
Math.max(-5, -10);     // -5

Math.min(10, 20);      // 10
Math.min(3.14, 2.71);  // 2.71
Math.min(-5, -10);     // -10
```

### 幂运算

```java
// 幂运算：a 的 b 次方
Math.pow(2, 3);    // 8.0（2^3）
Math.pow(2, 10);   // 1024.0
Math.pow(10, 3);   // 1000.0
Math.pow(4, 0.5);  // 2.0（平方根）

// 平方根
Math.sqrt(16);     // 4.0
Math.sqrt(2);      // 1.4142135623730951

// 立方根
Math.cbrt(27);     // 3.0
Math.cbrt(8);      // 2.0

// 平方
Math.pow(5, 2);    // 25.0
```

### 对数

```java
// 自然对数（以 e 为底）
Math.log(Math.E);      // 1.0
Math.log(1);           // 0.0
Math.log(10);          // 2.302585092994046

// 以 10 为底的对数
Math.log10(100);       // 2.0
Math.log10(1000);      // 3.0
Math.log10(1);         // 0.0

// 以 2 为底的对数（Java 9+）
Math.log2(8);          // 3.0
Math.log2(1024);       // 10.0
```

### 三角函数

```java
// 正弦
Math.sin(0);           // 0.0
Math.sin(Math.PI / 2); // 1.0

// 余弦
Math.cos(0);           // 1.0
Math.cos(Math.PI);     // -1.0

// 正切
Math.tan(0);           // 0.0
Math.tan(Math.PI / 4); // 1.0（约等于）

// 反正弦
Math.asin(1);          // 1.5707963267948966（π/2）

// 反余弦
Math.acos(1);          // 0.0

// 反正切
Math.atan(1);          // 0.7853981633974483（π/4）

// 角度转弧度
Math.toRadians(180);   // 3.141592653589793（π）
Math.toRadians(90);    // 1.5707963267948966（π/2）

// 弧度转角度
Math.toDegrees(Math.PI);     // 180.0
Math.toDegrees(Math.PI / 2); // 90.0
```

### 随机数

```java
// 生成 [0.0, 1.0) 之间的随机数
Math.random();         // 例如：0.723456789

// 生成 [0, n) 之间的随机整数
(int)(Math.random() * 10);     // 0-9 的随机整数

// 生成 [min, max] 之间的随机整数
int min = 10, max = 20;
int random = (int)(Math.random() * (max - min + 1)) + min;  // 10-20

// 注意：更推荐使用 java.util.Random 或 ThreadLocalRandom
```

### 精确运算

```java
// 精确加法（避免溢出）
Math.addExact(Integer.MAX_VALUE, 1);  // 抛出 ArithmeticException

// 精确减法
Math.subtractExact(Integer.MIN_VALUE, 1);  // 抛出 ArithmeticException

// 精确乘法
Math.multiplyExact(1000000, 1000000);  // 正常返回
Math.multiplyExact(Integer.MAX_VALUE, 2);  // 抛出 ArithmeticException

// 精确递增
Math.incrementExact(Integer.MAX_VALUE);  // 抛出 ArithmeticException

// 精确递减
Math.decrementExact(Integer.MIN_VALUE);  // 抛出 ArithmeticException

// 精确取反
Math.negateExact(Integer.MIN_VALUE);  // 抛出 ArithmeticException
```

### 其他

```java
// 符号函数
Math.signum(10);     // 1.0（正数返回 1）
Math.signum(-10);    // -1.0（负数返回 -1）
Math.signum(0);      // 0.0（零返回 0）

// 剩余运算
Math.IEEEremainder(10, 3);  // 1.0（IEEE 754 剩余）

// 复制符号
Math.copySign(3.0, -1.0);   // -3.0（将 -1 的符号复制到 3.0）
Math.copySign(-3.0, 1.0);   // 3.0

// 获取指数
Math.getExponent(8.0);   // 3（2^3 = 8）
Math.getExponent(1024.0); // 10

// 下一个浮点数
Math.nextAfter(1.0, 2.0);  // 比 1.0 大的下一个 double
Math.nextUp(1.0);          // 等价于 nextAfter(1.0, Double.POSITIVE_INFINITY)
Math.nextDown(1.0);        // 比 1.0 小的下一个 double

// 判断是否为 NaN 或无穷
Math.isNaN(Double.NaN);           // true
Math.isInfinite(Double.POSITIVE_INFINITY);  // true
Math.isFinite(3.14);              // true（Java 8+）
```

## Math vs StrictMath

| 特性     | Math                 | StrictMath         |
| -------- | -------------------- | ------------------ |
| 性能     | 可能更快（平台相关） | 跨平台一致         |
| 精度     | 平台相关             | 严格遵循算法       |
| 适用场景 | 一般计算             | 需要跨平台一致结果 |

> **建议**：一般场景使用 `Math`，需要跨平台一致结果时使用 `StrictMath`。

---

## 参考

- [Java 官方文档 - Math](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Math.html)
