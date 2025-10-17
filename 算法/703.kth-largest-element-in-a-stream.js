/*
 * @lc app=leetcode.cn id=703 lang=javascript
 * @lcpr version=30204
 *
 * [703] 数据流中的第 K 大元素
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} k
 * @param {number[]} nums
 */
var KthLargest = function (k, nums) {
  /** 先使用内置的排序 */
  nums = nums.sort((a, b) => b - a);

  this.nums = nums.slice(0, k);
  this.k = k;
};

/**
 * @param {number} val
 * @return {number}
 */
KthLargest.prototype.add = function (val) {
  /** 二分搜索查找插入元素 */
  let left = 0,
    right = this.nums.length - 1;
  while (left <= right) {
    let mid = left + Math.floor((right - left) / 2);

    if (val === this.nums[mid]) {
      left = mid;
      break;
    } else if (this.nums[mid] > val) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  this.nums.splice(left, 0, val);

  // 截取长度
  if (this.nums.length > this.k) {
    this.nums.pop();
  }

  return this.nums[this.k - 1];
};

/**
 * Your KthLargest object will be instantiated and called as such:
 * var obj = new KthLargest(k, nums)
 * var param_1 = obj.add(val)
 */
// @lc code=end

/*
// @lcpr case=start
// ["KthLargest", "add"]\n[[3, [4, 5, 8, 2]], [10]]\n
// @lcpr case=end

// @lcpr case=start
// ["KthLargest", "add", "add", "add", "add"]\n[[4, [7, 7, 7, 7, 8, 3]], [2], [10], [9], [9]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = KthLargest;
// @lcpr-after-debug-end
