/*
 * @lc app=leetcode.cn id=2437 lang=java
 * @lcpr version=30204
 *
 * [2437] 有效时间的数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int countTime(String time) {
        int ans = 1;

        // 秒针比较好处理, 直接相乘可能性
        if (time.charAt(3) == '?')
            ans *= 6;
        if (time.charAt(4) == '?')
            ans *= 10;

        // 时针分开处理
        if (time.charAt(0) == '?' && time.charAt(1) == '?') {
            ans *= 24;
        } else if (time.charAt(0) == '?') {
            if (time.charAt(1) > '3') {
                ans *= 2;
            } else {
                ans *= 3;
            }
        } else if (time.charAt(1) == '?') {
            if (time.charAt(0) == '2') {
                ans *= 4;
            } else {
                ans *= 10;
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "?5:00"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "0?:0?"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "??:??"\n
 * // @lcpr case=end
 * 
 */
