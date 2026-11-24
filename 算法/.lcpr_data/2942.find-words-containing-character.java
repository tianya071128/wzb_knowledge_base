/*
 * @lc app=leetcode.cn id=2942 lang=java
 * @lcpr version=30204
 *
 * [2942] 查找包含给定字符的单词
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> findWordsContaining(String[] words, char x) {
        List<Integer> ans = new ArrayList<>();
        String s = String.valueOf(x);

        for (int i = 0; i < words.length; i++) {
            if (words[i].contains(s))
                ans.add(i);
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // ["leet","code"]\n"e"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["abc","bcd","aaaa","cbc"]\n"a"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["abc","bcd","aaaa","cbc"]\n"z"\n
 * // @lcpr case=end
 * 
 */
