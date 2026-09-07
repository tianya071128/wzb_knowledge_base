/*
 * @lc app=leetcode.cn id=2068 lang=java
 * @lcpr version=30204
 *
 * [2068] 检查两个字符串是否几乎相等
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public boolean checkAlmostEquivalent(String word1, String word2) {
        // 字符数量差
        int[] diff = new int[26];

        for (int i = 0; i < word1.length(); i++) {
            diff[word1.charAt(i) - 'a']++;
        }

        for (int i = 0; i < word2.length(); i++) {
            diff[word2.charAt(i) - 'a']--;
        }

        for (int i : diff) {
            if (Math.abs(i) > 3)
                return false;
        }

        return true;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "aaaa"\n"bccb"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "abcdeef"\n"abaaacc"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "cccddabba"\n"babababab"\n
 * // @lcpr case=end
 * 
 */
