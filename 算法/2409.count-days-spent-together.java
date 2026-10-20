/*
 * @lc app=leetcode.cn id=2409 lang=java
 * @lcpr version=30204
 *
 * [2409] 统计共同度过的日子数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.time.LocalDate;

class Solution {
    public int countDaysTogether(String arriveAlice, String leaveAlice, String arriveBob, String leaveBob) {
        /** 方便请见, 将日期转换为天数 */
        int date1 = LocalDate.parse("2026-" + arriveAlice).getDayOfYear(),
                date2 = LocalDate.parse("2026-" + leaveAlice).getDayOfYear(),
                date3 = LocalDate.parse("2026-" + arriveBob).getDayOfYear(),
                date4 = LocalDate.parse("2026-" + leaveBob).getDayOfYear();

        /** 计算两个区间的并集: 右区间取最小值, 左区间取最大值 */
        return Math.max(0, Math.min(date2, date4) - Math.max(date1, date3) + 1);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "08-15"\n"08-18"\n"08-16"\n"08-19"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "10-01"\n"10-31"\n"11-01"\n"12-31"\n
 * // @lcpr case=end
 * 
 */
