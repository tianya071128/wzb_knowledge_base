/*
 * @lc app=leetcode.cn id=605 lang=javascript
 * @lcpr version=30204
 *
 * [605] 种花问题
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} flowerbed
 * @param {number} n
 * @return {boolean}
 */
var canPlaceFlowers = function (flowerbed, n) {
  if (n === 0) return true;

  /**
   * 贪心, 尽可能的隔得近的地方种植
   */
  for (let i = 0; i < flowerbed.length; i++) {
    if (flowerbed[i] === 0) {
      // 检测前后
      if (flowerbed[i - 1] !== 1 && flowerbed[i + 1] !== 1) {
        flowerbed[i] = 1;
        if (--n === 0) return true;
      }
    }
  }

  return false;
};
// @lc code=end

/*
// @lcpr case=start
// [1,0,0,0,1]\n1\n
// @lcpr case=end

// @lcpr case=start
// [1,0,0,0,1]\n2\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = canPlaceFlowers;
// @lcpr-after-debug-end
