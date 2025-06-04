/*
 * @lc app=leetcode.cn id=452 lang=javascript
 * @lcpr version=30204
 *
 * [452] 用最少数量的箭引爆气球
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} points
 * @return {number}
 */
var findMinArrowShots = function (points) {
  /**
   * 1. 首先进行排序, 左区间排序
   * 2. 贪心: 当箭能射穿当个时, 检测是否能射穿下一个, 直至到无法射穿的
   */
  points.sort((a, b) => a[0] - b[0]);

  let ans = 0,
    cur = 0,
    rightNum = points[0][1]; // 右区间, 通过这个判断两个区间是否存在交集

  while (cur < points.length) {
    // 检测下一个是否能与当前区间存在交集
    while (cur < points.length - 1 && points[cur + 1][0] <= rightNum) {
      cur++;
      // 更新右区间的值
      rightNum = Math.min(rightNum, points[cur][1]);
    }

    ans++; // 结果 + 1

    cur++;
    rightNum = points[cur]?.[1];
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[10,16],[2,8],[1,6],[7,12]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,2],[3,4],[5,6],[7,8]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,2],[2,3],[3,4],[4,5]]\n
// @lcpr case=end

 */
