# 通配符：extends 和 super

## 为什么需要通配符

泛型默认具有**不变性**：即使 `Integer` 是 `Number` 的子类型，`List<Integer>` 也不是 `List<Number>` 的子类型。

```java
List<Integer> integers = new ArrayList<>();
// List<Number> numbers = integers; // 编译错误
```

如果允许这种赋值，就能通过 `numbers` 向同一个列表添加 `Double`，破坏原本只存放 `Integer` 的类型约束。因此，接收 `List<Number>` 的方法不能直接接收 `List<Integer>`。

但很多方法只需要“读取数字”或“存入整数”，并不要求列表的元素类型恰好是 `Number` 或 `Integer`。通配符就是用来表达这种需求的：**放宽可接受的泛型类型，同时限制不安全的元素操作**。

## `?` 表示什么

`?` 表示一个未知的类型实参，不是“任意对象都能放进去”。一个 `List<?>` 引用指向的列表仍有自己的元素类型，只是当前引用没有说明它是什么。

以 `List` 为例，三种形式的区别如下：

| 形式 | 对未知元素类型的约束 | 可以接收的列表类型举例 |
| --- | --- | --- |
| `List<?>` | 不额外指定边界 | `List<String>`、`List<Integer>`、`List<Object>` |
| `List<? extends Number>` | 必须是 `Number` 或其子类型 | `List<Number>`、`List<Integer>`、`List<Double>` |
| `List<? super Integer>` | 必须是 `Integer` 或其父类型 | `List<Integer>`、`List<Number>`、`List<Object>` |

这里的边界约束的是**列表的类型实参**，不是某一个元素的运行时类型。“子类型”和“父类型”也包括接口相关的类型关系，并不限于类继承。

## 上界通配符：`? extends T`

### 含义：知道类型的上界，不知道具体类型

`List<? extends Number>` 可以理解为：这是一个元素类型未知的列表，但该类型一定是 `Number` 或其子类型。

因此，列表中的元素都可以当作 `Number` 使用。不过，不能据此认定它是 `List<Number>`，也不能认定它是 `List<Integer>`。

### 为什么可以读取，却不能随意写入

读取时，不论实际类型是 `Integer`、`Double` 还是 `Number`，元素都能安全赋值给 `Number`。

写入时，编译器必须确保值符合列表实际的元素类型。向其中添加 `Integer` 并不总是安全，因为列表可能是 `List<Double>`；添加 `Double` 也不总是安全，因为列表可能是 `List<Integer>`。

```java
List<? extends Number> numbers = new ArrayList<Integer>();

// 当前列表为空；这里仅在非空时演示读取
if (!numbers.isEmpty()) {
    Number value = numbers.get(0); // 可以读取为 Number
}
// numbers.add(1);   // 编译错误：不能确定未知类型能接收 Integer
// numbers.add(1.5); // 编译错误：不能确定未知类型能接收 Double
```

重点不是“不能添加 `Number` 的子类”，而是**不能确定任何指定的非 null 值符合那个未知的元素类型**。即使刚从列表取出一个 `Number`，也不能直接通过该引用将它写回，因为读取时已经失去了具体类型信息。

### `extends` 不代表不可修改

把它简称为“只读”容易产生误解。它限制的是通过该引用写入指定类型的元素，并不保证集合不可修改：

- `add(null)`、`set(index, null)` 在类型检查层面允许。
- `remove`、`clear` 等不需要提供未知元素类型值的操作仍可调用。
- 通过捕获未知类型的泛型辅助方法，可以进行某些类型安全的元素重排。

以上都是编译期的类型规则。运行时是否支持修改、是否允许 `null`，仍取决于具体集合实现。

## 下界通配符：`? super T`

### 含义：知道类型的下界，不知道具体类型

`List<? super Integer>` 可以理解为：这是一个元素类型未知的列表，但该类型一定是 `Integer` 或其父类型。

实际列表可以是 `List<Integer>`、`List<Number>` 或 `List<Object>`。这三种列表都能接收 `Integer`，因此可以通过该引用安全写入整数。

更一般地，`List<? super T>` 可以接收类型为 `T` 或 `T` 的子类型的值，但不能随意接收 `T` 的父类型的值。

### 为什么能写入 `Integer`，读取却只能保证是 `Object`

下界保证的是“列表能够接收 `Integer`”，不是“列表里全是 `Integer`”。如果实际列表是 `List<Object>`，它可能已经存放了字符串；如果是 `List<Number>`，也可能已经存放了 `Double`。

```java
List<Object> objects = new ArrayList<>();
objects.add("已有的字符串");
List<? super Integer> destination = objects;

destination.add(10); // 正确：所有允许的元素类型都能接收 Integer
Object value = destination.get(0); // 正确：读取结果只能保证为 Object
// Integer number = destination.get(0); // 编译错误：元素不一定是 Integer
// destination.add(1.5); // 编译错误：实际列表可能是 List<Integer>
```

所以，`super` 并不是“只能写、不能读”，而是**能按 `T` 写入，但不能直接把读出的元素当作 `T` 使用**。

## 无界通配符：`?`

对于 `List<?>`，既没有指定可读取的特定上界，也没有指定可写入的下界：

- 读取元素时，只能保证得到 `Object`。
- 通过该引用不能直接写入指定的非 null 元素，因为元素类型未知。
- 可以进行 `size`、`contains`、`remove`、`clear` 等不要求知道具体元素类型的操作。

