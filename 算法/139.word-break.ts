/*
 * @lc app=leetcode.cn id=139 lang=typescript
 * @lcpr version=30204
 *
 * [139] 单词拆分
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function wordBreak(s: string, wordDict: string[]): boolean {
  /**
   * 动态规划
   */
  const wordDictSet = new Set(wordDict);
  // 初始化 dp 表
  const dp = Array(s.length + 1).fill(false);

  dp[0] = true;

  // 状态转移方程
  // 难以表述, 查看: https://leetcode.cn/problems/word-break/solutions/302779/shou-hui-tu-jie-san-chong-fang-fa-dfs-bfs-dong-tai/
  for (let i = 1; i <= s.length; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (dp[j] && wordDictSet.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }

  return dp[s.length];
}
// @lc code=end

/*
// @lcpr case=start
// "leetcode"\n["leet", "code"]\n
// @lcpr case=end

// @lcpr case=start
// "applepenapple"\n["apple", "pen"]\n
// @lcpr case=end

// @lcpr case=start
// "catsandog"\n["cats", "dog", "sand", "and", "cat"]\n
// @lcpr case=end

 */
