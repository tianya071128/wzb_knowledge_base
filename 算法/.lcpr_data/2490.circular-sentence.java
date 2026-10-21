/*
 * @lc app=leetcode.cn id=2490 lang=java
 * @lcpr version=30204
 *
 * [2490] 回环句
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public boolean isCircularSentence(String sentence) {
        if (sentence.charAt(0) != sentence.charAt(sentence.length() - 1))
            return false;

        for (int i = 0; i < sentence.length(); i++) {
            if (i != 0 && sentence.charAt(i - 1) == ' ' && sentence.charAt(i) != sentence.charAt(i - 2))
                return false;
        }

        return true;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "leetcode exercises sound delightful"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "eetcode"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "Leetcode is cool"\n
 * // @lcpr case=end
 * 
 */
