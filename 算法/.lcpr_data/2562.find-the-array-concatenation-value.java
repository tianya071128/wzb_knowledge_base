/*
 * @lc app=leetcode.cn id=2562 lang=java
 * @lcpr version=30204
 *
 * [2562] 找出数组的串联值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public long findTheArrayConcVal(int[] nums) {
        int l = 0, r = nums.length - 1;
        long ans = 0L;

        while (l <= r) {
            if (l == r) {
                ans += nums[l];
            } else {
                ans += nums[l] * Math.pow(10, (nums[r] == 0 ? 0 : (int) Math.log10(nums[r]) + 1)) + nums[r];
            }

            l++;
            r--;
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [7,52,2,4]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [5,14,13,8,12]\n
 * // @lcpr case=end
 * 
 */
