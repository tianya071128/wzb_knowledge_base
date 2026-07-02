import java.text.SimpleDateFormat;
import java.util.Calendar;

public class Main {
  public static void main(String[] args) {
    /**
     * Calendar: 用来弥补 Date 无法单独获取年月日时分秒的缺陷
     */

    // 创建: 不能 new, 通过工厂获取实例
    Calendar c = Calendar.getInstance();

    /** 获取时间 */
    int y = c.get(Calendar.YEAR);
    int m = 1 + c.get(Calendar.MONTH);
    int d = c.get(Calendar.DAY_OF_MONTH);
    int w = c.get(Calendar.DAY_OF_WEEK);
    int hh = c.get(Calendar.HOUR_OF_DAY);
    int mm = c.get(Calendar.MINUTE);
    int ss = c.get(Calendar.SECOND);
    int ms = c.get(Calendar.MILLISECOND);
    System.out.printf("%d-%d-%d %d:%d:%d.%d\n", y, m, d, hh, mm, ss, ms);

    /** 设置时间 */
    c.set(Calendar.YEAR, 2019);
    c.set(Calendar.MONTH, 8);// 设置9月:注意8表示9月:
    c.set(Calendar.DATE, 2);// 设置2日:
    c.set(Calendar.HOUR_OF_DAY, 21);
    c.set(Calendar.MINUTE, 22);
    c.set(Calendar.SECOND, 23);
    System.out.println(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(c.getTime()));
  }
}
