/*
 * @lc app=leetcode.cn id=2303 lang=javascript
 * @lcpr version=30204
 *
 * [2303] 计算应缴税款总额
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} brackets
 * @param {number} income
 * @return {number}
 */
var calculateTax = function (brackets, income) {
  let ans = 0,
    prev = 0;

  for (const [upper, percent] of brackets) {
    ans += (Math.min(income, upper) - prev) * (percent / 100);
    prev = upper;

    if (income <= prev) break;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[3,50],[7,10],[12,25]]\n10\n
// @lcpr case=end

// @lcpr case=start
// [[1,0],[4,25],[5,50]]\n2\n
// @lcpr case=end

// @lcpr case=start
// [[2,50]]\n0\n
// @lcpr case=end

 */
