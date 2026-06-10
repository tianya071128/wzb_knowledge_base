/**
 * 接口: 纯粹的规范
 * - 定义抽象方法(默认就是 public abstract, 可以省略)
 */
interface Person {
  /** 定义抽象方法 */
  void eat();

  void sleep();

  /**
   * 支持静态字段, 且必须为 final 类型
   * - interface的字段只能是public static final类型，所以我们可以把这些修饰符都去掉
   */
  // 编译器会自动加上public static final
  int MALE = 1;

  /**
   * default 方法:
   * 用于解决接口新增方法，不破坏原有代码！ --> 接口加一个方法 → 所有实现类全部报错，必须改。新增 default 方法, 则可以不用动
   * - 接口里带方法体的方法
   * - 实现类可以选择重写和不重写
   * - 可以定义多个 default 方法
   * - 一个类实现多个接口时，如果有同名 default 方法，必须重写解决冲突
   */
  default void show() {
    System.out.println("show()");
  }
}

/**
 * 类使用 implements 实现, 可以继承多个接口
 * - 具体类必须重写所有的抽象方法, 抽象类无需重写
 */
class Student implements Person {
  @Override
  public void eat() {
    System.out.println("吃吃吃");
  }

  @Override
  public void sleep() {
    System.out.println("睡睡睡");
  }
}

/**
 * 接口也支持继承接口, 并且只能继承接口
 * - 可以继承多个接口, 继承的接口用逗号隔开
 */
interface Teacher extends Person {
  void teach();
}