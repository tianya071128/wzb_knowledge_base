
public class Main {
  public static void main(String[] args) {
    // 特殊类型
    // 基本数据: 单个字符（字母、数字、中文、符号都可以）
    // 占两个字节, 使用单引号包裹
    // 本质上是数字, 是 16 位无符号整数，存储的是 Unicode 编码值
    // 所以 char 可以和数字互相转换, 以及可以做运算
    char c1 = '中';
    System.out.println('A' < 'a'); // true（65 < 97）

    // 字符串
    // 1. 字面量方式: 使用 "" 包裹
    String str = "Hello";
    // 2. 对象方式
    String str2 = new String("Hello");
    // 3. 字符串一旦创建, 就不能修改
    // 4. 不要使用 == 比较字符串,会有问题 --> 字面量字符串会进入常量池，复用同一个对象, 所以 == 比较字面量字符串时会相同
    // 使用 equals() 方法比较
    String s1 = "abc";
    String s2 = new String("abc");
    System.out.println(s1 == s2); // false
    System.out.println(s1.equals(s2)); // true

    // 多行字符串: 使用 """ 开头, 并且必须换行
    String s = """
        123
        """;
  }
}
