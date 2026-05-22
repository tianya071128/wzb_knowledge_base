/*
 * @lc app=leetcode.cn id=1529 lang=javascript
 * @lcpr version=30204
 *
 * [1529] 最少的后缀翻转次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} target
 * @return {number}
 */
var minFlips = function (target) {
  // 从高位到低位翻转, 翻转低位时不会影响高位
  let ans = 0;
  for (let i = 0; i < target.length; i++) {
    if (String(ans % 2) !== target[i]) ans++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "10111"\n
// @lcpr case=end

// @lcpr case=start
// "101"\n
// @lcpr case=end

// @lcpr case=start
// "00000"\n
// @lcpr case=end

 */
