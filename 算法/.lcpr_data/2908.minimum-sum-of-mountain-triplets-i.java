/*
 * @lc app=leetcode.cn id=2908 lang=java
 * @lcpr version=30204
 *
 * [2908] 元素和最小的山形三元组 I
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int minimumSum(int[] nums) {
        int[] list = new int[nums.length];

        list[nums.length - 1] = nums[nums.length - 1];

        for (int i = nums.length - 2; i >= 0; i--) {
            list[i] = Math.min(nums[i], list[i + 1]);
        }

        int ans = Integer.MAX_VALUE,
                min = nums[0];

        for (int i = 1; i < nums.length - 1; i++) {
            if (nums[i] > min && nums[i] > list[i + 1]) {
                ans = Math.min(ans, nums[i] + min + list[i + 1]);
            }

            min = Math.min(min, nums[i]);
        }

        return Integer.MAX_VALUE == ans ? -1 : ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [8,6,1,5,3]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [5,4,8,7,10,2]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [6,5,4,3,4,5]\n
 * // @lcpr case=end
 * 
 */
