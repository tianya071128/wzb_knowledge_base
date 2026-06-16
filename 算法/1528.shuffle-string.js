/*
 * @lc app=leetcode.cn id=1528 lang=javascript
 * @lcpr version=30204
 *
 * [1528] 重新排列字符串
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @param {number[]} indices
 * @return {string}
 */
var restoreString = function (s, indices) {
  let ans = [];
  for (let i = 0; i < indices.length; i++) {
    ans[indices[i]] = s[i];
  }

  return ans.join('');
};
// @lc code=end

/*
// @lcpr case=start
// "codeleet"\n[4,5,6,7,0,2,1,3]\n
// @lcpr case=end

// @lcpr case=start
// "abc"\n[0,1,2]\n
// @lcpr case=end

 */
