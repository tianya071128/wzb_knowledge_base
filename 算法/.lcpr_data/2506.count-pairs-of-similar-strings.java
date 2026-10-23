/*
 * @lc app=leetcode.cn id=2506 lang=java
 * @lcpr version=30204
 *
 * [2506] 统计相似字符串对的数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.HashMap;
import java.util.Map;

class Solution {
    public int similarPairs(String[] words) {
        Map<String, Integer> hash = new HashMap<>();

        for (String word : words) {
            String[] list = new String[26];

            for (int i = 0; i < word.length(); i++) {
                list[word.charAt(i) - 'a'] = "y";
            }

            String joinStr = String.join(",", list);
            hash.put(joinStr, hash.getOrDefault(joinStr, 0) + 1);
        }

        // 计算
        int ans = 0;

        for (Integer n : hash.values()) {
            if (n < 2)
                continue;
            ans += (n * (n - 1)) / 2;
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // ["aba","aabb","abcd","bac","aabc"]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["aabb","ab","ba"]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["nba","cba","dba"]\n
 * // @lcpr case=end
 * 
 */
