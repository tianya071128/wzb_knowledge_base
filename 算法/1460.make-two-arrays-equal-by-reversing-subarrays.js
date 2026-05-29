/*
 * @lc app=leetcode.cn id=1460 lang=javascript
 * @lcpr version=30204
 *
 * [1460] 通过翻转子数组使两个数组相等
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} target
 * @param {number[]} arr
 * @return {boolean}
 */
var canBeEqual = function (target, arr) {
  // 只要两个数组的元素一致, 就可以变得相同, 跟冒泡排序一样, 二个元素之间交换可以让元素交换到任一位置
  let list = Array(1001).fill(0);

  for (const n of target) {
    list[n]++;
  }

  for (const n of arr) {
    if (list[n]-- <= 0) return false;
  }

  return true;
};
// @lc code=end

/*
// @lcpr case=start
// [1,2,3,4]\n[2,4,1,3]\n
// @lcpr case=end

// @lcpr case=start
// [7]\n[7]\n
// @lcpr case=end

// @lcpr case=start
// [3,7,9]\n[3,7,11]\n
// @lcpr case=end

 */
