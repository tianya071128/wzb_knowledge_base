/*
 * @lc app=leetcode.cn id=1854 lang=javascript
 * @lcpr version=30204
 *
 * [1854] 人口最多的年份
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} logs
 * @return {number}
 */
var maximumPopulation = function (logs) {
  /** @type {number[]} 等分数组 */
  let diff = new Array(101).fill(0),
    /** @type {number} 结果 */
    ans = Infinity,
    /** @type {number} 人数值 */
    sum = 0,
    /** @type {number} 最大人数值 */
    max = 0;

  for (const [start, end] of logs) {
    diff[start - 1950]++;
    diff[end - 1950]--;
  }

  for (let i = 0; i < diff.length; i++) {
    sum += diff[i];

    if (sum > max) {
      ans = i + 1950;
      max = sum;
    }
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=maximumPopulation
// paramTypes= ["number[][]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [[1993,1999],[2000,2010]]\n
// @lcpr case=end

// @lcpr case=start
// [[1950,1961],[1960,1971],[1970,1981]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maximumPopulation;
// @lcpr-after-debug-end
