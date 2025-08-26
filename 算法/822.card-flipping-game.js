/*
 * @lc app=leetcode.cn id=822 lang=javascript
 * @lcpr version=30204
 *
 * [822] 翻转卡片游戏
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} fronts
 * @param {number[]} backs
 * @return {number}
 */
var flipgame = function (fronts, backs) {
  /**
   * 既然可以任意翻转卡片
   *  - 那么如果一个卡片的正面和背面的数字不同, 那么任一数字肯定可以跟这个卡片的数字不同(如果相同的话, 那么翻转一下就是不同的结果)
   *  - 如果正面和背面的数字相同, 那么必然绕不开这个数字
   *
   * 所以:
   *  - 需要统计一下卡片正面和背面数字相同的数字
   *  - 计算每张卡片正面和背面的数字, 如果不在上面统计的 hash, 则符合条件
   */
  let ans = Infinity,
    hash = new Set();
  for (let i = 0; i < fronts.length; i++) {
    if (fronts[i] === backs[i]) hash.add(fronts[i]);
  }

  for (let i = 0; i < fronts.length; i++) {
    const n1 = fronts[i],
      n2 = backs[i];

    // 两个不相同才行, 否则的话肯定不符合条件
    if (n1 !== n2) {
      if (!hash.has(n1)) ans = Math.min(ans, n1);
      if (!hash.has(n2)) ans = Math.min(ans, n2);
    }
  }

  return ans === Infinity ? 0 : ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,4,4,7]\n[3,3,4,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n[1]\n
// @lcpr case=end

 */
