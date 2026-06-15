/*
 * @lc app=leetcode.cn id=1518 lang=javascript
 * @lcpr version=30204
 *
 * [1518] 换水问题
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} numBottles
 * @param {number} numExchange
 * @return {number}
 */
var numWaterBottles = function (numBottles, numExchange) {
  let ans = numBottles;
  while (numBottles >= numExchange) {
    let temp = Math.floor(numBottles / numExchange);
    ans += temp;

    numBottles = temp + (numBottles % numExchange);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 9\n3\n
// @lcpr case=end

// @lcpr case=start
// 15\n4\n
// @lcpr case=end

 */
