# 根类 Object

`java.lang.Object` 是 Java 中所有类的根类。Java 中的每个类都直接或间接继承自 `Object`，因此所有对象都拥有 `Object` 类的方法。

> **注意**：即使一个类没有显式使用 `extends Object`，它也会自动继承 `Object`。

## Object 类的方法

| 方法                 | 说明                     |
| -------------------- | ------------------------ |
| `toString()`         | 返回对象的字符串表示     |
| `equals(Object obj)` | 判断两个对象是否相等     |
| `hashCode()`         | 返回对象的哈希码值       |
| `getClass()`         | 返回对象的运行时类       |
| `clone()`            | 创建并返回对象的副本     |
| `finalize()`         | 垃圾回收前调用（已废弃） |
| `wait()`             | 使当前线程等待           |
| `notify()`           | 唤醒一个等待的线程       |
| `notifyAll()`        | 唤醒所有等待的线程       |

### toString()

返回对象的字符串表示。默认返回 `类名@哈希码`，通常需要重写。

```java
// 默认实现
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
}

// 重写示例
class Student {
    String name;
    int age;

    @Override
    public String toString() {
        return "Student{name='" + name + "', age=" + age + "}";
    }
}

Student s = new Student();
s.name = "Tom";
s.age = 20;
System.out.println(s);  // Student{name='Tom', age=20}
```

### equals()

判断两个对象是否相等。默认使用 `==` 比较引用，通常需要重写。

```java
// 默认实现
public boolean equals(Object obj) {
    return (this == obj);
}

// 重写示例
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

Student s1 = new Student("Tom", 20);
Student s2 = new Student("Tom", 20);
System.out.println(s1.equals(s2));  // true
```

### hashCode()

返回对象的哈希码值。与 `equals()` 有约定：**相等的对象必须有相同的哈希码**。

```java
// 约定规则
// 1. 如果 a.equals(b) 为 true，则 a.hashCode() == b.hashCode()
// 2. 如果 a.hashCode() != b.hashCode()，则 a.equals(b) 为 false
// 3. 如果 a.hashCode() == b.hashCode()，a.equals(b) 不一定为 true（哈希冲突）

// 重写示例
class Student {
    String name;
    int age;

    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }

    @Override
    public boolean equals(Object obj) {
        // ...
    }
}
```

> **重要**：重写 `equals()` 时必须同时重写 `hashCode()`，否则在 HashMap/HashSet 中会出现问题。

### getClass()

返回对象的运行时类。

```java
String str = "hello";
Class<?> clazz = str.getClass();
System.out.println(clazz.getName());  // java.lang.String
System.out.println(clazz.getSimpleName());  // String
```

### clone()

创建并返回对象的副本。类必须实现 `Cloneable` 接口。

```java
class Student implements Cloneable {
    String name;
    int age;

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}

Student s1 = new Student();
s1.name = "Tom";
Student s2 = (Student) s1.clone();  // 浅拷贝
```

> **注意**：`clone()` 是浅拷贝，如果对象包含引用类型字段，需要实现深拷贝。

## 常用方法示例

```java
Object obj = "Hello";

// toString
String str = obj.toString();  // "Hello"

// equals
boolean isEqual = obj.equals("Hello");  // true

// hashCode
int hash = obj.hashCode();  // 哈希码值

// getClass
Class<?> clazz = obj.getClass();  // java.lang.String
```
