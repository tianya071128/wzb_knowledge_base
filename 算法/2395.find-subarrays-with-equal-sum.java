/*
 * @lc app=leetcode.cn id=2395 lang=java
 * @lcpr version=30204
 *
 * [2395] 和相等的子数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.HashSet;
import java.util.Set;

class Solution {
    public boolean findSubarrays(int[] nums) {
        Set<Integer> hash = new HashSet<>();

        for (int i = 1; i < nums.length; i++) {
            int sum = nums[i] + nums[i - 1];

            if (hash.contains(sum))
                return true;

            hash.add(sum);
        }

        return false;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [4,2,4]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,2,3,4,5]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [0,0,0]\n
 * // @lcpr case=end
 * 
 */
