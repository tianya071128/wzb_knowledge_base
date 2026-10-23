/*
 * @lc app=leetcode.cn id=2544 lang=java
 * @lcpr version=30204
 *
 * [2544] 交替数字和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int alternateDigitSum(int n) {
        int ans = 0,
                p = ((int) Math.log10(n)) % 2 == 0 ? 1 : -1;

        while (n > 0) {
            ans += p * n % 10;
            n /= 10;
            p *= -1;
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // 521\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 111\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 886996\n
 * // @lcpr case=end
 * 
 */
