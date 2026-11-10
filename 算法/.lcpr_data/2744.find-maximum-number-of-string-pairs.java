/*
 * @lc app=leetcode.cn id=2744 lang=java
 * @lcpr version=30204
 *
 * [2744] 最大字符串配对数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.HashMap;
import java.util.Map;

class Solution {
    public int maximumNumberOfStringPairs(String[] words) {
        Map<String, Integer> hash = new HashMap<>();
        int ans = 0;

        for (String str : words) {
            ans += hash.getOrDefault(new StringBuilder(str).reverse().toString(), 0);

            hash.put(str, hash.getOrDefault(str, 0) + 1);
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // ["cd","ac","dc","ca","zz"]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["ab","ba","cc"]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["aa","ab"]\n
 * // @lcpr case=end
 * 
 */
