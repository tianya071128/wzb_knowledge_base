# Collections：集合工具类

`java.util.Collections` 是一个工具类，提供了大量操作集合的静态方法。

## 特点

- **工具类**：所有方法都是静态方法
- **操作集合**：提供排序、搜索、同步、不可变集合等操作
- **不可实例化**：构造器是私有的

## 常用方法

### sort — 排序

```java
// 方法签名
static <T extends Comparable<? super T>> void sort(List<T> list)
static <T> void sort(List<T> list, Comparator<? super T> c)
```

```java
List<Integer> list = new ArrayList<>(List.of(3, 1, 4, 1, 5, 9, 2, 6));

// 自然排序（升序）
Collections.sort(list);  // [1, 1, 2, 3, 4, 5, 6, 9]

// 自定义排序（降序）
Collections.sort(list, Collections.reverseOrder());  // [9, 6, 5, 4, 3, 2, 1, 1]

// 使用 Comparator 排序
List<String> names = new ArrayList<>(List.of("Charlie", "Alice", "Bob"));
Collections.sort(names, (a, b) -> a.length() - b.length());  // 按长度排序
```

### binarySearch — 二分查找

```java
// 方法签名
static <T extends Comparable<? super T>> int binarySearch(List<? extends T> list, T key)
static <T> int binarySearch(List<? extends T> list, T key, Comparator<? super T> c)
```

```java
List<Integer> list = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9);

// 二分查找（要求列表已排序）
Collections.binarySearch(list, 5);  // 4（索引）
```

### max — 查找最大值

```java
// 方法签名
static <T extends Object & Comparable<? super T>> T max(Collection<? extends T> coll)
static <T> T max(Collection<? extends T> coll, Comparator<? super T> comp)
```

```java
List<Integer> list = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9);

// 查找最大值
Collections.max(list);  // 9
```

### min — 查找最小值

```java
// 方法签名
static <T extends Object & Comparable<? super T>> T min(Collection<? extends T> coll)
static <T> T min(Collection<? extends T> coll, Comparator<? super T> comp)
```

```java
List<Integer> list = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9);

// 查找最小值
Collections.min(list);  // 1
```

### frequency — 查找出现次数

```java
// 方法签名
static int frequency(Collection<?> c, Object o)
```

```java
List<String> words = List.of("a", "b", "a", "c", "a");
Collections.frequency(words, "a");  // 3
```

### shuffle — 洗牌

```java
// 方法签名
static void shuffle(List<?> list)
static void shuffle(List<?> list, Random rnd)
```

```java
List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4, 5));

// 随机打乱顺序
Collections.shuffle(list);  // 例如：[3, 1, 5, 2, 4]

// 使用指定随机源洗牌
Collections.shuffle(list, new Random(42));  // 可重现的洗牌
```

### rotate — 旋转

```java
// 方法签名
static void rotate(List<?> list, int distance)
```

```java
List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4, 5));

// 向右旋转 2 位
Collections.rotate(list, 2);  // [4, 5, 1, 2, 3]

// 向左旋转 2 位（负数表示向左）
Collections.rotate(list, -2);  // [1, 2, 3, 4, 5]
```

### swap — 交换

```java
// 方法签名
static void swap(List<?> list, int i, int j)
```

```java
List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4, 5));

// 交换索引 0 和 4 的元素
Collections.swap(list, 0, 4);  // [5, 2, 3, 4, 1]
```

### fill — 填充

```java
// 方法签名
static <T> void fill(List<? super T> list, T obj)
```

```java
List<String> list = new ArrayList<>(Arrays.asList(new String[5]));
Collections.fill(list, "A");  // [A, A, A, A, A]
```

### copy — 复制

```java
// 方法签名
static <T> void copy(List<? super T> dest, List<? extends T> src)
```

```java
// 复制（目标列表长度必须 >= 源列表长度）
List<String> src = List.of("A", "B", "C");
List<String> dest = new ArrayList<>(Arrays.asList(new String[5]));
Collections.copy(dest, src);  // [A, B, C, null, null]
```

### addAll — 添加所有

```java
// 方法签名
static <T> boolean addAll(Collection<? super T> c, T... elements)
```

