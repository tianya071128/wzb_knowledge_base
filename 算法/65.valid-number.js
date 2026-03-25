/*
 * @lc app=leetcode.cn id=65 lang=javascript
 * @lcpr version=30204
 *
 * [65] 有效数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
var isNumber = function (s) {
  let isIndex = false, // 是否为指数
    isDecimal = false, // 是否已经存在小数
    isNum = false; // 是否已经存在十进制数

  /** 各种类型条件判断 */
  for (let i = 0; i < s.length; i++) {
    const item = s[i];

    // - +
    if (item === '-' || item === '+') {
      // 出现在第一位 || 前一位是 e 和 'E' --> 符合, 否则结束
      if (!(i === 0 || s[i - 1] === 'e' || s[i - 1] === 'E')) return false;

      // 其他情况通过
    }
    // e 或 E
    else if (item === 'e' || item === 'E') {
      // 如果已经发现了指数 || 之前不是合法的十进制数, 则返回 false
      if (isIndex || !isNum) return false;

      // 重置变量
      isIndex = true;
      isNum = false;
    }
    // .
    else if (item === '.') {
      // 如果是指数 || 之前已经出现 .
      if (isIndex || isDecimal) return false;

      isDecimal = true;
    }
    // 数字
    else if (item.charCodeAt() >= 48 && item.charCodeAt() <= 57) {
      isNum = true;
    }
    // 其他字符
    else {
      return false;
    }
  }

  return isNum;
};
// @lc code=end

/*
// @lcpr case=start
// "0"\n
// @lcpr case=end

// @lcpr case=start
// ".1e1"\n
// @lcpr case=end

// @lcpr case=start
// "."\n
// @lcpr case=end

 */
