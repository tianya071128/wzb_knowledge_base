/*
 * @lc app=leetcode.cn id=985 lang=javascript
 * @lcpr version=30204
 *
 * [985] 查询后的偶数和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number[][]} queries
 * @return {number[]}
 */
var sumEvenAfterQueries = function (nums, queries) {
  /**
   * 1. 先计算出所有的偶数和
   * 2. 然后在查询 queries 时
   *    2.1 如果查询索引之前的值对应的是偶数, 则将偶数和先去除这个值
   *    2.2 得出查询之后的值, 如果是偶数, 那么就增加到偶数和中
   */
  let ans = [],
    sum = 0;
  for (const n of nums) {
    if (n % 2 === 0) sum += n;
  }

  for (const [val, i] of queries) {
    if (nums[i] % 2 === 0) sum -= nums[i];

    nums[i] += val;

    if (nums[i] % 2 === 0) sum += nums[i];

    ans.push(sum);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4]\n[[1,0],[-3,1],[-4,0],[2,3]]\n
// @lcpr case=end

 */
