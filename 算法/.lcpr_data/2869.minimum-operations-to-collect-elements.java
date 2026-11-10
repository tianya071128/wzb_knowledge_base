/*
 * @lc app=leetcode.cn id=2869 lang=java
 * @lcpr version=30204
 *
 * [2869] 收集元素的最少操作次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.HashSet;
import java.util.List;

class Solution {
    public int minOperations(List<Integer> nums, int k) {
        Set<Integer> hash = new HashSet<>();

        for (int i = nums.size() - 1; i >= 0; i--) {
            if (nums.get(i) <= k)
                hash.add(nums.get(i));

            if (hash.size() == k)
                return nums.size() - i;
        }

        return -1;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [3,1,5,4,2]\n2\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [3,1,5,4,2]\n5\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [3,2,5,3,1]\n3\n
 * // @lcpr case=end
 * 
 */
