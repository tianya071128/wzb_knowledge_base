/*
 * @lc app=leetcode.cn id=122 lang=typescript
 * @lcpr version=30204
 *
 * [122] 买卖股票的最佳时机 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function maxProfit(prices: number[]): number {
  /**
   * 解题思路: 在低谷买入, 在高峰卖出
   *  - 判断低谷的条件: 当前价格比前一天和后一天都低
   *  - 判断高峰的条件: 当前价格比前一天和后一天都高
   */

  // 在开头和结尾增加一个最大值和最小值
  prices.unshift(Infinity);
  prices.push(-Infinity);

  let res = 0,
    occasion: 0 | 1 = 0, // 当前行为: 0 购入, 1 出售
    holdPrice = 0; // 持有价格

  for (let i = 1; i < prices.length - 1; i++) {
    const price = prices[i],
      prevPrice = prices[i - 1],
      nextPrice = prices[i + 1];

    // 购买时机
    if (occasion === 0) {
      if (price <= prevPrice && price < nextPrice) {
        occasion = 1;
        holdPrice = price;
      }
    }
    // 寻找出售时机
    else {
      if (price >= prevPrice && price > nextPrice) {
        occasion = 0;
        res += price - holdPrice;
      }
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
// [1,2,3,4,5]\n
// @lcpr case=end

// @lcpr case=start
// [7,6,4,3,1]\n
// @lcpr case=end

 */
