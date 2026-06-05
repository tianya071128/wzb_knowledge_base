/**
 * 抽象类:
 * - 不运行 new, 也就是无法实例化
 * - 抽象类中可以有抽象方法
 */
abstract class AbstractCity {
  /** 没有抽象变量, 直接定义变量 */
  String name;

  /** 普通方法 */
  public void setName(String name) {
    this.name = name;
  }

  /**
   * 抽象方法
   * - 子类必须重写抽象方法
   * - 只有参数和返回值定义
   */
  abstract void setPopulation(int population);
}