public class Main {
  public static void main(String[] args) {
    // Boolean: boolean 的包装类型

    /**
     * 创建 Boolean 对象
     * - valueOf 方法: Boolean.valueOf(true)
     * - 自动装箱
     */
    Boolean b = true; // 自动装箱
    Boolean b1 = Boolean.valueOf(true); // 创建 Boolean 对象

    // 字符串转boolean
    boolean b2 = Boolean.parseBoolean("true");
  }
}
