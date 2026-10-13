# Stream 介绍

## 什么是 Stream

Stream（流）是 Java 8 引入的用于处理集合数据的**高级抽象层**。它提供了一种声明式的方式来处理数据集合，使开发者能够以类似 SQL 查询的方式对数据进行过滤、映射、排序、聚合等操作。

Stream 不是数据结构，不存储数据，而是**对集合（Collection）功能的增强**，专注于数据的计算和操作。

```java
// 传统方式：使用 for 循环处理数据
List<String> result = new ArrayList<>();
for (String name : names) {
    if (name.length() > 3) {
        result.add(name.toUpperCase());
    }
}

// Stream 方式：声明式处理
List<String> result = names.stream()
    .filter(name -> name.length() > 3)  // 过滤
    .map(String::toUpperCase)            // 转换
    .collect(Collectors.toList());       // 收集结果
```

## Stream 的核心特征

### 1. 不存储数据

Stream 本身不存储数据，也不会修改源数据。它只是数据的**管道**，数据从源（如集合、数组）流入，经过一系列操作后流出。

```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
// Stream 不会修改 names 列表
Stream<String> stream = names.stream();
// names 保持不变
```

### 2. 函数式编程风格

Stream 的操作接受函数式接口（如 Lambda 表达式或方法引用）作为参数，体现了函数式编程的思想。

```java
// 使用 Lambda 表达式
names.stream()
    .filter(name -> name.startsWith("A"))
    .forEach(System.out::println);
```

### 3. 延迟执行（Lazy Evaluation）

Stream 的中间操作（如 `filter`、`map`）不会立即执行，而是等到**终端操作**（如 `collect`、`forEach`）调用时才真正执行。这种机制可以优化性能，避免不必要的计算。

```java
List<String> result = names.stream()
    .filter(name -> {
        System.out.println("filter: " + name); // 延迟执行，只在 collect 时打印
        return name.length() > 3;
    })
    .map(name -> {
        System.out.println("map: " + name);    // 延迟执行
        return name.toUpperCase();
    })
    .collect(Collectors.toList()); // 终端操作触发执行
```

### 4. 可消费性

Stream 只能被消费一次。一旦对 Stream 执行了终端操作，该 Stream 就被关闭，不能再被使用。如果需要再次处理，必须重新创建 Stream。

```java
Stream<String> stream = names.stream();
stream.filter(n -> n.length() > 3).count(); // 第一次消费

// 错误：stream 已经被关闭，不能再使用
// stream.forEach(System.out::println); // 抛出 IllegalStateException

// 正确：重新创建 Stream
names.stream().forEach(System.out::println);
```

## Stream 的操作分类

Stream 的操作分为两类：**中间操作**（Intermediate Operations）和**终端操作**（Terminal Operations）。

### 中间操作

中间操作返回一个新的 Stream，可以链式调用。中间操作是**延迟的**，不会立即执行。

| 操作       | 说明               | 示例                                                                          |
| ---------- | ------------------ | ----------------------------------------------------------------------------- |
| `filter`   | 过滤元素           | `stream.filter(n -> n > 0)`                                                   |
| `map`      | 转换元素           | `stream.map(String::length)`                                                  |
| `flatMap`  | 扁平化转换         | `stream.map(s -> Arrays.asList(s.split(" "))).flatMap(list -> list.stream())` |
| `sorted`   | 排序               | `stream.sorted()`                                                             |
| `distinct` | 去重               | `stream.distinct()`                                                           |
| `limit`    | 限制数量           | `stream.limit(10)`                                                            |
| `skip`     | 跳过元素           | `stream.skip(5)`                                                              |
| `peek`     | 查看元素（调试用） | `stream.peek(System.out::println)`                                            |

### 终端操作

终端操作触发 Stream 的实际执行，返回一个结果或产生副作用。执行后 Stream 被关闭。

| 操作        | 说明             | 示例                                  |
| ----------- | ---------------- | ------------------------------------- |
| `forEach`   | 遍历每个元素     | `stream.forEach(System.out::println)` |
| `collect`   | 收集结果为集合   | `stream.collect(Collectors.toList())` |
| `count`     | 计数             | `stream.count()`                      |
| `reduce`    | 归约             | `stream.reduce(0, Integer::sum)`      |
| `findFirst` | 获取第一个元素   | `stream.findFirst()`                  |
| `findAny`   | 获取任意一个元素 | `stream.findAny()`                    |
| `anyMatch`  | 是否任一匹配     | `stream.anyMatch(n -> n > 0)`         |
| `allMatch`  | 是否全部匹配     | `stream.allMatch(n -> n > 0)`         |
| `noneMatch` | 是否全部不匹配   | `stream.noneMatch(n -> n > 0)`        |
| `min`       | 最小值           | `stream.min(Integer::compareTo)`      |
| `max`       | 最大值           | `stream.max(Integer::compareTo)`      |

