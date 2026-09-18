/*
 * @lc app=leetcode.cn id=2138 lang=java
 * @lcpr version=30204
 *
 * [2138] 将字符串拆分为若干长度为 k 的组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.ArrayList;
import java.util.List;

class Solution {
    public String[] divideString(String s, int k, char fill) {
        if (s.length() % k != 0) {
            s = s + String.valueOf(fill).repeat(k - s.length() % k);
        }

        List<String> ans = new ArrayList<>();

        for (int i = 0; i < s.length(); i++) {
            if (ans.isEmpty() || ans.getLast().length() == k) {
                ans.add("");
            }

            ans.set(ans.size() - 1, ans.getLast() + s.charAt(i));
        }

        return ans.toArray(new String[ans.size()]);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "abcdefghi"\n3\n'x'\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "abcdefghij"\n3\n'x'\n
 * // @lcpr case=end
 * 
 */
