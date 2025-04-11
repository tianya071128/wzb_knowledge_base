/*
 * @lc app=leetcode.cn id=307 lang=javascript
 * @lcpr version=30204
 *
 * [307] 区域和检索 - 数组可修改
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * 前缀和
 * @param {number[]} nums
 */
var NumArray = function (nums) {
  const sum = [];
  for (const n of nums) {
    sum.push((sum.at(-1) ?? 0) + n);
  }

  // 前缀和
  this.nums = nums;
  this.sum = sum;
};

/**
 * @param {number} index
 * @param {number} val
 * @return {void}
 */
NumArray.prototype.update = function (index, val) {
  // 更新前缀和
  const prev = this.nums[index];
  const diffNum = val - prev;

  // 更新数组值
  this.nums[index] = val;

  // 从当前索引开始, 之后的前缀和都需要 + diffNum;
  for (let i = index; i < this.nums.length; i++) {
    this.sum[i] = this.sum[i] + diffNum;
  }
};

/**
 * @param {number} left
 * @param {number} right
 * @return {number}
 */
NumArray.prototype.sumRange = function (left, right) {
  return this.sum[right] - (this.sum[left - 1] ?? 0);
};

/**
 * Your NumArray object will be instantiated and called as such:
 * var obj = new NumArray(nums)
 * obj.update(index,val)
 * var param_2 = obj.sumRange(left,right)
 */
// @lc code=end

/*
// @lcpr case=start
// ["NumArray", "sumRange", "update", "sumRange"]\n[[[1, 3, 5]], [0, 2], [1, 2], [0, 2]]\n
// @lcpr case=end

 */
