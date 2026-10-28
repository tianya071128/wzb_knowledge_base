/*
 * @lc app=leetcode.cn id=2566 lang=java
 * @lcpr version=30204
 *
 * [2566] 替换一个数字后的最大差值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int minMaxDifference(int num) {
        String s = Integer.toString(num);
        int max = 0,
                min = 0, replace1 = -1, replace2 = s.charAt(0) - '0';

        for (int i = 0; i < s.length(); i++) {
            int cur = s.charAt(i) - '0';

            if (replace1 == -1 && cur != 9) {
                replace1 = cur;
            }

            max = max * 10 + (cur == replace1 ? 9 : cur);
            min = min * 10 + (cur == replace2 ? 0 : cur);
        }

        return max - min;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // 11891\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 90\n
 * // @lcpr case=end
 * 
 */
