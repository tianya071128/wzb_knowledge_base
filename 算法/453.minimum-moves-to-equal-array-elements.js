/*
 * @lc app=leetcode.cn id=453 lang=javascript
 * @lcpr version=30204
 *
 * [453] 最小操作次数使数组元素相等
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * 优化: 每次操作将会使 n - 1 个元素增加 1   --> 等效于: 使一个元素减 1
 *
 *        所以只需要相加 每个元素与最小元素的差值
 * @param {number[]} nums
 * @return {number}
 */
var minMoves = function (nums) {
  /**
   * 动态规划: 首先进行排序
   *
   * demo: [1,5,6,8] --> 16
   * 
   *  [1, 5]  --> 变化 4 次 -->  [5, 5]

   *  [1, 5, 6] --> 变化 4 次后, [5, 5, 10] --> 继续变化 5 次 --> [10, 10, 10]
   *  
   *  [1, 5, 6, 8] --> 变化 9 次后 [10, 10, 10, 17] --> 继续变化 7 次 --> [17, 17, 17, 17]
   * 
   * 
   * 所以动态规划转移方程: f[i] = f[i - 1] + (v[i] - v[0])
   */
  nums.sort((a, b) => a - b);
  let dp = nums.map((item) => 0);

  for (let i = 1; i < nums.length; i++) {
    dp[i] = dp[i - 1] + (nums[i] - nums[0]);
  }

  return dp.at(-1);
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,8,10,50,25]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,1]\n
// @lcpr case=end

 */
