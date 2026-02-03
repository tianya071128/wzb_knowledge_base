/*
 * @lc app=leetcode.cn id=1375 lang=javascript
 * @lcpr version=30204
 *
 * [1375] 二进制字符串前缀一致的次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} flips
 * @return {number}
 */
var numTimesAllBlue = function (flips) {
  let ans = 0,
    max = 0;
  for (let i = 0; i < flips.length; i++) {
    const flip = flips[i];

    max = Math.max(flip, max);

    if (max === i + 1) {
      ans++;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [3,2,4,1,5]\n
// @lcpr case=end

// @lcpr case=start
// [4,1,2,3]\n
// @lcpr case=end

 */
