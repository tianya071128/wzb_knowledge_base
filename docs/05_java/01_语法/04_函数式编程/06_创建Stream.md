# 创建 Stream

## 概述

创建 Stream 是使用 Stream API 的第一步。Java 提供了多种方式来创建 Stream，包括从集合、数组、单个值、文件、甚至无限序列。不同的创建方式适用于不同的场景。

## 从集合创建

最常见的方式是从集合（Collection）创建 Stream。Java 8 在 `Collection` 接口中新增了 `stream()` 和 `parallelStream()` 两个默认方法。

### 顺序流

```java
List<String> list = Arrays.asList("Alice", "Bob", "Charlie");

// 创建顺序流
Stream<String> stream = list.stream();

stream.forEach(System.out::println);
```

### 并行流

```java
List<String> list = Arrays.asList("Alice", "Bob", "Charlie");

// 创建并行流（利用多核 CPU 加速处理）
Stream<String> parallelStream = list.parallelStream();

parallelStream.forEach(System.out::println);
```

### Set 和 Queue 创建 Stream

```java
// Set
Set<String> set = new HashSet<>(Arrays.asList("Alice", "Bob", "Charlie"));
Stream<String> setStream = set.stream();

// Queue
Queue<String> queue = new LinkedList<>(Arrays.asList("Alice", "Bob", "Charlie"));
Stream<String> queueStream = queue.stream();
```

## 从数组创建

### Arrays.stream

`Arrays.stream()` 方法可以将数组转换为 Stream，支持指定范围。

```java
String[] array = {"Alice", "Bob", "Charlie"};

// 整个数组
Stream<String> stream = Arrays.stream(array);

// 指定范围（从索引 0 到 2，不包含 2）
Stream<String> subStream = Arrays.stream(array, 0, 2);
```

### Stream.of

`Stream.of()` 方法可以接受一个数组或可变参数。

```java
String[] array = {"Alice", "Bob", "Charlie"};

// 从数组创建
Stream<String> stream1 = Stream.of(array);

// 直接传入元素
Stream<String> stream2 = Stream.of("Alice", "Bob", "Charlie");
```

### Stream.empty

创建一个空 Stream。

```java
Stream<String> emptyStream = Stream.empty();
// 常用于条件判断：如果集合为空，返回空 Stream
Stream<String> stream = (list == null || list.isEmpty())
    ? Stream.empty()
    : list.stream();
```

## 基本类型流

为了避免自动装箱/拆箱的性能开销，Java 提供了专门的基本类型流：`IntStream`、`LongStream`、`DoubleStream`。

### IntStream

```java
// 范围（不包含结束值）
IntStream range = IntStream.range(1, 10); // 1 到 9

// 闭区间（包含结束值）
IntStream rangeClosed = IntStream.rangeClosed(1, 10); // 1 到 10

// 指定值
IntStream of = IntStream.of(1, 2, 3, 4, 5);

// 从数组创建
int[] array = {1, 2, 3, 4, 5};
IntStream fromArray = Arrays.stream(array);

// 生成
IntStream generate = IntStream.generate(() -> (int)(Math.random() * 100));

// 迭代
IntStream iterate = IntStream.iterate(0, n -> n + 2); // 0, 2, 4, 6...
```

### LongStream

```java
// 范围
LongStream range = LongStream.range(1L, 100L);
LongStream rangeClosed = LongStream.rangeClosed(1L, 100L);

// 指定值
LongStream of = LongStream.of(1L, 2L, 3L);

// 从数组创建
long[] array = {1L, 2L, 3L};
LongStream fromArray = Arrays.stream(array);
```

### DoubleStream

```java
// 指定值
DoubleStream of = DoubleStream.of(1.1, 2.2, 3.3);

// 从数组创建
double[] array = {1.1, 2.2, 3.3};
DoubleStream fromArray = Arrays.stream(array);

// 生成随机数
DoubleStream randoms = DoubleStream.generate(Math::random);
```

### 基本类型流与对象流的转换

```java
// 对象流 → 基本类型流
Stream<Integer> objectStream = Stream.of(1, 2, 3);
IntStream intStream = objectStream.mapToInt(Integer::intValue);

// 基本类型流 → 对象流
IntStream intStream = IntStream.of(1, 2, 3);
Stream<Integer> objectStream = intStream.boxed();
```

## 从单个值创建

### Stream.of

```java
// 单个元素
Stream<String> single = Stream.of("Alice");

// 多个元素
Stream<String> multiple = Stream.of("Alice", "Bob", "Charlie");
```

### Stream.ofNullable（Java 9+）

