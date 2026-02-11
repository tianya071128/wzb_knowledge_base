/*
 * @lc app=leetcode.cn id=1221 lang=javascript
 * @lcpr version=30204
 *
 * [1221] 分割平衡字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var balancedStringSplit = function (s) {
  let l = 0,
    r = 0,
    ans = 0;
  for (const item of s) {
    item === 'L' ? l++ : r++;

    if (l === r) ans++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "RLRRLLRLRL"\n
// @lcpr case=end

// @lcpr case=start
// "RLRRRLLRLL"\n
// @lcpr case=end

// @lcpr case=start
// "LLLLRRRR"\n
// @lcpr case=end

 */
