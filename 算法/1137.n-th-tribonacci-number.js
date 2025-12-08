/*
 * @lc app=leetcode.cn id=1137 lang=javascript
 * @lcpr version=30204
 *
 * [1137] 第 N 个泰波那契数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var tribonacci = function (n) {
  if (n === 0) return 0;
  if (n === 1) return 1;
  if (n === 2) return 1;

  let t0 = 0,
    t1 = 1,
    t2 = 1;

  for (let i = 3; i <= n; i++) {
    let total = t0 + t1 + t2;

    t0 = t1;
    t1 = t2;
    t2 = total;
  }

  return t2;
};
// @lc code=end

/*
// @lcpr case=start
// 4\n
// @lcpr case=end

// @lcpr case=start
// 25\n
// @lcpr case=end

 */
