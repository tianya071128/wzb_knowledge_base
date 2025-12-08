/*
 * @lc app=leetcode.cn id=1128 lang=javascript
 * @lcpr version=30204
 *
 * [1128] 等价多米诺骨牌对的数量
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number[][]} dominoes
 * @return {number}
 */
var numEquivDominoPairs = function (dominoes) {
  /** @type {Map<string, number>} */
  let hash = new Map();

  for (const [a, b] of dominoes) {
    let key = `${Math.min(a, b)},${Math.max(a, b)}`;

    hash.set(key, (hash.get(key) ?? 0) + 1);
  }

  let ans = 0;
  for (const n of hash.values()) {
    if (n > 1) {
      ans += (n * (n - 1)) / 2;
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [[1,2],[2,1],[3,4],[5,6]]\n
// @lcpr case=end

// @lcpr case=start
// [[1,2],[1,2],[1,1],[1,2],[2,2]]\n
// @lcpr case=end

 */
