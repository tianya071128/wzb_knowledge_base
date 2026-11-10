/*
 * @lc app=leetcode.cn id=2778 lang=java
 * @lcpr version=30204
 *
 * [2778] 特殊元素平方和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int sumOfSquares(int[] nums) {
        int ans = 0;

        for (int i = 0; i < nums.length; i++) {
            if (nums.length % (i + 1) == 0)
                ans += nums[i] * nums[i];
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [1,2,3,4]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [2,7,1,19,18,3]\n
 * // @lcpr case=end
 * 
 */
