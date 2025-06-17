/*
 * @lc app=leetcode.cn id=414 lang=javascript
 * @lcpr version=30204
 *
 * [414] 第三大的数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var thirdMax = function (nums) {
  // 排序
  nums.sort((a, b) => b - a);

  let cur = nums[0],
    len = 2;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== cur) {
      len--;
      cur = nums[i];

      if (len === 0) return cur;
    }
  }

  return nums[0];
};
// @lc code=end

/*
// @lcpr case=start
// [3, 2, 1]\n
// @lcpr case=end

// @lcpr case=start
// [1, 2]\n
// @lcpr case=end

// @lcpr case=start
// [2, 2, 3, 1]\n
// @lcpr case=end

 */
