/*
 * @lc app=leetcode.cn id=2124 lang=java
 * @lcpr version=30204
 *
 * [2124] 检查是否所有 A 都在 B 之前
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public boolean checkString(String s) {
        boolean flag = false; // 是否遍历到了 b

        for (char c : s.toCharArray()) {
            if (c == 'b') {
                flag = true;
            } else {
                if (flag)
                    return false;
            }
        }

        return true;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "aaabbb"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "abab"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "bbb"\n
 * // @lcpr case=end
 * 
 */
