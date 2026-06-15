/*
 * @lc app=leetcode.cn id=1578 lang=javascript
 * @lcpr version=30204
 *
 * [1578] 使绳子变成彩色的最短时间
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} colors
 * @param {number[]} neededTime
 * @return {number}
 */
var minCost = function (colors, neededTime) {
  // 相同颜色的气球需要去除一个, 就需要去除时间最少的
  let prev = 0,
    ans = 0;
  for (let i = 1; i < colors.length; i++) {
    if (colors[i] === colors[prev]) {
      // 去除一个
      if (neededTime[i] < neededTime[prev]) {
        ans += neededTime[i];
        continue;
      } else {
        ans += neededTime[prev];
      }
    }
    prev = i;
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=minCost
// paramTypes= ["string","number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "abaac"\n[1,2,3,4,5]\n
// @lcpr case=end

// @lcpr case=start
// "abc"\n[1,2,3]\n
// @lcpr case=end

// @lcpr case=start
// "aabaa"\n[1,2,3,4,1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minCost;
// @lcpr-after-debug-end
