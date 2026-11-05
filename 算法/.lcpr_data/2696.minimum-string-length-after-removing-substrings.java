/*
 * @lc app=leetcode.cn id=2696 lang=java
 * @lcpr version=30204
 *
 * [2696] 删除子串后的字符串最小长度
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Stack;

class Solution {
    public int minLength(String s) {
        Stack<Character> stack = new Stack<>();

        for (int i = 0; i < s.length(); i++) {
            char cur = s.charAt(i);
            if (cur == 'B' && stack.size() > 0 && stack.peek() == 'A') {
                stack.pop();
            } else if (cur == 'D' && stack.size() > 0 && stack.peek() == 'C') {
                stack.pop();
            } else {
                stack.push(cur);
            }
        }

        return stack.size();
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "ABFCACDB"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "ACBBD"\n
 * // @lcpr case=end
 * 
 */
