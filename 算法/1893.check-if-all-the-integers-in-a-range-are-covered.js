/*
 * @lc app=leetcode.cn id=1893 lang=javascript
 * @lcpr version=30204
 *
 * [1893] 检查是否区域内所有整数都被覆盖
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} ranges
 * @param {number} left
 * @param {number} right
 * @return {boolean}
 */
var isCovered = function (ranges, left, right) {
  /** @type {number[]} 差分数组 */
  let diff = new Array(52).fill(0);

  for (const [x, y] of ranges) {
    diff[x]++;
    diff[y + 1]--;
  }

  /** 构造数组 */
  for (let i = 1; i < diff.length; i++) {
    diff[i] += diff[i - 1];
  }

  for (; left <= right; left++) {
    if (diff[left] <= 0) return false;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2],[3,4],[5,6]]\n2\n5\n
// @lcpr case=end

// @lcpr case=start
// [[1,10],[10,20]]\n21\n21\n
// @lcpr case=end

 */
