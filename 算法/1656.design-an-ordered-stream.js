/*
 * @lc app=leetcode.cn id=1656 lang=javascript
 * @lcpr version=30204
 *
 * [1656] 设计有序流
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 */
var OrderedStream = function (n) {
  this.ptr = 0;
  this.list = new Array(n);
};

/**
 * @param {number} idKey
 * @param {string} value
 * @return {string[]}
 */
OrderedStream.prototype.insert = function (idKey, value) {
  this.list[idKey - 1] = value;

  let ans = [];

  while (this.list[this.ptr] != null) {
    ans.push(this.list[this.ptr++]);
  }

  return ans;
};

/**
 * Your OrderedStream object will be instantiated and called as such:
 * var obj = new OrderedStream(n)
 * var param_1 = obj.insert(idKey,value)
 */
// @lc code=end
