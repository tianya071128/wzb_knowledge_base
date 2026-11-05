/*
 * @lc app=leetcode.cn id=2656 lang=java
 * @lcpr version=30204
 *
 * [2656] K 个元素的最大和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int maximizeSum(int[] nums, int k) {
        int max = -1;

        for (int n : nums) {
            max = Math.max(n, max);
        }

        return (max + k - 1) * (max + k) / 2 - (max) * (max - 1) / 2;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [1,2,3,4,5]\n3\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [5,5,5]\n2\n
 * // @lcpr case=end
 * 
 */
