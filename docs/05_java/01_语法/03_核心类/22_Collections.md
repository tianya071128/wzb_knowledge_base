# Collections：集合工具类

`java.util.Collections` 是一个工具类，提供了大量操作集合的静态方法。

## 特点

- **工具类**：所有方法都是静态方法
- **操作集合**：提供排序、搜索、同步、不可变集合等操作
- **不可实例化**：构造器是私有的

## 常用方法

### 排序

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

### 搜索

```java
List<Integer> list = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9);

// 二分查找（要求列表已排序）
Collections.binarySearch(list, 5);  // 4（索引）

// 查找最大值
Collections.max(list);  // 9

// 查找最小值
Collections.min(list);  // 1

// 查找出现次数
List<String> words = List.of("a", "b", "a", "c", "a");
Collections.frequency(words, "a");  // 3
```

### 洗牌

```java
List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4, 5));

// 随机打乱顺序
Collections.shuffle(list);  // 例如：[3, 1, 5, 2, 4]

// 使用指定随机源洗牌
Collections.shuffle(list, new Random(42));  // 可重现的洗牌
```

### 旋转

```java
List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4, 5));

// 向右旋转 2 位
Collections.rotate(list, 2);  // [4, 5, 1, 2, 3]

// 向左旋转 2 位（负数表示向左）
Collections.rotate(list, -2);  // [1, 2, 3, 4, 5]
```

### 交换

```java
List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4, 5));

// 交换索引 0 和 4 的元素
Collections.swap(list, 0, 4);  // [5, 2, 3, 4, 1]
```

### 填充和复制

```java
// 填充
List<String> list = new ArrayList<>(Arrays.asList(new String[5]));
Collections.fill(list, "A");  // [A, A, A, A, A]

// 复制（目标列表长度必须 >= 源列表长度）
List<String> src = List.of("A", "B", "C");
List<String> dest = new ArrayList<>(Arrays.asList(new String[5]));
Collections.copy(dest, src);  // [A, B, C, null, null]
```

### 添加所有

```java
List<String> list = new ArrayList<>();

// 批量添加元素
Collections.addAll(list, "A", "B", "C", "D");  // [A, B, C, D]
```

### 不交集

```java
List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4, 5));

// 判断两个集合是否没有交集
List<Integer> other = List.of(6, 7, 8);
Collections.disjoint(list, other);  // true（没有交集）

List<Integer> other2 = List.of(5, 6, 7);
Collections.disjoint(list, other2);  // false（有交集 5）
```

## 不可变集合

```java
// 创建不可变 List
List<String> immutableList = Collections.unmodifiableList(List.of("A", "B", "C"));
// immutableList.add("D");  // UnsupportedOperationException

// 创建不可变 Set
Set<String> immutableSet = Collections.unmodifiableSet(Set.of("A", "B", "C"));

// 创建不可变 Map
Map<String, Integer> immutableMap = Collections.unmodifiableMap(Map.of("A", 1, "B", 2));

// 创建不可变集合（Java 10+ 推荐用 List.of()、Set.of()、Map.of()）
```

## 同步集合

```java
// 创建线程安全的 List
List<String> syncList = Collections.synchronizedList(new ArrayList<>());

// 创建线程安全的 Set
Set<String> syncSet = Collections.synchronizedSet(new HashSet<>());

// 创建线程安全的 Map
Map<String, Integer> syncMap = Collections.synchronizedMap(new HashMap<>());

// 注意：迭代时需要手动同步
synchronized (syncList) {
    for (String item : syncList) {
        System.out.println(item);
    }
}
```

> **建议**：多线程环境下推荐使用 `ConcurrentHashMap`、`CopyOnWriteArrayList` 等并发集合，而不是同步集合。

## 单元素集合

```java
// 创建单元素 List
List<String> singleList = Collections.singletonList("A");  // [A]

// 创建单元素 Set
Set<String> singleSet = Collections.singleton("A");  // [A]

// 创建单元素 Map
Map<String, Integer> singleMap = Collections.singletonMap("A", 1);  // {A=1}
```

## 空集合

```java
// 空 List
List<String> emptyList = Collections.emptyList();

// 空 Set
Set<String> emptySet = Collections.emptySet();

// 空 Map
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
