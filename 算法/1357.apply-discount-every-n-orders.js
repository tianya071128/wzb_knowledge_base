/*
 * @lc app=leetcode.cn id=1357 lang=javascript
 * @lcpr version=30204
 *
 * [1357] 每隔 n 个顾客打折
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number} discount
 * @param {number[]} products
 * @param {number[]} prices
 */
var Cashier = function (n, discount, products, prices) {
  // 商品和价格建立 hash
  let hash = new Map();
  for (let i = 0; i < products.length; i++) {
    hash.set(products[i], prices[i]);
  }

  this.len = 0;
  this.n = n;
  this.discount = discount;
  this.hash = hash;
};

/**
 * @param {number[]} product
 * @param {number[]} amount
 * @return {number}
 */
Cashier.prototype.getBill = function (product, amount) {
  let total = 0;
  for (let i = 0; i < product.length; i++) {
    total += this.hash.get(product[i]) * amount[i];
  }

  if (++this.len % this.n === 0) {
    return total - (this.discount * total) / 100;
  }

  return total;
};

/**
 * Your Cashier object will be instantiated and called as such:
 * var obj = new Cashier(n, discount, products, prices)
 * var param_1 = obj.getBill(product,amount)
 */
// @lc code=end
