/*
 * @lc app=leetcode.cn id=1103 lang=javascript
 * @lcpr version=30204
 *
 * [1103] 分糖果 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} candies
 * @param {number} num_people
 * @return {number[]}
 */
var distributeCandies = function (candies, num_people) {
  let ans = new Array(num_people).fill(0),
    i = 0;
  while (candies > 0) {
    ans[i % num_people] += Math.min(candies, i + 1);

    candies -= i + 1;

    i++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 100000000\n4\n
// @lcpr case=end

// @lcpr case=start
// 10\n3\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = distributeCandies;
// @lcpr-after-debug-end
