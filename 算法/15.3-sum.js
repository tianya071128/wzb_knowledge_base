/*
 * @lc app=leetcode.cn id=15 lang=javascript
 * @lcpr version=30204
 *
 * [15] 三数之和
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  /**
   * 思路:
   *  将三数之和转变成两数之和
   */
  let n1,
    hash = {},
    hash2 = {},
    res = [],
    key = '',
    n2,
    n3;
  for (let i = 0; i < nums.length - 2; i++) {
    n1 = nums[i];
    target = -n1;
    hash = {};
    for (let j = i + 1; j < nums.length; j++) {
      n2 = nums[j];
      n3 = target - n2;
      // 命中匹配
      if (hash[target - n2]) {
        // 检测是否重复
        key = `${Math.max(n1, n2, n3)}_${Math.min(n1, n2, n3)}`;
        if (!hash2[key]) {
          res.push([n1, n2, n3]);
        }
        hash2[key] = true;
      }
      hash[n2] = true;
    }
  }

  return res;
};
// @lc code=end

/*
// @lcpr case=start
// [-1,0,1,2,-1,-4]\n
// @lcpr case=end

// @lcpr case=start
// [0,1,1]\n
// @lcpr case=end

// @lcpr case=start
// [0,0,0]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = threeSum;
// @lcpr-after-debug-end
