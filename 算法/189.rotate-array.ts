/*
 * @lc app=leetcode.cn id=189 lang=typescript
 * @lcpr version=30204
 *
 * [189] 轮转数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 Do not return anything, modify nums in-place instead.
 */
function rotate(nums: number[], k: number): void {
  // 思路: 当轮转 nums.length 的倍数步时, 会回到原点。所以只需遍历 k % nums.length 步

  for (let index = 1; index <= k % nums.length; index++) {
    nums.unshift(nums.pop()!);
  }
}
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5,6,7]\n3\n
// @lcpr case=end

// @lcpr case=start
// [-1,-100,3,99]\n2\n
// @lcpr case=end

 */
