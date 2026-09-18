# Character 包装类

`java.lang.Character` 是基本类型 `char` 的包装类。

## 特点

- 占用 2 字节（16 位）
- 取值范围：0 ~ 65535（Unicode）
- 不可变（Immutable）

## 常用字段

```java
// 最大值
Character.MAX_VALUE;    // '\uffff'（65535）

// 最小值
Character.MIN_VALUE;    // '\u0000'（0）

// 占用的位数
Character.SIZE;         // 16

// 占用的字节数
Character.BYTES;        // 2

// 对应 Unicode 代码块未分配的最小值
Character.MIN_CODE_POINT;     // 0

// Unicode 代码点最大值
Character.MAX_CODE_POINT;     // 0x10FFFF
```

## 创建 Character

```java
// 使用 valueOf（推荐）
Character c1 = Character.valueOf('A');

// 使用代码点创建
Character c2 = Character.valueOf((char) 65);  // 'A'
```

## 常用方法

### 字符判断

```java
char ch = 'A';

// 判断是否为字母
Character.isLetter('A');       // true
Character.isLetter('1');       // false

// 判断是否为数字
Character.isDigit('1');        // true
Character.isDigit('A');        // false

// 判断是否为字母或数字
Character.isLetterOrDigit('A');  // true

// 判断是否为空白字符
Character.isWhitespace(' ');   // true
Character.isWhitespace('\t');  // true
Character.isWhitespace('\n');  // true

// 判断是否为大写/小写
Character.isUpperCase('A');    // true
Character.isLowerCase('a');    // true

// 判断是否为空格
Character.isSpaceChar(' ');    // true
```

### 字符转换

```java
// 大小写转换
Character.toUpperCase('a');    // 'A'
Character.toLowerCase('A');    // 'a'

// 转为字符串
Character.toString('A');       // "A"

// 获取代码点
Character.codePointAt("Hello", 0);  // 72（'H' 的代码点）

// 代码点转字符
Character.toChars(65);         // ['A']
Character.toChars(0x1F600);    // 代理对（两个 char）
```

### Unicode 分类

```java
// 获取字符类型
Character.getType('A');        // UPPERCASE_LETTER（1）
Character.getType('1');        // DECIMAL_DIGIT_NUMBER（9）
Character.getType(' ');        // SPACE_SEPARATOR（12）

// 判断是否为定义字符
Character.isDefined('A');      // true

// 判断是否为 Java 字母
Character.isJavaLetter('A');   // true（已废弃，使用 isLetter）

// 判断是否为 Java 字母或数字
Character.isJavaLetterOrDigit('A');  // true（已废弃）
```

## 代理对（Surrogate Pair）

Unicode 代码点超过 0xFFFF 的字符需要用两个 char（代理对）表示：

```java
// 判断是否为代理字符
Character.isHighSurrogate('\uD83D');  // true（高代理）
Character.isLowSurrogate('\uDE00');   // true（低代理）

// 判断是否为代理对
Character.isSurrogatePair('\uD83D', '\uDE00');  // true

// 组合代理对为代码点
int codePoint = Character.toCodePoint('\uD83D', '\uDE00');  // 0x1F600（😀）

// 代码点转代理对
char[] chars = Character.toChars(0x1F600);  // ['\uD83D', '\uDE00']
```

---

## 参考

- [Java 官方文档 - Character](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Character.html)
