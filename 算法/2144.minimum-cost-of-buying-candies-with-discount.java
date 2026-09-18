/*
 * @lc app=leetcode.cn id=2144 lang=java
 * @lcpr version=30204
 *
 * [2144] 打折购买糖果的最小开销
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;

class Solution {
    public int minimumCost(int[] cost) {
        // 排序: 每次购买最大的两个, 免费送一个
        int ans = 0;

        Arrays.sort(cost); // 自然排序: 升序

        for (int i = cost.length - 1; i >= 0; i--) {
            // 如果是第三个的话, 就跳过
            if ((cost.length - i) % 3 == 0)
                continue;

            ans += cost[i];
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [1,2,3]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [6,5,7,9,2,2]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [5,5]\n
 * // @lcpr case=end
 * 
 */
