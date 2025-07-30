/*
 * @lc app=leetcode.cn id=674 lang=javascript
 * @lcpr version=30204
 *
 * [674] 最长连续递增序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findLengthOfLCIS = function (nums) {
  let ans = 1,
    n = 1;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      ans = Math.max(ans, ++n);
    } else {
      n = 1;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,3,5,4,7]\n
// @lcpr case=end

// @lcpr case=start
// [2,2,2,2,2]\n
// @lcpr case=end

 */
