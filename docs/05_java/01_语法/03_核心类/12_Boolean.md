# Boolean 包装类

`java.lang.Boolean` 是基本类型 `boolean` 的包装类。

## 特点

- 取值只有 `true` 和 `false`
- 不可变（Immutable）
- 内部只有两个实例：`Boolean.TRUE` 和 `Boolean.FALSE`

## 常用字段

```java
// 代表 true 的常量
Boolean.TRUE;

// 代表 false 的常量
Boolean.FALSE;

// 对应的 Class 对象
Boolean.TYPE;    // boolean.class
```

## 创建 Boolean

```java
// 使用 valueOf（推荐）
Boolean b1 = Boolean.valueOf(true);
Boolean b2 = Boolean.valueOf(false);

// 使用字符串解析
Boolean b3 = Boolean.valueOf("true");    // true
Boolean b4 = Boolean.valueOf("TRUE");    // true（不区分大小写）
Boolean b5 = Boolean.valueOf("false");   // false
Boolean b6 = Boolean.valueOf("abc");     // false（非 "true" 都返回 false）

// 使用 parseBoolean（返回基本类型）
boolean b7 = Boolean.parseBoolean("true");   // true
boolean b8 = Boolean.parseBoolean("TRUE");   // true
boolean b9 = Boolean.parseBoolean("abc");    // false
```

## 常用方法

```java
Boolean b = Boolean.valueOf(true);

// 转为基本类型
boolean val = b.booleanValue();

// 转为字符串
b.toString();              // "true"
Boolean.toString(true);    // "true"
Boolean.toString(false);   // "false"

// 逻辑运算
Boolean.logicalAnd(true, false);   // false
Boolean.logicalOr(true, false);    // true
Boolean.logicalXor(true, false);   // true

// 比较
Boolean b1 = Boolean.valueOf(true);
Boolean b2 = Boolean.valueOf(false);
b1.compareTo(b2);    // 1（true > false）
Boolean.compare(true, false);  // 1
b1.equals(b2);       // false
```

## 缓存机制

Boolean 只有两个实例，不需要缓存：

```java
Boolean b1 = Boolean.valueOf(true);
Boolean b2 = Boolean.valueOf(true);
System.out.println(b1 == b2);  // true（同一实例）

Boolean b3 = Boolean.TRUE;
Boolean b4 = Boolean.TRUE;
System.out.println(b3 == b4);  // true
```

> **建议**：使用 `Boolean.TRUE` 和 `Boolean.FALSE` 常量，或 `Boolean.valueOf()` 方法，避免使用构造器（已废弃）。

## 三元运算

```java
// 使用三元运算符
boolean condition = true;
int result = condition ? 1 : 0;

// Boolean 对象也可以
Boolean flag = Boolean.TRUE;
int value = flag ? 100 : 200;  // 100
```

---

## 参考

- [Java 官方文档 - Boolean](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Boolean.html)
