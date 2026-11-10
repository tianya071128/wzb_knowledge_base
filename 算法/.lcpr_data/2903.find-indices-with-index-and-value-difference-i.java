/*
 * @lc app=leetcode.cn id=2903 lang=java
 * @lcpr version=30204
 *
 * [2903] 找出满足差值条件的下标 I
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int[] findIndices(int[] nums, int indexDifference, int valueDifference) {
        int[] ans = new int[] { -1, -1 };

        for (int i = 0; i < nums.length; i++) {
            for (int j = i + indexDifference; j < nums.length; j++) {
                if (Math.abs(nums[i] - nums[j]) >= valueDifference) {
                    ans[0] = i;
                    ans[1] = j;
                }
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [5,1,4,1]\n2\n4\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [2,1]\n0\n0\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,2,3]\n2\n4\n
 * // @lcpr case=end
 * 
 */
