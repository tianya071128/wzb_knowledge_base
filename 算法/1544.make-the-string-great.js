/*
 * @lc app=leetcode.cn id=1544 lang=javascript
 * @lcpr version=30204
 *
 * [1544] 整理字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var makeGood = function (s) {
  let stack = [];

  for (const item of s) {
    let prev = stack.at(-1);
    if (
      prev &&
      prev.toLocaleLowerCase() === item.toLocaleLowerCase() &&
      item.charCodeAt() !== prev.charCodeAt()
    ) {
      stack.pop();
    } else {
      stack.push(item);
    }
  }

  return stack.join('');
};
// @lc code=end

/*
// @lcpr case=start
// "leELetcode"\n
// @lcpr case=end

// @lcpr case=start
// "abBAcC"\n
// @lcpr case=end

// @lcpr case=start
// "s"\n
// @lcpr case=end

 */
