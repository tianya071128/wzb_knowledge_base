/*
 * @lc app=leetcode.cn id=1558 lang=javascript
 * @lcpr version=30204
 *
 * [1558] 得到目标数组的最少函数调用次数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var minOperations = function (nums) {
  // 题目中的函数的作用
  //  - 指定元素加 1
  //  - 全部元素 * 2

  // 每个元素都需要先变成 1, 在对于 nums 的元素每次除以 2
  //  - 当不能整除时, 向下取值, 并且结果直接加1
  //  - 当结果为1时, 结果直接加1
  //  - 计算出除以 2 最多的次数, 遍历所有的元素后, 需要加上该次数
  let max = 0,
    ans = 0;

  for (const n of nums) {
    let cur = 0,
      item = n;

    if (item === 0) continue;

    while (item > 1) {
      if (item % 2 === 1) ans++;

      cur++;
      item = Math.floor(item / 2);
    }

    // 元素需要变成 1
    ans++;

    max = Math.max(max, cur);
  }

  return ans + max;
};
// @lc code=end

/*
// @lcpr case=start
// [1,5]\n
// @lcpr case=end

// @lcpr case=start
// [2,2]\n
// @lcpr case=end

// @lcpr case=start
// [4,2,5]\n
// @lcpr case=end

// @lcpr case=start
// [3,2,2,4]\n
// @lcpr case=end

// @lcpr case=start
// [2,4,8,16]\n
// @lcpr case=end

 */
