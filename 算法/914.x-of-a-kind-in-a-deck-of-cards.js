/*
 * @lc app=leetcode.cn id=914 lang=javascript
 * @lcpr version=30204
 *
 * [914] 卡牌分组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} deck
 * @return {boolean}
 */
var hasGroupsSizeX = function (deck) {
  /**
   * 根据题意, 每个数字都需要存在最小数量的倍数, 并且最小数量大于 1
   */
  let hash = new Map();
  for (const n of deck) {
    hash.set(n, (hash.get(n) ?? 0) + 1);
  }

  let arr = [...hash.values()],
    min = Math.min(...arr);

  if (min === 1) return false;
  for (const n of arr) {
    if (n % min !== 0) return false;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4,4,3,2,1]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,1,2,2,2,3,3]\n
// @lcpr case=end

 */
