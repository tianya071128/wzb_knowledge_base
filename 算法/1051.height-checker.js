/*
 * @lc app=leetcode.cn id=1051 lang=javascript
 * @lcpr version=30204
 *
 * [1051] 高度检查器
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} heights
 * @return {number}
 */
var heightChecker = function (heights) {
  let expected = [...heights].sort((a, b) => a - b),
    ans = 0;

  for (let i = 0; i < heights.length; i++) {
    if (heights[i] !== expected[i]) ans++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,4,2,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [5,1,2,3,4]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5]\n
// @lcpr case=end

 */
