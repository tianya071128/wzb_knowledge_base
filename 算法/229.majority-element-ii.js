/*
 * @lc app=leetcode.cn id=229 lang=javascript
 * @lcpr version=30204
 *
 * [229] 多数元素 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var majorityElement = function (nums) {
  // 使用哈希表记录次数
  const target = Math.floor(nums.length / 3);
  const map = new Map();
  for (const n of nums) {
    map.set(n, (map.get(n) ?? 0) + 1);
  }

  return [...map].filter((item) => item[1] > target).map((item) => item[0]);
};
// @lc code=end

/*
// @lcpr case=start
// [3,2,3]\n
// @lcpr case=end

// @lcpr case=start
// [1]\n
// @lcpr case=end

// @lcpr case=start
// [1,2]\n
// @lcpr case=end

 */
