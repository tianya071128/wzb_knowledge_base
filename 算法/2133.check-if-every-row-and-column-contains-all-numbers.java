/*
 * @lc app=leetcode.cn id=2133 lang=java
 * @lcpr version=30204
 *
 * [2133] 检查是否每一行每一列都包含全部整数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.HashSet;
import java.util.Set;

class Solution {
    public boolean checkValid(int[][] matrix) {
        int n = matrix.length; // 一行总数

        for (int i = 0; i < n; i++) {
            Set<Integer> rowSum = new HashSet<>(),
                    columnSum = new HashSet<>();

            for (int j = 0; j < n; j++) {
                rowSum.add(matrix[i][j]);
                columnSum.add(matrix[j][i]);
            }

            if (rowSum.size() != n || columnSum.size() != n)
                return false;
        }

        return true;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [[2,2,2],[2,2,2],[2,2,2]]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [[1,1,1],[1,2,3],[1,2,3]]\n
 * // @lcpr case=end
 * 
 */
