/*
 * @lc app=leetcode.cn id=3046 lang=java
 * @lcpr version=30204
 *
 * [3046] 分割数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public boolean isPossibleToSplit(int[] nums) {
        int[] flags = new int[101];

        for (int n : nums) {
            if (++flags[n] > 2)
                return false;
        }

        return true;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [1,1,2,2,3,4]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,1,1,1]\n
 * // @lcpr case=end
 * 
 */
