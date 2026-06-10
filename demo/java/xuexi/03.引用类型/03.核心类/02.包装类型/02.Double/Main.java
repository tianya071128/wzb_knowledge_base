public class Main {
  public static void main(String[] args) {
    // double 的 包装类型：Double（引用类型，默认值 null）

    /**
     * 创建 Double 对象
     * - valueOf 方法: Double.valueOf(10.0)
     * - 自动装箱
     */
    Double n = 10.0;
    // Double n1 = new Double(10.0); // 弃用
    Double n2 = Double.valueOf(10.0);

    // 转换为 double
    double i = n; // 自动拆箱
    double i1 = n.doubleValue(); // 转换为 double
    int i2 = n.intValue(); // 转换为 int

    // equals(): 比较方式
    System.out.println(n.equals(n2));

    // 判断是否为 NaN
    System.out.println(n.isNaN());

    // 判断是否无穷
    System.out.println(n.isInfinite());

    // 字符串转 double
    System.out.println(Double.parseDouble("10.0")); // 10.0
  }
}
