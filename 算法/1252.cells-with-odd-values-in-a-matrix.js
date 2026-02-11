/*
 * @lc app=leetcode.cn id=1252 lang=javascript
 * @lcpr version=30204
 *
 * [1252] 奇数值单元格的数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} m
 * @param {number} n
 * @param {number[][]} indices
 * @return {number}
 */
var oddCells = function (m, n, indices) {
  let incrementM = Array(m).fill(0),
    incrementN = Array(n).fill(0);

  for (const [m, n] of indices) {
    incrementM[m]++;
    incrementN[n]++;
  }

  let ans = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if ((incrementM[i] + incrementN[j]) % 2 === 1) {
        ans++;
      }
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=oddCells
// paramTypes= ["number","number","number[][]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// 2\n3\n[[0,1],[1,1]]\n
// @lcpr case=end

// @lcpr case=start
// 2\n2\n[[1,1],[0,0]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = oddCells;
// @lcpr-after-debug-end
