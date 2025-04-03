/*
 * @lc app=leetcode.cn id=300 lang=javascript
 * @lcpr version=30204
 *
 * [300] 最长递增子序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function (nums) {
  /**
   * 动态规划: 没有必要局限于一定要找出 f[i] 项所最长的, 可以规划找出以 f[i] 为结尾的最长子序列, 这样就可以在 dp 中找出找出最大的那个即为最长递增子序列
   *  https://leetcode.cn/problems/longest-increasing-subsequence/solutions/24173/zui-chang-shang-sheng-zi-xu-lie-dong-tai-gui-hua-2/
   *
   *  1. dp[i] 表示以当前项结尾的最长子序列
   *  2. dp[i] = Max(dp[0...i-1]) + 1
   *        其中 dp[0,...,i-1] 需要满足对应项的值要比 val[i] 的值要小, 这样才能组成递增子序列
   *  3. 举例: [10,9,2,5,3,7,101,18]
   *        当求 i 为 5 时, 此时值为 7 时,
   *          dp[5] = Max(dp[2], dp[3], dp[4]) + 1   ---> 因为这几项的值比 7 小, 这样才会以 7 结尾
   */
  /** 实现后续 */
  // let ans = 0;
  // // 回溯 - 找出所有解法 - 感觉会超时 - 果然超时
  // /**
  //  *
  //  * @param {number} start 开始的索引
  //  * @param {number} prev 上一个值
  //  * @param {number} len 已经递归的长度
  //  */
  // function dfs(start, prev, len) {
  //   ans = Math.max(ans, len);
  //   // 如果已经找出的最长序列比剩余长度还大的话, 没有查找的必要了
  //   if (ans >= len + (nums.length - start)) return;
  //   for (let i = start; i < nums.length; i++) {
  //     // 如果该值比前值小或等于的话, 不会递增系列, 则不处理
  //     if (nums[i] > prev) {
  //       dfs(i + 1, nums[i], len + 1);
  //     }
  //   }
  // }
  // dfs(0, -Infinity, 0);
  // return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [10,9,2,5,3,7,101,18]\n
// @lcpr case=end

// @lcpr case=start
// [0,1,0,3,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [7,7,7,7,7,7,7]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = lengthOfLIS;
// @lcpr-after-debug-end
