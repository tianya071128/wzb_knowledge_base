/*
 * @lc app=leetcode.cn id=380 lang=javascript
 * @lcpr version=30204
 *
 * [380] O(1) 时间插入、删除和获取随机元素
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

var RandomizedSet = function () {};

/**
 * @param {number} val
 * @return {boolean}
 */
RandomizedSet.prototype.insert = function (val) {};

/**
 * 使用数组时, 难度在于删除, 当删除中间元素时, 就会导致后面的元素都会变动, 也就不满足 O(1) 的
 *  此时可以将要删除的元素与最后的元素互换, 在删除最后的元素
 * @param {number} val
 * @return {boolean}
 */
RandomizedSet.prototype.remove = function (val) {};

/**
 * @return {number}
 */
RandomizedSet.prototype.getRandom = function () {};

/**
 * Your RandomizedSet object will be instantiated and called as such:
 * var obj = new RandomizedSet()
 * var param_1 = obj.insert(val)
 * var param_2 = obj.remove(val)
 * var param_3 = obj.getRandom()
 */
// @lc code=end
