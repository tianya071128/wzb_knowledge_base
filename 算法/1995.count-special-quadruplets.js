/*
 * @lc app=leetcode.cn id=1995 lang=javascript
 * @lcpr version=30204
 *
 * [1995] 统计特殊四元组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var countQuadruplets = function (nums) {
  /** @type {number} 结果 */
  let ans = 0;

  for (let i = 0; i < nums.length - 3; i++) {
    for (let j = i + 1; j < nums.length - 2; j++) {
      for (let k = j + 1; k < nums.length - 1; k++) {
        for (let z = k + 1; z < nums.length; z++) {
          if (nums[i] + nums[j] + nums[k] === nums[z]) ans++;
        }
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,6]\n
// @lcpr case=end

// @lcpr case=start
// [3,3,6,4,5]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,1,3,5]\n
// @lcpr case=end

 */
