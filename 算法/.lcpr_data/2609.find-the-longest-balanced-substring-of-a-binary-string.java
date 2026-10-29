/*
 * @lc app=leetcode.cn id=2609 lang=java
 * @lcpr version=30204
 *
 * [2609] 最长平衡子字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int findTheLongestBalancedSubstring(String s) {
        int ans = 0,
                count0 = 0,
                count1 = 0;

        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '0') {
                // 重置值
                if (i - 1 >= 0 && s.charAt(i - 1) == '1') {
                    count0 = 0;
                }

                count0++;
            }

            if (s.charAt(i) == '1') {
                // 重置值
                if (i - 1 >= 0 && s.charAt(i - 1) == '0') {
                    count1 = 0;
                }

                count1++;

                ans = Math.max(ans, Math.min(count0, count1) * 2);
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "01000111"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "00111"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "111"\n
 * // @lcpr case=end
 * 
 */
