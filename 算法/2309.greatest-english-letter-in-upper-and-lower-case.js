/*
 * @lc app=leetcode.cn id=2309 lang=javascript
 * @lcpr version=30204
 *
 * [2309] 兼具大小写的最好英文字母
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var greatestLetter = function (s) {
  let max = Array(26).fill(false),
    min = Array(26).fill(false);

  for (const item of s) {
    let i = item.charCodeAt();

    if (i < 97) {
      max[i - 65] = true;
    } else {
      min[i - 97] = true;
    }
  }

  // 查找大写的
  for (let i = max.length - 1; i >= 0; i--) {
    if (max[i] && min[i]) {
      return String.fromCharCode(i + 65);
    }
  }

  return '';
};
// @lc code=end

/*
// @lcpr case=start
// "lEeTcOdE"\n
// @lcpr case=end

// @lcpr case=start
// "arRAzFif"\n
// @lcpr case=end

// @lcpr case=start
// "AbCdEfGhIjK"\n
// @lcpr case=end

 */
