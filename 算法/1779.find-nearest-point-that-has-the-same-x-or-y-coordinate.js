/*
 * @lc app=leetcode.cn id=1779 lang=javascript
 * @lcpr version=30204
 *
 * [1779] 找到最近的有相同 X 或 Y 坐标的点
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} x
 * @param {number} y
 * @param {number[][]} points
 * @return {number}
 */
var nearestValidPoint = function (x, y, points) {
  /** @type {number} 满足条件的曼哈顿距离 */
  let n = Infinity,
    /** @type {number} 结果 */
    ans = -1;

  for (let i = 0; i < points.length; i++) {
    let [x1, y1] = points[i];

    if (x === x1 || y === y1) {
      let cur = Math.abs(x - x1) + Math.abs(y - y1);

      if (cur < n) {
        ans = i;
        n = cur;
      }

      if (n === 0) return ans;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 3\n4\n[[1,2],[3,1],[2,4],[2,3],[4,4]]\n
// @lcpr case=end

// @lcpr case=start
// 3\n4\n[[3,4]]\n
// @lcpr case=end

// @lcpr case=start
// 3\n4\n[[2,3]]\n
// @lcpr case=end

 */
