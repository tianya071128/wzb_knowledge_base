/*
 * @lc app=leetcode.cn id=1002 lang=javascript
 * @lcpr version=30204
 *
 * [1002] 查找共用字符
 */

// @lcpr-template-start

// @lcpr-template-end
// @lc code=start
/**
 * @param {string[]} words
 * @return {string[]}
 */
var commonChars = function (words) {
  let hash = getCharMap(words[0]);

  function getCharMap(str) {
    let res = new Map();
    for (const s of str) {
      res.set(s, (res.get(s) ?? 0) + 1);
    }

    return res;
  }

  for (let i = 1; i < words.length; i++) {
    let cur = getCharMap(words[i]);

    for (const [s, n] of hash) {
      hash.set(s, Math.min(n, cur.get(s) ?? 0));
    }
  }

  let ans = [];
  for (const [s, n] of hash) {
    for (let i = 0; i < n; i++) {
      ans.push(s);
    }
  }

  return ans;
};
// @lc code=end

/*
// @lcpr case=start
// ["bella","label","roller"]\n
// @lcpr case=end

// @lcpr case=start
// ["cool","lock","cook"]\n
// @lcpr case=end

 */
