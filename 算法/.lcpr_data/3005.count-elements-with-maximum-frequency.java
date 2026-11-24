/*
 * @lc app=leetcode.cn id=3005 lang=java
 * @lcpr version=30204
 *
 * [3005] 最大频率元素计数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int maxFrequencyElements(int[] nums) {
        Map<Integer, Integer> hash = new HashMap<>();

        for (int n : nums) {
            hash.put(n, hash.getOrDefault(n, 0) + 1);
        }

        int ans = 0;
        int[] list = hash.values().stream().sorted(Comparator.reverseOrder()).mapToInt(Integer::valueOf).toArray();

        for (int n : list) {
            if (n != list[0])
                break;

            ans += n;
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [1,2,2,3,1,4]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,2,3,4,5]\n
 * // @lcpr case=end
 * 
 */
