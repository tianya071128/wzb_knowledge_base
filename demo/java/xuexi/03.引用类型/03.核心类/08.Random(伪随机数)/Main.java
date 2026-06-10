import java.util.Random;

public class Main {
  public static void main(String[] args) {
    // 生成各种随机数：int、long、float、double、boolean
    Random random = new Random();
    System.out.println(random.nextInt());
    System.out.println(random.nextInt(10)); // 生成一个[0,10)之间的int
    System.out.println(random.nextLong()); // 8811649292570369305,每次都不一样
    System.out.println(random.nextFloat()); // 0.54335...生成一个[0,1)之间的float
    System.out.println(random.nextDouble()); // 0.3716...生成一个[0,1)之间的double

    /**
     * 参数:
     * - seed: 种子, 相同种子, 生成的随机数序列可复现！
     * -- 相同种子下, 每次生成随机数的序列都是一样
     * -- 而不是说每次生成的随机数一样
     */
    Random random2 = new Random(100);
    System.out.println(random2.nextInt()); // -1193959466
    System.out.println(random2.nextInt()); // -1139614796
    // System.out.println(random2.nextDouble());
    // System.out.println(random2.nextDouble());
  }
}
