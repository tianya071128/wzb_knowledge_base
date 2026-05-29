/*
 * @lc app=leetcode.cn id=1403 lang=javascript
 * @lcpr version=30204
 *
 * [1403] 非递增顺序的最小子序列
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var minSubsequence = function (nums) {
  // 排序, 选取最大的元素大于 nums 的 total 一半
  nums.sort((a, b) => b - a);

  let total = 0;
  for (const n of nums) {
    total += n;
  }

  let prefix = 0,
    ans = [];
  for (const n of nums) {
    if (prefix > total / 2) break;

    ans.push(n);
    prefix += n;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [4,3,10,9,8]\n
// @lcpr case=end

// @lcpr case=start
// [4,4,7,6,7]\n
// @lcpr case=end

 */
