import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class Main {
  public static void main(String[] args) {
    /**
     * Map: 是 Java 集合框架的双列集合顶层接口，以「键值对（key-value）」形式存储数据，和单列集合 Collection 平级
     * 
     * 
     * 实现类:
     * - HashMap: 无序 key
     * - LinkedHashMap: 插入有序 key
     * - TreeMap: key 自然升序 / 自定义排序
     */

    // 创建 Map
    HashMap<String, Integer> map = new HashMap<>();
    Map<String, Integer> map2 = Map.of("张三", 24, "王五", 25, "赵六", 26); // 创建不可变只读 map，不能增删改、不允许 null

    // 1. 增
    map.put("张三", 24); // key 不存在：新增，返回 null；key 存在：覆盖旧值，返回被覆盖旧值
    map.putAll(Map.of("王五", 25, "赵六", 26)); // 批量添加
    map.putIfAbsent("李四", 27); // 仅 key 不存在才存入
    System.out.println(map);

    // 2. 查
    System.out.println(map.get("张三")); // 根据 key 取值，无 key 返回 null
    System.out.println(map.getOrDefault("王五", 0)); // 根据 key 取值，无 key 返回默认值
    System.out.println(map.containsKey("张三")); // 判断 key 是否存在
    System.out.println(map.containsValue(24)); // 判断 value 是否存在, 全集合遍历，性能差

    // 3. 删
    map.remove("王五"); // 按 key 删除，返回被删除 value；无 key 返回 null
    map.remove("王五", 25); // 精准匹配删除：key 和 value 同时匹配才删除
    // map.clear(); // 清空
    System.out.println(map);

    // 4. 改
    map.put("张三", 24); // 存在 key 时, 覆盖旧值，返回被覆盖旧值
    map.compute("张三", (k, v) -> v + 1); // 对指定 key 的值进行重新计算, 函数返回 null 则删除该 key
    map.computeIfAbsent("张三", k -> 28 + 1); // key 不存在，执行函数生成 value 存入
    map.computeIfPresent("张三", (k, v) -> v + 1); // key 存在，才执行函数生成 value 存入
    map.merge("张三", 20, (v1, v2) -> v1 + v2); // 如果 key 不存在, 则直接存入 value; key 存在, 则调用函数生成 value 存入
    map.replace("张三", 28); // 存在该 key 就覆盖 value；不存在不操作。
    map.replace("张三", 24, 28); // 精准匹配修改：key 和 value 同时匹配才修改
    map.replaceAll((key, value) -> value + 1); // 批量修改, 原地修改
    System.out.println(map);

    // 5. 获取集合视图（与原 Map 联动，修改视图同步改原集合）
    Set<String> keys = map.keySet(); // 获取所有的 key 的视图
    System.out.println(keys); // [李四, 张三, 赵六]
    Collection<Integer> vals = map.values(); // 获取所有的 value 的视图
    System.out.println(vals); // [27, 24, 26]
    Set<Map.Entry<String, Integer>> entries = map.entrySet();
    System.out.println(entries); // [李四=27, 张三=24, 赵六=26]

    // 6. 遍历
    for (Map.Entry<String, Integer> entry : entries) {
      System.out.println(entry.getKey() + ":" + entry.getValue());
    }
    map.forEach((k, v) -> System.out.println("key:" + k + ", value:" + v)); // 遍历 map

    // 7. 统计、判空
    System.out.println(map.size()); // 获取元素个数
    System.out.println(map.isEmpty()); // 判空

    // 其他
    System.out.println(map.equals(map)); // 判等
    // 使用 new HashMap<>(map) 方式拷贝更简洁, 也属于浅拷贝
    System.out.println(map.clone()); // 浅拷贝, 复制所有 key、value 的引用地址, 原 Map 和克隆 Map 各自独立（增删键值互不影响）；
  }
}

/**
 * HashMap 判断 key 重复的规则:
 * - 先比 hashCode，hash 不同 → 一定不重复；
 * - hash 相同，再比 equals
 * 
 * -- 调用 obj.hashCode() 算出哈希值，通过哈希值定位哈希桶数组下标；
 * -- 遍历当前桶内已存在的所有元素：
 * 情况1：桶内某个元素 oldObj.hashCode() != obj.hashCode()
 * → 哈希值不一样，直接跳过，判定两个对象不重复；
 * 
 * 情况2：哈希值相等（哈希冲突），再执行 oldObj.equals(obj)
 * --- equals() == true：判定重复，add 失败，返回 false，不存入；
 * --- equals() == false：哈希冲突但内容不同，判定不重复，追加到链表 / 红黑树。
 * 
 * 
 * - 默认情况下, 对象都会继承 Object, Object.hashCode() 和 Object.equals() 比较的是内存地址
 * - 如果自定义类的话, 需要比较内容一致的话, 那么就需要重写 hashCode 和 equals 方法
 */