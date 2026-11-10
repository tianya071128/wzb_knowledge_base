/*
 * @lc app=leetcode.cn id=2760 lang=java
 * @lcpr version=30204
 *
 * [2760] 最长奇偶子数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int longestAlternatingSubarray(int[] nums, int threshold) {
        int ans = 0,
                len = 0;
        boolean flag = true; // true 需要偶数 | false 需要奇数

        for (int n : nums) {
            if (n <= threshold && flag == (n % 2 == 0)) {
                len++;
                flag = !flag;
            } else if (n <= threshold && n % 2 == 0) {
                len = 1;
                flag = false;
            } else {
                len = 0;
                flag = true;
            }

            ans = Math.max(len, ans);
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [3,2,5,4]\n5\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,2]\n2\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [2,3,4,5]\n4\n
 * // @lcpr case=end
 * 
 */
