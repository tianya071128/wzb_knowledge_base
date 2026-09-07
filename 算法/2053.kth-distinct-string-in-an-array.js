/*
 * @lc app=leetcode.cn id=2053 lang=javascript
 * @lcpr version=30204
 *
 * [2053] 数组中第 K 个独一无二的字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} arr
 * @param {number} k
 * @return {string}
 */
var kthDistinct = function (arr, k) {
  /** @type {Map<string, number>} 哈希表存储数量 */
  let hash = new Map();

  for (const item of arr) {
    hash.set(item, (hash.get(item) ?? 0) + 1);
  }

  for (const item of arr) {
    if (hash.get(item) === 1) {
      k--;

      if (k === 0) return item;
    }
  }

  return '';
};
// @lc code=end

/*
// @lcpr case=start
// ["d","b","c","b","c","a"]\n2\n
// @lcpr case=end

// @lcpr case=start
// ["aaa","aa","a"]\n1\n
// @lcpr case=end

// @lcpr case=start
// ["a","b","a"]\n3\n
// @lcpr case=end

 */
