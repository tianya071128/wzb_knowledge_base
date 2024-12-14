/*
 * @lc app=leetcode.cn id=1 lang=javascript
 * @lcpr version=30204
 *
 * [1] 两数之和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  // for (let i = 0; i < nums.length; i++) {
  //   const n1 = nums[i];
  //   for (let j = i + 1; j < nums.length; j++) {
  //     const n2 = nums[j];

  //     if (n1 + n2 === target) return [i, j];
  //   }
  // }

  // 使用哈希表
  const hash = new Map();
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    const n2 = target - n;
    if (hash.has(n2)) {
      return [hash.get(n2), i];
    } else {
      hash.set(n, i);
    }
  }
};
// @lc code=end

/*
// @lcpr case=start
// [2,7,11,15]\n9\n
// @lcpr case=end

// @lcpr case=start
// [3,2,4]\n6\n
// @lcpr case=end

// @lcpr case=start
// [3,3]\n6\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = twoSum;
// @lcpr-after-debug-end
