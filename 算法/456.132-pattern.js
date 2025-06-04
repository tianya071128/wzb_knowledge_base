/*
 * @lc app=leetcode.cn id=456 lang=javascript
 * @lcpr version=30204
 *
 * [456] 132 模式
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var find132pattern = function (nums) {
  // 超时
  // let left = nums[0], // 左边值
  //   mid = -Infinity, // 中间值
  //   cur = 0;
  // while (cur < nums.length - 2) {
  //   // 找到作为起点的值
  //   while (cur < nums.length && nums[cur + 1] <= left) {
  //     left = nums[++cur];
  //   }
  //   // 找到作为中间的值
  //   while (cur < nums.length && nums[cur + 1] >= mid) {
  //     mid = nums[++cur];
  //   }
  //   // 从 cur 开始遍历, 找到最后一个值
  //   for (let i = cur + 1; i < nums.length; i++) {
  //     if (nums[i] > left && nums[i] < mid) return true;
  //   }
  //   // 重置值
  //   cur++;
  //   left = nums[cur];
  //   mid = -Infinity;
  // }
  // return false;
};
// @lc code=end

/*
// @lcpr case=start
// [1, 2, -1, 4, 2]\n
// @lcpr case=end

// @lcpr case=start
// [2, 4, -1, 5, 1]\n
// @lcpr case=end

// @lcpr case=start
// [-1,3,2,0]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = find132pattern;
// @lcpr-after-debug-end
