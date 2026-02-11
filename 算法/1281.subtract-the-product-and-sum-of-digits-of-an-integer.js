/*
 * @lc app=leetcode.cn id=1281 lang=javascript
 * @lcpr version=30204
 *
 * [1281] 整数的各位积和之差
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var subtractProductAndSum = function (n) {
  let arr = String(n).split(''),
    accumulation = 1,
    sum = 0;

  for (const n of arr) {
    accumulation *= Number(n);
    sum += Number(n);
  }

  return accumulation - sum;
};
// @lc code=end

/*
// @lcpr case=start
// 234\n
// @lcpr case=end

// @lcpr case=start
// 4421\n
// @lcpr case=end

 */
