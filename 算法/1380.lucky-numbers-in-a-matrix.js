/*
 * @lc app=leetcode.cn id=1380 lang=javascript
 * @lcpr version=30204
 *
 * [1380] 矩阵中的幸运数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var luckyNumbers = function (matrix) {
  /**
   * 最多只有一个幸运数
   */
  let cacheClomn = new Map();
  for (let i = 0; i < matrix.length; i++) {
    let min = 0;
    for (let j = 1; j < matrix[0].length; j++) {
      if (matrix[i][j] < matrix[i][min]) {
        min = j;
      }
    }

    // 查找列是否最大
    if (!cacheClomn.has(min)) {
      let max = 0;
      for (let i = 1; i < matrix.length; i++) {
        if (matrix[i][min] > matrix[max][min]) {
          max = i;
        }
      }

      cacheClomn.set(min, max);
    }

    if (cacheClomn.get(min) === i) return [matrix[i][min]];
  }

  return [];
};
// @lc code=end

/*
// @lcpr case=start
// [[3,7,8],[9,11,13],[15,16,17]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,10,4,2],[9,3,8,7],[15,16,17,12]]\n
// @lcpr case=end

// @lcpr case=start
// [[7,8],[1,2]]\n
// @lcpr case=end

 */
