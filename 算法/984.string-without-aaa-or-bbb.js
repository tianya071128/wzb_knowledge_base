/*
 * @lc app=leetcode.cn id=984 lang=javascript
 * @lcpr version=30204
 *
 * [984] 不含 AAA 或 BBB 的字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} a
 * @param {number} b
 * @return {string}
 */
var strWithout3a3b = function (a, b) {
  /**
   * 据题意而知, 不能同时存在 3 个相同字符的
   *
   * 那么:
   *  - 每次添加 a 和 b 时
   *  - 如果 a 数量更多, 那么就添加两个 a
   *  - 如果 b 数量更多, 那么就添加两个 b
   *  - 其他情况下就交替添加
   *  --> 这样的话, 保证消耗数量多的
   */
  let ans = '';
  while (a >= 0 || b >= 0) {
    let n1 = a > b ? 2 : 1, // a 添加的个数
      n2 = b > a ? 2 : 1, // b 添加的个数
      s1 = 'a'.repeat(Math.min(n1, Math.max(a, 0))),
      s2 = 'b'.repeat(Math.min(n2, Math.max(b, 0)));

    // 如果 b 的次数比 a 的次数要多, 那么添加到 a 的前面
    ans += n2 > n1 ? s2 + s1 : s1 + s2; // 当次字符
    a -= n1;
    b -= n2;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 1\n3\n
// @lcpr case=end

// @lcpr case=start
// 4\n1\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = strWithout3a3b;
// @lcpr-after-debug-end
