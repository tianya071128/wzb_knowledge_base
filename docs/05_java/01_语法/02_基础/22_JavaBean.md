# JavaBean

JavaBean 是一种特殊的 Java 类，遵循特定的编码约定。JavaBean 广泛用于数据封装和传输。

## JavaBean 的规范

一个标准的 JavaBean 需要满足以下要求：

1. **提供无参构造方法**
2. **所有字段私有化（private）**
3. **提供 public 的 getter 和 setter 方法**
4. **实现 `Serializable` 接口**（可选，用于序列化）

## 基本语法

```java
public class 类名 implements java.io.Serializable {
    // 私有字段
    private 类型 字段名;

    // 无参构造方法（默认提供）
    public 类名() {}

    // getter 和 setter 方法
    public 类型 get字段名() {
        return 字段名;
    }

    public void set字段名(类型 字段名) {
        this.字段名 = 字段名;
    }
}
```

## 示例：学生类

```java
public class Student implements java.io.Serializable {
    // 私有字段
    private String name;
    private int age;
    private String school;

    // 无参构造方法
    public Student() {
    }

    // 全参构造方法（可选）
    public Student(String name, int age, String school) {
        this.name = name;
        this.age = age;
        this.school = school;
    }

    // getter 和 setter
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age > 0 && age <= 150) {
            this.age = age;
        }
    }

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }
}
```

## 使用 JavaBean

```java
// 创建对象
Student student = new Student();

// 使用 setter 设置属性
student.setName("张三");
student.setAge(20);
student.setSchool("北京大学");

// 使用 getter 获取属性
System.out.println("姓名：" + student.getName());
System.out.println("年龄：" + student.getAge());
System.out.println("学校：" + student.getSchool());
```

## 命名规范

### getter 方法命名

| 字段类型   | 方法名前缀    | 示例                        |
| ---------- | ------------- | --------------------------- |
| 非 boolean | `get`         | `getName()`, `getAge()`     |
| boolean    | `is` 或 `get` | `isActive()`, `getActive()` |

### setter 方法命名

```java
// 非 boolean 类型
public void setName(String name) { ... }

// boolean 类型
public void setActive(boolean active) { ... }
// 或
public void setIsActive(boolean active) { ... }
```

## 构造方法

JavaBean 必须提供**无参构造方法**：

```java
public class Product implements java.io.Serializable {
    private String id;
    private String name;
    private double price;

    // 无参构造方法（必需）
    public Product() {
    }

    // 全参构造方法（可选，方便使用）
    public Product(String id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    // getter 和 setter 省略...
}

// 使用无参构造方法 + setter
Product p1 = new Product();
p1.setId("P001");
p1.setName("手机");
p1.setPrice(2999.0);

// 使用全参构造方法
Product p2 = new Product("P002", "电脑", 5999.0);
```

## JavaBean 与普通类的区别

| 特性     | JavaBean              | 普通类 |
| -------- | --------------------- | ------ |
| 构造方法 | 必须有无参构造        | 无要求 |
| 字段访问 | 必须私有化            | 无要求 |
| 方法命名 | 必须遵循 get/set 规范 | 无要求 |
| 序列化   | 通常实现 Serializable | 无要求 |
| 用途     | 数据传输、封装        | 通用   |

## 常见用法

### 数据传输对象（DTO）

```java
// 用于层与层之间的数据传输
public class UserDTO implements java.io.Serializable {
    private Long id;
    private String username;
    private String email;

    public UserDTO() {}

    // getter 和 setter 省略...
}
```

### 表单数据封装

```java
// 封装前端表单提交的数据
public class LoginForm implements java.io.Serializable {
    private String username;
    private String password;
    private boolean rememberMe;

    public LoginForm() {}

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isRememberMe() {
        return rememberMe;
    }

    public void setRememberMe(boolean rememberMe) {
        this.rememberMe = rememberMe;
    }
}
```

### 配置对象

```java
// 封装配置信息
public class DatabaseConfig implements java.io.Serializable {
    private String url;
    private String username;
    private String password;
    private int maxConnections;

    public DatabaseConfig() {
        // 默认值
        this.maxConnections = 10;
    }

    // getter 和 setter 省略...
}
```

## 注意事项

1. **字段命名**：使用驼峰命名法
2. **方法命名**：严格遵循 get/set 前缀规范
3. **无参构造**：必须提供，框架反射需要
4. **访问控制**：字段私有，方法公开
5. **序列化**：建议实现 `Serializable` 接口
6. **equals 和 hashCode**：建议重写，用于对象比较

