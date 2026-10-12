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
        List<Integer> odd = new ArrayList<>();
        List<Integer> even = new ArrayList<>();
        List<Integer> list = new ArrayList<>(); // 每一位数字

        // 提取出最后一位数字
        while (num > 0) {
            int n = num % 10;

            num /= 10;

            if (n % 2 == 0) {
                even.add(n);
            } else {
                odd.add(n);
            }
            list.addFirst(n);
        }

        // 排序
        odd.sort(Comparator.reverseOrder());
        even.sort(Comparator.reverseOrder());

        int ans = 0,
                oddP = 0,
                evenP = 0;
        for (Integer n : list) {
            ans = ans * 10 + (n % 2 == 0 ? even.get(evenP++) : odd.get(oddP++));
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
