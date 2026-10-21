/*
 * @lc app=leetcode.cn id=2465 lang=java
 * @lcpr version=30204
 *
 * [2465] 不同的平均值数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int distinctAverages(int[] nums) {
        Set<Double> hash = new HashSet<>();

        Arrays.sort(nums);

        for (int i = 0; i < nums.length / 2; i++) {
            hash.add((double) (nums[i] + nums[nums.length - i - 1]) / 2);
        }

        return hash.size();
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [4,1,4,0,3,5]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,100]\n
 * // @lcpr case=end
 * 
 */
