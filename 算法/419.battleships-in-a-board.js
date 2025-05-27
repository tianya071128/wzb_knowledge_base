/*
 * @lc app=leetcode.cn id=419 lang=javascript
 * @lcpr version=30204
 *
 * [419] 棋盘上的战舰
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {character[][]} board
 * @return {number}
 */
var countBattleships = function (board) {
  let ans = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (
        board[i][j] === 'X' &&
        board[i - 1]?.[j] !== 'X' &&
        board[i][j - 1] !== 'X'
      )
        ans++;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [["X",".","X","."],[".",".",".","X"],[".",".",".","X"]]\n
// @lcpr case=end

// @lcpr case=start
// [["."]]\n
// @lcpr case=end

 */
