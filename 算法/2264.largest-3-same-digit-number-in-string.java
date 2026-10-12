/*
 * @lc app=leetcode.cn id=2264 lang=java
 * @lcpr version=30204
 *
 * [2264] 字符串中最大的 3 位相同数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public String largestGoodInteger(String num) {
        char ans = '0' - 1,
                prev = '0' - 1;
        int n = 0; // 重复次数

        for (int i = 0; i < num.length(); i++) {
            if (i == num.length() - 1 || num.charAt(i) != prev) {
                if (num.charAt(i) == prev)
                    n++;

                if (n >= 3 && prev > ans) {
                    ans = prev;
                }
                n = 0;
            }

            prev = num.charAt(i);
            n++;
        }

        if (ans < '0')
            return "";

        return Character.toString(ans).repeat(3);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "6777133339"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "2300019"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "42352338"\n
 * // @lcpr case=end
 * 
 */
