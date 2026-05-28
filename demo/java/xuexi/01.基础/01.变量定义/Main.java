public class Main {
  public static void main(String[] args) {
    // 1. 基础定义: type 变量名 = 值;
    int age = 18;

    // 2. 先声明，后赋值
    int age2;
    age2 = 19;

    // 3. 一次声明多个同类型变量
    int a = 1, b = 2, c = 3;

    // 4. 使用 var 关键字: 自动推断类型
    var age3 = 18;

    // 5. 常量: 使用 final 关键字
    final double PI = 3.1415926;

    System.err.println(age);
  }
}