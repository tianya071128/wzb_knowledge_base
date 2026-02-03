/*
 * @lc app=leetcode.cn id=1550 lang=javascript
 * @lcpr version=30204
 *
 * [1550] 存在连续三个奇数的数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {boolean}
 */
var threeConsecutiveOdds = function (arr) {
  let ans = 0;

  for (const n of arr) {
    if (n % 2 === 0) {
      ans = 0;
    } else {
      if (++ans === 3) return true;
    }
  }

  return false;
};
// @lc code=end

/*
// @lcpr case=start
// [2,6,4,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,34,3,4,5,7,23,12]\n
// @lcpr case=end

 */
