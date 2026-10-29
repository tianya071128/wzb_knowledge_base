/*
 * @lc app=leetcode.cn id=2570 lang=java
 * @lcpr version=30204
 *
 * [2570] 合并两个二维数组 - 求和法
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public int[][] mergeArrays(int[][] nums1, int[][] nums2) {
        List<Integer[]> ans = new ArrayList<>();

        int p1 = 0, p2 = 0;

        while (p1 < nums1.length || p2 < nums2.length) {
            int[] cur;
            // 两个竞争
            if (p2 >= nums2.length || (p1 < nums1.length && nums1[p1][0] < nums2[p2][0])) {
                cur = nums1[p1];
                p1++;
            } else {
                cur = nums2[p2];
                p2++;
            }

            if (!ans.isEmpty() && ans.getLast()[0] == cur[0]) {
                // 跟最后一次一致
                ans.getLast()[1] += cur[1];
            } else {
                ans.add(new Integer[] { cur[0], cur[1] });
            }
        }

        return ans.stream().map((inner) -> Arrays.stream(inner).mapToInt(Integer::intValue).toArray())
                .toArray(int[][]::new);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [[1,2],[2,3],[4,5]]\n[[1,4],[3,2],[4,1]]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [[2,4],[3,6],[5,5]]\n[[1,3],[4,3]]\n
 * // @lcpr case=end
 * 
 */
