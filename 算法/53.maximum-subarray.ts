/*
 * @lc app=leetcode.cn id=53 lang=typescript
 * @lcpr version=30204
 *
 * [53] 最大子数组和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function maxSubArray(nums: number[]): number {
  let max = nums[0],
    total = nums[0];

  for (let index = 1; index < nums.length; index++) {
    const item = nums[index];

    // 如果总和为负数
    if (total < 0) {
      total = item;
    } else {
      total += item;
    }
    max = Math.max(max, total);
  }

  return max;
}
// @lc code=end

/*
// @lcpr case=start
// [-2,1,-3,4,-1,2,1,-5,4]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

// @lcpr case=start
// [5,4,-1,7,8]\n
// @lcpr case=end

 */
