/*
 * @lc app=leetcode.cn id=1446 lang=javascript
 * @lcpr version=30204
 *
 * [1446] 连续字符
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var maxPower = function (s) {
  let ans = 0,
    i = 0;

  while (i < s.length) {
    let cur = 1;
    while (s[i] === s[i + 1]) {
      i++;
      cur++;
    }

    ans = Math.max(cur, ans);
    i++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "leetcode"\n
// @lcpr case=end

// @lcpr case=start
// "abbcccddddeeeeedcba"\n
// @lcpr case=end

 */
