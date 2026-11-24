/*
 * @lc app=leetcode.cn id=3042 lang=java
 * @lcpr version=30204
 *
 * [3042] 统计前后缀下标对 I
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int countPrefixSuffixPairs(String[] words) {
        int ans = 0;

        for (int i = 0; i < words.length - 1; i++) {
            for (int j = i + 1; j < words.length; j++) {
                if (words[j].startsWith(words[i]) && words[j].endsWith(words[i]))
                    ans++;
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // ["a","aba","ababa","aa"]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["pa","papa","ma","mama"]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["abab","ab"]\n
 * // @lcpr case=end
 * 
 */
