public class Main {
  public static void main(String[] args) {
    // 基本类型: byte，short，int，long，boolean，float，double，char
    // 基本类型不能赋值为 null
    // Java核心库为每种基本类型都提供了对应的包装类型：
    // byte --> java.lang.Byte
    // short --> java.lang.Short
    // int --> java.lang.Integer
    // long --> java.lang.Long
    // boolean --> java.lang.Boolean
    // float --> java.lang.Float
    // double --> java.lang.Double
    // char --> java.lang.Character

    /**
     * 定义 Interger 对象
     * - new 对象: new Integer(10)
     * - valueOf 方法: Integer.valueOf(10)
     * - 自动装箱
     * 
     * Interger 是不可变的, 一旦创建了 Integer 对象, 那么就不可改变 value
     */
    Integer n = 10; // 可以直接定义, 会自动装箱（Auto Boxing）
    // Integer n1 = new Integer(10); // 已弃用: 不推荐使用, 始终会创建实例
    Integer n1 = Integer.valueOf(10); // 通过 valueOf 方法创建 Integer 对象, 会使用缓存实例

    /**
     * 转换为基本类型
     */
    int i = n; // 会自动转换: 自动拆箱（Auto Unboxing）
    int i1 = n1.intValue(); // 转换为 int
    long i2 = n1.longValue(); // 转换为 long
    double i3 = n1.doubleValue(); // 转换为 double

    // equals(): 比较方式
    System.out.println(n.equals(n1)); // true

    // int 的最大值表示
    System.out.println(Integer.MAX_VALUE); // 2147483647

    // int 的最小值表示
    System.out.println(Integer.MIN_VALUE); // -2147483648

    // 字符串转 int
    System.out.println(Integer.parseInt("10")); // 10

    // int 转字符串
    System.out.println(Integer.toString(10)); // "10"
    System.out.println(Integer.toHexString(10)); // 16进制: "a"
  }
}
