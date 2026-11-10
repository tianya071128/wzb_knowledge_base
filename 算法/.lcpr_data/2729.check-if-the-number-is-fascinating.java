/*
 * @lc app=leetcode.cn id=2729 lang=java
 * @lcpr version=30204
 *
 * [2729] 判断一个数是否迷人
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public boolean isFascinating(int n) {

        String str = String.valueOf(n) + String.valueOf(n * 2) + String.valueOf(n * 3);

        if (str.length() != 9)
            return false;

        int[] flags = new int[10];

        for (int i = 0; i < str.length(); i++) {
            if (str.charAt(i) == '0' || ++flags[str.charAt(i) - '0'] > 1)
                return false;
        }

        return true;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // 192\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 100\n
 * // @lcpr case=end
 * 
 */
