/*
 * @lc app=leetcode.cn id=1021 lang=javascript
 * @lcpr version=30204
 *
 * [1021] 删除最外层的括号
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var removeOuterParentheses = function (s) {
  /**
   * 只要匹配到成组的括号, 那么就是原语
   */
  let leftSum = 0, // 左括号数量
    str = '',
    ans = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') {
      if (leftSum > 0) str += s[i];
      leftSum++;
    } else {
      leftSum--;

      // 如果左右成对的话
      if (leftSum === 0) {
        ans += str;
        str = '';
      } else {
        str += s[i];
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "(()())(())"\n
// @lcpr case=end

// @lcpr case=start
// "(()())(())(()(()))"\n
// @lcpr case=end

// @lcpr case=start
// "()()"\n
// @lcpr case=end

 */
