/*
 * @lc app=leetcode.cn id=811 lang=javascript
 * @lcpr version=30204
 *
 * [811] 子域名访问计数
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} cpdomains
 * @return {string[]}
 */
var subdomainVisits = function (cpdomains) {
  let ans = new Map();

  for (const item of cpdomains) {
    const list = item.split(' '), // 以空格分隔
      n = Number(list[0]), // 次数
      domain = list[1].split('.'); // 域名

    let prev = '';
    for (let i = domain.length - 1; i >= 0; i--) {
      const curDomain = `${domain[i]}${prev}`;

      // 添加进 hash 中
      ans.set(curDomain, (ans.get(curDomain) ?? 0) + n);
      prev = `.${curDomain}`;
    }
  }

  return [...ans.entries()].map((item) => `${item[1]} ${item[0]}`);
};
// @lc code=end

/*
// @lcpr case=start
// ["9001 discuss.leetcode.com"]\n
// @lcpr case=end

// @lcpr case=start
// ["900 google.mail.com", "50 yahoo.com", "1 intel.mail.com", "5 wiki.org"]\n
// @lcpr case=end

 */
