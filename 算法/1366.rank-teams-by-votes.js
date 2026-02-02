/*
 * @lc app=leetcode.cn id=1366 lang=javascript
 * @lcpr version=30204
 *
 * [1366] 通过投票对团队排名
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} votes
 * @return {string}
 */
var rankTeams = function (votes) {
  /**
   * 建立数据结构: ["团队", [第一的票数, 第二的票数, 第三的票数, ...]]
   */
  let ans = [],
    indexMap = new Map(); // 索引映射
  for (const vote of votes) {
    for (let i = 0; i < vote.length; i++) {
      let s = vote[i],
        j = indexMap.get(s) ?? i;

      // 初始化
      if (!indexMap.has(s)) indexMap.set(s, i);
      if (!ans[j]) ans[j] = [s, Array(vote.length).fill(0)];

      ans[j][1][i]++;
    }
  }

  return ans
    .sort((a, b) => {
      for (let i = 0; i < a[1].length; i++) {
        if (a[1][i] !== b[1][i]) return b[1][i] - a[1][i];
      }

      // 都相同的话, 按照字母顺序
      return a[0].charCodeAt() - b[0].charCodeAt();
    })
    .reduce((total, item) => total + item[0], '');
};
// @lc code=end

// @lcpr-div-debug-arg-start
// funName=rankTeams
// paramTypes= ["string[]"]
// @lcpr-div-debug-arg-end

/*
// @lcpr case=start
// ["BCA","CAB","CBA","ABC","ACB","BAC"]\n
// @lcpr case=end

// @lcpr case=start
// ["WXYZ","XYZW"]\n
// @lcpr case=end

// @lcpr case=start
// ["ZMNAGUEDSJYLBOPHRQICWFXTVK", "NAGUEDSJYLBOPHRQIZMCWFXTVK"]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = rankTeams;
// @lcpr-after-debug-end
