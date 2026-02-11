/*
 * @lc app=leetcode.cn id=2269 lang=javascript
 * @lcpr version=30204
 *
 * [2269] 找到一个数字的 K 美丽值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} num
 * @param {number} k
 * @return {number}
 */
var divisorSubstrings = function (num, k) {
  let ans = 0,
    len = Math.floor(Math.log10(num)) + 1;

  for (let i = 0; i <= len - k; i++) {
    if (num % (Math.floor(num / 10 ** i) % 10 ** k) === 0) ans++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 240\n2\n
// @lcpr case=end

// @lcpr case=start
// 430043\n3\n
// @lcpr case=end

 */
