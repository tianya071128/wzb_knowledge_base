/*
 * @lc app=leetcode.cn id=224 lang=javascript
 * @lcpr version=30204
 *
 * [224] 基本计算器
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var calculate = function (s) {
  let i = 0;
  function dfs() {
    let total = 0,
      prev = 0,
      symbol = 1;

    while (i < s.length) {
      // 启动括号内的运算
      if (s[i] === '(') {
        i++;
        total += dfs() * symbol;

        symbol = 1;
      }
      // 括号内的运算结果, 返回结果
      else if (s[i] === ')') {
        i++;
        return total;
      }
      // 其他
      else {
        if (s[i] === '+') {
          symbol = 1;
        } else if (s[i] === '-') {
          // 之前的符号取反
          symbol *= -1;
        } else if (/\d/.test(s[i])) {
          prev = prev * 10 + Number(s[i]);

          // 到达数字的终点, 计算之前的值
          if (!/\d/.test(s[i + 1])) {
            total += prev * symbol;
            prev = 0;
            symbol = 1;
          }
        }

        i++;
      }
    }

    return total;
  }

  return dfs();
};
// @lc code=end

/*
// @lcpr case=start
// "1 + 1"\n
// @lcpr case=end

// @lcpr case=start
// " 2-1 + 2 "\n
// @lcpr case=end

// @lcpr case=start
// "(6)-(8)-(7)+(1+(6))"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = calculate;
// @lcpr-after-debug-end
