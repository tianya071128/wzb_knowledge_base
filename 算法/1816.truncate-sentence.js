/*
 * @lc app=leetcode.cn id=1816 lang=javascript
 * @lcpr version=30204
 *
 * [1816] 截断句子
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
var truncateSentence = function (s, k) {
  return s.split(' ').slice(0, k).join(' ');
};
// @lc code=end

/*
// @lcpr case=start
// "Hello how are you Contestant"\n4\n
// @lcpr case=end

// @lcpr case=start
// "What is the solution to this problem"\n4\n
// @lcpr case=end

// @lcpr case=start
// "chopper is not a tanuki"\n5\n
// @lcpr case=end

 */
