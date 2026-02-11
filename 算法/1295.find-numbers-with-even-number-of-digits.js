/*
 * @lc app=leetcode.cn id=1295 lang=javascript
 * @lcpr version=30204
 *
 * [1295] 统计位数为偶数的数字
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findNumbers = function (nums) {
  let ans = 0;
  for (const n of nums) {
    if (Math.floor(Math.log10(n) + 1) % 2 === 0) ans++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [12,345,2,6,7896]\n
// @lcpr case=end

// @lcpr case=start
// [555,901,482,1771]\n
// @lcpr case=end

 */
