/*
 * @lc app=leetcode.cn id=2335 lang=java
 * @lcpr version=30204
 *
 * [2335] 装满杯子需要的最短总时长
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;

class Solution {
    public int fillCups(int[] amount) {
        Arrays.sort(amount);

        /** 每次处理最大和次大的 */
        int max = amount[2],
                min = amount[0],
                center = amount[1],
                ans = 0;

        while (max != 0) {
            ans++;

            max--;
            if (center != 0)
                center--;
            // 交换位置
            if (min > center) {
                int temp = center;
                center = min;
                min = temp;
                // 交换位置
                if (center > max) {
                    temp = max;
                    max = center;
                    center = temp;
                }
            }

        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [1,4,2]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [5,4,4]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [5,0,0]\n
 * // @lcpr case=end
 * 
 */
