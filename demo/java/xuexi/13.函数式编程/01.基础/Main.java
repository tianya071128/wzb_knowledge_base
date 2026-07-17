import java.util.Arrays;

public class Main {
  public static void main(String[] args) {
    /**
     * Lambda 表达式：如果接口只定义了一个抽象方法(最好使用了 @FunctionalInterface 注解), 那么就可以使用 Lambda 表达式。
     * 
     * 基础语法: (参数列表) -> { 方法体 };
     * 其中参数可以不定义类型, 会根据接口自动推断
     */
    Runnable r = () -> System.out.println("Hello World!");

    // 排序中使用
    String[] array = new String[] { "Apple", "Orange", "Banana", "Lemon" };
    Arrays.sort(array, (s1, s2) -> {
      return s1.compareTo(s2);
    });
    System.out.println(String.join(", ", array));

    /**
     * 方法引用: 在 Lambda 表达式的基础上, 在简化一层, 把一个已存在的方法，直接当成「函数式接口的实现」，省去手写 Lambda 箭头函数。
     * 
     * 
     * 四种方法引用:
     * 1. 静态方法引用：类名::静态方法
     * 2. 实例对象方法引用：实例对象::成员方法
     * 3. 类型任意实例方法引用：类名::实例方法
     * 4. 构造器引用：类名::new
     */
    String[] array2 = new String[] { "Apple", "Orange", "Banana", "Lemon" };
    Arrays.sort(array2, String::compareTo);
    System.out.println(String.join(", ", array2));

  }
}
