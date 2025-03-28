/*
 * @lc app=leetcode.cn id=221 lang=javascript
 * @lcpr version=30204
 *
 * [221] 最大正方形
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

/**
 * 获取从左上角坐标到右下角, 继续往左上延伸的的正方形大小
 */
function getMaxSquare(matrix, start, end) {
  let curSquare = (end[0] - start[0] + 1) ** 2;

  // 如果已到达边界, 返回当前正方形面积
  if (start[0] === 0 || start[1] === 0) {
    return curSquare;
  }

  // 获取当前正方形延伸后的矩阵节点是否都是 "1"
  for (let i = start[1] - 1; i <= end[1]; i++) {
    // 如果碰到不为 1 的, 直接返回当前面积
    if (matrix[start[0] - 1][i] !== '1') return curSquare;
  }
  for (let i = start[0]; i <= end[0]; i++) {
    // 如果碰到不为 1 的, 直接返回当前面积
    if (matrix[i][start[1] - 1] !== '1') return curSquare;
  }

  return getMaxSquare(matrix, [start[0] - 1, start[1] - 1], end);
}

/**
 * @param {character[][]} matrix
 * @return {number}
 */
var maximalSquare = function (matrix) {
  // 动态规划
  // 状态转移方程: i 和 j 表示行和列
  // f(i, j) = Max(f(i - 1, j), f(i, j - 1), 以该点往左上延伸的最大正方形)
  // 1. dp 表
  const dp = new Array(matrix.length)
    .fill(0)
    .map((item) => new Array(matrix[0].length).fill(0));

  // 2. 初始化 dp 表
  let flag = false; // 初始化行和列时是否存在 1
  for (let i = 0; i < matrix[0].length; i++) {
    dp[0][i] = Number(flag || (flag = matrix[0][i] === '1'));
  }
  flag = false;
  for (let i = 0; i < matrix.length; i++) {
    dp[i][0] = Number(flag || (flag = matrix[i][0] === '1'));
  }

  // 3. 状态转移方程
  for (let i = 1; i < matrix.length; i++) {
    for (let j = 1; j < matrix[i].length; j++) {
      dp[i][j] = Math.max(
        dp[i - 1][j],
        dp[i][j - 1],
        matrix[i][j] === '1' ? getMaxSquare(matrix, [i, j], [i, j]) : 0
      );
    }
  }

  return dp[matrix.length - 1][matrix[0].length - 1];
};
// @lc code=end

/*
// @lcpr case=start
// [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]\n
// @lcpr case=end

// @lcpr case=start
// [["0","1"],["1","0"]]\n
// @lcpr case=end

// @lcpr case=start
// [["1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","0"],["1","1","1","1","1","1","1","0"],["1","1","1","1","1","0","0","0"],["0","1","1","1","1","0","0","0"]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maximalSquare;
// @lcpr-after-debug-end