`List<?>` 与 `List<Object>` 不同：前者可以引用各种元素类型的列表；后者要求列表的类型实参就是 `Object`，因而允许添加各种引用类型的对象。

当方法只是打印元素、统计数量或检查是否为空时，通常使用 `List<?>` 即可，不必为了形式而声明一个没有实际作用的 `<T>`。

## 如何选择：PECS 原则

**PECS = Producer Extends，Consumer Super。**

“生产者”和“消费者”是从**调用方法使用数据的角度**划分的：

- 参数向方法提供 `T` 类型的数据，是生产者，使用 `? extends T`。
- 参数接收方法写入的 `T` 类型数据，是消费者，使用 `? super T`。
- 同一个参数需要按同一种类型读取和写入时，通常使用 `List<T>`，明确关联读写的类型。

不要把 PECS 理解为“只要方法同时包含读和写，就不能使用通配符”。应分别分析每个参数的职责。

### 一个同时使用两种通配符的例子

```java
public static <T> void appendAll(
        List<? extends T> source,
        List<? super T> destination) {
    for (T element : source) {
        destination.add(element);
    }
}
```

这个方法将来源列表的元素追加到目标列表，假定目标列表支持添加，且来源与目标不是同一个列表或共享底层存储的视图。

- `source` 提供元素，所以使用 `extends`：读出的元素可以作为 `T`。
- `destination` 接收元素，所以使用 `super`：能够接收 `T`。
- `<T>` 将来源与目标联系起来，确保读出的类型能够写入目标。

例如，从 `List<Integer>` 追加到 `List<Number>` 或 `List<Object>` 都符合类型要求。从 `List<Number>` 追加到 `List<Integer>` 则不安全，因为来源可能包含 `Double`。

## 通配符与类型参数的区别

### `<T extends Number>`：声明一个有名字的类型参数

`T` 是一个可以在方法参数、返回值、局部变量中反复使用的类型名称。当多个位置需要保持类型关联时，使用类型参数。

例如，`<T extends Number> T first(List<T> list)` 可以把列表的元素类型与返回值类型关联起来：传入 `List<Integer>` 时，返回值可以是 `Integer`。

### `? extends Number`：使用一个未知类型

通配符出现在已有泛型类型的类型实参位置，如 `List<? extends Number>`。它没有一个供代码反复引用的名称，适合表达“只需要知道边界”的需求。

例如，`Number first(List<? extends Number> list)` 可以接收多种数字列表，但调用者只能根据该方法签名得到 `Number` 类型的返回值。

这两种 `extends` 用法不同：前者声明类型参数的边界，后者声明通配符的上界。**Java 支持 `? super T`，但不支持用 `<T super Number>` 声明类型参数。**

## 通配符捕获：让未知类型具有可引用的名字

有时并不需要知道具体类型是什么，只需要保证取出的元素仍按原类型写回。可以使用泛型辅助方法捕获这个未知类型：

```java
public static void swap(List<?> list, int i, int j) {
    swapCaptured(list, i, j);
}

private static <T> void swapCaptured(List<T> list, int i, int j) {
    T value = list.get(i);
    list.set(i, list.get(j));
    list.set(j, value);
}
```

编译器将通配符捕获为一个未知但固定的类型，并让辅助方法中的 `T` 表示它。因此，读取与写回保持类型一致；这不是推断出了元素真实的运行时类型，也不需要强制类型转换。

两个独立的 `List<?>` 不能因此直接互相交换元素，因为它们的未知元素类型未必相同。

## 常见误区

- **“`extends` 只能读，`super` 只能写”**：只是记忆口诀，不是完整规则。前者仍支持部分修改操作，后者仍可读取为 `Object`。
- **“`super Integer` 可以添加任意父类对象”**：边界限制的是列表的类型实参；安全写入的方向是 `Integer` 及其子类型，而不是任意 `Number` 或 `Object`。
- **“通配符改变了列表的实际类型”**：它改变的是当前引用的类型约束，不会把 `List<Integer>` 转成 `List<Number>`。
- **“泛型方法一定优于通配符”**：需要关联多个类型位置时使用 `<T>`；只需表达边界或与元素类型无关时使用通配符。
- **“编译通过就一定能修改集合”**：泛型检查只保证类型安全，不保证集合支持修改。不可修改的集合仍可能抛出 `UnsupportedOperationException`。

## 总结

| 声明 | 读取时能保证的类型 | 直接写入的元素类型（不计 `null`） | 主要用途 |
| --- | --- | --- | --- |
| `List<T>` | `T` | `T` 及其子类型 | 关联同一元素类型的读写 |
| `List<?>` | `Object` | 无 | 不依赖具体元素类型的操作 |
| `List<? extends T>` | `T` | 无 | 获取 `T` 类型的数据 |
| `List<? super T>` | `Object` | `T` 及其子类型 | 接收 `T` 类型的数据 |

记住核心方向：**`extends` 保证“取出来能当作 T”，`super` 保证“放进去的 T 能被接收”。**

## 参考

- [Oracle：上界通配符](https://docs.oracle.com/javase/tutorial/java/generics/upperBounded.html)
- [Oracle：下界通配符](https://docs.oracle.com/javase/tutorial/java/generics/lowerBounded.html)
- [Oracle：通配符使用准则](https://docs.oracle.com/javase/tutorial/java/generics/wildcardGuidelines.html)
