# SecureRandom：密码学安全随机数

`java.security.SecureRandom` 是密码学安全的随机数生成器，用于生成不可预测的随机数。

## 特点

- **密码学安全**：生成的随机数不可预测
- **真随机**：使用系统熵源（如硬件噪声）作为种子
- **性能较低**：比 `Random` 和 `ThreadLocalRandom` 慢
- **适用于安全场景**：生成密钥、令牌、盐值等

## 创建 SecureRandom

```java
// 使用默认算法
SecureRandom random1 = new SecureRandom();

// 指定算法
SecureRandom random2 = SecureRandom.getInstance("SHA1PRNG");
SecureRandom random3 = SecureRandom.getInstance("NativePRNG");

// 使用种子增强随机性
SecureRandom random4 = new SecureRandom();
random4.setSeed(System.currentTimeMillis());
```

## 常用方法

### 生成字节数组（最常用）

```java
SecureRandom random = new SecureRandom();

// 生成随机字节
byte[] bytes = new byte[16];
random.nextBytes(bytes);

// 生成指定长度的随机字节
public static byte[] generateRandomBytes(int length) {
    SecureRandom random = new SecureRandom();
    byte[] bytes = new byte[length];
    random.nextBytes(bytes);
    return bytes;
}

generateRandomBytes(32);  // 生成 32 字节随机数据
```

### 生成整数

```java
SecureRandom random = new SecureRandom();

// 生成任意 int 值
random.nextInt();

// 生成 [0, bound) 范围的随机整数
random.nextInt(100);     // 0-99

// 生成长整数
random.nextLong();
```

### 生成布尔值

```java
SecureRandom random = new SecureRandom();

// 生成随机布尔值
random.nextBoolean();
```

### 生成种子

```java
// 生成指定长度的种子
byte[] seed = new byte[20];
SecureRandom random = new SecureRandom();
random.nextBytes(seed);

// 或使用 generateSeed 静态方法
byte[] seed2 = SecureRandom.getSeed(20);  // 已废弃，推荐使用 nextBytes
```

## 实际应用示例

### 生成安全令牌

```java
public static String generateToken(int length) {
    SecureRandom random = new SecureRandom();
    byte[] bytes = new byte[length];
    random.nextBytes(bytes);
    // 转为 Base64 或 Hex 字符串
    return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
}

generateToken(32);  // 生成 32 字节的安全令牌
```

### 生成 UUID

```java
public static String generateSecureUUID() {
    SecureRandom random = new SecureRandom();
    byte[] bytes = new byte[16];
    random.nextBytes(bytes);
    // 设置 UUID 版本（版本 4）
    bytes[6] = (byte) (bytes[6] & 0x0f | 0x40);
    bytes[8] = (byte) (bytes[8] & 0x3f | 0x80);

    long msb = 0;
    long lsb = 0;
    for (int i = 0; i < 8; i++) {
        msb = (msb << 8) | (bytes[i] & 0xff);
    }
    for (int i = 8; i < 16; i++) {
        lsb = (lsb << 8) | (bytes[i] & 0xff);
    }
    return new UUID(msb, lsb).toString();
}

generateSecureUUID();  // 生成安全的 UUID
```

### 生成密码盐值

```java
public static byte[] generateSalt() {
    SecureRandom random = new SecureRandom();
    byte[] salt = new byte[16];
    random.nextBytes(salt);
    return salt;
}

// 使用盐值加密密码
public static String hashPassword(String password, byte[] salt) {
    // 使用 PBKDF2 或其他算法
    // ...
}

byte[] salt = generateSalt();
String hashedPassword = hashPassword("myPassword", salt);
```

### 生成加密密钥

```java
public static SecretKey generateAESKey() throws NoSuchAlgorithmException {
    SecureRandom random = new SecureRandom();
    byte[] keyBytes = new byte[16];  // AES-128
    random.nextBytes(keyBytes);
    return new SecretKeySpec(keyBytes, "AES");
}

SecretKey key = generateAESKey();
```

### 生成验证码

```java
public static String generateVerificationCode(int length) {
    SecureRandom random = new SecureRandom();
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < length; i++) {
        sb.append(random.nextInt(10));  // 0-9 的数字
    }
    return sb.toString();
}

generateVerificationCode(6);  // 生成 6 位验证码
```

## SecureRandom vs Random vs ThreadLocalRandom

| 特性     | SecureRandom | Random   | ThreadLocalRandom |
| -------- | ------------ | -------- | ----------------- |
| 安全性   | 密码学安全   | 伪随机   | 伪随机            |
| 可预测性 | 不可预测     | 可预测   | 可预测            |
| 性能     | 慢           | 快       | 最快（多线程）    |
| 适用场景 | 安全敏感     | 一般场景 | 多线程            |
| 熵源     | 系统熵源     | 种子     | 种子              |

```java
// 性能对比
// SecureRandom：慢，但安全
SecureRandom secureRandom = new SecureRandom();
secureRandom.nextInt(100);

// Random：快，但不安全
Random random = new Random();
random.nextInt(100);

// ThreadLocalRandom：最快（多线程），但不安全
ThreadLocalRandom tlr = ThreadLocalRandom.current();
tlr.nextInt(100);
```

## 常用算法

```java
// 查看可用算法
for (String algorithm : Security.getAlgorithms("SecureRandom")) {
    System.out.println(algorithm);
}

// 常用算法
// SHA1PRNG：基于 SHA-1 哈希算法
// NativePRNG：使用操作系统原生熵源（/dev/urandom）
// Windows-PRNG：Windows 系统的 CryptoAPI
```

> **建议**：
>
> - 生成密钥、令牌、盐值等安全敏感场景使用 `SecureRandom`
> - 一般随机数使用 `ThreadLocalRandom`（多线程）或 `Random`（单线程）

---

## 参考

- [Java 官方文档 - SecureRandom](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/security/SecureRandom.html)
