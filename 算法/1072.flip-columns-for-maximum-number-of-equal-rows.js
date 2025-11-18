/*
 * @lc app=leetcode.cn id=1072 lang=javascript
 * @lcpr version=30204
 *
 * [1072] 按列翻转得到最大值等行数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} matrix
 * @return {number}
 */
var maxEqualRowsAfterFlips = function (matrix) {
  /**
   * 计算出每行的不同列, 使用 hash 记录下翻转列索引
   */
  let ans = 0,
    /** @type {Map<string, number>} Map<翻转列数索引, 个数> */
    hash = new Map();
  for (let i = 0; i < matrix.length; i++) {
    let sum1 = [], // 该行 0 的索引
      sum2 = []; // 该行 1 的索引
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 0) {
        sum1.push(j);
      } else {
        sum2.push(j);
      }
    }

    // 翻转其他值
    let key1 = sum1.join(),
      key2 = sum2.join(),
      n1 = (hash.get(key1) ?? 0) + 1,
      n2 = (hash.get(key2) ?? 0) + 1;

    hash.set(key1, n1);
    hash.set(key2, n2);
    ans = Math.max(ans, n1, n2);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[0,1],[1,1]]\n
// @lcpr case=end

// @lcpr case=start
// [[0,1],[1,0]]\n
// @lcpr case=end

// @lcpr case=start
// [[0,0,0],[0,0,1],[1,1,0]]\n
// @lcpr case=end

 */
