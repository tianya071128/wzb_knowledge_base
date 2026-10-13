# Collectors：Stream 收集器

`java.util.stream.Collectors` 是 Stream API 的收集器工具类，提供了大量将 Stream 元素收集到各种数据结构中的静态方法。Collectors 通常与 Stream 的 `collect` 终端操作配合使用。

## 特点

- **工具类**：所有方法都是静态方法
- **Stream 终端操作**：用于将 Stream 元素收集到集合或其他数据结构中
- **不可实例化**：构造器是私有的
- **与 Stream 配合**：必须通过 `Stream.collect()` 方法使用

## 收集为集合

### toList

将 Stream 元素收集到一个 `List` 中。

```java
// 方法签名
static <T> Collector<T, ?, List<T>> toList()
```

**参数说明：**

- 泛型 `<T>`：Stream 中元素的类型
- 返回类型：`Collector<T, ?, List<T>>`，表示将类型为 `T` 的元素收集为 `List<T>`

```java
// 基本用法
List<String> result = Stream.of("Alice", "Bob", "Charlie")
    .collect(Collectors.toList());
// 结果：["Alice", "Bob", "Charlie"]

// 配合过滤
List<Integer> evens = Stream.of(1, 2, 3, 4, 5, 6)
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
// 结果：[2, 4, 6]

// 配合转换
List<String> uppers = Stream.of("alice", "bob")
    .map(String::toUpperCase)
    .collect(Collectors.toList());
// 结果：["ALICE", "BOB"]

// Java 16+ 简化写法
List<String> result = Stream.of("Alice", "Bob")
    .toList();  // 返回不可变 List
```

### toSet

将 Stream 元素收集到一个 `Set` 中，自动去重。

```java
// 方法签名
static <T> Collector<T, ?, Set<T>> toSet()
```

**参数说明：**

- 泛型 `<T>`：Stream 中元素的类型
- 返回类型：`Collector<T, ?, Set<T>>`，表示将类型为 `T` 的元素收集为 `Set<T>`

```java
// 基本用法（自动去重）
Set<String> result = Stream.of("Alice", "Bob", "Alice", "Charlie")
    .collect(Collectors.toSet());
// 结果：{"Alice", "Bob", "Charlie"}

// 配合过滤
Set<Integer> uniqueEvens = Stream.of(1, 2, 2, 3, 4, 4, 5)
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toSet());
// 结果：{2, 4}

// 配合转换
Set<Integer> lengths = Stream.of("Alice", "Bob", "Charlie")
    .map(String::length)
    .collect(Collectors.toSet());
// 结果：{5, 3, 7}
```

### toCollection

将 Stream 元素收集到指定的集合类型中。

```java
// 方法签名
static <T, C extends Collection<T>> Collector<T, ?, C> toCollection(Supplier<C> collectionFactory)
```

**参数说明：**

- `<T>`：Stream 中元素的类型
- `<C>`：目标集合的类型
- `collectionFactory`：创建目标集合实例的工厂方法

```java
// 收集为 LinkedList
LinkedList<String> linkedList = Stream.of("Alice", "Bob", "Charlie")
    .collect(Collectors.toCollection(LinkedList::new));

// 收集为 TreeSet（自动排序）
TreeSet<String> treeSet = Stream.of("Charlie", "Alice", "Bob")
    .collect(Collectors.toCollection(TreeSet::new));
// 结果：["Alice", "Bob", "Charlie"]（已排序）

// 收集为 LinkedHashSet（保持插入顺序）
LinkedHashSet<String> linkedHashSet = Stream.of("Alice", "Bob", "Alice")
    .collect(Collectors.toCollection(LinkedHashSet::new));
// 结果：["Alice", "Bob"]（去重且保持顺序）
```

## 收集为 Map

### toMap

将 Stream 元素收集到一个 `Map` 中，需要指定键和值的映射函数。

