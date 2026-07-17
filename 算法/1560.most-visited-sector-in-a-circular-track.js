/*
 * @lc app=leetcode.cn id=1560 lang=javascript
 * @lcpr version=30204
 *
 * [1560] 圆形赛道上经过次数最多的扇区
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number[]} rounds
 * @return {number[]}
 */
var mostVisited = function (n, rounds) {
  /** @type {number[]} */
  let ans = [];

  /** 处理从起点(当起点大于终点时, 就是 1)到终点的 */
  for (
    let i = rounds[0] > rounds.at(-1) ? 1 : rounds[0];
    i <= rounds.at(-1);
    i++
  ) {
    ans.push(i);
  }

  /** 当起点大于终点时, 还需添加起点到末尾的 */
  if (rounds[0] > rounds.at(-1)) {
    for (let i = rounds[0]; i <= n; i++) {
      ans.push(i);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 4\n[1,3,1,2]\n
// @lcpr case=end

// @lcpr case=start
// 2\n[2,1,2,1,2,1,2,1,2]\n
// @lcpr case=end

// @lcpr case=start
// 7\n[7,1,3,5,2,4]\n
// @lcpr case=end

 */
