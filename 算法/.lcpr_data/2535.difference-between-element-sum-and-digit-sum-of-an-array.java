/*
 * @lc app=leetcode.cn id=2535 lang=java
 * @lcpr version=30204
 *
 * [2535] 数组元素和与数字和的绝对差
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int differenceOfSum(int[] nums) {
        int sum = 0,
                total = 0; // 数字和
        for (int n : nums) {
            sum += n;

            while (n > 0) {
                total += n % 10;
                n /= 10;
            }
        }

        return Math.abs(sum - total);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [1,15,6,3]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,2,3,4]\n
 * // @lcpr case=end
 * 
 */
