/*
 * @lc app=leetcode.cn id=849 lang=javascript
 * @lcpr version=30204
 *
 * [849] 到最近的人的最大距离
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} seats
 * @return {number}
 */
var maxDistToClosest = function (seats) {
  let ans = 0,
    prev; // 上一个有人的位置

  for (let i = 0; i < seats.length; i++) {
    if (seats[i] === 1) {
      // 判断跟上一个位置的距离
      ans = Math.max(
        Math.floor((i - (prev ?? 0)) / (prev == undefined ? 1 : 2)),
        ans
      );

      prev = i;
    }
  }

  // 处理最后一个
  return Math.max(ans, seats.length - 1 - prev);
};
// @lc code=end

/*
// @lcpr case=start
// [1,0,0,0,1,0,1]\n
// @lcpr case=end

// @lcpr case=start
// [0,0,0,0,1,0,0,0]\n
// @lcpr case=end

// @lcpr case=start
// [0,1]\n
// @lcpr case=end

 */
