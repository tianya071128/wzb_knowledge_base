/*
 * @lc app=leetcode.cn id=640 lang=javascript
 * @lcpr version=30204
 *
 * [640] 求解方程
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} equation
 * @return {string}
 */
var solveEquation = function (equation) {
  // 1. 先将 = 左右两边的方程求解到最终形式: [number, number] --> 第一个 number 代表有几个 x, 可以是负数, 第二个 number 代表携带的数字
  function parser(s) {
    let isX = false, // 是否为 x 变量
      n = 0, // 当前遍历的数字
      preNumber = false, // 是否已遍历到数字 --> 处理 0x 的情况, 此时就不要将 n 置为 1
      sign = 1; // 符号: 1 正数 | -1 负数
    ans = [0, 0];

    function fn(negative) {
      const i = isX ? 0 : 1; // 表示添加到 ans 的索引 --> 是否为 x 变量
      ans[i] += n * sign;

      // 重置变量
      isX = false;
      n = 0;
      sign = negative ? -1 : 1;
      preNumber = false;
    }

    for (const item of s) {
      // 处理下一个字符, 并且处理上一次遍历的字符
      if (item === '+' || item === '-') {
        fn(item === '-');
      }
      // 处理 x 变量
      else if (item === 'x') {
        if (n === 0 && !preNumber) n = 1;
        isX = true;
      }
      // 处理数字
      else {
        n = n * 10 + Number(item);
        preNumber = true;
      }
    }

    // 处理最后字符
    if (n !== 0) fn();

    return ans;
  }

  const list = equation.split('=');
  const list1 = parser(list[0]);
  const list2 = parser(list[1]);

  // 无限解
  if (list1[0] === list2[0] && list1[1] === list2[1]) {
    return 'Infinite solutions';
  } else {
    // No solution --> 方程没有解或存在的解不为整数
    const n = (list2[1] - list1[1]) / (list1[0] - list2[0]);

    return Number.isInteger(n) ? `x=${n}` : 'No solution';
  }

  return '';
};
// @lc code=end

/*
// @lcpr case=start
// "0x=0"\n
// @lcpr case=end

// @lcpr case=start
// "x+5-3+x=6+x-2"\n
// @lcpr case=end

// @lcpr case=start
// "2x=x"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = solveEquation;
// @lcpr-after-debug-end
