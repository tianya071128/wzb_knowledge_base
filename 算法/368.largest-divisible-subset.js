/*
 * @lc app=leetcode.cn id=368 lang=javascript
 * @lcpr version=30204
 *
 * [368] 最大整除子集
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var largestDivisibleSubset = function (nums) {
  // 1. 因为不需要顺序, 所以先进行排序
  nums.sort((a, b) => a - b);

  let ans = [], // 最终结果
    cur = [], // 当次计算的结果
    isFirstOne = false; // 如果开头是 1, 那么结果最终就添加为 1, 因为不管是什么为底数, 1会满足条件

  if (nums[0] === 1) {
    isFirstOne = true;
    // 剔除开头为 1 的
    nums.shift();
  }

  /**
   * 当排好序后, 例如: [2, 4, 6, 8] --> 已将 1 剔除
   * 每次以开头元素为基准, 遍历后面的数是否满足整除基准数
   *   - 满足则添加进 cur
   *   - 不满足则继续迭代
   *
   */
  for (let i = 0; i < nums.length; i++) {
    cur = [nums[i]];
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[j] % nums[i] === 0) {
        cur.push(nums[j]);
      }
    }

    if (cur.length > ans.length) ans = cur;

    // 如果剩余长度比 ans 长度还小, 那么没有比较的意义
    if (ans.length >= nums.length - 1 - i) break;
  }

  if (isFirstOne) ans.unshift(1);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [1,2,4,8]\n
// @lcpr case=end

 */
