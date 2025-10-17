/*
 * @lc app=leetcode.cn id=771 lang=javascript
 * @lcpr version=30204
 *
 * [771] 宝石与石头
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} jewels
 * @param {string} stones
 * @return {number}
 */
var numJewelsInStones = function (jewels, stones) {
  let jewelMap = new Set(jewels.split('')),
    ans = 0;

  for (const stone of stones) {
    if (jewelMap.has(stone)) ans++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "aA"\n"aAAbbbb"\n
// @lcpr case=end

// @lcpr case=start
// "z"\n"ZZ"\n
// @lcpr case=end

 */
