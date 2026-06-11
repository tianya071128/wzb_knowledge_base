import java.io.IOException;

public class Main {
  // throws 标明该方法可能会抛出异常, 调用者就需要处理错误
  public static void main(String[] args) throws IOException {
    // try {} catch(Exception e) 表达式捕获错误
    try {
      Integer i = null;
      System.out.println(i.intValue());
    }
    // catch 可以同时处理多个异常, 使用 | 隔开
    catch (NullPointerException | NumberFormatException e) {

      // NullPointerException 或 NumberFormatException
      System.out.println("Bad input");

      // 打印栈
      e.printStackTrace();
    }
    // catch 根据类型来匹配错误, catch 的顺序非常重要：子类必须写在前面
    catch (Exception e) {
      System.out.println(e.getClass().getName());

      // 抛出异常
      // 传入 e, 可以将 e 的异常也带到新的异常中
      throw new IOException(e);
    }
    // 无法是否有异常, 都执行 finally 语句
    finally {
      System.out.println("finally");

    }
  }
}

/**
 * 自定义异常: 创建一个 BaseException, 其他的再从这个类继承
 */
class BaseException extends RuntimeException {
  public BaseException() {
    super();
  }

  public BaseException(String message, Throwable cause) {
    super(message, cause);
  }

  public BaseException(String message) {
    super(message);
  }

  public BaseException(Throwable cause) {
    super(cause);
  }

}