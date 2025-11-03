/*
 * @lc app=leetcode.cn id=884 lang=javascript
 * @lcpr version=30204
 *
 * [884] 两句话中的不常见单词
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s1
 * @param {string} s2
 * @return {string[]}
 */
var uncommonFromSentences = function (s1, s2) {
  let ans = [],
    hash1 = new Map(),
    hash2 = new Map();

  for (const item of s1.split(' ')) {
    hash1.set(item, (hash1.get(item) ?? 0) + 1);
  }

  for (const item of s2.split(' ')) {
    hash2.set(item, (hash2.get(item) ?? 0) + 1);
  }

  for (const [s, n] of hash1) {
    if (n === 1 && !hash2.has(s)) {
      ans.push(s);
    }
  }

  for (const [s, n] of hash2) {
    if (n === 1 && !hash1.has(s)) {
      ans.push(s);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "this apple is sweet"\n"this apple is sour"\n
// @lcpr case=end

// @lcpr case=start
// "apple apple"\n"banana"\n
// @lcpr case=end

 */
