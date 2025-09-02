/*
 * @lc app=leetcode.cn id=869 lang=javascript
 * @lcpr version=30204
 *
 * [869] 重新排序得到 2 的幂
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {boolean}
 */
var reorderedPowerOf2 = function (n) {
  // 1. 先找到小于等于 n位数的最大值 的所有2的幂
  // 2. 并且计算下每个数字的个数, 组装成字符串
  let hash = new Set(),
    max = 10 ** Math.ceil(Math.log10(n));
  for (let i = 0; true; i++) {
    // 存储个数的
    let num = new Array(10).fill(0),
      cur = 2 ** i;

    if (cur > max) break;

    while (cur > 0) {
      num[cur % 10]++;
      cur = Math.floor(cur / 10);
    }

    hash.add(num.join());
  }

  // 3. 计算数字 n 的数字个数
  let num = new Array(10).fill(0);
  while (n > 0) {
    num[n % 10]++;
    n = Math.floor(n / 10);
  }

  // 4. 比较 n 的数字个数是否在 hash 中存在
  return hash.has(num.join());
};
// @lc code=end

/*
// @lcpr case=start
// 46\n
// @lcpr case=end

// @lcpr case=start
// 34524335\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = reorderedPowerOf2;
// @lcpr-after-debug-end
