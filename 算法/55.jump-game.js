/*
 * @lc app=leetcode.cn id=55 lang=javascript
 * @lcpr version=30204
 *
 * [55] 跳跃游戏
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function (nums) {
  // 只要不跳到 0 的位置即可
  let max = -1;

  for (let i = 0; i < nums.length; i++) {
    if (max < nums[i] + i) {
      max = nums[i] + i;
    }

    // 什么时候停止了? -- 当最大的位置就等于当前索引的话, 说明已经不能往前进了
    if (max === i && i !== nums.length - 1) return false;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [2,3,1,1,4]\n
// @lcpr case=end

// @lcpr case=start
// [3,2,1,0,4]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = canJump;
// @lcpr-after-debug-end
