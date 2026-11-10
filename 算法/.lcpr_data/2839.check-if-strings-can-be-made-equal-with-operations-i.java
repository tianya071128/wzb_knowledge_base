/*
 * @lc app=leetcode.cn id=2839 lang=java
 * @lcpr version=30204
 *
 * [2839] 判断通过操作能否让字符串相等 I
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public boolean canBeEqual(String s1, String s2) {
        return ((s1.charAt(0) == s2.charAt(0) && s1.charAt(2) == s2.charAt(2))
                || (s1.charAt(0) == s2.charAt(2) && s1.charAt(2) == s2.charAt(0)))
                && ((s1.charAt(1) == s2.charAt(1)
                        && s1.charAt(3) == s2.charAt(3))
                        || (s1.charAt(1) == s2.charAt(3) && s1.charAt(3) == s2.charAt(1)));
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "abcd"\n"cdab"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "abcd"\n"dacb"\n
 * // @lcpr case=end
 * 
 */
