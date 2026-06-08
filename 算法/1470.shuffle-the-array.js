/*
 * @lc app=leetcode.cn id=1470 lang=javascript
 * @lcpr version=30204
 *
 * [1470] 重新排列数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} n
 * @return {number[]}
 */
var shuffle = function (nums, n) {
  let ans = Array(nums.length);

  for (let i = 0; i < n; i++) {
    ans[i * 2] = nums[i];
    ans[i * 2 + 1] = nums[i + n];
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [2,5,1,3,4,7]\n3\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,4,3,2,1]\n4\n
// @lcpr case=end

// @lcpr case=start
// [1,1,2,2]\n2\n
// @lcpr case=end

 */
