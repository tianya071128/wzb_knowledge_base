/*
 * @lc app=leetcode.cn id=115 lang=javascript
 * @lcpr version=30204
 *
 * [115] 不同的子序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string} t
 * @return {number}
 */
var numDistinct = function (s, t) {
  /**
   * 动态规则:
   *
   *  f(s[i], t[i]) -> 如下情况的总和
   *   - f(s[i - 1], t[i])
   *   - 如果当前位置字符相同: f(s[i - 1], t[i - 1])
   */
  /**
   *    ''  r  a  b  b  i  t
   *  '' 1  0  0  0  0  0  0
   *  r  1
   *  a  1
   *  b  1
   *  b  1
   *  b  1
   *  i  1
   *  t  1
   */
  let dp = Array.from({ length: s.length + 1 }, () => 1).map((item) =>
    Array.from({ length: t.length + 1 }, () => 0)
  );

  // 初始化
  for (const item of dp) {
    item[0] = 1;
  }

  // 状态转移
  for (let i = 1; i < dp.length; i++) {
    for (let j = 1; j < dp[i].length; j++) {
      dp[i][j] = dp[i - 1][j] + (s[i - 1] === t[j - 1] ? dp[i - 1][j - 1] : 0);
    }
  }

  return dp.at(-1).at(-1);
};
// @lc code=end

/*
// @lcpr case=start
// "rabbbit"\n"rabbit"\n
// @lcpr case=end

// @lcpr case=start
// "babgbag"\n"bag"\n
// @lcpr case=end

 */
