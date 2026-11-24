/*
 * @lc app=leetcode.cn id=2956 lang=java
 * @lcpr version=30204
 *
 * [2956] 找到两个数组中的公共元素
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.Set;

class Solution {
    public int[] findIntersectionValues(int[] nums1, int[] nums2) {
        Set<Integer> intersection = Arrays.stream(nums1).boxed().collect(Collectors.toSet());

        // 交集
        intersection.retainAll(
                Arrays.stream(nums2).boxed().toList());

        return new int[] { (int) Arrays.stream(nums1).filter(intersection::contains).count(),
                (int) Arrays.stream(nums2).filter(intersection::contains).count() };
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [2,3,2]\n[1,2]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [4,3,2,3,1]\n[2,2,5,2,3,6]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [3,4,2,3]\n[1,5]\n
 * // @lcpr case=end
 * 
 */
