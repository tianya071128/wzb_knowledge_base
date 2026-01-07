/*
 * @lc app=leetcode.cn id=1276 lang=javascript
 * @lcpr version=30204
 *
 * [1276] 不浪费原料的汉堡制作方案
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} tomatoSlices
 * @param {number} cheeseSlices
 * @return {number[]}
 */
var numOfBurgers = function (tomatoSlices, cheeseSlices) {
  // 超出边界, 直接判定
  if (tomatoSlices < cheeseSlices * 2 || tomatoSlices > cheeseSlices * 4)
    return [];

  // 如果无法拆分, 那么直接返回 []
  let max = (tomatoSlices - cheeseSlices * 2) / 2,
    min = cheeseSlices - max;

  return Number.isInteger(max) ? [max, min] : [];
};
// @lc code=end

/*
// @lcpr case=start
// 2100\n1000\n
// @lcpr case=end

// @lcpr case=start
// 17\n4\n
// @lcpr case=end

// @lcpr case=start
// 4\n17\n
// @lcpr case=end

// @lcpr case=start
// 0\n0\n
// @lcpr case=end

// @lcpr case=start
// 2\n1\n
// @lcpr case=end

 */
