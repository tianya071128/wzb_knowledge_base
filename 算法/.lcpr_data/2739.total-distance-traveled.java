/*
 * @lc app=leetcode.cn id=2739 lang=java
 * @lcpr version=30204
 *
 * [2739] 总行驶距离
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int distanceTraveled(int mainTank, int additionalTank) {
        int ans = 0;

        while (mainTank >= 5) {
            int temp = mainTank / 5;

            ans += 10 * 5 * temp;
            mainTank = mainTank % 5 + Math.max(Math.min(temp, additionalTank), 0);
            additionalTank -= temp;
        }

        return ans + 10 * mainTank;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // 5\n10\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 1\n2\n
 * // @lcpr case=end
 * 
 */