## Stream 管道（Pipeline）

Stream 的典型使用模式是构建一个**管道**：源 → 中间操作链 → 终端操作。

```java
List<String> result = names.stream()      // 源
    .filter(n -> n.length() > 3)          // 中间操作：过滤
    .map(String::toUpperCase)             // 中间操作：转换
    .sorted()                             // 中间操作：排序
    .collect(Collectors.toList());        // 终端操作：收集
```

### 管道的执行过程

虽然代码看起来是从上到下依次执行，但实际上：

1. **构建阶段**：中间操作只是记录到管道中，不执行任何操作
2. **执行阶段**：终端操作触发整个管道的执行
3. **短路优化**：某些操作（如 `limit`、`findFirst`）可以在满足条件后提前终止

```java
// 即使有 1000 个元素，limit(5) 后只会处理前 5 个
List<String> result = names.stream()
    .filter(n -> {
        System.out.println("filter: " + n);
        return n.length() > 3;
    })
    .limit(5)  // 短路操作，满足 5 个后停止
    .collect(Collectors.toList());
```

## Stream vs 集合

| 对比维度 | 集合（Collection）       | 流（Stream）             |
| -------- | ------------------------ | ------------------------ |
| 数据存储 | 存储元素，有大小         | 不存储元素，不修改源     |
| 修改性   | 可以添加、删除、修改元素 | 不修改源数据，返回新结果 |
| 消费次数 | 可以多次遍历             | 只能消费一次             |
| 执行方式 | 立即执行（Eager）        | 延迟执行（Lazy）         |
| 访问方式 | 通过索引或迭代器逐个访问 | 通过函数式操作声明式处理 |
| 并行处理 | 需要手动实现多线程       | 内置并行流支持           |
| 适用场景 | 数据的存储和管理         | 数据的计算和处理         |

## 并行流（Parallel Stream）

Stream 支持并行处理，利用多核 CPU 加速计算。通过 `parallelStream()` 或 `parallel()` 创建并行流。

```java
// 顺序流
List<String> result = names.stream()
    .filter(n -> n.length() > 3)
    .collect(Collectors.toList());

// 并行流（自动利用多核）
List<String> result = names.parallelStream()
    .filter(n -> n.length() > 3)
    .collect(Collectors.toList());
```

### 并行流的注意事项

- **线程安全**：并行流中的操作应该是线程安全的，避免修改共享状态
- **性能权衡**：数据量小时，并行流的线程切换开销可能大于收益
- **顺序敏感操作**：某些操作（如 `limit`、`findFirst`）在并行流中结果不确定
- **适合场景**：数据量大、无状态操作、CPU 密集型任务

```java
// 不推荐：修改共享状态（线程不安全）
List<String> result = new ArrayList<>();
names.parallelStream().forEach(result::add); // 可能抛出 ConcurrentModificationException

// 推荐：使用 collect 收集结果
List<String> result = names.parallelStream()
    .filter(n -> n.length() > 3)
    .collect(Collectors.toList());
```

## 常见使用场景

### 1. 数据过滤与转换

```java
// 过滤出年龄大于 18 的用户，并提取姓名
List<String> adultNames = users.stream()
    .filter(u -> u.getAge() > 18)
    .map(User::getName)
    .collect(Collectors.toList());
```

### 2. 数据聚合

```java
// 计算所有订单的总金额
double total = orders.stream()
    .mapToDouble(Order::getAmount)
    .sum();

// 统计用户数量
long count = users.stream().count();
```

### 3. 数据分组

```java
// 按部门分组
Map<String, List<Employee>> byDept = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment));
```

### 4. 数据查找

```java
// 找到第一个年龄大于 30 的用户
Optional<User> user = users.stream()
    .filter(u -> u.getAge() > 30)
    .findFirst();

// 检查是否所有用户都已成年
boolean allAdults = users.stream()
    .allMatch(u -> u.getAge() >= 18);
```

## 总结

Stream 是 Java 函数式编程的核心组件：

- **声明式**：以"做什么"而非"怎么做"的方式处理数据
- **链式调用**：中间操作可链式组合，代码简洁可读
- **延迟执行**：优化性能，避免不必要的计算
- **并行支持**：内置并行流，轻松利用多核 CPU
- **不修改源**：函数式风格，不产生副作用

Stream 与 Lambda 表达式、函数式接口、方法引用共同构成了 Java 函数式编程的完整体系。
