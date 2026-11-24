/*
 * @lc app=leetcode.cn id=2937 lang=java
 * @lcpr version=30204
 *
 * [2937] 使三个字符串相等
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int findMinimumOperations(String s1, String s2, String s3) {
        int ans = 0,
                len = Math.min(s1.length(), Math.min(s2.length(), s3.length()));
        while (ans < len) {
            if (s1.charAt(ans) == s2.charAt(ans) && s1.charAt(ans) == s3.charAt(ans)) {
                ans++;
            } else {
                break;
            }
        }

        return ans == 0 ? -1 : (s1.length() - ans) + (s2.length() - ans) + (s3.length() - ans);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "ab"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "cac"\n
 * // @lcpr case=end
 * 
 */