```java
// 方法签名（基础版）
static <T, K, U> Collector<T, ?, Map<K, U>> toMap(
    Function<? super T, ? extends K> keyMapper,
    Function<? super T, ? extends U> valueMapper
)

// 方法签名（带冲突处理）
static <T, K, U> Collector<T, ?, Map<K, U>> toMap(
    Function<? super T, ? extends K> keyMapper,
    Function<? super T, ? extends U> valueMapper,
    BinaryOperator<U> mergeFunction
)

// 方法签名（带冲突处理和 Map 工厂）
static <T, K, U, M extends Map<K, U>> Collector<T, ?, M> toMap(
    Function<? super T, ? extends K> keyMapper,
    Function<? super T, ? extends U> valueMapper,
    BinaryOperator<U> mergeFunction,
    Supplier<M> mapSupplier
)
```

**参数说明：**

- `<T>`：Stream 中元素的类型
- `<K>`：Map 键的类型
- `<U>`：Map 值的类型
- `keyMapper`：从元素 `T` 提取键 `K` 的函数
- `valueMapper`：从元素 `T` 提取值 `U` 的函数
- `mergeFunction`：当键冲突时，合并两个值 `U` 的函数
- `mapSupplier`：创建 Map 实例的工厂（如 `HashMap::new`、`TreeMap::new`）

```java
// 基础用法：对象转 Map
List<User> users = List.of(
    new User("Alice", 20),
    new User("Bob", 25),
    new User("Charlie", 30)
);

// 姓名 -> 年龄
Map<String, Integer> nameToAge = users.stream()
    .collect(Collectors.toMap(User::getName, User::getAge));
// 结果：{Alice=20, Bob=25, Charlie=30}

// 姓名 -> 用户对象
Map<String, User> userMap = users.stream()
    .collect(Collectors.toMap(User::getName, user -> user));
// 等价写法
Map<String, User> userMap = users.stream()
    .collect(Collectors.toMap(User::getName, Function.identity()));

// 处理键冲突（保留第一个）
Map<String, User> uniqueUsers = users.stream()
    .collect(Collectors.toMap(
        User::getName,
        user -> user,
        (existing, replacement) -> existing  // 冲突时保留第一个
    ));

// 处理键冲突（保留最后一个）
Map<String, Integer> latestScores = Stream.of(
    new Score("Alice", 80),
    new Score("Bob", 90),
    new Score("Alice", 85)  // Alice 有两次成绩
).collect(Collectors.toMap(
    Score::getName,
    Score::getScore,
    (oldScore, newScore) -> newScore  // 冲突时保留最新的
));
// 结果：{Alice=85, Bob=90}

// 指定 Map 类型（TreeMap 自动排序）
TreeMap<String, Integer> sortedMap = users.stream()
    .collect(Collectors.toMap(
        User::getName,
        User::getAge,
        (a, b) -> a,
        TreeMap::new
    ));

// 字符串列表转 Map（索引作为键）
List<String> names = List.of("Alice", "Bob", "Charlie");
Map<Integer, String> indexToName = IntStream.range(0, names.size())
    .boxed()
    .collect(Collectors.toMap(i -> i, names::get));
// 结果：{0=Alice, 1=Bob, 2=Charlie}
```

## 不可变集合（Java 10+）

### toUnmodifiableList

创建不可变 List，任何修改操作都会抛出 `UnsupportedOperationException`。

```java
// 方法签名
static <T> Collector<T, ?, List<T>> toUnmodifiableList()
```

```java
List<String> list = Stream.of("A", "B", "C")
    .collect(Collectors.toUnmodifiableList());
// list.add("D");  // UnsupportedOperationException
```

### toUnmodifiableSet

创建不可变 Set，自动去重。

```java
// 方法签名
static <T> Collector<T, ?, Set<T>> toUnmodifiableSet()
```

```java
Set<String> set = Stream.of("A", "B", "A")
    .collect(Collectors.toUnmodifiableSet());
// 结果：{"A", "B"}
```

### toUnmodifiableMap

创建不可变 Map。

```java
// 方法签名
static <T, K, U> Collector<T, ?, Map<K, U>> toUnmodifiableMap(
    Function<? super T, ? extends K> keyMapper,
    Function<? super T, ? extends U> valueMapper
)
```

```java
Map<String, Integer> map = Stream.of(
    new User("Alice", 20),
    new User("Bob", 25)
).collect(Collectors.toUnmodifiableMap(User::getName, User::getAge));
```

## 字符串操作

### joining

将 Stream 中的字符串元素连接成一个字符串。

