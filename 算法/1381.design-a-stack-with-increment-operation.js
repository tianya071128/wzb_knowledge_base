/*
 * @lc app=leetcode.cn id=1381 lang=javascript
 * @lcpr version=30204
 *
 * [1381] 设计一个支持增量操作的栈
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} maxSize
 */
var CustomStack = function (maxSize) {
  this.stack = [];
  this.maxSize = maxSize;
};

/**
 * @param {number} x
 * @return {void}
 */
CustomStack.prototype.push = function (x) {
  if (this.stack.length === this.maxSize) return;

  this.stack.push(x);
};

/**
 * @return {number}
 */
CustomStack.prototype.pop = function () {
  return this.stack.pop() ?? -1;
};

/**
 * @param {number} k
 * @param {number} val
 * @return {void}
 */
CustomStack.prototype.increment = function (k, val) {
  for (let i = 0; i < Math.min(k, this.stack.length); i++) {
    this.stack[i] += val;
  }
};

/**
 * Your CustomStack object will be instantiated and called as such:
 * var obj = new CustomStack(maxSize)
 * obj.push(x)
 * var param_2 = obj.pop()
 * obj.increment(k,val)
 */
// @lc code=end

/*
// @lcpr case=start
// ["CustomStack","push","push","pop","push","push","push","increment","increment","pop","pop","pop","pop"]\n[[3],[1],[2],[],[2],[3],[4],[5,100],[2,100],[],[],[],[]]\n
// @lcpr case=end

 */
