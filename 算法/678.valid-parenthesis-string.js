/*
 * @lc app=leetcode.cn id=678 lang=javascript
 * @lcpr version=30204
 *
 * [678] 有效的括号字符串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
var checkValidString = function (s) {
  /**
   * 先将所有可配对的 () 配对,
   */
  let leftBracket = 0, // 左括号个数
    arbitrary = 0; // * 个数
  for (let i = 0; i < s.length; i++) {
    const item = s[i];
    if (item === '(') {
      leftBracket++;
    } else if (item === '*') {
      arbitrary++;
    } else {
      // 优先匹配左括号
      if (leftBracket) {
        leftBracket--;
      } else if (arbitrary) {
        arbitrary--;
      } else {
        return false;
      }
    }
  }

  return arbitrary >= leftBracket;
};
// @lc code=end

/*
// @lcpr case=start
// "(((((*(()((((*((**(((()()*)()()()*((((**)())*)*)))))))(())(()))())((*()()(((()((()*(())*(()**)()(())"\n
// @lcpr case=end

// @lcpr case=start
// "(*)"\n
// @lcpr case=end

// @lcpr case=start
// "(*))"\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = checkValidString;
// @lcpr-after-debug-end
