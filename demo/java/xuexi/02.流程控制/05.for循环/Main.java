public class Main {
  public static void main(String[] args) {
    // for 循环: 与 js 语法一致
    for (int i = 0; i < 10; i++) {
      System.out.println(i);
    }

    // for each 循环: 访问可迭代的数据
    int[] ns = { 1, 4, 9, 16, 25 };
    for (String n : ns) {
      System.out.println(n);
    }
  }
}
