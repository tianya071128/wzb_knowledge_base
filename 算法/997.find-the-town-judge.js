/*
 * @lc app=leetcode.cn id=997 lang=javascript
 * @lcpr version=30204
 *
 * [997] 找到小镇的法官
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @param {number[][]} trust
 * @return {number}
 */
var findJudge = function (n, trust) {
  if (n === 1) return 1;

  let sides = new Array(n + 1).fill(0).map((item) => []), // 信任的人
    hash = new Set(); // 存在信任别人的人
  for (const [n1, n2] of trust) {
    sides[n2].push(n1);
    hash.add(n1);
  }

  let ans = -1;
  for (let i = 0; i < sides.length; i++) {
    if (sides[i].length === n - 1 && !hash.has(i)) {
      if (ans !== -1) {
        // 重复的
        return false;
      } else {
        ans = i;
      }
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 4\n[[1,3],[1,4],[2,3],[2,4],[4,3]]\n
// @lcpr case=end

// @lcpr case=start
// 3\n[[1,3],[2,3]]\n
// @lcpr case=end

// @lcpr case=start
// 3\n[[1,3],[2,3],[3,1]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = findJudge;
// @lcpr-after-debug-end
