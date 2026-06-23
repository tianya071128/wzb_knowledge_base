import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
  public static void main(String[] args) {
    // 泛型的核心作用:
    // 1. 编译期类型检查：类型不匹配直接报错，避免运行时转换异常
    // 2. 提供可复用模板

    // 使用泛型: 与 ts 类型
    List<String> list = new ArrayList<>(); // 可以省略编译器能自动推断出的类型: ArrayList<>
  }
}

/**
 * 定义泛型:
 * - 泛型类 class name<泛型名称> {}
 * - 使用 extends 限定泛型类型,只能是该类本身，或它的子类 / 实现类
 */
class Pair<T extends Number> {
  private T first;

  public Pair(T first) {
    this.first = first;
  }

  public T getFirst() {
    return first;
  }

  /**
   * 定义泛型:
   * - 泛型方法 修饰符 <泛型名称> 返回值类型 方法名(参数列表) {}
   * - 使用 extends 限定泛型类型,只能是该类本身，或它的子类 / 实现类
   */
  public static <U extends Number> void setFirst(U first) {
    // this.first = first;
  }
}

/**
 * 定义泛型: 泛型接口
 */
interface IData<T> {
  T getData();
}