/*
 * @lc app=leetcode.cn id=3019 lang=java
 * @lcpr version=30204
 *
 * [3019] 按键变更的次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int countKeyChanges(String s) {
        s = s.toLowerCase();

        int ans = 0;

        for (int i = 1; i < s.length(); i++) {
            if (s.charAt(i) != s.charAt(i - 1))
                ans++;
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "aAbBcC"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "AaAaAaaA"\n
 * // @lcpr case=end
 * 
 */
