/*
 * @lc app=leetcode.cn id=131 lang=typescript
 * @lcpr version=30204
 *
 * [131] 分割回文串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function partition(s: string): string[][] {
  const res = [[s[0]]];

  for (let i = 1; i < s.length; i++) {
    const item = s[i];

    // 当遍历到该字符串时, 向已存在的子串集合中添加该项字符
    res.forEach((v) => v.push(item));

    // 从该位置开始, 截取字符串
    const subStr = s.slice(0, i + 1);
  }

  return [];
}
// @lc code=end

/*
// @lcpr case=start
// "aab"\n
// @lcpr case=end

// @lcpr case=start
// "a"\n
// @lcpr case=end

 */
