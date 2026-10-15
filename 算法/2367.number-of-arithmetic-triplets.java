/*
 * @lc app=leetcode.cn id=2367 lang=java
 * @lcpr version=30204
 *
 * [2367] 等差三元组的数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

class Solution {
    public int arithmeticTriplets(int[] nums, int diff) {
        Set<Integer> hash = Arrays.stream(nums).boxed().collect(Collectors.toSet());
        int ans = 0;

        for (int n : nums) {
            if (hash.contains(n - diff) && hash.contains(n - diff * 2))
                ans++;

            hash.add(n);
        }
        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [0,1,4,6,7,10]\n3\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [4,5,6,7,8,9]\n2\n
 * // @lcpr case=end
 * 
 */
