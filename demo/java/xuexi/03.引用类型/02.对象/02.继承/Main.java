/**
 * 继承父类: extends --> 只能继承一个类
 * - 子类无法访问父类的 private 字段或者 private 方法
 */
class ChinaCity extends City {
  public ChinaCity(String name) {
    /** 使用 super 调用父类的构造函数 */
    super(name);

    /** 也可以使用 super.name 访问父类的字段 */
    System.out.println(super.name);
  }

  /**
   * 重写方法
   * - 参数和返回值必须完全相同, 参数不同时, 编译器会报错
   * - 如果需要参数不同, 那应该是 overload(重载)
   */
  @Override // @Override 是注解, 告诉编译器「我要重写父类方法」
  public void setPopulation(int age, int... ages) {
    super.setPopulation(age, ages);
  }
}

/** 使用 final 修饰的类不允许继承 */
final class FinalCity {
}
// class FinalCityChild extends FinalCity {} // 编译器会报错