/*
 * @lc app=leetcode.cn id=1005 lang=javascript
 * @lcpr version=30204
 *
 * [1005] K 次取反后最大化的数组和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var largestSumAfterKNegations = function (nums, k) {
  /**
   * - 排序
   * - 尽可能的将比较大的负数进行取反
   * - 如果还有次数多
   *    - 剩余 k 是偶数, 那么无关紧要
   *    - 剩余 k 是奇数, 那么将第一个正数取反
   */
  nums.sort((a, b) => a - b);

  let ans = 0;
  for (let i = 0; i < nums.length; i++) {
    let n = nums[i];
    if (k > 0) {
      // 如果当前数 >= 0 的话
      if (n >= 0) {
        ans += n * (k % 2 === 0 ? 1 : -1);
        k = 0;
      } else {
        ans -= n;
        k--;

        // 如果当前是最后一个数或者下一个数为正数, 并且 k 为奇数的话, 那么当前数就不能进行取反
        if (
          k % 2 === 1 &&
          (i === nums.length - 1 ||
            (nums[i + 1] >= 0 && nums[i + 1] > Math.abs(n)))
        ) {
          // 总言之: 保下一个数而舍弃当前数
          ans += n * 2;
          k = 0;
        }
      }
    } else {
      ans += n;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [-2,9,9,8,4]\n5\n
// @lcpr case=end

// @lcpr case=start
// [-100,-100,-100]\n4\n
// @lcpr case=end

// @lcpr case=start
// [-8,3,-5,-3,-5,-2]\n6\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = largestSumAfterKNegations;
// @lcpr-after-debug-end
