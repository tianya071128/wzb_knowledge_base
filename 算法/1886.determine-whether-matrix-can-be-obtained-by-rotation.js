/*
 * @lc app=leetcode.cn id=1886 lang=javascript
 * @lcpr version=30204
 *
 * [1886] 判断矩阵经轮转后是否一致
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} mat
 * @param {number[][]} target
 * @return {boolean}
 */
var findRotation = function (mat, target) {
  other: for (let i = 0; i < 4; i++) {
    mat = rotation(mat);

    // 比较是否相同
    for (let i = 0; i < mat.length; i++) {
      for (let j = 0; j < mat.length; j++) {
        if (mat[i][j] !== target[i][j]) continue other;
      }
    }

    return true;
  }

  return false;
};

/**
 * @param {number[][]} mat
 * @return {number[][]}
 */
var rotation = function (mat) {
  let len = mat.length,
    /** @type {number[][]} 中间元素 */
    temp = new Array(len).fill(0).map((item) => new Array(len).fill(0));

  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      temp[i][j] = mat[len - j - 1][i];
    }
  }

  return temp;
};
// @lc code=end

/*
// @lcpr case=start
// [[0,1],[1,0]]\n[[1,0],[0,1]]\n
// @lcpr case=end

// @lcpr case=start
// [[0,1],[1,1]]\n[[1,0],[0,1]]\n
// @lcpr case=end

// @lcpr case=start
// [[0,0,0],[0,1,0],[1,1,1]]\n[[1,1,1],[0,1,0],[0,0,0]]\n
// @lcpr case=end

 */
