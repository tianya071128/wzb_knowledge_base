/*
 * @lc app=leetcode.cn id=74 lang=typescript
 * @lcpr version=30204
 *
 * [74] 搜索二维矩阵
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function searchMatrix(matrix: number[][], target: number): boolean {
  // 1. 先找出 target 在哪一行中
  let arr: number[] | undefined,
    len = matrix[0].length;

  for (const item of matrix) {
    if (item[0] <= target && item[len - 1] >= target) {
      arr = item;
      break;
    }
  }

  if (!arr) return false;
  // 二分查找
  let left = 0,
    right = len - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const n = arr[mid];
    if (n === target) {
      return true;
    } else if (n > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return false;
}
// @lc code=end

/*
// @lcpr case=start
// [[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n3\n
// @lcpr case=end

// @lcpr case=start
// [[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n13\n
// @lcpr case=end

 */
