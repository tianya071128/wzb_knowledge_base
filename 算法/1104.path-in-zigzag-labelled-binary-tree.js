/*
 * @lc app=leetcode.cn id=1104 lang=javascript
 * @lcpr version=30204
 *
 * [1104] 二叉树寻路
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} label
 * @return {number[]}
 */
var pathInZigZagTree = function (label) {
  /**
   * 计算出该数字对应父级的行数, 在根据行数找到对应的值
   */
  if (label === 1) {
    return [1];
  }

  // 计算父级对应的行数
  let parent = Math.floor(label / 2),
    line = Math.floor(Math.log2(parent)),
    min = 2 ** line,
    max = min * 2 - 1,
    correct = max - (parent - min);

  return [...pathInZigZagTree(correct), label];
};
// @lc code=end

/*
// @lcpr case=start
// 14\n
// @lcpr case=end

// @lcpr case=start
// 26\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = pathInZigZagTree;
// @lcpr-after-debug-end