```java
// 方法签名
static Collector<CharSequence, ?, String> joining(CharSequence delimiter)
static Collector<CharSequence, ?, String> joining(
    CharSequence delimiter,
    CharSequence prefix,
    CharSequence suffix
)
```

**参数说明：**

- `delimiter`：分隔符
- `prefix`：前缀（可选）
- `suffix`：后缀（可选）

```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

// 基本连接
String joined = names.stream()
    .collect(Collectors.joining(", "));
// 结果："Alice, Bob, Charlie"

// 带前缀和后缀
String formatted = names.stream()
    .collect(Collectors.joining(", ", "[", "]"));
// 结果："[Alice, Bob, Charlie]"

// 配合转换
String result = Stream.of("alice", "bob")
    .map(String::toUpperCase)
    .collect(Collectors.joining(", "));
// 结果："ALICE, BOB"
```

## 统计操作

### counting

计算 Stream 中元素的数量。

```java
// 方法签名
static <T> Collector<T, ?, Long> counting()
```

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

long count = numbers.stream()
    .collect(Collectors.counting());
// 结果：5

// 等价写法
long count = numbers.stream().count();
```

### summingInt / summingLong / summingDouble

对 Stream 中的元素求和。

```java
// 方法签名
static <T> Collector<T, ?, Integer> summingInt(ToIntFunction<? super T> mapper)
static <T> Collector<T, ?, Long> summingLong(ToLongFunction<? super T> mapper)
static <T> Collector<T, ?, Double> summingDouble(ToDoubleFunction<? super T> mapper)
```

```java
List<User> users = Arrays.asList(
    new User("Alice", 20),
    new User("Bob", 25),
    new User("Charlie", 30)
);

// 求和
int totalAge = users.stream()
    .collect(Collectors.summingInt(User::getAge));
// 结果：75
```

### averagingInt / averagingLong / averagingDouble

计算 Stream 中元素的平均值。

```java
// 方法签名
static <T> Collector<T, ?, Double> averagingInt(ToIntFunction<? super T> mapper)
static <T> Collector<T, ?, Double> averagingLong(ToLongFunction<? super T> mapper)
static <T> Collector<T, ?, Double> averagingDouble(ToDoubleFunction<? super T> mapper)
```

```java
List<User> users = Arrays.asList(
    new User("Alice", 20),
    new User("Bob", 25),
    new User("Charlie", 30)
);

// 平均值
double avgAge = users.stream()
    .collect(Collectors.averagingInt(User::getAge));
// 结果：25.0
```

### maxBy / minBy

查找 Stream 中的最大值或最小值。

```java
// 方法签名
static <T> Collector<T, ?, Optional<T>> maxBy(Comparator<? super T> comparator)
static <T> Collector<T, ?, Optional<T>> minBy(Comparator<? super T> comparator)
```

```java
List<User> users = Arrays.asList(
    new User("Alice", 20),
    new User("Bob", 25),
    new User("Charlie", 30)
);

// 年龄最大的用户
Optional<User> oldest = users.stream()
    .collect(Collectors.maxBy(Comparator.comparingInt(User::getAge)));
// 结果：Optional[Charlie, 30]

// 年龄最小的用户
Optional<User> youngest = users.stream()
    .collect(Collectors.minBy(Comparator.comparingInt(User::getAge)));
// 结果：Optional[Alice, 20]
```

## 分组和分区

### groupingBy

按某个属性对 Stream 元素进行分组。

```java
// 方法签名
static <T, K> Collector<T, ?, Map<K, List<T>>> groupingBy(
    Function<? super T, ? extends K> classifier
)

// 带下游收集器
static <T, K, A, D> Collector<T, ?, Map<K, D>> groupingBy(
    Function<? super T, ? extends K> classifier,
    Collector<? super T, A, D> downstream
)
```

**参数说明：**

- `<T>`：Stream 中元素的类型
- `<K>`：分组键的类型
- `classifier`：从元素提取分组键的函数
- `downstream`：对每个分组进行进一步处理的收集器（可选）

```java
List<User> users = Arrays.asList(
    new User("Alice", "Engineering"),
    new User("Bob", "Marketing"),
    new User("Charlie", "Engineering"),
    new User("David", "Marketing")
);

