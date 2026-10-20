/*
 * @lc app=leetcode.cn id=2455 lang=java
 * @lcpr version=30204
 *
 * [2455] 可被三整除的偶数的平均值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int averageValue(int[] nums) {
        int sum = 0,
                total = 0;

        for (int n : nums) {
            if (n % 2 == 0 && n % 3 == 0) {
                sum += n;
                total++;
            }
        }

        return total == 0 ? 0 : sum / total;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [1,3,6,10,12,15]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,2,4,7,10]\n
 * // @lcpr case=end
 * 
 */
