/*
 * @lc app=leetcode.cn id=485 lang=javascript
 * @lcpr version=30204
 *
 * [485] 最大连续 1 的个数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMaxConsecutiveOnes = function (nums) {
  let ans = 0,
    cur = 0;
  for (const n of nums) {
    if (n === 1) {
      cur++;
      ans = Math.max(cur, ans);
    } else {
      cur = 0;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,0,1,1,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,0,1,1,0,1]\n
// @lcpr case=end

 */
