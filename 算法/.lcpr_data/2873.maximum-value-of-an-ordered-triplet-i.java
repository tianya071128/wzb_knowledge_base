/*
 * @lc app=leetcode.cn id=2873 lang=java
 * @lcpr version=30204
 *
 * [2873] 有序三元组中的最大值 I
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;

class Solution {
    public long maximumTripletValue(int[] nums) {
        long ans = 0;
        int[] max = new int[nums.length + 1];

        for (int i = nums.length - 1; i >= 0; i--) {
            max[i] = Math.max(nums[i], max[i + 1]);
        }
        for (int i = 0; i < nums.length - 1; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] > nums[j]) {
                    ans = Math.max(ans, (long) (nums[i] - nums[j]) * max[j + 1]);
                }
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [12,6,1,2,7]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,10,3,4,19]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,2,3]\n
 * // @lcpr case=end
 * 
 */
