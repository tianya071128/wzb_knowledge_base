/*
 * @lc app=leetcode.cn id=2441 lang=java
 * @lcpr version=30204
 *
 * [2441] 与对应负数同时存在的最大正整数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Set;

class Solution {
    public int findMaxK(int[] nums) {
        int ans = -1;
        Set<Integer> hash = new HashSet<>();

        for (int n : nums) {
            if (hash.contains(n * -1))
                ans = Math.max(ans, Math.abs(n));

            hash.add(n);
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [-1,2,-3,3]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [-1,10,6,7,-7,1]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [-10,8,6,7,-2,-3]\n
 * // @lcpr case=end
 * 
 */
