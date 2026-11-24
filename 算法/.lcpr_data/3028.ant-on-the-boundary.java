/*
 * @lc app=leetcode.cn id=3028 lang=java
 * @lcpr version=30204
 *
 * [3028] 边界上的蚂蚁
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int returnToBoundaryCount(int[] nums) {
        int ans = 0,
                p = 0;

        for (int n : nums) {
            p += n;

            if (p == 0)
                ans++;
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [2,3,-5]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [3,2,-3,-4]\n
 * // @lcpr case=end
 * 
 */
