/*
 * @lc app=leetcode.cn id=290 lang=javascript
 * @lcpr version=30204
 *
 * [290] 单词规律
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} pattern
 * @param {string} s
 * @return {boolean}
 */
var wordPattern = function (pattern, s) {
  /**
   * 哈希表记录映射关系，还要考虑双向映射
   */
  // 1. 根据空格分隔 s
  const list = s.split(' ');

  if (list.length !== pattern.length) return false;

  const map = new Map();
  const map2 = new Map();
  for (let i = 0; i < pattern.length; i++) {
    const s1 = pattern[i],
      s2 = list[i];

    /**
     * 什么情况下不存在连接?
     *  1. map 中存在 s1 对应的值 并且跟 s2 不同
     *  2. 或者 map2 中存在 s2 对应的值 并且跟 s1 不同
     */
    if (
      (map.has(s1) && map.get(s1) !== s2) ||
      (map2.has(s2) && map2.get(s2) !== s1)
    )
      return false;

    map.set(s1, s2);
    map2.set(s2, s1);
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// "abba"\n"dog cat cat dog"\n
// @lcpr case=end

// @lcpr case=start
// "abba"\n"dog dog dog dog"\n
// @lcpr case=end

// @lcpr case=start
// "aaaa"\n"dog cat cat dog"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = wordPattern;
// @lcpr-after-debug-end
