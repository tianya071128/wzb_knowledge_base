/*
 * @lc app=leetcode.cn id=121 lang=typescript
 * @lcpr version=30204
 *
 * [121] 买卖股票的最佳时机
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function maxProfit(prices: number[]): number {
  /**
   * 常规方式: 迭代计算
   */
  let res = 0,
    purchasePrice = prices[0];
  for (let i = 1; i < prices.length; i++) {
    const price = prices[i];

    res = Math.max(price - purchasePrice, res);

    // 如果当前价格比持有价格还低, 变为持有价格
    if (price - purchasePrice < 0) {
      purchasePrice = price;
    }
  }

  return res;
}
// @lc code=end

/*
// @lcpr case=start
// [7,1,5,3,6,4]\n
// @lcpr case=end

// @lcpr case=start
// [7,6,4,3,1]\n
// @lcpr case=end

 */
