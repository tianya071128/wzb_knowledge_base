/*
 * @lc app=leetcode.cn id=2788 lang=java
 * @lcpr version=30204
 *
 * [2788] 按分隔符拆分字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

class Solution {
    public List<String> splitWordsBySeparator(List<String> words, char separator) {
        return words.stream().flatMap(word -> Arrays.stream(word.split(Pattern.quote(
                String.valueOf(separator))))).filter(str -> !str.isBlank()).toList();
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // ["one.two.three","four.five","six"]\n"."\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["$easy$","$problem$"]\n"$"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // ["|||"]\n"|"\n
 * // @lcpr case=end
 * 
 */
