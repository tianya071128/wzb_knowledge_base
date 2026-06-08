/*
 * @lc app=leetcode.cn id=1502 lang=javascript
 * @lcpr version=30204
 *
 * [1502] 判断能否形成等差数列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {boolean}
 */
var canMakeArithmeticProgression = function (arr) {
  arr.sort((a, b) => a - b);

  let diff = arr[1] - arr[0];

  for (let i = 2; i < arr.length; i++) {
    if (arr[i] - arr[i - 1] !== diff) return false;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [3,5,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,4]\n
// @lcpr case=end

 */
