# Set 接口

`java.util.Set` 是 Java 集合框架中的核心接口，继承自 `Collection`。Set 是一个**不包含重复元素**的集合。

## 特点

- **不允许元素重复**；
- **默认无序**：不保证元素按插入顺序排列；
  - `LinkedHashSet`: 额外维护了一个双向链表, 保持插入顺序
  - `TreeSet`: 会根据键的 **自然顺序**（例如，String按字母顺序，Integer按数字大小）或者根据构造时传入的 **Comparator** 来对键进行排序。
- **没有索引**：不支持通过下标访问元素。

## 继承关系

```
Iterable
    ↳ Collection
        ↳ Set
           ├─ HashSet
           		├─ LinkedHashSet -> 继承父类 HashSet
           └─ SortedSet
           		├─ SortedSet
```

## 常用实现类

`Set` 定义的是接口, 通常有不同的实现类：

| 实现类          | 底层              | 顺序                       | 判重规则                          |
| --------------- | ----------------- | -------------------------- | --------------------------------- |
| `HashSet`       | 哈希表 (HashMap)  | **无序**                   | `hashCode()` → `equals()`         |
| `LinkedHashSet` | 哈希表 + 双向链表 | **插入有序（按存入顺序）** | `hashCode()` → `equals()`         |
| `TreeSet`       | 红黑树            | **自然排序（升序）**       | `compareTo()` / Comparator 比较器 |

### HashSet

最常用的 Set 实现类，基于 HashMap，元素无序存储。

```java
Set<String> set = new HashSet<>();

// 添加元素
set.add("Apple");
set.add("Banana");
set.add("Cherry");
set.add("Apple");  // 重复元素，添加失败

System.out.println(set.size());  // 3
System.out.println(set);  // [Banana, Apple, Cherry]（顺序不固定）
```

### LinkedHashSet

继承自 HashSet，额外维护一个双向链表来记录插入顺序。

```java
Set<String> set = new LinkedHashSet<>();

set.add("C");
set.add("A");
set.add("B");
set.add("A");  // 重复元素，添加失败

System.out.println(set);  // [C, A, B]（保持插入顺序）
```

### TreeSet

基于 TreeMap（红黑树），元素按自然顺序(元素实现 `Comparable ` 接口)或自定义比较器排序。

```java
// 自然排序
Set<Integer> set = new TreeSet<>();
set.add(3);
set.add(1);
set.add(2);
System.out.println(set);  // [1, 2, 3]

// 自定义排序（降序）
Set<Integer> descSet = new TreeSet<>(Collections.reverseOrder());
descSet.addAll(List.of(3, 1, 2));
System.out.println(descSet);  // [3, 2, 1]
```

## 如何判断元素是否相同？

与 `Map` 相同，Set 使用 `equals()` 和 `hashCode()` 来判断元素是否重复。

- **HashSet**：先比较 `hashCode()`，再比较 `equals()`
  - 调用对象的 `hashCode()` 获取哈希值，定位桶位置
  - 如果桶位置为空 → **直接存入**
  - 如果桶不为空，逐个和桶内元素对比：
    - 先比较 `hashCode`；hash 不相等，判定不同对象
    - **hash 相等，再调用 `equals()`**；equals 返回 true → 判断重复，放弃存入
  - ✅规则：**hashCode 不一样一定不相等；hashCode 相等未必相等，需要 equals 二次确认**
- **TreeSet**：使用 `compareTo()`（或比较器）判断，不使用 `equals()`
  - 比较器 `compare()` / `compareTo()`，**返回 0 就判定为重复元素，拒绝存入**。

> **重要**：自定义对象放入 HashSet 时，必须同时重写 `equals()` 和 `hashCode()`。

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

Set<Student> set = new HashSet<>();
set.add(new Student("Tom", 20));
set.add(new Student("Tom", 20));  // 不会添加，因为 equals 和 hashCode 相同

