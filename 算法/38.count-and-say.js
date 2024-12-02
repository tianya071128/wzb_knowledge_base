/*
 * @lc app=leetcode.cn id=38 lang=javascript
 * @lcpr version=30204
 *
 * [38] 外观数列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start

// 计算行程长度编码
var calculate = function (str) {
  let num = 0,
    current = '',
    res = '';
  for (const item of str) {
    if (item === current) {
      num++;
    }
    // 没有相同的, 重置变量并拼接结果
    else {
      if (num !== 0) {
        res += `${num}${current}`;
      }

      num = 1;
      current = item;
    }
  }

  // 最后需要拼接一次
  res += `${num}${current}`;

  return res;
};

/**
 * @param {number} n
 * @return {string}
 */
var countAndSay = function (n) {
  // 迭代法
  let res = '1';
  for (let index = 1; index < n; index++) {
    res = calculate(res);
  }

  return res;

  // 递归法
  // return calculate(countAndSay(n - 1));
};
// @lc code=end

/*
// @lcpr case=start
// 4\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = countAndSay;
// @lcpr-after-debug-end
