/*
 * @lc app=leetcode.cn id=1328 lang=javascript
 * @lcpr version=30204
 *
 * [1328] 破坏回文串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} palindrome
 * @return {string}
 */
var breakPalindrome = function (palindrome) {
  /**
   * 1. 破坏回文串前半部分的任意字符 --> 就可以造成不是回文串
   * 2. 将任意字符能够替换成 a 的 --> 就可以是字典序最小
   */
  for (let i = 0; i < Math.floor(palindrome.length / 2); i++) {
    if (palindrome[i] !== 'a') {
      // 将该位置改成 "a", 即是结果
      return palindrome.slice(0, i) + 'a' + palindrome.slice(i + 1);
    }
  }

  // 特殊情况: 如果存在多个字符, 但是前面的字符都是 "a" 的话, 那么直接改变最后一个字符为 b
  if (palindrome.length > 1)
    return palindrome.slice(0, palindrome.length - 1) + 'b';

  return '';
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=breakPalindrome
// paramTypes= ["string"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// "aa"\n
// @lcpr case=end

// @lcpr case=start
// "zaz"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = breakPalindrome;
// @lcpr-after-debug-end