System.out.println(set.size());  // 1
```

## 常用操作

### 创建

```java
// 创建空 Set
Set<String> set1 = new HashSet<>();
Set<String> set2 = new LinkedHashSet<>();
Set<String> set3 = new TreeSet<>();

// 创建并初始化（不可变）
Set<String> set4 = Set.of("A", "B", "C");

// 从已有集合创建
Set<String> set5 = new HashSet<>(existingList);
```

### 添加元素

```java
Set<String> set = new HashSet<>();

set.add("A");
set.add("B");
set.add("A");  // 重复，添加失败，返回 false

// 批量添加
set.addAll(List.of("C", "D", "E"));
```

### 删除元素

```java
Set<String> set = new HashSet<>(List.of("A", "B", "C", "D"));

set.remove("B");           // 按值删除
set.removeAll(List.of("C"));  // 批量删除
set.retainAll(List.of("A", "D"));  // 保留交集
set.removeIf(item -> item.equals("A"));  // 根据条件删除
set.clear();               // 清空全部
```

### 获取元素

Set 没有索引，不能像 List 那样通过下标获取元素。

```java
Set<String> set = Set.of("A", "B", "C");

// 判断是否包含
boolean contains = set.contains("A");  // true

// 获取大小
int size = set.size();

// 获取第一个元素（TreeSet 可获取最小/最大元素）
TreeSet<Integer> treeSet = new TreeSet<>(List.of(3, 1, 2));
Integer first = treeSet.first();  // 1
Integer last = treeSet.last();    // 3
```

### 判断

```java
boolean empty = set.isEmpty();       // 是否为空
boolean contain = set.contains("A"); // 是否包含元素
boolean containAll = set.containsAll(List.of("A", "B"));  // 是否包含所有指定元素
```

### 转为数组

```java
Set<String> set = Set.of("A", "B", "C");

// 转为 Object 数组
Object[] arr1 = set.toArray();

// 转为指定类型数组（推荐）
String[] arr2 = set.toArray(new String[0]);
```

### 遍历

```java
Set<String> set = Set.of("A", "B", "C");

// 1. 增强 for 循环
for (String item : set) {
    System.out.println(item);
}

// 2. Iterator 迭代器
Iterator<String> it = set.iterator();
while (it.hasNext()) {
    System.out.println(it.next());
}

// 3. forEach（Java 8+）
set.forEach(item -> System.out.println(item));

// 4. Stream API（Java 8+）
set.stream().forEach(System.out::println);
```

### 不可变 Set

```java
// Java 9+：创建不可变集合
Set<String> immutable = Set.of("A", "B", "C");
// immutable.add("D");  // UnsupportedOperationException

// Java 10+：从已有集合创建不可变副本
Set<String> copy = Set.copyOf(existingSet);
```

## 集合运算

Set 支持数学集合运算：

```java
Set<Integer> set1 = new HashSet<>(List.of(1, 2, 3, 4));
Set<Integer> set2 = new HashSet<>(List.of(3, 4, 5, 6));

// 交集
Set<Integer> intersection = new HashSet<>(set1);
intersection.retainAll(set2);  // [3, 4]

// 并集
Set<Integer> union = new HashSet<>(set1);
union.addAll(set2);  // [1, 2, 3, 4, 5, 6]

// 差集（set1 - set2）
Set<Integer> difference = new HashSet<>(set1);
difference.removeAll(set2);  // [1, 2]
```

## HashSet vs LinkedHashSet vs TreeSet 选择

| 场景             | 推荐            | 原因                 |
| ---------------- | --------------- | -------------------- |
| 一般去重场景     | `HashSet`       | 性能最好，无序       |
| 需要保持插入顺序 | `LinkedHashSet` | 维护插入顺序         |
| 需要排序         | `TreeSet`       | 自动排序，但性能较慢 |

> **实际开发中**，绝大多数场景使用 `HashSet` 即可。
