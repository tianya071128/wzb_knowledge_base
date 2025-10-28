/*
 * @lc app=leetcode.cn id=967 lang=javascript
 * @lcpr version=30204
 *
 * [967] 连续差相同的数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number} k
 * @return {number[]}
 */
var numsSameConsecDiff = function (n, k) {
  /**
   * 回溯所有可能
   */
  let ans = [];

  /**
   * 回溯
   * @param {number} place 数字位数
   * @param {number} total 总数
   * @param {number} prev 上一位
   */
  function dfs(place, total, prev) {
    // 终止条件
    if (place === n) {
      ans.push(total);
      return;
    }
    if (place === 0) {
      // 表示起始位: 可以从 1-9开始
      for (let i = 1; i <= 9; i++) {
        dfs(place + 1, i, i);
      }
    }
    // 其他位, 需要根据上一位来判断
    else {
      if (prev + k <= 9) {
        dfs(place + 1, total * 10 + prev + k, prev + k);
      }

      if (k !== 0 && prev - k >= 0) {
        dfs(place + 1, total * 10 + prev - k, prev - k);
      }
    }
  }

  dfs(0, 0, 0);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 3\n7\n
// @lcpr case=end

// @lcpr case=start
// 2\n1\n
// @lcpr case=end

// @lcpr case=start
// 2\n0\n
// @lcpr case=end

// @lcpr case=start
// 2\n2\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numsSameConsecDiff;
// @lcpr-after-debug-end
