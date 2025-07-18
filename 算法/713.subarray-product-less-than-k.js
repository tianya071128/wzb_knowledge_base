/*
 * @lc app=leetcode.cn id=713 lang=javascript
 * @lcpr version=30204
 *
 * [713] 乘积小于 K 的子数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var numSubarrayProductLessThanK = function (nums, k) {
  if (k <= 1) return 0;

  /**
   * 暴力尝试, 感觉会超时 -- 竟然通过了
   */
  // let ans = 0;
  // for (let i = 0; i < nums.length; i++) {
  //   let sum = 1;
  //   for (let j = i; j >= 0; j--) {
  //     sum *= nums[j];
  //     if (sum < k) {
  //       ans++;
  //     } else {
  //       break;
  //     }
  //   }
  // }

  // return ans;

  /**
   * 滑动窗口, 每次向右扩展时, 如果窗口中的乘机满足条件, 那么说明以右边界的数字都可以跟其他元素组成满足条件的子数组
   *
   * 此时结果可以 + 窗口大小(以右边界为子数组结尾)
   */
  let ans = 0,
    left = 0,
    right = 0,
    sum = 1; // 窗口大小

  while (right < nums.length) {
    sum *= nums[right];

    // 如果区间大于 k, 收缩窗口
    while (sum >= k) {
      sum /= nums[left];
      left++;
    }

    ans += right - left + 1;

    // 扩展右窗口
    right++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [10,5,2,6]\n100\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3]\n0\n
// @lcpr case=end

 */
