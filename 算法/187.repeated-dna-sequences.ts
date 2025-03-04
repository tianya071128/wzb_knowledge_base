/*
 * @lc app=leetcode.cn id=187 lang=typescript
 * @lcpr version=30204
 *
 * [187] 重复的DNA序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function findRepeatedDnaSequences(s: string): string[] {
  /**
   * 解题思路: 迭代 s, 找出所有的子串, 使用 hash 判断是否重复
   */
  const cache = new Set<string>(),
    res = new Set<string>();

  for (let i = 0; i <= s.length - 10; i++) {
    const sub = s.slice(i, i + 10);
    if (cache.has(sub)) {
      res.add(sub);
    } else {
      cache.add(sub);
    }
  }

  return [...res];
}
// @lc code=end

/*
// @lcpr case=start
// "AAAAACCCCCA"\n
// @lcpr case=end

// @lcpr case=start
// "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"\n
// @lcpr case=end

// @lcpr case=start
// "AAAAAAAAAAAAA"\n
// @lcpr case=end

 */
