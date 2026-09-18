# List 接口

`java.util.List` 是 Java 集合框架（Collections Framework）中的核心接口，继承自 `Collection`。List 是一个**有序、可重复**的集合，每个元素都有对应的索引位置。

## 特点

- **有序**：按元素存入顺序保存，不是排序；
- **允许元素重复**；
- **支持数字下标索引**（从 0 开始）。

## 继承关系

```
Iterable
    ↳ Collection
        ↳ List
           ├─ ArrayList
           ├─ LinkedList
           └─ Vector
```

## 常用实现类

`List` 定义的是接口, 通常有不同的实现类：

| 实现类       | 底层结构             | 特点                                                     |
| ------------ | -------------------- | -------------------------------------------------------- |
| `ArrayList`  | **动态 Object 数组** | 查询快，增删慢；线程不安全；开发最常用                   |
| `LinkedList` | 双向链表             | 查询慢，首尾增删快；线程不安全；实现 List+Deque 双端队列 |
| `Vector`     | Object 数组          | 全部方法`synchronized`，线程安全，性能差，基本淘汰       |

### ArrayList

最常用的 List 实现类，基于动态数组，默认初始容量为 10，扩容为原来的 1.5 倍。

```java
List<String> list = new ArrayList<>();

// 添加元素
list.add("Apple");
list.add("Banana");
list.add("Cherry");

// 按索引访问
String first = list.get(0);  // "Apple"

// 修改元素
list.set(1, "Blueberry");

// 删除元素
list.remove("Cherry");       // 按值删除
list.remove(0);              // 按索引删除

// 获取大小
int size = list.size();      // 1
```

### LinkedList

基于双向链表，同时实现了 `List` 和 `Deque` 接口，可作为双端队列使用。

```java
List<String> list = new LinkedList<>();
list.add("A");
list.add("B");
list.add("C");

// LinkedList 额外方法（双端队列操作）
LinkedList<String> linked = new LinkedList<>();
linked.addFirst("Head");   // 头部添加
linked.addLast("Tail");    // 尾部添加
String first = linked.getFirst();  // 获取头部
String last = linked.getLast();    // 获取尾部
linked.removeFirst();              // 删除头部
linked.removeLast();               // 删除尾部
```

## 如何判断元素是否相同？

List 中的 `contains()`、`remove()`、`indexOf()` 等方法都依赖 `equals()` 来判断两个元素是否相同。

### 底层源码逻辑

两条规则

1. **查找元素为 null**：直接用 `==` 判断是否为 null
2. **查找不为 null**：调用 `o.equals(集合内的元素)`，**不是 ==**

```java
public boolean contains(Object o) {
    return indexOf(o) >= 0;
}

public int indexOf(Object o) {
    if (o == null) {
        for (int i = 0; i < size; i++)
            if (elementData[i]==null) // null 使用 == 判断
                return i;
    } else {
        for (int i = 0; i < size; i++)
            if (o.equals(elementData[i])) // 非null：调用 equals()
                return i;
    }
    return -1;
}

```

### 自定义对象必须重写 `equals()`

如果 List 存放自定义对象，必须重写 `equals()` 才能让 `contains()`、`remove()` 等方法正确工作：

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
}

List<Student> list = new ArrayList<>();
list.add(new Student("Tom", 20));

// 不重写 equals()：contains 返回 false（比较地址）
// 重写 equals() 后：contains 返回 true（比较 name 和 age）
list.contains(new Student("Tom", 20));  // true
```

> **建议**：重写 `equals()` 时通常也需要重写 `hashCode()`，以保证在 HashMap/HashSet 中的行为一致。

## 常用操作

### 创建

```java
// 创建空 List
List<String> list1 = new ArrayList<>();
List<String> list2 = new LinkedList<>();

// 创建并初始化（不可变）
List<String> list3 = List.of("A", "B", "C");

// 从已有集合创建
List<String> list4 = new ArrayList<>(existingList);
```

### 添加元素

```java
List<String> list = new ArrayList<>();

// 尾部追加
list.add("A");
list.add("B");

// 指定索引插入，原有元素后移
list.add(1, "C");

// 批量添加
List<String> other = Arrays.asList("D","E");
list.addAll(other);

// 指定位置批量插入
list.addAll(2, other);
```

### 删除元素

```java
List<String> list = new ArrayList<>(List.of("A", "B", "C", "D"));

// 根据下标删除，返回被删元素
String del = list.remove(0);

// 根据对象删除，删除第一个匹配的元素
list.remove("B");

// 批量删除，删除集合中存在的元素
list.removeAll(other);

// 保留交集，删除不在other里面的元素
list.retainAll(other);

// 根据条件删除
list.removeIf(item -> item.equals("c"));

// 清空全部
list.clear();
```

### 获取元素

```java
List<String> list = List.of("A", "B", "C");

// 根据下标取值，下标从0开始
String s = list.get(0);

// 获取元素第一次出现的下标，找不到返回-1
int idx = list.indexOf("B");

// 获取元素最后一次出现的下标
int lastIdx = list.lastIndexOf("B");

// 集合大小
int size = list.size();
```

### 修改元素

```java
List<String> list = new ArrayList<>(List.of("A", "B", "C"));

// 覆盖指定下标元素，返回旧值
String oldVal = list.set(0, "AA");
```

### 判断

```java
boolean empty = list.isEmpty();       // 是否为空
boolean contain = list.contains("A"); // 是否包含元素
boolean contain2 = list.containsAll(List.of("new hello", "b")); // 判断是否包含指定所有元素
```

### 排序

```java
List<Integer> nums = new ArrayList<>(List.of(3, 1, 4, 1, 5));

// 自定义排序（降序）
nums.sort(Collections.reverseOrder());  // [5, 4, 3, 1, 1]

// 按自定义规则排序
List<String> names = new ArrayList<>(List.of("Charlie", "Alice", "Bob"));
names.sort((a, b) -> a.length() - b.length());  // 按长度排序
```

### 截取子列表

`subList` 返回**视图，不是新集合**

1. 修改 sub，原 list 跟着变
2. 原 list 执行 add /remove（结构性修改），再操作 sub → `ConcurrentModificationException`

```java
List<Integer> list = List.of(1, 2, 3, 4, 5);

// subList(fromIndex, toIndex)：左闭右开
List<Integer> sub = list.subList(1, 4);  // [2, 3, 4]
```

想要得到独立新集合：

```java
List<String> newList = new ArrayList<>(list.subList(1,3));
```

### 不可变 List

```java
// Java 9+：创建不可变列表
List<String> immutable = List.of("A", "B", "C");
// immutable.add("D");  // UnsupportedOperationException

// Java 10+：从已有集合创建不可变副本
List<String> copy = List.copyOf(existingList);
```

### 转为数组

```java
List<String> list = List.of("A", "B", "C");

// 转为 Object 数组
Object[] arr1 = list.toArray();

// 转为指定类型数组（推荐） - 不丢失类型
String[] arr2 = list.toArray(new String[0]);

// 转为指定类型数组（预分配大小）
String[] arr3 = list.toArray(new String[list.size()]);
```

### 遍历

```java
List<String> list = List.of("A", "B", "C");

// 1. for 循环 + 索引
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}

// 2. 增强 for 循环
for (String item : list) {
    System.out.println(item);
}

// 3. Iterator 迭代器
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    System.out.println(it.next());
}

// 4. forEach（Java 8+）
list.forEach(item -> System.out.println(item));

// 5. Stream API（Java 8+）
list.stream().forEach(System.out::println);
```
