/*
 * @lc app=leetcode.cn id=1048 lang=javascript
 * @lcpr version=30204
 *
 * [1048] 最长字符串链
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} words
 * @return {number}
 */
var longestStrChain = function (words) {
  /**
   * 动态规划:
   *  1. 先进行排序
   *  2. 每次与该项字符少一个的字符进行判断是否能组成链
   */
  words.sort((a, b) => a.length - b.length);

  let dp = new Array(words.length).fill(1),
    /** @type {Map<number, number[]>} Map<字符个数, 字符索引> */
    hash = new Map(),
    ans = 1;

  for (let i = 0; i < words.length; i++) {
    hash.set(words[i].length, [...(hash.get(words[i].length) ?? []), i]);

    // 找到比该字符少一个的字符集合
    for (const j of hash.get(words[i].length - 1) ?? []) {
      if (hasChain(words[j], words[i])) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
        ans = Math.max(ans, dp[i]);
      }
    }
  }

  return ans;
};

/**
 * @param {string} a
 * @param {string} b
 * @return {boolean}
 */
function hasChain(a, b) {
  let p1 = 0,
    p2 = 0;
  while (p1 < a.length && p2 < b.length) {
    if (a[p1] !== b[p2]) {
      p2++;
    } else {
      p1++;
      p2++;
    }

    if (p2 > p1 + 1) return false;
  }

  return true;
}
// @lc code=end

/*
// @lcpr case=start
// ["a","b","ab","bac"]\n
// @lcpr case=end

// @lcpr case=start
// ["xbc","pcxbcf","xb","cxbc","pcxbc"]\n
// @lcpr case=end

// @lcpr case=start
// ["abcd","dbqca"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = longestStrChain;
// @lcpr-after-debug-end
