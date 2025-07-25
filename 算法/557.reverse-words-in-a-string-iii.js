/*
 * @lc app=leetcode.cn id=557 lang=javascript
 * @lcpr version=30204
 *
 * [557] 反转字符串中的单词 III
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function (s) {
  return s
    .split(' ')
    .map((item) => item.split('').reverse().join(''))
    .join(' ');
};
// @lc code=end

/*
// @lcpr case=start
// "Let's take LeetCode contest"\n
// @lcpr case=end

// @lcpr case=start
// "Mr Ding"\n
// @lcpr case=end

 */
