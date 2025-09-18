/*
 * @lc app=leetcode.cn id=901 lang=javascript
 * @lcpr version=30204
 *
 * [901] 股票价格跨度
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

var StockSpanner = function () {
  /**
   * 使用两个变量存储:
   *  1. 存储股票价格
   *  2. 存储对应股票的跨度 --> 用于寻找时可根据跨度跳过对应的股票
   */
  this.prices = [];
  this.spanner = [];
};

/**
 * @param {number} price
 * @return {number}
 */
StockSpanner.prototype.next = function (price) {
  let ans = 1;
  for (let i = this.prices.length - 1; i >= 0; ) {
    // 不满足 - 退出循环
    if (this.prices[i] > price) break;

    ans += this.spanner[i];
    i -= this.spanner[i];
  }

  this.prices.push(price);
  this.spanner.push(ans);

  return ans;
};

/**
 * Your StockSpanner object will be instantiated and called as such:
 * var obj = new StockSpanner()
 * var param_1 = obj.next(price)
 */
// @lc code=end

/*
// @lcpr case=start
// ["StockSpanner", "next", "next", "next", "next", "next", "next", "next"]\n[[], [100], [80], [60], [70], [60], [75], [85]]\n
// @lcpr case=end

 */
