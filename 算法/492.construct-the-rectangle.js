/*
 * @lc app=leetcode.cn id=492 lang=javascript
 * @lcpr version=30204
 *
 * [492] 构造矩形
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} area
 * @return {number[]}
 */
var constructRectangle = function (area) {
  // 最接近的就是平分根的数, 越靠近两者差值越小
  let sqrt = Math.floor(Math.sqrt(area));
  while (sqrt >= 0) {
    if (area % sqrt === 0) return [area / sqrt, sqrt];

    sqrt--;
  }
};
// @lc code=end

/*
// @lcpr case=start
// 10000000\n
// @lcpr case=end

// @lcpr case=start
// 37\n
// @lcpr case=end

// @lcpr case=start
// 122122\n
// @lcpr case=end

 */
