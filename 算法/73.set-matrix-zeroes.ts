/*
 * @lc app=leetcode.cn id=73 lang=typescript
 * @lcpr version=30204
 *
 * [73] 矩阵置零
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 Do not return anything, modify matrix in-place instead.
 */
function setZeroes(matrix: number[][]): void {
  // 1. 先遍历所有元素
  // 2. 记录下需要设为0的行和列
  // 3. 遍历记录的行和列, 置为0

  const row = new Set<number>();
  const arrange = new Set<number>();
  for (let i = 0; i < matrix.length; i++) {
    const arr = matrix[i];
    for (let j = 0; j < arr.length; j++) {
      const item = arr[j];
      if (item === 0) {
        row.add(i);
        arrange.add(j);
      }
    }
  }

  // 遍历记录的行和列, 置为0
  for (let i = 0; i < matrix.length; i++) {
    const arr = matrix[i];
    for (let j = 0; j < arr.length; j++) {
      if (row.has(i) || arrange.has(j)) {
        arr[j] = 0;
      }
    }
  }
}
// @lc code=end

/*
// @lcpr case=start
// [[1,1,1],[1,0,1],[1,1,1]]\n
// @lcpr case=end

// @lcpr case=start
// [[0,1,2,0],[3,4,5,2],[1,3,1,5]]\n
// @lcpr case=end

 */
