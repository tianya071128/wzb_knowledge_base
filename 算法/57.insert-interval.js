/*
 * @lc app=leetcode.cn id=57 lang=javascript
 * @lcpr version=30204
 *
 * [57] 插入区间
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} intervals
 * @param {number[]} newInterval
 * @return {number[][]}
 */
var insert = function (intervals, newInterval) {
  let isOver = false,
    res = [];
  for (let i = 0; i < intervals.length; i++) {
    const item = intervals[i];

    // 此时, 说明没有重叠, 在 i 位置之前插入
    if (newInterval[1] < item[0]) {
      res.push(newInterval, ...intervals.splice(i, intervals.length));
      return res;
    }
    // 说明说明进入了重叠
    else if (newInterval[0] <= item[1]) {
      newInterval = [
        Math.min(newInterval[0], item[0]),
        Math.max(newInterval[1], item[1]),
      ];
      isOver = true;
    }
    // 否则, 将该项追加进
    else {
      res.push(item);
    }
  }

  // 到了这里, 说明需要追加到末尾
  res.push(newInterval);

  return res;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,3],[6,9]]\n[2,5]\n
// @lcpr case=end

// @lcpr case=start
// [[1,2],[3,5],[6,7],[8,10],[12,16]]\n[4,8]\n
// @lcpr case=end

 */
