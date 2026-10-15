/*
 * @lc app=leetcode.cn id=2243 lang=java
 * @lcpr version=30204
 *
 * [2243] 计算字符串的数字和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public String digitSum(String s, int k) {
        while (s.length() > k) {
            // 当轮的结果
            StringBuilder cur = new StringBuilder();

            int sum = 0; // 每 k 个的总和
            for (int i = 0; i < s.length(); i++) {
                sum += Integer.parseInt(s.substring(i, i + 1));

                // 计算
                if (i == s.length() - 1 || (i + 1) % k == 0) {
                    cur.append(sum);
                    sum = 0;
                }

            }

            s = cur.toString();
        }

        return s;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "11111222223"\n3\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "00000000"\n3\n
 * // @lcpr case=end
 * 
 */
