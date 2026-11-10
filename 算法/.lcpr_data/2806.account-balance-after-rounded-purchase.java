/*
 * @lc app=leetcode.cn id=2806 lang=java
 * @lcpr version=30204
 *
 * [2806] 取整购买后的账户余额
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
class Solution {
    public int accountBalanceAfterPurchase(int purchaseAmount) {
        int remainder = purchaseAmount % 10;

        return 100 - (purchaseAmount - remainder) - (remainder < 5 ? 0 : 10);
    }
}
// @lc code=end

/*
 * // @lcpr case=start
 * // 9\n
 * // @lcpr case=end
 * 
 * // @lcpr case=start
 * // 15\n
 * // @lcpr case=end
 * 
 */
