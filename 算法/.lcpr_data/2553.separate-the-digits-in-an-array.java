/*
 * @lc app=leetcode.cn id=2553 lang=java
 * @lcpr version=30204
 *
 * [2553] 分割数组中数字的数位
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

class Solution {
    public int[] separateDigits(int[] nums) {
        List<Integer> ans = new ArrayList<>();

        for (int n : nums) {
            int i = ans.size();
            while (n > 0) {
                ans.add(i, n % 10);
                n /= 10;
            }
        }

        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [13,25,83,77]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [7,1,3,9]\n
 * // @lcpr case=end
 * 
 */
