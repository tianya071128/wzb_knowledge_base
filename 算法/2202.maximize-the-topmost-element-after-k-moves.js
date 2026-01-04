/*
 * @lc app=leetcode.cn id=2202 lang=javascript
 * @lcpr version=30204
 *
 * [2202] K 次操作后最大化顶端元素
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maximumTop = function (nums, k) {
  /**
   * 数组中的元素如何判断是否可以成为堆顶元素
   *  - i >= k
   *  - (k - i) !== 1, 此时可以重复利用删除和添加的操作, 使得当前元素为栈顶
   *
   * 特殊情况:
   *  nums.length === 1 的情况, 此时由 k 的奇偶性决定
   */
  if (nums.length === 1) return k % 2 === 0 ? nums[0] : -1;

  let ans = -1;
  for (let i = 0; i < Math.min(nums.length, k + 1); i++) {
    if (k - i !== 1) ans = Math.max(ans, nums[i]);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [5,8,9,10,11,12]\n5\n
// @lcpr case=end

// @lcpr case=start
// [2]\n1\n
// @lcpr case=end

 */
