# StringBuilder

`java.lang.StringBuilder` 是可变的字符序列，用于高效地创建和修改字符串。

## 特点

- **可变（Mutable）**：内容可以修改，不会产生新对象
- **线程不安全**：性能比 `StringBuffer` 更好
- **高效拼接**：避免了 String 拼接时产生大量临时对象

## 继承关系

```
CharSequence
    └─ StringBuilder
```

> **注意**：`StringBuilder` 没有继承 `String`，但实现了 `CharSequence` 接口。

## 创建 StringBuilder

```java
// 创建空的 StringBuilder，默认容量 16
StringBuilder sb1 = new StringBuilder();

// 创建指定初始容量
StringBuilder sb2 = new StringBuilder(100);

// 使用字符串初始化
StringBuilder sb3 = new StringBuilder("Hello");
```

## 常用操作

### 添加

```java
StringBuilder sb = new StringBuilder();

// 尾部追加
sb.append("Hello");
sb.append(" ");
sb.append("World");

// 追加各种类型
sb.append(123);       // 整数
sb.append(3.14);      // 浮点数
sb.append(true);      // 布尔值
sb.append(new int[]{1, 2, 3});  // 数组

// 在指定位置插入
sb.insert(5, "!");    // 在索引 5 插入
sb.insert(0, "Say: ");  // 在开头插入

System.out.println(sb);  // "Say: Hello!World1233.14true[I@..."
```

### 删除

```java
StringBuilder sb = new StringBuilder("Hello World");

// 删除指定范围的字符（左闭右开）
sb.delete(5, 11);     // "Hello"

// 删除指定位置的字符
sb.deleteCharAt(4);   // "Hell"

// 清空所有内容
sb.setLength(0);      // ""
```

### 修改

```java
StringBuilder sb = new StringBuilder("Hello");

// 替换指定范围的字符
sb.replace(0, 5, "Hi");  // "Hi"

// 修改指定位置的字符
sb.setCharAt(0, 'h');    // "hi"

// 反转
sb.reverse();            // "ih"
```

### 获取

```java
StringBuilder sb = new StringBuilder("Hello World");

// 获取长度
sb.length();             // 11

// 获取容量（当前分配的内存空间）
sb.capacity();           // 27（默认 16 + 字符串长度 11）

// 获取指定位置的字符
sb.charAt(0);            // 'H'

// 截取子串（返回新 String，不修改原 StringBuilder）
sb.substring(6);         // "World"
sb.substring(0, 5);      // "Hello"

// 转为 String
String str = sb.toString();
```

### 查找

```java
StringBuilder sb = new StringBuilder("Hello World Hello");

// 查找子串第一次出现的位置
sb.indexOf("Hello");     // 0

// 查找子串最后一次出现的位置
sb.lastIndexOf("Hello"); // 12

// 从指定位置开始查找
sb.indexOf("Hello", 1);  // 12
```

## 扩容机制

当内容超出当前容量时，`StringBuilder` 会自动扩容：

```
新容量 = 旧容量 × 2 + 2
```

```java
StringBuilder sb = new StringBuilder(10);  // 初始容量 10
sb.append("Hello World");  // 长度 11，超出容量

// 扩容后：10 × 2 + 2 = 22
System.out.println(sb.capacity());  // 22
```

> **建议**：如果能预估字符串长度，创建时指定容量可以避免多次扩容。

## StringBuilder vs String 性能对比

```java
// 不推荐：String 拼接（每次产生新对象）
String s = "";
for (int i = 0; i < 10000; i++) {
    s += i;  // 每次创建新的 StringBuilder 和 String
}

// 推荐：StringBuilder 拼接（只产生一个对象）
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10000; i++) {
    sb.append(i);  // 只修改同一个对象
}
String result = sb.toString();
```

> **注意**：Java 编译器会对简单的 String 拼接进行优化（自动转为 StringBuilder），但循环中的拼接无法优化。

## 链式调用

`StringBuilder` 的方法返回自身，支持链式调用：

```java
String result = new StringBuilder()
    .append("Hello")
    .append(" ")
    .append("World")
    .append("!")
    .toString();

// 等价于
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" ");
sb.append("World");
sb.append("!");
String result2 = sb.toString();
```

## StringBuilder vs StringBuffer

| 特性 | StringBuilder | StringBuffer |
| --- | --- | --- |
| 线程安全 | 否 | 是（方法加 `synchronized`） |
| 性能 | 快 | 较慢 |
| 引入版本 | Java 5 | Java 1.0 |

> **实际开发中**，绝大多数场景使用 `StringBuilder` 即可。只有在多线程环境下才考虑 `StringBuffer`。
