/*
 * @lc app=leetcode.cn id=56 lang=javascript
 * @lcpr version=30204
 *
 * [56] 合并区间
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
  // 先对区间的左区间进行降序排序
  intervals.sort((a, b) => a[0] - b[0]);

  let res = [],
    cur = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    const item = intervals[i];

    // 判断是否重叠
    if (cur[1] >= item[0]) {
      cur = [cur[0], Math.max(cur[1], item[1])];
    }
    // 不重叠, 将 cur 追加进结果
    else {
      res.push(cur);
      cur = item;
    }
  }

  res.push(cur);

  return res;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,3],[2,6],[8,10],[15,18]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,4],[4,5]]\n
// @lcpr case=end

 */
