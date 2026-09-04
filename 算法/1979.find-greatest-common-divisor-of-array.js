/*
 * @lc app=leetcode.cn id=1979 lang=javascript
 * @lcpr version=30204
 *
 * [1979] 找出数组的最大公约数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findGCD = function (nums) {
  /** 辗转相除法 */
  let min = Infinity,
    max = -Infinity;

  for (const n of nums) {
    min = Math.min(min, n);
    max = Math.max(max, n);
  }

  while (min > 0) {
    [min, max] = [max % min, min];
  }

  return max;
};
// @lc code=end

/*
// @lcpr case=start
// [2,5,6,9,10]\n
// @lcpr case=end

// @lcpr case=start
// [7,5,6,8,3]\n
// @lcpr case=end

// @lcpr case=start
// [3,3]\n
// @lcpr case=end

 */
