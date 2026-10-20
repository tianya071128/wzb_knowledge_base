/*
 * @lc app=leetcode.cn id=2423 lang=java
 * @lcpr version=30204
 *
 * [2423] 删除字符使频率相同
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean equalFrequency(String word) {
        /** 统计数量 */
        int[] total = new int[26];

        for (int i = 0; i < word.length(); i++) {
            total[word.charAt(i) - 'a']++;
        }

        /** 将数量使用 Map 统计 */
        Map<Integer, Integer> hash = new HashMap<>();

        for (int n : total) {
            if (n == 0)
                continue;

            hash.put(n, hash.getOrDefault(n, 0) + 1);

            // 存在三个不同频的, 直接退出
            if (hash.size() > 2)
                return false;
        }

        Integer[] list = hash.keySet().toArray(new Integer[0]);

        // 只有一个频率的, 判断字母是否为一个或者频率为 1
        if (hash.size() < 2)
            return hash.get(list[0]) == 1 || list[0] == 1;

        // (频率更大的字母只有一个, 并且两个的频率差为一) || (有一个频率为 1 的并且字母数量为 1)
        return (hash.get(Math.max(list[0], list[1])) == 1
                && Math.abs(list[0] - list[1]) == 1)
                || (Math.min(list[0], list[1]) == 1 && hash.get(
                        Math.min(list[0], list[1])) == 1);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "abcc"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "aazz"\n
 * // @lcpr case=end
 * 
 */
