/*
 * @lc app=leetcode.cn id=2148 lang=java
 * @lcpr version=30204
 *
 * [2148] 元素计数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int countElements(int[] nums) {
        /**
         * 其实就是找到最大值和最小值, 处于中间值的数量
         */
        int max = Integer.MIN_VALUE,
                min = Integer.MAX_VALUE,
                maxSum = 0,
                minSum = 0;

        for (int i : nums) {
            if (i > max) {
                max = i;
                maxSum = 1;
            } else if (i == max) {
                maxSum++;
            }

            if (i < min) {
                min = i;
                minSum = 1;
            } else if (i == min) {
                minSum++;
            }
        }

        return Math.max(nums.length - maxSum - minSum, 0);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [11,7,2,15]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [-3,3,3,90]\n
 * // @lcpr case=end
 * 
 */
