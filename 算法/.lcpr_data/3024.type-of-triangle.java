/*
 * @lc app=leetcode.cn id=3024 lang=java
 * @lcpr version=30204
 *
 * [3024] 三角形类型
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public String triangleType(int[] nums) {
        if (nums[0] + nums[1] <= nums[2]
                || nums[0] + nums[2] <= nums[1]
                || nums[1] + nums[2] <= nums[0])
            return "none";

        if (nums[0] == nums[1] && nums[0] == nums[2])
            return "equilateral";

        if (nums[0] == nums[1] || nums[0] == nums[2] || nums[1] == nums[2])
            return "isosceles";

        return "scalene";
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [3,3,3]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [3,4,5]\n
 * // @lcpr case=end
 * 
 */
