/*
 * @lc app=leetcode.cn id=2574 lang=java
 * @lcpr version=30204
 *
 * [2574] 左右元素和的差值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int[] leftRightDifference(int[] nums) {
        int[] prefixSum = new int[nums.length + 2];

        for (int i = 0; i < nums.length; i++) {
            prefixSum[i + 1] = nums[i] + prefixSum[i];
        }

        prefixSum[nums.length + 1] = prefixSum[nums.length];

        for (int i = 0; i < nums.length; i++) {
            nums[i] = Math.abs(prefixSum[i] - (prefixSum[nums.length + 1] - prefixSum[i + 1]));
        }

        return nums;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [10,4,8,3]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1]\n
 * // @lcpr case=end
 * 
 */
