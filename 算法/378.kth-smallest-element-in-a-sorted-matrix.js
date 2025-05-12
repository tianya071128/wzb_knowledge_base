/*
 * @lc app=leetcode.cn id=378 lang=javascript
 * @lcpr version=30204
 *
 * [378] 有序矩阵中第 K 小的元素
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function (matrix, k) {
  /**
   * 每一行都建立一个指针
   */
  let len = matrix.length,
    min = Infinity,
    minIndex = 0;
  let pointers = new Array(len).fill(0);
  for (let i = 0; i < k; i++) {
    min = Infinity;
    minIndex = 0;
    // 找到最小值以及索引
    for (let j = 0; j < len; j++) {
      if (pointers[j] < len && matrix[j][pointers[j]] < min) {
        minIndex = j;
        min = matrix[j][pointers[j]];
      }
    }

    // 最小值的行数指针右移
    pointers[minIndex]++;
  }

  return min;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,5,9],[10,11,13],[12,13,15]]\n8\n
// @lcpr case=end

// @lcpr case=start
// [[-5]]\n1\n
// @lcpr case=end

 */
