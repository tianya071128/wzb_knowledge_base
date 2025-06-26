/*
 * @lc app=leetcode.cn id=554 lang=javascript
 * @lcpr version=30204
 *
 * [554] 砖墙
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} wall
 * @return {number}
 */
var leastBricks = function (wall) {
  // 查找每行的缝隙点
  // 遍历过程中记录缝隙点
  const w = wall[0].reduce((total, item) => total + item),
    gaps = new Map();
  for (let i = 0; i < wall.length; i++) {
    // 最后一项不用处理
    for (let j = 0, sum = 0; j < wall[i].length - 1; j++) {
      sum += wall[i][j];
      gaps.set(sum, (gaps.get(sum) ?? 0) + 1);
    }
  }

  // 找到缝隙点最大的
  return wall.length - Math.max(...[0, ...gaps.values()]);
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2,2,1],[3,1,2],[1,3,2],[2,4],[3,1,2],[1,3,1,1]]\n
// @lcpr case=end

// @lcpr case=start
// [[100000000],[100000000],[100000000]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = leastBricks;
// @lcpr-after-debug-end
