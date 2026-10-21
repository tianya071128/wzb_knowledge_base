/*
 * @lc app=leetcode.cn id=2500 lang=java
 * @lcpr version=30204
 *
 * [2500] 删除每行中的最大值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;

class Solution {
    public int deleteGreatestValue(int[][] grid) {
        int ans = 0,
                n = grid[0].length - 1;

        for (int i = n; i >= 0; i--) {
            int max = 0;
            for (int j = 0; j < grid.length; j++) {
                // 排序
                if (i == n)
                    Arrays.sort(grid[j]);

                max = Math.max(max, grid[j][i]);
            }

            ans += max;
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [[1,2,4],[3,3,1]]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [[10]]\n
 * // @lcpr case=end
 * 
 */
