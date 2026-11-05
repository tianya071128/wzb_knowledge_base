/*
 * @lc app=leetcode.cn id=2643 lang=java
 * @lcpr version=30204
 *
 * [2643] 一最多的行
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int[] rowAndMaximumOnes(int[][] mat) {
        int[] ans = new int[2];

        for (int i = 0; i < mat.length; i++) {

            int cur = 0;

            for (int n : mat[i]) {
                if (n == 1)
                    cur++;
            }

            if (cur > ans[1]) {
                ans[0] = i;
                ans[1] = cur;
            }

        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [[0,1],[1,0]]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [[0,0,0],[0,1,1]]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [[0,0],[1,1],[0,0]]\n
 * // @lcpr case=end
 * 
 */
