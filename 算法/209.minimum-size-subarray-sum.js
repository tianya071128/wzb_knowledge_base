/*
 * @lc app=leetcode.cn id=209 lang=javascript
 * @lcpr version=30204
 *
 * [209] 长度最小的子数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function (target, nums) {
  // 滑动窗口
  let left = 0,
    right = 0,
    ans = Infinity, // 子数组长度
    n = nums[0]; // 窗口值大小
  while (right < nums.length) {
    // 检测窗口值大小，满足条件
    if (n >= target) {
      ans = Math.min(ans, right - left + 1);
      if (ans === 1) return 1; // 等于 1 时直接返回结果, 无需继续处理

      // 移动左指针
      n -= nums[left];
      left++;
    } else {
      // 移动右指针
      right++;
      n += nums[right];
    }
  }

  return ans === Infinity ? 0 : ans;
};
// @lc code=end

/*
// @lcpr case=start
// 7\n[2,3,1,2,4,3]\n
// @lcpr case=end

// @lcpr case=start
// 4\n[1,4,4]\n
// @lcpr case=end

// @lcpr case=start
// 11\n[1,1,1,1,1,1,1,1]\n
// @lcpr case=end

 */
