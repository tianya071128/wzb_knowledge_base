/*
 * @lc app=leetcode.cn id=1952 lang=javascript
 * @lcpr version=30204
 *
 * [1952] 三除数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {boolean}
 */
var isThree = function (n) {
  if (n < 4) return false;

  /**
   * 要满足两个条件:
   *  - 平方是正整数
   *  - 除了平方和 1 和 本身, 没有了其他的正除数
   */
  /** @type {number} 平方结果 */
  let sqrt = Math.sqrt(n);

  if (!Number.isInteger(sqrt)) return false;

  for (let i = 2; i < sqrt; i++) {
    if (Number.isInteger(n / i)) return false;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// 142\n
// @lcpr case=end

// @lcpr case=start
// 35\n
// @lcpr case=end

 */
