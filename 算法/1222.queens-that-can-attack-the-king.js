/*
 * @lc app=leetcode.cn id=1222 lang=javascript
 * @lcpr version=30204
 *
 * [1222] 可以攻击国王的皇后
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} queens
 * @param {number[]} king
 * @return {number[][]}
 */
var queensAttacktheKing = function (queens, king) {
  /**
   * 黑皇后和一个白国王
   *  - 黑皇后可以直线和走斜线
   *
   * 从国王的位置可以倒推其结果
   */
  let ans = [],
    hash = new Set(),
    position = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, -1],
      [-1, 1],
    ];

  // 先使用哈希表存储皇后的位置
  for (const queen of queens) {
    hash.add(queen.join());
  }

  // 从国王的位置可以倒推
  for (const [diffX, diffY] of position) {
    for (let i = 1; i <= 7; i++) {
      let x = diffX * i + king[0],
        y = diffY * i + king[1];

      if (x < 0 || x > 7 || y < 0 || y > 7) break;

      if (hash.has(`${x},${y}`)) {
        ans.push([x, y]);
        break;
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[0,1],[1,0],[4,0],[0,4],[3,3],[2,4],[5,4]]\n[0,0]\n
// @lcpr case=end

// @lcpr case=start
// [[0,0],[1,1],[2,2],[3,4],[3,5],[4,4],[4,5]]\n[3,3]\n
// @lcpr case=end

 */
