/*
 * @lc app=leetcode.cn id=509 lang=javascript
 * @lcpr version=30204
 *
 * [509] 斐波那契数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var fib = function (n) {
  if (n === 0) return 0;
  if (n === 1) return 1;

  let one = 0,
    two = 1;
  for (let i = 3; i <= n; i++) {
    let temp = one + two;
    one = two;
    two = temp;
  }

  return one + two;
};
// @lc code=end

/*
// @lcpr case=start
// 2\n
// @lcpr case=end

// @lcpr case=start
// 3\n
// @lcpr case=end

// @lcpr case=start
// 30\n
// @lcpr case=end

 */
