/*
 * @lc app=leetcode.cn id=386 lang=javascript
 * @lcpr version=30204
 *
 * [386] 字典序排数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {number} n
 * @return {number[]}
 */
var lexicalOrder = function (n) {
  let ans = [];

  function dfs(target) {
    // 剪枝: 超出范围, 退出不做处理
    if (target > n) return;

    // 添加进结果集
    ans.push(target);

    // 先 *10 尝试
    dfs(target * 10);

    // 在 +1 尝试，但如果尾数为9，则不处理
    target % 10 !== 9 && dfs(target + 1);
  }

  dfs(1);

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// 50000\n
// @lcpr case=end

// @lcpr case=start
// 2\n
// @lcpr case=end

 */
