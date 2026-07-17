import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Main {
  public static void main(String[] args) {
    /**
     * Stream 是 Java8 引入的集合流式处理 API，用来以声明式、链式调用处理集合 / 数组数据。
     * 
     * 核心思想：将集合数据看作流式数据，中间链式处理，最后产出结果。
     * 
     * 1. 不存储数据，只是数据视图，不会修改原集合；
     * 2. 支持串行流、并行流；
     * 3. 所有操作依赖 Lambda / 方法引用，底层依赖函数式接口；
     * 4. 分为三类操作：创建流 → 中间操作 → 终端操作。
     */

    /**
     * 创建流:
     * 1. Stream.of(): 创建了一个输出确定元素的
     * 2. xx.stream(): 基于Collection
     * 3. Arrays.stream(): 基于数组
     */
    Stream<Integer> stream = Stream.of(1, 2, 3);
    Stream<Integer> stream2 = Arrays.stream(new Integer[] { 1, 2, 3 });
    Stream<Integer> stream3 = List.of(1, 2, 3).stream();

    // #region ------------ 中间操作 ------------
    /**
     * 中间操作:
     * 1. 返回新 Stream，延迟执行；
     * 2. 链式叠加，调用后不立即执行；
     * 3. 只有触发终端操作才会一次性执行所有中间逻辑。
     */
    stream
        /** map 操作: 对每个元素额外操作，返回新元素 */
        .map(s -> new Integer[] { s, s * 2 })
        /** flatMap 扁平化（嵌套集合拆分） */
        .flatMap(s -> Arrays.stream(s))
        /** filter 过滤元素 */
        .filter(s -> s % 2 == 0)
        /** skip 跳过前 n 个元素 */
        .skip(1)
        /** limit 截取前 n 个元素 */
        .limit(10)
        /** distinct 去重 */
        .distinct()
        /** sorted 排序 */
        .sorted((a, b) -> b - a)
        .forEach(a -> System.out.println(a));
    // #endregion

    // #region ------------ 终端操作 ------------
    /**
     * 终端操作:
     * 1. 无 Stream 返回，执行流计算，关闭流
     * 2. 一个流只能调用一次终端操作，重复调用抛异常。
     */

    /** reduce: 归并 */
    System.out.println(Stream.of(1, 2, 3).reduce(0, (total, item) -> total + item));

    /** collect: 收集为 List/Set/Map（最核心） */
    List<Integer> list = Stream.of(1, 2, 3).collect(Collectors.toList());
    Set<Integer> set = Stream.of(1, 2, 3).collect(Collectors.toSet());
    Map<String, String> map = Stream.of("APPL:Apple",
        "MSFT:Microsoft")
        .collect(Collectors.toMap(
            // 把元素s映射为key:
            s -> s.substring(0, s.indexOf(':')),
            // 把元素s映射为value:
            s -> s.substring(s.indexOf(':') + 1)));
    System.out.println(list);
    System.out.println(set);
    System.out.println(map);

    /** toArray: 输出为数组 */
    System.out.println(Stream.of(1, 2, 3).toArray());

    /** toList: 输出为 List */
    System.out.println(Stream.of(1, 2, 3).toList());

    /**
     * 其他操作
     */
    System.out.println(Stream.of(1, 2, 3).anyMatch(s -> s > 2)); // 是否至少有一个元素满足测试条件
    System.out.println(Stream.of(1, 2, 3).allMatch(s -> s > 2)); // 是否所有元素满足测试条件
    System.out.println(Stream.of(1, 2, 3).noneMatch(s -> s > 2)); // 是否没有元素满足测试条件
    System.out.println(Stream.of(1, 2, 3).findFirst()); // 第一个元素
    System.out.println(Stream.of(1, 2, 3).findAny()); // 任意一个元素
    System.out.println(Stream.of(1, 2, 3).count()); // 元素个数
    System.out.println(Stream.of(1, 2, 3).max((a, b) -> a - b)); // 最大元素
    System.out.println(Stream.of(1, 2, 3).min((a, b) -> a - b)); // 最小元素
    Stream.of(1, 2, 3).forEach(System.out::println); // 遍历元素
    // #endregion

  }
}
