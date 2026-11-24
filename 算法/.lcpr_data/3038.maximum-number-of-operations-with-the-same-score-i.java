/*
 * @lc app=leetcode.cn id=3038 lang=java
 * @lcpr version=30204
 *
 * [3038] 相同分数的最大操作数目 I
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int maxOperations(int[] nums) {
        int ans = 1,
                prev = nums[0] + nums[1];

        for (int i = 2; i < nums.length; i += 2) {
            if (i < nums.length - 1 && nums[i] + nums[i + 1] == prev) {
                ans++;
            } else {
                break;
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [3,2,1,4,5]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [3,2,6,1,4]\n
 * // @lcpr case=end
 * 
 */
