import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Main {
  public static void main(String[] args) {
    /**
     * List: java.util.List，接口，定义了有序、可重复集合的规范；
     * ArrayList: java.util.ArrayList，实现类，底层基于动态数组，是 List 接口最常用的实现
     * LinkedList: java.util.LinkedList，实现类，底层基于双向链表
     */

    // 创建 List
    ArrayList<String> list = new ArrayList<>();
    List<String> list2 = List.of("a", "b", "c"); // 创建不可变只读 List

    // 1. 添加元素
    list.add("hello"); // 尾部插入
    list.add(0, "word"); // 指定位置插入
    list.addFirst("first"); // 头部插入
    list.addLast("last"); // 尾部插入
    list.addAll(List.of("a", "b", "c", "d")); // 批量添加到尾部
    System.out.println(list);

    // 2. 删除元素
    list.remove(1); // 删除指定位置的元素, 返回被删除的元素
    list.remove("first"); // 根据元素删除, 返回是否删除的标志
    list.removeFirst(); // 删除头部元素, 返回被删除的元素
    list.removeLast(); // 删除尾部元素, 返回被删除的元素
    list.removeAll(List.of("a")); // 批量指定的元素
    list.retainAll(List.of("b")); // 保留满足条件的元素, 删除其他元素
    list.removeIf(item -> item.equals("c")); // 删除满足条件的元素
    // list.clear(); // 删除所有元素
    System.out.println(list);

    // 3. 修改元素
    list.set(0, "new hello"); // 修改指定位置的元素, 返回旧的元素
    System.out.println(list);

    // 4. 查询元素
    System.out.println(list.get(0)); // 获取指定位置的元素
    System.out.println(list.indexOf("new hello")); // 获取指定元素的索引
    System.out.println(list.lastIndexOf("new hello")); // 获取指定元素的索引, 从尾

    // 5. 判断
    System.out.println(list.contains("new hello")); // 判断是否包含指定元素
    System.out.println(list.containsAll(List.of("new hello", "b"))); // 判断是否包含指定所有元素
    System.out.println(list.isEmpty()); // 判断是否为空
    System.out.println(list.size()); // 获取元素个数

    // 6. 截取
    System.out.println(list.subList(0, 1)); // 视图截取（不产生新集合，底层和原集合共用数据）
    System.out.println(new ArrayList<>(list.subList(0, 1))); // 生成全新独立集合（业务开发推荐）

    // 7. 遍历
    list.forEach(item -> System.out.println(item));
    for (String item : list) {
      System.out.println(item);
    }

    // 8. 排序
    list.sort(String::compareTo); // 字典升序
    list.sort((a, b) -> b.compareTo(a)); // 字典倒序
    System.out.println(list);

    // 9. 转换
    String[] list3 = list.toArray(new String[0]); // 转换为数组, 参数用于保证类型

    // 其他
    list.replaceAll(e -> e.toUpperCase()); // 将所有元素更改为大写
    System.out.println(list.equals(list)); // 判断两个集合是否相等 --> 元素顺序、内容完全一致才相等
    System.out.println(list);
  }
}

class Person {
  String firstName;
  String lastName;
  int age;

  public Person(String firstName, String lastName, int age) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
  }

  /**
   * 当自定义类时, 默认情况下, List.equals() 方法比较的是两个对象是否为同一个对象
   * 可以重写 equals 方法改写比较方法
   */
  @Override
  public boolean equals(Object o) {
    if (!(o instanceof Person p))
      return false;

    return Objects.equals(firstName, p.firstName) &&
        Objects.equals(lastName, p.lastName) &&
        age == p.age;
  }
}