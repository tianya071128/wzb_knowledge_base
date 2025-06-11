/*
 * @lc app=leetcode.cn id=409 lang=javascript
 * @lcpr version=30204
 *
 * [409] 最长回文串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var longestPalindrome = function (s) {
  // 回文串 --> 那就说明除去中间的字符, 左右两边的字符需要对应, 也就是左右两边的字符是一对
  // 那么就可以转换为求出字符串 s 中字符偶数对的个数

  // 1. 求字符数量
  const map = new Map();
  for (const item of s) {
    map.set(item, (map.get(item) ?? 0) + 1);
  }

  // 2. 求偶数对的个数
  let ans = 0;
  for (const n of map.values()) {
    ans += Math.floor(n / 2) * 2;
  }

  // 特殊情况: 如果 ans 就是字符串的长度, 那么中间就不能多加一个字符
  return ans + (ans === s.length ? 0 : 1);
};
// @lc code=end

/*
// @lcpr case=start
// "abccccdd"\n
// @lcpr case=end

// @lcpr case=start
// "a"\n
// @lcpr case=end

 */
