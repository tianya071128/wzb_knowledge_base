/*
 * @lc app=leetcode.cn id=1486 lang=javascript
 * @lcpr version=30204
 *
 * [1486] 数组异或操作
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number} start
 * @return {number}
 */
var xorOperation = function (n, start) {
  let ans = start;

  for (let i = 1; i < n; i++) {
    ans ^= start + 2 * i;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 5\n0\n
// @lcpr case=end

// @lcpr case=start
// 4\n3\n
// @lcpr case=end

// @lcpr case=start
// 1\n7\n
// @lcpr case=end

// @lcpr case=start
// 10\n5\n
// @lcpr case=end

 */
