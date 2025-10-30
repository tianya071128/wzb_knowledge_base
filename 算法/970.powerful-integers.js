/*
 * @lc app=leetcode.cn id=970 lang=javascript
 * @lcpr version=30204
 *
 * [970] 强整数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} x
 * @param {number} y
 * @param {number} bound
 * @return {number[]}
 */
var powerfulIntegers = function (x, y, bound) {
  let ans = new Set(),
    xNum = 1, // x 的数
    yNum = 1; // y 的数

  while (xNum < bound) {
    yNum = 1; // 每次重置为 1
    while (xNum + yNum <= bound) {
      ans.add(xNum + yNum);

      if (y === 1) {
        break;
      } else {
        yNum *= y;
      }
    }

    if (x === 1) {
      break;
    } else {
      xNum *= x;
    }
  }

  return [...ans];
};
// @lc code=end

/*
// @lcpr case=start
// 2\n3\n1000000\n
// @lcpr case=end

// @lcpr case=start
// 3\n5\n15\n
// @lcpr case=end

 */
