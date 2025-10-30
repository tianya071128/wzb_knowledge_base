/*
 * @lc app=leetcode.cn id=974 lang=javascript
 * @lcpr version=30204
 *
 * [974] 和可被 K 整除的子数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraysDivByK = function (nums, k) {
  // 前缀和
  let prefixSum = [],
    ans = 0;
  for (const n of nums) {
    prefixSum.push(n + (prefixSum.at(-1) ?? 0));
  }

  for (let i = 0; i < nums.length; i++) {
    let preSum = prefixSum[i - 1] ?? 0;
    for (let j = i; j < nums.length; j++) {
      // 当前区间和
      if ((prefixSum[j] - preSum) % k === 0) ans++;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [4,5,0,-2,-3,1,4,5,0,-2,-3,1,4,5,0,-2,-3,1,4,5,0,-2,-3,14,5,0,-2,-3,1,4,5,0,-2,-3,1,4,5,0,-2,-3,1,4,5,0,-2,-3,1,4,5,0,-2,-3,1,4,5,0,-2,-3,1,4,5,0,-2,-3,1,4,5,0,-2,-3,1,4,5,0,-2,-3,1,4,5,0,-2,-3,1,4,5,0,-2,-3,1,4,5,0,-2,-3,1,4,5,0,-2,-3,1,4,5,0,-2,-3,1,4,5,0,-2,-3,1,4,5,0,-2,-3,1]\n5\n
// @lcpr case=end

// @lcpr case=start
// [5]\n9\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = subarraysDivByK;
// @lcpr-after-debug-end
