/*
 * @lc app=leetcode.cn id=1109 lang=javascript
 * @lcpr version=30204
 *
 * [1109] 航班预订统计
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} bookings
 * @param {number} n
 * @return {number[]}
 */
var corpFlightBookings = function (bookings, n) {
  /**
   * 将 bookings 进行预处理
   *  - 每次到 firsti 时, 增量 +seatsi
   *  - 每次到 lasti + 1 时, 增量 -seatsi
   */
  let ans = new Array(n).fill(0),
    arr = new Array(n).fill(0);

  for (const [first, last, seats] of bookings) {
    arr[first - 1] += seats;
    arr[last] -= seats;
  }

  let diff = 0;
  for (let i = 0; i < ans.length; i++) {
    diff += arr[i];
    ans[i] += diff;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2,10],[2,3,20],[2,5,25]]\n5\n
// @lcpr case=end

// @lcpr case=start
// [[1,2,10],[2,2,15]]\n2\n
// @lcpr case=end

 */
