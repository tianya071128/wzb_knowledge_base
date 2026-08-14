/*
 * @lc app=leetcode.cn id=1608 lang=javascript
 * @lcpr version=30204
 *
 * [1608] 特殊数组的特征值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var specialArray = function (nums) {
  /** 排序 */
  nums.sort((a, b) => b - a);

  nums.push(-1);

  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] >= i + 1 && nums[i + 1] < i + 1) return i + 1;
  }

  return -1;
};
// @lc code=end

/*
// @lcpr case=start
// [3,5]\n
// @lcpr case=end

// @lcpr case=start
// [0,0]\n
// @lcpr case=end

// @lcpr case=start
// [0,4,3,0,4]\n
// @lcpr case=end

// @lcpr case=start
// [3,6,7,7,0]\n
// @lcpr case=end

 */
