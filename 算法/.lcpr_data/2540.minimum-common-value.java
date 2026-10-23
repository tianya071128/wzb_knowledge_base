/*
 * @lc app=leetcode.cn id=2540 lang=java
 * @lcpr version=30204
 *
 * [2540] 最小公共值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

class Solution {
    public int getCommon(int[] nums1, int[] nums2) {
        Set<Integer> hash = Arrays.stream(nums1).boxed().collect(Collectors.toSet());

        for (int n : nums2) {
            if (hash.contains(n))
                return n;
        }

        return -1;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [1,2,3]\n[2,4]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,2,3,6]\n[2,3,4,5]\n
 * // @lcpr case=end
 * 
 */
