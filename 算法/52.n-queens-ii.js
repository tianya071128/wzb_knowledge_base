/*
 * @lc app=leetcode.cn id=52 lang=javascript
 * @lcpr version=30204
 *
 * [52] N 皇后 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var totalNQueens = function (n) {
  /**
   * 重复问题:
   *
   * 回溯
   *  每次落一个, 就把对应的纵向和斜线标记为不可落子
   */
  let columnNots = new Array(n).fill(false), // 标记数组
    leftLowerNots = new Array(n * 3).fill(false), // 左下
    rightLowerNots = new Array(n * 3).fill(false), // 右下
    ans = [],
    paths = [];

  /**
   * 找到对应位置, 纵向和斜线的位置
   * @param {number} row 行索引
   * @param {number} column 列索引
   */
  function helper(row, column) {
    let ans = [
      {
        target: columnNots,
        index: column,
      },
    ];

    // 右下斜线
    let i = column - row + n;
    if (i >= 0 && i < rightLowerNots.length)
      ans.push({
        target: rightLowerNots,
        index: i,
      });

    // 左下斜线
    i = column + row + n;
    if (i >= 0 && i < leftLowerNots.length)
      ans.push({
        target: leftLowerNots,
        index: i,
      });

    return ans;
  }

  /**
   * @param {number} i 当前需要落子的行数
   */
  function dfs(row) {
    if (row === n) {
      ans.push([...paths]);
      return;
    }

    for (let column = 0; column < n; column++) {
      const list = helper(row, column);

      // 如果可以落子
      if (list.every((item) => !item.target[item.index])) {
        // 标记为雷区
        for (const item of list) {
          item.target[item.index] = true;
        }

        paths.push('.'.repeat(column) + 'Q' + '.'.repeat(n - column - 1));

        dfs(row + 1);

        // 还原变量
        for (const item of list) {
          item.target[item.index] = false;
        }
        paths.pop();
      }
    }
  }

  dfs(0);

  return ans.length;
};
// @lc code=end

/*
// @lcpr case=start
// 9\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

 */
