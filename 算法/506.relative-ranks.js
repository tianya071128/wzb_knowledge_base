/*
 * @lc app=leetcode.cn id=506 lang=javascript
 * @lcpr version=30204
 *
 * [506] 相对名次
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} score
 * @return {string[]}
 */
var findRelativeRanks = function (score) {
  /**
   * 1. 排序
   * 2. 使用 map 记录下各排序后的名次
   */
  let ans = [...score].sort((a, b) => b - a),
    hash = new Map();

  for (let i = 0; i < ans.length; i++) {
    hash.set(
      ans[i],
      i === 0
        ? 'Gold Medal'
        : i === 1
        ? 'Silver Medal'
        : i === 2
        ? 'Bronze Medal'
        : String(i + 1)
    );
  }

  return score.map((item) => hash.get(item));
};
// @lc code=end

/*
// @lcpr case=start
// [5,4,3,2,1]\n
// @lcpr case=end

// @lcpr case=start
// [10,3,8,9,4]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findRelativeRanks;
// @lcpr-after-debug-end
