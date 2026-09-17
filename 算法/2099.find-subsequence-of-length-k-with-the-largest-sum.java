/*
 * @lc app=leetcode.cn id=2099 lang=java
 * @lcpr version=30204
 *
 * [2099] 找到和最大的长度为 K 的子序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int[] maxSubsequence(int[] nums, int k) {
        int n = nums.length;
        int[][] vals = new int[n][2]; // 二维数组存储索引和值
        for (int i = 0; i < n; ++i) {
            vals[i][0] = i; // 存储索引
            vals[i][1] = nums[i]; // 存储值
        }
        // 按照数值降序排序
        Arrays.sort(vals, (x1, x2) -> Integer.compare(x2[1], x1[1]));
        // 取前 k 个并按照下标升序排序
        Arrays.sort(vals, 0, k, (x1, x2) -> Integer.compare(x1[0], x2[0]));
        int[] res = new int[k]; // 目标子序列
        for (int i = 0; i < k; ++i) {
            res[i] = vals[i][1];
        }
        return res;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [2,1,3,3]\n2\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [-1,-2,3,4]\n3\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [3,4,3,3]\n2\n
 * // @lcpr case=end
 * 
 */
