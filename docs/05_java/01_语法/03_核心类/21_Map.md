# Map 接口

`java.util.Map` 是 Java 集合框架中的核心接口。Map 存储**键值对（Key-Value）**，每个键映射到一个值，键不能重复。

> **注意**：Map 不继承自 `Collection`，但属于集合框架的一部分。

## 特点

- **键值对存储**：每个元素包含一个键（Key）和一个值（Value）
- **键不能重复**：相同的键只能映射到一个值
- **值可以重复**：不同的键可以映射到相同的值
- **键唯一，值不要求唯一**
- **默认无序**：不保证元素按插入顺序排列；
  - `LinkedHashMap`: 额外维护了一个双向链表, 保持插入顺序
  - `TreeMap`: 会根据键的 **自然顺序**（例如，String按字母顺序，Integer按数字大小）或者根据构造时传入的 **Comparator** 来对键进行排序。

## 继承关系

```
Map
 ├─ HashMap
 │   └─ LinkedHashMap -> 继承父类 HashMap
 └─ SortedMap
     ├─ TreeMap
 └─ Hashtable
     └─ Properties
```

## 常用实现类

`Map` 定义的是接口，通常有不同的实现类：

| 实现类          | 底层              | 顺序                       | 键判重规则                 | 线程安全     |
| --------------- | ----------------- | -------------------------- | -------------------------- | ------------ |
| `HashMap`       | 哈希表            | **无序**                   | `hashCode()` → `equals()`  | 否           |
| `LinkedHashMap` | 哈希表 + 双向链表 | **插入有序（按存入顺序）** | `hashCode()` → `equals()`  | 否           |
| `TreeMap`       | 红黑树            | **按键自然排序（升序）**   | `compareTo()` / Comparator | 否           |
| `Hashtable`     | 哈希表            | 无序                       | `hashCode()` → `equals()`  | 是（已过时） |

### HashMap

最常用的 Map 实现类，基于哈希表，键无序存储。

```java
Map<String, Integer> map = new HashMap<>();

// 添加键值对
map.put("Alice", 90);
map.put("Bob", 85);
map.put("Charlie", 78);
map.put("Alice", 95);  // 键重复，覆盖旧值

System.out.println(map.size());  // 3
System.out.println(map);  // {Bob=85, Alice=95, Charlie=78}（顺序不固定）
```

### LinkedHashMap

继承自 HashMap，额外维护一个双向链表来记录插入顺序。

```java
Map<String, Integer> map = new LinkedHashMap<>();

map.put("C", 3);
map.put("A", 1);
map.put("B", 2);

System.out.println(map);  // {C=3, A=1, B=2}（保持插入顺序）
```

### TreeMap

基于 TreeMap（红黑树），按键的自然顺序或自定义比较器排序。

```java
// 按键自然排序
Map<String, Integer> map = new TreeMap<>();
map.put("C", 3);
map.put("A", 1);
map.put("B", 2);
System.out.println(map);  // {A=1, B=2, C=3}

// 按键自定义排序（降序）
Map<String, Integer> descMap = new TreeMap<>(Collections.reverseOrder());
descMap.putAll(Map.of("C", 3, "A", 1, "B", 2));
System.out.println(descMap);  // {C=3, B=2, A=1}
```

## 如何判断键是否相同？

与 Set 相同，Map 使用 `hashCode()` 和 `equals()` 来判断键是否重复。

- **HashMap**：先比较 `hashCode()`，再比较 `equals()`
- **TreeMap**：使用 `compareTo()`（或比较器）判断，不使用 `equals()`

> **重要**：自定义对象作为键时，必须同时重写 `equals()` 和 `hashCode()`。

```java
class Student {
    String name;
    int age;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Student other = (Student) obj;
        return age == other.age && name.equals(other.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }
}

Map<Student, String> map = new HashMap<>();
map.put(new Student("Tom", 20), "A");
map.put(new Student("Tom", 20), "B");  // 键相同，覆盖旧值

System.out.println(map.size());  // 1
```

## 常用操作

### 创建

```java
// 创建空 Map
Map<String, Integer> map1 = new HashMap<>();
Map<String, Integer> map2 = new LinkedHashMap<>();
Map<String, Integer> map3 = new TreeMap<>();

// 创建并初始化（不可变）
Map<String, Integer> map4 = Map.of("A", 1, "B", 2, "C", 3);

// 从已有 Map 创建
Map<String, Integer> map5 = new HashMap<>(existingMap);
```

### 添加

```java
Map<String, Integer> map = new HashMap<>();

// 添加键值对，返回旧值（无旧值返回 null）
Integer old1 = map.put("A", 1);  // null

// 批量添加
map.putAll(Map.of("B", 2, "C", 3));

// 如果键不存在才添加（Java 8+）
map.putIfAbsent("D", 4);  // 键 D 不存在，添加成功
```

### 修改

