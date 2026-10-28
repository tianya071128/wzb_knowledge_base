/*
 * @lc app=leetcode.cn id=2660 lang=java
 * @lcpr version=30204
 *
 * [2660] 保龄球游戏的获胜者
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int isWinner(int[] player1, int[] player2) {
        int prev1 = -5,
                prev2 = -5,
                sum1 = 0,
                sum2 = 0;
        for (int i = 0; i < player1.length; i++) {
            sum1 += player1[i] * (i - prev1 <= 2 ? 2 : 1);
            sum2 += player2[i] * (i - prev2 <= 2 ? 2 : 1);

            if (player1[i] == 10)
                prev1 = i;

            if (player2[i] == 10)
                prev2 = i;
        }

        return sum1 == sum2 ? 0 : sum1 > sum2 ? 1 : 2;
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // [5,10,3,2]\n[6,5,7,3]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [3,5,7,6]\n[8,10,10,2]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [2,3]\n[4,1]\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // [1,1,1,10,10,10,10]\n[10,10,10,10,1,1,1]\n
 * // @lcpr case=end
 * 
 */
