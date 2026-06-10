/**
 * enum定义的类型就是class，只不过它有以下几个特点：
 * - 定义的enum类型总是继承自java.lang.Enum，且无法被继承；
 * - 只能定义出enum的实例，而无法通过new操作符创建enum的实例；
 * - 定义的每个实例都是引用类型的唯一实例；
 * - 可以将enum类型用于switch语句。
 */

/**
 * 枚举类
 * - 只有枚举名称, 没有其他属性
 */
enum Color {
  RED,
  GREEN,
  BLUE;
}

/**
 * 编译出的 class 大概就像下面这样
 */
// public final class Color extends Enum { // 继承自Enum，标记为final class
// // 每个实例均为全局唯一:
// public static final Color RED = new Color();
// public static final Color GREEN = new Color();
// public static final Color BLUE = new Color();

// // private构造方法，确保外部无法调用new操作符:
// private Color() {
// }
// }

/**
 * 枚举带各种值
 */
enum Status {
  // 枚举值
  SUCCESS(200, "成功"),
  FAIL(500, "失败"),
  WAIT(300, "等待");

  // 定义成员
  private int code;
  private String message;

  // 定义构造方法（编译器默认 private）
  Status(int code, String message) {
    this.code = code;
    this.message = message;
  }

  // 配置 getter 读取值
  public int getCode() {
    return code;
  }

  public String getMessage() {
    return message;
  }
}

public class Main {
  public static void main(String[] args) {
    Color c = Color.RED;

    // 判断枚举
    if (c == Color.RED) {
      System.out.println("RED");
    }

    // 获取序号（从 0 开始）
    int index = c.ordinal();
    System.out.println(index); // 0

    // 获取枚举值
    Status s = Status.SUCCESS;
    System.out.println(s.getCode()); // 200
    System.out.println(s.getMessage()); // 成功
  }
}