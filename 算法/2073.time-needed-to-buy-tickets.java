/*
 * @lc app=leetcode.cn id=2073 lang=java
 * @lcpr version=30204
 *
 * [2073] 买票需要的时间
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int timeRequiredToBuy(int[] tickets, int k) {
        /**
         * 在 k 之前的能买票最大次数为 tickets[k]
         * 在 k 之后的能买票最大次数为 tickets[k] - 1
         */

        if (tickets[k] == 1)
            return k + 1;

        int ans = 0; // 结果
        int base = tickets[k]; // 基准数

        for (int i = 0; i < tickets.length; i++) {
            if (i <= k) {
                ans += Math.min(base, tickets[i]);
            } else {
                ans += Math.min(base - 1, tickets[i]);
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [2,3,2]\n2\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [5,1,1,1]\n0\n
 * // @lcpr case=end
 * 
 */
