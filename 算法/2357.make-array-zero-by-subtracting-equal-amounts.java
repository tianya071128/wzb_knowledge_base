/*
 * @lc app=leetcode.cn id=2357 lang=java
 * @lcpr version=30204
 *
 * [2357] 使数组中所有元素都等于零
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;

class Solution {
    public int minimumOperations(int[] nums) {
        int ans = 0,
                diff = 0;

        Arrays.sort(nums);

        for (int i = 0; i < nums.length; i++) {
            if (nums[i] - diff > 0) {
                ans++;
                diff = nums[i];
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [1,5,0,3,5]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [0]\n
 * // @lcpr case=end
 * 
 */
