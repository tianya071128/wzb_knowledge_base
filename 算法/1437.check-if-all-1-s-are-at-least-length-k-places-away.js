/*
 * @lc app=leetcode.cn id=1437 lang=javascript
 * @lcpr version=30204
 *
 * [1437] 是否所有 1 都至少相隔 k 个元素
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var kLengthApart = function (nums, k) {
  let prev = -Infinity;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 1) {
      if (i - prev - 1 < k) return false;
      prev = i;
    }
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [1,0,0,0,1,0,0,1]\n2\n
// @lcpr case=end

// @lcpr case=start
// [1,0,0,1,0,1]\n2\n
// @lcpr case=end

 */