处理可能为 null 的值，避免空指针异常。

```java
String value = null;

// Java 8：需要手动判断
Stream<String> stream = (value == null) ? Stream.empty() : Stream.of(value);

// Java 9+：使用 ofNullable
Stream<String> stream = Stream.ofNullable(value); // 如果 value 为 null，返回空 Stream
```

## 从文件创建

`Files.lines()` 方法可以将文件的每一行作为 Stream 的一个元素。

```java
Path path = Paths.get("data.txt");

// 读取文件的每一行
try (Stream<String> lines = Files.lines(path)) {
    lines.forEach(System.out::println);
}

// 指定字符集
try (Stream<String> lines = Files.lines(path, StandardCharsets.UTF_8)) {
    List<String> nonEmptyLines = lines
        .filter(line -> !line.trim().isEmpty())
        .collect(Collectors.toList());
}
```

> **注意**：`Files.lines()` 返回的 Stream 实现了 `AutoCloseable`，必须使用 try-with-resources 确保正确关闭。

## 从迭代器创建

### Stream.iterate

创建一个无限流，从种子值开始，每次应用函数生成下一个值。

```java
// 从 0 开始，每次加 2：0, 2, 4, 6, 8...
Stream<Integer> evenNumbers = Stream.iterate(0, n -> n + 2);

// 取前 10 个
evenNumbers.limit(10).forEach(System.out::println);
// 输出：0, 2, 4, 6, 8, 10, 12, 14, 16, 18
```

```java
// 斐波那契数列（Java 9+ 支持双参数 iterate）
Stream.iterate(
    new int[]{0, 1},           // 种子：[fib(0), fib(1)]
    fib -> new int[]{fib[1], fib[0] + fib[1]}, // 下一个：[fib(1), fib(0)+fib(1)]
    fib -> fib[0]              // 提取第一个值
).limit(10).forEach(fib -> System.out.print(fib + " "));
// 输出：0 1 1 2 3 5 8 13 21 34
```

### 带谓词的 iterate（Java 9+）

```java
// 当条件不满足时停止
Stream<Integer> bounded = Stream.iterate(0, n -> n < 100, n -> n + 5);
bounded.forEach(System.out::println);
// 输出：0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95
```

## 从生成器创建

### Stream.generate

使用 Supplier 生成无限流，每次调用 Supplier 生成一个元素。

```java
// 生成 10 个随机数
Stream<Double> randoms = Stream.generate(Math::random);
randoms.limit(10).forEach(System.out::println);
```

```java
// 生成固定值
Stream<String> constants = Stream.generate(() -> "Hello");
constants.limit(5).forEach(System.out::println);
// 输出：Hello, Hello, Hello, Hello, Hello
```

```java
// 生成对象
Stream<UUID> uuids = Stream.generate(UUID::randomUUID);
uuids.limit(3).forEach(System.out::println);
```

```java
// 使用 AtomicInteger 生成递增序列
AtomicInteger counter = new AtomicInteger(0);
Stream<Integer> sequence = Stream.generate(counter::getAndIncrement);
sequence.limit(5).forEach(System.out::println);
// 输出：0, 1, 2, 3, 4
```

## 使用 Builder 创建

`Stream.Builder` 允许手动构建 Stream，适合在运行时动态添加元素。

```java
Stream.Builder<String> builder = Stream.builder();

builder.add("Alice");
builder.add("Bob");
builder.add("Charlie");

Stream<String> stream = builder.build();
stream.forEach(System.out::println);
```

```java
// 条件性添加
Stream.Builder<Integer> builder = Stream.builder();
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        builder.add(i);
    }
}
builder.build().forEach(System.out::println);
// 输出：0, 2, 4, 6, 8
```

## 使用 concat 合并 Stream

`Stream.concat()` 方法可以将两个 Stream 合并为一个。

```java
Stream<String> stream1 = Stream.of("Alice", "Bob");
Stream<String> stream2 = Stream.of("Charlie", "David");

Stream<String> combined = Stream.concat(stream1, stream2);
combined.forEach(System.out::println);
// 输出：Alice, Bob, Charlie, David
```

```java
// 合并多个 Stream
Stream<String> result = Stream.of(
    Stream.of("A", "B"),
    Stream.of("C", "D"),
    Stream.of("E", "F")
).flatMap(s -> s);

result.forEach(System.out::println);
// 输出：A, B, C, D, E, F
```

## 使用 flatMap 扁平化创建

`flatMap` 可以将嵌套结构扁平化为单个 Stream。