// 按部门分组
Map<String, List<User>> byDept = users.stream()
    .collect(Collectors.groupingBy(User::getDepartment));
// 结果：{Engineering=[Alice, Charlie], Marketing=[Bob, David]}

// 分组后计数
Map<String, Long> countByDept = users.stream()
    .collect(Collectors.groupingBy(
        User::getDepartment,
        Collectors.counting()
    ));
// 结果：{Engineering=2, Marketing=2}

// 多级分组
Map<String, Map<Integer, List<User>>> multiGroup = users.stream()
    .collect(Collectors.groupingBy(
        User::getDepartment,
        Collectors.groupingBy(User::getAge)
    ));
```

### partitioningBy

按条件将 Stream 元素分为两组（true 和 false）。

```java
// 方法签名
static <T> Collector<T, ?, Map<Boolean, List<T>>> partitioningBy(
    Predicate<? super T> predicate
)

// 带下游收集器
static <T, A, D> Collector<T, ?, Map<Boolean, D>> partitioningBy(
    Predicate<? super T> predicate,
    Collector<? super T, A, D> downstream
)
```

**参数说明：**

- `<T>`：Stream 中元素的类型
- `predicate`：分区条件
- `downstream`：对每个分区进行进一步处理的收集器（可选）

```java
List<User> users = Arrays.asList(
    new User("Alice", 20),
    new User("Bob", 25),
    new User("Charlie", 30),
    new User("David", 18)
);

// 按年龄是否大于 20 分区
Map<Boolean, List<User>> partitioned = users.stream()
    .collect(Collectors.partitioningBy(u -> u.getAge() > 20));
// 结果：{false=[Alice(20), David(18)], true=[Bob(25), Charlie(30)]}

// 分区后计数
Map<Boolean, Long> countPartitioned = users.stream()
    .collect(Collectors.partitioningBy(
        u -> u.getAge() > 20,
        Collectors.counting()
    ));
// 结果：{false=2, true=2}
```

## 方法速查表

| 操作                       | 方法签名                                                     | 说明                   |
| -------------------------- | ------------------------------------------------------------ | ---------------------- |
| **收集为集合**             |                                                              |                        |
| `toList`                   | `Collector<T, ?, List<T>> toList()`                          | 收集为 List            |
| `toSet`                    | `Collector<T, ?, Set<T>> toSet()`                            | 收集为 Set（自动去重） |
| `toCollection`             | `Collector<T, ?, C> toCollection(Supplier<C>)`               | 收集为指定集合类型     |
| **收集为 Map**             |                                                              |                        |
| `toMap`                    | `Collector<T, ?, Map<K,U>> toMap(...)`                       | 收集为 Map             |
| **不可变集合（Java 10+）** |                                                              |                        |
| `toUnmodifiableList`       | `Collector<T, ?, List<T>> toUnmodifiableList()`              | 不可变 List            |
| `toUnmodifiableSet`        | `Collector<T, ?, Set<T>> toUnmodifiableSet()`                | 不可变 Set             |
| `toUnmodifiableMap`        | `Collector<T, ?, Map<K,U>> toUnmodifiableMap(...)`           | 不可变 Map             |
| **字符串**                 |                                                              |                        |
| `joining`                  | `Collector<CharSequence, ?, String> joining(...)`            | 字符串连接             |
| **统计**                   |                                                              |                        |
| `counting`                 | `Collector<T, ?, Long> counting()`                           | 计数                   |
| `summingInt/Long/Double`   | `Collector<T, ?, Integer/Long/Double> summing...`            | 求和                   |
| `averagingInt/Long/Double` | `Collector<T, ?, Double> averaging...`                       | 平均值                 |
| `maxBy` / `minBy`          | `Collector<T, ?, Optional<T>> maxBy/minBy(...)`              | 最大值/最小值          |
| **分组和分区**             |                                                              |                        |
| `groupingBy`               | `Collector<T, ?, Map<K, List<T>>> groupingBy(...)`           | 分组                   |
| `partitioningBy`           | `Collector<T, ?, Map<Boolean, List<T>>> partitioningBy(...)` | 分区                   |

## 参考

- [Java 官方文档 - Collectors](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Collectors.html)
