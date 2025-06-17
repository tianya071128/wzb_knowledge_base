/*
 * @lc app=leetcode.cn id=481 lang=javascript
 * @lcpr version=30204
 *
 * [481] 神奇字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var magicalString = function (n) {
  /**
   * 起始字符为 "122"
   *
   * 双指针构建字符串
   * 第一个指针用于构建字符串
   * 第二个指针指向字符串当前的位置并记录上一个构建字符
   */

  if (n <= 3) return 1;

  let s = '122',
    p = 2,
    build = '1',
    ans = 1;
  while (s.length < n) {
    // 构建次数
    const num = Math.min(Number(s[p]), n - s.length);
    ans += build === '1' ? num : 0;
    p++;
    s += build.repeat(num);
    build = build === '1' ? '2' : '1';
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 501\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = magicalString;
// @lcpr-after-debug-end
