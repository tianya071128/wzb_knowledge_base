/*
 * @lc app=leetcode.cn id=838 lang=javascript
 * @lcpr version=30204
 *
 * [838] 推多米诺
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} dominoes
 * @return {string}
 */
var pushDominoes = function (dominoes) {
  /**
   * 模拟双指针: 在 dominoes 首尾添加 "L" 和 "R"
   *
   *  - 每次指针时, 不处理右指针的值
   */
  dominoes = 'L' + dominoes + 'R';

  let left = 0,
    right = 0,
    ans = '';
  while (left < dominoes.length - 1) {
    // 遍历右指针, 找到第一个 "L" 或 "R"
    while (
      right < dominoes.length &&
      (right === left || dominoes[right] === '.')
    ) {
      right++;
    }

    // 模拟所有可能
    // 1. 此时区间 [left, right) 多米诺都为 dominoes[left]
    if (dominoes[left] === dominoes[right]) {
      ans += dominoes[left].repeat(right - left);
    }
    // 2. 此时区间 left 为 L, 其余 (left, right) 多米诺都为 .
    else if (dominoes[left] === 'L' && dominoes[right] === 'R') {
      ans += 'L' + '.'.repeat(right - left - 1);
    }
    // 3. 两边相碰
    else {
      let sum = right - left + 1;
      ans +=
        'R'.repeat(Math.floor(sum / 2)) +
        '.'.repeat(sum % 2) +
        'L'.repeat(Math.floor(sum / 2) - 1);
    }

    left = right;
  }

  return ans.slice(1);
};
// @lc code=end

/*
// @lcpr case=start
// "RR.L..L.R....RRR.LLL.RRR.L....R"\n
// @lcpr case=end

// @lcpr case=start
// ".L.R...LR..L.."\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = pushDominoes;
// @lcpr-after-debug-end
