/*
 * @lc app=leetcode.cn id=1480 lang=javascript
 * @lcpr version=30204
 *
 * [1480] 一维数组的动态和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var runningSum = function (nums) {
  let sum = 0;

  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];

    nums[i] = sum;
  }

  return nums;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,1,1,1]\n
// @lcpr case=end

// @lcpr case=start
// [3,1,2,10,1]\n
// @lcpr case=end

 */
