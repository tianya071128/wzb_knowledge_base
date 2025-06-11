/*
 * @lc app=leetcode.cn id=412 lang=javascript
 * @lcpr version=30204
 *
 * [412] Fizz Buzz
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {string[]}
 */
var fizzBuzz = function (n) {
  const ans = [];

  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) {
      ans.push('FizzBuzz');
    } else if (i % 3 === 0) {
      ans.push('Fizz');
    } else if (i % 5 === 0) {
      ans.push('Buzz');
    } else {
      ans.push(String(i));
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 3\n
// @lcpr case=end

// @lcpr case=start
// 5\n
// @lcpr case=end

// @lcpr case=start
// 15\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = fizzBuzz;
// @lcpr-after-debug-end
