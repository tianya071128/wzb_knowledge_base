/*
 * @lc app=leetcode.cn id=119 lang=typescript
 * @lcpr version=30204
 *
 * [119] 杨辉三角 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function getRow(rowIndex: number): number[] {
  // 得出所有的结果, 在返回对应 rowIndex 的结果
  const ans: number[][] = [[1]];
  for (let i = 1; i <= rowIndex; i++) {
    ans[i] = [];
    for (let j = 0; j <= rowIndex; j++) {
      ans[i][j] = (ans[i - 1][j - 1] ?? 0) + (ans[i - 1][j] ?? 0);
    }
  }

  return ans[rowIndex];
}
// @lc code=end

/*
// @lcpr case=start
// 3\n
// @lcpr case=end

// @lcpr case=start
// 0\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

 */