```java
// 将句子列表转换为单词流
List<String> sentences = Arrays.asList(
    "Hello World",
    "Java Stream API",
    "Functional Programming"
);

Stream<String> words = sentences.stream()
    .flatMap(sentence -> Arrays.stream(sentence.split(" ")));

words.forEach(System.out::println);
// 输出：Hello, World, Java, Stream, API, Functional, Programming
```

```java
// 将 Map 的键值对转换为 Stream
Map<String, Integer> scores = Map.of(
    "Alice", 90,
    "Bob", 85,
    "Charlie", 92
);

Stream<String> entries = scores.entrySet().stream()
    .map(entry -> entry.getKey() + ": " + entry.getValue());

entries.forEach(System.out::println);
// 输出：Alice: 90, Bob: 85, Charlie: 92
```

## 自定义 Spliterator 创建

对于复杂的数据源，可以实现自定义的 `Spliterator` 来创建 Stream。

```java
// 自定义 Spliterator 遍历二叉树
public class TreeStream {
    public static <T> Stream<T> stream(TreeNode<T> root) {
        return StreamSupport.stream(
            new TreeSpliterator<>(root), false);
    }

    private static class TreeSpliterator<T>
        extends Spliterators.AbstractSpliterator<T> {

        private Deque<TreeNode<T>> stack = new ArrayDeque<>();

        TreeSpliterator(TreeNode<T> root) {
            super(Long.MAX_VALUE, Spliterator.ORDERED);
            if (root != null) stack.push(root);
        }

        @Override
        public boolean tryAdvance(Consumer<? super T> action) {
            if (stack.isEmpty()) return false;
            TreeNode<T> node = stack.pop();
            action.accept(node.value);
            if (node.right != null) stack.push(node.right);
            if (node.left != null) stack.push(node.left);
            return true;
        }
    }
}
```

## 创建方式对比

| 创建方式              | 适用场景                     | 是否无限流 |
| --------------------- | ---------------------------- | ---------- |
| `Collection.stream()` | 从集合创建                   | 否         |
| `Arrays.stream()`     | 从数组创建                   | 否         |
| `Stream.of()`         | 从单个值或多个值创建         | 否         |
| `Stream.empty()`      | 创建空 Stream                | 否         |
| `Stream.iterate()`    | 生成序列（如斐波那契、递增） | 是         |
| `Stream.generate()`   | 生成随机值或固定值           | 是         |
| `Files.lines()`       | 读取文件                     | 否         |
| `Stream.builder()`    | 动态构建                     | 否         |
| `Stream.concat()`     | 合并多个 Stream              | 否         |
| 自定义 Spliterator    | 复杂数据源（如树、图）       | 视实现而定 |

## 最佳实践

### 1. 优先使用集合的 stream()

```java
// 推荐
List<String> list = Arrays.asList("Alice", "Bob");
Stream<String> stream = list.stream();

// 不推荐：手动转换
Stream<String> stream = Stream.of("Alice", "Bob");
```

### 2. 基本类型使用特化流

```java
// 推荐：避免装箱
IntStream intStream = IntStream.range(1, 100);

// 不推荐：自动装箱
Stream<Integer> objectStream = Stream.iterate(1, n -> n + 1);
```

### 3. 无限流必须限制大小

```java
// 正确：使用 limit 限制
Stream.iterate(0, n -> n + 1)
    .limit(100)
    .forEach(System.out::println);

// 错误：无限流不限制，会导致内存溢出
// Stream.iterate(0, n -> n + 1).forEach(System.out::println);
```

### 4. 文件流使用 try-with-resources

```java
// 正确：自动关闭
try (Stream<String> lines = Files.lines(path)) {
    lines.forEach(System.out::println);
}

// 错误：未关闭，可能导致资源泄露
Stream<String> lines = Files.lines(path);
lines.forEach(System.out::println);
```

## 总结

Java 提供了丰富的 Stream 创建方式：

- **集合/数组**：最常用的方式，使用 `stream()` 或 `Arrays.stream()`
- **基本类型流**：IntStream、LongStream、DoubleStream，避免装箱开销
- **单值/多值**：`Stream.of()`、`Stream.ofNullable()`
- **无限流**：`Stream.iterate()`、`Stream.generate()`，必须配合 `limit()` 使用
- **文件**：`Files.lines()`，注意使用 try-with-resources 关闭
- **动态构建**：`Stream.Builder` 手动添加元素
- **合并**：`Stream.concat()` 合并多个 Stream
- **扁平化**：`flatMap()` 处理嵌套结构
- **自定义**：实现 `Spliterator` 处理复杂数据源
