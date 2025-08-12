/*
 * @lc app=leetcode.cn id=795 lang=javascript
 * @lcpr version=30204
 *
 * [795] 区间子数组个数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} left
 * @param {number} right
 * @return {number}
 */
var numSubarrayBoundedMax = function (nums, left, right) {
  /**
   * 滑动窗口
   *  - 迭代, 当发现某个数字在 [left,right] 区间时, 从该区间中心扩展左右边界
   *  - 窗口区间内的个数就是等差数列(5 + 4 + 3 + 2 + 1)
   */
  let ans = 0;

  for (let i = 0; i < nums.length; i++) {
    // 以当前节点往左找到符合条件
    let max = -Infinity;
    for (let j = i; j >= 0; j--) {
      max = Math.max(max, nums[j]);

      // 如果当前满足, 则结果+1
      if (max >= left && max <= right) {
        ans++;
      }
      // 已经超出范围, 无需在查找
      else if (max > right) break;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [2,1,4,3]\n2\n3\n
// @lcpr case=end

// @lcpr case=start
// [2,9,2,5,6]\n2\n8\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = numSubarrayBoundedMax;
// @lcpr-after-debug-end
