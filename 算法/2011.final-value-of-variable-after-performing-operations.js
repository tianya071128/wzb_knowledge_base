/*
 * @lc app=leetcode.cn id=2011 lang=javascript
 * @lcpr version=30204
 *
 * [2011] 执行操作后的变量值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} operations
 * @return {number}
 */
var finalValueAfterOperations = function (operations) {
  /** @type {number} 结果 */
  let ans = 0;

  for (const operation of operations) {
    if (operation === 'X++' || operation === '++X') {
      ans++;
    } else {
      ans--;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["--X","X++","X++"]\n
// @lcpr case=end

// @lcpr case=start
// ["++X","++X","X++"]\n
// @lcpr case=end

// @lcpr case=start
// ["X++","++X","--X","X--"]\n
// @lcpr case=end

 */
