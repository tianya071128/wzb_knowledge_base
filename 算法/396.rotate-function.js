/*
 * @lc app=leetcode.cn id=396 lang=javascript
 * @lcpr version=30204
 *
 * [396] 旋转函数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxRotateFunction = function (nums) {
  /**
   * 动态规划:
   *  - 归纳总结
   *
   *    F(0) = 0*A[0]+1*A[1]+2*A[2]+3*A[3]
   *    F(1) = 0*A[3]+1*A[0]+2*A[1]+3*A[2]
   *    F(2) = 0*A[2]+1*A[3]+2*A[0]+3*A[1]
   *    F(3) = 0*A[1]+1*A[2]+2*A[3]+3*A[0]
   *
   *    F(1)-F(0) = A[0]+A[1]+A[2]-3*A[3]
   *    F(2)-F(1) = A[0]+A[1]+A[3]-3*A[2]
   *    F(3)-F(2) = A[0]+A[2]+A[3]-3*A[1]
   */
  /**
   * 暴力算法: 超时
   */
  // let ans = [];
  // for (let i = 0; i < nums.length; i++) {
  //   ans.push(nums.reduce((total, item, index) => total + item * index, 0));
  //   // 原地旋转
  //   nums.unshift(nums.pop());
  // }
  // return Math.max(...ans);
};
// @lc code=end

/*
// @lcpr case=start
// [4,3,2,6,5]\n
// @lcpr case=end

// @lcpr case=start
// [100]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = maxRotateFunction;
// @lcpr-after-debug-end
