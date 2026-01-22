/*
 * @lc app=leetcode.cn id=1347 lang=javascript
 * @lcpr version=30204
 *
 * [1347] 制造字母异位词的最小步骤数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {string} t
 * @return {number}
 */
var minSteps = function (s, t) {
  // 记录两个字符串的字符个数
  let list1 = Array(26).fill(0),
    list2 = Array(26).fill(0);

  for (let i = 0; i < s.length; i++) {
    list1[s[i].charCodeAt() - 97]++;
    list2[t[i].charCodeAt() - 97]++;
  }

  let ans = 0;
  for (let i = 0; i < list1.length; i++) {
    ans += Math.max(0, list2[i] - list1[i]);
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=minSteps
// paramTypes= ["string","string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "bab"\n"aba"\n
// @lcpr case=end

*/

// @lcpr-after-debug-begin
module.exports = minSteps;
// @lcpr-after-debug-end
