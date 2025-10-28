/*
 * @lc app=leetcode.cn id=957 lang=javascript
 * @lcpr version=30204
 *
 * [957] N 天后的牢房
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[]} cells
 * @param {number} n
 * @return {number[]}
 */
var prisonAfterNDays = function (cells, n) {
  /**
   * 使用 hash 记录下每次的操作, 当会遇到重复队列时, 表示一个周期
   */
  let cycle = [cells.join()];
  for (let i = 1; i <= n; i++) {
    let cur = Array(8).fill(0);
    for (let j = 1; j < cells.length - 1; j++) {
      cur[j] = cells[j + 1] === cells[j - 1] ? 1 : 0;
    }
    cells = cur;

    let key = cells.join(),
      cycleIndex = cycle.indexOf(key);
    // 如果遇到周期性的
    if (cycle.includes(key)) {
      cells = cycle[
        ((n - cycleIndex) % (cycle.length - cycleIndex)) + cycleIndex
      ]
        .split(',')
        .map((item) => Number(item));
      break;
    } else {
      cycle.push(key);
    }
  }

  return cells;
};
// @lc code=end

/*
// @lcpr case=start
// [0,0,1,1,1,1,0,0]\n16\n
// @lcpr case=end

// @lcpr case=start
// [1,1,0,1,0,1,1,0]\n1000000000\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = prisonAfterNDays;
// @lcpr-after-debug-end
