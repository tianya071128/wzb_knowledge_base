/*
 * @lc app=leetcode.cn id=944 lang=javascript
 * @lcpr version=30204
 *
 * [944] 删列造序
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} strs
 * @return {number}
 */
var minDeletionSize = function (strs) {
  if (strs.length <= 1) return 0;

  let ans = 0;
  for (let i = 0; i < strs[0].length; i++) {
    for (let j = 1; j < strs.length; j++) {
      if (strs[j][i] < strs[j - 1][i]) {
        ans++;
        break;
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["cba","daf","ghi"]\n
// @lcpr case=end

// @lcpr case=start
// ["a","b"]\n
// @lcpr case=end

// @lcpr case=start
// ["zyx","wvu","tsr"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minDeletionSize;
// @lcpr-after-debug-end
