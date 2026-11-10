/*
 * @lc app=leetcode.cn id=2733 lang=java
 * @lcpr version=30204
 *
 * [2733] 既不是最小值也不是最大值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int findNonMinOrMax(int[] nums) {
        if (nums.length < 3)
            return -1;

        int max = Math.max(nums[0], nums[1]),
                min = Math.min(nums[0], nums[1]);

        return min > nums[2] ? min : max < nums[2] ? max : nums[2];
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [3,2,1,4]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,2]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [2,1,3]\n
 * // @lcpr case=end
 * 
 */