```java
List<String> list = new ArrayList<>();

// 批量添加元素
Collections.addAll(list, "A", "B", "C", "D");  // [A, B, C, D]
```

### disjoint — 不交集

```java
// 方法签名
static boolean disjoint(Collection<?> c1, Collection<?> c2)
```

```java
List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4, 5));

// 判断两个集合是否没有交集
List<Integer> other = List.of(6, 7, 8);
Collections.disjoint(list, other);  // true（没有交集）

List<Integer> other2 = List.of(5, 6, 7);
Collections.disjoint(list, other2);  // false（有交集 5）
```

## 不可变集合

### unmodifiableList — 不可变 List

```java
// 方法签名
static <T> List<T> unmodifiableList(List<? extends T> list)
```

```java
List<String> immutableList = Collections.unmodifiableList(List.of("A", "B", "C"));
// immutableList.add("D");  // UnsupportedOperationException
```

### unmodifiableSet — 不可变 Set

```java
// 方法签名
static <T> Set<T> unmodifiableSet(Set<? extends T> s)
```

```java
Set<String> immutableSet = Collections.unmodifiableSet(Set.of("A", "B", "C"));
```

### unmodifiableMap — 不可变 Map

```java
// 方法签名
static <K, V> Map<K, V> unmodifiableMap(Map<? extends K, ? extends V> m)
```

```java
Map<String, Integer> immutableMap = Collections.unmodifiableMap(Map.of("A", 1, "B", 2));
```

> **注意**：Java 10+ 推荐使用 `List.of()`、`Set.of()`、`Map.of()` 创建不可变集合。

## 同步集合

### synchronizedList — 线程安全 List

```java
// 方法签名
static <T> List<T> synchronizedList(List<T> list)
```

```java
List<String> syncList = Collections.synchronizedList(new ArrayList<>());

// 注意：迭代时需要手动同步
synchronized (syncList) {
    for (String item : syncList) {
        System.out.println(item);
    }
}
```

### synchronizedSet — 线程安全 Set

```java
// 方法签名
static <T> Set<T> synchronizedSet(Set<T> s)
```

```java
Set<String> syncSet = Collections.synchronizedSet(new HashSet<>());
```

### synchronizedMap — 线程安全 Map

```java
// 方法签名
static <K, V> Map<K, V> synchronizedMap(Map<K, V> m)
```

```java
Map<String, Integer> syncMap = Collections.synchronizedMap(new HashMap<>());
```

> **建议**：多线程环境下推荐使用 `ConcurrentHashMap`、`CopyOnWriteArrayList` 等并发集合，而不是同步集合。

## 单元素集合

### singletonList — 单元素 List

```java
// 方法签名
static <T> List<T> singletonList(T o)
```

```java
List<String> singleList = Collections.singletonList("A");  // [A]
```

### singleton — 单元素 Set

```java
// 方法签名
static <T> Set<T> singleton(T o)
```

```java
Set<String> singleSet = Collections.singleton("A");  // [A]
```

### singletonMap — 单元素 Map

```java
// 方法签名
static <K, V> Map<K, V> singletonMap(K key, V value)
```

```java
Map<String, Integer> singleMap = Collections.singletonMap("A", 1);  // {A=1}
```

## 空集合

### emptyList — 空 List

```java
// 方法签名
static <T> List<T> emptyList()
```

```java
List<String> emptyList = Collections.emptyList();
```

### emptySet — 空 Set

```java
// 方法签名
static <T> Set<T> emptySet()
```

```java
Set<String> emptySet = Collections.emptySet();
```

### emptyMap — 空 Map

```java
// 方法签名
static <K, V> Map<K, V> emptyMap()
```

```java
Map<String, Integer> emptyMap = Collections.emptyMap();
```

> **用途**：常用于方法返回值，避免返回 `null`。

## Collections vs Collection

| 特性   | Collections      | Collection       |
| ------ | ---------------- | ---------------- |
| 类型   | 工具类           | 接口             |
| 作用   | 提供集合操作方法 | 集合框架的根接口 |
| 实例化 | 不可实例化       | 不能直接实例化   |
| 方法   | 静态方法         | 实例方法         |

---

## 参考

- [Java 官方文档 - Collections](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collections.html)
