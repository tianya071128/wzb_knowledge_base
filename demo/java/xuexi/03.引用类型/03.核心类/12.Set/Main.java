import java.util.HashSet;
import java.util.Set;

public class Main {
  public static void main(String[] args) {
    /**
     * Set: 接口, 元素不允许重复
     * 
     * 实现类:
     * - HashSet: 底层基于 HashMap, 无序, 不重复
     * - LinkedHashSet: 底层基于 LinkedHashMap, 顺序和添加顺序一致, 不重复
     * - TreeSet: 底层基于 TreeMap, 升序, 不重复
     */

    // 创建
    HashSet<String> set = new HashSet<>();
    HashSet<String> set2 = new HashSet<>(Set.of("Hello", "Go", "Java")); // 创建并初始化
    HashSet<String> set3 = Set.of("Hello", "World"); // 不可变只读 Set

    // 1. 增
    set.add("Hello"); // 新增单个
    set.addAll(Set.of("Go", "Java")); // 新增多个
    System.out.println(set);

    // 2. 删
    set.remove("Hello"); // 删除指定元素, 返回是否删除的标志
    set.removeAll(Set.of("Hello", "C++")); // 删除当前集合与传入集合交集元素，只要有元素删除就返回 true。
    set.retainAll(Set.of("Java", "Hello")); // 保留交集元素
    set.removeIf(s -> s.equals("Go")); // 删除满足条件的元素
    // set.clear(); // 清空元素
    System.out.println(set);

    // 3. 查和判断
    System.out.println(set.contains("Hello")); // 判断元素是否在集合中
    System.out.println(set.containsAll(Set.of("Hello", "Java"))); // 判断元素是否在集合中
    System.out.println(set.isEmpty()); // 判断集合是否为空
    System.out.println(set.size()); // 获取集合大小

    // 4. 遍历
    for (String s : set) {
      System.out.println(s);
    }
    set.forEach(s -> System.out.println(s)); // 遍历

    // 5. 转换
    Object[] arr = set.toArray(); // 转换为数组, 丢失泛型类型
    String[] arr2 = set.toArray(new String[0]); // 传入对应类型的数组参数进去

    // 其他
    set.stream().filter(n -> n.startsWith("J")).toList(); // 流式对象，支持过滤、排序、去重、收集等链式操作
  }
}
