/*
 * @lc app=leetcode.cn id=2515 lang=java
 * @lcpr version=30204
 *
 * [2515] 到目标字符串的最短距离
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int closestTarget(String[] words, String target, int startIndex) {
        int ans = 0, // 走了多少步
                len = words.length;

        while (ans < len) {
            // 计算出向左向右的索引
            int r = (startIndex + ans) % len,
                    l = (startIndex - ans + len) % len;

            if (words[l].equals(target) || words[r].equals(target))
                return ans;

            ans++;
        }

        return -1;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // ["hello","i","am","leetcode","hello"]\n"hello"\n1\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["a","b","leetcode"]\n"leetcode"\n0\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["i","eat","leetcode"]\n"ate"\n0\n
 * // @lcpr case=end
 * 
 */
