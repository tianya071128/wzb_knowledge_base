/*
 * @lc app=leetcode.cn id=387 lang=javascript
 * @lcpr version=30204
 *
 * [387] 字符串中的第一个唯一字符
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function (s) {
  // 1. 迭代 s, 初始记录下 索引, 如果再次迭代到相同字符, 那么就将 索引置为 -1 标记
  const map = new Map();
  for (let i = 0; i < s.length; i++) {
    const item = s[i];
    const n = map.get(item);

    if (map.has(item)) {
      // 存在, 那么就将 索引置为 -1 标记
      map.set(item, -1);
    } else {
      // 如果不存在的话, 记录索引,
      map.set(item, i);
    }
  }

  // 返回第一个
  for (const n of map.values()) {
    if (n !== -1) return n;
  }

  return -1;
};
// @lc code=end

/*
// @lcpr case=start
// "leetcode"\n
// @lcpr case=end

// @lcpr case=start
// "loveleetcode"\n
// @lcpr case=end

// @lcpr case=start
// "aabb"\n
// @lcpr case=end

 */
