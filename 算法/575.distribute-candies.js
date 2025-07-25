/*
 * @lc app=leetcode.cn id=575 lang=javascript
 * @lcpr version=30204
 *
 * [575] 分糖果
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} candyType
 * @return {number}
 */
var distributeCandies = function (candyType) {
  return Math.min(candyType.length / 2, new Set(candyType).size);
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,2,2,3,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [6,6,6,6]\n
// @lcpr case=end

 */
