/*
 * @lc app=leetcode.cn id=2201 lang=javascript
 * @lcpr version=30204
 *
 * [2201] 统计可以提取的工件
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number[][]} artifacts
 * @param {number[][]} dig
 * @return {number}
 */
var digArtifacts = function (n, artifacts, dig) {
  /**
   * 矩阵:
   *  1. 使用矩阵存储网格
   *  2. 遍历工件, 将工件占有的网格以及数量存储起来
   *  3. 遍历挖掘单元格, 将对应单元格的工件的单元格数量减一, 如果为0的话, 说明可以提取
   */
  /** @type {number[][][]} 网格 */
  let grid = new Array(n)
      .fill(0)
      .map((item) => new Array(n).fill(0).map((item) => [])),
    hash = new Map();

  for (let k = 0; k < artifacts.length; k++) {
    let n = 0,
      item = artifacts[k];
    for (let i = item[0]; i <= item[2]; i++) {
      for (let j = item[1]; j <= item[3]; j++) {
        grid[i][j].push(k);
        n++;
      }
    }

    hash.set(k, n);
  }

  // 开始挖掘
  let ans = 0;
  for (const [i, j] of dig) {
    for (const item of grid[i][j]) {
      hash.set(item, hash.get(item) - 1);

      if (hash.get(item) === 0) {
        ans++;
      }
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=digArtifacts
// paramTypes= ["number","number[][]","number[][]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// 2\n[[0,0,0,0],[0,1,1,1]]\n[[0,0],[0,1]]\n
// @lcpr case=end

// @lcpr case=start
// 2\n[[0,0,0,0],[0,1,1,1]]\n[[0,0],[0,1],[1,1]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = digArtifacts;
// @lcpr-after-debug-end
