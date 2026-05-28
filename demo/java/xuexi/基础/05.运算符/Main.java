
public class Main {
  public static void main(String[] args) {
    // 算术运算符
    // + - * / % ++ --
    int a = 10 + 10;
    int b = 10 - 10;
    int c = 10 * 10;
    int d = 10 / 3; // 3 --> 使用 int 接收, 会自动截断
    int e = 10 % 10;
    int f = a++;
    int g = ++a;
    int h = a--;
    int i = --a;
    // 除了 + 号可以用于字符串或对象，其他算术运算符（- * / % ++ --）用在非数字类型上，直接编译报错！
    // 变成拼接 --> 字符串 + 数字, 也是拼接
    String str = "hello" + 10;

    // 赋值运算符
    // = += -= *= /= %=
    int j = 10;
    j += 10;
    j -= 10;
    j *= 10;
    j /= 10;
    j %= 10;


    // 关系运算符 --> 返回 boolean
    // > >= < <= == !=
    boolean k = 10 > 10;
    boolean l = 10 >= 10;
    boolean m = 10 < 10;
    boolean n = 10 <= 10;
    boolean o = 10 == 10;
    boolean p = 10 != 10;

    // > < >= <= 只能作用于数字 或 char
    // boolean aa = 'aa' > 'bb'; // ❌

    // == != 能作用于所有类型
    //  基本类型：比数值
    //  引用类型：比内存地址



    // 逻辑运算符 --> 短路运算: 只要前面的结果已经能确定最终答案，后面的代码直接不执行！
    // && || !
    boolean q = true && false;
    boolean r = true || false;
    boolean s = !true;


    // 三目运算符
    int t = 10 > 10 ? 10 : 20;
  }
}
