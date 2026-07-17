import java.util.Comparator;

public class Main {
  public static void main(String[] args) {
    /**
     * 标记注解: 没有任何属性（成员变量）的注解，注解声明内部为空，仅作为「标记 / 标识」存在。
     */

    /**
     * @FunctionalInterface: 告诉编译器，这个接口是函数式接口，强制校验仅一个抽象方法。
     * 
     *                       规则:
     *                       1 接口中只能有 1 个抽象方法（abstract 无实现）；
     *                       2. 可以包含任意多个 default 默认方法、static 静态方法；
     *                       3. 可以重写 Object 中的 public
     *                       方法（equals、toString、hashCode），不计入抽象方法数量；
     *                       4. 加了该注解后，一旦新增第二个抽象方法，直接编译报错。
     * 
     * 
     *                       例如:
     *                       Comparator 接口，只有一个抽象方法 compare(T o1, T o2)
     *                       虽然Comparator接口有很多方法，但只有一个抽象方法int compare(T o1, T
     *                       o2)，其他的方法都是default方法或static方法。
     *                       boolean equals(Object obj)是Object定义的方法，不算在接口方法内。
     */
    Comparator<String> c = (s1, s2) -> s1.compareTo(s2);

    /**
     * @Override: 标记重写父类 / 接口方法；编译校验，方法签名不对直接报错。
     * @Deprecated: 弃用，调用时编译器警告
     * @SuppressWarnings: 忽略编译器警告
     */
  }
}
