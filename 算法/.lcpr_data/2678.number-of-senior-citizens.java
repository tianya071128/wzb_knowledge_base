/*
 * @lc app=leetcode.cn id=2678 lang=java
 * @lcpr version=30204
 *
 * [2678] 老人的数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int countSeniors(String[] details) {
        int ans = 0;

        for (int i = 0; i < details.length; i++) {
            if ((details[i].charAt(11) - '0') * 10 + (details[i].charAt(12) - '0') > 60) {
                ans++;
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // ["7868190130M7522","5303914400F9211","9273338290F4010"]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["1313579440F2036","2921522980M5644"]\n
 * // @lcpr case=end
 * 
 */
