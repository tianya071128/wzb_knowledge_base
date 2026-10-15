/*
 * @lc app=leetcode.cn id=2239 lang=java
 * @lcpr version=30204
 *
 * [2239] 找到最接近 0 的数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int findClosestNumber(int[] nums) {
        int ans = Integer.MAX_VALUE;

        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == 0)
                return 0;

            if (Math.abs(nums[i]) < Math.abs(ans)) {
                ans = nums[i];
            } else if (Math.abs(nums[i]) == Math.abs(ans)) {
                ans = Math.max(ans, nums[i]);
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [-4,-2,1,4,8]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [2,-1,1]\n
 * // @lcpr case=end
 * 
 */
