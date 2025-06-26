/*
 * @lc app=leetcode.cn id=560 lang=javascript
 * @lcpr version=30204
 *
 * [560] 和为 K 的子数组
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function (nums, k) {
  /**
   * 1. 迭代过程中记录之前的前缀和
   * 2. 当迭代到哪一项时, sum(之前前缀和) = 前缀和 - k
   */

  let ans = 0,
    sum = 0,
    map = new Map([[0, 1]]);
  for (const n of nums) {
    sum += n;
    ans += map.get(sum - k) ?? 0;

    // 添加到结果
    map.set(sum, (map.get(sum) ?? 0) + 1);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,1,1]\n1\n
// @lcpr case=end

// @lcpr case=start
// [1,2,3]\n3\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = subarraySum;
// @lcpr-after-debug-end
