/*
 * @lc app=leetcode.cn id=643 lang=javascript
 * @lcpr version=30204
 *
 * [643] 子数组最大平均数 I
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findMaxAverage = function (nums, k) {
  /**
   * 滑动窗口
   */
  let l = 0,
    r = k - 1,
    sum = 0,
    ans = -Infinity;

  // 计算初始窗口的大小
  for (let i = 0; i <= r; i++) {
    sum += nums[i];
  }

  while (r < nums.length) {
    // 计算平均数
    ans = Math.max(ans, sum / k);

    // 移动窗口
    l++;
    r++;
    sum += nums[r] - nums[l - 1];
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,12,-5,-6,50,3]\n4\n
// @lcpr case=end

// @lcpr case=start
// [5]\n1\n
// @lcpr case=end

 */
