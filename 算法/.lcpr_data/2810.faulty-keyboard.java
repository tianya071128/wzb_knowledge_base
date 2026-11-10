/*
 * @lc app=leetcode.cn id=2810 lang=java
 * @lcpr version=30204
 *
 * [2810] 故障键盘
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public String finalString(String s) {
        StringBuilder ans = new StringBuilder();

        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == 'i') {
                ans.reverse();
            } else {
                ans.append(s.charAt(i));
            }
        }

        return ans.toString();
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "string"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "poiinter"\n
 * // @lcpr case=end
 * 
 */
