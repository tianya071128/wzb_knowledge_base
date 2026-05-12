/*
 * @lc app=leetcode.cn id=330 lang=javascript
 * @lcpr version=30204
 *
 * [330] 按要求补齐数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} n
 * @return {number}
 */
var minPatches = function (nums, n) {
  /** 先计算 nums 中所有的数字之和 */
  let hash = new Set(),
    helper = (n) => {
      for (const item of [...hash.values()]) {
        hash.add(item + n);
      }
      hash.add(n);
    };

  for (const n of nums) {
    helper(n);
  }

  /** 遍历 1 - n, 如果在已有和不存在的话, 那么就添加当前数字进去 */
  let ans = 0;
  for (let i = 1; i <= n; i++) {
    if (!hash.has(i)) {
      ans++;
      helper(i);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,3]\n6\n
// @lcpr case=end

// @lcpr case=start
// [1,5,10]\n20\n
// @lcpr case=end

// @lcpr case=start
// [1,2,2]\n5\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = minPatches;
// @lcpr-after-debug-end
