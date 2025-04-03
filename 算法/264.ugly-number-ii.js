/*
 * @lc app=leetcode.cn id=264 lang=javascript
 * @lcpr version=30204
 *
 * [264] 丑数 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var nthUglyNumber = function (n) {
  let cur2 = (cur3 = cur5 = 1),
    next2 = 2,
    next3 = 3,
    next5 = 5;
  while (n > 1) {
    // 找出 2、3、5 中下一个最小的
    if (next2 <= next3 && next2 <= next5) {
      cur2 = next2;
      next2 *= 2;
    } else if (next3 <= next2 && next3 <= next5) {
      cur3 = next3;
      next3 *= 3;
    } else {
      cur5 = next5;
      next5 *= 5;
    }
    n--;
  }
  return cur2 * cur3 * cur5;
};
// @lc code=end

/*
// @lcpr case=start
// 15\n
// @lcpr case=end

// @lcpr case=start
// 1\n
// @lcpr case=end

 */
