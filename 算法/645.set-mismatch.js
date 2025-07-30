/*
 * @lc app=leetcode.cn id=645 lang=javascript
 * @lcpr version=30204
 *
 * [645] 错误的集合
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findErrorNums = function (nums) {
  /**
   * 使用数组标识
   */
  let list = new Array(nums.length).fill(0);

  for (const n of nums) {
    list[n - 1]++;
  }

  let repeat, lack;
  for (let i = 0; i < list.length; i++) {
    // 重复值
    if (list[i] > 1) {
      repeat = i + 1;
    }
    // 缺失值
    if (list[i] === 0) {
      lack = i + 1;
    }
  }

  return [repeat, lack];
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,2,4]\n
// @lcpr case=end

// @lcpr case=start
// [1,1,2,4]\n
// @lcpr case=end

 */
