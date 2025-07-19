/*
 * @lc app=leetcode.cn id=646 lang=javascript
 * @lcpr version=30204
 *
 * [646] 最长数对链
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} pairs
 * @return {number}
 */
var findLongestChain = function (pairs) {
  /**
   * 贪心:
   *  1 15  ->  10 14
   *
   *  观察如上两个数对而得, 当存在这两个重叠时, 那我们保留的肯定是右边界更小的值, 这样能容纳的数对会更多
   */
  pairs.sort((a, b) => a[0] - b[0]);

  let ans = 1,
    right = pairs[0][1];
  for (let i = 1; i < pairs.length; i++) {
    // 重叠, 取有边界更小的值
    if (pairs[i][0] <= right) {
      right = Math.min(right, pairs[i][1]);
    } else {
      ans++;
      right = pairs[i][1];
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2], [2,3], [3,4]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,2],[7,8],[4,5]]\n
// @lcpr case=end

 */
