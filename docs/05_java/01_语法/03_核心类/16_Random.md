# Random：伪随机数

`java.util.Random` 是 Java 中的伪随机数生成器，基于线性同余算法生成随机数序列。

## 特点

- **伪随机**：使用算法生成，不是真正的随机
- **可重现**：使用相同种子会生成相同的随机数序列
- **线程安全**：多线程环境下性能较差
- **均匀分布**：生成的随机数在指定范围内均匀分布
- **会重复**: 就算范围很大，长期生成也会出现重复，只是概率低。

## 创建 Random

```java
// 使用当前时间作为种子（每次运行结果不同）
Random random1 = new Random();

// 指定种子（相同种子产生相同序列）
Random random2 = new Random(12345L);

// Java 8+ 使用种子创建
Random random3 = new Random(12345L);
```

## 常用方法

### 生成整数

```java
Random random = new Random();

// 生成任意 int 值（正负都有可能）
random.nextInt();

// 生成 [0, bound) 范围的随机整数
random.nextInt(100);     // 0-99

// 生成 [min, max] 范围的随机整数
int min = 10, max = 20;
int result = random.nextInt(max - min + 1) + min;  // 10-20
```

### 生成浮点数

```java
Random random = new Random();

// 生成 [0.0, 1.0) 范围的随机浮点数
random.nextFloat();      // 例如：0.7234567

// 生成 [0.0, 1.0) 范围的随机双精度数
random.nextDouble();     // 例如：0.7234567890123456

// 生成 [0.0, 1.0) 范围的随机双精度数（Java 17+）
random.nextDouble(2.0);  // [0.0, 2.0)
random.nextDouble(1.0, 5.0);  // [1.0, 5.0)
```

### 生成布尔值

```java
Random random = new Random();

// 生成随机布尔值（50% 概率）
random.nextBoolean();    // true 或 false
```

### 生成字节数组

```java
Random random = new Random();

// 填充随机字节
byte[] bytes = new byte[16];
random.nextBytes(bytes);
```

### 生成高斯分布

```java
Random random = new Random();

// 生成均值为 0，标准差为 1 的高斯分布随机数
random.nextGaussian();   // 例如：0.3456789

// 生成指定均值和标准差的高斯分布
double mean = 100;
double stdDev = 15;
double value = mean + stdDev * random.nextGaussian();
```

### 生成流（Java 8+）

```java
Random random = new Random();

// 生成整数流
random.ints(10)                    // 10 个随机 int
      .forEach(System.out::println);

random.ints(10, 0, 100)            // 10 个 [0, 100) 的随机 int
      .forEach(System.out::println);

// 生成长整数流
random.longs(5)                    // 5 个随机 long
      .forEach(System.out::println);

// 生成浮点数流
random.doubles(5)                  // 5 个随机 double
      .forEach(System.out::println);

random.doubles(5, 0.0, 1.0)        // 5 个 [0.0, 1.0) 的随机 double
      .forEach(System.out::println);
```

## 种子的作用

```java
// 相同种子产生相同序列
Random r1 = new Random(12345);
Random r2 = new Random(12345);

System.out.println(r1.nextInt(100));  // 例如：45
System.out.println(r2.nextInt(100));  // 45（相同）

// 重置种子
r1.setSeed(12345);
System.out.println(r1.nextInt(100));  // 45（与之前相同）
```

## 实际应用示例

### 生成验证码

```java
public static String generateCode(int length) {
    Random random = new Random();
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < length; i++) {
        sb.append(random.nextInt(10));  // 0-9 的数字
    }
    return sb.toString();
}

generateCode(6);  // 例如："385729"
```

### 随机抽取元素

```java
public static <T> T randomElement(List<T> list) {
    if (list == null || list.isEmpty()) {
        throw new IllegalArgumentException("List is empty");
    }
    Random random = new Random();
    return list.get(random.nextInt(list.size()));
}

List<String> names = List.of("Alice", "Bob", "Charlie", "David");
randomElement(names);  // 随机返回其中一个
```

### 洗牌算法

```java
public static <T> void shuffle(List<T> list) {
    Random random = new Random();
    for (int i = list.size() - 1; i > 0; i--) {
        int j = random.nextInt(i + 1);
        T temp = list.get(i);
        list.set(i, list.get(j));
        list.set(j, temp);
    }
}

List<Integer> cards = new ArrayList<>(IntStream.range(1, 53).boxed().toList());
shuffle(cards);  // 随机打乱顺序
```

### 生成指定范围的随机小数

```java
// 生成 [min, max) 范围的随机小数
public static double randomDouble(double min, double max) {
    Random random = new Random();
    return min + (max - min) * random.nextDouble();
}

randomDouble(1.0, 10.0);  // 1.0 到 10.0 之间的随机小数
```

## Random vs ThreadLocalRandom vs SecureRandom

| 类                  | 线程安全           | 性能 | 安全性     | 适用场景     |
| ------------------- | ------------------ | ---- | ---------- | ------------ |
| `Random`            | 是（但多线程竞争） | 一般 | 伪随机     | 单线程       |
| `ThreadLocalRandom` | 是（每线程独立）   | 快   | 伪随机     | 多线程       |
| `SecureRandom`      | 是                 | 慢   | 密码学安全 | 安全敏感场景 |

```java
// ThreadLocalRandom（推荐用于多线程）
ThreadLocalRandom.current().nextInt(100);
ThreadLocalRandom.current().nextDouble(1.0, 10.0);

// SecureRandom（密码学安全）
SecureRandom secureRandom = new SecureRandom();
secureRandom.nextInt(100);
```

> **建议**：
>
> - 单线程使用 `Random`
> - 多线程使用 `ThreadLocalRandom`
> - 安全敏感场景（如生成密钥、令牌）使用 `SecureRandom`

---

## 参考

- [Java 官方文档 - Random](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Random.html)
