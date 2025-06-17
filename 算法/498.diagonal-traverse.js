/*
 * @lc app=leetcode.cn id=498 lang=javascript
 * @lcpr version=30204
 *
 * [498] 对角线遍历
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} mat
 * @return {number[]}
 */
var findDiagonalOrder = function (mat) {
  let m = mat.length, // 行数
    n = mat[0].length, // 列数
    m_p = 0, // 行指针
    n_p = 0, // 列指针
    direction = 1, // 1 右上 | -1 左下
    ans = []; // 结果

  while (m_p < m && n_p < n) {
    ans.push(mat[m_p][n_p]);

    // 移动指针

    // 转变方向 右上 --> 左下
    if (direction === 1 && (m_p === 0 || n_p === n - 1)) {
      direction = -1;
      // 往右移动一格
      if (n_p !== n - 1) {
        n_p++;
      }
      // 往下移动一格
      else {
        m_p++;
      }
    }
    // 转变方向 左下 --> 右上
    else if (direction === -1 && (n_p === 0 || m_p === m - 1)) {
      direction = 1;
      // 往右移动一格
      if (m_p === m - 1) {
        n_p++;
      }
      // 往下移动一格
      else {
        m_p++;
      }
    }
    // 往右上移动
    else if (direction === 1) {
      n_p++;
      m_p--;
    }
    // 往左下移动
    else {
      n_p--;
      m_p++;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2,3,1,2,3],[4,5,6,1,2,3],[7,8,9,1,2,3],[7,8,9,1,2,3]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,2],[3,4]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findDiagonalOrder;
// @lcpr-after-debug-end
