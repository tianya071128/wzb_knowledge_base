/*
 * @lc app=leetcode.cn id=2341 lang=java
 * @lcpr version=30204
 *
 * [2341] 数组能形成多少数对
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] numberOfPairs(int[] nums) {
        Map<Integer, Integer> map = new HashMap<>();
        int ans = 0;

        for (int i : nums) {
            map.put(i, map.getOrDefault(i, 0) + 1);
        }

        for (int i : map.values()) {
            ans += i / 2;
        }

        return new int[] { ans, nums.length - ans * 2 };
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [1,3,2,1,3,2,2]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,1]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [0]\n
 * // @lcpr case=end
 * 
 */
