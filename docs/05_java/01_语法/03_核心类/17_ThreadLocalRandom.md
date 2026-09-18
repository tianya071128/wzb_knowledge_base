# ThreadLocalRandom：多线程伪随机数

`java.util.concurrent.ThreadLocalRandom` 是 Java 7 引入的随机数生成器，专为多线程环境设计。

## 特点

- **线程本地**：每个线程有独立的随机数生成器，避免竞争
- **高性能**：比 `Random` 在多线程环境下快得多
- **伪随机**：使用算法生成，不是真正的随机
- **不可创建实例**：只能通过 `current()` 获取实例

## 获取实例

```java
// 获取当前线程的 ThreadLocalRandom 实例
ThreadLocalRandom random = ThreadLocalRandom.current();

// 注意：不能通过 new 创建
// new ThreadLocalRandom();  // 编译错误
```

## 常用方法

### 生成整数

```java
ThreadLocalRandom random = ThreadLocalRandom.current();

// 生成任意 int 值
random.nextInt();

// 生成 [0, bound) 范围的随机整数
random.nextInt(100);     // 0-99

// 生成 [origin, bound) 范围的随机整数（Java 8+）
random.nextInt(10, 20);  // 10-19

// 生成长整数
random.nextLong();
random.nextLong(100);    // 0-99
random.nextLong(10, 20); // 10-19
```

### 生成浮点数

```java
ThreadLocalRandom random = ThreadLocalRandom.current();

// 生成 [0.0, 1.0) 范围的随机浮点数
random.nextFloat();

// 生成 [0.0, 1.0) 范围的随机双精度数
random.nextDouble();

// 生成 [0.0, bound) 范围的随机双精度数（Java 17+）
random.nextDouble(5.0);

// 生成 [origin, bound) 范围的随机双精度数（Java 17+）
random.nextDouble(1.0, 10.0);
```

### 生成布尔值

```java
ThreadLocalRandom random = ThreadLocalRandom.current();

// 生成随机布尔值
random.nextBoolean();
```

### 生成高斯分布

```java
ThreadLocalRandom random = ThreadLocalRandom.current();

// 生成均值为 0，标准差为 1 的高斯分布随机数
random.nextGaussian();
```

### 生成流（Java 8+）

```java
ThreadLocalRandom random = ThreadLocalRandom.current();

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

random.doubles(5, 0.0, 10.0)       // 5 个 [0.0, 10.0) 的随机 double
      .forEach(System.out::println);
```

## 实际应用示例

### 多线程环境下的随机数

```java
// 使用 ThreadLocalRandom（推荐）
ExecutorService executor = Executors.newFixedThreadPool(10);
for (int i = 0; i < 100; i++) {
    executor.submit(() -> {
        // 每个线程有自己的随机数生成器，无竞争
        int random = ThreadLocalRandom.current().nextInt(100);
        System.out.println(Thread.currentThread().getName() + ": " + random);
    });
}

// 使用 Random（不推荐，多线程竞争）
Random sharedRandom = new Random();
executor.submit(() -> {
    int random = sharedRandom.nextInt(100);  // 多线程竞争，性能差
});
```

### 生成指定范围的随机数

```java
// 生成 [min, max] 范围的随机整数
public static int randomInt(int min, int max) {
    return ThreadLocalRandom.current().nextInt(min, max + 1);
}

randomInt(1, 100);  // 1-100 的随机整数

// 生成指定范围的随机小数
public static double randomDouble(double min, double max) {
    return ThreadLocalRandom.current().nextDouble(min, max);
}

randomDouble(1.0, 10.0);  // 1.0-10.0 的随机小数
```

### 并行流中使用

```java
// 在并行流中生成随机数
List<Integer> randomNumbers = IntStream.range(0, 100)
    .parallel()
    .map(i -> ThreadLocalRandom.current().nextInt(100))
    .boxed()
    .toList();
```

## ThreadLocalRandom vs Random

| 特性     | ThreadLocalRandom | Random                 |
| -------- | ----------------- | ---------------------- |
| 线程安全 | 是（每线程独立）  | 是（但多线程竞争）     |
| 性能     | 快（无竞争）      | 多线程下慢（CAS 竞争） |
| 创建方式 | `current()`       | `new Random()`         |
| 可重现性 | 不支持种子        | 支持种子               |
| 适用场景 | 多线程            | 单线程                 |

```java
// 性能对比（多线程环境）
// ThreadLocalRandom：无竞争，性能高
int r1 = ThreadLocalRandom.current().nextInt(100);

// Random：多线程下 CAS 竞争，性能低
Random random = new Random();
int r2 = random.nextInt(100);
```

> **建议**：多线程环境下优先使用 `ThreadLocalRandom`。

---

## 参考

- [Java 官方文档 - ThreadLocalRandom](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/ThreadLocalRandom.html)
