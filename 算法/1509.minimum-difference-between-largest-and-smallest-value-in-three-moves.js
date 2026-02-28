/*
 * @lc app=leetcode.cn id=1509 lang=javascript
 * @lcpr version=30204
 *
 * [1509] 三次操作后最大值与最小值的最小差
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var minDifference = function (nums) {
  if (nums.length <= 4) return 0;

  /**
   * 贪心:
   *  1. 先进行排序
   *  2. 我们只有三次机会, 那么只有四种可能, 将最大值和最小值往最靠近的元素靠拢
   *      - 最小值取 0 个, 最大值取 3 个
   *      - 最小值取 1 个, 最大值取 2 个
   *      - 最小值取 2 个, 最大值取 1 个
   *      - 最小值取 3 个, 最大值取 0 个
   */
  nums.sort((a, b) => a - b);

  return Math.min(
    nums.at(-4) - nums[0],
    nums.at(-3) - nums[1],
    nums.at(-2) - nums[2],
    nums.at(-1) - nums[3]
  );
};
// @lc code=end

/*
// @lcpr case=start
// [5,3,2,4]\n
// @lcpr case=end

// @lcpr case=start
// [1,5,0,10,14]\n
// @lcpr case=end

// @lcpr case=start
// [3,100,20]\n
// @lcpr case=end

 */
