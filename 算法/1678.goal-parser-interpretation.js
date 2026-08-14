/*
 * @lc app=leetcode.cn id=1678 lang=javascript
 * @lcpr version=30204
 *
 * [1678] 设计 Goal 解析器
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} command
 * @return {string}
 */
var interpret = function (command) {
  /** @type {string} 结果 */
  let ans = '';

  for (let i = 0; i < command.length; i++) {
    if (command[i] === 'G') {
      ans += 'G';
    } else if (command[i] === '(') {
      if (command[i + 1] === ')') {
        ans += 'o';
        i++;
      } else {
        ans += 'al';
        i += 3;
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "G()(al)"\n
// @lcpr case=end

// @lcpr case=start
// "G()()()()(al)"\n
// @lcpr case=end

// @lcpr case=start
// "(al)G(al)()()G"\n
// @lcpr case=end

 */
