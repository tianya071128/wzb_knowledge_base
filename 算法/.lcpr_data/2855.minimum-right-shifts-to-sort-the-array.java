/*
 * @lc app=leetcode.cn id=2855 lang=java
 * @lcpr version=30204
 *
 * [2855] 使数组成为递增数组的最少右移次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.List;

class Solution {
    public int minimumRightShifts(List<Integer> nums) {

        int g = -1;
        for (int i = 1; i < nums.size(); i++) {
            if (nums.get(i) < nums.get(i - 1)) {
                if (g != -1)
                    return -1;
                g = i;
            }
        }

        if (g == -1)
            return 0;

        if (nums.get(0) < nums.getLast())
            return -1;

        return nums.size() - g;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [3,4,5,1,2]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,3,5]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [2,1,4]\n
 * // @lcpr case=end
 * 
 */
