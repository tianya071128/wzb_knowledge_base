/*
 * @lc app=leetcode.cn id=697 lang=javascript
 * @lcpr version=30204
 *
 * [697] 数组的度
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findShortestSubArray = function (nums) {
  /**
   * 1. 使用 hash 记录下每个元素的最小索引, 包含的连续长度, 数量 --> 并记录下最大数量
   * 2. 遍历元素的, 当数量等于最大数量时, 根据 最小索引, 最大索引 --> 确定最短连续子数组
   */
  let ans = Infinity,
    hash = new Map(),
    max = 0;

  for (let i = 0; i < nums.length; i++) {
    let res = hash.get(nums[i]) ?? [];

    // 已存在的情况, 更新
    if (res.length === 3) {
      res[1] = i - res[0] + 1;
      res[2] += 1;
    } else {
      res = [i, 1, 1];
    }

    // 如果数量最大, 直接更新 ans 结果
    if (res[2] > max) {
      ans = res[1];
      max = res[2];
    }
    // 如果数量相同, 比较 ans 结果
    else if (res[2] === max) {
      ans = Math.min(ans, res[1]);
    }

    hash.set(nums[i], res);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,2,3,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,2,3,1,4,2]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findShortestSubArray;
// @lcpr-after-debug-end
