/*
 * @lc app=leetcode.cn id=1582 lang=javascript
 * @lcpr version=30204
 *
 * [1582] 二进制矩阵中的特殊位置
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} mat
 * @return {number}
 */
var numSpecial = function (mat) {
  /** @type {[number, number][]} 该行 1 的数量已经对应列的索引 */
  let row = Array.from({ length: mat.length }, () => [0, 0]),
    /** @type {number[]} 该列 1 的数量 */
    column = new Array(mat[0].length).fill(0),
    /** @type {number} 结果 */
    ans = 0;

  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < mat[0].length; j++) {
      if (mat[i][j] === 1) {
        row[i] = [++row[i][0], j];
        column[j]++;
      }
    }
  }

  /** 根据每行的1的数量判断 */
  for (const [total, j] of row) {
    if (total === 1 && column[j] === 1) {
      ans++;
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=numSpecial
// paramTypes= ["number[][]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [[1,0,0],[0,0,1],[1,0,0]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,0,0],[0,1,0],[0,0,1]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numSpecial;
// @lcpr-after-debug-end
