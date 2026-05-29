/*
 * @lc app=leetcode.cn id=1422 lang=javascript
 * @lcpr version=30204
 *
 * [1422] 分割字符串的最大得分
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var maxScore = function (s) {
  // 计算 0 的个数
  let sum = 0;
  for (const item of s) {
    if (item === '0') sum++;
  }

  // 划分
  let ans = 0,
    zeroNum = 0;
  for (let i = 0; i < s.length - 1; i++) {
    if (s[i] === '0') zeroNum++;

    ans = Math.max(ans, zeroNum + (s.length - 1 - i - (sum - zeroNum)));
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "011101"\n
// @lcpr case=end

// @lcpr case=start
// "00111"\n
// @lcpr case=end

// @lcpr case=start
// "1111"\n
// @lcpr case=end

 */
