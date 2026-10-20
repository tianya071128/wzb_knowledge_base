/*
 * @lc app=leetcode.cn id=2404 lang=java
 * @lcpr version=30204
 *
 * [2404] 出现最频繁的偶数元素
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.HashMap;
import java.util.Map;

class Solution {
    public int mostFrequentEven(int[] nums) {
        int ans = -1,
                sum = 0; // 出现次数
        Map<Integer, Integer> hash = new HashMap<>();

        for (int n : nums) {
            if (n % 2 == 0) {
                int total = hash.getOrDefault(n, 0) + 1;
                hash.put(n, total);

                if (total > sum) {
                    sum = total;
                    ans = n;
                } else if (total == sum && n < ans) {
                    ans = n;
                }
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [0,1,2,2,4,4,1]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [4,4,4,9,2,4]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [29,47,21,41,13,37,25,7]\n
 * // @lcpr case=end
 * 
 */
