/*
 * @lc app=leetcode.cn id=166 lang=typescript
 * @lcpr version=30204
 *
 * [166] 分数到小数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function fractionToDecimal(numerator: number, denominator: number): string {
  if (numerator === 0) return '0';
  /**
   * 解题思路:
   *  1. 模拟除法,先进行整数部分
   *  2. 如果存在余数, 则进行小数计算
   *      --> 将每一次计算的结果以及余数缓存起来, 如果存在匹配的, 则表示存在循环部分
   */

  // 计算符号
  const symbol =
    (numerator > 0 && denominator > 0) || (numerator < 0 && denominator < 0);
  numerator = Math.abs(numerator);
  denominator = Math.abs(denominator);

  const n = Math.floor(Math.log10(numerator)); // 分子的指数级
  let res = ''; // 结果
  let residue = 0; // 上一位置计算的余数

  // 先算出整数部分
  for (let i = n; i >= 0; i--) {
    // 得出该位置的数字加上上一次计算的余数
    const num =
      Math.floor((numerator % 10 ** (i + 1)) / 10 ** i) + residue * 10;
    const curRes = Math.floor(num / denominator);

    res += curRes === 0 && res === '' ? '' : curRes;
    residue = num % denominator;
  }

  if (res === '') res += '0';
  // 在计算小数部分
  if (residue !== 0) {
    res += '.';

    // 将每一次计算的结果以及余数缓存起来
    // Map<计算结果_余数, 字符位置>
    const map = new Map<string, number>();

    while (residue !== 0) {
      const curRes = Math.floor((residue * 10) / denominator);
      residue = (residue * 10) % denominator;

      const key = `${curRes}_${residue}`;
      if (map.has(key)) {
        const i = map.get(key)!;
        res = res.slice(0, i - 1) + '(' + res.slice(i - 1) + ')';
        break;
      } else {
        res += curRes;
        map.set(key, res.length);
      }
    }
  }

  return (symbol ? '' : '-') + res;
}
// @lc code=end

/*
// @lcpr case=start
// 501\n2\n
// @lcpr case=end

/*
// @lcpr case=start
// 1\n2\n
// @lcpr case=end

// @lcpr case=start
// 2\n1\n
// @lcpr case=end

// @lcpr case=start
// 4\n333\n
// @lcpr case=end

 */
