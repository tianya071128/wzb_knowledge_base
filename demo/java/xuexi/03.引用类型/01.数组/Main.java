import java.util.Arrays;
import java.util.Collections;

public class Main {
  public static void main(String[] args) {
    // 定义1: 创建对象形式
    int[] ns = new int[5];

    // 定义2: 字面量形式
    int[] ns1 = new int[] { 1, 2, 3, 4, 5 };
    int[] ns2 = { 1, 2, 3, 4, 5 };
    String[] ns3 = { "1", "2", "3", "4", "5" };

    // 数组所有元素初始化为默认值，整型都是0，浮点型是0.0，布尔型是false；
    // 引用类型的为是 null
    System.out.println(ns[3]);

    // 数组创建后, 长度就不可变 --> 如果索引超出范围，运行时将报错
    // System.out.println(ns[6]);

    // for 循环遍历
    for (int i = 0; i < ns1.length; i++) {
      System.out.println(ns1[i]);
    }

    // for-each 循环
    for (int i : ns1) {
      System.out.println(i);
    }

    // 排序: Arrays.sort() --> 基础类型只支持升序, 复杂类型支持倒序
    Arrays.sort(ns1);
    Arrays.sort(ns3, Collections.reverseOrder());
  }
}
