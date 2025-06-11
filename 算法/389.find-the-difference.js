/*
 * @lc app=leetcode.cn id=389 lang=javascript
 * @lcpr version=30204
 *
 * [389] 找不同
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string} t
 * @return {character}
 */
var findTheDifference = function (s, t) {
  // 哈希表计算
  const map = new Map();
  for (const item of s) {
    map.set(item, (map.get(item) ?? 0) + 1);
  }

  for (const item of t) {
    const n = map.get(item) ?? 0;

    if (n === 0) return item;

    map.set(item, n - 1);
  }
};
// @lc code=end

/*
// @lcpr case=start
// "abcd"\n"abcde"\n
// @lcpr case=end

// @lcpr case=start
// ""\n"y"\n
// @lcpr case=end

 */
