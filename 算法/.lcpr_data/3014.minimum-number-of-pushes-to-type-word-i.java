/*
 * @lc app=leetcode.cn id=3014 lang=java
 * @lcpr version=30204
 *
 * [3014] 输入单词需要的最少按键次数 I
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int minimumPushes(String word) {
        int ans = 0,
                base = 1,
                total = word.length();

        while (total >= 8) {
            ans += 8 * base;

            total -= 8;
            base++;
        }

        return ans + total * base;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "abcde"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "xycdefghij"\n
 * // @lcpr case=end
 * 
 */
