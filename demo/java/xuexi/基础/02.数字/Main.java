public class Main {
  public static void main(String[] args) {
    // 1. byte: 只占用一字节: -128 ~ 127
    //          8位, 最高位为符号位
    byte a = 10;

    // 2. int: 默认, 4字节 -2147483648 ~ 2147483647
    int b = 10000;

    // 3. long: 超大金额, 8字节 -9223372036854775808 ~ 9223372036854775807
    //          字面量数值超出 int 范围时，必须在数字末尾加 L 
    long c = 1000000000000000000L;

    // 4. double: 浮点
    double d = 1.1;

    // ❌ 不要用浮点数做精确计算！
    // 跟 js 的问题一样, 会有精度丢失问题
    System.out.println(0.1 + 0.2); // 0.30000000000000004


    // 特殊数字: NaN, Infinity, -Infinity
    
  }
}
