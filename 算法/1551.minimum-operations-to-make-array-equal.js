/*
 * @lc app=leetcode.cn id=1551 lang=javascript
 * @lcpr version=30204
 *
 * [1551] 使数组中所有元素相等的最小操作数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var minOperations = function (n) {
  // 奇数集合, 找到平均数(就是 n), 就是中间的值
  let average = n,
    ans = 0;

  for (let i = 1; i < n; i += 2) {
    ans += n - i;
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=minOperations
// paramTypes= ["number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// 312\n
// @lcpr case=end

// @lcpr case=start
// 8457\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minOperations;
// @lcpr-after-debug-end
