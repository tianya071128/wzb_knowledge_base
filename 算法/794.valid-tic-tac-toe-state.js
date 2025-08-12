/*
 * @lc app=leetcode.cn id=794 lang=javascript
 * @lcpr version=30204
 *
 * [794] 有效的井字游戏
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} board
 * @return {boolean}
 */
var validTicTacToe = function (board) {
  /**
   * 必须要满足如下情况:
   *  1. "X" 比 "O" 最多多一个 --> "X" 先手
   *  2. "X" 和 "0" 不能同时连线
   *  3. 当 "X" 赢的时候, 必须比 "O" 多一个
   *  4. 当 "O" 赢的时候, 必须与 "X"相同
   */
  let Xnum = 0,
    Onum = 0,
    Xflag = false, // X 是否连线
    Oflag = false; // O 是否连线

  for (let i = 0; i < board.length; i++) {
    /**
     * 计数
     */
    for (const s of board[i]) {
      if (s === 'X') Xnum++;
      if (s === 'O') Onum++;
    }

    /**
     * 检查横向是否连线
     */
    if (
      board[i][0] !== ' ' &&
      board[i][0] === board[i][1] &&
      board[i][0] === board[i][2]
    ) {
      if (board[i][0] === 'X') {
        Xflag = true;
      } else {
        Oflag = true;
      }
    }

    /**
     * 检查纵向是否连续
     */
    if (
      board[0][i] !== ' ' &&
      board[0][i] === board[1][i] &&
      board[0][i] === board[2][i]
    ) {
      if (board[0][i] === 'X') {
        Xflag = true;
      } else {
        Oflag = true;
      }
    }

    /**
     * 检查斜线是否连线
     */
    if (
      i === 0 &&
      board[0][i] !== ' ' &&
      board[0][i] === board[1][1] &&
      board[0][i] === board[2][2]
    ) {
      if (board[0][i] === 'X') {
        Xflag = true;
      } else {
        Oflag = true;
      }
    }

    /**
     * 检查反斜线是否连线
     */
    if (
      i === 2 &&
      board[0][2] !== ' ' &&
      board[0][2] === board[1][1] &&
      board[0][2] === board[2][0]
    ) {
      if (board[0][2] === 'X') {
        Xflag = true;
      } else {
        Oflag = true;
      }
    }
  }

  if (!(Xnum === Onum + 1 || Xnum === Onum)) return false;
  if (Xflag && Oflag) return false;
  if (Xflag && Xnum !== Onum + 1) return false;
  if (Oflag && Xnum !== Onum) return false;

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// ["O  ","   ","   "]\n
// @lcpr case=end

// @lcpr case=start
// ["XXX","XOO","OO "]\n
// @lcpr case=end

// @lcpr case=start
// ["XOX","O O","XOX"]\n
// @lcpr case=end

 */
