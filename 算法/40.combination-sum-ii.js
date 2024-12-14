/*
 * @lc app=leetcode.cn id=40 lang=javascript
 * @lcpr version=30204
 *
 * [40] 组合总和 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function (candidates, target) {
  // 与 39.组合总和 的区别:
  //  1. 每项不能重复使用
  //  2. 有重复项
  // 思路: 先排序, 迭代时如果与上一项重复时退出当次迭代
  const res = [];
  candidates = candidates.sort((a, b) => a - b);

  function dfs(i, demp, total) {
    // 终止条件: 相等或大于 target
    if (total === target) {
      res.push(demp);
      return;
    }
    if (total > target) return;

    for (let index = i; index < candidates.length; index++) {
      const item = candidates[index];

      // 去重, 当与上一项重复时, 当次不递归
      if (item === candidates[index - 1] && index > i) {
        continue;
      }

      dfs(index + 1, [...demp, item], total + item);
    }
  }

  dfs(0, [], 0);

  return res;
};
// @lc code=end

/*
// @lcpr case=start
// [10,1,2,7,6,1,5]\n8\n
// @lcpr case=end

// @lcpr case=start
// [2,5,2,1,2]\n5\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = combinationSum2;
// @lcpr-after-debug-end
