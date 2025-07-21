/*
 * @lc app=leetcode.cn id=721 lang=javascript
 * @lcpr version=30204
 *
 * [721] 账户合并
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[][]} accounts
 * @return {string[][]}
 */
var accountsMerge = function (accounts) {
  /**
   * 1. 使用 map 存储邮箱对应的索引
   * 2. 之后遍历 accounts 在 map 中找到对应的邮箱列表并执行合并
   */
  const map = new Map();
  for (let i = 0; i < accounts.length; i++) {
    for (let j = 1; j < accounts[i].length; j++) {
      const email = accounts[i][j];
      map.set(email, [...(map.get(email) ?? []), i]);
    }
  }

  // 遍历 accounts 在 map 中找到对应的邮箱列表并执行合并
  let ans = [],
    hash = new Set(); // 已处理的索引
  for (let i = 0; i < accounts.length; i++) {
    if (hash.has(i)) continue;

    hash.add(i);

    let account = accounts[i][0], // 账户
      queue = accounts[i].slice(1), // 待处理的邮箱列表
      emails = new Set(), // 当前账户对应邮箱列表
      curEmail; // 当前处理的邮箱列表

    while ((curEmail = queue.shift())) {
      // 不存在的话, 那么就需要处理一下
      if (!emails.has(curEmail)) {
        emails.add(curEmail);

        // 该邮箱对应的账户
        const list = map.get(curEmail) ?? [];
        for (const emailIndex of list) {
          // 没有处理过的
          if (!hash.has(emailIndex)) {
            hash.add(emailIndex);

            queue.push(...accounts[emailIndex].slice(1));
          }
        }
      }
    }

    ans.push([account, ...[...emails.values()].sort()]);
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// [["John", "johnsmith@mail.com", "john00@mail.com"], ["John", "johnnybravo@mail.com"], ["John","johnsmith@mail.com", "john_newyork@mail.com"], ["Mary", "mary@mail.com"]]\n
// @lcpr case=end

// @lcpr case=start
// [["Gabe","Gabe0@m.co","Gabe3@m.co","Gabe1@m.co"],["Kevin","Kevin3@m.co","Kevin5@m.co","Kevin0@m.co"],["Ethan","Ethan5@m.co","Ethan4@m.co","Ethan0@m.co"],["Hanzo","Hanzo3@m.co","Hanzo1@m.co","Hanzo0@m.co"],["Fern","Fern5@m.co","Fern1@m.co","Fern0@m.co"]]\n
// @lcpr case=end

 */

// @lcpr-after-debug-begin
module.exports = accountsMerge;
// @lcpr-after-debug-end
