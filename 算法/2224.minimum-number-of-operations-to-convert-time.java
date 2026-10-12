/*
 * @lc app=leetcode.cn id=2224 lang=java
 * @lcpr version=30204
 *
 * [2224] 转化时间需要的最少操作数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.time.Duration;
import java.time.LocalTime;

class Solution {
    public int convertTime(String current, String correct) {
        int ans = 0;
        LocalTime cur = LocalTime.parse(current),
                cor = LocalTime.parse(correct);

        long diff = Duration.between(cur, cor).toMinutes();

        // 60 分钟次数
        ans += (diff / 60);
        diff %= 60;

        // 15 分钟次数
        ans += (diff / 15);
        diff %= 15;

        // 5 分钟次数
        ans += (diff / 5);
        diff %= 5;

        // 1 分钟次数
        ans += (diff / 1);
        diff %= 1;

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "02:30"\n"04:35"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "11:00"\n"11:01"\n
 * // @lcpr case=end
 * 
 */
