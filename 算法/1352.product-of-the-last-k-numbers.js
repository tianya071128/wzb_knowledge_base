/*
 * @lc app=leetcode.cn id=1352 lang=javascript
 * @lcpr version=30204
 *
 * [1352] 最后 K 个数的乘积
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

var ProductOfNumbers = function () {
  /**
   * 1. 记录下乘积的和, 注意碰到 0 之后重新计数
   *      - e.g: [2,3,4,5]  --> 前缀乘(prefixProduct): [2,6,24,120]
   *      - 当求最后两项时: 则为 prefixProduct.at(-1) / prefixProduct.at(-3)
   *
   *
   * 2. 记录下出现 0 的最后索引, 当求乘积的区间包含这个索引时, 直接就返回 0
   */
  this.prefixProduct = [1];
  this.zeroIndex = -1;
};

/**
 * @param {number} num
 * @return {void}
 */
ProductOfNumbers.prototype.add = function (num) {
  this.prefixProduct.push(
    this.prefixProduct.at(-1) === 0 ? num : this.prefixProduct.at(-1) * num
  );
  if (num === 0) {
    this.zeroIndex = this.prefixProduct.length - 1;
  }
};

/**
 * @param {number} k
 * @return {number}
 */
ProductOfNumbers.prototype.getProduct = function (k) {
  let left = this.prefixProduct.length - 1 - k;

  // 包含 0
  if (left < this.zeroIndex) {
    return 0;
  } else {
    return this.prefixProduct.at(-1) / (this.prefixProduct[left] || 1);
  }
};

/**
 * Your ProductOfNumbers object will be instantiated and called as such:
 * var obj = new ProductOfNumbers()
 * obj.add(num)
 * var param_2 = obj.getProduct(k)
 */
// @lc code=end

/*
// @lcpr case=start
// ["ProductOfNumbers","add","add","add","add","add","getProduct","getProduct","getProduct","add","getProduct"]\n[[],[3],[0],[2],[5],[4],[2],[3],[4],[8],[2]]\n
// @lcpr case=end

 */
