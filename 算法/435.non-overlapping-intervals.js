/*
 * @lc app=leetcode.cn id=435 lang=javascript
 * @lcpr version=30204
 *
 * [435] 无重叠区间
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} intervals
 * @return {number}
 */
var eraseOverlapIntervals = function (intervals) {
  // 1. 先排序, 这样快速比较两个区间是否重叠
  // 2. 遍历排序的区间, 如果前后区间重叠的话, 必然需要去掉一个
  //      2.1 需要去除的区间, 应该是右区间更小的值, 这样与下个区间重叠的概率更小
  let rightNum = -Infinity, // 当前区间右区间的值
    ans = 0;

  intervals.sort((a, b) => a[0] - b[0]);

  for (const item of intervals) {
    // 如果当前项左区间的值比 rightNum 的值要小, 表示重叠
    if (item[0] < rightNum) {
      ans++;
      rightNum = Math.min(rightNum, item[1]);
    } else {
      // 没有重叠时, 右区间就是当前项的右区间的值
      rightNum = item[1];
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2],[2,3],[3,4],[1,3]]\n
// @lcpr case=end

// @lcpr case=start
// [ [1,2], [1,2], [1,2] ]\n
// @lcpr case=end

// @lcpr case=start
// [ [1,2], [2,3] ]\n
// @lcpr case=end

 */
