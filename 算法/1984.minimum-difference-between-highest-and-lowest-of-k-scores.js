/*
 * @lc app=leetcode.cn id=1984 lang=javascript
 * @lcpr version=30204
 *
 * [1984] 学生分数的最小差值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var minimumDifference = function (nums, k) {
  /**
   * 先进行排序, 然后在 k 的大小中比较差值
   */
  /** @type {number} 结果 */
  let ans = Infinity;

  nums.sort((a, b) => a - b);

  for (let i = 0; i <= nums.length - k; i++) {
    ans = Math.min(ans, nums[i + k - 1] - nums[i]);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [90]\n1\n
// @lcpr case=end

// @lcpr case=start
// [9,4,1,7]\n2\n
// @lcpr case=end

 */
