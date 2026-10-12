# Lambda 表达式

## 什么是 Lambda 表达式

Lambda 表达式是 Java 8 引入的一种**匿名函数**语法，它允许将函数作为参数传递或作为值使用，而无需声明额外的类。Lambda 表达式是实现**函数式编程**的基础工具，极大地简化了代码编写。

Lambda 表达式的本质是**函数式接口的实例**——编译器在编译时会自动将 Lambda 表达式转换为对应函数式接口的匿名内部类实现。

## 基本语法

Lambda 表达式的语法由三部分组成：

```
(参数列表) -> { 方法体 }
```

| 组成部分 | 说明                                          |
| -------- | --------------------------------------------- |
| 参数列表 | 函数式接口中抽象方法的参数，类型可省略        |
| `->`     | Lambda 操作符（箭头操作符），分隔参数和方法体 |
| 方法体   | 单条表达式或多条语句（多条时需用 `{}` 包裹）  |

### 语法演变：从完整到简洁

以下以 `Runnable` 接口（无参、无返回值）为例，展示语法的逐步简化：

```java
// 1. 匿名内部类写法（Java 8 之前）
Runnable task = new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello");
    }
};

// 2. 完整 Lambda 写法
Runnable task = () -> {
    System.out.println("Hello");
};

// 3. 方法体只有一条语句时，可省略花括号
Runnable task = () -> System.out.println("Hello");
```

### 参数列表的简化规则

```java
// 1. 完整写法：声明参数类型
Comparator<String> comp = (String a, String b) -> a.length() - b.length();

// 2. 类型推断：省略参数类型（编译器自动推断）
Comparator<String> comp = (a, b) -> a.length() - b.length();

// 3. 单参数：省略圆括号
Consumer<String> printer = s -> System.out.println(s);

// 4. 无参数：保留空圆括号
Runnable task = () -> System.out.println("done");
```

### 方法体的简化规则

```java
// 1. 方法体有多条语句：必须使用花括号，有 return 时需显式写 return
Comparator<Integer> comp = (a, b) -> {
    int diff = a - b;
    return diff > 0 ? 1 : -1;
};

// 2. 方法体只有一条返回语句：省略花括号和 return 关键字
Comparator<Integer> comp = (a, b) -> a - b;

// 3. 方法体只有一条 void 调用：省略花括号
Consumer<String> printer = s -> System.out.println(s);
```

## Lambda 表达式的使用场景

### 1. 替代匿名内部类

Lambda 最常见的用途是替代只实现一个方法的匿名内部类，使代码更加简洁。

```java
// 线程创建
// 之前：
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("running");
    }
}).start();

// 之后：
new Thread(() -> System.out.println("running")).start();
```

```java
// 事件监听
button.addActionListener(e -> System.out.println("clicked"));
```

### 2. 集合的遍历和操作

Lambda 与 Stream API 结合，可以以声明式的方式处理集合数据。

```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

// forEach 遍历
names.forEach(name -> System.out.println(name));

// filter 过滤 + collect 收集
List<String> longNames = names.stream()
    .filter(name -> name.length() > 3)
    .collect(Collectors.toList());

// map 转换
List<Integer> lengths = names.stream()
    .map(name -> name.length())
    .collect(Collectors.toList());

// sort 排序
names.sort((a, b) -> a.compareTo(b));
```

### 3. 作为方法参数传递

Lambda 可以作为参数传递给接受函数式接口的方法。

```java
// 自定义方法：接受 Predicate 进行过滤
public static <T> List<T> filter(List<T> list, Predicate<T> predicate) {
    List<T> result = new ArrayList<>();
    for (T item : list) {
        if (predicate.test(item)) {
            result.add(item);
        }
    }
    return result;
}

// 使用
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);
List<Integer> evens = filter(numbers, n -> n % 2 == 0);
List<Integer> bigNumbers = filter(numbers, n -> n > 3);
```

### 4. 延迟执行与条件执行

Lambda 可以封装一段逻辑，在满足条件时才执行。

```java
// 日志框架中的延迟执行
public void log(Level level, Supplier<String> messageSupplier) {
    if (level.intValue() >= currentLevel.intValue()) {
        // 只有日志级别满足时才执行 Supplier 获取消息
        log(messageSupplier.get());
    }
}

// 使用：即使不需要输出，也不会执行字符串拼接
log(Level.FINE, () -> "User " + userId + " performed " + action);
```

## 变量捕获（闭包）

Lambda 表达式可以访问外部作用域的变量，这与匿名内部类的行为类似，但有更严格的限制。

### 访问局部变量

Lambda 中引用的局部变量必须是**事实上的最终变量**（effectively final）——即变量在初始化后不能被重新赋值。

