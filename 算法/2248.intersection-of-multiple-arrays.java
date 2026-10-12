/*
 * @lc app=leetcode.cn id=2248 lang=java
 * @lcpr version=30204
 *
 * [2248] 多个数组求交集
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

class Solution {
    public List<Integer> intersection(int[][] nums) {
        Set<Integer> ans = new HashSet<>(Arrays.stream(nums[0]).boxed().toList());

        for (int i = 1; i < nums.length; i++) {
            ans.retainAll(Arrays.stream(nums[i]).boxed().toList());
        }

        return ans.stream().sorted().toList();
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [[3,1,2,4,5],[1,2,3,4],[3,4,5,6]]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [[1,2,3],[4,5,6]]\n
 * // @lcpr case=end
 * 
 */
