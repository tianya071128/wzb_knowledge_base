# Comparator：比较器

`java.util.Comparator` 是一个函数式接口，用于定义对象之间的比较规则。

## 特点

- **函数式接口**：只有一个抽象方法 `compare`，可用 Lambda 表达式实现
- **外部比较**：在类的外部定义比较逻辑，无需修改类本身
- **灵活排序**：支持多种排序规则，可随时切换

## 接口定义

```java
@FunctionalInterface
public interface Comparator<T> {
    int compare(T o1, T o2);
}
```

- 返回**负数**：`o1 < o2`
- 返回**零**：`o1 == o2`
- 返回**正数**：`o1 > o2`

## 基本用法

### Lambda 表达式

```java
List<String> names = new ArrayList<>(List.of("Charlie", "Alice", "Bob"));

// 按字母顺序排序
names.sort((a, b) -> a.compareTo(b));  // [Alice, Bob, Charlie]

// 按长度排序
names.sort((a, b) -> a.length() - b.length());  // [Bob, Alice, Charlie]
```

### 方法引用

```java
List<String> names = new ArrayList<>(List.of("Charlie", "Alice", "Bob"));

// 方法引用排序
names.sort(String::compareTo);  // [Alice, Bob, Charlie]
```

## 静态工厂方法

### comparing — 按属性比较

```java
// 方法签名
static <T, U extends Comparable<? super U>> Comparator<T> comparing(
    Function<? super T, ? extends U> keyExtractor)
```

```java
class Student {
    String name;
    int score;
    Student(String name, int score) { this.name = name; this.score = score; }
}

List<Student> students = List.of(
    new Student("Alice", 85),
    new Student("Bob", 92),
    new Student("Charlie", 78)
);

// 按分数排序
students.sort(Comparator.comparing(s -> s.score));

// 按姓名排序
students.sort(Comparator.comparing(s -> s.name));
```

### comparingInt / comparingLong / comparingDouble

```java
// 针对基本类型的优化版本，避免自动装箱
students.sort(Comparator.comparingInt(s -> s.score));
```

### reversed — 反转排序

```java
// 方法签名
default Comparator<T> reversed()
```

```java
List<String> names = new ArrayList<>(List.of("Charlie", "Alice", "Bob"));

// 降序排序
names.sort(Comparator.<String>naturalOrder().reversed());  // [Charlie, Bob, Alice]

// 按分数降序
students.sort(Comparator.comparingInt((Student s) -> s.score).reversed());
```

### thenComparing — 链式比较

```java
// 方法签名
default Comparator<T> thenComparing(Comparator<? super T> other)
```

```java
class Student {
    String name;
    int score;
    Student(String name, int score) { this.name = name; this.score = score; }
}

List<Student> students = List.of(
    new Student("Alice", 85),
    new Student("Bob", 85),
    new Student("Alice", 92)
);

// 先按姓名排序，姓名相同则按分数排序
students.sort(Comparator.comparing((Student s) -> s.name)
    .thenComparingInt(s -> s.score));
// 结果：Alice/85, Alice/92, Bob/85
```

### reverseOrder — 自然顺序的反转

```java
// 方法签名
static <T extends Comparable<? super T>> Comparator<T> reverseOrder()
```

```java
List<Integer> list = new ArrayList<>(List.of(3, 1, 4, 1, 5));

// 降序排序
list.sort(Comparator.reverseOrder());  // [5, 4, 3, 1, 1]
```

### naturalOrder — 自然顺序

```java
// 方法签名
static <T extends Comparable<? super T>> Comparator<T> naturalOrder()
```

```java
List<Integer> list = new ArrayList<>(List.of(3, 1, 4, 1, 5));

// 升序排序（默认行为）
list.sort(Comparator.naturalOrder());  // [1, 1, 3, 4, 5]
```

### nullsFirst / nullsLast — 空值处理

```java
// 方法签名
static <T> Comparator<T> nullsFirst(Comparator<? super T> comparator)
static <T> Comparator<T> nullsLast(Comparator<? super T> comparator)
```

```java
List<String> names = new ArrayList<>(Arrays.asList("Bob", null, "Alice", null, "Charlie"));

// null 排在最前面
names.sort(Comparator.nullsFirst(String::compareTo));
// [null, null, Alice, Bob, Charlie]

// null 排在最后面
names.sort(Comparator.nullsLast(String::compareTo));
// [Alice, Bob, Charlie, null, null]
```

## 默认方法

### compare 的默认实现

```java
// Comparator 接口中的 compare 是抽象方法，必须实现
Comparator<String> comp = (a, b) -> a.length() - b.length();
comp.compare("abc", "de");  // 1（3 - 2 = 1）
```

## 与 Comparable 的区别

| 特性     | Comparator             | Comparable             |
| -------- | ---------------------- | ---------------------- |
| 包       | `java.util`            | `java.lang`            |
| 方法     | `compare(T o1, T o2)`  | `compareTo(T o)`       |
| 比较位置 | 类外部（外部比较器）   | 类内部（自然顺序）     |
| 灵活性   | 可定义多种比较规则     | 只有一种自然顺序       |
| 修改需求 | 无需修改被比较的类     | 需要修改类实现接口     |
| 使用场景 | 第三方类、多种排序规则 | 类有明确的默认排序规则 |

## 实际应用

### 多字段排序

```java
class Employee {
    String department;
    String name;
    int salary;
}

List<Employee> employees = ...;

// 先按部门排序，再按薪水降序，最后按姓名排序
employees.sort(
    Comparator.comparing((Employee e) -> e.department)
        .thenComparing(Comparator.comparingInt((Employee e) -> e.salary).reversed())
        .thenComparing(e -> e.name)
);
```

### 配合 Stream 使用

```java
List<Student> students = ...;

// Stream 排序
List<Student> sorted = students.stream()
    .sorted(Comparator.comparingInt(s -> s.score).reversed())
    .collect(Collectors.toList());

// 查找最高分
Optional<Student> top = students.stream()
    .max(Comparator.comparingInt(s -> s.score));
```

### 配合 TreeSet / TreeMap 使用

```java
// TreeSet 自定义排序
Set<String> set = new TreeSet<>(Comparator.comparingInt(String::length));
set.addAll(List.of("aaa", "b", "cc"));  // [b, cc, aaa]

// TreeMap 自定义排序
Map<String, Integer> map = new TreeMap<>(Comparator.reverseOrder());
map.put("B", 2);
map.put("A", 1);
map.put("C", 3);  // {C=3, B=2, A=1}
```

---

## 参考

- [Java 官方文档 - Comparator](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Comparator.html)
