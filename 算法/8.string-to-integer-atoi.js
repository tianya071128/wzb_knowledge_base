/*
 * @lc app=leetcode.cn id=8 lang=javascript
 * @lcpr version=30204
 *
 * [8] 字符串转换整数 (atoi)
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var myAtoi = function (s) {
  let res = 0,
    symbol = 1, // 标志为正负 1为正数, 2为负数
    start = false; // 是否开始读取数值

  for (const item of s) {
    // 符号
    if (!start && (item === '-' || item === '+')) {
      symbol = item === '-' ? -1 : 1;
      start = true;
    }
    // 丢弃无用的前导空格
    else if (!start && item === ' ') {
      continue;
    }
    // 此时检测是否为数字
    else if (/\d/.test(item)) {
      res = res * 10 + Number(item);

      // 判定边界
      if (res * symbol > 2 ** 31 - 1) return 2 ** 31 - 1;
      if (res * symbol < (-2) ** 31) return (-2) ** 31;

      start = true;
    }
    // 其他情况下, 匹配到不合适的字符, 退出
    else {
      break;
    }
  }

  return res * symbol;
};
// @lc code=end

/*
// @lcpr case=start
// "42"\n
// @lcpr case=end

// @lcpr case=start
// " -042"\n
// @lcpr case=end

// @lcpr case=start
// "1337c0d3"\n
// @lcpr case=end

// @lcpr case=start
// "0-1"\n
// @lcpr case=end

// @lcpr case=start
// "words and 987"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = myAtoi;
// @lcpr-after-debug-end
