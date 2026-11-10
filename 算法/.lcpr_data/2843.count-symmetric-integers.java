/*
 * @lc app=leetcode.cn id=2843 lang=java
 * @lcpr version=30204
 *
 * [2843] 统计对称整数的数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int countSymmetricIntegers(int low, int high) {
        int ans = 0;

        for (; low <= high; low++) {
            String str = String.valueOf(low);

            if (str.length() == 2 && str.charAt(0) == str.charAt(1)) {
                ans++;
            } else if (str.length() == 4 && str.charAt(0) + str.charAt(1) == str.charAt(2) + str.charAt(3)) {
                ans++;
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // 1\n100\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 1200\n1230\n
 * // @lcpr case=end
 * 
 */
