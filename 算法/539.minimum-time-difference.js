/*
 * @lc app=leetcode.cn id=539 lang=javascript
 * @lcpr version=30204
 *
 * [539] 最小时间差
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} timePoints
 * @return {number}
 */
var findMinDifference = function (timePoints) {
  /**
   * 1. 将时间转换为分钟数字
   * 2. 排序
   * 3. 最后一个元素需要与第一个元素作比较
   */
  timePoints = timePoints
    .map((item) => {
      const list = item.split(':');
      return Number(list[0]) * 60 + Number(list[1]);
    })
    .sort((a, b) => a - b);

  let ans = Infinity;
  for (let i = 0; i < timePoints.length; i++) {
    ans = Math.min(
      ans,
      (timePoints[i + 1] ?? timePoints[0] + 60 * 24) - timePoints[i]
    );
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["23:59","00:00"]\n
// @lcpr case=end

// @lcpr case=start
// ["00:00","23:59","00:00"]\n
// @lcpr case=end

 */
