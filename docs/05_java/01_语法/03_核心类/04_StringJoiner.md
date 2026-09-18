# StringJoiner

`java.util.StringJoiner` 用于创建由分隔符分隔的字符串序列，可选前缀和后缀。

> **引入版本**：Java 8

## 特点

- **灵活的分隔符**：可自定义元素之间的分隔符
- **可选前缀和后缀**：如 `[a, b, c]` 的格式
- **链式调用**：`add()` 方法返回自身

## 创建 StringJoiner

```java
// 只指定分隔符
StringJoiner sj1 = new StringJoiner(",");

// 指定分隔符、前缀和后缀
StringJoiner sj2 = new StringJoiner(", ", "[", "]");
```

## 常用操作

### 添加元素

```java
// 只指定分隔符
StringJoiner sj = new StringJoiner(", ");
sj.add("Apple");
sj.add("Banana");
sj.add("Cherry");

System.out.println(sj.toString());  // "Apple, Banana, Cherry"

// 指定分隔符、前缀和后缀
StringJoiner sj2 = new StringJoiner(", ", "[", "]");
sj2.add("Apple");
sj2.add("Banana");
sj2.add("Cherry");

System.out.println(sj2.toString());  // "[Apple, Banana, Cherry]"
```

### 链式调用

```java
String result = new StringJoiner(", ")
    .add("Apple")
    .add("Banana")
    .add("Cherry")
    .toString();

System.out.println(result);  // "Apple, Banana, Cherry"
```

### 合并

```java
StringJoiner sj1 = new StringJoiner(", ");
sj1.add("Apple");
sj1.add("Banana");

StringJoiner sj2 = new StringJoiner(", ");
sj2.add("Cherry");
sj2.add("Durian");

// 将 sj2 合并到 sj1
sj1.merge(sj2);

System.out.println(sj1.toString());  // "Apple, Banana, Cherry, Durian"
```

### 设置空值

```java
// 当 StringJoiner 为空时，toString() 返回设置的空值
StringJoiner sj = new StringJoiner(", ");
sj.setEmptyValue("无数据");

System.out.println(sj.toString());  // "无数据"

sj.add("Apple");
System.out.println(sj.toString());  // "Apple"
```

### 获取信息

```java
StringJoiner sj = new StringJoiner(", ", "[", "]");
sj.add("Apple");
sj.add("Banana");

sj.length();    // 20（"[Apple, Banana]" 的长度）
sj.toString();  // "[Apple, Banana]"
```

## 与 Stream 配合使用

`StringJoiner` 常与 Stream API 配合使用：

```java
List<String> names = List.of("Alice", "Bob", "Charlie");

// 使用 Collectors.joining（内部使用 StringJoiner）
String result = names.stream()
    .collect(Collectors.joining(", "));

System.out.println(result);  // "Alice, Bob, Charlie"

// 带前缀和后缀
String result2 = names.stream()
    .collect(Collectors.joining(", ", "[", "]"));

System.out.println(result2);  // "[Alice, Bob, Charlie]"
```

## 与 String.join 对比

| 特性        | StringJoiner           | String.join |
| ----------- | ---------------------- | ----------- |
| 前缀/后缀   | 支持                   | 不支持      |
| 空值处理    | 支持 `setEmptyValue()` | 不支持      |
| 链式调用    | 支持                   | 不支持      |
| Stream 集成 | 通过 Collector         | 直接转换    |

```java
// String.join 简单场景
String result1 = String.join(", ", "A", "B", "C");  // "A, B, C"

// StringJoiner 需要前缀/后缀场景
StringJoiner sj = new StringJoiner(", ", "[", "]");
sj.add("A").add("B").add("C");
String result2 = sj.toString();  // "[A, B, C]"
```

## 实际应用示例

```java
// 构建 SQL IN 子句
List<String> ids = List.of("1", "2", "3", "4");
StringJoiner sj = new StringJoiner(", ", "(", ")");
ids.forEach(sj::add);
String sql = "SELECT * FROM users WHERE id IN " + sj.toString();
// "SELECT * FROM users WHERE id IN (1, 2, 3, 4)"

// 构建 JSON 数组格式
List<String> items = List.of("apple", "banana", "cherry");
StringJoiner jsonSj = new StringJoiner(", ", "[", "]");
items.forEach(item -> jsonSj.add("\"" + item + "\""));
String json = jsonSj.toString();  // "["apple", "banana", "cherry"]"
```

---

## 参考

- [Java 官方文档 - StringJoiner](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/StringJoiner.html)
