/*
 * @lc app=leetcode.cn id=2206 lang=java
 * @lcpr version=30204
 *
 * [2206] 将数组划分成相等数对
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;

class Solution {
    public boolean divideArray(int[] nums) {
        int[] count = new int[501];

        for (int num : nums) {
            count[num]++;
        }

        return Arrays.stream(count).allMatch(x -> x % 2 == 0);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [3,2,3,2,2,2]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,2,3,4]\n
 * // @lcpr case=end
 * 
 */
