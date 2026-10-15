/*
 * @lc app=leetcode.cn id=2315 lang=java
 * @lcpr version=30204
 *
 * [2315] 统计星号
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int countAsterisks(String s) {
        int flag = 0; // 0 退出 | 1 进入
        int ans = 0;

        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '|') {
                flag = flag == 0 ? 1 : 0;
            }

            if (flag == 0 && s.charAt(i) == '*')
                ans++;
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "l|*e*et|c**o|*de|"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "iamprogrammer"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "yo|uar|e**|b|e***au|tifu|l"\n
 * // @lcpr case=end
 * 
 */
