/*
 * @lc app=leetcode.cn id=1637 lang=javascript
 * @lcpr version=30204
 *
 * [1637] 两点之间不包含任何点的最宽垂直区域
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} points
 * @return {number}
 */
var maxWidthOfVerticalArea = function (points) {
  /** 按照X轴坐标排序 */
  points.sort((a, b) => a[0] - b[0]);

  /** @type {number} 结果 */
  let ans = 0;

  for (let i = 0; i < points.length - 1; i++) {
    ans = Math.max(ans, points[i + 1][0] - points[i][0]);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[8,7],[9,9],[7,4],[9,7]]\n
// @lcpr case=end

// @lcpr case=start
// [[3,1],[9,0],[1,0],[1,4],[5,3],[8,8]]\n
// @lcpr case=end

 */
