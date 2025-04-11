/*
 * @lc app=leetcode.cn id=306 lang=javascript
 * @lcpr version=30204
 *
 * [306] 累加数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} num
 * @return {boolean}
 */
var isAdditiveNumber = function (num) {
  // 回溯: 找出第一个和第二个的数, 之后判断之后的数是否符合要求
  function resolveFirstNum() {
    let cur = 0,
      n = 0;
    // 不能超出一半, 否则没有意义
    while (cur < num.length / 2 - 1) {
      n = n * 10 + Number(num[cur]);

      if (resolveSecondNum(cur + 1, n)) return true;

      // 为 0 就没有必要继续下去, 因为不能为 "02" 这种形式
      if (n === 0) break;
      cur++;
    }

    return false;
  }

  /**
   *
   * @param {*} start 开始
   * @param {*} n 第一个数
   */
  function resolveSecondNum(start, n) {
    // 找出第二个数
    let cur = start,
      n2 = 0,
      max = Math.max(start, cur - start + 1);
    // 剩余数必须要大于等于第一个数和第二个数之间的最大值
    while (num.length - max >= max) {
      n2 = n2 * 10 + Number(num[cur]);

      if (resolveCalcu(n, n2, cur + 1)) return true;

      // 为 0 就没有必要继续下去, 因为不能为 "02" 这种形式
      if (n2 === 0) break;
      cur++;
      max = Math.max(start, cur - start + 1);
    }

    return false;
  }

  /**
   *
   * @param {*} n1 第一个数
   * @param {*} n2 第二个数
   * @param {*} start 结束点
   */
  function resolveCalcu(n1, n2, start) {
    let total = n1 + n2,
      len = total === 0 ? 0 : Math.floor(Math.log10(total)); // 位数

    while (len >= 0) {
      const curLenNum = Math.floor((total % 10 ** (len + 1)) / 10 ** len);
      if (num[start] !== String(curLenNum)) return false;

      start++;
      len--;
    }

    if (start >= num.length) return true;

    // 继续往下走
    return resolveCalcu(n2, total, start);
  }

  return resolveFirstNum();
};
// @lc code=end

/*
// @lcpr case=start
// "112358"\n
// @lcpr case=end

// @lcpr case=start
// "000"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = isAdditiveNumber;
// @lcpr-after-debug-end
