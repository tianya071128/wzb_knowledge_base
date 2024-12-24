/*
 * @lc app=leetcode.cn id=54 lang=javascript
 * @lcpr version=30204
 *
 * [54] 螺旋矩阵
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function (matrix) {
  const res = [],
    len = matrix.length,
    horizontalLen = matrix[0].length;
  // 笨方法: 沿着轨道迭代

  // 外层是横轴
  for (let i = 0; i < len; i++) {
    // 追加进入的项
    let item = [...matrix[i % 2 === 0 ? i / 2 : len - 1 - Math.floor(i / 2)]];

    if (!item.length) break;

    // 是否翻转
    if (i % 2 === 1) item.reverse();

    res.push(...item);

    // 内层迭代为纵轴
    for (
      let j = Math.floor(i / 2) + 1;
      j < len - (Math.floor(i / 2) + 1);
      j++
    ) {
      const horizontalItem = matrix[i % 2 === 0 ? j : len - 1 - j];

      if (!horizontalItem?.length) break;

      res.push(i % 2 === 0 ? horizontalItem.pop() : horizontalItem.shift());
    }
  }

  return res;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2,3],[4,5,6],[7,8,9]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,2,3,4],[5,6,7,8],[9,10,11,12]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = spiralOrder;
// @lcpr-after-debug-end
