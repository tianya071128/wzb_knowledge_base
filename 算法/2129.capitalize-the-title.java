/*
 * @lc app=leetcode.cn id=2129 lang=java
 * @lcpr version=30204
 *
 * [2129] 将标题首字母大写
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.stream.Stream;

class Solution {
    public String capitalizeTitle(String title) {
        return Arrays.stream(title.split(" ")).map(item -> {
            if (item.length() <= 2)
                return item.toLowerCase();

            return Character.toUpperCase(item.charAt(0)) + item.substring(1).toLowerCase();
        }).collect(Collectors.joining(" "));
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "capiTalIze tHe titLe"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "First leTTeR of EACH Word"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "i lOve leetcode"\n
 * // @lcpr case=end
 * 
 */