```java
Map<String, Integer> map = new HashMap<>(Map.of("A", 1, "B", 2, "C", 3));

// put 覆盖旧值
map.put("A", 100);  // A=100

// replace(key, newValue)：替换指定键的值，返回旧值
map.replace("A", 200);  // A=200

// replace(key, oldValue, newValue)：仅当旧值匹配时才替换
map.replace("B", 2, 20);  // B=20（旧值为 2，匹配成功）

// replaceAll(lambda)：对所有键值对执行替换
map.replaceAll((key, value) -> value * 10);  // 所有值乘以 10

// compute(key, lambda)：根据旧值计算新值，lambda 返回 null 则删除该键
map.compute("A", (key, oldValue) -> oldValue + 1);  // A 的值加 1

// computeIfAbsent(key, lambda)：键不存在时才计算并添加
map.computeIfAbsent("X", key -> 999);  // X 不存在，添加 X=999

// computeIfPresent(key, lambda)：键存在时才计算
map.computeIfPresent("B", (key, oldValue) -> oldValue * 2);  // B 存在，值翻倍

// merge(key, value, lambda)：键不存在则直接添加；存在则用 lambda 合并旧值和新值
map.merge("C", 100, (oldValue, newValue) -> oldValue + newValue);  // C 的值加 100
```

### 删除

```java
Map<String, Integer> map = new HashMap<>(Map.of("A", 1, "B", 2, "C", 3));

// 根据键删除，返回被删值
Integer val = map.remove("B");  // 2

// 根据键值对删除（Java 8+）
map.remove("A", 1);  // 键为 A 且值为 1 时才删除

// 根据条件删除（Java 8+）
// Set 是 原 Map 的视图 ，不是新集合。对这个 Set 做增删，会直接影响原始 Map。
map.entrySet().removeIf(entry -> entry.getValue() > 2);

// 清空全部
map.clear();
```

### 获取

```java
Map<String, Integer> map = Map.of("A", 1, "B", 2, "C", 3);

// 根据键获取值
Integer val = map.get("A");  // 1

// 键不存在时返回默认值（Java 8+）
Integer val2 = map.getOrDefault("D", 0);  // 0

// 获取大小
int size = map.size();
```

### 判断

```java
boolean empty = map.isEmpty();           // 是否为空
boolean hasKey = map.containsKey("A");   // 是否包含指定键
boolean hasValue = map.containsValue(1); // 是否包含指定值
```

### 遍历

```java
Map<String, Integer> map = Map.of("A", 1, "B", 2, "C", 3);

// 1. 遍历 entrySet（推荐）
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + " = " + entry.getValue());
}

// 2. 遍历 keySet
for (String key : map.keySet()) {
    System.out.println(key + " = " + map.get(key));
}

// 3. forEach（Java 8+）
map.forEach((key, value) -> System.out.println(key + " = " + value));

// 4. Stream API（Java 8+）
map.entrySet().stream()
    .forEach(entry -> System.out.println(entry.getKey() + " = " + entry.getValue()));
```

### 获取集合视图（与原 Map 联动，修改视图同步改原集合）

Map 提供三种视图，视图是原 Map 的**实时映射**，对视图的修改会直接影响原 Map：

| 视图方法     | 返回类型               | 说明             |
| ------------ | ---------------------- | ---------------- |
| `keySet()`   | `Set<K>`               | 所有键的集合     |
| `values()`   | `Collection<V>`        | 所有值的集合     |
| `entrySet()` | `Set<Map.Entry<K, V>>` | 所有键值对的集合 |

```java
Map<String, Integer> map = new HashMap<>(Map.of("A", 1, "B", 2, "C", 3));

// keySet 视图
Set<String> keys = map.keySet();
keys.remove("A");  // 从 map 中删除键 A
System.out.println(map);  // {B=2, C=3}

// values 视图
Collection<Integer> values = map.values();
// values 不支持 add/remove（因为无法确定要删除哪个键）

// entrySet 视图
Set<Map.Entry<String, Integer>> entries = map.entrySet();
entries.removeIf(entry -> entry.getValue() > 1);  // 删除值大于 1 的键值对
System.out.println(map);  // {B=2, C=3} 中只保留 B=2, C=3
```

### 转为数组

Map 不能直接转为数组，需要先获取视图：

```java
Map<String, Integer> map = Map.of("A", 1, "B", 2, "C", 3);

// 键数组
String[] keys = map.keySet().toArray(new String[0]);

// 值数组
Integer[] values = map.values().toArray(new Integer[0]);

// Entry 数组
Map.Entry<String, Integer>[] entries = map.entrySet().toArray(new Map.Entry[0]);
```

### 不可变 Map

```java
// Java 9+：创建不可变 Map
Map<String, Integer> immutable = Map.of("A", 1, "B", 2, "C", 3);
// immutable.put("D", 4);  // UnsupportedOperationException

// Java 10+：从已有 Map 创建不可变副本
Map<String, Integer> copy = Map.copyOf(existingMap);
```

## HashMap vs LinkedHashMap vs TreeMap 选择

| 场景             | 推荐            | 原因                 |
| ---------------- | --------------- | -------------------- |
| 一般键映射场景   | `HashMap`       | 性能最好，无序       |
| 需要保持插入顺序 | `LinkedHashMap` | 维护插入顺序         |
| 需要按键排序     | `TreeMap`       | 自动排序，但性能较慢 |

> **实际开发中**，绝大多数场景使用 `HashMap` 即可。
