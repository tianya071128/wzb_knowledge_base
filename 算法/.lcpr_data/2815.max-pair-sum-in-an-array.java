/*
 * @lc app=leetcode.cn id=2815 lang=java
 * @lcpr version=30204
 *
 * [2815] 数组中的最大数对和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.HashMap;
import java.util.Map;

class Solution {
    public int maxSum(int[] nums) {
        int ans = -1;
        Map<Integer, Integer> hash = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int cur = String.valueOf(nums[i]).chars().max().getAsInt();

            if (hash.containsKey(cur)) {
                ans = Math.max(ans, nums[i] + hash.get(cur));
            }

            hash.put(cur, Math.max(hash.getOrDefault(cur, -1), nums[i]));
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [51,71,17,24,42]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,2,3,4]\n
 * // @lcpr case=end
 * 
 */
