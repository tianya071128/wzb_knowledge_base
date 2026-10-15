/*
 * @lc app=leetcode.cn id=2363 lang=java
 * @lcpr version=30204
 *
 * [2363] 合并相似的物品
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Solution {
    public List<List<Integer>> mergeSimilarItems(int[][] items1, int[][] items2) {
        Map<Integer, Integer> hash = new HashMap<>();

        for (int[] item : items1) {
            hash.put(item[0], hash.getOrDefault(item[0], 0) + item[1]);
        }

        for (int[] item : items2) {
            hash.put(item[0], hash.getOrDefault(item[0], 0) + item[1]);
        }

        // 排序
        return hash.entrySet().stream().sorted((a, b) -> a.getKey() - b.getKey())
                .map(item -> List.of(item.getKey(), item.getValue())).toList();
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [[1,1],[4,5],[3,8]]\n[[3,1],[1,5]]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [[1,1],[3,2],[2,3]]\n[[2,1],[3,2],[1,3]]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [[1,3],[2,2]]\n[[7,1],[2,2],[1,4]]\n
 * // @lcpr case=end
 * 
 */
