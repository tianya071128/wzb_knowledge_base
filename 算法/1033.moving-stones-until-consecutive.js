/*
 * @lc app=leetcode.cn id=1033 lang=javascript
 * @lcpr version=30204
 *
 * [1033] 移动石子直到连续
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @return {number[]}
 */
var numMovesStones = function (a, b, c) {
  /**
   * 最小步数:
   *  0 - 已经是连续的
   *  1
   *    - 只有一个不是连接的, 只需要走一步
   *    - 两个之间相隔大于 2
   *  2 - 都不是连续的
   */
  let nums = [a, b, c].sort((a, b) => a - b);

  return [
    nums[2] - nums[1] === 1 && nums[1] - nums[0] === 1
      ? 0
      : nums[2] - nums[1] <= 2 || nums[1] - nums[0] <= 2
      ? 1
      : 2,
    nums[1] - nums[0] - 1 + nums[2] - nums[1] - 1,
  ];
};
// @lc code=end

/*
// @lcpr case=start
// 3\n5\n1\n
// @lcpr case=end

// @lcpr case=start
// 4\n3\n2\n
// @lcpr case=end

 */
