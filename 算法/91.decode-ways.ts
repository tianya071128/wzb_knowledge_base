/*
 * @lc app=leetcode.cn id=91 lang=typescript
 * @lcpr version=30204
 *
 * [91] 解码方法
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function numDecodings(s: string): number {
  console.log(111);
  if (s[0] === '0') return 0;

  if (s.length === 1) return 1;

  /** 动态规划 */

  // 1. 初始化 dp 表
  const dp: number[] = [1];

  // 2. 状态转移方程 --> 例如: "111"
  //  dp("111") = dp("1")["11" 作为有效值, 如果无效值, 则不加上这一项] + dp("11")["1" 作为有效值, 如果无效值, 则不加上这一项]

  for (let i = 1; i < s.length; i++) {
    const single = Number(s[i]), // 当前项
      double = Number((s[i - 1] === '0' ? '9' : s[i - 1]) + s[i]), // 上一项 + 当前项
      hasSingle = single > 0 && single < 27, // 当前项是否合法
      hasDouble = double > 0 && double < 27,
      res = (hasSingle ? dp[i - 1] : 0) + (hasDouble ? dp[i - 2] ?? 1 : 0);

    // 无效值
    if (res === 0) return 0;

    dp[i] = res;
  }

  return dp.at(-1) ?? 0;
}
// @lc code=end

/*
// @lcpr case=start
// "12"\n
// @lcpr case=end

// @lcpr case=start
// "226"\n
// @lcpr case=end

// @lcpr case=start
// "06"\n
// @lcpr case=end

 */
