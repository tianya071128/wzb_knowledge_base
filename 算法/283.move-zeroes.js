/*
 * @lc app=leetcode.cn id=283 lang=javascript
 * @lcpr version=30204
 *
 * [283] 移动零
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function (nums) {
  /**
   * 遍历一次即可
   *  1. 记录下存在 0 的个数,
   *  2. 记录不为 0 的索引
   */
  let zeroNum = 0,
    i = 0;
  for (const n of nums) {
    if (n === 0) {
      zeroNum++;
    } else {
      nums[i++] = n;
    }
  }

  // 添加 0 到末尾
  for (let i = nums.length - zeroNum; i < nums.length; i++) {
    nums[i] = 0;
  }
};
// @lc code=end

/*
// @lcpr case=start
// [0,1,0,3,12]\n
// @lcpr case=end

// @lcpr case=start
// [0]\n
// @lcpr case=end

 */
