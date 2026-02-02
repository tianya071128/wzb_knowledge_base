/*
 * @lc app=leetcode.cn id=1386 lang=javascript
 * @lcpr version=30204
 *
 * [1386] 安排电影院座位
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number[][]} reservedSeats
 * @return {number}
 */
var maxNumberOfFamilies = function (n, reservedSeats) {
  /**
   * 假设每行都是最优解, 都放了两个
   * 之后排序reservedSeats, 查看预约的座位来排除每行的结果
   */
  let ans = n * 2,
    /** @type {Map<number, Set<number>>} */
    hash = new Map();

  for (const [n1, n2] of reservedSeats) {
    // 不会影响结果
    if (n2 === 1 || n2 === 10) continue;

    if (!hash.has(n1)) hash.set(n1, new Set());

    hash.get(n1).add(n2);
  }

  for (const s of hash.values()) {
    // 当前行允许的结果
    let cur = 0;

    // 检测 2 3 4 5 是否可以做
    if (!s.has(2) && !s.has(3) && !s.has(4) && !s.has(5)) {
      cur++;
      // 检测 6 7 8 9
      if (!s.has(6) && !s.has(7) && !s.has(8) && !s.has(9)) {
        cur++;
      }
    }
    // 检测 4 5 6 7
    else if (!s.has(4) && !s.has(5) && !s.has(6) && !s.has(7)) {
      cur++;
    }
    // 检测 6 7 8 9
    else if (!s.has(6) && !s.has(7) && !s.has(8) && !s.has(9)) {
      cur++;
    }

    ans -= 2 - cur;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 3\n[[1,2],[1,3],[1,8],[2,6],[3,1],[3,10]]\n
// @lcpr case=end

// @lcpr case=start
// 2\n[[2,1],[1,8],[2,6]]\n
// @lcpr case=end

// @lcpr case=start
// 4\n[[4,3],[1,4],[4,6],[1,7]]\n
// @lcpr case=end

 */
