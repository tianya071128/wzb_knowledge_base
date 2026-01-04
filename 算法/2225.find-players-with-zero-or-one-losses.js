/*
 * @lc app=leetcode.cn id=2225 lang=javascript
 * @lcpr version=30204
 *
 * [2225] 找出输掉零场或一场比赛的玩家
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} matches
 * @return {number[][]}
 */
var findWinners = function (matches) {
  let hash = new Map(),
    ans = [[], []];

  for (const [x, y] of matches) {
    hash.set(x, hash.get(x) || 0);
    hash.set(y, (hash.get(y) || 0) + 1);
  }

  for (const [player, n] of hash) {
    if (n === 0) ans[0].push(player);
    if (n === 1) ans[1].push(player);
  }

  return [ans[0].sort((a, b) => a - b), ans[1].sort((a, b) => a - b)];
};
// @lc code=end

/*
// @lcpr case=start
// [[1,3],[2,3],[3,6],[5,6],[5,7],[4,5],[4,8],[4,9],[10,4],[10,9]]\n
// @lcpr case=end

// @lcpr case=start
// [[2,3],[1,3],[5,4],[6,4]]\n
// @lcpr case=end

 */
