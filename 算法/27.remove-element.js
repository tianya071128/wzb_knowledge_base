/*
 * @lc app=leetcode.cn id=27 lang=javascript
 * @lcpr version=30204
 *
 * [27] 移除元素
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  for (let index = nums.length - 1; index >= 0; index--) {
    const item = nums[index];
    if (item === val) {
      // 似乎使用 splice 的话, 在 splice 方法内部也需要遍历一下 nums
      nums.splice(index, 1);
    }
  }

  return nums.length;
};
// @lc code=end

/*
// @lcpr case=start
// [3,2,2,3]\n3\n
// @lcpr case=end

// @lcpr case=start
// [0,1,2,2,3,0,4,2]\n2\n
// @lcpr case=end

 */
