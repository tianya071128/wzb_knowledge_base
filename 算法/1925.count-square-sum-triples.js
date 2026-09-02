/*
 * @lc app=leetcode.cn id=1925 lang=javascript
 * @lcpr version=30204
 *
 * [1925] 统计平方和三元组的数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var countTriples = function (n) {
  /** @type {number} 结果 */
  let ans = 0;

  for (let i = 1; i <= n - 2; i++) {
    for (let j = i + 1; j <= n - 1; j++) {
      let k = Math.sqrt(i ** 2 + j ** 2);

      if (Number.isInteger(k) && k <= n) ans += 2;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 250\n
// @lcpr case=end

// @lcpr case=start
// 10\n
// @lcpr case=end

 */
