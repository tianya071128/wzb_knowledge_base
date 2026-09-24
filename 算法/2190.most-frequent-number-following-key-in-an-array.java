/*
 * @lc app=leetcode.cn id=2190 lang=java
 * @lcpr version=30204
 *
 * [2190] 数组中紧跟 key 之后出现最频繁的数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.HashMap;
import java.util.Map;

class Solution {
    public int mostFrequent(int[] nums, int key) {
        Map<Integer, Integer> hash = new HashMap<>();
        int max = 0,
                ans = 0;

        for (int i = 0; i < nums.length - 1; i++) {
            if (nums[i] == key) {
                hash.put(nums[i + 1], hash.getOrDefault(nums[i + 1], 0) + 1);
            }
        }

        for (Map.Entry<Integer, Integer> item : hash.entrySet()) {
            if (item.getValue() > max) {
                max = item.getValue();
                ans = item.getKey();
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [1,100,200,1,100]\n1\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [2,2,2,2,3]\n2\n
 * // @lcpr case=end
 * 
 */
