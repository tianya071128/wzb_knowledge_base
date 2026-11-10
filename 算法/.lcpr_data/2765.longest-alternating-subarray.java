/*
 * @lc app=leetcode.cn id=2765 lang=java
 * @lcpr version=30204
 *
 * [2765] 最长交替子数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int alternatingSubarray(int[] nums) {
        int ans = -1,
                len = 0,
                p = 1; // 方向

        for (int i = 0; i < nums.length; i++) {
            if (i == 0) {
                len++;
            } else if (nums[i] - nums[i - 1] == p) {
                len++;
                p = p == 1 ? -1 : 1;
            } else if (nums[i] - nums[i - 1] == 1) {
                len = 2;
                p = -1;
            } else {
                len = 1;
                p = 1;
            }

            if (len > 1) {

                ans = Math.max(ans, len);
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [2,3,4,3,4]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [4,5,6]\n
 * // @lcpr case=end
 * 
 */
