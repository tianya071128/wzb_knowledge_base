public class Main {
  public static void main(String[] args) {
    // 字符串实际上 String 的引用类型
    String s1 = "Hello!";
    String s2 = new String(new char[] { 'H', 'e', 'l', 'l', 'o', '!' });

    // 1. 字符串比较: equals
    System.out.println(s1 == s2); // false
    System.out.println(s1.equals(s2)); // true

    // 2. 忽略大小写比较
    System.out.println(s1.equalsIgnoreCase(s2)); // true

    // 3. 获取长度
    int len = s1.length(); // 6
    System.out.println(len); // 6

    // 4. 获取指定位置的字符
    char c = s1.charAt(0); // 索引越界, 运行时报错
    System.out.println(c); // H

    // 5. 查找字符/字符串第一次出现的索引
    int index = s1.indexOf("l"); // 没有匹配时返回 -1
    System.out.println(index); // 2

    // 6. 查找最后一次出现的索引
    int index2 = s1.lastIndexOf("l");
    System.out.println(index2); // 3

    // 7. 判断是否以xx开头
    boolean b = s1.startsWith("Hell");
    boolean b2 = s1.startsWith("ll", 2); // 可以指定偏移量
    System.out.println(b); // true
    System.out.println(b2); // true

    // 8. 判断是否以xx结尾
    boolean b3 = s1.endsWith("!"); // 不支持指定偏移量
    System.out.println(b3); // true

    // 9. 判断是否包含xx
    boolean b4 = s1.contains("ll");
    System.out.println(b4); // true

    // 10. 判断是否为空字符串
    boolean b5 = s1.isEmpty();
    System.out.println(b5); // false

    // 11. 去除首尾空格
    String s3 = "  Hello  ";
    String s4 = s3.trim();
    " Hello ".stripLeading(); // 去除左侧空格: "Hello "
    " Hello ".stripTrailing(); // 去除右侧空格: " Hello"
    System.out.println(s4);

    // 12. 截取子串（从index到末尾）
    String s5 = s1.substring(2); // [begin, end), end不传则到末尾
    System.out.println(s5); // llo!

    // 13. 替换: 全量替换
    String s6 = s1.replace("l", "L");
    System.out.println(s6); // HeLLo!

    // 14. 切割字符串
    String[] arr = s1.split("ll"); // {"He", "o!"}
    for (String s : arr) {
      System.out.println(s);
    }

    // 15. 转字符数组
    char[] chars = s1.toCharArray(); // {"H", "e", "l", "l", "o", "!"}

    // 16. 转小写
    String s7 = s1.toLowerCase();
    System.out.println(s7); // hello!

    // 17. 转大写
    String s8 = s1.toUpperCase();
    System.out.println(s8);

    // 18. 基本类型转字符串: 引用类型一般都有 toString() 方法
    System.out.println(String.valueOf(123));

    // 19. 格式化字符串
    // 占位符: 以 % 开头, 有几个, 后面的就传入几个参数
    // - %s: 显示字符串
    // - %d: 显示数字
    System.out.println(String.format("I have %s apples, %d oranges", 5, 3)); // I have 5 apples, 3 oranges

    // 20. 比较大小
    System.out.println("Hello".compareTo("Hello")); // 按 Unicode 字典顺序比较两个字符串，返回 int 类型结果，专门配合 list.sort() 排序使用。
  }
}
