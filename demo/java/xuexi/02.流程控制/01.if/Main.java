public class Main {
  public static void main(String[] args) {
    int score = 80;

    // 语法: 与 js 类似
    // if (condition) else if (condition) {}
    if (score >= 70) {
      System.out.println("A");
    }

    // 条件必须为 boolean, 不会隐式转换
    if (score) { // ❌️, 不兼容的类型: int无法转换为boolean
      System.out.println("B");
    }
  }
}
