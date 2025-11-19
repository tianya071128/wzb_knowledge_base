/*
 * @lc app=leetcode.cn id=1094 lang=javascript
 * @lcpr version=30204
 *
 * [1094] 拼车
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} trips
 * @param {number} capacity
 * @return {boolean}
 */
var carPooling = function (trips, capacity) {
  /**
   * 因为 form 和 to 最大值也就 1000 --> 使用 1001 长度的数组存储上车和下车人数
   */
  let arr = Array.from({ length: 1001 }, () => 0);

  for (const [numPassengers, from, to] of trips) {
    arr[from] -= numPassengers;
    arr[to] += numPassengers;
  }

  for (const item of arr) {
    capacity += item;

    if (capacity < 0) return false;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [[2,1,5],[3,3,7]]\n4\n
// @lcpr case=end

// @lcpr case=start
// [[2,1,5],[3,3,7]]\n5\n
// @lcpr case=end

 */
