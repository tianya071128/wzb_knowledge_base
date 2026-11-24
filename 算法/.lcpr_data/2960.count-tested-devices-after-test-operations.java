/*
 * @lc app=leetcode.cn id=2960 lang=java
 * @lcpr version=30204
 *
 * [2960] 统计已测试设备
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int countTestedDevices(int[] batteryPercentages) {
        int ans = 0;

        for (int item : batteryPercentages) {
            if (item - ans > 0)
                ans++;
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [1,1,2,1,3]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [0,1,2]\n
 * // @lcpr case=end
 * 
 */
