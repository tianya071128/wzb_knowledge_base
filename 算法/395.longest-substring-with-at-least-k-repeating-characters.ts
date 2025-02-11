/*
 * @lc app=leetcode.cn id=395 lang=typescript
 * @lcpr version=30204
 *
 * [395] 至少有 K 个重复字符的最长子串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function longestSubstring(s: string, k: number): number {
  if (k === 1) return s.length;
  if (s.length < k) return 0;

  // 1. 迭代一遍, 记录迭代过程中出现的字符串以及次数
  let map: Record<string, number> = {};
  for (const item of s) {
    map[item] = (map[item] ?? 0) + 1;
  }

  // 2. 将不满足个数的字符提取出来, 并且作为分割字符串的依据
  const list = Object.entries(map)
    .filter(([, num]) => num < k)
    .map((item) => item[0]);
  if (!list.length) return s.length;

  const subList = s
    .split(new RegExp(`${list.join('|')}`))
    .filter((item) => item);
  return Math.max(...subList.map((item) => longestSubstring(item, k)), 0);
}
// @lc code=end

/*
// @lcpr case=start
// "aaabb"\n3\n
// @lcpr case=end

// @lcpr case=start
// "ababbc"\n2\n
// @lcpr case=end

 */
