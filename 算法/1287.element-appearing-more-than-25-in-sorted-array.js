/*
 * @lc app=leetcode.cn id=1287 lang=javascript
 * @lcpr version=30204
 *
 * [1287] 有序数组中出现次数超过25%的元素
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} arr
 * @return {number}
 */
var findSpecialInteger = function (arr) {
  /**
   * - 创建一个 arr.length / 4 大小的窗口, 检测窗口的首尾元素是否相同
   * - 如果不同, 则移动窗口
   */
  let n = Math.floor(arr.length / 4 + 1);
  for (let i = 0; i < arr.length - n + 1; i++) {
    if (arr[i] === arr[i + n - 1]) return arr[i];
  }
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,3]\n
// @lcpr case=end

 */
