/*
 * @lc app=leetcode.cn id=26 lang=javascript
 * @lcpr version=30204
 *
 * [26] 删除有序数组中的重复项
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  /**
   * 解题思路:
   *  - 类似于数组去重, 区别在于需要直接更改 nums
   */
  const hash = {};
  for (let index = nums.length - 1; index >= 0; index--) {
    const item = nums[index];
    if (hash[item]) {
      nums.splice(index, 1);
    }

    hash[item] = true;
  }

  return nums.length;
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,2]\n
// @lcpr case=end

// @lcpr case=start
// [0,0,1,1,1,2,2,3,3,4]\n
// @lcpr case=end

 */
