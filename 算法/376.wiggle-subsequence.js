/*
 * @lc app=leetcode.cn id=376 lang=javascript
 * @lcpr version=30204
 *
 * [376] 摆动序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var wiggleMaxLength = function (nums) {
  /**
   * 动态规划
   *  1. 每项作为最后一项时
   *     1.1 最后一项为倒序: 当前值比上一个值要小
   *     1.2 最后一项为正序: 当前值比大一个值要大
   *  2. 当要求得某一项时, 那么倒序遍历一次尝试即可
   */

  // 1. 初始 dp 表: 每个元素存储着当前项做为子序列最后一项时 --> 正序和倒序的最大长度
  const dp = Array(nums.length)
    .fill(1)
    .map((item) => [1, 1]);

  for (let i = 1; i < nums.length; i++) {
    let n1 = nums[i];
    let max = 1; // 最后一个作为正序时的最大长度
    let max2 = 1; // 最后一个作为倒序时的最大长度
    for (let j = i - 1; j >= 0; j--) {
      let n2 = nums[j];
      // 如果 n1 比 n2 要大, 则为正序值
      if (n1 > n2) {
        max = Math.max(max, dp[j][1] + 1);
      }
      // 此时为倒序值
      else if (n1 < n2) {
        max2 = Math.max(max2, dp[j][0] + 1);
      }
    }
    dp[i][0] = max;
    dp[i][1] = max2;
  }

  return Math.max(...dp.flat());
};
// @lc code=end

/*
// @lcpr case=start
// [1,7,4,9,2,5]\n
// @lcpr case=end

// @lcpr case=start
// [1,17,5,10,13,15,10,5,16,8]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3,4,5,6,7,8,9]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = wiggleMaxLength;
// @lcpr-after-debug-end
