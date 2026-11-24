/*
 * @lc app=leetcode.cn id=2965 lang=java
 * @lcpr version=30204
 *
 * [2965] 找出缺失和重复的数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int[] findMissingAndRepeatedValues(int[][] grid) {
        int[] mark = new int[grid.length * grid.length + 1];

        for (int[] item : grid) {
            for (int item2 : item) {
                mark[item2]++;
            }
        }

        int[] ans = new int[2];

        for (int i = 1; i < mark.length; i++) {
            if (mark[i] == 0) {
                ans[1] = i;
            } else if (mark[i] == 2) {
                ans[0] = i;
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [[1,3],[2,2]]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [[9,1,7],[8,9,2],[3,4,6]]\n
 * // @lcpr case=end
 * 
 */
