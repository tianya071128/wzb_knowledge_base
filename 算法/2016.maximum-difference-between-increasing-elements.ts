/*
 * @lc app=leetcode.cn id=2016 lang=typescript
 * @lcpr version=30204
 *
 * [2016] 增量元素之间的最大差值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function maximumDifference(nums: number[]): number {
  // 从最后开始算起的最大值
  let max = nums.at(-1) ?? 0,
    // 结果值
    ans = -1;

  for (let i = nums.length - 2; i >= 0; i--) {
    if (nums[i] < max) {
      ans = Math.max(max - nums[i], ans);
    }

    max = Math.max(max, nums[i]);
  }

  return ans;
}
// @lc code=end

/*
// @lcpr case=start
// [7,1,5,4]\n
// @lcpr case=end

// @lcpr case=start
// [9,4,3,2]\n
// @lcpr case=end

// @lcpr case=start
// [1,5,2,10]\n
// @lcpr case=end

 */
