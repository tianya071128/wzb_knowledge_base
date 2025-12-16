/*
 * @lc app=leetcode.cn id=1190 lang=javascript
 * @lcpr version=30204
 *
 * [1190] 反转每对括号间的子串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var reverseParentheses = function (s) {
  /**
   * 栈
   */
  let stack = [], // 记录左括号在结果中的位置
    ans = []; // 结果
  for (const item of s) {
    if (item === '(') {
      stack.push(ans.length);
    } else if (item === ')') {
      let l = stack.pop(),
        r = ans.length - 1;

      while (l < r) {
        // 交换位置
        [ans[l], ans[r]] = [ans[r], ans[l]];
        l++, r--;
      }
    } else {
      ans.push(item);
    }
  }

  return ans.join('');
};
// @lc code=end

/*
// @lcpr case=start
// "(abcd)"\n
// @lcpr case=end

// @lcpr case=start
// "(u(love)i)"\n
// @lcpr case=end

// @lcpr case=start
// "(ed(et(oc))el)"\n
// @lcpr case=end

 */
