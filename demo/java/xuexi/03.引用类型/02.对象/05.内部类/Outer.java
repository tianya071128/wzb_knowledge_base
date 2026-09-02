public class Outer {
  private String name = "外部类";

  // 成员内部类
  public class Inner {
    private String name = "内部类";

    public void show() {
      System.out.println("访问外部类字段：" + name);
      System.out.println("访问外部类字段：" + Outer.this.name); // 可以访问 private
    }
  }

  // 局部内部类
  void method() {
    final int localVar = 5; // 从 Java 8 起，可以不显式声明 final，但必须 effectively final
    class LocalInner {
      private String name = "局部内部类";

      void print() {
        System.out.println(name);
        System.out.println("访问外部类字段：" + Outer.this.name);
      }
    }
    LocalInner li = new LocalInner();
    li.print();
  }

}