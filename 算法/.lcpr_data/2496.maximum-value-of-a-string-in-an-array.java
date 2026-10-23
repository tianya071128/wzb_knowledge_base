/*
 * @lc app=leetcode.cn id=2496 lang=java
 * @lcpr version=30204
 *
 * [2496] 数组中字符串的最大值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int maximumValue(String[] strs) {
        int max = 0;

        for (String str : strs) {
            try {
                max = Math.max(max, Integer.parseInt(str));
            } catch (NumberFormatException e) {
                max = Math.max(max, str.length());
            }
        }

        return max;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // ["alic3","bob","3","4","00000"]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["1","01","001","0001"]\n
 * // @lcpr case=end
 * 
 */
