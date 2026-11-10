/*
 * @lc app=leetcode.cn id=2798 lang=java
 * @lcpr version=30204
 *
 * [2798] 满足目标工作时长的员工数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;

class Solution {
    public int numberOfEmployeesWhoMetTarget(int[] hours, int target) {
        return (int) Arrays.stream(hours).filter(hour -> hour >= target).count();
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [0,1,2,3,4]\n2\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [5,1,4,2,2]\n6\n
 * // @lcpr case=end
 * 
 */
