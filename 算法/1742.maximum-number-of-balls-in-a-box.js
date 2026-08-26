/*
 * @lc app=leetcode.cn id=1742 lang=javascript
 * @lcpr version=30204
 *
 * [1742] 盒子中小球的最大数量
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} lowLimit
 * @param {number} highLimit
 * @return {number}
 */
var countBalls = function (lowLimit, highLimit) {
  /** @type {number} 计数数组 */
  let list = new Array(50).fill(0);

  for (; lowLimit <= highLimit; lowLimit++) {
    /** @type {number} 当次总和 */
    let total = 0,
      /** @type {number} 当次数字 */
      cur = lowLimit;
    while (cur) {
      total += cur % 10;
      cur = Math.floor(cur / 10);
    }

    list[total]++;
  }

  return Math.max(...list);
};
// @lc code=end

/*
// @lcpr case=start
// 1\n10\n
// @lcpr case=end

// @lcpr case=start
// 5\n15\n
// @lcpr case=end

// @lcpr case=start
// 19\n28\n
// @lcpr case=end

 */
