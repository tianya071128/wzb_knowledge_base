/*
 * @lc app=leetcode.cn id=2085 lang=java
 * @lcpr version=30204
 *
 * [2085] 统计出现过一次的公共字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Map;

class Solution {
    public int countWords(String[] words1, String[] words2) {
        // 字符数量的 hash
        Map<String, Integer> hash1 = new HashMap();
        Map<String, Integer> hash2 = new HashMap();
        int ans = 0;

        for (String string : words1) {
            hash1.put(string, hash1.getOrDefault(string, 0) + 1);
        }

        for (String string : words2) {
            hash2.put(string, hash2.getOrDefault(string, 0) + 1);
        }

        for (Map.Entry<String, Integer> item : hash1.entrySet()) {
            if (item.getValue() == 1 && hash2.getOrDefault(item.getKey(), 0) == 1) {
                ans++;
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // ["leetcode","is","amazing","as","is"]\n["amazing","leetcode","is"]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["b","bb","bbb"]\n["a","aa","aaa"]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["a","ab"]\n["a","a","a","ab"]\n
 * // @lcpr case=end
 * 
 */
