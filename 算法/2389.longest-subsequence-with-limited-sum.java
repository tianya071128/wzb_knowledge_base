/*
 * @lc app=leetcode.cn id=2389 lang=java
 * @lcpr version=30204
 *
 * [2389] 和有限的最长子序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;

class Solution {
    public int[] answerQueries(int[] nums, int[] queries) {
        /** 给 nums 排序, 并计算前缀和 */
        Arrays.sort(nums);

        int[] prefixSum = new int[nums.length];
        prefixSum[0] = nums[0];

        for (int i = 1; i < nums.length; i++) {
            prefixSum[i] = prefixSum[i - 1] + nums[i];
        }

        /** 二分搜索: 左闭右开 */
        for (int i = 0; i < queries.length; i++) {
            int l = 0,
                    r = prefixSum.length;

            while (l < r) {
                int middle = l + (r - l) / 2;

                if (prefixSum[middle] > queries[i]) {
                    r = middle;
                } else {
                    l = middle + 1;
                }
            }

            queries[i] = l;
        }

        return queries;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [4,5,2,1]\n[3,10,21]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [2,3,4,5]\n[1]\n
 * // @lcpr case=end
 * 
 */
