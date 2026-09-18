/*
 * @lc app=leetcode.cn id=2108 lang=java
 * @lcpr version=30204
 *
 * [2108] 找出数组中的第一个回文字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public String firstPalindrome(String[] words) {
        for (String string : words) {
            if (hasPalindrome(string))
                return string;
        }

        return "";
    }

    public boolean hasPalindrome(String word) {
        for (int i = 0; i < Math.floor(word.length() / 2); i++) {
            if (word.charAt(i) != word.charAt(word.length() - 1 - i))
                return false;
        }

        return true;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // ["abc","car","ada","racecar","cool"]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["notapalindrome","racecar"]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["def","ghi"]\n
 * // @lcpr case=end
 * 
 */
