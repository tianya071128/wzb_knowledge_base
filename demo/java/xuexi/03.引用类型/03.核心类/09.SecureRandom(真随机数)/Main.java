import java.security.SecureRandom;

public class Main {
  public static void main(String[] args) {
    // SecureRandom：加密级强随机数生成器（CSPRNG），用于安全敏感场景（密钥、token、验证码、盐值）
    // 自动从系统熵池取种子
    // 即使传入种子, 随机数生成器也会自动生成一个随机的种子
    SecureRandom random = new SecureRandom();

    System.out.println(random.nextInt()); // 任意int

    // 更推荐, 高强度安全随机数生成器
    SecureRandom random2 = SecureRandom.getInstanceStrong();
    // 也可指定算法
    SecureRandom random3 = SecureRandom.getInstance("SHA1PRNG");
    SecureRandom random4 = SecureRandom.getInstance("NativePRNG"); // 依赖OS熵池
  }
}
