/**
 * Record: 只读数据类，自动生成全部模板代码
 * - 自动生成所有模板代码（不用手写构造、getter、toString）
 * - 字段默认 private final（只读，不能修改）
 * - 不能继承别的类，默认继承 java.lang.Record
 * - 不能定义额外实例字段
 */
record Point(int x, int y) {
  /** 可以添加静态方法 */
  public static Point of() {
    return new Point(0, 0);
  }
}

// 相当于以下代码
// final class Point extends Record {
// private final int x;
// private final int y;

// public Point(int x, int y) {
// this.x = x;
// this.y = y;
// }

// public int x() {
// return this.x;
// }

// public int y() {
// return this.y;
// }

// public String toString() {
// return String.format("Point[x=%s, y=%s]", x, y);
// }

// public boolean equals(Object o) {
// }

// public int hashCode() {
// }
// }
