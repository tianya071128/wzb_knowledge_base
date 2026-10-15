/*
 * @lc app=leetcode.cn id=2287 lang=java
 * @lcpr version=30204
 *
 * [2287] 重排字符形成目标字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int rearrangeCharacters(String s, String target) {
        int[] charList = new int[26],
                charList2 = new int[26];
        int ans = 100;

        for (int i = 0; i < s.length(); i++) {
            charList[s.charAt(i) - 'a']++;
        }

        for (int i = 0; i < target.length(); i++) {
            charList2[target.charAt(i) - 'a']++;
        }

        for (int i = 0; i < charList2.length; i++) {
            if (charList2[i] > 0) {
                ans = Math.min(ans, charList[i] / charList2[i]);
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "ilovecodingonleetcode"\n"code"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "abcba"\n"abc"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "abbaccaddaeea"\n"aaaaa"\n
 * // @lcpr case=end
 * 
 */
