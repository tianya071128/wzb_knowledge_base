/*
 * @lc app=leetcode.cn id=2094 lang=java
 * @lcpr version=30204
 *
 * [2094] 找出 3 位偶数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.ArrayList;
import java.util.Collections;
import java.util.Set;
import java.util.TreeSet;

class Solution {
    public int[] findEvenNumbers(int[] digits) {
        /**
         * 最后一位是偶数就是偶数
         */
        Set<Integer> ans = new TreeSet<>();

        for (int i = 0; i < digits.length; i++) {
            // 不能是前导零
            if (digits[i] == 0)
                continue;

            for (int j = 0; j < digits.length; j++) {
                if (j == i)
                    continue;
                for (int k = 0; k < digits.length; k++) {
                    if (k == i || k == j || digits[k] % 2 == 1)
                        continue;

                    ans.add(digits[i] * 100 + digits[j] * 10 + digits[k]);
                }
            }
        }

        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [2,1,3,0]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [2,2,8,8,2]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [3,7,5]\n
 * // @lcpr case=end
 * 
 */
