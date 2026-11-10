/*
 * @lc app=leetcode.cn id=2864 lang=java
 * @lcpr version=30204
 *
 * [2864] 最大二进制奇数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public String maximumOddBinaryNumber(String s) {
        /** 最后一位为 1，其他的 1 都放置在头部 */
        char[] list = s.toCharArray();
        int count = -1; // 1 的个数，排除末尾1

        for (int i = 0; i < list.length; i++) {
            if (list[i] == '1')
                count++;
        }

        for (int i = 0; i < list.length; i++) {
            if (i == list.length - 1 || i < count) {
                list[i] = '1';
            } else {
                list[i] = '0';
            }
        }

        return String.valueOf(list);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // "010"\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // "0101"\n
 * // @lcpr case=end
 * 
 */
