/*
 * @lc app=leetcode.cn id=1138 lang=javascript
 * @lcpr version=30204
 *
 * [1138] 字母板上的路径
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} target
 * @return {string}
 */
var alphabetBoardPath = function (target) {
  /**
   * - 首先记录下每个字符坐标
   * - 在根据字符来进行移动
   */
  // 记录下字符坐标
  let hash = new Map(),
    board = ['abcde', 'fghij', 'klmno', 'pqrst', 'uvwxy', 'z'];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      hash.set(board[i][j], [i, j]);
    }
  }

  let ans = '',
    position = [0, 0];
  for (const s of target) {
    let sPosition = hash.get(s);

    // 如果目标是 z, 那么线进行横向移动, 其他情况统一为先纵向
    if (s === 'z') {
      ans +=
        (position[1] > sPosition[1] ? 'L' : 'R').repeat(
          Math.abs(position[1] - sPosition[1])
        ) +
        (position[0] > sPosition[0] ? 'U' : 'D').repeat(
          Math.abs(position[0] - sPosition[0])
        ) +
        '!';
    } else {
      ans +=
        (position[0] > sPosition[0] ? 'U' : 'D').repeat(
          Math.abs(position[0] - sPosition[0])
        ) +
        (position[1] > sPosition[1] ? 'L' : 'R').repeat(
          Math.abs(position[1] - sPosition[1])
        ) +
        '!';
    }

    position = sPosition;
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=alphabetBoardPath
// paramTypes= ["string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "zdzsadfzzsdfzserweraf"\n
// @lcpr case=end

// @lcpr case=start
// "code"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = alphabetBoardPath;
// @lcpr-after-debug-end
