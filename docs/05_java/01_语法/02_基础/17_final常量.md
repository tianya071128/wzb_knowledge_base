# final 常量

`final` 关键字用于声明常量，一旦赋值就不可修改。常量可以提高代码的可读性和可维护性。

## 基本语法

```java
final 数据类型 常量名 = 值;
```

- 声明时必须初始化（或声明时赋值，或构造方法中赋值）
- 初始化后不可修改

## final 局部变量

```java
public void calculate() {
    final double PI = 3.14159;
    // PI = 3.14;  // ❌ 编译错误：不能修改 final 变量
}
```

## final 成员变量

final 字段必须在以下时机之一完成赋值：
1. **声明时赋值**
2. **构造方法中赋值**
3. **初始化代码块中赋值**

```java
public class Student {
    final int id;               // 声明时不赋值
    final String school = "一中";  // 声明时赋值

    public Student(int id) {
        this.id = id;           // 构造方法中赋值
    }
}
```

> **注意**：final 字段如果没有在声明时赋值，则**每个构造方法**都必须对其赋值。

## 静态常量

`static final` 组合用于定义全局常量，属于类本身：

```java
public class MathConstants {
    public static final double PI = 3.14159;
    public static final double E = 2.71828;
    public static final int MAX_SIZE = 100;
}

System.out.println(MathConstants.PI);  // 3.14159
```

> **命名规范**：常量名使用**全大写**，单词间用**下划线**分隔。

## final 方法

`final` 修饰的方法不能被子类重写：

```java
public class Animal {
    public final void breathe() {
        System.out.println("呼吸中...");
    }
}

public class Dog extends Animal {
    // ❌ 编译错误：不能重写 final 方法
    // @Override
    // public void breathe() { ... }
}
```

## final 类

`final` 修饰的类不能被继承：

```java
public final class String { ... }  // String 是 final 类，无法继承

// ❌ 编译错误：不能继承 final 类
// public class MyString extends String { }
```

## final 参数

`final` 修饰方法参数，表示参数在方法体内不可修改：

```java
public void greet(final String name) {
    System.out.println("你好，" + name);
    // name = "其他";  // ❌ 编译错误：不能修改 final 参数
}
```

## final 与不可变对象

将字段声明为 `final` 是创建**不可变对象**的关键：

```java
public final class ImmutablePoint {
    private final int x;
    private final int y;

    public ImmutablePoint(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }
}
```

> **不可变对象的规则**：
> 1. 类声明为 `final`（防止子类破坏不可变性）
> 2. 所有字段声明为 `private final`
> 3. 不提供 setter 方法
> 4. 构造方法中初始化所有字段

## 常见用法

### 配置常量

```java
public class AppConfig {
    public static final String APP_NAME = "MyApp";
    public static final int VERSION_CODE = 100;
    public static final long TIMEOUT_MS = 5000L;
    public static final boolean DEBUG = false;
}
```

### 单例模式

```java
public class Singleton {
    private static final Singleton INSTANCE = new Singleton();

    private Singleton() { }

    public static Singleton getInstance() {
        return INSTANCE;
    }
}
```

### 枚举类型

```java
public enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY;
}

// 枚举常量本质上是 public static final 字段
Day today = Day.MONDAY;
```
