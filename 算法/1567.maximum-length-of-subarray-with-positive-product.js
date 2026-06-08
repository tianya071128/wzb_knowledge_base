/*
 * @lc app=leetcode.cn id=1567 lang=javascript
 * @lcpr version=30204
 *
 * [1567] 乘积为正数的最长子数组长度
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var getMaxLen = function (nums) {
  // 滚动动态规划, 只要记录下上一个元素正数和负数的值即可
  let prev = [0, 0],
    ans = 0;

  for (const n of nums) {
    // 0 不参与
    if (n === 0) {
      prev = [0, 0];
    } else if (n > 0) {
      prev = [prev[0] + 1, prev[1] ? prev[1] + 1 : 0];
    } else {
      prev = [prev[1] ? prev[1] + 1 : 0, prev[0] + 1];
    }

    ans = Math.max(ans, prev[0]);
  }

  return ans;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=getMaxLen
// paramTypes= ["number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [1,-2,-3,4]\n
// @lcpr case=end

// @lcpr case=start
// [0,1,-2,-3,-4]\n
// @lcpr case=end

// @lcpr case=start
// [-1,-2,-3,0,1]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = getMaxLen;
// @lcpr-after-debug-end
