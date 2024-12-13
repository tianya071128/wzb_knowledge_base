/*
 * @lc app=leetcode.cn id=11 lang=javascript
 * @lcpr version=30204
 *
 * [11] 盛最多水的容器
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  /**
   * 解题思路: 暴力破解, 穷举所有可能进行计算
   */
  let res = 0;
  for (let i = 0; i < height.length - 1; i++) {
    for (let j = i + 1; j < height.length; j++) {
      res = Math.max(res, (j - i) * Math.min(height[i], height[j]));
    }
  }

  return res;
};
// @lc code=end

/*
// @lcpr case=start
// [1,8,6,2,5,4,8,3,7]\n
// @lcpr case=end

// @lcpr case=start
// [1,1]\n
// @lcpr case=end

 */
