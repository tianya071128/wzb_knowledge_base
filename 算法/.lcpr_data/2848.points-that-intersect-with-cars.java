/*
 * @lc app=leetcode.cn id=2848 lang=java
 * @lcpr version=30204
 *
 * [2848] 与车相交的点
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.List;

class Solution {
    public int numberOfPoints(List<List<Integer>> nums) {
        /** 差分数组 */
        int[] diff = new int[102];

        for (List<Integer> n : nums) {
            diff[n.get(0)]++;
            diff[n.get(1) + 1]--;
        }

        int prev = 0,
                ans = 0;

        for (int i = 1; i <= 100; i++) {
            prev += diff[i];

            if (prev > 0)
                ans++;
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [[3,6],[1,5],[4,7]]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [[1,3],[5,8]]\n
 * // @lcpr case=end
 * 
 */
