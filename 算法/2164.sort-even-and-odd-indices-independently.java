/*
 * @lc app=leetcode.cn id=2164 lang=java
 * @lcpr version=30204
 *
 * [2164] 对奇偶下标分别排序
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;
import java.util.stream.IntStream;

class Solution {
    public int[] sortEvenOdd(int[] nums) {
        // 对索引和数值一起进行排序
        int[][] list = IntStream.range(0, nums.length).mapToObj(i -> new int[] { i, nums[i] })
                .sorted((a, b) -> Integer.compare(a[1], b[1])).toArray(int[][]::new);

        // 偶数的索引
        int i = 0,
                j = nums.length % 2 == 0 ? nums.length - 1 : nums.length - 2;

        for (int[] js : list) {
            if (js[0] % 2 == 0) {
                nums[i] = js[1];
                i += 2;
            } else {
                nums[j] = js[1];
                j -= 2;
            }
        }

        return nums;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [4,1,2,3]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [2,1]\n
 * // @lcpr case=end
 * 
 */
