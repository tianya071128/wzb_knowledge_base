/*
 * @lc app=leetcode.cn id=2259 lang=java
 * @lcpr version=30204
 *
 * [2259] 移除指定数字得到的最大结果
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public String removeDigit(String number, char digit) {
        /**
         * 移除数字的两种可能
         * 1. 只有一个时, 必须移除
         * 2. 当后面的数字比当前数字要大时, 移除更好
         */
        int removeIndex = -1;

        for (int i = 0; i < number.length(); i++) {
            if (number.charAt(i) == digit) {
                removeIndex = i;

                if (i < (number.length() - 1) && number.charAt(i) < number.charAt(i + 1)) {
                    break;
                }
            }
        }

        return number.substring(0, removeIndex) + number.substring(removeIndex + 1);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "123"\n'3'\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "1231"\n'1'\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "551"\n'5'\n
 * // @lcpr case=end
 * 
 */
