/*
 * @lc app=leetcode.cn id=2114 lang=java
 * @lcpr version=30204
 *
 * [2114] 句子中的最多单词数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int mostWordsFound(String[] sentences) {
        /**
         * 也就是计算空格的数量
         */
        int ans = 0;

        for (String string : sentences) {
            int cur = 1;
            for (int i = 0; i < string.length(); i++) {
                if (string.charAt(i) == ' ') {
                    cur++;
                }
            }

            ans = Math.max(cur, ans);
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // ["alice and bob love leetcode", "i think so too",
 * "this is great thanks very much"]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["please wait", "continue to fight", "continue to win"]\n
 * // @lcpr case=end
 * 
 */
