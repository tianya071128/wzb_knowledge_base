/*
 * @lc app=leetcode.cn id=1105 lang=javascript
 * @lcpr version=30204
 *
 * [1105] 填充书架
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} books
 * @param {number} shelfWidth
 * @return {number}
 */
var minHeightShelves = function (books, shelfWidth) {
  /**
   * 动态规划
   */
  let dp = new Array(books.length + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i < dp.length; i++) {
    // 转移方程: 以该项为一层, 遍历到可以存放 shelfWidth 的书
    let w = 0,
      h = 0;
    for (let j = i; j >= 1; j--) {
      w += books[j - 1][0];
      h = Math.max(h, books[j - 1][1]);

      if (w > shelfWidth) break;

      dp[i] = Math.min(dp[i], dp[j - 1] + h);
    }
  }

  return dp.at(-1);
};
// @lc code=end

/*
// @lcpr case=start
// [[1,1],[2,3],[2,3],[1,1],[1,1],[1,1],[1,2]]\n4\n
// @lcpr case=end

// @lcpr case=start
// [[1,3],[2,4],[3,2]]\n6\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minHeightShelves;
// @lcpr-after-debug-end
