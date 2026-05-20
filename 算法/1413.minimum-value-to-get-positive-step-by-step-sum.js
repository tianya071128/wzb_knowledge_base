/*
 * @lc app=leetcode.cn id=1413 lang=javascript
 * @lcpr version=30204
 *
 * [1413] 逐步求和得到正数的最小值
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var minStartValue = function (nums) {
  // 遍历 nums, 在累加的过程中最小值
  let min = 0,
    total = 0;
  for (const n of nums) {
    total += n;
    min = Math.min(total, min);
  }

  return Math.abs(min) + 1;
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=minStartValue
// paramTypes= ["number[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// [-3,2,-3,4,2]\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n
// @lcpr case=end

// @lcpr case=start
// [1,-2,-3]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minStartValue;
// @lcpr-after-debug-end
