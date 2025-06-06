/*
 * @lc app=leetcode.cn id=341 lang=javascript
 * @lcpr version=30204
 *
 * [341] 扁平化嵌套列表迭代器
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * // This is the interface that allows for creating nested lists.
 * // You should not implement it, or speculate about its implementation
 * function NestedInteger() {
 *
 *     Return true if this NestedInteger holds a single integer, rather than a nested list.
 *     @return {boolean}
 *     this.isInteger = function() {
 *         ...
 *     };
 *
 *     Return the single integer that this NestedInteger holds, if it holds a single integer
 *     Return null if this NestedInteger holds a nested list
 *     @return {integer}
 *     this.getInteger = function() {
 *         ...
 *     };
 *
 *     Return the nested list that this NestedInteger holds, if it holds a nested list
 *     Return null if this NestedInteger holds a single integer
 *     @return {NestedInteger[]}
 *     this.getList = function() {
 *         ...
 *     };
 * };
 */
/**
 * @constructor
 * @param {NestedInteger[]} nestedList
 */
var NestedIterator = function (nestedList) {
  let res = [],
    cur;

  while ((cur = nestedList.shift())) {
    if (!cur.isInteger()) {
      nestedList.unshift(...cur.getList());
    } else {
      res.push(cur.getInteger());
    }
  }

  this.list = res;
  this.i = 0;
};

/**
 * @this NestedIterator
 * @returns {boolean}
 */
NestedIterator.prototype.hasNext = function () {
  return this.i !== this.list.length;
};

/**
 * @this NestedIterator
 * @returns {integer}
 */
NestedIterator.prototype.next = function () {
  return this.list[this.i++];
};

/**
 * Your NestedIterator will be called like this:
 * var i = new NestedIterator(nestedList), a = [];
 * while (i.hasNext()) a.push(i.next());
 */
// @lc code=end

/*
// @lcpr case=start
// [[1,1],2,[1,1]]\n
// @lcpr case=end

// @lcpr case=start
// [1,[4,[6]]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = NestedIterator;
// @lcpr-after-debug-end
