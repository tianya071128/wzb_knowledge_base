/*
 * @lc app=leetcode.cn id=2828 lang=java
 * @lcpr version=30204
 *
 * [2828] 判别首字母缩略词
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

class Solution {
    public boolean isAcronym(List<String> words, String s) {
        if (s.length() != words.size())
            return false;

        for (int i = 0; i < words.size(); i++) {
            if (s.charAt(i) != words.get(i).charAt(0))
                return false;
        }

        return true;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // ["alice","bob","charlie"]\n"abc"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["an","apple"]\n"a"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["never","gonna","give","up","on","you"]\n"ngguoy"\n
 * // @lcpr case=end
 * 
 */
