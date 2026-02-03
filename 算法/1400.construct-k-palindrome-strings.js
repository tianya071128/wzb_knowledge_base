/*
 * @lc app=leetcode.cn id=1400 lang=javascript
 * @lcpr version=30204
 *
 * [1400] 构造 K 个回文字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {number} k
 * @return {boolean}
 */
var canConstruct = function (s, k) {
  if (s.length < k) return false;

  /**
   * 一个长度为 n 的话回文字符串可以拆成 1 ~ n 个回文字符串
   * 所以我们只需要关心能够组成最大回文字符串后还剩余多少个元素
   */
  // 记录下字符的个数
  let list = Array(26).fill(0);
  for (const item of s) {
    list[item.charCodeAt() - 'a'.charCodeAt()]++;
  }

  // 单个字符剩余个数
  let min = 0;
  for (const n of list) {
    min += n % 2;
  }

  // 回文串中间可以插入一个其他字符
  min = Math.max(1, min);

  return min <= k;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=canConstruct
// paramTypes= ["string","number"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "abcdefghijklmnopqrstuvwxyz"\n25\n
// @lcpr case=end

// @lcpr case=start
// "xiaomi"\n3\n
// @lcpr case=end

// @lcpr case=start
// "true"\n4\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = canConstruct;
// @lcpr-after-debug-end
