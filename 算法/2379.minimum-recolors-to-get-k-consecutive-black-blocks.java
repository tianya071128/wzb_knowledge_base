/*
 * @lc app=leetcode.cn id=2379 lang=java
 * @lcpr version=30204
 *
 * [2379] 得到 K 个黑块的最少涂色次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int minimumRecolors(String blocks, int k) {
        /** 滑动窗口 */
        int ans = k + 1,
                sum = 0; // 窗口内白色块的大小
        for (int i = 0; i < blocks.length(); i++) {
            if (blocks.charAt(i) == 'W')
                sum++;

            if (i >= k - 1) {
                ans = Math.min(ans, sum);

                if (blocks.charAt(i + 1 - k) == 'W')
                    sum--;
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "WBBWWBBWBW"\n7\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "WBWBBBW"\n2\n
 * // @lcpr case=end
 * 
 */
