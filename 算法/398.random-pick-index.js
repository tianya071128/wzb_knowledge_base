/*
 * @lc app=leetcode.cn id=398 lang=javascript
 * @lcpr version=30204
 *
 * [398] 随机数索引
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 */
var Solution = function (nums) {
  /**
   * Record<string, number[]> --> 记录值对应的索引列表
   */
  const indexMap = {};

  for (let index = 0; index < nums.length; index++) {
    const n = nums[index];
    const indexs = indexMap[n] ?? [];
    indexs.push(index);
    indexMap[n] = indexs;
  }

  this.indexMap = indexMap;
};

/**
 * @param {number} target
 * @return {number}
 */
Solution.prototype.pick = function (target) {
  const indexs = this.indexMap[target];

  return indexs[Math.floor(Math.random() * indexs.length)];
};

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(nums)
 * var param_1 = obj.pick(target)
 */
// @lc code=end
