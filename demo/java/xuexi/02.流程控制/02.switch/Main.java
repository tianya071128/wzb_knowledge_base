public class Main {
  public static void main(String[] args) {
    // switch 语句: 与 js 语法一致
    // 并且一样 case语句具有“穿透性”
    int age = 18;
    switch (age) {
      case 16:
        System.out.println("1");
        break;
      case 17:
      case 18:
        System.out.println("1");
        break;

      default:
        break;
    }

    // switch 表达式: 类似模式匹配（Pattern Matching）的方法，保证只有一种路径会被执行，并且不需要break语句
    switch (age) {
      case 16 -> System.out.println("1");

      // 多条语句使用 {}
      case 18 -> {
        System.out.println("Selected mango");
        System.out.println("Good choice!");
      }

      default -> System.out.println("2");
    }

    // switch 表达式支持返回值
    int opt = switch (age) {
      case 16 -> 1;
      // 多个条件使用 ,
      case 18, 20 -> 2;
      // 使用 yield 返回值
      default -> {
        yield 3; // switch语句返回值
      }
    };
  }
}
