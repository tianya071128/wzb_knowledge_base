/*
 * @lc app=leetcode.cn id=1848 lang=javascript
 * @lcpr version=30204
 *
 * [1848] 到目标元素的最小距离
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @param {number} start
 * @return {number}
 */
var getMinDistance = function (nums, target, start) {
  /** @type {number} 结果 */
  let ans = Infinity;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      ans = Math.min(ans, Math.abs(i - start));
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,5]\n5\n3\n
// @lcpr case=end

// @lcpr case=start
// [1]\n1\n0\n
// @lcpr case=end

// @lcpr case=start
// [1,1,1,1,1,1,1,1,1,1]\n1\n0\n
// @lcpr case=end

 */
