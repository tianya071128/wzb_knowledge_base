/*
 * @lc app=leetcode.cn id=2078 lang=java
 * @lcpr version=30204
 *
 * [2078] 两栋颜色不同且距离最远的房子
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int maxDistance(int[] colors) {
        /**
         * 最远的一定是:
         * - 两端的一个房子与不同端颜色不同的房子的距离
         */
        int len = colors.length;
        for (int i = 0; i < len; i++) {
            if (colors[i] != colors[len - 1] || colors[len - i - 1] != colors[0])
                return len - i - 1;
        }

        return -1;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [1,1,1,6,1,1,1]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,8,3,8,3]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [0,1]\n
 * // @lcpr case=end
 * 
 */
