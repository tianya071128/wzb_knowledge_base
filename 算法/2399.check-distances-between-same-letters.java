/*
 * @lc app=leetcode.cn id=2399 lang=java
 * @lcpr version=30204
 *
 * [2399] 检查相同字母间的距离
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public boolean checkDistances(String s, int[] distance) {
        int[] preIndex = new int[26]; // 后面的索引都加 1, 因为初始化为 0, 标记

        for (int i = 0; i < s.length(); i++) {
            // 之前出现过该字符
            if (preIndex[s.charAt(i) - 'a'] != 0) {
                if (i - preIndex[s.charAt(i) - 'a'] != distance[s.charAt(i) - 'a'])
                    return false;

            }
            preIndex[s.charAt(i) - 'a'] = i + 1;
        }

        return true;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "abaccb"\n[1,3,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "aa"\n[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]\n
 * // @lcpr case=end
 * 
 */
