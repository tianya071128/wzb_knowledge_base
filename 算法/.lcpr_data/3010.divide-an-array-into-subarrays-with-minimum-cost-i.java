/*
 * @lc app=leetcode.cn id=3010 lang=java
 * @lcpr version=30204
 *
 * [3010] 将数组分成最小总代价的子数组 I
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;

class Solution {
    public int minimumCost(int[] nums) {
        Arrays.sort(nums, 1, nums.length);

        return nums[0] + nums[1] + nums[2];
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [1,2,3,12]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [5,4,3]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [10,3,1,1]\n
 * // @lcpr case=end
 * 
 */
