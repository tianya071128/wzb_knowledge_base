/*
 * @lc app=leetcode.cn id=1253 lang=javascript
 * @lcpr version=30204
 *
 * [1253] 重构 2 行二进制矩阵
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} upper
 * @param {number} lower
 * @param {number[]} colsum
 * @return {number[][]}
 */
var reconstructMatrix = function (upper, lower, colsum) {
  /**
   * 根据每列的和，判断该列是否为0，1，2三种情况
   *  - 0: 该位置肯定都为为 0
   *  - 1: 将该 1 分配给行剩余元素更多的
   *  - 2: 该位置肯定都为 1
   */
  let ans = [Array(colsum.length).fill(0), Array(colsum.length).fill(0)];

  for (let i = 0; i < colsum.length; i++) {
    const n = colsum[i];

    if (n === 0) continue;
    if (n === 2) {
      ans[0][i] = 1;
      ans[1][i] = 1;
      upper--;
      lower--;
    } else {
      if (upper < lower) {
        ans[1][i] = 1;
        lower--;
      } else {
        ans[0][i] = 1;
        upper--;
      }
    }

    if (upper < 0 || lower < 0) return [];
  }

  return upper > 0 || lower > 0 ? [] : ans;
};
// @lc code=end

/*
// @lcpr case=start
// 2\n1\n[1,1,1]\n
// @lcpr case=end

// @lcpr case=start
// 2\n3\n[2,2,1,1]\n
// @lcpr case=end

// @lcpr case=start
// 5\n5\n[2,1,2,0,1,0,1,2,0,1]\n
// @lcpr case=end

 */
