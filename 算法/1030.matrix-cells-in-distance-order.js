/*
 * @lc app=leetcode.cn id=1030 lang=javascript
 * @lcpr version=30204
 *
 * [1030] 距离顺序排列矩阵单元格
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} rows
 * @param {number} cols
 * @param {number} rCenter
 * @param {number} cCenter
 * @return {number[][]}
 */
var allCellsDistOrder = function (rows, cols, rCenter, cCenter) {
  let ans = [[rCenter, cCenter]],
    directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ],
    hash = new Set([`${rCenter},${cCenter}`]);
  for (let i = 0; i < ans.length; i++) {
    // 扩散
    let [x, y] = ans[i];
    for (let j = 0; j < directions.length; j++) {
      let x1 = x + directions[j][0],
        y1 = y + directions[j][1];

      if (
        x1 >= 0 &&
        x1 < rows &&
        y1 >= 0 &&
        y1 < cols &&
        !hash.has(`${x1},${y1}`)
      ) {
        ans.push([x1, y1]);
        hash.add(`${x1},${y1}`);
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 1\n2\n0\n0\n
// @lcpr case=end

// @lcpr case=start
// 2\n2\n0\n1\n
// @lcpr case=end

// @lcpr case=start
// 2\n3\n1\n2\n
// @lcpr case=end

 */
