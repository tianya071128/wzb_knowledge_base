/*
 * @lc app=leetcode.cn id=441 lang=java
 * @lcpr version=30204
 *
 * [441] 排列硬币
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int arrangeCoins(int n) {
        // 二分搜索：找到 [1, n] 行中最后一个小于或等于 n 的硬币总和
        // 转换为上界：第一个大于 n 的值，最后还需要减 1
        int l = 1,
                r = n;

        while (l < r) {
            int mid = l + (r - l) / 2;

            if ((1L * mid * (mid + 1)) / 2 <= n) {
                l = mid + 1;
            } else {
                r = mid;
            }
        }

        return Math.max(1, l - 1);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // 5\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 8\n
 * // @lcpr case=end
 * 
 */
