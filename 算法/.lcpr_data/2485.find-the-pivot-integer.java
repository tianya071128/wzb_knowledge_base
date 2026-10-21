/*
 * @lc app=leetcode.cn id=2485 lang=java
 * @lcpr version=30204
 *
 * [2485] 找出中枢整数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int pivotInteger(int n) {
        int total = (n + 1) * n / 2;

        for (; n >= 1; n--) {
            int cur = (n + 1) * n / 2;
            if (cur == total - cur + n)
                return n;
        }

        return -1;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // 8\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 1\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 4\n
 * // @lcpr case=end
 * 
 */
