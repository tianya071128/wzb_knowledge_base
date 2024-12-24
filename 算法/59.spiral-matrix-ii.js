/*
 * @lc app=leetcode.cn id=59 lang=javascript
 * @lcpr version=30204
 *
 * [59] 螺旋矩阵 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number[][]}
 */
var generateMatrix = function (n) {
  // 与 54.螺旋矩阵 类似
  let res = new Array(n).fill(1).map((item) => new Array(n)),
    directionIndex = 0, // 方向
    row = 0, // 当前行
    column = 0, // 当前列
    directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ],
    visited = new Array(n).fill(0).map(() => new Array(n).fill(false)); // 记录下当前位置是否走过

  for (let i = 0; i < n * n; i++) {
    res[row][column] = i + 1;
    visited[row][column] = true;

    // 判断是否转换方向
    const nextRow = row + directions[directionIndex][0],
      nextColumn = column + directions[directionIndex][1];
    if (
      nextRow >= n ||
      nextRow < 0 ||
      nextColumn >= n ||
      nextColumn < 0 ||
      visited[nextRow][nextColumn]
    ) {
      directionIndex = (directionIndex + 1) % 4;
    }

    row += directions[directionIndex][0];
    column += directions[directionIndex][1];
  }

  return res;
};
// @lc code=end

/*
// @lcpr case=start
// 3\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

 */
