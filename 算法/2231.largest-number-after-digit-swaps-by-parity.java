/*
 * @lc app=leetcode.cn id=2231 lang=java
 * @lcpr version=30204
 *
 * [2231] 按奇偶性交换后的最大数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

class Solution {
    public int largestInteger(int num) {
        List<Integer> one = new ArrayList<>();
        List<Integer> two = new ArrayList<>();
        List<Integer> cur = one;

        // 提取出最后一位数字
        while (num > 0) {
            int n = num % 10;

            num /= 10;

            cur.add(n);

            cur = cur == one ? two : one;
        }

        // 排序
        one.sort(Comparator.naturalOrder());
        two.sort(Comparator.naturalOrder());

        int ans = 0,
                base = 1; // 基数
        for (int i = 0; i < one.size(); i++) {
            ans = ans + one.get(i) * base;

            base *= 10;

            if (i < two.size()) {
                ans = ans + two.get(i) * base;
                base *= 10;
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // 1234\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 65875\n
 * // @lcpr case=end
 * 
 */
