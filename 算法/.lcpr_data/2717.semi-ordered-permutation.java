/*
 * @lc app=leetcode.cn id=2717 lang=java
 * @lcpr version=30204
 *
 * [2717] 半有序排列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int semiOrderedPermutation(int[] nums) {
        int p1 = 0,
                p2 = 0;

        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == 1) {
                p1 = i;
            } else if (nums[i] == nums.length) {
                p2 = i;
            }
        }

        if (p1 > p2)
            p2++;

        return p1 + (nums.length - 1 - p2);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [2,1,4,3]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [2,4,1,3]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,3,4,2,5]\n
 * // @lcpr case=end
 * 
 */
