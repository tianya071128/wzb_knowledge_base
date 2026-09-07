/*
 * @lc app=leetcode.cn id=2047 lang=java
 * @lcpr version=30204
 *
 * [2047] 句子中的有效单词数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int countValidWords(String sentence) {
        // 结果
        int ans = 0;
        // 遍历的指针
        int p = 0;
        // 长度
        int len = sentence.length();

        while (p < len) {
            // 是否有效的单词
            boolean flag = true;
            // 内部循环判断是否为有效单词
            while (p < len && sentence.charAt(p) != ' ') {
                if (flag) {
                    char c = sentence.charAt(p);

                    // 如果存在数字, 直接返回
                    if (Character.isDigit(c)) {
                        flag = false;
                    }
                    // 如果存在 -
                    else if (c == '-') {
                        // 判断上一个字符和下一个字符是否为 ' ' 或者结尾
                        if (p == 0 ||
                                sentence.charAt(p - 1) == ' ' ||
                                p == len - 1 ||
                                !Character.isLetter(sentence.charAt(p + 1))) {
                            flag = false;
                        }
                    }
                }

                p++;
            }
        }

        return ans;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "cat and  dog"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "!this  1-s b8d!"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "alice and  bob are playing stone-game10"\n
 * // @lcpr case=end
 * 
 */
