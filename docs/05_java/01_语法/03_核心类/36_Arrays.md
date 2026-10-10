# Arrays

`Arrays` 是 Java 提供的数组工具类，包含用于数组操作的各种方法，如排序、搜索、比较、填充等。

## 常用方法概览

| 方法             | 说明                       |
| ---------------- | -------------------------- |
| `sort()`         | 对数组进行排序             |
| `binarySearch()` | 二分查找（数组必须已排序） |
| `equals()`       | 比较两个数组是否相等       |
| `fill()`         | 用指定值填充数组           |
| `copyOf()`       | 复制数组到指定长度         |
| `copyOfRange()`  | 复制数组指定范围的元素     |
| `asList()`       | 将数组转换为 List          |
| `toString()`     | 返回数组的字符串表示       |

## 排序：sort()

对数组进行升序排序：

```java
import java.util.Arrays;

// 基本类型排序
int[] numbers = {5, 2, 8, 1, 9, 3};
Arrays.sort(numbers);
System.out.println(Arrays.toString(numbers));  // [1, 2, 3, 5, 8, 9]

// 字符串排序
String[] names = {"Charlie", "Alice", "Bob"};
Arrays.sort(names);
System.out.println(Arrays.toString(names));  // [Alice, Bob, Charlie]
```

### 指定范围排序

```java
int[] arr = {5, 2, 8, 1, 9, 3};
// 对索引 1（包含）到 4（不包含）的元素排序
Arrays.sort(arr, 1, 4);
System.out.println(Arrays.toString(arr));  // [5, 1, 2, 8, 9, 3]
```

### 自定义排序（降序）

```java
Integer[] numbers = {5, 2, 8, 1, 9, 3};

// 使用 Comparator 降序排序
Arrays.sort(numbers, (a, b) -> b - a);
System.out.println(Arrays.toString(numbers));  // [9, 8, 5, 3, 2, 1]

// 或者使用 Comparator.reverseOrder()
Arrays.sort(numbers, Comparator.reverseOrder());
```

> **注意**：基本类型数组不支持自定义排序，需要使用包装类型数组。

## 二分查找：binarySearch()

在**已排序**的数组中查找指定元素的索引：

```java
int[] arr = {1, 2, 3, 5, 8, 9};

// 查找存在的元素
int index = Arrays.binarySearch(arr, 5);
System.out.println(index);  // 3

// 查找不存在的元素
int index2 = Arrays.binarySearch(arr, 4);
System.out.println(index2);  // 负数（插入点的负值 - 1）
```

> **注意**：数组必须已排序，否则结果不正确。

## 比较数组：equals()

比较两个数组是否相等（长度相同且对应元素相等）：

```java
int[] arr1 = {1, 2, 3};
int[] arr2 = {1, 2, 3};
int[] arr3 = {1, 2, 4};

System.out.println(Arrays.equals(arr1, arr2));  // true
System.out.println(Arrays.equals(arr1, arr3));  // false

// 深度比较（多维数组）
int[][] matrix1 = {{1, 2}, {3, 4}};
int[][] matrix2 = {{1, 2}, {3, 4}};
System.out.println(Arrays.deepEquals(matrix1, matrix2));  // true
```

## 填充数组：fill()

用指定值填充数组：

```java
// 填充整个数组
int[] arr = new int[5];
Arrays.fill(arr, 10);
System.out.println(Arrays.toString(arr));  // [10, 10, 10, 10, 10]

// 填充指定范围
int[] arr2 = {1, 2, 3, 4, 5};
Arrays.fill(arr2, 1, 4, 0);  // 索引 1（包含）到 4（不包含）填充为 0
System.out.println(Arrays.toString(arr2));  // [1, 0, 0, 0, 5]
```

## 复制数组

### copyOf() - 复制指定长度

```java
int[] original = {1, 2, 3, 4, 5};

// 复制为更长的数组（多余位置填 0）
int[] longer = Arrays.copyOf(original, 8);
System.out.println(Arrays.toString(longer));  // [1, 2, 3, 4, 5, 0, 0, 0]

// 复制为更短的数组（截断）
int[] shorter = Arrays.copyOf(original, 3);
System.out.println(Arrays.toString(shorter));  // [1, 2, 3]
```

### copyOfRange() - 复制指定范围

```java
int[] original = {1, 2, 3, 4, 5};

// 复制索引 1（包含）到 4（不包含）的元素
int[] sub = Arrays.copyOfRange(original, 1, 4);
System.out.println(Arrays.toString(sub));  // [2, 3, 4]
```

## 数组转集合：asList()

将数组转换为 `List`：

```java
// 字符串数组转 List
String[] names = {"Alice", "Bob", "Charlie"};
List<String> list = Arrays.asList(names);
System.out.println(list);  // [Alice, Bob, Charlie]

// 注意：返回的 List 大小固定，不能添加或删除元素
// list.add("David");  // ❌ UnsupportedOperationException
```

