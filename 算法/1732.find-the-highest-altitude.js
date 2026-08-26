/*
 * @lc app=leetcode.cn id=1732 lang=javascript
 * @lcpr version=30204
 *
 * [1732] 找到最高海拔
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} gain
 * @return {number}
 */
var largestAltitude = function (gain) {
  /** @type {number} 结果 */
  let ans = 0,
    /** @type {number} 之前海拔 */
    prev = 0;

  for (const item of gain) {
    prev += item;

    ans = Math.max(ans, prev);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [-5,1,5,0,-7]\n
// @lcpr case=end

// @lcpr case=start
// [-4,-3,-2,-1,4,3,2]\n
// @lcpr case=end

 */