```java
int factor = 10;
// Lambda 捕获外部变量 factor
Function<Integer, Integer> multiplier = x -> x * factor;
System.out.println(multiplier.apply(5)); // 50

// 错误：factor 被重新赋值，不再是 effectively final
// factor = 20; // 如果取消注释，上面的 Lambda 将编译报错
```

### 访问实例字段和静态字段

与局部变量不同，Lambda 可以自由读写实例字段和静态字段。

```java
public class Counter {
    private int count = 0; // 实例字段

    public Runnable getIncrementer() {
        // Lambda 表达式
        return () -> count++; // 可以修改实例字段
    }
}
```

### 变量捕获的原理

Lambda 捕获的是变量的**值**而非变量本身（对于局部变量）。这就是为什么局部变量必须是 effectively final 的原因——编译器在编译时将捕获的值复制到 Lambda 内部，如果允许修改外部变量，会导致数据不一致。

## Lambda 与 this 关键字

Lambda 表达式**不会创建新的作用域**，因此 Lambda 中的 `this` 指向的是**定义 Lambda 的外部类的实例**，而不是 Lambda 自身。这与匿名内部类不同——匿名内部类的 `this` 指向自身实例。

```java
public class LambdaThisDemo {
    private String name = "Outer";

    public void demo() {
        // Lambda 中的 this 指向外部类实例
        Runnable task = () -> {
            System.out.println(this.name); // 输出 "Outer"
        };
        task.run();
    }
}
```

```java
public class AnonymousInnerThisDemo {
    private String name = "Outer";

    public void demo() {
        // 匿名内部类中的 this 指向内部类自身
        Runnable task = new Runnable() {
            private String name = "Inner";
            @Override
            public void run() {
                System.out.println(this.name); // 输出 "Inner"
                System.out.println(AnonymousInnerThisDemo.this.name); // 输出 "Outer"
            }
        };
        task.run();
    }
}
```

## 类型推断

Java 编译器能够根据上下文自动推断 Lambda 表达式的类型，这一过程称为**目标类型推断**（Target Type Inference）。

```java
// 编译器根据变量声明类型推断 Lambda 参数类型
Predicate<String> isEmpty = s -> s.isEmpty();
// s 被推断为 String 类型

// 编译器根据方法参数类型推断
List<String> list = Arrays.asList("a", "b", "c");
list.sort((a, b) -> a.compareTo(b));
// a, b 被推断为 String 类型
```

## 注意事项与最佳实践

### 1. Lambda 不是独立的对象

Lambda 表达式本身不是一个对象，它必须被赋值给函数式接口类型或作为接受函数式接口参数的方法实参。

```java
// 正确：赋值给函数式接口
Runnable task = () -> System.out.println("hello");

// 错误：不能赋值给 Object（Object 不是函数式接口）
// Object obj = () -> System.out.println("hello"); // 编译错误
```

### 2. 避免在 Lambda 中修改外部集合

虽然 Lambda 可以修改外部集合的内容（如添加、删除元素），但这种做法会产生副作用，违背函数式编程的原则，且在并行流中会导致并发问题。

```java
// 不推荐：在 Lambda 中修改外部集合
List<String> result = new ArrayList<>();
names.forEach(name -> result.add(name.toUpperCase()));

// 推荐：使用 Stream API 的 map + collect
List<String> result = names.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

### 3. 保持 Lambda 简洁

当 Lambda 方法体超过 3 行时，建议将逻辑抽取为独立方法，然后通过方法引用调用。

```java
// 不推荐：Lambda 方法体过长
users.stream()
    .filter(u -> {
        // 复杂的过滤逻辑...
        // 5+ 行代码
    })
    .collect(Collectors.toList());

// 推荐：抽取为方法
users.stream()
    .filter(this::isActiveUser)
    .collect(Collectors.toList());
```

### 4. 注意自动装箱的性能开销

在使用基本类型时，优先使用专门的函数式接口（如 `IntFunction`、`LongConsumer`）来避免自动装箱。

```java
// 不推荐：使用 Function<Integer, Integer>，涉及自动装箱
Function<Integer, Integer> square = x -> x * x;

// 推荐：使用 IntUnaryOperator，无自动装箱
IntUnaryOperator square = x -> x * x;
```

## 总结

Lambda 表达式是 Java 函数式编程的核心语法特性：

- **语法**：`(参数) -> { 方法体 }`，支持多种简化写法
- **本质**：函数式接口的匿名实现，编译时由编译器自动转换
- **变量捕获**：局部变量必须是 effectively final，`this` 指向外部类
- **配合使用**：与 Stream API、方法引用、内置函数式接口共同构成 Java 函数式编程体系
