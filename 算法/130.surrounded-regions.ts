/*
 * @lc app=leetcode.cn id=130 lang=typescript
 * @lcpr version=30204
 *
 * [130] 被围绕的区域
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 Do not return anything, modify board in-place instead.
 */
function solve(board: string[][]): void {
  /**
   * 解题思路:
   *  1. 遍历数组, 第一行、最后一行、第一列、最后一列 无需遍历，边缘不能被围绕
   *  2. 遍历到 "O" 时, 找到 "O" 的区域, 如果 "O" 的区域不能走到边缘的话(因为只有在边缘处才不会被围绕) 那么就是被围绕的
   *  3. 记录下这个区域位置, 防止重复查找
   */
  const memory = new Set<number>();

  let isAround = true, // "O" 区域是否被围绕
    areaList = new Set<number>(); // "O" 区域位置
  // 找到 "O" 区域
  function getOArea(i: number, j: number) {
    const index = i * board[i].length + j;
    if (areaList.has(index)) return;

    // 如果该项为 "O", 添加进集合, 并且找其上下左右四项
    if (board[i][j] !== 'O') return;

    areaList.add(index);

    // 如果是边缘, 无需在处理该项
    if (
      i === 0 ||
      i === board.length - 1 ||
      j === 0 ||
      j === board[i].length - 1
    ) {
      isAround = false;
      return;
    }

    // 找到四个位置
    [
      [i - 1, j],
      [i + 1, j],
      [i, j + 1],
      [i, j - 1],
    ].forEach((item) => getOArea(item[0], item[1]));
  }

  for (let i = 1; i < board.length - 1; i++) {
    for (let j = 1; j < board[i].length - 1; j++) {
      if (memory.has(i * board[i].length + j)) continue;

      if (board[i][j] === 'O') {
        // 启动查找 "O" 区域
        isAround = true;
        areaList = new Set<number>();
        getOArea(i, j);

        // 处理 "O" 区域
        areaList.forEach((item) => {
          memory.add(item);

          if (isAround) {
            board[Math.floor(item / board[i].length)][item % board[i].length] =
              'X';
          }
        });
      }
    }
  }
}
// @lc code=end

/*
// @lcpr case=start
// [["X","O","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]\n
// @lcpr case=end

/*
// @lcpr case=start
// [["X","O","X","O","X","O"],["O","X","O","X","O","X"],["X","O","X","O","X","O"],["O","X","O","X","O","X"]]\n
// @lcpr case=end

// @lcpr case=start
// [["X"]]\n
// @lcpr case=end

 */
