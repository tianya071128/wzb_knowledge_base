/*
 * @lc app=leetcode.cn id=2578 lang=java
 * @lcpr version=30204
 *
 * [2578] 最小和分割
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Comparator;
import java.util.List;

class Solution {
    public int splitNum(int num) {
        List<Integer> list = new ArrayList<>();
        int n1 = 0,
                n2 = 0;

        while (num > 0) {
            list.add(num % 10);
            num /= 10;
        }

        list.sort(Comparator.naturalOrder());

        for (int i = 0; i < list.size(); i++) {
            n1 = n1 * 10 + list.get(i);

            if (++i < list.size()) {
                n2 = n2 * 10 + list.get(i);
            }
        }

        return n1 + n2;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // 4325\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 687\n
 * // @lcpr case=end
 * 
 */
