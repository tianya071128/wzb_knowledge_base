/*
 * @lc app=leetcode.cn id=383 lang=javascript
 * @lcpr version=30204
 *
 * [383] 赎金信
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} ransomNote
 * @param {string} magazine
 * @return {boolean}
 */
var canConstruct = function (ransomNote, magazine) {
  // 这不跟350 题类似
  // 1. 使用 map 存储 magazine 的字符次数
  const map = new Map();
  for (const s of magazine) {
    map.set(s, (map.get(s) ?? 0) + 1);
  }

  // 2. 迭代 ransomNote
  for (const s of ransomNote) {
    const n = map.get(s) ?? 0;

    if (n < 1) return false;

    map.set(s, n - 1);
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// "a"\n"b"\n
// @lcpr case=end

// @lcpr case=start
// "aa"\n"ab"\n
// @lcpr case=end

// @lcpr case=start
// "aa"\n"aab"\n
// @lcpr case=end

 */
