public class Main {
  public static void main(String[] args) {
    // JDK 自带注解
    // @Override: 标记重写父类 / 接口方法；编译校验，方法签名不对直接报错。
    // @Deprecated: 弃用，调用时编译器警告
    // @SuppressWarnings: 忽略编译器警告
    @SuppressWarnings("all")
    int x = 0; // 注解修饰一个变量声明，忽略该变量的编译器警告
  }
}
