/*
 * @lc app=leetcode.cn id=1800 lang=javascript
 * @lcpr version=30204
 *
 * [1800] 最大升序子数组和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxAscendingSum = function (nums) {
  /** @type {number} 结果 */
  let ans = nums[0],
    /** @type {number} 上一个子数组的总和 */
    prevSum = nums[0];

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      prevSum += nums[i];
    } else {
      prevSum = nums[i];
    }

    ans = Math.max(prevSum, ans);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [10,20,30,5,10,50]\n
// @lcpr case=end

// @lcpr case=start
// [10,20,30,40,50]\n
// @lcpr case=end

// @lcpr case=start
// [12,17,15,13,10,11,12]\n
// @lcpr case=end

 */
