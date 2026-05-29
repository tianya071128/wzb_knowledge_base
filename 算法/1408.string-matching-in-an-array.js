/*
 * @lc app=leetcode.cn id=1408 lang=javascript
 * @lcpr version=30204
 *
 * [1408] 数组中的字符串匹配
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} words
 * @return {string[]}
 */
var stringMatching = function (words) {
  // 暴力匹配
  let ans = [];
  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words.length; j++) {
      if (i !== j && words[j].includes(words[i])) {
        ans.push(words[i]);
        break;
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["mass","as","hero","superhero"]\n
// @lcpr case=end

// @lcpr case=start
// ["leetcode","et","code"]\n
// @lcpr case=end

// @lcpr case=start
// ["blue","green","bu"]\n
// @lcpr case=end

 */
