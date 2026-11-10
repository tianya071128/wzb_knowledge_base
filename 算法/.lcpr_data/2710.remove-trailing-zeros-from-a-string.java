/*
 * @lc app=leetcode.cn id=2710 lang=java
 * @lcpr version=30204
 *
 * [2710] 移除字符串中的尾随零
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public String removeTrailingZeros(String num) {
        for (int i = num.length() - 1; i >= 0; i--) {
            if (num.charAt(i) > '0') {
                return num.substring(0, i + 1);
            }
        }

        return "";
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "51230100"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "123"\n
 * // @lcpr case=end
 * 
 */
