/*
 * @lc app=leetcode.cn id=2605 lang=java
 * @lcpr version=30204
 *
 * [2605] 从两个数字数组里生成最小数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int minNumber(int[] nums1, int[] nums2) {
        int min1 = 10,
                min2 = 10,
                repeatMin = 10;
        int[] hash = new int[10];

        for (int n : nums1) {
            min1 = Math.min(min1, n);
            hash[n] = 1;
        }

        for (int n : nums2) {
            min2 = Math.min(min2, n);

            if (hash[n] == 1)
                repeatMin = Math.min(repeatMin, n);
        }

        if (repeatMin != 10)
            return repeatMin;

        return Math.min(min1, min2) * 10 + Math.max(min1, min2);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [4,1,3]\n[5,7]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [3,5,2,6]\n[3,1,7]\n
 * // @lcpr case=end
 * 
 */
