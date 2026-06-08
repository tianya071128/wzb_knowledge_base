/*
 * @lc app=leetcode.cn id=1475 lang=javascript
 * @lcpr version=30204
 *
 * [1475] 商品折扣后的最终价格
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} prices
 * @return {number[]}
 */
var finalPrices = function (prices) {
  // 单调递增栈
  let stack = [];
  for (let i = prices.length - 1; i >= 0; i--) {
    let item = prices[i];
    // 如果当前项比栈顶的数要小, 那么出栈
    while (stack.length && stack.at(-1) > item) {
      stack.pop();
    }

    prices[i] = item - (stack.at(-1) ?? 0);

    stack.push(item);
  }

  return prices;
};
// @lc code=end

/*
// @lcpr case=start
// [8,4,6,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5]\n
// @lcpr case=end

// @lcpr case=start
// [10,1,1,6]\n
// @lcpr case=end

 */
