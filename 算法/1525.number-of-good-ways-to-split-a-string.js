/*
 * @lc app=leetcode.cn id=1525 lang=javascript
 * @lcpr version=30204
 *
 * [1525] 字符串的好分割数目
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var numSplits = function (s) {
  // hash 计算左右两边的个数
  let lHash = new Map(),
    rHash = new Map();

  // 先将字符全部计算到左边
  for (const item of s) {
    lHash.set(item, (lHash.get(item) ?? 0) + 1);
  }

  // 在遍历一次, 计算结果
  let ans = 0;
  for (let i = 0; i < s.length - 1; i++) {
    let item = s[i];
    lHash.set(item, lHash.get(item) - 1);
    lHash.get(item) === 0 && lHash.delete(item);
    rHash.set(item, (rHash.get(item) ?? 0) + 1);

    if (lHash.size === rHash.size) ans++;
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// "aacaba"\n
// @lcpr case=end

// @lcpr case=start
// "abcd"\n
// @lcpr case=end

// @lcpr case=start
// "aaaaa"\n
// @lcpr case=end

// @lcpr case=start
// "acbadbaada"\n
// @lcpr case=end

 */