### 常见陷阱

```java
// ❌ 错误：基本类型数组不能直接转 List
int[] numbers = {1, 2, 3};
List<int[]> wrongList = Arrays.asList(numbers);  // 得到的是 List<int[]>，不是 List<Integer>

// ✅ 正确：使用包装类型
Integer[] nums = {1, 2, 3};
List<Integer> correctList = Arrays.asList(nums);

// ✅ 或者使用 Stream（Java 8+）
List<Integer> streamList = Arrays.stream(numbers).boxed().collect(Collectors.toList());
```

## 字符串表示：toString()

将数组转换为可读的字符串：

```java
int[] arr = {1, 2, 3, 4, 5};
System.out.println(Arrays.toString(arr));  // [1, 2, 3, 4, 5]

// 多维数组使用 deepToString()
int[][] matrix = {{1, 2}, {3, 4}};
System.out.println(Arrays.deepToString(matrix));  // [[1, 2], [3, 4]]
```

## 其他实用方法

### stream() - 获取数组流（Java 8+）

```java
int[] numbers = {1, 2, 3, 4, 5};

// 求和
int sum = Arrays.stream(numbers).sum();
System.out.println(sum);  // 15

// 最大值
int max = Arrays.stream(numbers).max().orElse(0);
System.out.println(max);  // 5

// 过滤并收集
List<Integer> evenNumbers = Arrays.stream(numbers)
    .filter(n -> n % 2 == 0)
    .boxed()
    .collect(Collectors.toList());
System.out.println(evenNumbers);  // [2, 4]
```

### parallelSort() - 并行排序（Java 8+）

```java
int[] largeArray = new int[1000000];
// 填充随机数
new Random().ints(largeArray).forEach(System.out::println);

// 并行排序（利用多核 CPU，大数据量时更快）
Arrays.parallelSort(largeArray);
```

### mismatch() - 查找不匹配位置（Java 9+）

```java
int[] arr1 = {1, 2, 3, 4, 5};
int[] arr2 = {1, 2, 9, 4, 5};

int mismatchIndex = Arrays.mismatch(arr1, arr2);
System.out.println(mismatchIndex);  // 2（索引 2 处开始不同）

// 完全相同返回 -1
int[] arr3 = {1, 2, 3, 4, 5};
System.out.println(Arrays.mismatch(arr1, arr3));  // -1
```

## 完整示例

```java
import java.util.Arrays;

public class ArraysDemo {
    public static void main(String[] args) {
        // 创建数组
        int[] scores = {85, 92, 78, 95, 88, 76, 90};

        // 排序
        Arrays.sort(scores);
        System.out.println("排序后：" + Arrays.toString(scores));

        // 查找
        int index = Arrays.binarySearch(scores, 90);
        System.out.println("90 分的索引：" + index);

        // 复制部分数组
        int[] topScores = Arrays.copyOfRange(scores, 4, scores.length);
        System.out.println("较高分数：" + Arrays.toString(topScores));

        // 填充
        int[] defaults = new int[5];
        Arrays.fill(defaults, 60);
        System.out.println("默认分数：" + Arrays.toString(defaults));

        // 转 List
        Integer[] nums = {1, 2, 3, 4, 5};
        List<Integer> list = Arrays.asList(nums);
        System.out.println("List：" + list);

        // 统计
        int sum = Arrays.stream(scores).sum();
        double avg = Arrays.stream(scores).average().orElse(0);
        System.out.println("总分：" + sum + "，平均分：" + avg);
    }
}
```

## Arrays 与 Collections 对比

| 特性           | Arrays                  | Collections                      |
| -------------- | ----------------------- | -------------------------------- |
| **操作对象**   | 数组                    | 集合（List, Set, Map）           |
| **排序**       | `Arrays.sort()`         | `Collections.sort()`             |
| **查找**       | `Arrays.binarySearch()` | `Collections.binarySearch()`     |
| **转数组**     | -                       | `collection.toArray()`           |
| **转集合**     | `Arrays.asList()`       | -                                |
| **不可变集合** | -                       | `Collections.unmodifiableList()` |
| **单元素集合** | -                       | `Collections.singletonList()`    |

## 注意事项

1. **排序后才能二分查找**：`binarySearch()` 要求数组已排序
2. **基本类型 vs 包装类型**：基本类型数组不能直接用 `asList()` 转 List
3. **`asList()` 返回固定大小的 List**：不能添加或删除元素
4. **`toString()` vs `deepToString()`**：一维数组用 `toString()`，多维数组用 `deepToString()`
5. **并行排序适用大数据量**：小数组用 `sort()` 即可
