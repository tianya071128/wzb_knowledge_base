/*
 * @lc app=leetcode.cn id=1191 lang=javascript
 * @lcpr version=30204
 *
 * [1191] K 次串联后最大子数组之和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number}
 */
var kConcatenationMaxSum = function (arr, k) {
  /**
   * 动态规划
   *  - 如果整个 arr 的和是一个正数, 那么 k - 2 中间的值可以直接组装成一个数 (k - 2) * Sum(arr)  --> 是正数, 对于结果是增益的
   *  - 如果不是的话, 那么就动态规划 arr * 2
   */
  let ans = 0,
    prev = 0, // 以前一个值为结尾的最大值
    sum = 0,
    M = 10 ** 9 + 7;

  for (const n of arr) {
    prev = Math.max(prev + n, n, 0);
    ans = Math.max(ans, prev);
    sum += n;
  }

  if (sum > 0 && k > 2) {
    let n = ((k - 2) * sum) % M;
    prev = Math.max(prev + n, n, 0);
    ans = Math.max(ans, prev);
  }

  // 在拼接最后一个
  if (k > 1) {
    for (const n of arr) {
      prev = Math.max(prev + n, n, 0);
      ans = Math.max(ans, prev);
    }
  }

  return ans % M;
};
// @lc code=end

/*
// @lcpr case=start
// [10000,10000,10000,10000,10000,10000,10000,10000,10000,10000]\n100000\n
// @lcpr case=end

// @lcpr case=start
// [1,-2,1]\n5\n
// @lcpr case=end

// @lcpr case=start
// [-1,-2]\n7\n
// @lcpr case=end

 */
