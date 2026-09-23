/*
 * @lc app=leetcode.cn id=2154 lang=java
 * @lcpr version=30204
 *
 * [2154] 将找到的值乘以 2
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

class Solution {
    public int findFinalValue(int[] nums, int original) {
        /** 转为 Set */
        Set<Integer> s = Arrays.stream(nums).boxed().collect(Collectors.toSet());

        while (s.contains(original)) {
            original *= 2;
        }

        return original;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [5,3,6,1,12]\n3\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [2,7,9]\n4\n
 * // @lcpr case=end
 * 
 */
