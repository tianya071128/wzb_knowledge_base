/*
 * @lc app=leetcode.cn id=2042 lang=java
 * @lcpr version=30204
 *
 * [2042] 检查句子中的数字是否递增
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public boolean areNumbersAscending(String s) {
        // 切割为数组
        String[] list = s.split(" ");
        // 上一个数字的值
        int prev = -1;

        for (String str : list) {
            char c = str.charAt(0);
            if (c >= '0' && c <= '9') {
                int cur = Integer.parseInt(str);
                if (prev >= cur)
                    return false;

                prev = cur;
            }
        }

        return true;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "1 box has 3 blue 4 red 6 green and 12 yellow marbles"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "hello world 5 x 5"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "sunset is at 7 51 pm overnight lows will be in the low 50 and 60 s"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "4 5 11 26"\n
 * // @lcpr case=end
 * 
 */
