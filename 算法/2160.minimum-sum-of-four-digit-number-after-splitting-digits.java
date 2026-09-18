/*
 * @lc app=leetcode.cn id=2160 lang=java
 * @lcpr version=30204
 *
 * [2160] 拆分数位后四位数字的最小和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;

class Solution {
    public int minimumSum(int num) {
        /** 数位均分, 并且更小的数字在开头 */
        int[] nums = { (int) Math.floor(num / 1000),
                (int) Math.floor((num % 1000) / 100),
                (int) Math.floor((num % 100) / 10),
                (int) num % 10 };

        Arrays.sort(nums);

        return nums[0] * 10 + nums[2] + nums[1] * 10 + nums[3];
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // 2932\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 4009\n
 * // @lcpr case=end
 * 
 */
