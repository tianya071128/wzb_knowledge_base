/*
 * @lc app=leetcode.cn id=1768 lang=javascript
 * @lcpr version=30204
 *
 * [1768] 交替合并字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} word1
 * @param {string} word2
 * @return {string}
 */
var mergeAlternately = function (word1, word2) {
  /** @type {string} 结果 */
  let ans = '';

  for (let i = 0; i < Math.max(word1.length, word2.length); i++) {
    ans += (word1[i] ?? '') + (word2[i] ?? '');
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "abc"\n"pqr"\n
// @lcpr case=end

// @lcpr case=start
// "ab"\n"pqrs"\n
// @lcpr case=end

// @lcpr case=start
// "abcd"\n"pq"\n
// @lcpr case=end

 */
