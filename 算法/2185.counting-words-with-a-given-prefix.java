/*
 * @lc app=leetcode.cn id=2185 lang=java
 * @lcpr version=30204
 *
 * [2185] 统计包含给定前缀的字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int prefixCount(String[] words, String pref) {
        int ans = 0;

        for (String word : words) {
            if (isPrefix(word, pref))
                ans++;
        }

        return ans;
    }

    public boolean isPrefix(String word, String pref) {
        if (word.length() < pref.length())
            return false;

        for (int i = 0; i < pref.length(); i++) {
            if (word.charAt(i) != pref.charAt(i))
                return false;
        }

        return true;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // ["pay","attention","practice","attend"]\n"at"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["leetcode","win","loops","success"]\n"code"\n
 * // @lcpr case=end
 * 
 */
