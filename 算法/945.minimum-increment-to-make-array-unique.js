/*
 * @lc app=leetcode.cn id=945 lang=javascript
 * @lcpr version=30204
 *
 * [945] 使数组唯一的最小增量
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var minIncrementForUnique = function (nums) {
  // 1. 先排序
  nums.sort((a, b) => a - b);

  // 2. 记录下之前最小值
  let min = -Infinity,
    ans = 0;
  for (const n of nums) {
    // 无需变动
    if (n > min) {
      min = n;
    } else {
      ans += min - n + 1;
      min++;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,2]\n
// @lcpr case=end

// @lcpr case=start
// [3,2,1,2,1,7]\n
// @lcpr case=end

 */
