/*
 * @lc app=leetcode.cn id=2210 lang=java
 * @lcpr version=30204
 *
 * [2210] 统计数组中峰和谷的数量
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int countHillValley(int[] nums) {
        /**
         * 记录下之前的是升还是降
         */
        int ans = 0,
                direction = 0, // 1 升 | -1 降 | 0 初始
                prev = nums[0]; // 上一个值

        for (int i = 1; i < nums.length; i++) {
            // 相同值不做处理
            if (nums[i] == prev)
                continue;

            int curDirection = nums[i] > prev ? 1 : -1;

            if (direction != 0 && curDirection != direction) {
                ans++;
                direction = curDirection;
            }
            direction = curDirection;
            prev = nums[i];
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [2,4,1,1,6,5]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [6,6,5,5,4,1]\n
 * // @lcpr case=end
 * 
 */
