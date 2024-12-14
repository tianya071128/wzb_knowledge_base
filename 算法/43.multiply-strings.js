/*
 * @lc app=leetcode.cn id=43 lang=javascript
 * @lcpr version=30204
 *
 * [43] 字符串相乘
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var multiply = function (num1, num2) {
  if (num1 === '0' || num2 === '0') return '0';

  /**
   * 解题思路: 模拟乘法
   *  123
   * x 23
   * ------
   *    369
   * + 246
   * ------
   *   2829
   */
  // 两数相加 -- 以字符串形式处理，防止溢出
  function add(num1, num2) {
    let res = '',
      carry = 0,
      i = num1.length - 1,
      j = num2.length - 1;

    while (i >= 0 || j >= 0) {
      let num = Number(num1[i] ?? 0) + Number(num2[j] ?? 0) + carry;
      if (num >= 10) {
        carry = 1;
        num = num - 10;
      } else {
        carry = 0;
      }

      res = num + res;
      i--;
      j--;
    }

    if (carry === 1) res = '1' + res;

    return res;
  }

  // 各位数的相乘, 以字符串形式表示
  function ge(num1, base) {
    let res = '0';
    for (let index = 0; index < Number(base); index++) {
      res = add(res, num1);
    }
    return res;
  }

  let zero = '',
    res = '0';
  for (let i = num2.length - 1; i >= 0; i--) {
    const s = num2[i];
    res = add(res, ge(num1, s) + zero);
    zero += '0';
  }

  return res;
};
// @lc code=end

/*
// @lcpr case=start
// "2"\n"3"\n
// @lcpr case=end

// @lcpr case=start
// "123"\n"456"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = multiply;
// @lcpr-after-debug-end
