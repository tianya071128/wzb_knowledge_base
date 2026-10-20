/*
 * @lc app=leetcode.cn id=2418 lang=java
 * @lcpr version=30204
 *
 * [2418] 按身高排序
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.stream.IntStream;

class Solution {
    public String[] sortPeople(String[] names, int[] heights) {

        return IntStream.range(0, heights.length).mapToObj(i -> new int[] { heights[i], i })
                .sorted((a, b) -> b[0] - a[0]).map(item -> names[item[1]]).toArray(String[]::new);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // ["Mary","John","Emma"]\n[180,165,170]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["Alice","Bob","Bob"]\n[155,185,150]\n
 * // @lcpr case=end
 * 
 */
