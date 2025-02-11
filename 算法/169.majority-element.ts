/*
 * @lc app=leetcode.cn id=169 lang=typescript
 * @lcpr version=30204
 *
 * [169] 多数元素
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function majorityElement(nums: number[]): number {
  // 先排序, 取中间元素即可
  nums = nums.sort((a, b) => a - b);

  return nums[Math.floor((nums.length - 1) / 2)];
}
// @lc code=end

/*
// @lcpr case=start
// [3,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [2,2,1,1,1,2,2]\n
// @lcpr case=end

 */
