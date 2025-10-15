/*
 * @lc app=leetcode.cn id=747 lang=javascript
 * @lcpr version=30204
 *
 * [747] 至少是其他数字两倍的最大数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var dominantIndex = function (nums) {
  nums = nums.map((item, index) => [item, index]).sort((a, b) => b[0] - a[0]);

  return nums[0][0] >= nums[1][0] * 2 ? nums[0][1] : -1;
};
// @lc code=end

/*
// @lcpr case=start
// [3,6,1,0]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4]\n
// @lcpr case=end

 */
