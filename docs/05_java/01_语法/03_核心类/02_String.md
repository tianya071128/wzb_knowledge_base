# String 字符串

`java.lang.String` 是 Java 中最常用的引用类型，表示不可变的 Unicode 字符序列。

## 特点

- **不可变（Immutable）**：字符串创建后内容不能改变，修改操作会返回新对象
- **线程安全**：由于不可变性，天然线程安全
- **final 类**：`String` 类被 `final` 修饰，不能被继承
- **字符编码**：内部使用 `byte[]` 存储，Java 9+ 支持 Latin-1 和 UTF-16 两种编码

## 创建字符串

```java
// 1. 字面量（字符串常量池）
String s1 = "hello";

// 2. new 关键字（堆中新对象）
String s2 = new String("hello");

// 3. 字符数组
char[] chars = {'h', 'e', 'l', 'l', 'o'};
String s3 = new String(chars);

// 4. 字节数组
byte[] bytes = {104, 101, 108, 108, 111};
String s4 = new String(bytes);  // 使用平台默认编码
String s5 = new String(bytes, StandardCharsets.UTF_8);  // 指定编码
```

## 字符串常量池

Java 使用**字符串常量池**来优化字符串的内存使用：

```java
String s1 = "hello";           // 放入常量池
String s2 = "hello";           // 复用常量池中的对象
String s3 = new String("hello");  // 堆中新对象

System.out.println(s1 == s2);       // true（同一对象）
System.out.println(s1 == s3);       // false（不同对象）
System.out.println(s1.equals(s3));  // true（内容相同）

// intern()：将字符串放入常量池或获取池中的引用
String s4 = s3.intern();
System.out.println(s1 == s4);  // true
```

## 常用操作

### 获取

```java
String str = "Hello World";

// 获取字符串长度
str.length();              // 11

// 根据下标获取字符，下标从 0 开始
str.charAt(0);             // 'H'
str.charAt(6);             // 'W'

// 获取子串第一次出现的下标，找不到返回 -1
str.indexOf("World");      // 6
str.indexOf("xyz");        // -1（不存在）

// 获取子串最后一次出现的下标
str.lastIndexOf("l");      // 9

// 截取子串
str.substring(6);          // "World"（从下标 6 到末尾）
str.substring(0, 5);       // "Hello"（左闭右开，[0, 5)）
```

### 判断

```java
String str = "Hello";

// 判断是否为空字符串（长度为 0）
str.isEmpty();             // false

// 判断是否为空白（Java 11+，空白字符也返回 true）
str.isBlank();             // false

// 判断内容是否相等（必须用 equals，不能用 ==）
str.equals("Hello");       // true

// 判断内容是否相等（忽略大小写）
str.equalsIgnoreCase("hello");  // true

// 判断是否以指定前缀开头
str.startsWith("He");      // true

// 判断是否以指定后缀结尾
str.endsWith("lo");        // true

// 判断是否包含指定子串
str.contains("ell");       // true
```

### 转换

```java
String str = "Hello";

// 转为大写
str.toUpperCase();         // "HELLO"

// 转为小写
str.toLowerCase();         // "hello"

// 去除首尾空白（只支持 ASCII 空白）
str.trim();                // "Hello"

// 去除首尾空白（Java 11+，支持 Unicode 空白）
str.strip();               // "Hello"

// 替换字符
str.replace("l", "x");     // "Hexxo"

// 替换字符串
str.replace("ll", "xx");   // "Hexxo"

// 正则替换（替换所有匹配项）
str.replaceAll("[aeiou]", "*");  // "H*ll*"

// 正则替换（只替换第一个匹配项）
str.replaceFirst("[aeiou]", "*");  // "H*llo"

// 分割字符串，返回数组
"a,b,c,d".split(",");      // ["a", "b", "c", "d"]

// 限制分割次数
"a,b,c,d".split(",", 2);   // ["a", "b,c,d"]

// 连接字符串
String.join("-", "a", "b", "c");  // "a-b-c"
String.join(",", List.of("a", "b", "c"));  // "a,b,c"
```

### 格式化

```java
// String.format（Java 5+）
String s1 = String.format("Name: %s, Age: %d", "Tom", 20);
String s2 = String.format("Price: %.2f", 3.14159);  // "Price: 3.14"

// 常用格式化符号
// %s - 字符串
// %d - 整数
// %f - 浮点数
// %.2f - 保留两位小数
// %n - 换行符

// printf（直接输出）
System.out.printf("Name: %s, Age: %d%n", "Tom", 20);
```

### 其他

```java
String str = "Hello";

// 转为字符数组
char[] chars = str.toCharArray();  // ['H', 'e', 'l', 'l', 'o']

// 转为字节数组（使用平台默认编码）
byte[] bytes = str.getBytes();

// 转为字节数组（指定编码）
byte[] utf8Bytes = str.getBytes(StandardCharsets.UTF_8);

// 其他类型转为 String
String.valueOf(123);       // "123"
String.valueOf(true);      // "true"
String.valueOf(null);      // "null"

// 重复字符串（Java 11+）
"abc".repeat(3);           // "abcabcabc"

// 文本块（Java 15+，支持多行字符串）
String json = """
        {
            "name": "Tom",
            "age": 20
        }
        """;
```

## 不可变性原理

```java
// String 内部结构（简化）
public final class String {
    private final byte[] value;  // final 修饰，不可修改

    // 所有修改操作都返回新对象
    public String substring(int beginIndex, int endIndex) {
        return new String(value, beginIndex, endIndex - beginIndex);
    }
}
```

**不可变的好处**：

1. **线程安全**：可被多个线程共享
2. **缓存哈希码**：适合作为 HashMap 的键
3. **字符串常量池**：节省内存
4. **安全性**：作为参数传递时不会被修改
