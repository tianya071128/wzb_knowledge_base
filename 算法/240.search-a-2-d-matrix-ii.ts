/*
 * @lc app=leetcode.cn id=240 lang=typescript
 * @lcpr version=30204
 *
 * [240] 搜索二维矩阵 II
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
function searchMatrix(matrix: number[][], target: number): boolean {
  // 分治法
  // 递归将一个矩阵拆分为四个矩阵, 比较 target 是否在矩阵的左上角元素和右下角元素之间, 不在的话不处理该矩阵

  let res = false;

  function recursion(matrix: number[][]) {
    // 比较目标值是否在矩阵中
    let m = matrix.length,
      n = matrix[0]?.length,
      min = matrix[0]?.[0],
      max = matrix[m - 1]?.[n - 1];
    if (min === target || max === target) {
      res = true;
      return;
    }
    if (m <= 0 || n <= 0 || target < min || target > max) return;

    let rowMid = Math.floor(matrix.length / 2),
      columnMid = Math.floor(matrix[0].length / 2);

    // 拆分矩阵
    let list = [
      matrix.slice(0, rowMid).map((item) => item.slice(0, columnMid)),
      matrix.slice(0, rowMid).map((item) => item.slice(columnMid, n)),
      matrix.slice(rowMid, m).map((item) => item.slice(0, columnMid)),
      matrix.slice(rowMid, m).map((item) => item.slice(columnMid, n)),
    ];
    for (const item of list) {
      if (res) return;
      recursion(item);
    }
  }

  recursion(matrix);

  return res;
}
// @lc code=end

/*
// @lcpr case=start
// [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]]\n35\n
// @lcpr case=end

// @lcpr case=start
// [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]]\n20\n
// @lcpr case=end

 */
