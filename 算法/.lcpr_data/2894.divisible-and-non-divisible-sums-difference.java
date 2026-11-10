/*
 * @lc app=leetcode.cn id=2894 lang=java
 * @lcpr version=30204
 *
 * [2894] 分类求和并作差
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int differenceOfSums(int n, int m) {
        int ans = 0;

        for (int i = 1; i <= n; i++) {
            ans += i * (i % m == 0 ? -1 : 1);
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // 10\n3\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 5\n6\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 5\n1\n
 * // @lcpr case=end
 * 
 */
