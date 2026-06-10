
// 定义类
class City {
  /** 公开的, 子类和实例都可以访问 */
  public String name;

  /** 私有, 只有在本类内部才能使用 */
  private int population;

  /**
   * 受保护的, 本类内部和子类内部中可以使用
   */
  protected int area;

  /** final 修饰的字段, 初始化后不能被修改(也可以在构造函数中初始化) */
  public final int code = 000000;

  /**
   * 静态字段: static
   * - 不推荐: 实例对象能访问静态字段只是因为编译器可以根据实例类型自动转换为 类名.静态字段 来访问静态对象
   * - 推荐: 用类名来访问静态字段
   * - 支持 public / protected / private / final 修饰符
   */
  public static int count = 0;

  /**
   * 公开方法, 子类和实例都可以访问
   * 
   * 参数:
   * - 固定参数(位置参数), 以位置来匹配参数: 类型 参数名
   * - 可变参数, 只能有一个, 而且需要放在最后面
   */
  public void setPopulation(int age, int... ages) {

  }

  /**
   * 使用 final 修饰的方法, 不能被重写
   */
  public final void setArea(int area) {
    this.area = area;
  }

  /**
   * 方法重载: 返回值、权限修饰符不参与重载判断，只改返回值不能重载
   * - 方法名相同
   * - 参数列表不同（个数、类型、顺序任一不同）
   */
  private void setPopulation(int population) {
    this.population = population;
  }

  /** 私有方法 */
  private int getPopulation() {
    return population;
  }

  /**
   * 构造方法: 类名与方法名相同
   */
  public City(String name) {
    // 使用 this() 调用其他构造函数
    this(name, 000000);
  }

  /**
   * 多个构造函数: 重载方式
   */
  public City(String name, int population) {
    this.name = name;
    this.population = population;
  }

  /**
   * 静态方法
   */
  public static void addCount() {
    // 静态方法只能访问静态字段, 不能使用 this
    count++;
  }
}
